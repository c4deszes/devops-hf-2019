package com.app;

import java.io.IOException;
import java.nio.ByteBuffer;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.CloseReason.CloseCodes;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.PongMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.StartupEvent;
import io.quarkus.scheduler.Scheduled;

/**
 * WebSocket handler
 */
@ServerEndpoint("/chat")
@ApplicationScoped
public class ChatServer {

	static final Logger log = LoggerFactory.getLogger(ChatServer.class);

	static final String ROOM_FULL_MESSAGE = "Room already full.";

	static final String CLOSE_MESSAGE = "Terminating session, participant disconnected.";

	static final CloseReason roomAlreadyFull = new CloseReason(CloseCodes.TRY_AGAIN_LATER, ROOM_FULL_MESSAGE);

	static final ByteBuffer empty = ByteBuffer.allocate(0);

	@Inject
	SessionService sessionService;

	public void onStartup(@Observes StartupEvent event) {
		log.info("Waiting for clients...");
	}

	/**
	 * Adds the session to the registry
	 */
	@OnOpen
	public void onConnection(Session session) throws IOException {
		if (!sessionService.put(session)) {
			log.warn("Dropping sessionId={} room full.", session.getId());
			session.close(roomAlreadyFull);
		}
		else {
			log.debug("Client connected, sessionId={}", session.getId());
		}
	}

	/**
	 * Periodically sends a ping message to each session
	 */
	@Scheduled(every = "{chat.heartbeat-interval}")
	public void heartbeat() {
		sessionService.all().forEach(session -> {
			try {
				session.getAsyncRemote().sendPing(empty);
				log.trace("Heartbeat sent to sessionId={}", session.getId());
			} catch (IOException e) {
				sessionService.remove(session);
				log.warn("Heartbeat failed, sessionId={}", session.getId());
			}
		});
	}

	/**
	 * Keeps the session alive if it has received a Pong message
	 */
	@OnMessage
	public void onPong(Session session, PongMessage pong) {
		sessionService.keepAlive(session);
		log.trace("Heartbeat received from sessionId={}", session.getId());
	}

	//@Timed(name = "message-delay", description = "Message processing time")
	//@Metered(name = "message-rate", description = "Number of messages per second")
	@OnMessage
	public void onMessage(Session session, String message) {
		sessionService.keepAlive(session);

		log.trace("Broadcasting message '{}' source.sessionId={}", message, session.getId());
		broadcast(message);
	}

	/**
	 * Sends a message to all sessions
	 */
	private void broadcast(String message) {
        sessionService.all().forEach(session -> {
            session.getAsyncRemote().sendObject(message, result ->  {
                if (result.getException() != null) {
                    log.warn(String.format("Failed to send message '{}' target.sessionId={}", message, session.getId()), result.getException());
                }
            });
        });
    }

	/**
	 * Removes the session from the registry if they disconnect
	 */
	@OnClose
	public void onClose(Session session) {
		sessionService.remove(session);
		log.debug("Client disconnected, sessionId={}", session.getId());
	}

}