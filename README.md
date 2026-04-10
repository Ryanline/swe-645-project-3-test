# SWE 645 Project 3 Practice Runbook

## Purpose

This repository is a practice workspace for completing SWE 645 Homework Assignment 3 before recording a from-scratch demo video. The goal of this README is to capture every important step in order so the project can be repeated later with minimal improvisation.

## Assignment Summary

Based on `Project-3-Instructions-Rubric.pdf`, the project requires:

1. A React frontend for the Student Survey application.
2. A FastAPI backend using SQLModel/SQLAlchemy for REST APIs and persistence.
3. CRUD operations for survey records.
4. Containerization with Docker.
5. Deployment to Kubernetes using Helm charts.
6. Documentation and a voice-over demo video.

## Video Checklist

Use this as the recommended flow for the recorded walkthrough.

1. Introduce the assignment goal and the required stack.
2. Show the project structure and explain frontend, backend, Docker, and Helm folders.
3. Show the backend code at a high level:
   - survey model
   - database setup
   - CRUD routes
4. Show the frontend code at a high level:
   - survey form
   - list/edit/delete flow
   - API integration
5. Show local run commands for backend and frontend.
6. Demonstrate local CRUD behavior if you want a pre-cloud checkpoint.
7. Show Dockerfiles and explain why the apps were containerized.
8. Show the ECR repositories and explain that images are stored there for Kubernetes deployment.
9. Show the EKS cluster and explain that Kubernetes is running the app.
10. Show the RDS instance and explain that survey data is stored in MySQL.
11. Show the Elastic IP backed ingress load balancer and explain how the app becomes publicly reachable.
12. Show the deployed frontend in the browser.
13. Demonstrate:
   - create survey
   - list surveys
   - edit survey
   - delete survey
14. Show the public `/api/health` endpoint or a survey API response briefly.
15. Close with the deployed URL, what was built, and where the documentation is.

## What To Say

Use these as short narration prompts, not as lines you must read word-for-word.

### Phase 1 Talk Track

What we are doing:
We are first reading the rubric and extracting the exact requirements so the implementation matches what the course is grading.

Why we are doing it:
This keeps the project focused on the required CRUD features, the required React and FastAPI stack, and the required Kubernetes plus Helm deployment.

### Phase 2 Talk Track

What we are doing:
We are building the full-stack application locally first, with React on the frontend and FastAPI plus SQLModel on the backend.

Why we are doing it:
Local development lets us verify the business logic and user flows before adding deployment complexity. It is much easier to debug code locally than after it is containerized and deployed.

### Phase 3 Talk Track

What we are doing:
We are containerizing the frontend and backend with Docker.

Why we are doing it:
Containers make the runtime environment reproducible, portable, and suitable for Kubernetes deployment. This is the bridge between development and cloud deployment.

### Phase 4 Talk Track

What we are doing:
We are provisioning the database and connecting the backend to a persistent MySQL instance.

Why we are doing it:
The project requires persistence for survey CRUD operations, and using RDS gives us managed relational storage that works cleanly with the deployed backend.

### Phase 5 Talk Track

What we are doing:
We are deploying both applications to Kubernetes with Helm and exposing them through a single ingress path.

Why we are doing it:
Helm gives us reusable deployment configuration, Kubernetes manages the running containers, and the ingress gives us one public entry point for both the frontend and the backend API.

### AWS Talk Track

What we are doing:
We are using ECR for image storage, EKS for Kubernetes, RDS for MySQL, and an ingress load balancer with Elastic IPs for public access.

Why we are doing it:
Each AWS service maps to one deployment need: image hosting, orchestration, persistence, and network exposure. The Elastic IPs are used only at the public load balancer layer, where stable public addresses actually matter.

### Verification Talk Track

What we are doing:
We are verifying the deployment through the browser and through live API requests.

Why we are doing it:
This proves the system is not only deployed, but functionally working end to end, including storage, routing, and public access.

### Teardown Talk Track

What we are doing:
We are documenting how to remove the AWS resources after practice.

