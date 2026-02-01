package fr.sydher.edu.exploralire.rc;

import fr.sydher.edu.exploralire.ds.ImageDS;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.multipart.FileUpload;
import org.jboss.resteasy.reactive.RestForm;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Path("/api/images")
public class ImageRC {

    @Inject
    ImageDS imageDS;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response upload(@RestForm("file") FileUpload file) {
        if (file == null || file.fileName() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Aucun fichier fourni"))
                    .build();
        }

        String contentType = file.contentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Le fichier doit être une image"))
                    .build();
        }

        try (InputStream is = java.nio.file.Files.newInputStream(file.uploadedFile())) {
            String filename = imageDS.store(is, file.fileName());
            return Response.status(Response.Status.CREATED)
                    .entity(Map.of("filename", filename, "url", "/api/images/" + filename))
                    .build();
        } catch (IOException e) {
            return Response.serverError()
                    .entity(Map.of("error", "Erreur lors de l'enregistrement de l'image"))
                    .build();
        }
    }

    @GET
    @Path("/{name}")
    public Response serve(@PathParam("name") String name) {
        java.nio.file.Path file = imageDS.load(name);
        if (file == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        try {
            String contentType = java.nio.file.Files.probeContentType(file);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            return Response.ok(file.toFile(), contentType)
                    .header("Cache-Control", "public, max-age=86400")
                    .build();
        } catch (IOException e) {
            return Response.serverError().build();
        }
    }

    @DELETE
    @Path("/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("name") String name) {
        try {
            boolean deleted = imageDS.delete(name);
            if (!deleted) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.noContent().build();
        } catch (IOException e) {
            return Response.serverError().build();
        }
    }

}
