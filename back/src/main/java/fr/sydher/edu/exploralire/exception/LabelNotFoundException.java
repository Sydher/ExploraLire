package fr.sydher.edu.exploralire.exception;

public class LabelNotFoundException extends EntityNotFoundException {

    public LabelNotFoundException(Long id) {
        super("Label", id);
    }

}
