import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAdMetrics } from '../useAdMetrics'
import { apiClient } from '../../utils/apiClient'

// Mock the apiClient
vi.mock('../../utils/apiClient', () => ({
  apiClient: {
    requestWithAuth: vi.fn()
  }
}))

describe('useAdMetrics', () => {
  const mockToken = 'test-token'
  const mockAdMetrics = [
    {
      day: '2023-01-01',
      week: '2023-W01',
      month: '2023-01',
      accountId: '123e4567-e89b-12d3-a456-426614174000',
      campaign: 'Campaign1',
      country: 'US',
      platform: 'Desktop',
      browser: 'Chrome',
      spent: 100.50,
      impressions: 1000,
      clicks: 50
    }
  ]

  const mockPaginatedResponse = {
    data: mockAdMetrics,
    page: 0,
    totalPages: 1,
    totalElements: 1,
    size: 10
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: vi.fn(),
        getItem: vi.fn(),
        setItem: vi.fn()
      },
      writable: true
    })
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: {
        reload: vi.fn()
      },
      writable: true
    })
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAdMetrics(mockToken))

    expect(result.current.adMetrics).toEqual([])
    expect(result.current.paginatedData).toBeNull()
    expect(result.current.pagination).toEqual({
      currentPage: 0,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0
    })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('should fetch ad metrics successfully', async () => {
    vi.mocked(apiClient.requestWithAuth).mockResolvedValue(mockAdMetrics)

    const { result } = renderHook(() => useAdMetrics(mockToken))

    await act(async () => {
      await result.current.fetchAdMetrics()
    })

    expect(result.current.adMetrics).toEqual(mockAdMetrics)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(apiClient.requestWithAuth).toHaveBeenCalledWith('/api/ads/my', mockToken)
  })

  it('should handle fetch ad metrics error', async () => {
    const errorMessage = 'Network error'
    vi.mocked(apiClient.requestWithAuth).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useAdMetrics(mockToken))

    await act(async () => {
      await result.current.fetchAdMetrics()
    })

    expect(result.current.adMetrics).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  it('should not fetch ad metrics when token is null', async () => {
    const { result } = renderHook(() => useAdMetrics(null))

    await act(async () => {
      await result.current.fetchAdMetrics()
    })

    expect(result.current.adMetrics).toEqual([])
    expect(apiClient.requestWithAuth).not.toHaveBeenCalled()
  })

  it('should fetch paginated ad metrics successfully', async () => {
    vi.mocked(apiClient.requestWithAuth).mockResolvedValue(mockPaginatedResponse)

    const { result } = renderHook(() => useAdMetrics(mockToken))

    await act(async () => {
      await result.current.fetchPaginatedAdMetrics()
    })

    expect(result.current.paginatedData).toEqual(mockPaginatedResponse)
    expect(result.current.adMetrics).toEqual(mockAdMetrics)
    expect(result.current.pagination).toEqual({
      currentPage: 0,
      pageSize: 10,
      totalPages: 1,
      totalElements: 1
    })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(apiClient.requestWithAuth).toHaveBeenCalledWith(
      '/api/ads/my/paginated?page=0&size=10',
      mockToken
    )
  })

  it('should handle paginated fetch error and clear token on 401/403', async () => {
    const error = new Error('HTTP 401: Unauthorized')
    vi.mocked(apiClient.requestWithAuth).mockRejectedValue(error)

    const { result } = renderHook(() => useAdMetrics(mockToken))

    await act(async () => {
      await result.current.fetchPaginatedAdMetrics()
    })

    expect(result.current.paginatedData).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('HTTP 401: Unauthorized')
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token')
    expect(window.location.reload).toHaveBeenCalled()
  })

  it('should update pagination correctly', () => {
    const { result } = renderHook(() => useAdMetrics(mockToken))

    act(() => {
      result.current.updatePagination({
        currentPage: 2,
        pageSize: 20
      })
    })

    expect(result.current.pagination).toEqual({
      currentPage: 2,
      pageSize: 20,
      totalPages: 0,
      totalElements: 0
    })
  })

  it('should set error correctly', () => {
    const { result } = renderHook(() => useAdMetrics(mockToken))

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).toBe('Test error')
  })

  it('should clear error when fetching', async () => {
    const { result } = renderHook(() => useAdMetrics(mockToken))

    // Set an error first
    act(() => {
      result.current.setError('Previous error')
    })

    expect(result.current.error).toBe('Previous error')

    // Mock successful fetch
    vi.mocked(apiClient.requestWithAuth).mockResolvedValue(mockAdMetrics)

    await act(async () => {
      await result.current.fetchAdMetrics()
    })

    expect(result.current.error).toBeUndefined()
  })

  it('should not fetch paginated metrics when token is null', async () => {
    const { result } = renderHook(() => useAdMetrics(null))

    await act(async () => {
      await result.current.fetchPaginatedAdMetrics()
    })

    expect(result.current.paginatedData).toBeNull()
    expect(apiClient.requestWithAuth).not.toHaveBeenCalled()
  })
})