Why we are doing it:
Cloud resources continue billing until they are deleted, so teardown is part of a responsible and reproducible deployment workflow.

## Working Agreement For This Practice Run

1. Codex will do as much implementation work as possible inside this project folder.
2. Any steps that must be done manually in AWS, Kubernetes dashboards, or similar UIs will be called out clearly.
3. This README will be updated continuously so it becomes the exact runbook for the later recorded version.
4. If any AWS label, menu item, or setting differs from what is documented here, we will correct the README so the final instructions stay accurate.

## High-Level Architecture

1. `frontend/`: React application for creating, viewing, updating, and deleting student surveys.
2. `backend/`: FastAPI application exposing survey CRUD endpoints and connecting to a relational database.
3. `docker/`: Container definitions and related deployment notes if needed.
4. `helm/`: Helm chart for deploying frontend and backend to Kubernetes.

## Current Implementation Snapshot

1. Frontend completed:
   - React + TypeScript + Vite scaffold
   - Survey create form
   - Survey list view
   - Edit survey workflow
   - Delete survey workflow
   - Backend API integration
2. Backend completed:
   - FastAPI application
   - SQLModel persistence layer
   - Local SQLite default configuration
   - REST endpoints for create, list, get, update, and delete
   - Health endpoint for deployment probes
3. Deployment scaffolding completed:
   - Backend Dockerfile
   - Frontend Dockerfile
   - Helm chart with frontend, backend, secret, services, and ingress

## Practice Run Steps

### Phase 1: Understand Requirements

1. Read the assignment rubric.
2. Confirm the required fields for the survey form:
   - First name
   - Last name
   - Street address
   - City
   - State
   - Zip
   - Telephone number
   - Email
   - Date of survey
   - What they liked most about the campus
   - How they became interested in the university
   - Recommendation likelihood
3. Confirm that CRUD functionality is required:
   - Create a survey
   - Read all surveys
   - Read one survey
   - Update one survey
   - Delete one survey
4. Confirm the deployment expectations:
   - Dockerized frontend
   - Dockerized backend
   - Kubernetes deployment
   - Helm chart packaging

### Phase 2: Local Development Setup

1. Create the project folder structure.
2. Build the backend API using FastAPI and SQLModel.
3. Build the frontend UI using React.
4. Connect the frontend to the backend APIs.
5. Test CRUD operations locally.
6. Record the exact local run commands here once finalized.

Code overview for this phase:
Backend API, database models, validation, and routes are implemented here. Frontend form pages, list/detail/edit views, and API integration are also implemented here.

Local commands used during this phase:

1. Backend dependency install:
   ```powershell
   cd backend
   python -m pip install -r requirements.txt
   ```
2. Frontend dependency install:
   ```powershell
   cd frontend
   npm install
   ```
3. Backend local run:
   ```powershell
   cd backend
   uvicorn app.main:app --reload
   ```
4. Frontend local run:
   ```powershell
   cd frontend
   npm run dev
   ```
5. Frontend production build verification:
   ```powershell
   cd frontend
   npm run build
   ```
6. Backend CRUD smoke test summary:
   - Health endpoint returned `200`
   - Create returned `201`
   - List returned created survey
   - Update returned `200`
   - Delete returned `204`

Files created in this phase:

1. `backend/app/main.py`
2. `backend/app/models.py`
3. `backend/app/database.py`
4. `backend/requirements.txt`
5. `backend/.env.example`
6. `frontend/src/App.tsx`
7. `frontend/src/api.ts`
8. `frontend/src/types.ts`
9. `frontend/src/main.tsx`
10. `frontend/src/styles.css`

### Phase 3: Containerization

1. Create a Dockerfile for the backend.
2. Create a Dockerfile for the frontend.
3. Define runtime environment variables.
4. Build containers locally.
5. Test the containers locally.

Code overview for this phase:
Application startup commands, environment configuration, and image build instructions are created here.

Files created in this phase:

1. `backend/Dockerfile`
2. `frontend/Dockerfile`

Current verification note:

