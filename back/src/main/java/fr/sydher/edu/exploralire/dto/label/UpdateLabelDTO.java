package fr.sydher.edu.exploralire.dto.label;

import jakarta.validation.constraints.NotBlank;

public record UpdateLabelDTO(@NotBlank(message = "Nom d'étiquette obligatoire") String name) {

    // Empty

}
