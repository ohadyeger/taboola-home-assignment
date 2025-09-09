# Ad Metrics Analytics Platform - Design Document

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Data Model](#data-model)
5. [API Design](#api-design)
6. [Security Architecture](#security-architecture)
7. [Frontend Architecture](#frontend-architecture)
8. [Database Design](#database-design)
9. [Performance Considerations](#performance-considerations)
10. [Deployment Architecture](#deployment-architecture)
11. [Development Workflow](#development-workflow)
12. [Future Enhancements](#future-enhancements)

## Overview

The Ad Metrics Analytics Platform is a full-stack web application designed to provide comprehensive analytics and reporting capabilities for advertising metrics. The system enables users to view, aggregate, and export advertising performance data across multiple dimensions including time, geography, campaigns, platforms, and browsers.

### Key Requirements
- **Multi-tenant Data Isolation**: Users can only access their own account's data
- **Admin Oversight**: Admin users can view all data across accounts
- **Real-time Analytics**: Fast aggregation and reporting on large datasets
- **Export Capabilities**: Data export in CSV and JSON formats
- **Responsive UI**: Modern, mobile-friendly interface
- **Scalable Architecture**: Built to handle growing data volumes

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Spring Boot) │◄──►│   (ClickHouse)  │
│   Port: 3000    │    │   Port: 8081    │    │   Port: 8123    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Interaction Flow

1. **User Authentication**: JWT-based authentication with role-based access control
2. **Data Request**: Frontend sends API requests to backend
3. **Authorization**: Backend validates JWT and enforces data access rules
4. **Data Processing**: Backend queries ClickHouse with optimized aggregation queries
5. **Response**: Structured data returned to frontend for visualization
6. **Export**: Optional data export functionality for external analysis

## Technology Stack

### Frontend
- **React 18.3.1**: Modern UI library with hooks and functional components
- **TypeScript 5.5.4**: Type safety and enhanced developer experience
- **Vite 5.4.1**: Fast build tool and development server
- **Tailwind CSS 3.4.17**: Utility-first CSS framework for responsive design
- **Custom Hooks**: Reusable state management and API integration

### Backend
- **Spring Boot 3.3.2**: Enterprise-grade Java framework
- **Java 17**: Modern Java with enhanced performance and features
- **Spring Security**: Comprehensive security framework
- **Spring JDBC**: Database connectivity and query management
- **JWT (jjwt 0.11.5)**: JSON Web Token implementation for authentication

### Database
- **ClickHouse**: Columnar database optimized for analytical workloads
- **SummingMergeTree Engine**: Efficient aggregation and data compression
- **Materialized Columns**: Pre-computed temporal dimensions (day, week, month)

### Infrastructure
- **Docker**: Containerization for consistent deployment
- **Docker Compose**: Multi-service orchestration
- **Nginx**: Frontend web server (production)
- **Maven**: Backend dependency management and build tool

## Data Model

### Core Entities

#### AdMetrics
```java
public class AdMetrics {
    private String day;           // Date dimension
    private String week;         // Week dimension  
    private String month;        // Month dimension
    private UUID accountId;      // Account isolation
    private String campaign;     // Campaign dimension
    private String country;      // Geographic dimension (2-letter code)
    private String platform;     // Platform dimension
    private String browser;      // Browser dimension
    private BigDecimal spent;    // Monetary metric
    private long impressions;    // Count metric
    private long clicks;         // Count metric
}
```

#### AggregatedMetrics
```java
public class AggregatedMetrics {
    private Map<String, Object> dimensions;  // Dynamic dimension values
    private BigDecimal totalSpent;           // Aggregated spent
    private Long totalImpressions;           // Aggregated impressions
    private Long totalClicks;                // Aggregated clicks
    private Integer recordCount;             // Number of source records
}
```

### Database Schema

#### ads_metrics Table
```sql
CREATE TABLE appdb.ads_metrics (
    event_time DateTime,
    day Date MATERIALIZED toDate(event_time),
    week Date MATERIALIZED toStartOfWeek(event_time, 1),
    month Date MATERIALIZED toStartOfMonth(event_time),
    account_id UUID,
    campaign String,
    country FixedString(2),
    platform LowCardinality(String),
    browser LowCardinality(String),
    spent Decimal(18,6),
    impressions UInt64,
    clicks UInt64
)
ENGINE = SummingMergeTree((spent, impressions, clicks))
PARTITION BY toYYYYMM(day)
ORDER BY (day, account_id, campaign, country, platform, browser);
```

#### accounts Table
```sql
CREATE TABLE appdb.accounts (
    id UUID,
    email String,
    password_hash String,
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree
ORDER BY (email);
```

### Data Relationships
- **One-to-Many**: Account → AdMetrics (account isolation)
- **Many-to-Many**: AdMetrics ↔ Dimensions (campaign, country, platform, browser)
- **Temporal Hierarchy**: event_time → day → week → month

## API Design

### RESTful API Structure

#### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration

#### Ad Metrics Endpoints
- `GET /api/ads/my` - Get user's raw metrics
- `GET /api/ads/my/paginated` - Get paginated raw metrics
- `GET /api/ads/countries` - Get available countries
- `GET /api/ads/campaigns` - Get available campaigns
- `GET /api/ads/platforms` - Get available platforms
- `GET /api/ads/browsers` - Get available browsers

#### Aggregation Endpoints
- `POST /api/aggregate` - Get aggregated metrics
- `POST /api/aggregate/paginated` - Get paginated aggregated metrics
- `GET /api/aggregate/dimensions` - Get available dimensions and metrics
- `POST /api/aggregate/export/csv` - Export as CSV
- `POST /api/aggregate/export/json` - Export as JSON

### Request/Response Patterns

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

## Security Architecture

### Authentication Flow
1. **User Login**: Credentials validated against database
2. **JWT Generation**: Signed token created with user claims
3. **Token Storage**: JWT stored in browser (localStorage/sessionStorage)
4. **Request Authorization**: Token included in API requests
5. **Token Validation**: Backend validates signature and expiration

### Authorization Model
- **Role-Based Access Control (RBAC)**:
  - **Admin Users**: Full access to all account data
  - **Regular Users**: Access limited to own account data
- **Data Isolation**: Account-based filtering enforced at database level
- **JWT Claims**: User ID and role embedded in token

### Security Features
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Input Validation**: Server-side validation of all requests
- **SQL Injection Protection**: Parameterized queries and ORM usage
- **Password Hashing**: Secure password storage (bcrypt)
- **Token Expiration**: Configurable JWT expiration times

### Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // JWT authentication filter
    // Password encoder configuration
    // CORS configuration
    // Security rules for endpoints
}
```

## Frontend Architecture

### Component Hierarchy
```
App
├── AuthForm (Login/Register)
├── Dashboard
│   ├── DashboardHeader
│   ├── Filters
│   ├── DataAggregation
│   └── RawDataTable
└── UI Components
    ├── Button
    ├── Card
    ├── ErrorAlert
    ├── LoadingSpinner
    └── Pagination
```

### State Management
- **React Context**: Global application state (authentication, user info)
- **Custom Hooks**: Encapsulated state logic for specific features
- **Local State**: Component-level state for UI interactions

### Custom Hooks
- `useAuth`: Authentication state and methods
- `useAdMetrics`: Raw metrics data management
- `useAggregatedData`: Aggregated metrics and filtering
- `useFilters`: Filter state management

### Type Safety
```typescript
export type AggregatedMetrics = {
  dimensions: Record<string, any>;
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  recordCount: number;
}

export type FilterState = {
  selectedCountry: string;
  selectedCampaign: string;
  selectedPlatform: string;
  selectedBrowser: string;
  startDate: string;
  endDate: string;
}
```

## Database Design

### ClickHouse Optimization

#### SummingMergeTree Engine
- **Automatic Aggregation**: Pre-aggregates metrics during inserts
- **Compression**: Efficient storage for analytical workloads
- **Partitioning**: Monthly partitions for query performance

#### Materialized Columns
- **Pre-computed Dimensions**: day, week, month calculated automatically
- **Storage Efficiency**: Reduces computation during queries
- **Query Performance**: Faster temporal filtering and grouping

#### Indexing Strategy
- **Primary Key**: (day, account_id, campaign, country, platform, browser)
- **Partition Key**: toYYYYMM(day) for temporal partitioning
- **LowCardinality**: Optimized storage for platform and browser

### Query Optimization
```sql
-- Efficient aggregation query
SELECT 
    day,
    campaign,
    country,
    sum(spent) as totalSpent,
    sum(impressions) as totalImpressions,
    sum(clicks) as totalClicks,
    count() as recordCount
FROM ads_metrics 
WHERE account_id = ? 
    AND day >= ? 
    AND day <= ?
GROUP BY day, campaign, country
ORDER BY totalSpent DESC
LIMIT ? OFFSET ?
```

## Performance Considerations

### Backend Optimizations
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Optimized SQL queries with proper indexing
- **Pagination**: Efficient handling of large result sets
- **Caching**: Potential for Redis integration for frequently accessed data

### Frontend Optimizations
- **React Hooks**: Efficient state management and re-rendering
- **Lazy Loading**: Component-based code splitting
- **Debounced Search**: Reduced API calls for filter changes
- **Optimistic Updates**: Immediate UI feedback for better UX

### Database Optimizations
- **Columnar Storage**: ClickHouse's columnar format for analytical queries
- **Compression**: Automatic data compression
- **Parallel Processing**: Multi-core query execution
- **Memory Management**: Efficient memory usage for large datasets

### Scalability Considerations
- **Horizontal Scaling**: Stateless backend services
- **Database Sharding**: Potential for account-based sharding
- **CDN Integration**: Static asset delivery optimization
- **Load Balancing**: Multiple backend instances

## Deployment Architecture

### Docker Compose Services
```yaml
services:
  clickhouse:    # Database server
  backend:      # Spring Boot application
  frontend:     # React application (Nginx)
```

### Container Configuration
- **Multi-stage Builds**: Optimized container images
- **Health Checks**: Service dependency management
- **Volume Mounts**: Database initialization scripts
- **Network Isolation**: Internal service communication

### Environment Configuration
- **Environment Variables**: Configurable application settings
- **Secrets Management**: Secure credential handling
- **Port Mapping**: External service access
- **Resource Limits**: Container resource constraints

## Development Workflow

### Local Development
1. **Docker Compose**: Full stack with `docker compose up`
2. **Individual Services**: Run backend/frontend separately for development
3. **Hot Reload**: Frontend development server with Vite
4. **Database Access**: Direct ClickHouse client access

### Build Process
- **Backend**: Maven-based build with Spring Boot plugin
- **Frontend**: Vite build with TypeScript compilation
- **Docker**: Multi-stage builds for production optimization

### Testing Strategy
- **Unit Tests**: Backend service and utility testing
- **Integration Tests**: API endpoint testing
- **Frontend Tests**: Component and hook testing (future enhancement)
- **End-to-End Tests**: Full workflow testing (future enhancement)

## Future Enhancements

### Short-term Improvements
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Filtering**: More sophisticated filter combinations
- **Data Visualization**: Charts and graphs for metrics visualization
- **Export Enhancements**: Additional export formats (Excel, PDF)

### Medium-term Features
- **User Management**: Admin panel for user administration
- **Data Import**: CSV upload for additional data sources
- **Scheduled Reports**: Automated report generation
- **API Rate Limiting**: Request throttling and quotas

### Long-term Scalability
- **Microservices**: Service decomposition for better scalability
- **Event Streaming**: Kafka integration for real-time data processing
- **Machine Learning**: Predictive analytics and insights
- **Multi-tenancy**: Enhanced tenant isolation and management

### Technical Debt
- **Test Coverage**: Comprehensive test suite implementation
- **Monitoring**: Application performance monitoring (APM)
- **Logging**: Structured logging with correlation IDs
- **Documentation**: API documentation with OpenAPI/Swagger

---

## Conclusion

The Ad Metrics Analytics Platform represents a modern, scalable solution for advertising analytics. The architecture leverages proven technologies (React, Spring Boot, ClickHouse) while implementing best practices for security, performance, and maintainability. The system is designed to grow with increasing data volumes and user requirements while maintaining high performance and reliability.

The modular design allows for incremental enhancements and the containerized deployment ensures consistent environments across development, testing, and production stages.
