pipeline {
	environment {
		IMAGE_REPO = '' //
	}
    agent {
        docker {
			//This image contains the GraalVM installation
            image 'quay.io/quarkus/centos-quarkus-maven:19.2.1'
        }
    }
    stages {
		stage('Build Native') {
			steps {
				//sh mvn clean package -Pnative -Dnative-image.docker-build=true
				//sh docker build -f src/main/docker/Dockerfile.native -t ${IMAGE_REPO}:native-${VERSION}

				/*
					NOTE: instructions are inside Dockerfile.native as well
				*/
			}
			post {
				success {
					//docker push with credentials
				}
			}
		}
		stage('Build JVM') {
			steps {
				//sh mvn clean package 
				//sh docker build -f src/main/docker/Dockerfile.jvm -t ${IMAGE_REPO}:jvm-${VERSION}
			}
			post {
				sucsess {
					//docker push with credentials
				}
			}
		}
		post {
			//clean workspace
		}
    }
}