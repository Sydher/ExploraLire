package fr.sydher.edu.exploralire.rc;

import fr.sydher.edu.exploralire.ds.LabelDS;
import fr.sydher.edu.exploralire.dto.label.CreateLabelDTO;
import fr.sydher.edu.exploralire.dto.label.UpdateLabelDTO;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/labels")
public class LabelRC {

    @Inject
    LabelDS labelDS;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        return Response.ok(labelDS.getAll()).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(Long id) {
        return Response.ok(labelDS.get(id)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@Valid CreateLabelDTO createLabelDTO) {
        return Response.ok(labelDS.create(createLabelDTO)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(Long id, @Valid UpdateLabelDTO updateLabelDTO) {
        return Response.ok(labelDS.update(id, updateLabelDTO)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(Long id) {
        labelDS.delete(id);
        return Response.ok().build();
    }

}
