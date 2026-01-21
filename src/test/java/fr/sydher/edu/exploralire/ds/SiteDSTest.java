package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.entity.Label;
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
class SiteDSTest {

    @Inject
    SiteDS siteDS;

    @BeforeEach
    @Transactional
    void cleanup() {
        Site.deleteAll();
        Label.deleteAll();
    }

    @Test
    void givenNoSites_whenFindAll_thenReturnsEmptyList() {
        // when
        List<Site> result = siteDS.findAll();

        // then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @Transactional
    void givenMultipleSites_whenFindAll_thenReturnsAllSites() {
        // given
        Site site1 = new Site();
        site1.name = "Site 1";
        site1.persist();

        Site site2 = new Site();
        site2.name = "Site 2";
        site2.persist();

        // when
        List<Site> result = siteDS.findAll();

        // then
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    @Transactional
    void givenExistingSite_whenFindById_thenReturnsSite() {
        // given
        Site site = new Site();
        site.name = "Test Site";
        site.persist();

        // when
        Site result = siteDS.findById(site.id);

        // then
        assertNotNull(result);
        assertEquals(site.id, result.id);
        assertEquals("Test Site", result.name);
    }

    @Test
    void givenNonExistingId_whenFindById_thenReturnsNull() {
        // when
        Site result = siteDS.findById(999L);

        // then
        assertNull(result);
    }

    @Test
    @Transactional
    void givenNewSite_whenCreate_thenSiteIsPersisted() {
        // given
        Site site = new Site();
        site.name = "New Site";

        // when
        Site result = siteDS.create(site);

        // then
        assertNotNull(result);
        assertNotNull(result.id);
        assertEquals("New Site", result.name);
    }

    @Test
    @Transactional
    void givenNewSiteWithLabels_whenCreate_thenSiteIsPersistedWithLabels() {
        // given
        Label label1 = new Label();
        label1.name = "Label 1";
        label1.persist();

        Label label2 = new Label();
        label2.name = "Label 2";
        label2.persist();

        Site site = new Site();
        site.name = "New Site";
        site.labels = new ArrayList<>();
        site.labels.add(label1);
        site.labels.add(label2);

        // when
        Site result = siteDS.create(site);

        // then
        assertNotNull(result);
        assertNotNull(result.id);
        assertEquals("New Site", result.name);
        assertEquals(2, result.labels.size());
    }

    @Test
    @Transactional
    void givenExistingSite_whenUpdate_thenSiteIsUpdated() {
        // given
        Site site = new Site();
        site.name = "Original Name";
        site.persist();

        Site updateData = new Site();
        updateData.name = "Updated Name";

        // when
        Site result = siteDS.update(site.id, updateData);

        // then
        assertNotNull(result);
        assertEquals(site.id, result.id);
        assertEquals("Updated Name", result.name);
    }

    @Test
    @Transactional
    void givenExistingSite_whenUpdateWithLabels_thenLabelsAreUpdated() {
        // given
        Label label1 = new Label();
        label1.name = "Label 1";
        label1.persist();

        Label label2 = new Label();
        label2.name = "Label 2";
        label2.persist();

        Site site = new Site();
        site.name = "Test Site";
        site.labels = new ArrayList<>();
        site.labels.add(label1);
        site.persist();

        Site updateData = new Site();
        updateData.name = "Test Site";
        updateData.labels = new ArrayList<>();
        updateData.labels.add(label2);

        // when
        Site result = siteDS.update(site.id, updateData);

        // then
        assertNotNull(result);
        assertEquals(1, result.labels.size());
        assertEquals(label2.id, result.labels.get(0).id);
    }

    @Test
    void givenNonExistingSite_whenUpdate_thenReturnsNull() {
        // given
        Site updateData = new Site();
        updateData.name = "Updated Name";

        // when
        Site result = siteDS.update(999L, updateData);

        // then
        assertNull(result);
    }

    @Test
    @Transactional
    void givenExistingSite_whenDelete_thenReturnsTrue() {
        // given
        Site site = new Site();
        site.name = "To Delete";
        site.persist();

        // when
        boolean result = siteDS.delete(site.id);

        // then
        assertTrue(result);
        assertNull(Site.findById(site.id));
    }

    @Test
    void givenNonExistingSite_whenDelete_thenReturnsFalse() {
        // when
        boolean result = siteDS.delete(999L);

        // then
        assertFalse(result);
    }

    @Test
    @Transactional
    void givenSiteWithoutCode_whenVerifyAccessCode_thenReturnsTrue() {
        // given
        Site site = new Site();
        site.name = "Public Site";
        site.persist();

        // when
        boolean result = siteDS.verifyAccessCode(site.id, null);

        // then
        assertTrue(result);
    }

    @Test
    @Transactional
    void givenSiteWithCode_whenVerifyAccessCodeWithCorrectCode_thenReturnsTrue() {
        // given
        Site site = new Site();
        site.name = "Private Site";
        site.secretCode = "1234";
        site.persist();

        // when
        boolean result = siteDS.verifyAccessCode(site.id, "1234");

        // then
        assertTrue(result);
    }

    @Test
    @Transactional
    void givenSiteWithCode_whenVerifyAccessCodeWithIncorrectCode_thenReturnsFalse() {
        // given
        Site site = new Site();
        site.name = "Private Site";
        site.secretCode = "1234";
        site.persist();

        // when
        boolean result = siteDS.verifyAccessCode(site.id, "wrong");

        // then
        assertFalse(result);
    }

    @Test
    @Transactional
    void givenSiteWithCode_whenVerifyAccessCodeWithNullCode_thenReturnsFalse() {
        // given
        Site site = new Site();
        site.name = "Private Site";
        site.secretCode = "1234";
        site.persist();

        // when
        boolean result = siteDS.verifyAccessCode(site.id, null);

        // then
        assertFalse(result);
    }

    @Test
    void givenNonExistingSite_whenVerifyAccessCode_thenReturnsFalse() {
        // when
        boolean result = siteDS.verifyAccessCode(999L, "1234");

        // then
        assertFalse(result);
    }

    @Test
    @Transactional
    void givenSiteWithoutCode_whenRequiresAccessCode_thenReturnsFalse() {
        // given
        Site site = new Site();
        site.name = "Public Site";
        site.persist();

        // when
        boolean result = siteDS.requiresAccessCode(site.id);

        // then
        assertFalse(result);
    }

    @Test
    @Transactional
    void givenSiteWithEmptyCode_whenRequiresAccessCode_thenReturnsFalse() {
        // given
        Site site = new Site();
        site.name = "Public Site";
        site.secretCode = "";
        site.persist();

        // when
        boolean result = siteDS.requiresAccessCode(site.id);

        // then
        assertFalse(result);
    }

    @Test
    @Transactional
    void givenSiteWithCode_whenRequiresAccessCode_thenReturnsTrue() {
        // given
        Site site = new Site();
        site.name = "Private Site";
        site.secretCode = "1234";
        site.persist();

        // when
        boolean result = siteDS.requiresAccessCode(site.id);

        // then
        assertTrue(result);
    }

    @Test
    void givenNonExistingSite_whenRequiresAccessCode_thenReturnsFalse() {
        // when
        boolean result = siteDS.requiresAccessCode(999L);

        // then
        assertFalse(result);
    }

    @Test
    @Transactional
    void givenExistingSite_whenUpdateWithSecretCode_thenSecretCodeIsUpdated() {
        // given
        Site site = new Site();
        site.name = "Test Site";
        site.persist();

        Site updateData = new Site();
        updateData.name = "Test Site";
        updateData.secretCode = "5678";

        // when
        Site result = siteDS.update(site.id, updateData);

        // then
        assertNotNull(result);
        assertEquals("5678", result.secretCode);
    }

}

