package fr.sydher.edu.exploralire.config;

import fr.sydher.edu.exploralire.entity.Label;
import fr.sydher.edu.exploralire.entity.Page;
import fr.sydher.edu.exploralire.entity.Site;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class DataInitializer {

    private static final Logger LOG = Logger.getLogger(DataInitializer.class);

    @ConfigProperty(name = "quarkus.profile")
    String profile;

    public void createDb(@Observes StartupEvent event) {
        if (!"prod".equals(profile)) {
            LOG.info("Skipping data creation - not in prod mode");
            return;
        }

        LOG.info("Starting database creation for prod mode...");

        try {
            // Créer le dossier .exploralire dans le home utilisateur
            Path appDir = Paths.get(System.getProperty("user.home"), ".exploralire", "data");

            if (!Files.exists(appDir)) {
                Files.createDirectories(appDir);
                LOG.info("Dossier de données créé : " + appDir.toAbsolutePath());
            } else {
                LOG.info("Dossier de données existant : " + appDir.toAbsolutePath());
            }

        } catch (IOException e) {
            LOG.error("Erreur lors de la création du dossier de données", e);
            throw new RuntimeException("Impossible de créer le dossier de données", e);
        }
    }

    @Transactional
    public void loadData(@Observes StartupEvent event) {
        if (!"dev".equals(profile)) {
            LOG.info("Skipping data initialization - not in dev mode");
            return;
        }

        LOG.info("Starting database initialization for dev mode...");

        // Check if data already exists
        if (Label.count() > 0) {
            LOG.info("Database already initialized, skipping...");
            return;
        }

        // Create labels
        Label labelHistoire = createLabel("Histoire");
        Label labelSciences = createLabel("Sciences");
        Label labelGeographie = createLabel("Géographie");
        Label labelLitterature = createLabel("Littérature");

        LOG.info("Created 4 labels");

        // Create public site
        Site sitePublic = new Site();
        sitePublic.name = "Les Dinosaures";
        sitePublic.labels = new ArrayList<>(List.of(labelHistoire, labelSciences));
        sitePublic.persist();

        LOG.info("Created public site: " + sitePublic.name);

        // Create protected site
        Site siteProtected = new Site();
        siteProtected.name = "Les Planètes du Système Solaire";
        siteProtected.secretCode = "1234";
        siteProtected.labels = new ArrayList<>(List.of(labelSciences));
        siteProtected.persist();

        LOG.info("Created protected site: " + siteProtected.name + " (code: " + siteProtected.secretCode + ")");

        // Create another protected site
        Site siteProtected2 = new Site();
        siteProtected2.name = "Les Grandes Découvertes";
        siteProtected2.secretCode = "5678";
        siteProtected2.labels = new ArrayList<>(List.of(labelHistoire, labelGeographie));
        siteProtected2.persist();

        LOG.info("Created protected site: " + siteProtected2.name + " (code: " + siteProtected2.secretCode + ")");

        // Create pages for public site
        createPage(
                "Introduction aux Dinosaures",
                sitePublic,
                createContentWithTitle("Les Dinosaures", "Les dinosaures ont dominé la Terre pendant plus de 160 millions d'années.")
        );

        createPage(
                "Les Carnivores",
                sitePublic,
                createContentWithTitle("Les Dinosaures Carnivores", "Le Tyrannosaurus Rex était l'un des plus grands prédateurs terrestres.")
        );

        createPage(
                "Les Herbivores",
                sitePublic,
                createContentWithTitle("Les Dinosaures Herbivores", "Le Brachiosaure pouvait mesurer jusqu'à 26 mètres de long.")
        );

        LOG.info("Created 3 pages for site: " + sitePublic.name);

        // Create pages for protected site 1
        createPage(
                "Le Système Solaire",
                siteProtected,
                createContentWithTitle("Notre Système Solaire", "Le système solaire est composé du Soleil et de 8 planètes principales.")
        );

        createPage(
                "Les Planètes Telluriques",
                siteProtected,
                createContentWithTitle("Les Planètes Rocheuses", "Mercure, Vénus, Terre et Mars sont les planètes telluriques.")
        );

        createPage(
                "Les Planètes Gazeuses",
                siteProtected,
                createContentWithTitle("Les Géantes Gazeuses", "Jupiter, Saturne, Uranus et Neptune sont principalement composées de gaz.")
        );

        LOG.info("Created 3 pages for site: " + siteProtected.name);

        // Create pages for protected site 2
        createPage(
                "Christophe Colomb",
                siteProtected2,
                createContentWithTitle("La Découverte des Amériques", "En 1492, Christophe Colomb découvre le Nouveau Monde.")
        );

        createPage(
                "Les Grandes Explorations",
                siteProtected2,
                createContentWithTitle("L'Ère des Découvertes", "Le XVe et XVIe siècles marquent l'âge des grandes découvertes maritimes.")
        );

        LOG.info("Created 2 pages for site: " + siteProtected2.name);

        LOG.info("Database initialization completed successfully!");
        LOG.info("========================================");
        LOG.info("Public site: " + sitePublic.name);
        LOG.info("Protected sites:");
        LOG.info("  - " + siteProtected.name + " (code: 1234)");
        LOG.info("  - " + siteProtected2.name + " (code: 5678)");
        LOG.info("========================================");
    }

    private Label createLabel(String name) {
        Label label = new Label();
        label.name = name;
        label.persist();
        return label;
    }

    private void createPage(String name, Site site, String content) {
        Page page = new Page();
        page.name = name;
        page.site = site;
        page.content = content;
        page.persist();
    }

    private String createContentWithTitle(String title, String text) {
        return String.format(
                "[{\"id\":\"row-1\",\"columns\":[{\"id\":\"col-1\",\"blocks\":[" +
                        "{\"id\":\"block-1\",\"type\":\"title\",\"text\":\"%s\",\"level\":\"h1\"}," +
                        "{\"id\":\"block-2\",\"type\":\"text\",\"text\":\"<p>%s</p>\"}" +
                        "]}]}]",
                title, text
        );
    }

}
