package fr.sydher.edu.exploralire.dto.label;

import fr.sydher.edu.exploralire.entity.LabelEntity;
import jakarta.validation.constraints.NotBlank;

public record CreateLabelDTO(@NotBlank(message = "Nom d'étiquette obligatoire") String name) {

    public LabelEntity toEntity() {
        LabelEntity labelEntity = new LabelEntity();
        labelEntity.name = this.name();
        return labelEntity;
    }

}
