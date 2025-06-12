package fr.sydher.edu.exploralire.config;

import org.citrusframework.http.client.HttpClient;
import org.citrusframework.spi.BindToRegistry;

import static org.citrusframework.http.endpoint.builder.HttpEndpoints.http;

public class CitrusEndpointConfig {

    @BindToRegistry
    public HttpClient pageAPIClient() {
        return http().client()
                .requestUrl("http://localhost:8080/api/pages")
                .build();
    }

}
