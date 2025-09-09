import { useState, useCallback } from 'react'
import { apiClient } from '../utils/apiClient'
import { AggregatedMetrics, PaginatedResponse, FilterState, AggregationState, PaginationState, SortState } from '../types'

export const useAggregatedData = (token: string | null) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedMetrics[]>([])
  const [aggPaginatedData, setAggPaginatedData] = useState<PaginatedResponse<AggregatedMetrics> | null>(null)
  const [aggPagination, setAggPagination] = useState<PaginationState>({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0
  })
  const [sortState, setSortState] = useState<SortState>({
    sortBy: '',
    sortDirection: 'asc'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const fetchAggregatedData = useCallback(async (
    aggregationState: AggregationState,
    filters: FilterState
  ) => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    try {
      const data = await apiClient.requestWithAuth<any>('/api/aggregate', token, {
        method: 'POST',
        body: JSON.stringify({
          groupBy: aggregationState.clickedDimensions,
          metrics: aggregationState.clickedMetrics,
          countryFilter: filters.selectedCountry,
          campaignFilter: filters.selectedCampaign,
          platformFilter: filters.selectedPlatform,
          browserFilter: filters.selectedBrowser
        })
      })
      setAggregatedData(data.data)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchPaginatedAggregatedData = useCallback(async (
    aggregationState: AggregationState,
    filters: FilterState
  ) => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    try {
      const data = await apiClient.requestWithAuth<any>('/api/aggregate/paginated', token, {
        method: 'POST',
        body: JSON.stringify({
          groupBy: aggregationState.clickedDimensions,
          metrics: aggregationState.clickedMetrics,
          countryFilter: filters.selectedCountry,
          campaignFilter: filters.selectedCampaign,
          platformFilter: filters.selectedPlatform,
          browserFilter: filters.selectedBrowser,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: aggPagination.currentPage,
          size: aggPagination.pageSize,
          sortBy: sortState.sortBy,
          sortDirection: sortState.sortDirection
        })
      })
      
      setAggPaginatedData({
        data: data.data,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        pageSize: data.pageSize,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious
      })
      setAggregatedData(data.data)
      setAggPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      }))
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [token, aggPagination.currentPage, aggPagination.pageSize, sortState.sortBy, sortState.sortDirection])

  const handleSort = useCallback((field: string) => {
    if (sortState.sortBy === field) {
      setSortState(prev => ({
        ...prev,
        sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
      }))
    } else {
      setSortState({
        sortBy: field,
        sortDirection: 'asc'
      })
    }
    setAggPagination(prev => ({ ...prev, currentPage: 0 }))
  }, [sortState.sortBy, sortState.sortDirection])

  const exportToCsv = useCallback(async (
    aggregationState: AggregationState,
    filters: FilterState
  ) => {
    if (!token || aggregationState.clickedMetrics.length === 0) return
    
    try {
      setLoading(true)
      const filename = `aggregated_data_${new Date().toISOString().split('T')[0]}.csv`
      await apiClient.downloadFile('/api/aggregate/export/csv', token, filename, {
        method: 'POST',
        body: JSON.stringify({
          groupBy: aggregationState.clickedDimensions,
          metrics: aggregationState.clickedMetrics,
          countryFilter: filters.selectedCountry,
          campaignFilter: filters.selectedCampaign,
          platformFilter: filters.selectedPlatform,
          browserFilter: filters.selectedBrowser,
          startDate: filters.startDate,
          endDate: filters.endDate,
          sortBy: sortState.sortBy,
          sortDirection: sortState.sortDirection
        })
      })
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [token, sortState.sortBy, sortState.sortDirection])

  const exportToJson = useCallback(async (
    aggregationState: AggregationState,
    filters: FilterState
  ) => {
    if (!token || aggregationState.clickedMetrics.length === 0) return
    
    try {
      setLoading(true)
      const filename = `aggregated_data_${new Date().toISOString().split('T')[0]}.json`
      await apiClient.downloadFile('/api/aggregate/export/json', token, filename, {
        method: 'POST',
        body: JSON.stringify({
          groupBy: aggregationState.clickedDimensions,
          metrics: aggregationState.clickedMetrics,
          countryFilter: filters.selectedCountry,
          campaignFilter: filters.selectedCampaign,
          platformFilter: filters.selectedPlatform,
          browserFilter: filters.selectedBrowser,
          startDate: filters.startDate,
          endDate: filters.endDate,
          sortBy: sortState.sortBy,
          sortDirection: sortState.sortDirection
        })
      })
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [token, sortState.sortBy, sortState.sortDirection])

  const updateAggPagination = useCallback((updates: Partial<PaginationState>) => {
    setAggPagination(prev => ({ ...prev, ...updates }))
  }, [])

  return {
    aggregatedData,
    aggPaginatedData,
    aggPagination,
    sortState,
    loading,
    error,
    fetchAggregatedData,
    fetchPaginatedAggregatedData,
    handleSort,
    exportToCsv,
    exportToJson,
    updateAggPagination,
    setError
  }
}