1. Dockerfiles are written.
2. Docker image builds were attempted.
3. Docker daemon was not running on this machine at the time of verification, so image build validation is still pending.

### Phase 4: Database Provisioning

1. Decide which database to use for the practice run.
2. If using Amazon RDS MySQL, create it in development or sandbox mode only.
3. Capture all required configuration values:
   - DB host
   - DB port
   - DB name
   - DB username
   - DB password
4. Update backend configuration to use the database.
5. Test that the backend can connect successfully.

Manual step placeholder:
This phase will include AWS console actions if we use RDS. Those will be written out precisely after we confirm the actual screens and labels.

Planned practice-run choice:

1. Local development database: SQLite
2. AWS deployment database: Amazon RDS MySQL

### Phase 5: Kubernetes Deployment

1. Prepare Kubernetes manifests or Helm values for frontend and backend.
2. Create the Helm chart structure.
3. Template the frontend deployment and service.
4. Template the backend deployment and service.
5. Add configuration and secret handling.
6. Deploy to the Kubernetes cluster with Helm.
7. Verify Pods, Services, and application accessibility.

Code overview for this phase:
Helm templates, chart metadata, values files, service exposure, and deployment configuration are created here.

Manual step placeholder:
Any cloud Kubernetes setup steps, ingress configuration, or cluster console work will be documented as exact numbered actions.

Files created in this phase:

1. `helm/student-survey/Chart.yaml`
2. `helm/student-survey/values.yaml`
3. `helm/student-survey/templates/backend-secret.yaml`
4. `helm/student-survey/templates/backend-deployment.yaml`
5. `helm/student-survey/templates/backend-service.yaml`
6. `helm/student-survey/templates/frontend-deployment.yaml`
7. `helm/student-survey/templates/frontend-service.yaml`
8. `helm/student-survey/templates/ingress.yaml`

Deployment design currently assumed:

1. Amazon EKS hosts the Kubernetes cluster.
2. Frontend and backend run as separate Deployments.
3. Frontend and backend are exposed behind one Ingress.
4. Frontend uses `/api` on the same host to reach the backend.
5. Backend database connection is stored in a Kubernetes Secret created by Helm.
6. Public ingress uses an AWS Network Load Balancer with Elastic IPs attached.

### Phase 5A: AWS Preparation Steps For The Practice Run

These are the first manual steps expected for the AWS-hosted path. We will refine wording as actual screens are confirmed.

1. Install AWS CLI on the local machine.
2. Install Helm on the local machine.
3. Sign in to the AWS Console.
4. Choose one AWS region for the whole project and use it consistently.
5. Create or confirm IAM permissions for:
   - EKS
   - ECR
   - RDS
   - VPC/security groups
6. Decide whether the EKS cluster will be created:
   - Through the AWS Console
   - Through `eksctl`
   - Through Terraform or CloudFormation
7. Create two container repositories in Amazon ECR:
   - One for frontend image
   - One for backend image
8. Create an Amazon RDS MySQL instance in development or sandbox mode.
9. Create an Amazon EKS cluster.
10. Install an ingress controller in the EKS cluster.
11. Push the frontend and backend images to ECR.
12. Update Helm values with ECR image URLs, database connection details, and ingress host.
13. Deploy the Helm chart to EKS.
14. Verify Pods, Services, Ingress, and application access.

Current tooling notes for this phase:

1. `Helm` installation was attempted with `winget` and completed successfully.
2. The current shell session did not automatically pick up the new `PATH`, so a new terminal may be needed before `helm` works as a normal command.
3. `AWS CLI` MSI installation was unreliable in this shell environment, so a Python user-level install was used as a fallback.
4. On this machine, confirmed tool paths are:
   - `eksctl`: `C:\Users\15713\bin\eksctl.exe`
   - `helm`: `C:\Users\15713\AppData\Local\Microsoft\WinGet\Packages\Helm.Helm_Microsoft.Winget.Source_8wekyb3d8bbwe\windows-amd64\helm.exe`
   - `aws`: `C:\Users\15713\AppData\Roaming\Python\Python314\Scripts\aws.cmd`
