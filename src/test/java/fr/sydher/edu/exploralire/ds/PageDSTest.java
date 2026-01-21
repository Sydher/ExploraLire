package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.entity.Page;
import fr.sydher.edu.exploralire.entity.Site;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class PageDSTest {

    @Inject
    PageDS pageDS;

    @BeforeEach
    @Transactional
    void cleanup() {
        Page.deleteAll();
        Site.deleteAll();
    }

    @Test
    void givenNoPages_whenFindAll_thenReturnsEmptyList() {
        // when
        List<Page> result = pageDS.findAll();

        // then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @Transactional
    void givenMultiplePages_whenFindAll_thenReturnsAllPages() {
        // given
        Site site = new Site();
        site.name = "Test Site";
        site.persist();

        Page page1 = new Page();
        page1.name = "Page 1";
        page1.content = "Content 1";
        page1.site = site;
        page1.persist();

        Page page2 = new Page();
        page2.name = "Page 2";
        page2.content = "Content 2";
        page2.site = site;
        page2.persist();

        // when
        List<Page> result = pageDS.findAll();

        // then
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    @Transactional
    void givenExistingPage_whenFindById_thenReturnsPage() {
        // given
        Site site = new Site();
        site.name = "Test Site";
        site.persist();

        Page page = new Page();
        page.name = "Test Page";
        page.content = "Test Content";
        page.site = site;
        page.persist();

        // when
        Page result = pageDS.findById(page.id);

        // then
        assertNotNull(result);
        assertEquals(page.id, result.id);
        assertEquals("Test Page", result.name);
        assertEquals("Test Content", result.content);
    }

    @Test
    void givenNonExistingId_whenFindById_thenReturnsNull() {
        // when
        Page result = pageDS.findById(999L);

        // then
        assertNull(result);
    }

    @Test
    @Transactional
    void givenNewPage_whenCreate_thenPageIsPersisted() {
        // given
        Site site = new Site();
        site.name = "Test Site";
        site.persist();

        Page page = new Page();
        page.name = "New Page";
        page.content = "New Content";
        page.site = site;

        // when
        Page result = pageDS.create(page);

        // then
        assertNotNull(result);
        assertNotNull(result.id);
        assertEquals("New Page", result.name);
        assertEquals("New Content", result.content);
        assertEquals(site.id, result.site.id);
    }

    @Test
    @Transactional
    void givenExistingPage_whenUpdate_thenPageIsUpdated() {
        // given
        Site site = new Site();
        site.name = "Test Site";
        site.persist();

        Page page = new Page();
        page.name = "Original Name";
        page.content = "Original Content";
        page.site = site;
        page.persist();

        Page updateData = new Page();
        updateData.name = "Updated Name";
        updateData.content = "Updated Content";
        updateData.site = site;

        // when
        Page result = pageDS.update(page.id, updateData);

        // then
        assertNotNull(result);
        assertEquals(page.id, result.id);
        assertEquals("Updated Name", result.name);
        assertEquals("Updated Content", result.content);
    }

    @Test
    @Transactional
    void givenExistingPage_whenUpdateWithDifferentSite_thenSiteIsUpdated() {
        // given
        Site site1 = new Site();
        site1.name = "Site 1";
        site1.persist();

        Site site2 = new Site();
        site2.name = "Site 2";
        site2.persist();

        Page page = new Page();
        page.name = "Test Page";
        page.content = "Test Content";
        page.site = site1;
        page.persist();

        Page updateData = new Page();
        updateData.name = "Test Page";
        updateData.content = "Test Content";
        updateData.site = site2;

        // when
        Page result = pageDS.update(page.id, updateData);

        // then
        assertNotNull(result);
        assertEquals(site2.id, result.site.id);
    }

    @Test
    void givenNonExistingPage_whenUpdate_thenReturnsNull() {
        // given
        Page updateData = new Page();
        updateData.name = "Updated Name";
        updateData.content = "Updated Content";

        // when
        Page result = pageDS.update(999L, updateData);

        // then
        assertNull(result);
    }

    @Test
    @Transactional
    void givenExistingPage_whenDelete_thenReturnsTrue() {
        // given
        Site site = new Site();
        site.name = "Test Site";
        site.persist();

        Page page = new Page();
        page.name = "To Delete";
        page.content = "Content";
        page.site = site;
        page.persist();

        // when
        boolean result = pageDS.delete(page.id);

        // then
        assertTrue(result);
        assertNull(Page.findById(page.id));
    }

    @Test
    void givenNonExistingPage_whenDelete_thenReturnsFalse() {
        // when
        boolean result = pageDS.delete(999L);

        // then
        assertFalse(result);
    }
}
