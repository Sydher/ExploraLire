package fr.sydher.edu.exploralire.dto.page;

import fr.sydher.edu.exploralire.entity.PageEntity;
import jakarta.validation.constraints.NotBlank;

public record CreatePageDTO(
        @NotBlank(message = "Nom de page obligatoire") String name,
        @NotBlank(message = "Contenu de page obligatoire") String content) {

    public PageEntity toEntity() {
        PageEntity pageEntity = new PageEntity();
        pageEntity.name = this.name();
        pageEntity.content = this.content();
        return pageEntity;
    }

}
