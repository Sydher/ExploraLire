package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.entity.Label;
import fr.sydher.edu.exploralire.entity.Site;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Objects;

@ApplicationScoped
public class SiteDS {

    public List<Site> findAll() {
        return Site.listAll();
    }

    public Site findById(Long id) {
        return Site.findById(id);
    }

    @Transactional
    public Site create(Site site) {
        if (site.labels != null && !site.labels.isEmpty()) {
            site.labels = site.labels.stream()
                    .map(label -> (Label) Label.findById(label.id))
                    .filter(Objects::nonNull)
                    .toList();
        }
        site.persist();
        return site;
    }

    @Transactional
    public Site update(Long id, Site siteData) {
        Site site = Site.findById(id);
        if (site == null) {
            return null;
        }
        site.name = siteData.name;
        site.secretCode = siteData.secretCode;

        if (siteData.labels != null) {
            List<Label> managedLabels = siteData.labels.stream()
                    .map(label -> (Label) Label.findById(label.id))
                    .filter(Objects::nonNull)
                    .toList();
            site.labels.clear();
            site.labels.addAll(managedLabels);
        }

        return site;
    }

    public boolean verifyAccessCode(Long siteId, String code) {
        Site site = Site.findById(siteId);
        if (site == null) {
            return false;
        }
        if (site.secretCode == null || site.secretCode.isEmpty()) {
            return true;
        }
        return site.secretCode.equals(code);
    }

    public boolean requiresAccessCode(Long siteId) {
        Site site = Site.findById(siteId);
        if (site == null) {
            return false;
        }
        return site.secretCode != null && !site.secretCode.isEmpty();
    }

    @Transactional
    public boolean delete(Long id) {
        return Site.deleteById(id);
    }
}
