# Development Prompts Used

This document lists the various prompts and instructions used to build the Ad Metrics Analytics Platform using Cursor AI. The project was developed iteratively, with each phase building upon the previous one.

## Table of Contents

1. [Project Setup & Boilerplate](#project-setup--boilerplate)
2. [Database Schema & Tables](#database-schema--tables)
3. [Data Display & GUI](#data-display--gui)
4. [User Authentication & Authorization](#user-authentication--authorization)
5. [Data Aggregation](#data-aggregation)
6. [Filtering System](#filtering-system)
7. [Pagination & Sorting](#pagination--sorting)
8. [Export Functionality](#export-functionality)
9. [UI/UX Improvements](#uiux-improvements)
10. [Testing Implementation](#testing-implementation)
11. [Documentation & CI/CD](#documentation--cicd)
12. [Additional Features](#additional-features)

---

## Project Setup & Boilerplate

### Initial Project Structure
**Prompt:** "Create a full-stack application boilerplate with:
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Spring Boot + Java 17 + Spring Security
- Database: ClickHouse (columnar database for analytics)
- Containerization: Docker + Docker Compose
- Project structure with separate frontend/backend directories"

### Docker Configuration
**Prompt:** "Set up Docker Compose configuration with:
- ClickHouse database service with proper initialization
- Spring Boot backend service with health checks
- React frontend service with Nginx
- Proper networking and environment variables
- Database initialization scripts"

### Build Configuration
**Prompt:** "Configure build tools:
- Maven configuration for Spring Boot with ClickHouse JDBC driver
- Vite configuration for React with TypeScript
- Tailwind CSS setup with PostCSS
- Docker multi-stage builds for production optimization"

---

## Database Schema & Tables

### ClickHouse Schema Design
**Prompt:** "Design ClickHouse database schema for advertising metrics:
- Create ads_metrics table with SummingMergeTree engine
- Include dimensions: day, week, month, account_id, campaign, country, platform, browser
- Include metrics: spent (decimal), impressions (uint64), clicks (uint64)
- Add materialized columns for temporal dimensions
- Optimize for analytical queries with proper partitioning"

### Database Initialization
**Prompt:** "Create database initialization scripts:
- SQL scripts for table creation
- Mock data generation for testing
- Account table for user management
- Proper indexing and constraints"

### Data Seeding
**Prompt:** "Generate realistic mock data:
- Create CSV files with advertising metrics
- Generate multiple accounts with different data
- Include various campaigns, countries, platforms, browsers
- Ensure data spans multiple time periods"

---

## Data Display & GUI

### Basic Data Table
**Prompt:** "Create a React component to display raw advertising metrics:
- Table component with columns for all metrics
- Responsive design with Tailwind CSS
- Loading states and error handling
- Basic data fetching from backend API"

### Dashboard Layout
**Prompt:** "Design dashboard layout:
- Header with user information
- Main content area for data display
- Sidebar for navigation (if needed)
- Responsive grid layout"

### Data Visualization Components
**Prompt:** "Create UI components for data display:
- Card components for metrics summary
- Table components with proper styling
- Loading spinners and error alerts
- Button components with consistent styling"

---

## User Authentication & Authorization

### JWT Authentication System
**Prompt:** "Implement JWT-based authentication:
- Spring Security configuration with JWT
- Login/logout endpoints
- Token generation and validation
- Password hashing with bcrypt"

### User Management
**Prompt:** "Create user management system:
- User registration and login
- Admin user creation
- Role-based access control (admin vs regular users)
- Account isolation for data access"

### Frontend Authentication
**Prompt:** "Implement frontend authentication:
- Login/logout forms
- JWT token storage and management
- Protected routes
- Authentication context and hooks"

### Data Access Control
**Prompt:** "Implement data access control:
- Users can only see their own account data
- Admin users can see all data
- Backend filtering based on user account
- Proper authorization checks on all endpoints"

---

## Data Aggregation

### Aggregation Service
**Prompt:** "Create aggregation service for advertising metrics:
- Dynamic grouping by multiple dimensions
- SUM aggregation for metrics (spent, impressions, clicks)
- Flexible dimension selection
- Optimized ClickHouse queries"

### Aggregation API Endpoints
**Prompt:** "Create REST API for aggregations:
- POST endpoint for aggregation requests
- Support for multiple groupBy dimensions
- Metric selection (spent, impressions, clicks)
- Proper request/response models"

### Frontend Aggregation Interface
**Prompt:** "Create aggregation interface:
- Dimension selection checkboxes
- Metric selection checkboxes
- Generate aggregation button
- Results display in table format"

### Aggregation State Management
**Prompt:** "Implement aggregation state management:
- Custom hooks for aggregation logic
- State management for selected dimensions/metrics
- API integration for aggregation requests"

---

## Filtering System

### Backend Filtering
**Prompt:** "Implement filtering system:
- Country filter dropdown
- Campaign filter dropdown
- Platform filter dropdown
- Browser filter dropdown
- Date range filtering"

### Filter API Endpoints
**Prompt:** "Create filter-related endpoints:
- GET endpoints for available filter values
- Filtered aggregation endpoints
- Proper query parameter handling"

### Frontend Filter Components
**Prompt:** "Create filter components:
- Dropdown components for each filter type
- Date picker for date range
- Filter state management
- Apply filters functionality"

### Filter Integration
**Prompt:** "Integrate filters with data display:
- Apply filters to both raw data and aggregations
- Reset filters functionality
- Filter persistence in URL or state"

---

## Pagination & Sorting

### Backend Pagination
**Prompt:** "Implement pagination:
- Page-based pagination for large datasets
- Configurable page size
- Total count and page information
- Efficient LIMIT/OFFSET queries"

### Backend Sorting
**Prompt:** "Implement sorting:
- Sort by any metric or dimension
- Ascending/descending sort direction
- Multiple sort criteria support
- Optimized ORDER BY clauses"

### Pagination API
**Prompt:** "Create paginated endpoints:
- Paginated raw data endpoint
- Paginated aggregation endpoint
- Page metadata in response
- Proper pagination parameters"

### Frontend Pagination Components
**Prompt:** "Create pagination components:
- Pagination component with page numbers
- Page size selector
- Navigation buttons (first, previous, next, last)
- Page information display"

### Frontend Sorting
**Prompt:** "Implement frontend sorting:
- Sortable column headers
- Sort direction indicators
- Sort state management
- Integration with pagination"

---

## Export Functionality

### CSV Export
**Prompt:** "Implement CSV export:
- Export aggregated data as CSV
- Proper CSV formatting
- File download functionality
- Include all selected dimensions and metrics"

### JSON Export
**Prompt:** "Implement JSON export:
- Export aggregated data as JSON
- Proper JSON formatting
- File download functionality
- Include metadata in export"

### Export API Endpoints
**Prompt:** "Create export endpoints:
- POST endpoint for CSV export
- POST endpoint for JSON export
- Proper content-type headers
- File streaming for large datasets"

### Frontend Export Interface
**Prompt:** "Create export interface:
- Export buttons for CSV and JSON
- Export progress indicators
- File download handling
- Error handling for export failures"

---

## UI/UX Improvements

### Modern UI Design
**Prompt:** "Improve UI design:
- Modern, clean interface
- Consistent color scheme
- Proper spacing and typography
- Mobile-responsive design"

### User Experience Enhancements
**Prompt:** "Enhance user experience:
- Loading states for all operations
- Error handling with user-friendly messages
- Success notifications
- Smooth transitions and animations"

### Component Library
**Prompt:** "Create reusable component library:
- Button component with variants
- Card component for content sections
- Error alert component
- Loading spinner component"

### Responsive Design
**Prompt:** "Implement responsive design:
- Mobile-first approach
- Tablet and desktop layouts
- Proper breakpoints
- Touch-friendly interface"

---

## Testing Implementation

### Backend Testing
**Prompt:** "Implement comprehensive backend testing:
- Unit tests for services and controllers
- Integration tests for API endpoints
- Test data setup and teardown
- Mock dependencies where appropriate"

### Frontend Testing
**Prompt:** "Implement frontend testing:
- Component tests with React Testing Library
- Hook tests for custom hooks
- Utility function tests
- Mock API responses"

### Test Configuration
**Prompt:** "Set up testing infrastructure:
- Vitest configuration for frontend
- JUnit 5 configuration for backend
- Test coverage reporting
- CI/CD integration for tests"

### Test Data Management
**Prompt:** "Create test data management:
- Mock data for testing
- Test database setup
- Test user accounts
- Isolated test environments"

---

## Documentation & CI/CD

### Technical Documentation
**Prompt:** "Create comprehensive documentation:
- Design document with architecture details
- API documentation
- Database schema documentation
- Deployment instructions"

### README Documentation
**Prompt:** "Create project README:
- Project overview and features
- Installation and setup instructions
- Usage examples
- Technology stack information"

### Code Documentation
**Prompt:** "Add code documentation:
- JavaDoc comments for backend code
- TypeScript comments for frontend code
- Inline comments for complex logic
- Architecture decision records"

### GitHub Actions
**Prompt:** "Set up CI/CD pipeline:
- Automated testing on pull requests
- Build and deployment automation
- Code quality checks
- Security scanning"

---

## Additional Features

### Performance Optimization
**Prompt:** "Optimize application performance:
- Database query optimization
- Frontend bundle optimization
- Caching strategies
- Lazy loading implementation"

### Security Enhancements
**Prompt:** "Enhance security:
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Security headers"

### Error Handling
**Prompt:** "Implement comprehensive error handling:
- Global error boundaries
- API error handling
- User-friendly error messages
- Error logging and monitoring"

### Accessibility
**Prompt:** "Implement accessibility features:
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Color contrast compliance"

---

## Development Methodology

### Iterative Development
The project was developed using an iterative approach, with each phase building upon the previous one:

1. **Foundation**: Set up basic project structure and infrastructure
2. **Core Features**: Implement essential functionality (data display, authentication)
3. **Advanced Features**: Add complex features (aggregation, filtering, pagination)
4. **Enhancement**: Improve UI/UX and add export functionality
5. **Quality Assurance**: Implement testing and documentation
6. **Polish**: Final improvements and optimizations

### AI-Assisted Development
Each prompt was designed to:
- Build upon existing functionality
- Maintain consistency with the overall architecture
- Follow best practices for the chosen technologies
- Ensure proper integration between components

### Key Principles
- **Modularity**: Each component was designed to be reusable and maintainable
- **Type Safety**: Strong typing throughout the application
- **Security**: Proper authentication and authorization at every layer
- **Performance**: Optimized for analytical workloads with ClickHouse
- **User Experience**: Intuitive interface with proper feedback and error handling

---

## Conclusion

This document serves as a comprehensive record of the development process, showcasing how AI-assisted development can be used to build complex, full-stack applications. Each prompt was carefully crafted to build upon previous work while maintaining architectural consistency and following best practices.

The resulting application demonstrates modern web development practices, including:
- Microservices architecture with containerization
- Modern frontend frameworks with TypeScript
- Enterprise-grade backend with Spring Boot
- Columnar database optimized for analytics
- Comprehensive testing and documentation
- Security-first design with proper authentication

This approach can serve as a template for future AI-assisted development projects, demonstrating how to break down complex requirements into manageable, iterative development phases.
