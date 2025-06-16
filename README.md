Overview
================
A RESTful Task Management API with role-based access, authentication, and MySQL, built with Node.js and Docker.

Features
================
User authentication via JWT

Admin-only role-based task reassignment

Sequelize ORM + MySQL

RESTful endpoints with full CRUD

Dockerized with Compose

Wait-for-DB startup script

Tech Stack
================
Node.js (TypeScript)

Express.js

Sequelize

MySQL

Docker / Docker Compose

JWT Authentication

Setup Instructions
================
bash
Copy
Edit
git clone https://github.com/DevLereko/smartel-api-test.git
cd smartel-api-test
npm install
cp .env.example .env  # fill your DB and JWT credentials
docker-compose up --build
Access API at: http://localhost:4000

Deployment (on AWS EC2)
=======================
Launch an EC2 Ubuntu instance

Install Docker & Docker Compose

Clone repo, set up .env, and run docker-compose up

Open port 4000 on EC2 Security Group
