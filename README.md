# Task Management API

## Overview
A RESTful Task Management API with role-based access control, JWT authentication, MySQL database, and Docker-based deployment. Built with Node.js (TypeScript) and Express.js.

## Features
- User authentication via JWT
- Role-based access (Admin-only task reassignment)
- Sequelize ORM with MySQL support
- RESTful endpoints with full CRUD functionality
- Dockerized using Docker Compose
- Wait-for-DB startup script for seamless container boot

## Tech Stack
- Node.js (TypeScript)
- Express.js
- Sequelize
- MySQL
- Docker & Docker Compose
- JWT Authentication

---

## Prerequisites

Before running the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Postman](https://www.postman.com/) *(optional, for API testing)*

---

## Local Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/DevLereko/smartel-api-test.git
cd smartel-api-test
````

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Copy the example `.env` file and fill in your DB and JWT credentials:

```bash
cp .env.example .env
```

4. **Start the Application**

Use Docker Compose to build and start the API:

```bash
docker-compose up --build
```

The API will be accessible at: [http://localhost:4000](http://localhost:4000)

---

## API Endpoints

### Authentication

* `POST /auth/login`
  Authenticate a user and return a JWT token on success.

* `POST /auth/signup`
  Register a new user. Includes validations for duplicate usernames/emails and role existence.

* `GET /auth/users`
  Retrieve a list of all registered users (requires a valid JWT token).

---

### Task Management

* `GET /tasks`
  Retrieve all tasks assigned to or created by the user (requires authentication).

* `GET /tasks/:id`
  Fetch detailed information about a specific task by its ID.

* `POST /tasks`
  Create a new task. Requires a valid JWT token.

* `PUT /tasks/:id`
  Update an existing task by ID. Requires a valid JWT token.

* `DELETE /tasks/:id`
  Delete a task by ID. Requires authentication.

* `POST /tasks/:id/reassign`
  Reassign a task to another user. **Only accessible by Admin users.**

---

## API Testing

A **Postman collection** is provided in `.json` format within the project directory. This allows quick and easy testing of all endpoints.

> Import the collection into Postman to test login, task creation, updates, deletions, and admin-only actions like reassignment.

---

## Deployment (on AWS EC2)

1. Launch an Ubuntu EC2 instance
2. Install Docker and Docker Compose
3. Clone the repository and set up the `.env` file
4. Run the API using Docker Compose:

```bash
docker-compose up --build
```

5. Ensure port **4000** is open in your EC2 Security Group settings

---

## License

MIT

```