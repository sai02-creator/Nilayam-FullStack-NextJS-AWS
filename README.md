# 🏡 Nilayam — Full-Stack Airbnb-Style Rental Platform

Nilayam is a full-stack accommodation marketplace inspired by platforms such as Airbnb. It allows users to discover properties, view detailed listings, authenticate securely, make reservations, and manage their bookings.

The project was built with **Next.js, TypeScript, PostgreSQL, Prisma, Docker, AWS, Terraform, GitHub Actions, and Kubernetes**, with a focus on modern full-stack development, cloud deployment, infrastructure as code, containerisation, CI/CD, and cloud-native deployment.

---

## 🚀 Live Application

**Production:**  
http://nilayam-alb-1594002907.ap-southeast-2.elb.amazonaws.com

The production application is deployed on **AWS ECS/Fargate** behind an **Application Load Balancer**.

> **Note:** The production URL currently uses HTTP. HTTPS and a custom domain can be added later using AWS Certificate Manager and Route 53.

---

# 📌 Project Overview

Nilayam provides a complete accommodation-booking experience with:

- User registration and authentication
- User login and logout
- Property listing creation
- Property discovery
- Property categories
- Property detail pages
- Image galleries
- Location information
- Guest, room and bathroom information
- Price-per-night information
- Reservation creation
- Reservation management
- Reservation cancellation
- Responsive design
- PostgreSQL persistence
- Docker containerisation
- AWS cloud deployment
- Infrastructure as Code
- Automated CI/CD
- Local Kubernetes deployment

---

# 🛠️ Technology Stack

## Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**
- **date-fns**

## Backend

- **Next.js Server Actions**
- **NextAuth**
- **Prisma ORM**
- **Node.js**

## Database

- **PostgreSQL**
- **Neon PostgreSQL**

## Containerisation

- **Docker**
- **Docker Desktop**

## AWS / Cloud

- **Amazon ECR**
- **Amazon ECS**
- **AWS Fargate**
- **Application Load Balancer**
- **Amazon VPC**
- **Security Groups**
- **IAM**

## Infrastructure as Code

- **Terraform**

## CI/CD

- **GitHub Actions**

## Kubernetes

- **Kubernetes**
- **Docker Desktop Kubernetes**
- **kind**
- **Kubernetes Deployment**
- **Kubernetes Service**
- **Kubernetes Secret**

---

# 🏗️ Architecture

## Production Architecture

