package fr.sydher.edu.exploralire.dto.site;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record UpdateSiteDTO(@NotBlank(message = "Nom de site obligatoire") String name,
                            List<Long> labelsId) {

    // Empty

}
