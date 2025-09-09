import { useState, useCallback } from 'react'
import { apiClient } from '../utils/apiClient'
import { AdMetrics, PaginatedResponse, AggregatedMetrics, FilterState, AggregationState, PaginationState, SortState } from '../types'

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(undefined)
    try {
      const response = await apiClient.request<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      localStorage.setItem('token', response.token)
      setToken(response.token)
      return response.token
    } catch (e) {
      setError(String(e))
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(undefined)
    try {
      const response = await apiClient.request<{ token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      localStorage.setItem('token', response.token)
      setToken(response.token)
      return response.token
    } catch (e) {
      setError(String(e))
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setIsAdmin(false)
  }, [])

  const checkAdminStatus = useCallback(async () => {
    if (!token) return
    try {
      const data = await apiClient.requestWithAuth<any>('/auth/me', token)
      setIsAdmin(data.isAdmin || false)
    } catch (e) {
      console.warn('Could not check admin status:', e)
      setIsAdmin(false)
    }
  }, [token])

  return {
    token,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    checkAdminStatus,
    setError
  }
}
