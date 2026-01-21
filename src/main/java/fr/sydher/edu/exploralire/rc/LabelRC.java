package fr.sydher.edu.exploralire.rc;

import fr.sydher.edu.exploralire.ds.LabelDS;
import fr.sydher.edu.exploralire.entity.Label;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/labels")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LabelRC {

    @Inject
    LabelDS labelDS;

    @GET
    public List<Label> getAll() {
        return labelDS.findAll();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Label label = labelDS.findById(id);
        if (label == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(label).build();
    }

    @POST
    public Response create(Label label) {
        Label created = labelDS.create(label);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, Label label) {
        Label updated = labelDS.update(id, label);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = labelDS.delete(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }

}
