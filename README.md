# Chat Room

A chat room service that uses websockets to allow users to connect. Each message is forwarded to all participants.

It generates a random string as the service ID by which it registers as a Consul service. The service is tagged by the version number and has a meta tag 'inst' that is the ID of the room.

A service instance entry will look something like this

	{
		Name: 'chat-service'
		ID: 'chat-service-abc12'
		Tags: [ '1.0.0' ]
		Meta: {
			inst: 'abc12'
		}
	}

## Running in development mode

Run `./mvnw compile quarkus:dev`

## Building for JVM

Run `./mvnw clean package` to build the .jar, optionally add `-DskipTests`

Run `docker build -f src/main/docker/Dockerfile.jvm -t <repo>/chat-service:<version> .` to build the docker image

## Building a native image

Run `docker build -f src/main/docker/Dockerfile.multistage -t <repo>/chat-service:<version> .`

This is going to execute the same Maven steps but in a container and the resulting image will be optimized for GraalVM.

**Note**: application.properties isn't included in the build, you must pass the configuration as environment properties.
Using `docker run --env-file <path to properties file>` or the `env_file` property in the Docker Compose file.

For more information, see [Quarkus Building Native image](https://quarkus.io/guides/building-native-image)

## Running the application

Run `docker run -i --rm <repo>/chat-service:<version>`

## Configuration

### Server properties

|Property |Default value |Description |
|---|---|---|
|quarkus.http.port |8080 |HTTP Port of the server |
|consul.enabled |true |Enables Consul service registry
|consul.host |127.0.0.1 |Consul server location |
|consul.port |8500 |Consul server port |

### Chat properties

|Property |Default value |Description |
|---|---|---|
|chat.max-clients |2 |Maximum number of concurrent websocket connections |
|chat.kill-empty |true | The service terminates if there're no users connected
|chat.clear-interval |30s |Periodically timed out clients will be removed, uses Go's timeformat |
|chat.heartbeat-interval |10s |Periodically the server will send a ping to each client, uses Go's timeformat |
|chat.timeout |10000 |Maximum duration of the client not responding to a heartbeat | 

## Using the service

Connect to `ws:/<SERVER_IP>:<SERVER_PORT>/chat`

You can test the service by using a websocket client like [Simple WebSocket Client](https://chrome.google.com/webstore/detail/simple-websocket-client/pfdhoblngboilpfeibdedpjgfnlcodoo)

## About



*Created by Balazs Eszes*