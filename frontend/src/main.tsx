import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Context and Hooks
import { AppProvider, useAppContext } from './context/AppContext'
import { useAuth } from './hooks/useAuth'
import { useAdMetrics } from './hooks/useAdMetrics'
import { useAggregatedData } from './hooks/useAggregatedData'
import { useFilters } from './hooks/useFilters'

// Components
import { AuthForm } from './components/auth/AuthForm'
import { DashboardHeader } from './components/dashboard/DashboardHeader'
import { Filters } from './components/dashboard/Filters'
import { DataAggregation } from './components/dashboard/DataAggregation'
import { RawDataTable } from './components/dashboard/RawDataTable'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { ErrorAlert } from './components/ui/ErrorAlert'
import { Pagination } from './components/ui/Pagination'

// Types
import { AuthMode } from './types'

const AppContent: React.FC = () => {
  // Context
  const {
    mode,
    email,
    password,
    filters,
    aggregationState,
    showRawData,
    setMode,
    setEmail,
    setPassword,
    updateFilters,
    toggleDimension,
    toggleMetric,
    updateAggregationState,
    setShowRawData,
    resetAuthForm
  } = useAppContext()

  // Hooks
  const auth = useAuth()
  const adMetrics = useAdMetrics(auth.token)
  const aggregatedData = useAggregatedData(auth.token)
  const filtersData = useFilters()

  // Event handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (mode === 'login') {
        await auth.login(email, password)
      } else {
        await auth.register(email, password)
      }
      resetAuthForm()
    } catch (e) {
      // Error is handled by the auth hook
    }
  }

  const handleLogout = () => {
    auth.logout()
    adMetrics.setError(undefined)
    aggregatedData.setError(undefined)
    filtersData.setError(undefined)
  }

  const handleGenerateAggregation = () => {
    aggregatedData.updateAggPagination({ currentPage: 0 })
    aggregatedData.fetchPaginatedAggregatedData(aggregationState, filters)
    updateAggregationState({
      selectedMetrics: aggregationState.clickedMetrics,
      groupByDimensions: aggregationState.clickedDimensions
    })
  }

  const handleExportCsv = () => {
    aggregatedData.exportToCsv(aggregationState, filters)
  }

  const handleExportJson = () => {
    aggregatedData.exportToJson(aggregationState, filters)
  }

  // Effects
  React.useEffect(() => {
    if (auth.token) {
      adMetrics.fetchPaginatedAdMetrics()
      filtersData.fetchAllFilters(auth.token)
      auth.checkAdminStatus()
    }
  }, [auth.token])

  React.useEffect(() => {
    if (aggregatedData.aggPagination.totalElements > 0) {
      aggregatedData.fetchPaginatedAggregatedData(aggregationState, filters)
    }
  }, [
    aggregatedData.aggPagination.currentPage, 
    aggregatedData.aggPagination.pageSize, 
    aggregatedData.sortState.sortBy, 
    aggregatedData.sortState.sortDirection
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Taboola Ad Metrics Dashboard</h1>
          <p className="text-gray-600">Comprehensive analytics and reporting platform</p>
        </div>

        {!auth.token ? (
          <AuthForm
            mode={mode}
            email={email}
            password={password}
            loading={auth.loading}
            error={auth.error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onModeChange={setMode}
            onSubmit={handleAuthSubmit}
            onErrorDismiss={() => auth.setError(undefined)}
          />
        ) : (
          <div className="space-y-8">
            <DashboardHeader
              onRefresh={adMetrics.fetchAdMetrics}
              onLogout={handleLogout}
              loading={auth.loading || adMetrics.loading || aggregatedData.loading}
            />

            {/* Loading and Error States */}
            {(auth.loading || adMetrics.loading || aggregatedData.loading) && (
              <LoadingSpinner text="Loading data..." />
            )}
            
            {(auth.error || adMetrics.error || aggregatedData.error || filtersData.error) && (
              <ErrorAlert 
                error={auth.error || adMetrics.error || aggregatedData.error || filtersData.error || ''} 
              />
            )}
            
            <Filters
              filters={filters}
              availableCountries={filtersData.availableCountries}
              availableCampaigns={filtersData.availableCampaigns}
              availablePlatforms={filtersData.availablePlatforms}
              availableBrowsers={filtersData.availableBrowsers}
              onFilterChange={updateFilters}
            />

            <DataAggregation
              aggregationState={aggregationState}
              filters={filters}
              aggregatedData={aggregatedData.aggregatedData}
              sortState={aggregatedData.sortState}
              loading={aggregatedData.loading}
              onDimensionToggle={toggleDimension}
              onMetricToggle={toggleMetric}
              onGenerateAggregation={handleGenerateAggregation}
              onExportCsv={handleExportCsv}
              onExportJson={handleExportJson}
              onSort={aggregatedData.handleSort}
            />

            {/* Aggregation Pagination */}
            {aggregatedData.aggregatedData.length > 0 && (
              <Pagination
                currentPage={aggregatedData.aggPagination.currentPage}
                totalPages={aggregatedData.aggPagination.totalPages}
                onPageChange={(page) => aggregatedData.updateAggPagination({ currentPage: page })}
                pageSize={aggregatedData.aggPagination.pageSize}
                totalElements={aggregatedData.aggPagination.totalElements}
                onPageSizeChange={(size) => aggregatedData.updateAggPagination({ pageSize: size, currentPage: 0 })}
              />
            )}

            {/* Raw Data Section - Admin Only */}
            {auth.isAdmin && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900">Raw Data</h3>
                    <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">Admin Only</span>
                  </div>
                  <button
                    onClick={() => setShowRawData(!showRawData)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showRawData ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                    {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
                  </button>
                </div>
              
                {showRawData && (
                  <RawDataTable
                    adMetrics={adMetrics.adMetrics}
                    pagination={adMetrics.pagination}
                    onPageChange={(page) => adMetrics.updatePagination({ currentPage: page })}
                    onPageSizeChange={(size) => adMetrics.updatePagination({ pageSize: size, currentPage: 0 })}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
