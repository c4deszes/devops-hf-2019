pipeline {
	agent {
		docker {
            image 'node' 
        }
	}
	stages {
		stage('Build') {
			//copy artifact from chat-backend & chat-frontend

			//sh docker build -t <repo>/chat-home:<version> .
		}
		stage('Publish') {
			//withCredentials
			//sh docker push ...
		}
	}
}