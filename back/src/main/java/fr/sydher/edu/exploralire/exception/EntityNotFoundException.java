package fr.sydher.edu.exploralire.exception;

public class EntityNotFoundException extends RuntimeException {

  public EntityNotFoundException(String entityName, Long id) {
    super(entityName + " with id " + id + " not found");
  }

}
