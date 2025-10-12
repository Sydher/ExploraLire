package fr.sydher.edu.exploralire.ds;

import fr.sydher.edu.exploralire.entity.Label;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class LabelDS {

    public List<Label> findAll() {
        return Label.listAll();
    }

    public Label findById(Long id) {
        return Label.findById(id);
    }

    @Transactional
    public Label create(Label label) {
        label.persist();
        return label;
    }

    @Transactional
    public Label update(Long id, Label labelData) {
        Label label = Label.findById(id);
        if (label == null) {
            return null;
        }
        label.name = labelData.name;
        return label;
    }

    @Transactional
    public boolean delete(Long id) {
        return Label.deleteById(id);
    }

}
