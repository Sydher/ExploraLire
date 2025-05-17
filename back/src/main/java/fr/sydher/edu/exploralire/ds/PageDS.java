package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.dto.page.CreatePageDTO;
import fr.sydher.edu.exploralire.dto.page.PageDTO;
import fr.sydher.edu.exploralire.dto.page.UpdatePageDTO;
import fr.sydher.edu.exploralire.entity.PageEntity;
import fr.sydher.edu.exploralire.exception.PageNotFoundException;
import fr.sydher.edu.exploralire.repository.PageRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class PageDS {

    @Inject
    PageRepository pageRepository;

    public List<PageDTO> getPages() {
        return pageRepository.streamAll().map(PageDTO::fromEntity).collect(Collectors.toList());
    }

    public PageDTO getPage(Long id) {
        PageEntity pageEntity = pageRepository.findById(id);

        if (pageEntity == null) {
            throw new PageNotFoundException(id);
        }

        return PageDTO.fromEntity(pageEntity);
    }

    @Transactional
    public PageDTO create(CreatePageDTO dto) {
        PageEntity pageEntity = dto.toEntity();
        pageEntity.persist();
        return PageDTO.fromEntity(pageEntity);
    }

    @Transactional
    public PageDTO update(Long id, UpdatePageDTO dto) {
        PageEntity pageEntity = pageRepository.findById(id);

        if (pageEntity == null) {
            throw new PageNotFoundException(id);
        }

        pageEntity.name = dto.name();
        pageEntity.content = dto.content();
        pageEntity.persist();

        return PageDTO.fromEntity(pageEntity);
    }

    @Transactional
    public void delete(Long id) {
        PageEntity pageEntity = pageRepository.findById(id);

        if (pageEntity == null) {
            throw new PageNotFoundException(id);
        }

        pageEntity.delete();
    }

}
