package com.app;

import java.util.Collections;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import io.vertx.core.Vertx;
import io.vertx.ext.consul.ConsulClient;
import io.vertx.ext.consul.ConsulClientOptions;
import io.vertx.ext.consul.ServiceOptions;

@ApplicationScoped
public class ConsulAgent {

	final Logger log = LoggerFactory.getLogger(InfoService.class);

	@ConfigProperty(name = "consul.enabled", defaultValue = "true")
	boolean consulEnabled;

	@ConfigProperty(name = "consul.host", defaultValue = "127.0.0.1")
	String consulIp;

	@ConfigProperty(name = "consul.port", defaultValue = "8080")
	int consulPort;

	@ConfigProperty(name = "quarkus.http.port")
	int port;

	@ConfigProperty(name = "quarkus.application.name")
	String appName;

	@ConfigProperty(name = "quarkus.application.version")
	String appVersion;

	@Inject
	InfoService info;

	@Inject
	Vertx vertx;

	ConsulClient client;

	public String getId() {
		return appName + "-" + info.getId();
	}

	public void initialize(@Observes StartupEvent event) {
		if(!consulEnabled) {
			return;
		}
		client = ConsulClient.create(vertx, getClientOptions());

		ServiceOptions options = getServiceOptions();

		client.registerService(options, (result) -> {
			if(result.succeeded()) {
				log.info("Registered consul service: " + options.getName());
			}
			else {
				log.error("Failed to register consul service.", result.cause());
			}
		});
	}

	public void destroy(@Observes ShutdownEvent event) {
		if(!consulEnabled) {
			return;
		}
		client.deregisterService(getId(), (result) -> {
			if(result.succeeded()) {
				log.info("Deregistered consul service.");
			}
			else {
				log.error("Failed to deregister consul service.", result.cause());
			}
		});
	}

	public ServiceOptions getServiceOptions() {
		return new ServiceOptions()
					.setName(appName)
					.setId(this.getId())
					.setPort(port)
					.setTags(Collections.singletonList(this.appVersion))
					.setMeta(Collections.singletonMap("inst", info.getId()));
	}
	
	public ConsulClientOptions getClientOptions() {
		return new ConsulClientOptions().setHost(consulIp).setPort(consulPort);
	}

}