package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.dto.site.*;
import fr.sydher.edu.exploralire.entity.LabelEntity;
import fr.sydher.edu.exploralire.entity.PageEntity;
import fr.sydher.edu.exploralire.entity.SiteEntity;
import fr.sydher.edu.exploralire.exception.LabelNotFoundException;
import fr.sydher.edu.exploralire.exception.SiteNotFoundException;
import fr.sydher.edu.exploralire.repository.SiteRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
class SiteDSTest {

    @Inject
    SiteDS siteDS;

    @InjectMock
    LabelDS labelDS;

    @InjectMock
    PageDS pageDS;

    @InjectMock
    SiteRepository siteRepository;

    private SiteEntity s1;
    private SiteEntity s2;
    private SiteEntity s3;
    private SiteEntity s4;
    private SiteEntity s5;

    private LabelEntity l1;
    private LabelEntity l2;
    private LabelEntity l3;

    private PageEntity p1;
    private PageEntity p2;
    private PageEntity p3;

    @BeforeEach
    void setUp() {
        l1 = new LabelEntity();
        l1.id = 1L;
        l1.name = "l1";

        l2 = new LabelEntity();
        l2.id = 2L;
        l2.name = "l2";

        l3 = new LabelEntity();
        l3.id = 3L;
        l3.name = "l3";

        p1 = new PageEntity();
        p1.id = 1L;
        p1.name = "p1";
        p1.content = "p1 content";

        p2 = new PageEntity();
        p2.id = 2L;
        p2.name = "p2";
        p2.content = "p2 content";

        p3 = new PageEntity();
        p3.id = 3L;
        p3.name = "p3";
        p3.content = "p3 content";

        s1 = new SiteEntity();
        s1.id = 1L;
        s1.name = "s1";

        s2 = new SiteEntity();
        s2.id = 2L;
        s2.name = "s2";

        s3 = new SiteEntity();
        s3.id = 3L;
        s3.name = "s3";

        s4 = new SiteEntity();
        s4.id = 4L;
        s4.name = "s4 with labels but no pages";
        s4.labels = new ArrayList<>();
        s4.labels.add(l1);
        s4.labels.add(l2);

        s5 = new SiteEntity();
        s5.id = 5L;
        s5.name = "s5 with labels and pages";
        s5.labels = new ArrayList<>();
        s5.labels.add(l1);
        s5.labels.add(l2);
        s5.pages = new ArrayList<>();
        s5.pages.add(p1);
        s5.pages.add(p3);
    }

    @Test
    void getAll() {
        // Given
        when(siteRepository.listAll()).thenReturn(List.of(s1, s2, s3));

        // When
        List<SiteDTO> result = siteDS.getAll();

        // Then
        assertEquals(3, result.size());
        assertEquals("s1", result.getFirst().name());
        verify(siteRepository).listAll();
    }

    @Test
    void get_ok_empty() {
        // Given
        when(siteRepository.findById(2L)).thenReturn(s2);

        // When
        SiteDTO result = siteDS.get(2L);

        // Then
        assertEquals("s2", result.name());
        verify(siteRepository).findById(2L);
    }

    @Test
    void get_ok_with_lists() {
        // Given
        when(siteRepository.findById(5L)).thenReturn(s5);

        // When
        SiteDTO result = siteDS.get(5L);

        // Then
        assertEquals("s5 with labels and pages", result.name());
        assertEquals(2, result.labels().size());
        assertEquals("l1", result.labels().getFirst().name());
        assertEquals(2, result.pages().size());
        assertEquals("p3", result.pages().getLast().name());
        verify(siteRepository).findById(5L);
    }

    @Test
    void get_ko() {
        // Given
        when(siteRepository.findById(2L)).thenReturn(null);

        // When-Then
        assertThrows(SiteNotFoundException.class, () -> siteDS.get(2L));
        verify(siteRepository).findById(2L);
    }

    @Test
    void create_empty1() {
        // Given
        CreateSiteDTO dto = new CreateSiteDTO("s6", null);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);

        // When
        SiteDTO result = siteDS.create(dto);

        // Then
        assertEquals("s6", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertNull(actualSiteEntity.id);
        assertEquals("s6", actualSiteEntity.name);
        assertEquals(0, actualSiteEntity.labels.size());
        assertEquals(0, actualSiteEntity.pages.size());
    }

