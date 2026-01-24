package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.entity.Label;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class LabelDSTest {

    @Inject
    LabelDS labelDS;

    @BeforeEach
    @Transactional
    void cleanup() {
        Label.deleteAll();
    }

    @Test
    void givenNoLabels_whenFindAll_thenReturnsEmptyList() {
        // when
        List<Label> result = labelDS.findAll();

        // then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @Transactional
    void givenMultipleLabels_whenFindAll_thenReturnsAllLabels() {
        // given
        Label label1 = new Label();
        label1.name = "Label 1";
        label1.persist();

        Label label2 = new Label();
        label2.name = "Label 2";
        label2.persist();

        // when
        List<Label> result = labelDS.findAll();

        // then
        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    @Transactional
    void givenExistingLabel_whenFindById_thenReturnsLabel() {
        // given
        Label label = new Label();
        label.name = "Test Label";
        label.persist();

        // when
        Label result = labelDS.findById(label.id);

        // then
        assertNotNull(result);
        assertEquals(label.id, result.id);
        assertEquals("Test Label", result.name);
    }

    @Test
    void givenNonExistingId_whenFindById_thenReturnsNull() {
        // when
        Label result = labelDS.findById(999L);

        // then
        assertNull(result);
    }

    @Test
    void givenNewLabel_whenCreate_thenLabelIsPersisted() {
        // given
        Label label = new Label();
        label.name = "New Label";

        // when
        Label result = labelDS.create(label);

        // then
        assertNotNull(result);
        assertNotNull(result.id);
        assertEquals("New Label", result.name);
    }

    @Test
    @Transactional
    void givenExistingLabel_whenUpdate_thenLabelIsUpdated() {
        // given
        Label label = new Label();
        label.name = "Original Name";
        label.persist();

        Label updateData = new Label();
        updateData.name = "Updated Name";

        // when
        Label result = labelDS.update(label.id, updateData);

        // then
        assertNotNull(result);
        assertEquals(label.id, result.id);
        assertEquals("Updated Name", result.name);
    }

    @Test
    void givenNonExistingLabel_whenUpdate_thenReturnsNull() {
        // given
        Label updateData = new Label();
        updateData.name = "Updated Name";

        // when
        Label result = labelDS.update(999L, updateData);

        // then
        assertNull(result);
    }

    @Test
    @Transactional
    void givenExistingLabel_whenDelete_thenReturnsTrue() {
        // given
        Label label = new Label();
        label.name = "To Delete";
        label.persist();

        // when
        boolean result = labelDS.delete(label.id);

        // then
        assertTrue(result);
        assertNull(Label.findById(label.id));
    }

    @Test
    void givenNonExistingLabel_whenDelete_thenReturnsFalse() {
        // when
        boolean result = labelDS.delete(999L);

        // then
        assertFalse(result);
    }
}
