def branch_name = "${BRANCH_NAME}"
pipeline {
  environment {
    registry = "eu.gcr.ui/devops-hf/chat-service"
    registryCredential = ''
    dockerImage = ''
    IMAGE_TAG = "$BUILD_NUMBER"
    NAMESPACE = "chat"
    DOMAIN = "mbraptor.tech"
  }
  agent {
		// Equivalent to "docker build -f Dockerfile.build --build-arg version=1.0.2 ./build/
	dockerfile {
		filename 'src/main/docker/Dockerfile.multistage'
		dir '.'
	}
  }
  stages {
    stage('Build image') {
      steps{
        script {
          dockerImage = docker.build registry + ":$IMAGE_TAG"
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