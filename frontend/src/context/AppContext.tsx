import React, { createContext, useContext, useState, useCallback } from 'react'
import { AuthMode, FilterState, AggregationState } from '../types'
import { DEFAULT_FILTER_VALUES } from '../utils/constants'

interface AppState {
  // Auth state
  mode: AuthMode
  email: string
  password: string
  
  // Filter state
  filters: FilterState
  
  // Aggregation state
  aggregationState: AggregationState
  
  // UI state
  showRawData: boolean
}

interface AppContextType extends AppState {
  // Auth actions
  setMode: (mode: AuthMode) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  
  // Filter actions
  updateFilters: (filters: Partial<FilterState>) => void
  
  // Aggregation actions
  toggleDimension: (dimension: string) => void
  toggleMetric: (metric: string) => void
  updateAggregationState: (state: Partial<AggregationState>) => void
  
  // UI actions
  setShowRawData: (show: boolean) => void
  
  // Reset actions
  resetAuthForm: () => void
  resetFilters: () => void
  resetAggregation: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialState: AppState = {
  mode: 'login',
  email: '',
  password: '',
  filters: DEFAULT_FILTER_VALUES,
  aggregationState: {
    clickedDimensions: [],
    clickedMetrics: [],
    selectedMetrics: [],
    groupByDimensions: []
  },
  showRawData: false
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState)

  const setMode = useCallback((mode: AuthMode) => {
    setState(prev => ({ ...prev, mode }))
  }, [])

  const setEmail = useCallback((email: string) => {
    setState(prev => ({ ...prev, email }))
  }, [])

  const setPassword = useCallback((password: string) => {
    setState(prev => ({ ...prev, password }))
  }, [])

  const updateFilters = useCallback((filters: Partial<FilterState>) => {
    setState(prev => ({ 
      ...prev, 
      filters: { ...prev.filters, ...filters } 
    }))
  }, [])

  const toggleDimension = useCallback((dimension: string) => {
    setState(prev => {
      const clickedDimensions = prev.aggregationState.clickedDimensions.includes(dimension)
        ? prev.aggregationState.clickedDimensions.filter(d => d !== dimension)
        : [...prev.aggregationState.clickedDimensions, dimension]
      
      return {
        ...prev,
        aggregationState: {
          ...prev.aggregationState,
          clickedDimensions
        }
      }
    })
  }, [])

  const toggleMetric = useCallback((metric: string) => {
    setState(prev => {
      const clickedMetrics = prev.aggregationState.clickedMetrics.includes(metric)
        ? prev.aggregationState.clickedMetrics.filter(m => m !== metric)
        : [...prev.aggregationState.clickedMetrics, metric]
      
      return {
        ...prev,
        aggregationState: {
          ...prev.aggregationState,
          clickedMetrics
        }
      }
    })
  }, [])

  const updateAggregationState = useCallback((aggregationState: Partial<AggregationState>) => {
    setState(prev => ({
      ...prev,
      aggregationState: { ...prev.aggregationState, ...aggregationState }
    }))
  }, [])

  const setShowRawData = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showRawData: show }))
  }, [])

  const resetAuthForm = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      email: '', 
      password: '' 
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      filters: DEFAULT_FILTER_VALUES 
    }))
  }, [])

  const resetAggregation = useCallback(() => {
    setState(prev => ({
      ...prev,
      aggregationState: {
        clickedDimensions: [],
        clickedMetrics: [],
        selectedMetrics: [],
        groupByDimensions: []
      }
    }))
  }, [])

  const value: AppContextType = {
    ...state,
    setMode,
    setEmail,
    setPassword,
    updateFilters,
    toggleDimension,
    toggleMetric,
    updateAggregationState,
    setShowRawData,
    resetAuthForm,
    resetFilters,
    resetAggregation
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
