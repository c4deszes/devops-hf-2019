# Chat Backend

Application entrypoint, allows the discovery and creation of chat rooms. Also used to serve the frontend files.

## Running in development mode

Run `npm run start-dev`, this is needed because it uses Typescript so there's no `start.js`

The server can then be accessed at http://127.0.0.1:3000

## Building

Run `npm run build`

The build output will be inside the `/dist` folder

## Running

Run `npm run start` from the project folder

The server can then be accessed at http://127.0.0.1:8080

## Using

The service responds to the following requests

|Method |Path |Response |Description
|---|---|---|---|
|GET |/api/rooms |`[{ID: '..'}, {ID: '..'}]` |Returns all the rooms
|GET |/api/health |`{status: 'up'}` |Returns service health
|POST |/api/create |`{ID: '..'}` |Creates a new room
|GET |* |[index.html](/src/public/index.html) |Returns the homepage

## Configuration

Environmental variables used in production

|Property |Default value
|---|---|
|PORT |8080
|CORS_DISABLED |false
|K8S_NAMESPACE |chat