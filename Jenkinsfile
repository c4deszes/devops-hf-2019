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
					//archive the following files/folders
					// /dist, /env, package-*.json
				}
			}
		}
	}
}