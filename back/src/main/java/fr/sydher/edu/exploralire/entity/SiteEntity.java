package fr.sydher.edu.exploralire.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.List;

@Entity
public class SiteEntity extends PanacheEntity {

    public String name;

    @ManyToMany
    @Fetch(FetchMode.JOIN)
    public List<LabelEntity> labels;

    @ManyToMany(fetch = FetchType.LAZY)
    public List<PageEntity> pages;

    // TODO questionnaire

}
