package fr.sydher.edu.exploralire.rc;

import fr.sydher.edu.exploralire.ds.PageDS;
import fr.sydher.edu.exploralire.dto.page.CreatePageDTO;
import fr.sydher.edu.exploralire.dto.page.UpdatePageDTO;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/pages")
public class PageRC {

    @Inject
    PageDS pageDS;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPages() {
        return Response.ok(pageDS.getPages()).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPage(Long id) {
        return Response.ok(pageDS.getPage(id)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPage(@Valid CreatePageDTO createPageDTO) {
        return Response.ok(pageDS.create(createPageDTO)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePage(Long id, @Valid UpdatePageDTO updatePageDTO) {
        return Response.ok(pageDS.update(id, updatePageDTO)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePage(Long id) {
        pageDS.delete(id);
        return Response.ok().build();
    }

}
