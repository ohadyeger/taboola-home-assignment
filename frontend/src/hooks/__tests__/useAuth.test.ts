import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '../useAuth'
import { apiClient } from '../../utils/apiClient'

// Mock the apiClient
vi.mock('../../utils/apiClient', () => ({
  apiClient: {
    request: vi.fn(),
    requestWithAuth: vi.fn()
  }
}))

describe('useAuth', () => {
  const mockToken = 'test-token'
  const mockUser = {
    email: 'test@example.com',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    isAdmin: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: vi.fn(),
        getItem: vi.fn(() => mockToken),
        setItem: vi.fn()
      },
      writable: true
    })
  })

  it('should initialize with token from localStorage', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.token).toBe(mockToken)
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('should initialize without token when localStorage is empty', () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null)
      },
      writable: true
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.token).toBeNull()
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('should login successfully', async () => {
    const mockResponse = { token: mockToken }
    vi.mocked(apiClient.request).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(result.current.token).toBe(mockToken)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockToken)
    expect(apiClient.request).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('should register successfully', async () => {
    const mockResponse = { token: mockToken }
    vi.mocked(apiClient.request).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.register('test@example.com', 'password123')
    })

    expect(result.current.token).toBe(mockToken)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', mockToken)
    expect(apiClient.request).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials'
    vi.mocked(apiClient.request).mockRejectedValue(new Error(errorMessage))

    // Clear localStorage for this test
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: vi.fn(),
        getItem: vi.fn(() => null),
        setItem: vi.fn()
      },
      writable: true
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      try {
        await result.current.login('test@example.com', 'wrongpassword')
      } catch (e) {
        // Expected to throw
      }
    })

    expect(result.current.token).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
    expect(window.localStorage.setItem).not.toHaveBeenCalled()
  })

  it('should handle register error', async () => {
    const errorMessage = 'Email already registered'
    vi.mocked(apiClient.request).mockRejectedValue(new Error(errorMessage))

    // Clear localStorage for this test
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: vi.fn(),
        getItem: vi.fn(() => null),
        setItem: vi.fn()
      },
      writable: true
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      try {
        await result.current.register('existing@example.com', 'password123')
      } catch (e) {
        // Expected to throw
      }
    })

    expect(result.current.token).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
    expect(window.localStorage.setItem).not.toHaveBeenCalled()
  })

  it('should fetch current user successfully', async () => {
    vi.mocked(apiClient.requestWithAuth).mockResolvedValue(mockUser)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.fetchCurrentUser()
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(apiClient.requestWithAuth).toHaveBeenCalledWith('/auth/me', mockToken)
  })

  it('should handle fetch current user error', async () => {
    const errorMessage = 'Unauthorized'
    vi.mocked(apiClient.requestWithAuth).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.fetchCurrentUser()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  it('should logout successfully', () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.logout()
    })

    expect(result.current.token).toBeNull()
    expect(result.current.user).toBeNull()
    expect(result.current.error).toBeUndefined()
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token')
  })

  it('should clear error', () => {
    const { result } = renderHook(() => useAuth())

    // Set an error first
    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).toBe('Test error')

    // Clear the error
    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeUndefined()
  })

  it('should set loading state during async operations', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    vi.mocked(apiClient.request).mockReturnValue(promise)

    const { result } = renderHook(() => useAuth())

    // Start login
    act(() => {
      result.current.login('test@example.com', 'password123')
    })

    expect(result.current.loading).toBe(true)

    // Resolve the promise
    await act(async () => {
      resolvePromise({ token: mockToken })
      await promise
    })

    expect(result.current.loading).toBe(false)
  })
})