```text
                         Internet
                            │
                            ▼
                 ┌─────────────────────┐
                 │   AWS ALB           │
                 │   HTTP :80          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   ECS Service       │
                 │   AWS Fargate       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Nilayam Container │
                 │   Next.js :3000     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Neon PostgreSQL   │
                 └─────────────────────┘
☁️ AWS Infrastructure

Nilayam's AWS infrastructure is managed using Terraform.

AWS components
AWS
│
├── VPC
│
├── Subnets
│
├── Security Groups
│
├── Amazon ECR
│
├── ECS Cluster
│
├── ECS Service
│
├── ECS Task Definition
│
├── AWS Fargate
│
├── Application Load Balancer
│
├── Target Group
│
├── ALB Listener
│
└── IAM Execution Role

🔄 CI/CD Deployment Flow

Every push to the main branch triggers the GitHub Actions deployment workflow.

Developer
    │
    ▼
Git Push
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Checkout repository
    │
    ├── Configure AWS credentials
    │
    ├── Login to Amazon ECR
    │
    ├── Build Docker image
    │
    ├── Push image to ECR
    │
    ├── Update ECS task definition
    │
    └── Deploy to ECS
    │
    ▼
AWS ECS / Fargate
    │
    ▼
Application Load Balancer
    │
    ▼
Nilayam

Docker images are tagged using the GitHub commit SHA so each deployment can be traced back to the exact source commit that produced the image.
🐳 Docker

Nilayam is containerised using Docker.

The Docker image contains:

Node.js
Next.js application
Prisma Client
Application dependencies
Production build

Database credentials are not baked into the Docker image.

Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
Build locally
docker build -t nilayam:latest .
Run locally
docker run --env-file .env -p 3000:3000 nilayam:latest

Open:

http://localhost:3000

🗄️ Database

Nilayam uses PostgreSQL hosted by Neon.

Prisma ORM is used for database access and schema management.

Main data relationships
User
 │
 ├── Account
 ├── Session
 ├── Listing
 └── Reservation

Listing
 │
 └── Reservation
Main entities
User

Stores user accounts and authentication-related information.

Listing

Stores accommodation information including:

Title
Description
Images
Category
Guest count
Room count
Bathroom count
Location
Price per night
Host
Reservation

Stores:

User
Listing
Start date
End date
Total price
Creation date
🔐 Environment Variables

Sensitive configuration is stored outside the source code.

Example:

DATABASE_URL=your_database_connection_string

Authentication-related environment variables may also be required depending on the configured authentication providers.

Important

.env must never be committed to Git.

Environment-specific credentials are supplied at runtime rather than being stored inside the application source code or Docker image.

🔑 Kubernetes Secrets

The local Kubernetes deployment uses a Kubernetes Secret for sensitive environment variables.

Create the Secret from your local .env file:

kubectl create secret generic nilayam-secrets \
  --from-env-file=.env

The Secret is intentionally not committed to GitHub.

The Kubernetes Deployment references it using:

envFrom:
  - secretRef:
      name: nilayam-secrets

This keeps sensitive runtime configuration outside the Docker image and Kubernetes manifests.

☸️ Kubernetes

Nilayam can also be deployed locally using Kubernetes through Docker Desktop.

The local cluster uses a single-node kind-based Kubernetes cluster.

Docker Desktop
      │
      ▼
Kubernetes Cluster
      │
      ▼
Deployment
      │
      ▼
Pod
      │
      ▼
Nilayam Container
📦 Kubernetes Deployment

The Kubernetes Deployment manages the Nilayam application Pod.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nilayam
spec:
  replicas: 1

The Deployment maintains the desired number of running Pods.

🌐 Kubernetes Service

The Nilayam Service exposes the application through Kubernetes networking.

Kubernetes Service
        │
        ▼
Nilayam Pod :3000

The project currently uses a NodePort Service for local Kubernetes development.

📁 Kubernetes Files
k8s/
├── deployment.yaml
└── service.yaml
▶️ Running Nilayam on Kubernetes
1. Start Docker Desktop Kubernetes

Make sure Docker Desktop Kubernetes is running.

Check the cluster:

kubectl get nodes

Expected:

NAME                    STATUS   ROLES
desktop-control-plane   Ready    control-plane
2. Create the Kubernetes Secret
kubectl create secret generic nilayam-secrets \
  --from-env-file=.env

Do not commit the generated Secret to Git.

3. Deploy Nilayam
kubectl apply -f k8s/deployment.yaml

Apply the Service:

kubectl apply -f k8s/service.yaml
4. Check Pods
kubectl get pods

Expected:

NAME                       READY   STATUS
nilayam-xxxxxxxxxx-xxxxx   1/1     Running
5. Check the Service
kubectl get services

Expected:

NAME              TYPE       PORT(S)
nilayam-service   NodePort   3000:30227/TCP
6. Access Nilayam

Use Kubernetes port forwarding:

kubectl port-forward service/nilayam-service 3000:3000

Then open:

http://localhost:3000
🔄 Kubernetes Application Flow
Docker Image
     │
     ▼
Kubernetes Deployment
     │
     ▼
Nilayam Pod
     │
     ▼
Nilayam Container
     │
     ▼
Kubernetes Service
     │
     ▼
localhost:3000

Runtime secrets are supplied separately:

Kubernetes Secret
       │
       ▼
Nilayam Pod
       │
       ▼
DATABASE_URL
       │
       ▼
Neon PostgreSQL
🏗️ Terraform

Terraform is used to manage the AWS infrastructure as code.

Instead of manually creating AWS resources through the AWS Console, infrastructure is defined in Terraform configuration files.

Terraform manages resources including:
VPC
Subnets
Security Groups
Amazon ECR
ECS Cluster
ECS Service
ECS Task Definition
Application Load Balancer
Target Group
ALB Listener
IAM configuration
Terraform workflow
terraform init
terraform plan
terraform apply

Terraform state files are excluded from Git.

🔁 GitHub Actions CI/CD

The project includes an automated deployment workflow under:

.github/workflows/deploy.yml

A push to main automatically:

Checks out the repository
Configures AWS credentials
Logs into Amazon ECR
Builds the Docker image
Pushes the image to ECR
Downloads the current ECS task definition
Updates the container image
Deploys the new task definition to ECS
Waits for ECS service stability

This provides an automated path from:

Git Push
   ↓
GitHub Actions
   ↓
Docker Build
   ↓
Amazon ECR
   ↓
ECS / Fargate
   ↓
Application Load Balancer
   ↓
Nilayam
🛡️ Security

Security considerations implemented in the project include:

Environment variables are kept outside source code
.env is excluded from Git
Kubernetes Secrets are used for sensitive runtime configuration
Database credentials are not stored in Kubernetes YAML
Database credentials are not baked into the cleaned Docker image
AWS credentials are stored as GitHub Actions secrets
ECS security groups restrict application traffic
Direct public access to the ECS application port was removed
Application traffic enters through the Application Load Balancer
📁 Project Structure
airbnb-clone/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── generated/
│   └── lib/
│
├── terraform/
│   └── *.tf
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
├── prisma.config.ts
└── README.md
💻 Local Development
Requirements

Install:

Node.js
npm
Docker Desktop
kubectl
Git

For Kubernetes development:

Docker Desktop Kubernetes
Install dependencies
npm install
Configure environment variables

Create:

.env

Add the required environment variables.

Generate Prisma Client
npx prisma generate
Run database migrations
npx prisma migrate dev
Start development server
npm run dev

Open:

http://localhost:3000
🧪 Useful Commands
Next.js
npm run dev
npm run build
npm start
Docker

List images:

docker images

List running containers:

docker ps

Build the application:

docker build -t nilayam:latest .

Run the application:

docker run --env-file .env -p 3000:3000 nilayam:latest
Kubernetes

Check cluster:

kubectl cluster-info

Check nodes:

kubectl get nodes

Check Pods:

kubectl get pods

Check Services:

kubectl get services

Check Deployments:

kubectl get deployments

Check Pod logs:

kubectl logs deployment/nilayam

Check Deployment status:

kubectl rollout status deployment/nilayam

Restart a Deployment:

kubectl rollout restart deployment/nilayam

Describe a Pod:

kubectl describe pod <pod-name>

Forward the Service to localhost:

kubectl port-forward service/nilayam-service 3000:3000
📊 Deployment Environments
Environment	Platform	Purpose
Local	Next.js	Development
Local	Docker	Container testing
Local	Kubernetes	Kubernetes learning/testing
AWS	ECS/Fargate	Production deployment
AWS	Application Load Balancer	Public traffic routing
AWS	Amazon ECR	Container image registry
AWS	Terraform	Infrastructure as Code
GitHub	GitHub Actions	CI/CD
🎯 What This Project Demonstrates

Nilayam demonstrates practical experience across the full software delivery lifecycle.

Application Development
React
Next.js
TypeScript
Server-side functionality
Authentication
Database integration
Responsive UI
Backend & Data
PostgreSQL
Prisma ORM
Database migrations
Relational data modelling
DevOps
Docker
Containerisation
Amazon ECS
AWS Fargate
Application Load Balancer
Amazon ECR
Terraform
GitHub Actions
CI/CD
Cloud-Native
Kubernetes
Pods
Deployments
Services
Secrets
Container orchestration
Local Kubernetes development
AWS/EKS architecture concepts
🧠 Kubernetes Concepts Practised

This project provides hands-on experience with:

Kubernetes Cluster
       │
       └── Node
             │
             ├── Deployment
             │      │
             │      └── Pod
             │             │
             │             └── Container
             │
             ├── Service
             │
             └── Secret

The project demonstrates the separation of:

Application code
Container images
Runtime configuration
Secrets
Networking
Workload management
🔮 Future Improvements

Potential future improvements include:

HTTPS with AWS Certificate Manager
Custom domain with Route 53
Private ECS subnets
NAT Gateway architecture
CloudWatch monitoring
Centralised application logging
ECS autoscaling
Kubernetes readiness probes
Kubernetes liveness probes
Kubernetes resource requests and limits
Horizontal Pod Autoscaling
Kubernetes Ingress
Production Kubernetes deployment with Amazon EKS
Observability and metrics
Automated testing in CI/CD
Automated database migration strategy
💰 Cost-Conscious Kubernetes Architecture

The Kubernetes learning environment is intentionally local.

Instead of creating an Amazon EKS cluster, Kubernetes currently runs through Docker Desktop.

Kubernetes Learning
        │
        ▼
Docker Desktop
        │
        ▼
Local Kubernetes
        │
        ▼
No EKS infrastructure required

This allows Kubernetes concepts and workloads to be practised locally without creating a paid EKS cluster.

AWS ECS/Fargate remains the production deployment environment.

🧭 Project Journey

Nilayam was developed progressively through the following engineering stages:

1. Full-Stack Application
          │
          ▼
2. PostgreSQL + Prisma
          │
          ▼
3. Docker
          │
          ▼
4. AWS ECR
          │
          ▼
5. AWS ECS / Fargate
          │
          ▼
6. Application Load Balancer
          │
          ▼
7. Terraform
          │
          ▼
8. GitHub Actions CI/CD
          │
          ▼
9. Kubernetes
          │
          ▼
10. Kubernetes Secrets

This progression demonstrates how a modern web application can move from local development to containerisation, infrastructure as code, automated cloud deployment, and container orchestration.

👨‍💻 Author

Sai Chaitanya Gaddam

Full-Stack Developer | Cloud & DevOps Enthusiast

Technologies
JavaScript
TypeScript
React
Next.js
Python
Django
Node.js
PostgreSQL
Prisma
Docker
AWS
Terraform
GitHub Actions
Kubernetes
⭐ Project Goal

Nilayam was built not only as a full-stack application, but as an end-to-end engineering project covering:

Build
  ↓
Containerise
  ↓
Infrastructure as Code
  ↓
Cloud Deployment
  ↓
CI/CD
  ↓
Container Orchestration
  ↓
Production Architecture

The goal is to demonstrate how a modern full-stack application can be developed, containerised, deployed to AWS, automated through CI/CD, and orchestrated using Kubernetes.
```
