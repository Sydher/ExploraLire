package fr.sydher.edu.exploralire.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sites")
public class Site extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    @ManyToMany
    @JoinTable(
            name = "site_labels",
            joinColumns = @JoinColumn(name = "site_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    public List<Label> labels = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<Page> pages = new ArrayList<>();

}
