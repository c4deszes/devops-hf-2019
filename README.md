# Chat backend & frontend merge task

This task merges the frontend and the backend into a single docker container.

## Instructions

1. Create a pipeline using `Jenkinsfile`

2. Set chat-frontend & chat-backend as build triggers
   
3. Add a hook or pollscm option so it detects this configuration changing

## Local build

Run `build-local.sh` to build the docker image locally.

|Option |Description
|--|--
|--skip-build |Skips the build step of both projects