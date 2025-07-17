package fr.sydher.edu.exploralire.rc;

import fr.sydher.edu.exploralire.ds.SiteDS;
import fr.sydher.edu.exploralire.dto.site.AttachPageToSiteDTO;
import fr.sydher.edu.exploralire.dto.site.CreateSiteDTO;
import fr.sydher.edu.exploralire.dto.site.DetachPageToSiteDTO;
import fr.sydher.edu.exploralire.dto.site.UpdateSiteDTO;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/sites")
public class SiteRC {

    @Inject
    SiteDS siteDS;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        return Response.ok(siteDS.getAll()).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(Long id) {
        return Response.ok(siteDS.get(id)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@Valid CreateSiteDTO createSiteDTO) {
        return Response.ok(siteDS.create(createSiteDTO)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(Long id, @Valid UpdateSiteDTO updateSiteDTO) {
        return Response.ok(siteDS.update(id, updateSiteDTO)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(Long id) {
        siteDS.delete(id);
        return Response.ok().build();
    }

    @POST
    @Path("/attach/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response attach(Long id, @Valid AttachPageToSiteDTO attachPageToSiteDTO) {
        return Response.ok(siteDS.attachPage(id, attachPageToSiteDTO)).build();
    }

    @POST
    @Path("/detach/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response detach(Long id, @Valid DetachPageToSiteDTO detachPageToSiteDTO) {
        return Response.ok(siteDS.detachPage(id, detachPageToSiteDTO)).build();
    }

}
