# 📌 Todo Management System

A premium, modern Notion-style Todo List Management System featuring advanced tracking metrics, multi-priority status flags, clean database exception handling, and full Docker orchestration support.

---

## 📖 Overview

This application is designed as a professional-grade Todo list manager. It provides a visual dashboard for personal tasks with robust data validation, API standards, and a sleek glassmorphic user interface supporting instant filtering, title-based search, sorting, and manual dark mode controls.

---

## ✨ Features

- 📝 **Full CRUD Support**: Create, read, update, and delete tasks.
- 🔄 **Notion-Style Click-to-Cycle Status**: Toggle status directly by clicking the status icons (`TODO` ➔ `IN_PROGRESS` ➔ `DONE` ➔ `TODO`).
- ⚡ **Priority Matrix**: Classify tasks by priority (`LOW`, `MEDIUM`, `HIGH`) with customized visual indicators.
- 📅 **Smart Due Dates**: Track task due dates with indicators for active, upcoming, and overdue statuses.
- 📊 **Real-time Statistics Dashboard**: Counters for total, todo, in-progress, and completed tasks that update automatically.
- 🔍 **Unified Query Controls**: Search tasks by name, filter by status and priority, and sort by date, priority, or title.
- 🌓 **Manual Dark Mode**: Smooth HSL color-scheme toggling tailored for developer environments.
- 🛡 **Double-layered Validation**: Strict frontend validation (React Hook Form + Zod) coupled with backend validation (JSR-303 Validation).
- 🚨 **Global Exception Handling**: Returns clean, standard API error payloads for any server errors.
- 🐳 **Docker-Compose Ready**: Spin up the complete infrastructure (MySQL DB, Spring Backend, and Nginx React Frontend) in one command.

---

## 🛠 Tech Stack

### Backend
- **Core**: Java 21 & Spring Boot 3
- **Data Access**: Spring Data JPA & Hibernate
- **Validation**: Spring Validation (JSR-303)
- **Database**: MySQL 8.0 & H2 (for testing)
- **API Specs**: Springdoc OpenAPI v3 (Swagger UI)
- **Utility**: Lombok

### Frontend
- **Framework**: React 19 & TypeScript & Vite
- **Styling**: Tailwind CSS v4
- **State Management & Querying**: TanStack Query (React Query) v5
- **Forms**: React Hook Form & Zod Schema Validation
- **UI Elements**: Lucide Icons & React Hot Toast

### DevOps
- **Containerization**: Docker & Docker Compose

---

## 🏗 Architecture

```
                                +-------------------+
                                |   User Browser    |
                                +---------+---------+
                                          |
                                    HTTP  |  Port 3000 (React App via Nginx)
                                          v
                                +---------+---------+
                                |  React Frontend   |
                                +---------+---------+
                                          |
                                    REST  |  Port 8080 (JSON payloads)
                                          v
                                +---------+---------+
                                |  Spring Boot App  |
                                +---------+---------+
                                          |
                                    JPA   |  Port 3306 (MySQL)
                                          v
                                +---------+---------+
                                |     MySQL DB      |
                                +-------------------+
```

---

## 📁 Folder Structure

```
Todo Management System
├── backend/
│   ├── src/
│   │   ├── main/java/com/todo/
│   │   │   ├── config/             # Configuration files
│   │   │   ├── controller/         # REST Controllers (Endpoints definition)
│   │   │   ├── dto/                # Request and Response payloads
│   │   │   ├── entity/             # JPA Database Entities & Enums
│   │   │   ├── exception/          # Custom Exception handlers
│   │   │   ├── mapper/             # Entity/DTO conversion mappers
│   │   │   ├── repository/         # Spring Data JPA repositories
│   │   │   ├── service/            # Business logic implementations
│   │   │   └── TodoApplication.java# Main Application Class
│   │   └── main/resources/
│   │       └── application.yml     # Database & Server Settings
│   ├── Dockerfile                  # Multi-stage Java build
│   └── pom.xml                     # Maven dependencies file
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # Reusable global layout parts
│   │   │   └── ui/                 # Small atomic elements (Modals, Buttons)
│   │   ├── features/todo/
│   │   │   ├── api/                # Axios API calls
│   │   │   ├── components/         # TodoCard, TodoForm, DashboardStats
│   │   │   ├── hooks/              # TanStack Query mutations & queries
│   │   │   ├── pages/              # TodoPage main dashboard layout
│   │   │   └── types/              # TS interface models
│   │   ├── services/               # Axios Instance wrapper
│   │   ├── App.tsx                 # Routes and Providers mapping
│   │   ├── index.css               # Tailwind CSS & HSL theme configurations
│   │   └── main.tsx                # StrictMode React DOM binder
│   ├── Dockerfile                  # Multi-stage Nginx containerization
│   ├── nginx.conf                  # SPA Fallback routing mappings
│   └── package.json                # Dependencies config
│
├── docker-compose.yml              # DB, Backend, and Frontend Orchestration
└── README.md                       # Documentation
```

---

## 🚀 Installation & Running

### Option A: Direct Local Setup (Without Docker)

#### Prerequisites
- **Java 21 JDK** installed
- **Node.js v22+** installed
- **MySQL Server** installed & running (with a database `todo_db` created, or Spring Boot will auto-create it)

#### 1. Running the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and package the project:
   ```bash
   mvn clean package -DskipTests
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will boot up at `http://localhost:8080`.*

#### 2. Running the Frontend
1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The React app will be served at `http://localhost:5173`.*

---

### Option B: Docker Compose (Recommended)

To run the database, backend server, and frontend server automatically inside linked containers:

1. Open your terminal in the root folder (where `docker-compose.yml` resides).
2. Start the services:
   ```bash
   docker-compose up --build -d
   ```
3. Verify all containers are running:
   ```bash
   docker-compose ps
   ```
   - **Frontend App**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8080`
   - **MySQL Database**: `localhost:3306` (username: `root`, password: `root`)

To tear down the containers:
```bash
docker-compose down
```

---

## 📚 API Documentation

Once the backend is running, Swagger UI is available to explore and interact with API endpoints:
🔗 **[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)**

### Rest API Endpoints Summary

| HTTP Method | Route | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/todos` | List all todos | `title` (Search), `status` (Filter), `priority` (Filter), `sortBy`, `sortDir` |
| **GET** | `/todos/{id}` | Get todo detail | - |
| **POST** | `/todos` | Create a new task | JSON Request Body |
| **PUT** | `/todos/{id}` | Edit a task details | JSON Request Body |
| **PATCH** | `/todos/{id}/status` | Update task status | `{ "status": "IN_PROGRESS" }` |
| **DELETE**| `/todos/{id}` | Delete a task | - |
| **GET** | `/todos/search` | Fast search | `q` (title search term) |
| **GET** | `/todos/filter` | Fast filter | `status`, `priority` |
| **GET** | `/todos/stats` | Dashboard counts | - |

---

## 📷 Screenshots

*A screenshot directory can be populated under `docs/screenshots`.*
1. **Dashboard Light Mode**: Elegant glassmorphic cards showing statistics and tasks.
2. **Dashboard Dark Mode**: Developer-first dark theme with clean color contrast.
3. **Form Validations**: Standard tooltips showing title validations and due date warnings.

---

## 👨‍💻 Author

- **Antigravity AI (Pair Programming with User)**
