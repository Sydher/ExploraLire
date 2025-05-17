package fr.sydher.edu.exploralire.exception;

public class PageNotFoundException extends EntityNotFoundException {

    public PageNotFoundException(Long id) {
        super("Page", id);
    }

}
