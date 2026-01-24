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

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class SiteExportDSTest {

    @Inject
    SiteExportDS siteExportDS;

    @BeforeEach
    @Transactional
    void cleanup() {
        Page.deleteAll();
        Site.deleteAll();
        Label.deleteAll();
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

}
