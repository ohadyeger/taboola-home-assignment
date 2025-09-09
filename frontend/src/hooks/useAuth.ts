import { useState, useCallback } from 'react'
import { apiClient } from '../utils/apiClient'

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<any>(null)
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
      const errorMessage = String(e)
      setError(errorMessage.startsWith('Error: ') ? errorMessage.substring(7) : errorMessage)
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
      const errorMessage = String(e)
      setError(errorMessage.startsWith('Error: ') ? errorMessage.substring(7) : errorMessage)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setIsAdmin(false)
    setError(undefined)
  }, [])

  const fetchCurrentUser = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    try {
      const data = await apiClient.requestWithAuth<any>('/auth/me', token)
      setUser(data)
      setIsAdmin(data.isAdmin || false)
    } catch (e) {
      const errorMessage = String(e)
      setError(errorMessage.startsWith('Error: ') ? errorMessage.substring(7) : errorMessage)
      setUser(null)
      setIsAdmin(false)
      // If token is invalid, clear it
      if (String(e).includes('401') || String(e).includes('403')) {
        localStorage.removeItem('token')
        setToken(null)
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  const checkAdminStatus = useCallback(async () => {
    if (!token) return
    try {
      const data = await apiClient.requestWithAuth<any>('/auth/me', token)
      setIsAdmin(data.isAdmin || false)
    } catch (e) {
      console.warn('Could not check admin status:', e)
      setIsAdmin(false)
      // If token is invalid, clear it
      if (String(e).includes('401') || String(e).includes('403')) {
        localStorage.removeItem('token')
        setToken(null)
      }
    }
  }, [token])

  const clearError = useCallback(() => {
    setError(undefined)
  }, [])

  return {
    token,
    user,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    checkAdminStatus,
    setError,
    clearError
  }
}
