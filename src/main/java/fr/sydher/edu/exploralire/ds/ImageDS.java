package fr.sydher.edu.exploralire.ds;

import io.quarkus.runtime.Startup;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Startup
@ApplicationScoped
public class ImageDS {

    private static final Logger LOG = Logger.getLogger(ImageDS.class);

    private final Path storageDir;

    public ImageDS(@ConfigProperty(name = "exploralire.images.path") String imagesPath) {
        this.storageDir = Path.of(imagesPath);
    }

    @PostConstruct
    void init() {
        try {
            Files.createDirectories(storageDir);
            LOG.infof("Image storage directory: %s", storageDir.toAbsolutePath());
        } catch (IOException e) {
            throw new IllegalStateException("Cannot create image storage directory: " + storageDir, e);
        }
    }

    public String store(InputStream data, String originalFilename) throws IOException {
        Files.createDirectories(storageDir);
        String extension = extractExtension(originalFilename);
        String filename = UUID.randomUUID() + extension;
        Path target = storageDir.resolve(filename);
        Files.copy(data, target, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }

    public Path load(String filename) {
        Path file = resolveSecure(filename);
        if (!Files.exists(file)) {
            return null;
        }
        return file;
    }

    public boolean delete(String filename) throws IOException {
        Path file = resolveSecure(filename);
        return Files.deleteIfExists(file);
    }

    private Path resolveSecure(String filename) {
        Path normalized = storageDir.toAbsolutePath().normalize();
        Path file = normalized.resolve(filename).normalize();
        if (!file.startsWith(normalized)) {
            throw new IllegalArgumentException("Invalid filename");
        }
        return file;
    }

    public Path getStorageDir() {
        return storageDir;
    }

    private String extractExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex >= 0) {
            return filename.substring(dotIndex).toLowerCase();
        }
        return "";
    }

}
