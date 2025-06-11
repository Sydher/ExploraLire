package fr.sydher.edu.exploralire.exception;

public class SiteNotFoundException extends EntityNotFoundException {

    public SiteNotFoundException(Long id) {
        super("Site", id);
    }

}
