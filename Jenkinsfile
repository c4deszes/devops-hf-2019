pipeline {
    agent {
        docker {
			//This image contains the GraalVM installation
            image 'quay.io/quarkus/centos-quarkus-maven:19.2.0.1'
        }
    }
    stages {
        stage('Build') { 
            steps {
                //maven build with -Pnative
				//maybe skip tests
            }
            post {
                success {
                    archiveArtifacts(
                        artifacts: ['target', 'src/main/docker'],
                        onlyIfSuccessful: true,
                        defaultExcludes: false
                    )
                    cleanWs()
                }
            }
        }
		stage('Create image') {
			steps {
				//sh docker build -f src/main/docker/Dockerfile.native -t <some tag>:version .
			}
		}
		stage('Publish image') {
			steps {
				//docker push with credentials
			}
		}
    }
}