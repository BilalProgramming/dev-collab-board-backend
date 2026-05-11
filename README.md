
# Multi-Tenant Project Management API

A production-ready RESTful backend built with **Node.js, Express.js, MongoDB, and TypeScript**. This API implements a robust **Multi-Tenant Architecture** to ensure complete data isolation between different organizations.

---

## 🚀 Core Features

### 🛡️ Multi-Tenancy & Security
* **Tenant Isolation:** Custom middleware ensures users only access data belonging to their specific `tenantId`.
* **JWT Authentication:** Secure token-based access with custom payload including user and tenant context.
* **RBAC:** Role-Based Access Control to manage permissions across Admin, Manager, and User roles.
* **Resource Authorization:** Strict ownership validation — only project owners can modify their resources.

### 📂 Project & Task Management
* **Enterprise CRUD:** Full lifecycle management for Projects and Tasks.
* **Kanban Workflow:** Track progress through `todo`, `in-progress`, and `done` statuses.
* **Task Assignment:** Dynamic task assignment to specific users within the same tenant.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Language:** TypeScript (Type-safe development)
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Security:** JWT, Bcrypt, Express Validator

---

## 📂 Project Structure

```text
src
├── controllers   # Request handling & Response formatting
├── services      # Core Business Logic & DB Queries
├── models        # Mongoose Schemas & TypeScript Interfaces
├── routes        # API Endpoint definitions
├── middleware    # Auth & Tenant Isolation filters
└── types         # Custom Type definitions for AuthRequests

```

---

## 📑 API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register user + Create Tenant |
| POST | `/api/auth/login` | Login & receive Tenant-scoped JWT |

### Projects (Tenant Restricted)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/projects` | Create a new project |
| GET | `/api/projects` | Get list (Paginated & Tenant-scoped) |
| PATCH | `/api/projects/:id` | Update project (Ownership check) |
| DELETE | `/api/projects/:id` | Soft/Hard delete project |

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/tasks` | Create task inside project |
| PATCH | `/api/tasks/:id/status` | Transition status (Kanban flow) |
| PATCH | `/api/tasks/:id/assign` | Assign to user in same tenant |

---

## 📊 Pagination Example

Response structure for high-volume data:

```json
{
  "data": [...],
  "meta": {
    "totalCount": 25,
    "totalPages": 3,
    "current_page": 1,
    "per_page": 10
  }
}

```

---

## ⚙️ Installation & Setup

1. **Clone the repo:**
```bash
git clone [https://github.com/BilalProgramming/dev-collab-board-backend.git](https://github.com/BilalProgramming/dev-collab-board-backend.git)
cd project-management-api

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment:** Create a `.env` file:
```text
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secure_secret

```


4. **Run Development:**
```bash
npm run dev

```


5. **Build for Production:**
```bash
npm run build
npm start

```



```

```