5. For the recorded run, the goal should still be to use normal `PATH`-based commands after opening a fresh terminal and confirming installs.

### Phase 5B: Command-First AWS Setup Flow

Use these commands as the starting point for the AWS-hosted run. Replace placeholder values before running them.

1. Install AWS CLI v2 on Windows.
   ```powershell
   msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
   ```
2. Open a new terminal and verify the install.
   ```powershell
   aws --version
   ```
3. If `aws` is not on `PATH` yet on this machine, the currently working fallback path is:
   ```powershell
   & "$env:APPDATA\Python\Python314\Scripts\aws.cmd" --version
   ```
4. Configure AWS CLI credentials.
   ```powershell
   aws configure
   ```
5. Confirm the identity being used.
   ```powershell
   aws sts get-caller-identity
   ```
6. Install `eksctl` for Windows by downloading the latest official release ZIP and extracting `eksctl.exe` into a folder already in `PATH`, or a folder you add to `PATH`.
7. Verify `eksctl`.
   ```powershell
   eksctl version
   ```
8. Verify `kubectl`.
   ```powershell
   kubectl version --client
   ```
9. Verify `helm`.
   ```powershell
   helm version
   ```
10. Create ECR repositories.
   ```powershell
   aws ecr create-repository --region us-east-1 --repository-name student-survey-frontend
   aws ecr create-repository --region us-east-1 --repository-name student-survey-backend
   ```
   Confirmed results for this practice account:
   - `390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-frontend`
   - `390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-backend`
11. Authenticate Docker to Amazon ECR. Replace `<account-id>` with your AWS account ID.
   ```powershell
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   ```
12. Build and tag the backend image. Replace `<account-id>`.
   ```powershell
   cd backend
   docker build -t student-survey-backend:latest .
   docker tag student-survey-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/student-survey-backend:latest
   ```
13. Push the backend image.
   ```powershell
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/student-survey-backend:latest
   ```
14. Build and tag the frontend image. Replace `<account-id>`.
   ```powershell
   cd frontend
   docker build -t student-survey-frontend:latest .
   docker tag student-survey-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/student-survey-frontend:latest
   ```
15. Push the frontend image.
   ```powershell
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/student-survey-frontend:latest
   ```
16. Create the EKS cluster with `eksctl`. This uses `us-east-1`, creates two managed nodes, and names the cluster `swe645-project3-cluster`.
   ```powershell
   eksctl create cluster --name swe645-project3-cluster --region us-east-1 --nodes 2 --node-type t3.medium --managed
   ```
   Practice run adjustment used in reality to reduce cost:
   ```powershell
   eksctl create cluster --name swe645-project3-cluster --region us-east-1 --nodes 1 --nodes-min 1 --nodes-max 2 --node-type t3.small --managed
   ```
17. Update local kubeconfig after cluster creation.
   ```powershell
   aws eks update-kubeconfig --region us-east-1 --name swe645-project3-cluster
   ```
18. Verify cluster connectivity.
   ```powershell
   kubectl get nodes
   kubectl get svc
   ```
