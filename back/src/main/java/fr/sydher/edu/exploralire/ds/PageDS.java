package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.dto.page.CreatePageDTO;
import fr.sydher.edu.exploralire.dto.page.PageDTO;
import fr.sydher.edu.exploralire.dto.page.PageResultDTO;
import fr.sydher.edu.exploralire.dto.page.UpdatePageDTO;
import fr.sydher.edu.exploralire.entity.PageEntity;
import fr.sydher.edu.exploralire.exception.PageNotFoundException;
import fr.sydher.edu.exploralire.repository.PageRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class PageDS {

    @Inject
    PageRepository pageRepository;

    @ConfigProperty(name = "exploralire.page.size")
    int pageSize;

    public PageResultDTO getAll(int page) {
        PanacheQuery<PageEntity> query = pageRepository.findAll().page(Page.of(page, pageSize));
        List<PageDTO> pages = query.list().stream().map(PageDTO::fromEntity).collect(Collectors.toList());
        long total = query.count();
        return new PageResultDTO(pages, total);
    }

    public PageDTO get(Long id) throws PageNotFoundException {
        PageEntity pageEntity = getEntity(id);
        return PageDTO.fromEntity(pageEntity);
    }

    protected PageEntity getEntity(Long id) throws PageNotFoundException {
        PageEntity pageEntity = pageRepository.findById(id);

        if (pageEntity == null) {
            throw new PageNotFoundException(id);
        }

        return pageEntity;
    }

    @Transactional
    public PageDTO create(CreatePageDTO dto) {
        PageEntity pageEntity = dto.toEntity();
        pageRepository.persist(pageEntity);
        return PageDTO.fromEntity(pageEntity);
    }

    @Transactional
    public PageDTO update(Long id, UpdatePageDTO dto) throws PageNotFoundException {
        PageEntity pageEntity = pageRepository.findById(id);

        if (pageEntity == null) {
            throw new PageNotFoundException(id);
        }

        pageEntity.name = dto.name();
        pageEntity.content = dto.content();
        pageRepository.persist(pageEntity);

        return PageDTO.fromEntity(pageEntity);
    }

    @Transactional
    public void delete(Long id) throws PageNotFoundException {
        PageEntity pageEntity = pageRepository.findById(id);

        if (pageEntity == null) {
            throw new PageNotFoundException(id);
        }

        pageRepository.delete(pageEntity);
    }

}
