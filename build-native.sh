echo 'Warning: the native build can take minutes or hours.'

docker build -f src/main/docker/Dockerfile.multistage -t devops-hf/chat-service:native .