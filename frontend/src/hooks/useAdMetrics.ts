import { useState, useCallback } from 'react'
import { apiClient } from '../utils/apiClient'
import { AdMetrics, PaginatedResponse, FilterState, PaginationState } from '../types'

export const useAdMetrics = (token: string | null) => {
  const [adMetrics, setAdMetrics] = useState<AdMetrics[]>([])
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<AdMetrics> | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const fetchAdMetrics = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    try {
      const data = await apiClient.requestWithAuth<AdMetrics[]>('/api/ads/my', token)
      setAdMetrics(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchPaginatedAdMetrics = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    try {
      const data = await apiClient.requestWithAuth<PaginatedResponse<AdMetrics>>(
        `/api/ads/my/paginated?page=${pagination.currentPage}&size=${pagination.pageSize}`,
        token
      )
      setPaginatedData(data)
      setAdMetrics(data.data)
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      }))
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [token, pagination.currentPage, pagination.pageSize])

  const updatePagination = useCallback((updates: Partial<PaginationState>) => {
    setPagination(prev => ({ ...prev, ...updates }))
  }, [])

  return {
    adMetrics,
    paginatedData,
    pagination,
    loading,
    error,
    fetchAdMetrics,
    fetchPaginatedAdMetrics,
    updatePagination,
    setError
  }
}
