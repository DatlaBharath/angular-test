pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/DatlaBharath/angular-test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build --production'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def imageName = "sakthisiddu1/angular-test:${env.BUILD_NUMBER}"
                    sh "docker build -t ${imageName} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh 'echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin'
                        def imageName = "sakthisiddu1/angular-test:${env.BUILD_NUMBER}"
                        sh "docker push ${imageName}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def deploymentYaml = """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: angular-test-deployment
  labels:
    app: angular-test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: angular-test
  template:
    metadata:
      labels:
        app: angular-test
    spec:
      containers:
      - name: angular-test
        image: sakthisiddu1/angular-test:${env.BUILD_NUMBER}
        ports:
        - containerPort: 80
"""

                    def serviceYaml = """
apiVersion: v1
kind: Service
metadata:
  name: angular-test-service
spec:
  selector:
    app: angular-test
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30007
  type: NodePort
"""

                    sh """echo "$deploymentYaml" > deployment.yaml"""
                    sh """echo "$serviceYaml" > service.yaml"""

                    sh 'ssh -i /var/test.pem -o StrictHostKeyChecking=no ubuntu@13.233.85.37 "kubectl apply -f -" < deployment.yaml'
                    sh 'ssh -i /var/test.pem -o StrictHostKeyChecking=no ubuntu@13.233.85.37 "kubectl apply -f -" < service.yaml'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment was successful'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}