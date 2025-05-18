package fr.sydher.edu.exploralire.repository;

import fr.sydher.edu.exploralire.entity.LabelEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class LabelRepository implements PanacheRepository<LabelEntity> {

    // Empty

}
