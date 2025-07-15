package fr.sydher.edu.exploralire.config;

import fr.sydher.edu.exploralire.dto.ErrorDTO;
import fr.sydher.edu.exploralire.exception.EntityNotFoundException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

@Provider
public class ExceptionHandler implements ExceptionMapper<Exception> {

    private static final Logger LOG = Logger.getLogger(ExceptionHandler.class);

    @Override
    public Response toResponse(Exception e) {
        return mapExceptionToResponse(e);
    }

    private Response mapExceptionToResponse(Exception e) {
        if (e instanceof EntityNotFoundException) {
            return Response.status(Response.Status.NOT_FOUND)
                    .type(MediaType.APPLICATION_JSON)
                    .entity(new ErrorDTO(e.getMessage()))
                    .build();
        }

        LOG.error(AppConst.LOG_ERROR_UNKNOW, e);
        return Response.serverError()
                .type(MediaType.APPLICATION_JSON)
                .entity(new ErrorDTO(AppConst.ERR_GENERIC))
                .build();
    }

}
