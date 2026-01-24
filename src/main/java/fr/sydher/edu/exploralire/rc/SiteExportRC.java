package fr.sydher.edu.exploralire.rc;

import fr.sydher.edu.exploralire.ds.SiteDS;
import fr.sydher.edu.exploralire.ds.SiteExportDS;
import fr.sydher.edu.exploralire.dto.ImportValidationErrorDTO;
import fr.sydher.edu.exploralire.dto.SiteExportDTO;
import fr.sydher.edu.exploralire.dto.SiteImportResultDTO;
import fr.sydher.edu.exploralire.entity.Site;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/sites")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SiteExportRC {

    @Inject
    SiteDS siteDS;

    @Inject
    SiteExportDS siteExportDS;

    @GET
    @Path("/{id}/export")
    public Response exportSite(@PathParam("id") Long id) {
        Site site = siteDS.findById(id);
        if (site == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        SiteExportDTO exportData = siteExportDS.exportSite(site);
        return Response.ok(exportData).build();
    }

    @POST
    @Path("/import")
    public Response importSite(SiteExportDTO importData) {
        SiteImportResultDTO result = siteExportDS.importSite(importData);

        if (!result.success) {
            return Response.status(Response.Status.BAD_REQUEST).entity(result).build();
        }

        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    @POST
    @Path("/import/validate")
    public Response validateImport(SiteExportDTO importData) {
        List<ImportValidationErrorDTO> errors = siteExportDS.validateImport(importData);

        ValidationResponse response = new ValidationResponse(errors.isEmpty(), errors);
        return Response.ok(response).build();
    }

    public static class ValidationResponse {
        public boolean valid;
        public List<ImportValidationErrorDTO> errors;

        public ValidationResponse() {
        }

        public ValidationResponse(boolean valid, List<ImportValidationErrorDTO> errors) {
            this.valid = valid;
            this.errors = errors;
        }
    }

}
