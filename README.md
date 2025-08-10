<<<<<<< HEAD
# healthcare_devsecops
=======
# HealEasy: DevSecOps-Driven Healthcare Deployment

**HealEasy** is a secure, scalable, and cloud-ready healthcare appointment booking platform built using DevSecOps principles. This application empowers patients to find doctors, explore specializations, and schedule appointments—all without a traditional backend. Instead, it leverages static JSON files for data storage, ensuring a lightweight, fast, and highly maintainable system architecture.

---

## Project Overview

In today’s rapidly evolving healthcare landscape, digital transformation is essential. HealEasy demonstrates how modern **DevSecOps practices**—such as continuous integration, automated testing, infrastructure as code, containerization, and orchestration—can be applied to create a secure, resilient, and maintainable appointment booking platform.

---

## Tech Stack

| Component             | Technology           | Description                                                                                                        |
|----------------------|----------------------|--------------------------------------------------------------------------------------------------------------------|
| **Frontend**          | React.js             | Responsive, component-based UI for patients to discover doctors and book appointments.                            |
| **Data Storage**      | Static JSON Files    | Simulates backend storage, removing backend complexity and allowing simple deployment on static hosts.             |
| **Containerization**  | Docker               | Ensures environment consistency across development and deployment.                                                 |
| **Orchestration**     | Kubernetes           | Automates deployment, scaling, and management of containerized applications.                                       |
| **Infrastructure**    | Terraform            | Manages infrastructure as code for reproducibility and automation.                                                 |
| **CI/CD**             | GitHub Actions       | Automates testing, building, and deployment workflows for seamless delivery.                                       |
| **Code Quality**      | SonarCloud           | Scans frontend code for vulnerabilities and enforces quality standards.                                            |
| **Monitoring & Logs** | Prometheus / Grafana | Tracks app performance and health metrics for observability and reliability.                                       |
| **Version Control**   | Git / GitHub         | Manages source code and integrates with CI/CD pipelines for collaborative development.                             |

---

## About the Tools Used

### 1. React.js
- Used to build the interactive, responsive, and modular frontend for HealEasy.
- Provides component-based development, making the UI scalable and maintainable.

### 2. Static JSON Files
- Store doctor and appointment data in easily editable and readable JSON files.
- Removes the complexity of a traditional backend or database, making deployment and maintenance simpler.

### 3. Docker
- Containerizes the application, ensuring "works on my machine" issues are eliminated.
- Simplifies deployment on any cloud or on-prem infrastructure.
- Enables reproducible environments for local development and production.

### 4. Kubernetes
- Orchestrates Docker containers, automating deployment, scaling, and management.
- Provides self-healing, load balancing, and rollouts/rollbacks for reliable, production-grade deployments.
- Used to manage HealEasy's containers in cloud or cluster environments.

### 5. Terraform
- Defines infrastructure (servers, networking, etc.) as code.
- Allows automated, repeatable provisioning of resources.
- Makes it easy to manage changes, rollbacks, and infrastructure audits.

### 6. GitHub Actions
- Automates the complete CI/CD pipeline: linting, testing, building, and deploying the app.
- Integrates seamlessly with the GitHub repository.
- Supports secret management and secure workflows.

### 7. SonarCloud
- Performs static code analysis to detect bugs, code smells, and security vulnerabilities.
- Enforces code quality and security standards on every pull request and main branch update.

### 8. Prometheus
- Collects metrics from the application and infrastructure.
- Enables real-time monitoring of performance, health, and resource usage.

### 9. Grafana
- Visualizes metrics collected by Prometheus.
- Provides dashboards and alerting for observability and reliability.

### 10. Git & GitHub
- Tracks source code changes, enables collaboration, and integrates with CI/CD tooling.
- Provides version history, pull requests, and code reviews.

---

## DevSecOps Workflow

HealEasy follows a fully automated DevSecOps pipeline:

- Code Commit ➔ GitHub  
- CI/CD Execution ➔ GitHub Actions: Linting, Testing, Build  
- Security Scan ➔ SonarCloud  
- Containerization ➔ Docker  
- Orchestration ➔ Kubernetes  
- Infrastructure Provisioning ➔ Terraform  
- Monitoring ➔ Prometheus + Grafana

---

## Features

- Book appointments with doctors based on specialization
- Search and filter doctors easily
- View doctor profiles (from JSON data)
- DevSecOps-integrated pipeline with secure builds and code scanning
- Deployed on containerized and orchestrated infrastructure with observability and IaC

---

## Project Structure

```
HealEasy/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.jsx
├── data/
│   └── doctors.json
├── .github/workflows/
│   └── main.yml
├── Dockerfile
├── k8s/
│   └── deployment.yaml
├── terraform/
│   └── main.tf
├── README.md
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js & npm
- Docker
- Kubernetes cluster and kubectl
- Terraform
- GitHub account

### Installation

```bash
git clone https://github.com/AdityaPrakash27/HealEasy.git
cd HealEasy
npm install
```

### Run Locally

```bash
npm start
```

### Docker Build & Run

```bash
docker build -t heal-easy .
docker run -p 3000:3000 heal-easy
```

### Deploy to Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
```

---

## Security Practices

HealEasy incorporates security-first DevOps with:

- Code quality and vulnerability scanning via SonarCloud
- Container hardening through Docker best practices
- Role-based access control and secure CI/CD secrets
- Static analysis in GitHub Actions for secure build pipelines
- Kubernetes RBAC and secure resource definitions

---

## Monitoring & Observability

- Prometheus scrapes container and cluster metrics
- Grafana visualizes system health and uptime
- Alerts configured for service downtime or high resource usage

---

## Contributing

1. Fork this repo
2. Create a new branch (`git checkout -b feature-x`)
3. Make your changes
4. Commit (`git commit -m 'Add feature x'`)
5. Push (`git push origin feature-x`)
6. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

Project Leads: Aditya Prakash and Arunima Ghosh
>>>>>>> 90b1680 (Initial commit)
