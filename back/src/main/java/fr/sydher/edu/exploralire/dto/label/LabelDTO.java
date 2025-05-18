package fr.sydher.edu.exploralire.dto.label;

import fr.sydher.edu.exploralire.entity.LabelEntity;

public record LabelDTO(Long id, String name) {

    public static LabelDTO fromEntity(LabelEntity entity) {
        return new LabelDTO(entity.id, entity.name);
    }

}
