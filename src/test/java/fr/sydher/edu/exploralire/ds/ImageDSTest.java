package fr.sydher.edu.exploralire.ds;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class ImageDSTest {

    @Inject
    ImageDS imageDS;

    @AfterEach
    void cleanup() throws IOException {
        Path dir = imageDS.getStorageDir();
        if (Files.exists(dir)) {
            try (var files = Files.list(dir)) {
                files.forEach(f -> {
                    try {
                        Files.deleteIfExists(f);
                    } catch (IOException ignored) {
                    }
                });
            }
        }
    }

    @Test
    void givenImageData_whenStore_thenReturnsFilenameAndFileExists() throws IOException {
        // given
        byte[] data = "fake-image-data".getBytes();

        // when
        String filename = imageDS.store(new ByteArrayInputStream(data), "photo.png");

        // then
        assertNotNull(filename);
        assertTrue(filename.endsWith(".png"));
        Path stored = imageDS.load(filename);
        assertNotNull(stored);
        assertTrue(Files.exists(stored));
    }

    @Test
    void givenStoredImage_whenLoad_thenReturnsPath() throws IOException {
        // given
        String filename = imageDS.store(new ByteArrayInputStream("data".getBytes()), "test.jpg");

        // when
        Path path = imageDS.load(filename);

        // then
        assertNotNull(path);
        assertTrue(Files.exists(path));
        assertEquals("data", Files.readString(path));
    }

    @Test
    void givenNonExistentFilename_whenLoad_thenReturnsNull() {
        // when
        Path path = imageDS.load("nonexistent.png");

        // then
        assertNull(path);
    }

    @Test
    void givenStoredImage_whenDelete_thenFileRemoved() throws IOException {
        // given
        String filename = imageDS.store(new ByteArrayInputStream("data".getBytes()), "delete-me.png");

        // when
        boolean deleted = imageDS.delete(filename);

        // then
        assertTrue(deleted);
        assertNull(imageDS.load(filename));
    }

    @Test
    void givenNonExistentFilename_whenDelete_thenReturnsFalse() throws IOException {
        // when
        boolean deleted = imageDS.delete("nonexistent.png");

        // then
        assertFalse(deleted);
    }

    @Test
    void givenPathTraversalFilename_whenLoad_thenThrowsException() {
        // when / then
        assertThrows(IllegalArgumentException.class, () -> imageDS.load("../etc/passwd"));
    }

    @Test
    void givenFileWithoutExtension_whenStore_thenReturnsFilenameWithoutExtension() throws IOException {
        // given
        byte[] data = "data".getBytes();

        // when
        String filename = imageDS.store(new ByteArrayInputStream(data), "noext");

        // then
        assertNotNull(filename);
        assertFalse(filename.contains("."));
    }

}
