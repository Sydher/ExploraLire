package fr.sydher.edu.exploralire.ds;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import fr.sydher.edu.exploralire.dto.ImportValidationErrorDTO;
import fr.sydher.edu.exploralire.dto.SiteExportDTO;
import fr.sydher.edu.exploralire.dto.SiteImportResultDTO;
import fr.sydher.edu.exploralire.entity.Label;
import fr.sydher.edu.exploralire.entity.Page;
import fr.sydher.edu.exploralire.entity.Site;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@ApplicationScoped
public class SiteExportDS {

    private static final String CURRENT_FORMAT_VERSION = "1.0";
    private static final String APPLICATION_NAME = "ExploraLire";
    private static final DateTimeFormatter DATE_SUFFIX_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Inject
    ContentSanitizerDS contentSanitizerDS;

    @Inject
    ImageDS imageDS;

    @Transactional
    public SiteExportDTO exportSite(Site site) {
        List<String> labelNames = site.labels.stream()
                .map(label -> label.name)
                .toList();

        List<Page> pages = Page.find("site", site).list();
        List<SiteExportDTO.PageData> pageDataList = pages.stream()
                .map(this::convertPageToData)
                .toList();

        SiteExportDTO.SiteData siteData = new SiteExportDTO.SiteData(
                site.name,
                site.secretCode,
                labelNames,
                pageDataList
        );

        return new SiteExportDTO(
                CURRENT_FORMAT_VERSION,
                Instant.now(),
                APPLICATION_NAME,
                siteData
        );
    }

    private SiteExportDTO.PageData convertPageToData(Page page) {
        Object content = null;
        if (page.content != null && !page.content.isBlank()) {
            try {
                content = objectMapper.readValue(page.content, Object.class);
            } catch (JsonProcessingException e) {
                content = page.content;
            }
        }
        return new SiteExportDTO.PageData(page.name, content);
    }

    public List<ImportValidationErrorDTO> validateImport(SiteExportDTO importData) {
        List<ImportValidationErrorDTO> errors = new ArrayList<>();

        if (importData == null) {
            errors.add(new ImportValidationErrorDTO("root", "Le fichier d'import est vide ou invalide"));
            return errors;
        }

        if (importData.formatVersion == null || importData.formatVersion.isBlank()) {
            errors.add(new ImportValidationErrorDTO("formatVersion", "La version du format est requise"));
        }

        if (importData.site == null) {
            errors.add(new ImportValidationErrorDTO("site", "Les données du site sont requises"));
            return errors;
        }

        if (importData.site.name == null || importData.site.name.isBlank()) {
            errors.add(new ImportValidationErrorDTO("site.name", "Le nom du site est requis"));
        }

        return errors;
    }

    @Transactional
    public SiteImportResultDTO importSite(SiteExportDTO importData) {
        List<ImportValidationErrorDTO> errors = validateImport(importData);
        if (!errors.isEmpty()) {
            return SiteImportResultDTO.failure(errors);
        }

        SiteExportDTO migratedData = migrateFormat(importData);

        String siteName = generateUniqueSiteName(migratedData.site.name);

        List<String> createdLabels = new ArrayList<>();
        List<Label> labels = resolveLabels(migratedData.site.labels, createdLabels);

        Site site = new Site();
        site.name = siteName;
        site.secretCode = migratedData.site.secretCode;
        site.labels = labels;
        site.persist();

        int pagesImported = 0;
        if (migratedData.site.pages != null) {
            for (SiteExportDTO.PageData pageData : migratedData.site.pages) {
                Page page = new Page();
                page.name = pageData.name;
                page.site = site;

                Object sanitizedContent = contentSanitizerDS.sanitizeContentObject(pageData.content);
                if (sanitizedContent != null) {
                    try {
                        page.content = objectMapper.writeValueAsString(sanitizedContent);
                    } catch (JsonProcessingException e) {
                        page.content = null;
                    }
                }

                page.persist();
                pagesImported++;
            }
        }

        return SiteImportResultDTO.success(site.id, siteName, pagesImported, createdLabels);
    }

