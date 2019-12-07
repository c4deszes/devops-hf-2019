def branch_name = "${BRANCH_NAME}"
pipeline {
  environment {
    registry = "eu.gcr.io/devops-hf/chat-artifact-backend"
    registryCredential = ''
    dockerImage = ''
    IMAGE_TAG = "latest"
    NAMESPACE = "chat"
    DOMAIN = "mbraptor.tech"
  }
  agent any
  stages {
    stage('Build image') {
      steps{
        script {
          dockerImage = docker.build(registry + ":$IMAGE_TAG")
        }
      }
    }
  }
}