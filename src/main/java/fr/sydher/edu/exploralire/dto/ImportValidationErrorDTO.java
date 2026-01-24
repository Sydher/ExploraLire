package fr.sydher.edu.exploralire.dto;

public class ImportValidationErrorDTO {

    public String field;
    public String message;

    public ImportValidationErrorDTO() {
    }

    public ImportValidationErrorDTO(String field, String message) {
        this.field = field;
        this.message = message;
    }

}
