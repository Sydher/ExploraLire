package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.dto.ImportValidationErrorDTO;
import fr.sydher.edu.exploralire.dto.SiteExportDTO;
import fr.sydher.edu.exploralire.dto.SiteImportResultDTO;
import fr.sydher.edu.exploralire.entity.Label;
import fr.sydher.edu.exploralire.entity.Page;
import fr.sydher.edu.exploralire.entity.Site;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class SiteExportDSTest {

    @Inject
    SiteExportDS siteExportDS;

    @Inject
    ImageDS imageDS;

    @BeforeEach
    @Transactional
    void cleanup() throws IOException {
        Page.deleteAll();
        Site.deleteAll();
        Label.deleteAll();

        java.nio.file.Path dir = imageDS.getStorageDir();
        if (Files.exists(dir)) {
            try (var files = Files.list(dir)) {
                files.forEach(f -> {
                    try { Files.deleteIfExists(f); } catch (IOException ignored) {}
                });
            }
        }
    }

    @Test
    @Transactional
    void givenSiteWithLabelsAndPages_whenExport_thenReturnsCompleteExportData() {
        // given
        Label label = new Label();
        label.name = "Lecture";
        label.persist();

        Site site = new Site();
        site.name = "Mon Site";
        site.secretCode = "1234";
        site.labels = new ArrayList<>();
        site.labels.add(label);
        site.persist();

        Page page = new Page();
        page.name = "Page d'accueil";
        page.content = "{\"rows\":[]}";
        page.site = site;
        page.persist();

        // when
        SiteExportDTO result = siteExportDS.exportSite(site);

        // then
        assertNotNull(result);
        assertEquals("1.0", result.formatVersion);
        assertEquals("ExploraLire", result.application);
        assertNotNull(result.exportDate);

        assertNotNull(result.site);
        assertEquals("Mon Site", result.site.name);
        assertEquals("1234", result.site.secretCode);

        assertEquals(1, result.site.labels.size());
        assertEquals("Lecture", result.site.labels.get(0));

        assertEquals(1, result.site.pages.size());
        assertEquals("Page d'accueil", result.site.pages.get(0).name);
        assertNotNull(result.site.pages.get(0).content);
    }

    @Test
    @Transactional
    void givenSiteWithoutLabelsOrPages_whenExport_thenReturnsExportDataWithEmptyLists() {
        // given
        Site site = new Site();
        site.name = "Site Simple";
        site.persist();

        // when
        SiteExportDTO result = siteExportDS.exportSite(site);

        // then
        assertNotNull(result);
        assertEquals("Site Simple", result.site.name);
        assertTrue(result.site.labels.isEmpty());
        assertTrue(result.site.pages.isEmpty());
    }

    @Test
    void givenNullImportData_whenValidate_thenReturnsErrors() {
        // when
        List<ImportValidationErrorDTO> errors = siteExportDS.validateImport(null);

        // then
        assertFalse(errors.isEmpty());
        assertEquals("root", errors.get(0).field);
    }

    @Test
    void givenImportDataWithoutSiteName_whenValidate_thenReturnsErrors() {
        // given
        SiteExportDTO importData = new SiteExportDTO();
        importData.formatVersion = "1.0";
        importData.site = new SiteExportDTO.SiteData();
        importData.site.name = "";

        // when
        List<ImportValidationErrorDTO> errors = siteExportDS.validateImport(importData);

        // then
        assertFalse(errors.isEmpty());
        assertTrue(errors.stream().anyMatch(e -> e.field.equals("site.name")));
    }

    @Test
    void givenValidImportData_whenValidate_thenReturnsNoErrors() {
        // given
        SiteExportDTO importData = new SiteExportDTO();
        importData.formatVersion = "1.0";
        importData.site = new SiteExportDTO.SiteData();
        importData.site.name = "Site Valide";

        // when
        List<ImportValidationErrorDTO> errors = siteExportDS.validateImport(importData);

        // then
        assertTrue(errors.isEmpty());
    }

    @Test
    void givenValidImportData_whenImport_thenCreatesSite() {
        // given
        SiteExportDTO importData = new SiteExportDTO();
        importData.formatVersion = "1.0";
        importData.site = new SiteExportDTO.SiteData();
        importData.site.name = "Nouveau Site";
        importData.site.secretCode = "5678";
        importData.site.labels = List.of("Label1", "Label2");
        importData.site.pages = List.of(
                new SiteExportDTO.PageData("Page 1", null),
                new SiteExportDTO.PageData("Page 2", "{\"rows\":[]}")
        );

        // when
        SiteImportResultDTO result = siteExportDS.importSite(importData);

        // then
        assertTrue(result.success);
        assertNotNull(result.siteId);
        assertEquals("Nouveau Site", result.siteName);
        assertEquals(2, result.pagesImported);
        assertEquals(2, result.labelsCreated.size());
    }

    @Test
    @Transactional
    void givenExistingSiteWithSameName_whenImport_thenCreatesSiteWithDateSuffix() {
        // given
        Site existingSite = new Site();
        existingSite.name = "Site Existant";
        existingSite.persist();

        SiteExportDTO importData = new SiteExportDTO();
        importData.formatVersion = "1.0";
        importData.site = new SiteExportDTO.SiteData();
        importData.site.name = "Site Existant";

        // when
        SiteImportResultDTO result = siteExportDS.importSite(importData);

        // then
        assertTrue(result.success);
        assertNotEquals("Site Existant", result.siteName);
        assertTrue(result.siteName.startsWith("Site Existant ("));
    }

    @Test
    @Transactional
    void givenExistingLabel_whenImport_thenReusesLabel() {
        // given
        Label existingLabel = new Label();
        existingLabel.name = "LabelExistant";
        existingLabel.persist();

        SiteExportDTO importData = new SiteExportDTO();
        importData.formatVersion = "1.0";
        importData.site = new SiteExportDTO.SiteData();
        importData.site.name = "Site Test";
        importData.site.labels = List.of("LabelExistant");

        // when
        SiteImportResultDTO result = siteExportDS.importSite(importData);

        // then
        assertTrue(result.success);
        assertTrue(result.labelsCreated.isEmpty());
    }

    @Test
    void givenInvalidImportData_whenImport_thenReturnsFailure() {
        // given
        SiteExportDTO importData = new SiteExportDTO();
        importData.formatVersion = "1.0";
        importData.site = new SiteExportDTO.SiteData();
        importData.site.name = "";

        // when
        SiteImportResultDTO result = siteExportDS.importSite(importData);

        // then
        assertFalse(result.success);
        assertFalse(result.errors.isEmpty());
    }

    @Test
    void givenImportDataWithContentContainingXSS_whenImport_thenSanitizesContent() {
        // given
        SiteExportDTO importData = new SiteExportDTO();
        importData.formatVersion = "1.0";
        importData.site = new SiteExportDTO.SiteData();
        importData.site.name = "Site Securise";
        importData.site.pages = List.of(
                new SiteExportDTO.PageData("Page XSS", "<script>alert('xss')</script>Hello")
        );

        // when
        SiteImportResultDTO result = siteExportDS.importSite(importData);

        // then
        assertTrue(result.success);
        assertEquals(1, result.pagesImported);
    }

    @Test
    void givenOldFormatVersion_whenMigrate_thenUpdatesToCurrentVersion() {
        // given
        SiteExportDTO importData = new SiteExportDTO();
        importData.formatVersion = null;
        importData.site = new SiteExportDTO.SiteData();
        importData.site.name = "Old Site";

        // when
        SiteExportDTO migratedData = siteExportDS.migrateFormat(importData);

        // then
        assertEquals("1.0", migratedData.formatVersion);
    }

    @Test
    @Transactional
    void givenSiteWithImageBlock_whenExportAsZip_thenZipContainsSiteJsonAndImage() throws IOException {
        // given
        String filename = imageDS.store(new ByteArrayInputStream("img-data".getBytes()), "photo.png");

        Site site = new Site();
        site.name = "Site Images";
        site.persist();

        Page page = new Page();
        page.name = "Page 1";
        page.content = "[{\"columns\":[{\"blocks\":[{\"type\":\"image\",\"filename\":\"" + filename + "\",\"alt\":\"test\"}]}]}]";
        page.site = site;
        page.persist();

        // when
        byte[] zipData = siteExportDS.exportSiteAsZip(site);

        // then
        assertNotNull(zipData);
        assertTrue(zipData.length > 0);

        boolean hasSiteJson = false;
        boolean hasImage = false;
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(zipData))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if ("site.json".equals(entry.getName())) hasSiteJson = true;
                if (entry.getName().startsWith("images/") && entry.getName().endsWith(".png")) hasImage = true;
                zis.closeEntry();
            }
        }
        assertTrue(hasSiteJson);
        assertTrue(hasImage);
    }

    @Test
    void givenValidZipWithSiteJson_whenImportFromZip_thenCreatesSite() throws IOException {
        // given
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            zos.putNextEntry(new ZipEntry("site.json"));
            String json = "{\"formatVersion\":\"1.0\",\"site\":{\"name\":\"ZIP Site\",\"pages\":[]}}";
            zos.write(json.getBytes());
            zos.closeEntry();
        }

        // when
        SiteImportResultDTO result = siteExportDS.importSiteFromZip(new ByteArrayInputStream(baos.toByteArray()));

        // then
        assertTrue(result.success);
        assertEquals("ZIP Site", result.siteName);
    }

    @Test
    void givenZipWithImages_whenImportFromZip_thenImagesAreStored() throws IOException {
        // given
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            zos.putNextEntry(new ZipEntry("site.json"));
            String json = "{\"formatVersion\":\"1.0\",\"site\":{\"name\":\"IMG Site\",\"pages\":[{\"name\":\"P1\",\"content\":[{\"columns\":[{\"blocks\":[{\"type\":\"image\",\"filename\":\"test-img.png\",\"alt\":\"a\"}]}]}]}]}}";
            zos.write(json.getBytes());
            zos.closeEntry();

            zos.putNextEntry(new ZipEntry("images/test-img.png"));
            zos.write("fake-png".getBytes());
            zos.closeEntry();
        }

        // when
        SiteImportResultDTO result = siteExportDS.importSiteFromZip(new ByteArrayInputStream(baos.toByteArray()));

        // then
        assertTrue(result.success);
        assertNotNull(imageDS.load("test-img.png"));
    }

    @Test
    void givenZipWithoutSiteJson_whenImportFromZip_thenReturnsFailure() throws IOException {
        // given
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            zos.putNextEntry(new ZipEntry("other.txt"));
            zos.write("hello".getBytes());
            zos.closeEntry();
        }

        // when
        SiteImportResultDTO result = siteExportDS.importSiteFromZip(new ByteArrayInputStream(baos.toByteArray()));

        // then
        assertFalse(result.success);
    }

}

