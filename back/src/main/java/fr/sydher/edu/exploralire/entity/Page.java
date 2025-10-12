package fr.sydher.edu.exploralire.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "pages")
public class Page extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    @Column(columnDefinition = "TEXT")
    public String content;

    @ManyToOne
    @JoinColumn(name = "site_id", nullable = false)
    public Site site;
}
