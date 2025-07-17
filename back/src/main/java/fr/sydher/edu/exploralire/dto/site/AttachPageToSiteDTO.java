package fr.sydher.edu.exploralire.dto.site;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AttachPageToSiteDTO(@NotEmpty(message = "Au moins 1 page doit être ajoutée") List<Long> pagesId) {

    // Empty

}
