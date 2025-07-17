package fr.sydher.edu.exploralire.dto.site;

import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record DetachPageToSiteDTO(@NotEmpty(message = "Au moins 1 page doit être retirée") Set<Long> pagesId) {

    // Empty

}
