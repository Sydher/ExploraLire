package fr.sydher.edu.exploralire.dto.site;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AttachPageToSiteDTO(@NotNull(message = "Id de site obligatoire") Long siteId,
                                  @NotEmpty(message = "Au moins 1 page doit être ajoutée") List<Long> pagesId) {

    // Empty

}
