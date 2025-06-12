package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.config.AppConst;
import fr.sydher.edu.exploralire.dto.site.*;
import fr.sydher.edu.exploralire.entity.LabelEntity;
import fr.sydher.edu.exploralire.entity.PageEntity;
import fr.sydher.edu.exploralire.entity.SiteEntity;
import fr.sydher.edu.exploralire.exception.LabelNotFoundException;
import fr.sydher.edu.exploralire.exception.SiteNotFoundException;
import fr.sydher.edu.exploralire.repository.SiteRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class SiteDS {

    private static final Logger LOG = Logger.getLogger(SiteDS.class);

    @Inject
    LabelDS labelDS;

    @Inject
    PageDS pageDS;

    @Inject
    SiteRepository siteRepository;

    public List<SiteDTO> getAll() {
        return siteRepository.streamAll().map(SiteDTO::fromEntity).collect(Collectors.toList());
    }

    public SiteDTO get(Long id) throws SiteNotFoundException {
        SiteEntity siteEntity = siteRepository.findById(id);

        if (siteEntity == null) {
            throw new SiteNotFoundException(id);
        }

        return SiteDTO.fromEntity(siteEntity);
    }

    @Transactional
    public SiteDTO create(CreateSiteDTO dto) {
        SiteEntity siteEntity = dto.toEntity();
        addLabels(dto.labelsId(), siteEntity);
        siteRepository.persist(siteEntity);
        return SiteDTO.fromEntity(siteEntity);
    }

    @Transactional
    public SiteDTO update(Long id, UpdateSiteDTO dto) throws SiteNotFoundException {
        SiteEntity siteEntity = siteRepository.findById(id);

        if (siteEntity == null) {
            throw new SiteNotFoundException(id);
        }

        siteEntity.name = dto.name();

        // Update Labels list
        if (siteEntity.labels == null) {
            siteEntity.labels = new ArrayList<>();
        }
        siteEntity.labels.clear();
        addLabels(dto.labelsId(), siteEntity);

        siteRepository.persist(siteEntity);
        return SiteDTO.fromEntity(siteEntity);
    }

    @Transactional
    public SiteDTO attachPage(AttachPageToSiteDTO dto) throws SiteNotFoundException {
        SiteEntity siteEntity = siteRepository.findById(dto.siteId());

        if (siteEntity == null) {
            throw new SiteNotFoundException(dto.siteId());
        }

        if (siteEntity.pages == null) {
            siteEntity.pages = new ArrayList<>();
        }
        dto.pagesId().forEach(pageId -> {
            PageEntity pageEntity = pageDS.getEntity(pageId);
            siteEntity.pages.add(pageEntity);
        });

        siteRepository.persist(siteEntity);
        return SiteDTO.fromEntity(siteEntity);
    }

    @Transactional
    public SiteDTO detachPage(DetachPageToSiteDTO dto) throws SiteNotFoundException {
        SiteEntity siteEntity = siteRepository.findById(dto.siteId());

        if (siteEntity == null) {
            throw new SiteNotFoundException(dto.siteId());
        }

        if (siteEntity.pages == null) {
            LOG.warn(AppConst.LOG_NOTHING_DETACH);
            return SiteDTO.fromEntity(siteEntity);
        }

        siteEntity.pages.removeIf(page -> dto.pagesId().contains(page.id));

        siteRepository.persist(siteEntity);
        return SiteDTO.fromEntity(siteEntity);
    }

    @Transactional
    public void delete(Long id) throws SiteNotFoundException {
        SiteEntity siteEntity = siteRepository.findById(id);

        if (siteEntity == null) {
            throw new SiteNotFoundException(id);
        }

        siteRepository.delete(siteEntity);
    }

    /**
     * Add labels to entity.
     *
     * @param labelsId   labels id to add to the entity
     * @param siteEntity the entity to update
     */
    private void addLabels(List<Long> labelsId, SiteEntity siteEntity) {
        if (labelsId == null || labelsId.isEmpty()) {
            return;
        }

        labelsId.forEach(labelId -> {
            try {
                LabelEntity labelEntity = labelDS.getEntity(labelId);
                siteEntity.labels.add(labelEntity);
            } catch (LabelNotFoundException e) {
                LOG.error(e.getMessage(), e);
            }
        });
    }

}
