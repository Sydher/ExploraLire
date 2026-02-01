package fr.sydher.edu.exploralire.ds;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.sydher.edu.exploralire.dto.ImportValidationErrorDTO;
import fr.sydher.edu.exploralire.dto.SiteExportDTO;
import fr.sydher.edu.exploralire.dto.SiteImportResultDTO;
import fr.sydher.edu.exploralire.entity.Label;
import fr.sydher.edu.exploralire.entity.Page;
import fr.sydher.edu.exploralire.entity.Site;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class SiteExportDS {

    private static final String CURRENT_FORMAT_VERSION = "1.0";
    private static final String APPLICATION_NAME = "ExploraLire";
    private static final DateTimeFormatter DATE_SUFFIX_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Inject
    ContentSanitizerDS contentSanitizerDS;

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

}
