pipeline {
	agent {
		docker {
            image 'node' 
        }
	}
	stages {
		stage('Build') {
			//copy artifact from chat-backend & chat-frontend
			/* NOTE: 
				chat-frontend build output is inside /build
				which should be placed inside /dist/public
				that is part of the chat-backend project

				Currently there's docker operation that copies /build into /dist/public
			*/

			//sh docker build -t <repo>/chat-home:<version>
		}
		stage('Publish') {
			//withCredentials
			//sh docker push ...
		}
	}
}