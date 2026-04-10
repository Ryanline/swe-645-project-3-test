# SWE 645 Project 3 Practice Runbook

This README is intentionally one single numbered checklist from an empty folder to the finished deployed solution. Follow it in order.

1. Create an empty folder named `swe-645-project-3-test`, open it in VS Code, and open a terminal there. At this step, we create the workspace for every source file, Dockerfile, YAML file, Helm chart, and document. Why: "The submission for this assignment should be through the Canvas website. I expect a zipped package containing the source files, configuration files, such as Dockerfile, YAML manifests, HelmChart..."

2. Initialize Git and create `.gitignore`. Run `git init`. Create `.gitignore` with:

   ```gitignore
   frontend/node_modules/
   frontend/dist/
   backend/__pycache__/
   backend/app/__pycache__/
   backend/.env
   backend/surveys.db
   backend/*.db
   *.pyc
   .practice-secrets.local.md
   helm/student-survey/values.aws.local.yaml
   ```

   At this step, we keep generated files and secrets out of version control. Why: "The source code/configuration files are not included in the package" is an instant deduction item.

3. Read the rubric and write down the exact requirements before coding. Capture these exact lines: "develop full stack applications using React.js ... and FastAPI and SQLMOdel/SQLAlchemy", "Your application implements CRUD operations to manage student survey data in persistence storage.", "Please containerize your applications using Docker technology and deploy them on the Kubernetes cluster using the helm charts.", and the required survey fields. At this step, we lock scope before implementation. Why: "Does system meet the functional requirements along with proper documentation and a voice-over video recording: 85 points."

4. Install the tools: Python, Node.js, npm, Git, Docker Desktop, AWS CLI v2, `kubectl`, Helm, `eksctl`, and Postman. Verify with:

   ```powershell
   python --version
   node --version
   npm --version
   git --version
   docker version
   aws --version
   kubectl version --client
   helm version
   eksctl version
   ```

   At this step, we prepare the machine for coding, testing, containers, Kubernetes, and AWS. Why: "You can use Postman ... to test the working of your containerized microservice(s) – the backend REST APIs before integrating them with the React application."

5. Create the project folders:

   ```powershell
   New-Item -ItemType Directory backend
   New-Item -ItemType Directory backend\app
   New-Item -ItemType Directory frontend
   New-Item -ItemType Directory helm
   New-Item -ItemType Directory helm\student-survey
   New-Item -ItemType Directory helm\student-survey\templates
   ```

   At this step, we create the final repository layout. Why: "I expect a zipped package containing the source files, configuration files..."

6. Create `backend/requirements.txt` with the packages used in this solution:

   ```text
   fastapi==0.116.1
   uvicorn[standard]==0.35.0
   sqlmodel==0.0.24
   pymysql==1.1.1
   python-dotenv==1.1.1
   email-validator==2.3.0
   cryptography==45.0.7
   ```

   At this step, we define the backend runtime. Why: "develop full stack applications using React.js ... and FastAPI and SQLMOdel/SQLAlchemy..."

7. Create these backend files using the current versions in this repo as your exact templates:

   ```text
   backend/app/__init__.py
   backend/app/database.py
   backend/app/models.py
   backend/app/main.py
   backend/.env.example
   ```

   `database.py` must read `DATABASE_URL` and default to SQLite. `models.py` must define the survey table and the helper conversion functions. `main.py` must expose `GET /api/health`, `GET /api/surveys`, `GET /api/surveys/{survey_id}`, `POST /api/surveys`, `PUT /api/surveys/{survey_id}`, and `DELETE /api/surveys/{survey_id}`. At this step, we implement the persistence layer and the CRUD API. Why: "Your application implements CRUD operations to manage student survey data in persistence storage."

8. Put 1-2 sentence header comments at the top of every backend source file. At this step, we satisfy the comment requirement before moving on. Why: "For every source file, please include comments at the top of the program describing what the program does. This only needs to be 1 or 2 sentences."

9. Install and run the backend locally:

   ```powershell
   cd backend
   python -m pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

   Open `http://127.0.0.1:8000/docs`. At this step, we verify the API starts before adding the frontend. Why: "Does the assignment run without errors: 13 points."

