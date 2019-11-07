package com.app;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;

import org.apache.commons.lang3.RandomStringUtils;

/**
 * This service is used to generate a random identifier for this chat room
 */
@ApplicationScoped
public class InfoService {

	/**
	 * Generated identifier
	 */
	private String id;

	/**
	 * Generates random identifier
	 */
	@PostConstruct
	public void init() {
		this.id = RandomStringUtils.randomAlphanumeric(5).toUpperCase();
	}

	/**
	 * Return the generated id
	 * @return Generated identifier
	 */
	public String getId() {
		return this.id;
	}
}