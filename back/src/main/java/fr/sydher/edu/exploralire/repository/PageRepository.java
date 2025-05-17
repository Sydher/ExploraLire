package fr.sydher.edu.exploralire.repository;

import fr.sydher.edu.exploralire.entity.PageEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PageRepository implements PanacheRepository<PageEntity> {

    // Empty

}