10. Test the backend by itself with Swagger UI or Postman. Use this sequence:

   ```text
   GET  http://127.0.0.1:8000/api/health
   POST http://127.0.0.1:8000/api/surveys
   GET  http://127.0.0.1:8000/api/surveys
   GET  http://127.0.0.1:8000/api/surveys/1
   PUT  http://127.0.0.1:8000/api/surveys/1
   DELETE http://127.0.0.1:8000/api/surveys/1
   ```

   Use a JSON body with the rubric fields. At this step, we verify the microservice before integrating React. Why: "You can use Postman ... to test the working of your containerized microservice(s) – the backend REST APIs before integrating them with the React application."

11. Scaffold the React frontend:

   ```powershell
   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   ```

   At this step, we create the React application required by the rubric. Why: "develop full stack applications using React.js to implement the frontend of the Student Survey application"

12. Replace the Vite starter files with the real project files from this repository:

   ```text
   frontend/src/App.tsx
   frontend/src/api.ts
   frontend/src/types.ts
   frontend/src/main.tsx
   frontend/src/styles.css
   frontend/index.html
   ```

   `App.tsx` renders the survey page and archive. `api.ts` calls the backend. `types.ts` defines the frontend data shape. `styles.css` holds the small tweaks on top of W3.CSS. `index.html` loads the W3.CSS link and page title. At this step, we implement the frontend and preserve the old Assignment 1 visual style while upgrading it to Project 3 behavior. Why: "The application allows prospective students to fill out and submit a survey form ... It also allows users to view all surveys recorded to date. In addition, the application provides the capabilities to update and delete a specific survey."

13. Put 1-2 sentence header comments at the top of `frontend/src/App.tsx`, `frontend/src/api.ts`, and `frontend/src/types.ts`. At this step, we satisfy the rubric comment requirement on the frontend too. Why: "For every source file, please include comments at the top of the program describing what the program does."

14. Run the frontend locally:

   ```powershell
   cd frontend
   npm run dev
   ```

   Open `http://127.0.0.1:5173`. At this step, we verify the browser UI loads. Why: "Does the assignment run without errors: 13 points."

15. Test the local full stack in the browser by creating a survey, checking that it appears in Survey Archive, editing it, verifying the change persists, deleting it, and verifying it disappears. At this step, we verify React and FastAPI work together. Why: "Your application implements CRUD operations to manage student survey data in persistence storage."

16. Create `backend/Dockerfile` and `frontend/Dockerfile` using the current versions in this repository. The backend Dockerfile must install the Python requirements and run Uvicorn on port 8000. The frontend Dockerfile must build the Vite app and serve it from NGINX on port 80. At this step, we containerize both applications. Why: "Please containerize your applications using Docker technology..."

17. Build both images locally and do not proceed until both succeed:

   ```powershell
   cd backend
   docker build -t student-survey-backend:backendfix1 .
   ```

   ```powershell
   cd frontend
   docker build -t student-survey-frontend:literalv6 .
   ```

   At this step, we catch container issues before AWS deployment. Why: "Be sure to test access and functionality to your submission before the due date."

18. Create these Helm files using the current repository versions:

   ```text
   helm/student-survey/Chart.yaml
   helm/student-survey/values.yaml
   helm/student-survey/templates/_helpers.tpl
   helm/student-survey/templates/backend-secret.yaml
   helm/student-survey/templates/backend-deployment.yaml
   helm/student-survey/templates/backend-service.yaml
   helm/student-survey/templates/frontend-deployment.yaml
   helm/student-survey/templates/frontend-service.yaml
   helm/student-survey/templates/ingress.yaml
   ```

   `values.yaml` should point to the two ECR repositories and hold the non-secret defaults. At this step, we package the Kubernetes resources with Helm. Why: "deploy them on the Kubernetes cluster using the helm charts. There should be a frontend Pod for the React application and a backend Pod for the REST API/persistence layer."

