package fr.sydher.edu.exploralire.rc;

import org.citrusframework.TestCaseRunner;
import org.citrusframework.annotations.CitrusResource;
import org.citrusframework.http.client.HttpClient;
import org.citrusframework.message.MessageType;
import org.citrusframework.validation.json.JsonPathMessageValidationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import static org.citrusframework.http.actions.HttpActionBuilder.http;

public abstract class ITHelper {

    @CitrusResource
    protected TestCaseRunner testCaseRunner;

    /**
     * IT Test method for GET API calls.
     *
     * @param client    the HTTP Client to call
     * @param url       the targeted URL
     * @param validator the validation to check
     */
    protected void get(HttpClient client,
                       String url,
                       HttpStatus httpStatus,
                       JsonPathMessageValidationContext.Builder validator) {
        testCaseRunner.when(http()
                .client(client)
                .send()
                .get(url)
                .message()
                .accept(MediaType.APPLICATION_JSON_VALUE)
        );

        testCaseRunner.then(http()
                .client(client)
                .receive()
                .response(httpStatus)
                .message()
                .type(MessageType.JSON)
                .validate(validator)
        );
    }

    protected void get(HttpClient client,
                       String url,
                       JsonPathMessageValidationContext.Builder validator) {
        get(client, url, HttpStatus.OK, validator);
    }

    /**
     * IT Test method for POST API calls.
     *
     * @param client    the HTTP Client to call
     * @param url       the targeted URL
     * @param body      the body of the call
     * @param validator the validation to check
     */
    protected void post(HttpClient client,
                        String url,
                        String body,
                        JsonPathMessageValidationContext.Builder validator) {
        testCaseRunner.when(http()
                .client(client)
                .send()
                .post(url)
                .message()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .body(body)
        );

        testCaseRunner.then(http()
                .client(client)
                .receive()
                .response(HttpStatus.OK)
                .message()
                .type(MessageType.JSON)
                .validate(validator)
        );
    }

    /**
     * IT Test method for PUT API calls.
     *
     * @param client    the HTTP Client to call
     * @param url       the targeted URL
     * @param body      the body of the call
     * @param validator the validation to check
     */
    protected void put(HttpClient client,
                       String url,
                       String body,
                       JsonPathMessageValidationContext.Builder validator) {
        testCaseRunner.when(http()
                .client(client)
                .send()
                .put(url)
                .message()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .body(body)
        );

        testCaseRunner.then(http()
                .client(client)
                .receive()
                .response(HttpStatus.OK)
                .message()
                .type(MessageType.JSON)
                .validate(validator)
        );
    }

    /**
     * IT Test method for DELETE API calls.
     *
     * @param client the HTTP Client to call
     * @param url    the targeted URL
     */
    protected void delete(HttpClient client,
                          String url) {
        testCaseRunner.when(http()
                .client(client)
                .send()
                .delete(url)
                .message()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
        );

        testCaseRunner.then(http()
                .client(client)
                .receive()
                .response(HttpStatus.OK)
        );
    }

}
