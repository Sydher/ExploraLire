package fr.sydher.edu.exploralire.dto.site;

import fr.sydher.edu.exploralire.dto.label.LabelDTO;
import fr.sydher.edu.exploralire.dto.page.PageDTO;
import fr.sydher.edu.exploralire.entity.SiteEntity;

import java.util.ArrayList;
import java.util.List;

public record SiteDTO(Long id, String name, List<LabelDTO> labels, List<PageDTO> pages) {

    public static SiteDTO fromEntity(SiteEntity entity) {
        List<LabelDTO> labels = entity.labels != null ?
                entity.labels.stream()
                        .map(LabelDTO::fromEntity)
                        .toList()
                : new ArrayList<>();

        List<PageDTO> pages = entity.pages != null ?
                entity.pages.stream()
                        .map(PageDTO::fromEntity)
                        .toList()
                : new ArrayList<>();

        return new SiteDTO(entity.id, entity.name, labels, pages);
    }

}
