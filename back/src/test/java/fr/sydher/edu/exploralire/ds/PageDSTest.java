package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.dto.page.CreatePageDTO;
import fr.sydher.edu.exploralire.dto.page.PageDTO;
import fr.sydher.edu.exploralire.dto.page.UpdatePageDTO;
import fr.sydher.edu.exploralire.entity.PageEntity;
import fr.sydher.edu.exploralire.exception.PageNotFoundException;
import fr.sydher.edu.exploralire.repository.PageRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
class PageDSTest {

    @Inject
    PageDS pageDS;

    @InjectMock
    PageRepository pageRepository;

    private PageEntity p1;
    private PageEntity p2;
    private PageEntity p3;

    @BeforeEach
    void setUp() {
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
    }

    @Test
    void getAll() {
        // Given
        when(pageRepository.streamAll()).thenReturn(Arrays.stream(new PageEntity[]{p1, p2, p3}));

        // When
        List<PageDTO> result = pageDS.getAll();

        // Then
        assertEquals(3, result.size());
        assertEquals("p1", result.getFirst().name());
        verify(pageRepository).streamAll();
    }

    @Test
    void get_ok() {
        // Given
        when(pageRepository.findById(2L)).thenReturn(p2);

        // When
        PageDTO result = pageDS.get(2L);

        // Then
        assertEquals("p2", result.name());
        verify(pageRepository).findById(2L);
    }

    @Test
    void get_ko() {
        // Given
        when(pageRepository.findById(2L)).thenReturn(null);

        // When-Then
        assertThrows(PageNotFoundException.class, () -> pageDS.get(2L));
        verify(pageRepository).findById(2L);
    }

    @Test
    void create() {
        // Given
        CreatePageDTO dto = new CreatePageDTO("p4", "p4 created");
        doNothing().when(pageRepository).persist(any(PageEntity.class));
        ArgumentCaptor<PageEntity> pageEntityAC = ArgumentCaptor.forClass(PageEntity.class);

        // When
        PageDTO result = pageDS.create(dto);

        // Then
        assertEquals("p4", result.name());
        verify(pageRepository).persist(pageEntityAC.capture());
        PageEntity actualPageEntity = pageEntityAC.getValue();
        assertNull(actualPageEntity.id);
        assertEquals("p4", actualPageEntity.name);
    }

    @Test
    void update_ok() {
        // Given
        UpdatePageDTO dto = new UpdatePageDTO("p3", "p3 updated");
        when(pageRepository.findById(3L)).thenReturn(p3);
        doNothing().when(pageRepository).persist(any(PageEntity.class));
        ArgumentCaptor<PageEntity> pageEntityAC = ArgumentCaptor.forClass(PageEntity.class);

        // When
        PageDTO result = pageDS.update(3L, dto);

        // Then
        assertEquals("p3 updated", result.content());
        verify(pageRepository).persist(pageEntityAC.capture());
        PageEntity actualPageEntity = pageEntityAC.getValue();
        assertEquals(3L, actualPageEntity.id);
        assertEquals("p3 updated", actualPageEntity.content);
    }

    @Test
    void update_ko() {
        // Given
        UpdatePageDTO dto = new UpdatePageDTO("p3", "p3 updated");
        when(pageRepository.findById(3L)).thenReturn(null);
        doNothing().when(pageRepository).persist(any(PageEntity.class));

        // When-Then
        assertThrows(PageNotFoundException.class, () -> pageDS.update(3L, dto));
        verify(pageRepository, times(0)).persist(any(PageEntity.class));
    }

    @Test
    void delete_ok() {
        // Given
        when(pageRepository.findById(3L)).thenReturn(p3);
        doNothing().when(pageRepository).delete(any(PageEntity.class));
        ArgumentCaptor<PageEntity> pageEntityAC = ArgumentCaptor.forClass(PageEntity.class);

        // When
        pageDS.delete(3L);

        // Then
        verify(pageRepository).delete(pageEntityAC.capture());
        PageEntity actualPageEntity = pageEntityAC.getValue();
        assertEquals(3L, actualPageEntity.id);
    }

    @Test
    void delete_ko() {
        // Given
        when(pageRepository.findById(3L)).thenReturn(null);
        doNothing().when(pageRepository).persist(any(PageEntity.class));

        // When-Then
        assertThrows(PageNotFoundException.class, () -> pageDS.delete(3L));
        verify(pageRepository, times(0)).persist(any(PageEntity.class));
    }

}
