//Definición de variables
def versionImage = '1.0.'
def applicationName = 'poc-devops-front-local'
def namespace = 'default'
def projectGCP = 'gcpcert-272801'

pipeline {
    agent none

    stages {
        stage('Preparar Entorno') {
            agent any
            steps {
                echo '***** Se agrega el archivo de configuración  *****'
                //sh 'cp /home/mauricio/wrkspc-cloud/front-caja/galileo/.env .'
            }
        }
        stage('**** Construcción Proyecto ****') {
            agent {
                docker {
                    //Virtualmente Jenkins crea un agente de npm para compilar 
                    image 'node:13.12.0-alpine'
                    args '-p 3000:3000'
                }
            }
            environment {HOME = '.'}
            steps {
                echo '*****  Inicia construcción del proyecto... *****'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('****  Construcción Imagen *****') {
            agent any
            steps {
                echo 'Armando la imagen Docker para subir a Google Cloud Platform'
                sh "docker build -f docker/Dockerfile -t  gcr.io/${projectGCP}/${applicationName}:${versionImage}${env.BUILD_NUMBER} ."
            }
        }
        stage('**** Push a GCP ****') {
            agent any
            steps {
                echo 'Inicia el envío de la imagen al Container Registry...'
                sh "docker push gcr.io/${projectGCP}/${applicationName}:${versionImage}${env.BUILD_NUMBER}"
            }
        }
        stage('****  Pruebas ****') {
            agent any
            steps {
                echo 'Se lanzan las pruebas unitarias...'
            }
        }
        stage('*****  Desplegado en la nube *****') {
            agent any
            steps {
                echo 'Comienza desplegado en desarrollo...'
                echo 'Se crea el namespace si no existe'
                sh "kubectl get ns ${namespace} || kubectl create ns ${namespace}"
                echo 'Se actualiza el deployment.yaml para que tome la última versión'
                sh "sed -i.bak 's#.*gcr.io.*#        image: gcr.io/${projectGCP}/${applicationName}:${versionImage}${env.BUILD_NUMBER}#'  kubernetes/deployment.yaml"
                echo 'Crea o actualiza el recurso'
                sh "kubectl --namespace=${namespace} apply -f kubernetes/deployment.yaml"
                sh "kubectl --namespace=${namespace} apply -f kubernetes/service.yaml"
                
            }
        }
    }

    post {
        always {
            echo 'Se realizan las operaciones finales ...'
        }
    }
}
