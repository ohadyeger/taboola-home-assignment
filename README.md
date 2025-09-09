# Ad Metrics Analytics Platform

A full-stack application for analyzing advertising metrics with advanced aggregation capabilities, built with React, Spring Boot, and ClickHouse.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Taboola Home Assignment"
   ```

2. **Start all services**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8081

## 🎥 Demo

Watch the application in action:

[![App Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

*Replace `YOUR_VIDEO_ID` with your actual YouTube video ID*

## 👥 Default Users

### Admin User
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Test Users
- **Emails**: `user1@example.com` through `user10@example.com`
- **Password**: `password123`

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📋 Documentation

- **[Design Document](docs/DESIGN.md)** - Complete technical architecture, API reference, testing strategy, and implementation details
- **[Development Prompts](docs/PROMPTS.md)** - Comprehensive list of AI prompts used to build this project
- **[Frontend Refactoring Notes](docs/REFACTORING.md)** - Frontend architecture and component structure

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Spring Boot 3.3.2 + Java 17 + Spring Security
- **Database**: ClickHouse (columnar database optimized for analytics)
- **Authentication**: JWT tokens
- **Containerization**: Docker + Docker Compose

## 📝 License

This project is part of a technical assessment and is intended for evaluation purposes.