19. Create the RDS MySQL instance. Replace placeholders before running.
   ```powershell
   aws rds create-db-instance `
     --region us-east-1 `
     --db-instance-identifier swe645-project3-mysql `
     --db-instance-class db.t3.micro `
     --engine mysql `
     --engine-version 8.0 `
     --allocated-storage 20 `
     --master-username <db-username> `
     --master-user-password <db-password> `
     --db-name student_surveys `
     --publicly-accessible `
     --backup-retention-period 0
   ```
20. Wait for RDS to become available, then capture the endpoint.
   ```powershell
   aws rds describe-db-instances --region us-east-1 --db-instance-identifier swe645-project3-mysql
   ```
   Confirmed endpoint for this practice run:
   - `swe645-project3-mysql.ckx8ccwwessg.us-east-1.rds.amazonaws.com`
21. Update [values.yaml](F:/dev/projects/homework/SWE-645/swe-645-project-3-test/helm/student-survey/values.yaml) with:
   - ECR frontend image URL
   - ECR backend image URL
   - RDS connection string
   - final ingress host
22. Deploy the Helm chart.
   ```powershell
   helm install student-survey-release .\\helm\\student-survey
   ```
23. Verify deployment resources.
   ```powershell
   kubectl get pods
   kubectl get svc
   kubectl get ingress
   ```
24. If values change later, upgrade the release instead of reinstalling it.
   ```powershell
   helm upgrade student-survey-release .\\helm\\student-survey
   ```

### Phase 5C: Actual AWS Resources Created During This Practice Run

1. AWS account:
   - `390449413488`
2. EKS cluster:
   - Name: `swe645-project3-cluster`
   - Region: `us-east-1`
   - Kubernetes version: `1.34`
3. ECR repositories:
   - `390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-frontend`
   - `390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-backend`
4. RDS MySQL instance:
   - Identifier: `swe645-project3-mysql`
   - Endpoint: `swe645-project3-mysql.ckx8ccwwessg.us-east-1.rds.amazonaws.com`
   - Port: `3306`
   - Visibility: private only
5. Elastic IPs used for the public ingress load balancer:
   - `44.207.19.25` with allocation ID `eipalloc-08319e05489b4cd69`
   - `54.86.200.105` with allocation ID `eipalloc-01f506c542404a359`
6. Public ingress load balancer:
   - `a041d7851168b4494af23d6af1ca746a-e4ea7fc14e27eccb.elb.us-east-1.amazonaws.com`
7. Public application URL for this practice run:
   - `http://a041d7851168b4494af23d6af1ca746a-e4ea7fc14e27eccb.elb.us-east-1.amazonaws.com/`
8. Public backend health endpoint:
   - `http://a041d7851168b4494af23d6af1ca746a-e4ea7fc14e27eccb.elb.us-east-1.amazonaws.com/api/health`
9. Live deployment verification completed:
   - Frontend root returned HTTP `200`
   - Backend health returned HTTP `200`
   - Survey create succeeded through the public API
   - Survey list returned the created record through the public API

### Phase 5D: Notes From The Live Practice Run

1. The original EKS kubeconfig generated by `eksctl` referenced `aws-iam-authenticator`, so `aws eks update-kubeconfig` was run afterward to switch the active context to AWS CLI token auth.
2. The RDS instance was created in private subnets, not as a public database.
3. The database security group initially allowed MySQL only from one EKS-related security group and had to be updated to also allow the EKS cluster security group actually used by the node.
4. The ingress controller was installed separately with Helm before the app chart deployment.
5. Elastic IPs were used only for the public NGINX ingress Network Load Balancer, which is the correct place to use them here.
6. The backend container required the Python `cryptography` package for MySQL 8 authentication.
7. Because the chart used `IfNotPresent`, the fixed backend image had to be pushed with a new tag `backendfix1` and deployed with `helm upgrade`.

### Phase 6: Submission Packaging

1. Verify the application runs without errors.
2. Verify all source code and config files are included.
3. Verify README instructions are complete.
4. Add the deployed application URL to the README.
5. Prepare the demo video checklist.
6. Zip the final submission contents.

### Phase 7: Teardown

Use this section when you are done practicing and want to stop AWS charges.

1. Delete the application Helm release.
   ```powershell
   helm uninstall student-survey-release
   ```
2. Delete the ingress controller Helm release.
   ```powershell
   helm uninstall ingress-nginx --namespace ingress-nginx
   ```
3. Confirm Kubernetes load balancers and pods are gone.
   ```powershell
   kubectl get all -A
   ```
4. Delete the RDS instance. Replace `--skip-final-snapshot` only if you intentionally want a final snapshot.
   ```powershell
   aws rds delete-db-instance --region us-east-1 --db-instance-identifier swe645-project3-mysql --skip-final-snapshot --delete-automated-backups
   ```
5. Wait until the RDS instance is gone.
   ```powershell
   aws rds wait db-instance-deleted --region us-east-1 --db-instance-identifier swe645-project3-mysql
   ```
