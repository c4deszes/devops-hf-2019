pipeline {
	agent {
		docker {
			image 'node'
		}
	}
	stages {
		stage('Build') {
			steps {
				//npm run build
			}
			post {
				success {
					//archive the /build folder
				}
			}
		}
	}
}