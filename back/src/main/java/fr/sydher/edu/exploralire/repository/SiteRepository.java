package fr.sydher.edu.exploralire.repository;

import fr.sydher.edu.exploralire.entity.SiteEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SiteRepository implements PanacheRepository<SiteEntity> {

    // Empty

}
