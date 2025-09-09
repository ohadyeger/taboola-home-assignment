# Ad Metrics Analytics Platform

A comprehensive full-stack application for analyzing advertising metrics with advanced aggregation capabilities, built with React, Spring Boot, and ClickHouse.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Ad Metrics Dashboard**: Real-time visualization of advertising performance data
- **Advanced Aggregation**: Multi-dimensional data aggregation with flexible grouping
- **Data Export**: Export aggregated data in CSV and JSON formats
- **Pagination**: Efficient handling of large datasets
- **Filtering & Sorting**: Comprehensive filtering by dimensions and metrics
- **Admin Panel**: Admin users can view all data across all accounts
- **Responsive UI**: Modern, mobile-friendly interface built with Tailwind CSS

## 📋 Documentation

- **[Design Document](DESIGN.md)** - Comprehensive technical architecture and design decisions

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Spring Boot 3.3.2 + Java 17 + Spring Security
- **Database**: ClickHouse (columnar database optimized for analytics)
- **Authentication**: JWT tokens
- **Containerization**: Docker + Docker Compose

### Project Structure
```
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/      # REST API endpoints
│   │   ├── service/         # Business logic
│   │   ├── model/          # Data models
│   │   ├── security/       # JWT authentication
│   │   └── config/         # Application configuration
│   └── src/main/resources/
│       ├── mock_accounts.csv    # Test user data
│       └── mock_ad_metrics.csv  # Test metrics data
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript definitions
│   │   └── utils/         # Utility functions
│   └── dist/              # Built application
├── db/                    # Database initialization
│   └── init_clean.sql     # ClickHouse schema
└── docker-compose.yml     # Multi-service orchestration
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- (Optional) Java 17 and Node.js 18+ for local development

### Running with Docker (Recommended)

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
   - ClickHouse: http://localhost:8123

### Local Development

#### Backend (Spring Boot)
```bash
cd backend

# Set environment variables
export DB_URL=jdbc:clickhouse://localhost:8123/appdb
export DB_USERNAME=default
export DB_PASSWORD=app
export SERVER_PORT=8080
export CORS_ORIGIN=http://localhost:5173
export JWT_SECRET=please-change-this-secret-key-32bytes-minimum
export ADMIN_EMAIL=admin@example.com
export ADMIN_PASSWORD=admin123

# Run the application
mvn spring-boot:run
```

#### Frontend (React)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
VITE_API_URL=http://localhost:8080 npm run dev
```

## 📊 Data Model

### Ad Metrics Schema
The application tracks advertising performance across multiple dimensions:

- **Temporal**: day, week, month
- **Account**: account_id (UUID)
- **Campaign**: campaign name
- **Geographic**: country (2-letter code)
- **Platform**: advertising platform
- **Browser**: user browser
- **Metrics**: spent (decimal), impressions (count), clicks (count)

### Database Tables
- `ads_metrics`: Main metrics table with SummingMergeTree engine for efficient aggregation
- `accounts`: User accounts with email/password authentication

## 🔌 API Reference

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Ad Metrics Endpoints
- `GET /api/ads/my` - Get user's ad metrics
- `GET /api/ads/my/paginated` - Get paginated ad metrics
- `GET /api/ads/countries` - Get available countries
- `GET /api/ads/campaigns` - Get available campaigns
- `GET /api/ads/platforms` - Get available platforms
- `GET /api/ads/browsers` - Get available browsers

### Aggregation Endpoints
- `POST /api/aggregate` - Get aggregated metrics data
- `POST /api/aggregate/paginated` - Get paginated aggregated data
- `GET /api/aggregate/dimensions` - Get available dimensions and metrics
- `POST /api/aggregate/export/csv` - Export data as CSV
- `POST /api/aggregate/export/json` - Export data as JSON

### Request/Response Examples

