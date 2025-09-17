# E-Commerce Microservices Platform

This project is a complete microservices-based application for a simple e-commerce backend, built with NestJS and a Next.js frontend. It includes services for managing products and orders, all routed through an API Gateway with JWT authentication.

## Core Technologies

- **Backend**: NestJS, TypeORM
- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: PostgreSQL (using a database-per-service pattern)
- **Containerization**: Docker & Docker Compose
- **Monorepo Management**: Nx

---

## Architecture Overview

The application is divided into four main containerized services:

1.  **API Gateway** (`port 3000`): The single entry point for all frontend requests. It handles authentication and routes traffic to the appropriate microservice.
2.  **Product Service** (`port 3001`): A microservice responsible for all CRUD (Create, Read, Update, Delete) operations related to products.
3.  **Order Service** (`port 3002`): A microservice for creating, viewing, and managing orders.
4.  **Frontend** (`port 4000`): A Next.js application that provides a user interface for interacting with the system.

Each microservice has its own dedicated PostgreSQL database, following the "Database per Service" design pattern.

---

## Setup and Usage

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

All required configuration is bundled within the `docker-compose.yml` file, so no `.env` file is needed.

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Build and run the containers:**
    This command will build the images for all the services using the multi-stage `Dockerfile` and start them up.
    ```sh
    docker-compose up --build
    ```

The initial build may take a few minutes. Once complete, all services will be running.

### Accessing the Services

- **Frontend Application / Admin Dashboard:**
  - URL: [http://localhost:4000](http://localhost:4000)
  - This is the main UI where you can manage products and orders.

- **API Gateway (Base URL):**
  - URL: [http://localhost:3000](http://localhost:3000)

---

## API Testing (Swagger & Postman)

### Swagger UI

An interactive Swagger UI is generated automatically for API testing and documentation.

- **Swagger URL:** [http://localhost:3000/api](http://localhost:3000/api)

**How to use authenticated endpoints in Swagger:**

1.  Expand the `POST /auth/login` endpoint, click "Try it out", and execute it with the credentials `user` and `password`.
2.  Copy the `access_token` from the response body.
3.  At the top right of the page, click the green **"Authorize"** button.
4.  In the popup, paste the token into the `access-token` value field and click "Authorize".
5.  You can now successfully execute all the protected endpoints.

### Postman Collection

- Invite for the Postman collection: [click here](https://app.getpostman.com/join-team?invite_code=6c0cb976086af28ac4000e41e13d4b7095e6d81042f81065fafa15f64c283db4&target_code=c44ef47e2405c3c7ea2d7c0d99ce4eae)
- Guest url : [clickme](https://restless-meadow-337743.postman.co/workspace/My-Workspace~99108b46-1ab8-41a8-8231-44739c6eeff3/collection/23537667-2daaec03-03df-4208-9543-5a7af93745af?action=share&creator=23537667)

or 

A Postman collection can be generated directly from the Swagger/OpenAPI specification.

1.  Open Postman and click the **Import** button.
2.  Select the **Link** tab.
3.  Paste the Swagger JSON URL: `http://localhost:3000/api-json`
4.  Follow the prompts to import the collection.

---

## Running Tests (NOT IMPLEMENTED YET)

To run the unit and end-to-end tests for all services, you can use the Nx command:

```sh
npm test
```
