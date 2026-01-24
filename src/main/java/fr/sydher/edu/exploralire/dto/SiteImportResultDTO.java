package fr.sydher.edu.exploralire.dto;

import java.util.ArrayList;
import java.util.List;

public class SiteImportResultDTO {

    public boolean success;
    public Long siteId;
    public String siteName;
    public int pagesImported;
    public List<String> labelsCreated;
    public List<ImportValidationErrorDTO> errors;

    public SiteImportResultDTO() {
        this.labelsCreated = new ArrayList<>();
        this.errors = new ArrayList<>();
    }

    public static SiteImportResultDTO success(Long siteId, String siteName, int pagesImported, List<String> labelsCreated) {
        SiteImportResultDTO result = new SiteImportResultDTO();
        result.success = true;
        result.siteId = siteId;
        result.siteName = siteName;
        result.pagesImported = pagesImported;
        result.labelsCreated = labelsCreated;
        return result;
    }

    public static SiteImportResultDTO failure(List<ImportValidationErrorDTO> errors) {
        SiteImportResultDTO result = new SiteImportResultDTO();
        result.success = false;
        result.errors = errors;
        return result;
    }

}
