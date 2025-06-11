package fr.sydher.edu.exploralire.dto.site;

import fr.sydher.edu.exploralire.entity.SiteEntity;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

public record CreateSiteDTO(@NotBlank(message = "Nom de site obligatoire") String name,
                            List<Long> labelsId) {

    public SiteEntity toEntity() {
        SiteEntity siteEntity = new SiteEntity();
        siteEntity.name = this.name();
        siteEntity.labels = new ArrayList<>();
        siteEntity.pages = new ArrayList<>();
        return siteEntity;
    }

}
