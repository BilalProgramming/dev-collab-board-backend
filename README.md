# Project Management API

A RESTful backend API for managing projects and tasks.  
Built with **Node.js, Express.js, MongoDB, and TypeScript** following a **clean architecture with service layer separation**.

This API allows users to create projects, manage tasks, assign tasks to users, and track task status.

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Express Validator

---

## Features

### Authentication
- User signup
- User login
- JWT based authentication
- Protected routes

### Projects
- Create project
- Get project list with pagination
- View single project
- Update project
- Delete project

### Tasks
- Create task inside a project
- Assign task to a user
- Update task status (todo / in-progress / done)
- Only project owner can manage tasks
- Project ownership validation

### Security
- JWT authentication
- Owner based access control
- Input validation
- Error handling

---

## Project Structure
src
│
├── controllers
│ ├── auth.controller.ts
│ ├── project.controller.ts
│ └── task.controller.ts
│
├── services
│ ├── project.service.ts
│ └── task.service.ts
│
├── models
│ ├── user.model.ts
│ ├── project.model.ts
│ └── task.model.ts
│
├── routes
│ ├── auth.routes.ts
│ ├── project.routes.ts
│ └── task.routes.ts
│
├── middleware
│ └── auth.middleware.ts
│
└── app.ts


---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|------|------|------|
POST | `/api/auth/signup` | Register new user |
POST | `/api/auth/login` | Login user |

---

### Projects

| Method | Endpoint | Description |
|------|------|------|
POST | `/api/projects` | Create project |
GET | `/api/projects` | Get project list |
GET | `/api/projects/:id` | Get single project |
PATCH | `/api/projects/:id` | Update project |
DELETE | `/api/projects/:id` | Delete project |

---

### Tasks

| Method | Endpoint | Description |
|------|------|------|
POST | `/api/tasks` | Create task |
PATCH | `/api/tasks/:id/status` | Update task status |
PATCH | `/api/tasks/:id/assign` | Assign task to user |

---

## Pagination Example

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|------|------|------|
POST | `/api/auth/signup` | Register new user |
POST | `/api/auth/login` | Login user |

---

### Projects

| Method | Endpoint | Description |
|------|------|------|
POST | `/api/projects` | Create project |
GET | `/api/projects` | Get project list |
GET | `/api/projects/:id` | Get single project |
PATCH | `/api/projects/:id` | Update project |
DELETE | `/api/projects/:id` | Delete project |

---

### Tasks

| Method | Endpoint | Description |
|------|------|------|
POST | `/api/tasks` | Create task |
PATCH | `/api/tasks/:id/status` | Update task status |
PATCH | `/api/tasks/:id/assign` | Assign task to user |

---

## Pagination Example

Response:

```json
{
  "data": [],
  "meta": {
    "totalCount": 25,
    "totalPages": 3,
    "current_page": 1,
    "per_page": 10
  }
}
git clone https://github.com/BilalProgramming/dev-collab-board-backend.git
cd project-management-api
npm install

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

npm run dev

npm run build
npm start