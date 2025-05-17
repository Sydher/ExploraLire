package fr.sydher.edu.exploralire.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class PageEntity extends PanacheEntity {

    public String name;
    public String content;

}
