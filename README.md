# Ticketing Microservices Architecture

## Introduction
A full-stack ticketing platform where users can buy and sell concert tickets. Built with a microservices architecture to ensure scalability, reliability, and flexibility.

## 🚀 Features
- User Authentication: Secure sign-up, login, and profile management.
- Ticket Management: Create, update, view, and delete tickets.
- Order Management: Place, cancel, and view orders.
- Payment Integration: Process payments securely using Stripe.
- Order Expiration: Automatic order expiration using Redis.
- Client Interface: User-friendly Next.js frontend.
- CI/CD: Automated testing and deployment with GitHub Actions.

## 🛠️ Tech Stack
- Backend: Node.js, Express.js
- Frontend: Next.js
- Database: MongoDB
- Caching/Expiration: Redis
- Event Streaming: NATS Streaming
- Containerization: Docker, Kubernetes
- Load Balancing: Ingress NGINX
- Payment Gateway: Stripe
- Testing: Jest

## 📁 Microservices Overview
1. Auth Service
    - Handles user authentication and stores user information.
2. Tickets Service
    - CRUD operations for tickets.
3. Orders Service
    - Manages orders, ensuring ticket availability.
4. Expiration Service
    - Uses Redis to automatically expire unpaid orders.
5. Payments Service
    - Integrates Stripe for secure payment processing.
6. Client
    - Next.js-based frontend for user interaction.

## 📦 Setup Instructions

### Prerequisites
- Node.js
- Docker
- Kubernetes (Minikube or a managed K8s service)
- Redis
- MongoDB
- Skaffold

### common
This is a npm package created by me, used in this project for share code by different services.
[common git repo](https://github.com/mahirminhajk/km12dev-common)
[common npm](https://www.npmjs.com/package/@km12dev/common)

### Installation
1. Clone the respository
```
git clone https://github.com/mahirminhajk/ticketing_ms.git  
cd ticketing_ms  
```
2. Install dependencies for each service(for developemnt purpose)
```
cd [service-name]  
npm install  
```
3. Running in development enviroment(using skaffold)
```
skaffold dev
```
### Environment Variables
- every enviroment variables are provided in the infra/k8s yaml files

### 🔍 Testing
```
cd [service-name]
npm run test
```

### 🚀 CI/CD
- Testing Workflow: Runs automated tests on every pull request.
- Deployment Workflow: Automatically deploys on merging to the master branch.

### 📄 License
This project is licensed under the MIT License.

### 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

### 📫 Contact
For any questions or suggestions, feel free to reach out via [Email](mailto:mahirminhajk.developer@gmail.com) or [GitHub Issues](https://github.com/mahirminhajk/ticketing_ms/issues).


