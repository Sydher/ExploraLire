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
import org.springframework.http.HttpStatus;

import static org.citrusframework.validation.json.JsonPathMessageValidationContext.Builder.jsonPath;

@QuarkusTest
@CitrusSupport
@CitrusConfiguration(classes = {CitrusEndpointConfig.class})
public class PageIT extends ITHelper {

    @CitrusEndpoint
    private HttpClient pageAPIClient;

    @Test
    @CitrusTest
    void page() {
        getAll(0);
        create();
        create();
        getAll(2);
        create("hello");
        get(3L, "hello");
        update(1L, "hi");
        get(1L, "hi");
        delete(2L);
        getNotFound(2L);
    }

    void getAll(int size) {
        // then
        JsonPathMessageValidationContext.Builder validator = jsonPath()
                .expression("$.size()", size);

        // when
        get(pageAPIClient, "/", validator);
    }

    void get(Long idToSearch, String nameExpected) {
        // then
        JsonPathMessageValidationContext.Builder validator = jsonPath()
                .expression("$.id", idToSearch)
                .expression("$.name", nameExpected);

        // when
        get(pageAPIClient, "/" + idToSearch, validator);
    }

    void getNotFound(Long idToSearch) {
        // then
        JsonPathMessageValidationContext.Builder validator = jsonPath()
                .expression("$.message", "Page with id 2 not found");

        // when
        get(pageAPIClient, "/" + idToSearch, HttpStatus.NOT_FOUND, validator);
    }

    void create(String customName) {
        // given
        if (customName.isEmpty()) {
            testCaseRunner.variable("randomName", "citrus:randomUUID()");
        } else {
            testCaseRunner.variable("randomName", customName);
        }
        testCaseRunner.variable("randomContent", "citrus:concat('todo_', citrus:randomNumber(4))");
        String body = "{\"name\": \"${randomName}\", \"content\": \"${randomContent}\"}";

        // then
        JsonPathMessageValidationContext.Builder validator = jsonPath()
                .expression("$.name", "${randomName}")
                .expression("$.content", "${randomContent}");

        // when
        post(pageAPIClient, "/", body, validator);
    }

    void create() {
        create("");
    }

    void update(Long idToUpdate, String newName) {
        // given
        testCaseRunner.variable("nameToUpdate", newName);
        testCaseRunner.variable("randomContent", "citrus:concat('todo_', citrus:randomNumber(4))");
        String body = "{\"name\": \"${nameToUpdate}\", \"content\": \"${randomContent}\"}";

        // then
        JsonPathMessageValidationContext.Builder validator = jsonPath()
                .expression("$.name", "${nameToUpdate}")
                .expression("$.content", "${randomContent}");

        // when
        put(pageAPIClient, "/" + idToUpdate, body, validator);
    }

    void delete(Long idToDelete) {
        // when
        delete(pageAPIClient, "/" + idToDelete);
    }

}