19. Create a local-only Helm override file named `helm/student-survey/values.aws.local.yaml` with the real MySQL URL later, and keep it out of Git:

   ```yaml
   database:
     url: mysql+pymysql://adminuser:REPLACE_DB_PASSWORD@REPLACE_DB_HOST:3306/student_surveys
   ```

   At this step, we keep the real database secret out of the repository. Why: the README must be detailed and reproducible, but it must not expose secrets.

20. Create the AWS IAM user and access key that will be used for the project. UI clicks:

   ```text
   AWS Console
   Search IAM
   IAM > Users > Create user
   choose a username
   Next
   Attach policies directly
   select AdministratorAccess
   Create user
   open the new user
   Security credentials
   Create access key
   Use case: Command Line Interface (CLI)
   copy the Access key ID and Secret access key
   ```

   At this step, we create the AWS identity needed for CLI automation. Why: the deployment path requires ECR, EKS, RDS, VPC, and security group access.

21. Configure the AWS CLI and verify the identity:

   ```powershell
   aws configure
   aws sts get-caller-identity
   ```

   Use `us-east-1` as the default region. The practice account used here is `390449413488`. At this step, we bind the local machine to the right account. Why: "I can’t figure out how to use the assignment, and instructions are left out" is an instant deduction item.

22. Create the two ECR repositories. UI clicks:

   ```text
   Search Elastic Container Registry
   Amazon ECR > Repositories
   Create repository
   Repository name: student-survey-frontend
   Create repository
   Create repository again
   Repository name: student-survey-backend
   Create repository
   ```

   Commands:

   ```powershell
   aws ecr create-repository --region us-east-1 --repository-name student-survey-frontend
   aws ecr create-repository --region us-east-1 --repository-name student-survey-backend
   ```

   The repository URIs for this practice account are `390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-frontend` and `390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-backend`. At this step, we create the registry endpoints for the images. Why: the Kubernetes cluster must pull images from a registry.

23. Log Docker in to ECR and push both images:

   ```powershell
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 390449413488.dkr.ecr.us-east-1.amazonaws.com
   docker tag student-survey-backend:backendfix1 390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-backend:backendfix1
   docker push 390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-backend:backendfix1
   docker tag student-survey-frontend:literalv6 390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-frontend:literalv6
   docker push 390449413488.dkr.ecr.us-east-1.amazonaws.com/student-survey-frontend:literalv6
   ```

   At this step, we publish the exact images used by the live deployment. Why: "Please containerize your applications..." and EKS cannot deploy images that were never pushed.

24. Create the EKS cluster. Use the command path that was actually used for this practice run:

   ```powershell
   eksctl create cluster --name swe645-project3-cluster --region us-east-1 --nodes 1 --nodes-min 1 --nodes-max 2 --node-type t3.small --managed
   ```

   UI verification path:

   ```text
   Search Elastic Kubernetes Service
   Amazon EKS > Clusters
   click swe645-project3-cluster
   confirm Status = Active
   ```

   At this step, we provision the Kubernetes environment. Why: "deploy them on the Kubernetes cluster using the helm charts."

25. Update local kubeconfig and verify the cluster:

   ```powershell
   aws eks update-kubeconfig --region us-east-1 --name swe645-project3-cluster
   kubectl config current-context
   kubectl get nodes
   ```

   At this step, we connect `kubectl` and Helm to the cluster. Why: "Does the assignment run without errors: 13 points."

26. Allocate two Elastic IP addresses. UI clicks:

   ```text
   Search EC2
   EC2 > Elastic IPs
   Allocate Elastic IP address
   Allocate
   Repeat once
   copy both Allocation IDs
   ```

   The allocation IDs used in this practice run are `eipalloc-08319e05489b4cd69` and `eipalloc-01f506c542404a359`. At this step, we reserve stable public IPs for the ingress load balancer. Why: this is the correct place to use Elastic IPs in this design.

27. Install the NGINX ingress controller with those Elastic IP allocations:

   ```powershell
   helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
   helm repo update
   kubectl create namespace ingress-nginx
   @"
   controller:
     service:
       type: LoadBalancer
       annotations:
         service.beta.kubernetes.io/aws-load-balancer-type: nlb
         service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
         service.beta.kubernetes.io/aws-load-balancer-eip-allocations: eipalloc-08319e05489b4cd69,eipalloc-01f506c542404a359
   "@ | Set-Content ingress-nginx-values.yaml
   helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx -f ingress-nginx-values.yaml
   kubectl get svc ingress-nginx-controller -n ingress-nginx
   ```

   At this step, we create the public entry point that will serve both `/` and `/api`. Why: the deployed app needs one public front door.

