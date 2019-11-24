package com.app;

import java.util.concurrent.ThreadLocalRandom;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;

import org.apache.commons.lang3.RandomStringUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.StartupEvent;

/**
 * This service is used to generate a random identifier for this chat room
 */
@ApplicationScoped
public class InfoService {

	static final Logger log = LoggerFactory.getLogger(InfoService.class);

	@ConfigProperty(name = "chat.room-id")
	String id;

	public void onStartup(@Observes StartupEvent event) {
		log.info("Service started with ID: " + id);
	}

	/**
	 * Return the generated id
	 * @return Generated identifier
	 */
	public String getId() {
		return this.id;
	}
}