#### Aggregation Request
```json
{
  "groupBy": ["day", "campaign", "country"],
  "metrics": ["spent", "impressions", "clicks"],
  "countryFilter": "US",
  "campaignFilter": "All",
  "platformFilter": "All",
  "browserFilter": "All",
  "sortBy": "spent",
  "sortDirection": "desc",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "page": 0,
  "size": 10
}
```

#### Aggregation Response
```json
{
  "data": [
    {
      "dimensions": {
        "day": "2024-01-15",
        "campaign": "Summer Sale",
        "country": "US"
      },
      "totalSpent": 1250.50,
      "totalImpressions": 50000,
      "totalClicks": 1250,
      "recordCount": 5
    }
  ],
  "currentPage": 0,
  "totalPages": 5,
  "totalElements": 50,
  "pageSize": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

## 👥 User Management

### Admin User
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Access**: Full access to all metrics across all accounts

### Test Users
The application includes 10 test users for development and testing:
- **Emails**: `user1@example.com` through `user10@example.com`
- **Password**: `password123` (all users)
- **Access**: Limited to their own account's metrics

## 🔧 Configuration

### Environment Variables

#### Backend Configuration
- `DB_URL`: ClickHouse connection string (default: `jdbc:clickhouse://clickhouse:8123/appdb`)
- `DB_USERNAME`: Database username (default: `default`)
- `DB_PASSWORD`: Database password (default: `app`)
- `SERVER_PORT`: Application port (default: `8080`)
- `CORS_ORIGIN`: Allowed CORS origin (default: `http://localhost:3000`)
- `JWT_SECRET`: JWT signing secret (default: `please-change-this-secret-key-32bytes-minimum`)
- `ADMIN_EMAIL`: Admin user email (default: `admin@example.com`)
- `ADMIN_PASSWORD`: Admin user password (default: `admin123`)

#### Frontend Configuration
- `VITE_API_URL`: Backend API URL (default: `http://localhost:8081`)

### Docker Compose Services
- **clickhouse**: ClickHouse database server
- **backend**: Spring Boot application
- **frontend**: React application served by Nginx

## 📈 Mock Data

The application includes comprehensive test data:
- **150+ AdMetrics records** with realistic distributions
- **Multiple campaigns** across different countries and platforms
- **Various browsers and platforms** for comprehensive testing
- **Time-series data** spanning multiple weeks
- **Account-specific data** for testing user isolation

## 🛠️ Development Commands

### Docker Commands
```bash
# Rebuild all services
docker compose build --no-cache

# Stop and remove containers with volumes
docker compose down -v

# View logs
docker compose logs -f [service-name]

# Execute commands in running containers
docker compose exec backend bash
docker compose exec clickhouse clickhouse-client
```

### Maven Commands
```bash
# Build backend
mvn -f backend/pom.xml clean package

# Run tests
mvn -f backend/pom.xml test

# Skip tests during build
mvn -f backend/pom.xml -DskipTests package
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin vs regular user permissions
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Input Validation**: Server-side validation of all requests
- **SQL Injection Protection**: Parameterized queries and ORM usage

## 📊 Performance Optimizations

- **ClickHouse SummingMergeTree**: Optimized for analytical queries
- **Pagination**: Efficient handling of large datasets
- **Database Indexing**: Optimized query performance
- **Frontend Optimization**: React hooks for efficient state management
- **Docker Multi-stage Builds**: Optimized container images

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000, 8081, and 8123 are available
2. **Database Connection**: Wait for ClickHouse to fully initialize before starting backend
3. **CORS Errors**: Verify CORS_ORIGIN matches your frontend URL
4. **Authentication Issues**: Check JWT_SECRET is set and consistent

### Debug Mode
```bash
# Enable debug logging
export LOGGING_LEVEL_COM_EXAMPLE_DEMO=DEBUG
```

## 📝 License

This project is part of a technical assessment and is intended for evaluation purposes.

## 🤝 Contributing

This is a home assignment project. For questions or issues, please contact the development team.


