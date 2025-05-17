package fr.sydher.edu.exploralire.dto.page;

import fr.sydher.edu.exploralire.entity.PageEntity;

public record PageDTO(Long id, String name, String content) {

    public static PageDTO fromEntity(PageEntity entity) {
        return new PageDTO(entity.id, entity.name, entity.content);
    }

}