28. Create the RDS DB subnet group using private subnets in the EKS VPC. UI clicks:

   ```text
   Search RDS
   Amazon RDS > Subnet groups
   Create DB subnet group
   Name: swe645-project3-db-subnets
   Description: Private subnets for SWE645 Project 3 RDS
   VPC: vpc-051a135d841ab586c
   add subnet-0fd42a1bd9b50abf1
   add subnet-090d87dc640bf111b
   Create
   ```

   At this step, we create the private network placement for the database. Why: the database in this solution is private-only.

29. Create the RDS security group and allow MySQL from the EKS cluster security groups. UI clicks:

   ```text
   Search EC2
   EC2 > Security Groups
   Create security group
   Name: swe645-project3-rds-sg
   Description: MySQL access for SWE645 Project 3 RDS
   VPC: vpc-051a135d841ab586c
   Create security group
   open the new security group
   Edit inbound rules
   Add MySQL/Aurora rule from sg-04a9046b2ad3fcf4c
   Add MySQL/Aurora rule from sg-0e84b0d133adc5a91
   Save rules
   ```

   The security group ID used here is `sg-0024f4cd9a38e3ca1`. At this step, we let the backend pod reach MySQL on port 3306. Why: the backend cannot persist survey data without database network access.

30. Create the MySQL RDS instance in Dev/Test mode. UI clicks:

   ```text
   Search RDS
   Amazon RDS > Databases
   Create database
   Standard create
   Engine type: MySQL
   Template: Dev/Test
   DB instance identifier: swe645-project3-mysql
   Master username: adminuser
   choose and save a password
   DB instance class: db.t3.micro
   Allocated storage: 20 GiB
   VPC: vpc-051a135d841ab586c
   DB subnet group: swe645-project3-db-subnets
   Public access: No
   Existing VPC security group: swe645-project3-rds-sg
   Initial database name: student_surveys
   Create database
   ```

   Wait for `Available`, then record the endpoint. The endpoint used in this practice run is `swe645-project3-mysql.ckx8ccwwessg.us-east-1.rds.amazonaws.com`. At this step, we create the persistent database. Why: "You can use Amazon Relational Database Service (Amazon RDS) to provision and use a MySQL database for this homework ... When using Amazon RDS, please make sure that you set up the database in Development/Sandbox mode to avoid any unexpected charges."

31. Put the real database URL into `helm/student-survey/values.aws.local.yaml`:

   ```yaml
   database:
     url: mysql+pymysql://adminuser:YOUR_REAL_PASSWORD@swe645-project3-mysql.ckx8ccwwessg.us-east-1.rds.amazonaws.com:3306/student_surveys
   ```

   Then verify the chart:

   ```powershell
   helm lint .\helm\student-survey
   helm template student-survey-release .\helm\student-survey -f .\helm\student-survey\values.aws.local.yaml
   ```

   At this step, we connect Helm to the real database and catch template mistakes before deployment. Why: "I spend more than 5 minutes trying to debug the assignment" is an instant deduction risk.

32. Deploy the application with Helm:

   ```powershell
   helm install student-survey-release .\helm\student-survey -f .\helm\student-survey\values.aws.local.yaml --set backend.image.tag=backendfix1 --set frontend.image.tag=literalv6
   ```

   If updating an existing deployment, run:

   ```powershell
   helm upgrade student-survey-release .\helm\student-survey -f .\helm\student-survey\values.aws.local.yaml --set backend.image.tag=backendfix1 --set frontend.image.tag=literalv6
   ```

   At this step, we create the frontend pod, backend pod, services, secret, and ingress resource. Why: "There should be a frontend Pod for the React application and a backend Pod for the REST API/persistence layer."

