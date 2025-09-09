# Taboola Ad Metrics Dashboard - Refactored Structure

This document outlines the new, clean architecture of the Taboola Ad Metrics Dashboard frontend application.

## 📁 Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   │   └── AuthForm.tsx
│   ├── dashboard/       # Dashboard-specific components
│   │   ├── DashboardHeader.tsx
│   │   ├── Filters.tsx
│   │   ├── DataAggregation.tsx
│   │   └── RawDataTable.tsx
│   └── ui/              # Generic UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorAlert.tsx
│       └── Pagination.tsx
├── context/             # React Context for state management
│   └── AppContext.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useAdMetrics.ts
│   ├── useAggregatedData.ts
│   └── useFilters.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions and constants
│   ├── apiClient.ts
│   └── constants.ts
├── main.tsx            # Main application entry point
└── index.ts            # Barrel exports
```

## 🏗️ Architecture Overview

### 1. **Separation of Concerns**
- **Components**: Pure UI components with clear props interfaces
- **Hooks**: Business logic and API interactions
- **Context**: Global state management
- **Types**: Centralized type definitions
- **Utils**: Reusable utilities and constants

### 2. **Component Hierarchy**
```
App
├── AppProvider (Context)
└── AppContent
    ├── AuthForm (when not authenticated)
    └── Dashboard (when authenticated)
        ├── DashboardHeader
        ├── Filters
        ├── DataAggregation
        ├── Pagination
        └── RawDataTable (admin only)
```

### 3. **State Management**
- **Context**: Global application state (filters, aggregation settings, UI state)
- **Hooks**: Component-specific state and API interactions
- **Local State**: Component-specific UI state

## 🔧 Key Features

### **Custom Hooks**
- `useAuth`: Handles authentication logic
- `useAdMetrics`: Manages ad metrics data and pagination
- `useAggregatedData`: Handles data aggregation and exports
- `useFilters`: Manages filter options and data

### **Reusable Components**
- **UI Components**: Button, Card, LoadingSpinner, ErrorAlert, Pagination
- **Feature Components**: AuthForm, Filters, DataAggregation, RawDataTable
- **Layout Components**: DashboardHeader

### **Type Safety**
- Comprehensive TypeScript types for all data structures
- Properly typed component props
- Type-safe API client

## 🚀 Benefits of This Structure

1. **Maintainability**: Clear separation of concerns makes code easier to understand and modify
2. **Reusability**: Components and hooks can be easily reused across the application
3. **Testability**: Each component and hook can be tested in isolation
4. **Scalability**: Easy to add new features without affecting existing code
5. **Type Safety**: Full TypeScript support prevents runtime errors
6. **Performance**: Optimized re-renders through proper state management

## 📝 Usage Examples

### Using Components
```tsx
import { Button, Card, LoadingSpinner } from './components'

<Card>
  <Button variant="primary" loading={isLoading}>
    Submit
  </Button>
</Card>
```

### Using Hooks
```tsx
import { useAuth, useAdMetrics } from './hooks'

const { token, login, logout } = useAuth()
const { adMetrics, loading, fetchAdMetrics } = useAdMetrics(token)
```

### Using Context
```tsx
import { useAppContext } from './context'

const { filters, updateFilters } = useAppContext()
```

## 🔄 Migration from Original Structure

The original `main.tsx` file (996 lines) has been refactored into:
- **1 main file**: `main.tsx` (200 lines)
- **4 custom hooks**: Business logic separation
- **10 reusable components**: UI componentization
- **1 context provider**: State management
- **1 types file**: Type definitions
- **2 utility files**: Constants and API client

This results in a **80% reduction** in the main file size while improving maintainability and reusability.