6. Delete the RDS DB subnet group.
   ```powershell
   aws rds delete-db-subnet-group --region us-east-1 --db-subnet-group-name swe645-project3-db-subnets
   ```
7. Delete the RDS security group.
   ```powershell
   aws ec2 delete-security-group --region us-east-1 --group-id sg-0024f4cd9a38e3ca1
   ```
8. Delete the EKS cluster.
   ```powershell
   eksctl delete cluster --name swe645-project3-cluster --region us-east-1
   ```
9. Release the Elastic IPs after the ingress load balancer is fully gone.
   ```powershell
   aws ec2 release-address --region us-east-1 --allocation-id eipalloc-08319e05489b4cd69
   aws ec2 release-address --region us-east-1 --allocation-id eipalloc-01f506c542404a359
   ```
10. If you want to clean up the container registry too, delete the ECR repositories.
   ```powershell
   aws ecr delete-repository --region us-east-1 --repository-name student-survey-frontend --force
   aws ecr delete-repository --region us-east-1 --repository-name student-survey-backend --force
   ```
11. Verify that no practice resources remain in the account before ending the session.

## Manual Steps Log

This section will be updated with exact user-performed steps as we go.

1. AWS-hosted deployment path selected.
2. AWS region selected: `us-east-1`.
3. `Helm` installation attempted through `winget`; install appears successful but requires a fresh shell or path refresh.
4. `AWS CLI` fallback install completed via Python user scripts.
5. `eksctl` installed in a user-local bin folder.
6. AWS CLI credentials configured successfully for IAM user `Ryanline`.
7. `sts get-caller-identity` verified account `390449413488`.
8. Amazon ECR repositories created successfully:
   - `390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-frontend`
   - `390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-backend`
9. EKS cluster created successfully in `us-east-1`.
10. RDS MySQL instance created successfully in private subnets.
11. Two Elastic IPs allocated and attached to the ingress Network Load Balancer.
12. Frontend and backend images built and pushed to Amazon ECR.
13. Public app URL verified through the AWS load balancer.
14. AWS deployment workflow is being documented primarily with commands rather than console clicks.

## Decisions Log

This section tracks implementation choices so the later recording is easier to reproduce.

1. Initial plan: use the required course stack of React + FastAPI + SQLModel/SQLAlchemy.
2. Deployment target: Kubernetes with Helm, per the rubric.
3. Database target: local SQLite for development, Amazon RDS MySQL for AWS deployment.
4. Kubernetes target: Amazon EKS.
5. Frontend production networking approach: same host as backend, with API routed through `/api`.
6. AWS region for the practice run: `us-east-1`.
7. For cost control, the live EKS practice run used `1 x t3.small` managed node rather than the earlier draft of two `t3.medium` nodes.
8. RDS is private-only; no Elastic IP is used for the database.
9. Elastic IPs are used only for the public ingress Network Load Balancer.

## Open Questions To Resolve During The Build

1. Whether to keep the current AWS resources running between practice sessions or tear them down after capturing the final video.
2. Whether to pin cleaner immutable image tags for the final recorded run instead of `latest` plus one fix tag.
3. Whether to add TLS/HTTPS to the public ingress for the final recorded run.

## Status

1. Rubric reviewed.
2. Initial practice runbook created.
3. Frontend CRUD UI implemented.
4. Backend CRUD API implemented.
5. Frontend production build verified.
6. Backend CRUD smoke test verified.
7. Dockerfiles created but Docker daemon was not running during build verification.
8. Helm chart scaffold created.
9. Practice run region fixed to `us-east-1`.
10. CLI tooling prepared locally: `helm`, `eksctl`, and a working fallback `aws` command path.
11. AWS authentication verified with `sts get-caller-identity`.
12. ECR repositories created in `us-east-1`.
13. EKS cluster created and reachable with `kubectl`.
14. RDS MySQL created and reachable from the cluster.
15. Ingress NLB created with attached Elastic IPs.
16. Frontend is live through the AWS load balancer.
17. Backend API health endpoint is live through the AWS load balancer.
18. Public survey create/list flow verified through the deployed API.
