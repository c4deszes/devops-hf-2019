def branch_name = "${BRANCH_NAME}"
pipeline {
  environment {
    registry = "eu.gcr.io/devops-hf/chat-service"
    registryCredential = ''
    dockerImage = ''
    IMAGE_TAG = "$BUILD_NUMBER"
    NAMESPACE = "chat"
    DOMAIN = "mbraptor.tech"
  }
  agent any
  stages {
    stage('Build image') {
      steps{
        script {
          dockerImage = docker.build(registry + ":$IMAGE_TAG", "-f src/main/docker/Dockerfile.jvm .")
        }
      }
    }
    stage('Push image to GCR') {
      steps{
        script {
          docker.withRegistry("https://" + registry) {
            dockerImage.push()
          }
        }
      }
    }
    stage('Remove unused image') {
      steps{
        sh(script: "docker rmi $registry:$IMAGE_TAG", returnStdout: true)
      }
    }
    stage('Deploy to Kubernetes') {
      steps{
        sh(script: "echo TODO", returnStdout: true)
      }
    }
  }
}