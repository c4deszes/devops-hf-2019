FROM eu.gcr.io/devops-hf/chat-artifact-frontend AS artifact-frontend
WORKDIR /usr/src/app

FROM eu.gcr.io/devops-hf/chat-artifact-backend AS backend
WORKDIR /usr/src/app
COPY --from=artifact-frontend /usr/src/app/dist/public ./dist/public
RUN ["npm", "install"]
EXPOSE 8080
ENTRYPOINT ["npm", "run", "start"]