33. Verify the deployment:

   ```powershell
   kubectl get pods
   kubectl get svc
   kubectl get ingress
   kubectl rollout status deployment/student-survey-release-student-survey-frontend --timeout=180s
   kubectl rollout status deployment/student-survey-release-student-survey-backend --timeout=180s
   kubectl get svc ingress-nginx-controller -n ingress-nginx
   ```

   The live URL for this practice run is `http://a041d7851168b4494af23d6af1ca746a-e4ea7fc14e27eccb.elb.us-east-1.amazonaws.com/`. The health endpoint is `http://a041d7851168b4494af23d6af1ca746a-e4ea7fc14e27eccb.elb.us-east-1.amazonaws.com/api/health`. At this step, we verify the infrastructure and capture the required public URL. Why: "Also, provide the URL of your application deployed on Kubernetes in readme file..."

34. Test the deployed backend directly with Postman or PowerShell. First test:

   ```powershell
   Invoke-WebRequest -Uri "http://a041d7851168b4494af23d6af1ca746a-e4ea7fc14e27eccb.elb.us-east-1.amazonaws.com/api/health" -UseBasicParsing
   ```

   Then test create, list, update, and delete against the public `/api/surveys` routes using the same payload shape you used locally. At this step, we verify the live API works independently of the browser. Why: "Be sure to test access and functionality to your submission before the due date."

35. Test the deployed application in the browser. Open the live URL, hard refresh it, verify the hero image and `Assignment 3` text appear, create one survey, verify it appears in Survey Archive, edit it, verify the change persists, delete it, and verify the record disappears. At this step, we verify the full end-to-end deployed experience. Why: "Please provide a video recording with voice over demonstrating the working of every part of your application..."

36. Check the final package contents before zipping. Confirm the repository contains `backend/`, `frontend/`, `helm/`, `README.md`, both Dockerfiles, and all Helm YAML/templates. Confirm it does not include `node_modules`, `dist`, `.env`, database passwords, or `values.aws.local.yaml`. At this step, we protect ourselves from packaging mistakes. Why: "The source code/configuration files are not included in the package" and "The detailed documentation and voice-over recorded video are not included in the package" are instant deduction items.

37. Record the demo video in the same order as the verification steps: explain the rubric, show the backend files, show the frontend files, show the Dockerfiles, show the Helm chart, show ECR, show EKS, show RDS, show the live site, demonstrate create/read/update/delete, show `/api/health`, and show the live URL in this README. At this step, we satisfy the required demo artifact. Why: "Please provide a video recording with voice over demonstrating the working of every part of your application and make it a part of your submission."

38. Zip the project for submission after the code, README, and video are ready. Include the source files and configuration files only. At this step, we build the final submission artifact. Why: "The submission for this assignment should be through the Canvas website. I expect a zipped package containing the source files, configuration files, such as Dockerfile, YAML manifests, HelmChart..."

39. If you want to stop AWS charges after practice, tear down the cloud resources in this order:

   ```powershell
   helm uninstall student-survey-release
   helm uninstall ingress-nginx --namespace ingress-nginx
   aws rds delete-db-instance --region us-east-1 --db-instance-identifier swe645-project3-mysql --skip-final-snapshot --delete-automated-backups
   aws rds wait db-instance-deleted --region us-east-1 --db-instance-identifier swe645-project3-mysql
   aws rds delete-db-subnet-group --region us-east-1 --db-subnet-group-name swe645-project3-db-subnets
   aws ec2 delete-security-group --region us-east-1 --group-id sg-0024f4cd9a38e3ca1
   eksctl delete cluster --name swe645-project3-cluster --region us-east-1
   aws ec2 release-address --region us-east-1 --allocation-id eipalloc-08319e05489b4cd69
   aws ec2 release-address --region us-east-1 --allocation-id eipalloc-01f506c542404a359
   aws ecr delete-repository --region us-east-1 --repository-name student-survey-frontend --force
   aws ecr delete-repository --region us-east-1 --repository-name student-survey-backend --force
   ```

   At this step, we stop billing and return the AWS account to a clean state. Why: the rubric explicitly warns that RDS should be created in development or sandbox mode to avoid unexpected charges.