    @Test
    void create_empty2() {
        // Given
        CreateSiteDTO dto = new CreateSiteDTO("s6", new ArrayList<>());
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);

        // When
        SiteDTO result = siteDS.create(dto);

        // Then
        assertEquals("s6", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertNull(actualSiteEntity.id);
        assertEquals("s6", actualSiteEntity.name);
        assertEquals(0, actualSiteEntity.labels.size());
        assertEquals(0, actualSiteEntity.pages.size());
    }

    @Test
    void create_with_labels() {
        // Given
        CreateSiteDTO dto = new CreateSiteDTO("s7", List.of(1L, 2L));
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);
        when(labelDS.getEntity(1L)).thenReturn(l1);
        when(labelDS.getEntity(2L)).thenReturn(l2);

        // When
        SiteDTO result = siteDS.create(dto);

        // Then
        assertEquals("s7", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertNull(actualSiteEntity.id);
        assertEquals("s7", actualSiteEntity.name);
        assertEquals(2, actualSiteEntity.labels.size());
        assertEquals("l1", actualSiteEntity.labels.getFirst().name);
        assertEquals(0, actualSiteEntity.pages.size());
    }

    @Test
    void update_ok_empty1() {
        // Given
        UpdateSiteDTO dto = new UpdateSiteDTO("s1", null);
        when(siteRepository.findById(1L)).thenReturn(s1);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);

        // When
        SiteDTO result = siteDS.update(1L, dto);

        // Then
        assertEquals("s1", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertEquals(1L, actualSiteEntity.id);
        assertEquals("s1", actualSiteEntity.name);
        assertEquals(0, actualSiteEntity.labels.size());
        assertNull(actualSiteEntity.pages);
    }

    @Test
    void update_ok_empty2() {
        // Given
        UpdateSiteDTO dto = new UpdateSiteDTO("s1", new ArrayList<>());
        when(siteRepository.findById(1L)).thenReturn(s1);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);

        // When
        SiteDTO result = siteDS.update(1L, dto);

        // Then
        assertEquals("s1", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertEquals(1L, actualSiteEntity.id);
        assertEquals("s1", actualSiteEntity.name);
        assertEquals(0, actualSiteEntity.labels.size());
        assertNull(actualSiteEntity.pages);
    }

    @Test
    void update_ok_with_labels1() {
        // Given
        UpdateSiteDTO dto = new UpdateSiteDTO("s1", List.of(1L, 2L));
        when(siteRepository.findById(1L)).thenReturn(s1);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);
        when(labelDS.getEntity(1L)).thenReturn(l1);
        when(labelDS.getEntity(2L)).thenReturn(l2);

        // When
        SiteDTO result = siteDS.update(1L, dto);

        // Then
        assertEquals("s1", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertEquals(1L, actualSiteEntity.id);
        assertEquals("s1", actualSiteEntity.name);
        assertEquals(2, actualSiteEntity.labels.size());
        assertEquals("l1", actualSiteEntity.labels.getFirst().name);
        assertNull(actualSiteEntity.pages);
    }

    @Test
    void update_ok_with_labels2() {
        // Given
        UpdateSiteDTO dto = new UpdateSiteDTO("s4", List.of(3L, 4L));
        when(siteRepository.findById(4L)).thenReturn(s4);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);
        when(labelDS.getEntity(3L)).thenReturn(l3);
        when(labelDS.getEntity(4L)).thenThrow(LabelNotFoundException.class);

        // When
        SiteDTO result = siteDS.update(4L, dto);

        // Then
        assertEquals("s4", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertEquals(4L, actualSiteEntity.id);
        assertEquals("s4", actualSiteEntity.name);
        assertEquals(1, actualSiteEntity.labels.size());
        assertEquals("l3", actualSiteEntity.labels.getFirst().name);
        assertNull(actualSiteEntity.pages);
    }

