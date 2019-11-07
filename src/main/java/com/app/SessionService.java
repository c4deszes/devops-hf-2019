package com.app;

import java.io.Closeable;
import java.io.IOException;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.websocket.CloseReason;
import javax.websocket.Session;
import javax.websocket.CloseReason.CloseCodes;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.scheduler.Scheduled;

/**
 * Manages the lifecycle of websocket sessions
 * 
 * @author Balazs Eszes
 */
@ApplicationScoped
public class SessionService implements Closeable {

	final Logger log = LoggerFactory.getLogger(SessionService.class);

	static final String SHUTDOWN_MESSAGE = "Chat session terminating.";

	static final String TIMEOUT_MESSAGE = "Client timed out.";

	static final CloseReason serverShuttingDown = new CloseReason(CloseCodes.GOING_AWAY, SHUTDOWN_MESSAGE);

	static final CloseReason clientTimeout = new CloseReason(CloseCodes.GOING_AWAY, TIMEOUT_MESSAGE);

	Map<Session, Long> sessions = new ConcurrentHashMap<>();

	@ConfigProperty(name = "chat.max-clients")
	int maxClients;

	@ConfigProperty(name = "chat.timeout", defaultValue = "300000")
	long timeout;

	@ConfigProperty(name = "chat.kill-empty", defaultValue = "true")
	boolean killIfEmpty;

	/**
	 * Adds a new session to the registry
	 * 
	 * @return true if the addition succeeded, false otherwise
	 * The operation will only fail if the registry is full
	 */
	public boolean put(Session session) {
		if (sessions.size() >= maxClients) {
			return false;
		}
		sessions.put(session, System.currentTimeMillis());
		return true;
	}

	/**
	 * Keeps the session alive by updating the 
	 * @param session
	 */
	public void keepAlive(Session session) {
		sessions.put(session, System.currentTimeMillis());
	}

	/**
	 * Removes the given session
	 * @param session
	 */
	public void remove(Session session) {
		sessions.remove(session);
	}

	/**
	 * Returns all current sessions
	 * @return
	 */
	public Collection<Session> all() {
		return sessions.keySet();
	}

	/**
	 * Clears non responsive sessions periodically
	 * 
	 * If the registry is empty then the service may terminate if chat.kill-empty property is set
	 */
	@Scheduled(every = "{chat.clear-interval}", delay = 20, delayUnit = TimeUnit.SECONDS)
	public void clearSessions() {
		sessions.entrySet()
				.removeIf(session -> {
					if(System.currentTimeMillis() - session.getValue() > timeout) {
						close(session.getKey(), clientTimeout);
						return true;
					}
					return false;
				});
		if(sessions.size() == 0) {
			if(this.killIfEmpty) {
				log.info("Terminating session, due to inactivity.");
				System.exit(0);
			}
		}
	}

	/**
	 * @return the maxClients
	 */
	public int getMaxClients() {
		return maxClients;
	}

	/**
	 * Closes the session with the given reason, it wraps the close method
	 * in a try-catch so it's safe to call everywhere.
	 * 
	 * @param session Target session
	 * @param reason The reason for termination
	 */
	private void close(Session session, CloseReason reason) {
		try {
			session.close(reason);
		} catch (IOException e) {}
	}

	/**
	 * Closes all current sessions with the reason 'Server going away'
	 */
	@Override
	public void close() {
		all().forEach(session -> {
			close(session, serverShuttingDown);
		});
	}

	/**
	 * Closes all session when the JVM is shutting down
	 */
	public void onShutdown(@Observes ShutdownEvent event) {
		close();
	}

}