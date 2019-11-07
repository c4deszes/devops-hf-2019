package com.app;

import java.net.URI;
import java.util.concurrent.LinkedBlockingDeque;

import javax.websocket.ClientEndpoint;
import javax.websocket.ContainerProvider;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.PongMessage;
import javax.websocket.Session;

import org.junit.jupiter.api.Test;

import io.quarkus.test.common.http.TestHTTPResource;
import io.quarkus.test.junit.QuarkusTest;

//@QuarkusTest
public class ChatTest {

	private static final LinkedBlockingDeque<String> SERVER_OUTPUT = new LinkedBlockingDeque<>();

	@TestHTTPResource("/chat")
	URI uri;

	//@Test
	public void testChat() throws Exception {
		try (Session session = ContainerProvider.getWebSocketContainer().connectToServer(Client.class, uri)) {
			
		}
	}

	public void testHeartbeat() {

	}

	public void testRoomFull() {

	}

	public void testTimeout() {

	}
	
	@ClientEndpoint
	public static class Client {

		@OnOpen
		public void open(Session session) {
			
		}

		@OnMessage
		public void onMessage(Session session, String message) {
			SERVER_OUTPUT.add(message);
		}

		@OnMessage
		public void onPing(Session session, PongMessage pong) {

		}

		@OnClose
		public void onClose(Session session) {

		}
	}

}