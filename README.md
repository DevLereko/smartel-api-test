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
- Local development support with `npm run dev`

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
- [Docker](https://www.docker.com/) (only if using containerized approach)
- [Docker Compose](https://docs.docker.com/compose/)
- [Postman](https://www.postman.com/) *(optional, for API testing)*

---

## Local Setup Instructions (Without Docker)

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

Copy the example `.env` file and fill in your database and JWT credentials:

```bash
cp .env.example .env
```

`.env` example content:

```env
# DB connection details
HOST=localhost
DB_NAME=taskdb
DB_DIALECT=mysql
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306

# secret key for JWT
SECRET_KEY=your_secret_key

# MySQL container init settings (if using Docker)
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=taskdb
```

4. **Start Local Server**

```bash
npm run dev
```

> The app uses `ts-node-dev` for live-reloading in development mode. Ensure your MySQL server is running and the database exists before starting.

---

## Running With Docker

1. **Start the Application**

```bash
docker-compose up --build
```

> Sequelize will auto-create tables and seed default roles on first run.

---

## Sequelize Auto-Sync and Initial Seeding

Upon starting the app, Sequelize:

* **Automatically creates all necessary tables** if they do not exist.
* **Seeds default roles** (`User`, `Admin`, `Moderator`) into the `roles` table via `initializeRoles()` function.

You will see this in the console:

```
Initializing roles...
Default roles have been added.
```

---

## Database Structure & Relationships

The following tables and relationships are defined:

### Tables

* `users`: Stores user details like name, email, password, etc.
* `roles`: Stores role types (User, Admin, Moderator).
* `user_roles`: Join table for the many-to-many relationship between users and roles.
* `tasks`: Stores tasks created/assigned to users.

### Relationships

* **User ↔ Roles**:
  Many-to-Many via `user_roles`

* **User ↔ Tasks**:
  One-to-Many: A user can have many tasks.

* **Task → User**:
  Each task has one owner (foreign key: `userId`)

> Sequelize Associations:

```js
// User-Role Many-to-Many
role.belongsToMany(user, { through: "user_roles" });
user.belongsToMany(role, { through: "user_roles" });

// User-Task One-to-Many
task.belongsTo(user, { foreignKey: "userId", as: "user" });
user.hasMany(task, { foreignKey: "userId", as: "tasks" });
```

---

## API Endpoints

### Authentication

* `POST /auth/login`
  Authenticate a user and return a JWT token.

* `POST /auth/signup`
  Register a new user. Validates duplicate emails/usernames and role existence.

* `GET /auth/users`
  Retrieve all users. Requires JWT token.

---

### Task Management

* `GET /tasks`
  Retrieve all tasks for the authenticated user.

* `GET /tasks/:id`
  Retrieve a single task by ID.

* `POST /tasks`
  Create a new task (authenticated user).

* `PUT /tasks/:id`
  Update a task by ID.

* `DELETE /tasks/:id`
  Delete a task by ID.

* `POST /tasks/:id/reassign`
  Reassign a task to another user. **Admin only.**

---

## API Testing with Postman

A **Postman collection** is provided in `.json` format in the project directory.

> Import it into Postman to quickly test authentication, task operations, and admin-only functionality.

---

## Deployment (on AWS EC2)

1. Launch an Ubuntu EC2 instance
2. Install Docker and Docker Compose
3. Clone the repository and set up `.env`
4. Run the API:

```bash
docker-compose up --build
```

5. Open port **4000** in your EC2 Security Group to allow HTTP access.

---

## License

MIT
