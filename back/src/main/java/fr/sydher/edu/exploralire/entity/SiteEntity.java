package fr.sydher.edu.exploralire.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;

import java.util.List;

@Entity
public class SiteEntity extends PanacheEntity {

    public String name;

    @ManyToMany
    public List<LabelEntity> labels;

    @ManyToMany
    public List<PageEntity> pages;
    // TODO questionnaire

}