    private String generateUniqueSiteName(String baseName) {
        Site existingSite = Site.find("name", baseName).firstResult();
        if (existingSite == null) {
            return baseName;
        }

        String dateSuffix = LocalDateTime.now().format(DATE_SUFFIX_FORMATTER);
        return baseName + " (" + dateSuffix + ")";
    }

    private List<Label> resolveLabels(List<String> labelNames, List<String> createdLabels) {
        if (labelNames == null || labelNames.isEmpty()) {
            return new ArrayList<>();
        }

        List<Label> labels = new ArrayList<>();
        for (String labelName : labelNames) {
            Label existingLabel = Label.find("name", labelName).firstResult();
            if (existingLabel != null) {
                labels.add(existingLabel);
            } else {
                Label newLabel = new Label();
                newLabel.name = labelName;
                newLabel.persist();
                labels.add(newLabel);
                createdLabels.add(labelName);
            }
        }
        return labels;
    }

    public SiteExportDTO migrateFormat(SiteExportDTO importData) {
        if (importData.formatVersion == null) {
            importData.formatVersion = "1.0";
        }

        return importData;
    }

    public byte[] exportSiteAsZip(Site site) throws IOException {
        SiteExportDTO exportData = exportSite(site);
        Set<String> imageFilenames = collectImageFilenames(exportData);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            zos.putNextEntry(new ZipEntry("site.json"));
            zos.write(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(exportData));
            zos.closeEntry();

            for (String filename : imageFilenames) {
                Path imagePath = imageDS.load(filename);
                if (imagePath != null) {
                    zos.putNextEntry(new ZipEntry("images/" + filename));
                    Files.copy(imagePath, zos);
                    zos.closeEntry();
                }
            }
        }

        return baos.toByteArray();
    }

    @Transactional
    public SiteImportResultDTO importSiteFromZip(InputStream zipStream) throws IOException {
        SiteExportDTO importData = null;
        List<ZipImageEntry> images = new ArrayList<>();

        try (ZipInputStream zis = new ZipInputStream(zipStream)) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if (entry.isDirectory()) continue;

                if ("site.json".equals(entry.getName())) {
                    byte[] data = zis.readAllBytes();
                    importData = objectMapper.readValue(data, SiteExportDTO.class);
                } else if (entry.getName().startsWith("images/")) {
                    String filename = entry.getName().substring("images/".length());
                    if (!filename.isEmpty()) {
                        images.add(new ZipImageEntry(filename, zis.readAllBytes()));
                    }
                }

                zis.closeEntry();
            }
        }

        if (importData == null) {
            return SiteImportResultDTO.failure(List.of(
                    new ImportValidationErrorDTO("zip", "Le fichier ZIP ne contient pas de site.json")
            ));
        }

        for (ZipImageEntry img : images) {
            Path targetDir = imageDS.getStorageDir();
            Files.createDirectories(targetDir);
            Files.write(targetDir.resolve(img.filename), img.data);
        }

        return importSite(importData);
    }

    private Set<String> collectImageFilenames(SiteExportDTO exportData) {
        Set<String> filenames = new HashSet<>();
        if (exportData.site == null || exportData.site.pages == null) return filenames;

        for (SiteExportDTO.PageData page : exportData.site.pages) {
            if (page.content == null) continue;
            try {
                String json = objectMapper.writeValueAsString(page.content);
                collectFilenamesFromJson(objectMapper.readTree(json), filenames);
            } catch (JsonProcessingException ignored) {
            }
        }
        return filenames;
    }

    private void collectFilenamesFromJson(com.fasterxml.jackson.databind.JsonNode node, Set<String> filenames) {
        if (node == null) return;
        if (node.isObject()) {
            if (node.has("filename") && node.get("filename").isTextual()) {
                String val = node.get("filename").asText();
                if (!val.isBlank()) filenames.add(val);
            }
            node.fields().forEachRemaining(e -> collectFilenamesFromJson(e.getValue(), filenames));
        } else if (node.isArray()) {
            for (com.fasterxml.jackson.databind.JsonNode child : node) {
                collectFilenamesFromJson(child, filenames);
            }
        }
    }

    private record ZipImageEntry(String filename, byte[] data) {
    }

}
