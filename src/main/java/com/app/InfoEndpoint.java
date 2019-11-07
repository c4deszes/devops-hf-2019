package com.app;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;

/**
 * Endpoint exposes service health information, accessed via /health by default
 */
@ApplicationScoped
public class InfoEndpoint {

	@Inject
	SessionService sessionService;

	@Inject
	InfoService infoService;

	/**
	 * Publishes the following information into /health
	 * 
	 * Room Id, current clients, maximum clients
	 */
	@Produces
	@Liveness
	public HealthCheck check() {
		return () -> HealthCheckResponse
				.named("room")
				.withData("id", infoService.getId())
				.withData("clients", sessionService.all().size())
				.withData("maxClients", sessionService.getMaxClients())
				.up()
				.build();
	}

}