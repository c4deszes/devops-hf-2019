./mvnw clean package
docker build -f src/main/docker/Dockerfile.jvm -t devops-hf/chat-service:jvm .