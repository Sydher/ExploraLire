package fr.sydher.edu.exploralire.dto.page;

import jakarta.validation.constraints.NotBlank;

public record UpdatePageDTO(
        @NotBlank(message = "Nom de page obligatoire") String name,
        @NotBlank(message = "Contenu de page obligatoire") String content) {

    // Empty

}
