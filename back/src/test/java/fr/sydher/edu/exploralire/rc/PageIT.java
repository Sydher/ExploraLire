package fr.sydher.edu.exploralire.rc;

import fr.sydher.edu.exploralire.config.CitrusEndpointConfig;
import io.quarkus.test.junit.QuarkusTest;
import org.citrusframework.annotations.CitrusConfiguration;
import org.citrusframework.annotations.CitrusEndpoint;
import org.citrusframework.annotations.CitrusTest;
import org.citrusframework.http.client.HttpClient;
import org.citrusframework.quarkus.CitrusSupport;
import org.citrusframework.validation.json.JsonPathMessageValidationContext;
import org.junit.jupiter.api.Test;

import static org.citrusframework.validation.json.JsonPathMessageValidationContext.Builder.jsonPath;

@QuarkusTest
@CitrusSupport
@CitrusConfiguration(classes = {CitrusEndpointConfig.class})
public class PageIT extends ITHelper {

    @CitrusEndpoint
    private HttpClient pageAPIClient;

    @Test
    @CitrusTest
    void create() {
        testCaseRunner.variable("todoId", "citrus:randomUUID()");
        testCaseRunner.variable("todoName", "citrus:concat('todo_', citrus:randomNumber(4))");
        String body = "{\"name\": \"${todoId}\", \"content\": \"${todoName}\"}";
        JsonPathMessageValidationContext.Builder s = jsonPath().expression("$.name", "${todoId}").expression("$.content", "${todoName}");
        post(pageAPIClient, "/", body, s);
    }

}
