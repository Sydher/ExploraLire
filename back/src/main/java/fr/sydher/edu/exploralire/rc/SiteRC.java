package fr.sydher.edu.exploralire.rc;

import fr.sydher.edu.exploralire.ds.SiteDS;
import fr.sydher.edu.exploralire.entity.Site;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/sites")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SiteRC {

    @Inject
    SiteDS siteDS;

    @GET
    public List<Site> getAll() {
        return siteDS.findAll();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Site site = siteDS.findById(id);
        if (site == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(site).build();
    }

    @POST
    public Response create(Site site) {
        Site created = siteDS.create(site);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, Site site) {
        Site updated = siteDS.update(id, site);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = siteDS.delete(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }

}
