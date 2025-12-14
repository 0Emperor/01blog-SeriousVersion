# 01-Blog

A modern, full-stack blog application designed for personal branding and sharing experiences. Built with a robust **Spring Boot** backend and a dynamic **Angular** frontend, this project demonstrates a complete web application architecture with authentication, content management, and social interactions.

## 🌟 Key Features

*   **User Authentication**: Secure login and registration using JWT (JSON Web Tokens) and Spring Security.
*   **Rich Content Creation**:
    *   Create and edit posts using a rich text editor (**Quill**).
    *   Markdown support for technical content.
    *   Image uploads and management.
*   **Social Interactions**:
    *   **Follow System**: Follow other users to see their posts in your feed.
    *   **Explore**: Discover new users and content.
    *   **Likes & Comments** (Implied feature based on blog architecture).
*   **Profile Management**: Customizable user profiles with profile pictures.
*   **Security**:
    *   Role-based access control.
    *   Rate limiting using **Bucket4j** to prevent abuse.
    *   Input validation and sanitization.
*   **Modern UI/UX**: Responsive design using **Angular Material** and **SCSS**.

## 🛠 Tech Stack

### Backend
*   **Framework**: [Spring Boot 3.5.6](https://spring.io/projects/spring-boot)
*   **Language**: Java 17
*   **Database**: PostgreSQL 15
*   **Security**: Spring Security, OAuth2 Resource Server, JWT (jjwt 0.11.5)
*   **ORM**: Spring Data JPA (Hibernate)
*   **Utilities**: Lombok, Bucket4j (Rate Limiting), Velocity

### Frontend
*   **Framework**: [Angular 20](https://angular.io/)
*   **UI Component Library**: Angular Material
*   **Styling**: SCSS
*   **Editor**: ngx-quill (Quill.js)
*   **Markdown**: ngx-markdown
*   **State Management**: RxJS

### Infrastructure
*   **Containerization**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites
*   **Docker** and **Docker Compose** (Recommended for easiest setup)
*   *Alternatively for manual setup*:
    *   Java JDK 17
    *   Node.js (v18 or higher)
    *   PostgreSQL

### Option 1: Quick Start with Docker (Recommended)

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd 01blog-SeriousVersion
    ```

2.  **Run with Docker Compose**:
    This command will build both the backend and frontend images, and start the PostgreSQL database.
    ```bash
    docker-compose up --build
    ```

3.  **Access the Application**:
    *   Frontend: `http://localhost:4200`
    *   Backend API: `http://localhost:8080`

### Option 2: Manual Setup

#### 1. Database Setup
Ensure you have a PostgreSQL instance running. Create a database and user matching the configuration (or update `src/main/resources/application.properties`):
*   **Database**: `01blogdb`
*   **Username**: `01blog`
*   **Password**: `01blogpass`

#### 2. Backend Setup
Navigate to the backend directory and run the application:
```bash
cd 01-Blog-backend
./mvnw spring-boot:run
```
The backend server will start on `http://localhost:8080`.

#### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd 01-Blog-frontend
npm install
npm intall -g @angular/cli
ng serve
```
The application will be available at `http://localhost:4200`.

## 📂 Project Structure

```
01blog-SeriousVersion/
├── 01-Blog-backend/    # Spring Boot application source code
├── 01-Blog-frontend/   # Angular application source code
├── docker-compose.yml  # Docker orchestration configuration
└── README.md           # Project documentation
```

## 🔐 Credentials (Dev Environment)

If you are running the seeded database (via Docker), you can use the configured users or register a new one.
*   **DB User**: `01blog`
*   **DB Password**: `01blogpass`
*   **DB Name**: `01blogdb`