    @Test
    void update_ko() {
        // Given
        UpdateSiteDTO dto = new UpdateSiteDTO("s1", List.of(1L, 2L));
        when(siteRepository.findById(3L)).thenReturn(null);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));

        // When-Then
        assertThrows(SiteNotFoundException.class, () -> siteDS.update(3L, dto));
        verify(siteRepository, times(0)).persist(any(SiteEntity.class));
    }

    @Test
    void attach_ok_to_empty() {
        // Given
        AttachPageToSiteDTO dto = new AttachPageToSiteDTO(List.of(1L, 2L));
        when(siteRepository.findById(1L)).thenReturn(s1);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);
        when(pageDS.getEntity(1L)).thenReturn(p1);
        when(pageDS.getEntity(2L)).thenReturn(p2);

        // When
        SiteDTO result = siteDS.attachPage(1L, dto);

        // Then
        assertEquals("s1", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertEquals(1L, actualSiteEntity.id);
        assertEquals("s1", actualSiteEntity.name);
        assertEquals(2, actualSiteEntity.pages.size());
        assertEquals("p1", actualSiteEntity.pages.getFirst().name);
    }

    @Test
    void attach_ok_to_not_empty() {
        // Given
        AttachPageToSiteDTO dto = new AttachPageToSiteDTO(List.of(2L));
        when(siteRepository.findById(5L)).thenReturn(s5);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);
        when(pageDS.getEntity(2L)).thenReturn(p2);

        // When
        SiteDTO result = siteDS.attachPage(5L, dto);

        // Then
        assertEquals("s5 with labels and pages", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertEquals(5L, actualSiteEntity.id);
        assertEquals("s5 with labels and pages", actualSiteEntity.name);
        assertEquals(3, actualSiteEntity.pages.size());
        assertEquals("p2", actualSiteEntity.pages.getLast().name);
    }

    @Test
    void attach_ko() {
        // Given
        AttachPageToSiteDTO dto = new AttachPageToSiteDTO(List.of(1L, 2L));
        when(siteRepository.findById(1L)).thenReturn(null);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));

        // When-Then
        assertThrows(SiteNotFoundException.class, () -> siteDS.attachPage(1L, dto));
        verify(siteRepository, times(0)).persist(any(SiteEntity.class));
    }


    @Test
    void detach_ok_to_empty() {
        // Given
        DetachPageToSiteDTO dto = new DetachPageToSiteDTO(Set.of(1L, 2L));
        when(siteRepository.findById(1L)).thenReturn(s1);

        // When
        SiteDTO result = siteDS.detachPage(1L, dto);

        // Then
        assertEquals("s1", result.name());
        verify(siteRepository, times(0)).persist(any(SiteEntity.class));
    }

    @Test
    void detach_ok_to_not_empty() {
        // Given
        DetachPageToSiteDTO dto = new DetachPageToSiteDTO(Set.of(1L));
        when(siteRepository.findById(5L)).thenReturn(s5);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);

        // When
        SiteDTO result = siteDS.detachPage(5L, dto);

        // Then
        assertEquals("s5 with labels and pages", result.name());
        verify(siteRepository).persist(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertEquals(5L, actualSiteEntity.id);
        assertEquals("s5 with labels and pages", actualSiteEntity.name);
        assertEquals(1, actualSiteEntity.pages.size());
        assertEquals("p3", actualSiteEntity.pages.getLast().name);
    }

    @Test
    void detach_ko() {
        // Given
        DetachPageToSiteDTO dto = new DetachPageToSiteDTO(Set.of(1L, 2L));
        when(siteRepository.findById(1L)).thenReturn(null);
        doNothing().when(siteRepository).persist(any(SiteEntity.class));

        // When-Then
        assertThrows(SiteNotFoundException.class, () -> siteDS.detachPage(1L, dto));
        verify(siteRepository, times(0)).persist(any(SiteEntity.class));
    }

    @Test
    void delete_ok() {
        // Given
        when(siteRepository.findById(3L)).thenReturn(s3);
        doNothing().when(siteRepository).delete(any(SiteEntity.class));
        ArgumentCaptor<SiteEntity> siteEntityAC = ArgumentCaptor.forClass(SiteEntity.class);

        // When
        siteDS.delete(3L);

        // Then
        verify(siteRepository).delete(siteEntityAC.capture());
        SiteEntity actualSiteEntity = siteEntityAC.getValue();
        assertEquals(3L, actualSiteEntity.id);
    }

    @Test
    void delete_ko() {
        // Given
        when(siteRepository.findById(3L)).thenReturn(null);
        doNothing().when(siteRepository).delete(any(SiteEntity.class));

        // When-Then
        assertThrows(SiteNotFoundException.class, () -> siteDS.delete(3L));
        verify(siteRepository, times(0)).persist(any(SiteEntity.class));
    }

}
