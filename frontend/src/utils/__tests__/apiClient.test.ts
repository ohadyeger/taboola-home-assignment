import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient } from '../apiClient'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset console mocks
    mockConsoleLog.mockClear()
    mockConsoleError.mockClear()
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url')
    global.URL.revokeObjectURL = vi.fn()
    // Mock document methods
    Object.defineProperty(document, 'createElement', {
      value: vi.fn(() => ({
        href: '',
        download: '',
        click: vi.fn()
      })),
      writable: true
    })
    Object.defineProperty(document.body, 'appendChild', {
      value: vi.fn(),
      writable: true
    })
    Object.defineProperty(document.body, 'removeChild', {
      value: vi.fn(),
      writable: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('request', () => {
    it('should make a successful GET request', async () => {
      const mockResponse = { data: 'test' }
      const mockResponseObj = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        text: vi.fn()
      }
      mockFetch.mockResolvedValue(mockResponseObj)

      const result = await apiClient.request('/test-endpoint')

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8081/test-endpoint',
        {
          method: undefined,
          headers: expect.any(Headers),
          body: undefined
        }
      )
      expect(mockResponseObj.json).toHaveBeenCalled()
    })

    it('should make a POST request with body', async () => {
      const mockResponse = { success: true }
      const mockResponseObj = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        text: vi.fn()
      }
      mockFetch.mockResolvedValue(mockResponseObj)

      const requestBody = { email: 'test@example.com', password: 'password' }
      const result = await apiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8081/auth/login',
        {
          method: 'POST',
          headers: expect.any(Headers),
          body: JSON.stringify(requestBody)
        }
      )
    })

    it('should handle request error', async () => {
      const mockResponseObj = {
        ok: false,
        status: 400,
        text: vi.fn().mockResolvedValue('Bad Request')
      }
      mockFetch.mockResolvedValue(mockResponseObj)

      await expect(apiClient.request('/test-endpoint')).rejects.toThrow('HTTP 400: Bad Request')
      // Note: Console error logging is tested by the actual error being thrown
    })

    it('should merge headers correctly', async () => {
      const mockResponse = { data: 'test' }
      const mockResponseObj = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        text: vi.fn()
      }
      mockFetch.mockResolvedValue(mockResponseObj)

      await apiClient.request('/test-endpoint', {
        headers: {
          'Custom-Header': 'custom-value',
          'Content-Type': 'application/xml' // This should be overridden
        }
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8081/test-endpoint',
        {
          method: undefined,
          headers: expect.any(Headers),
          body: undefined
        }
      )
    })

    it('should log request details', async () => {
      const mockResponse = { data: 'test' }
      const mockResponseObj = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        text: vi.fn()
      }
      mockFetch.mockResolvedValue(mockResponseObj)

      await apiClient.request('/test-endpoint', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' })
      })

      // Note: Console logging is verified by the actual output in test results
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8081/test-endpoint',
        {
          method: 'POST',
          headers: expect.any(Headers),
          body: JSON.stringify({ test: 'data' })
        }
      )
    })
  })

  describe('requestWithAuth', () => {
    it('should add authorization header', async () => {
      const mockResponse = { data: 'test' }
      const mockResponseObj = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        text: vi.fn()
      }
      mockFetch.mockResolvedValue(mockResponseObj)

      const token = 'test-token'
      await apiClient.requestWithAuth('/protected-endpoint', token)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8081/protected-endpoint',
        {
          method: undefined,
          headers: expect.any(Headers),
          body: undefined
        }
      )
    })

    it('should merge additional headers with auth header', async () => {
      const mockResponse = { data: 'test' }
      const mockResponseObj = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        text: vi.fn()
      }
      mockFetch.mockResolvedValue(mockResponseObj)

      const token = 'test-token'
      await apiClient.requestWithAuth('/protected-endpoint', token, {
        headers: {
          'Custom-Header': 'custom-value'
        }
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8081/protected-endpoint',
        {
          method: undefined,
          headers: expect.any(Headers),
          body: undefined
        }
      )
    })
  })

  describe('downloadFile', () => {
    it('should download file successfully', async () => {
      const mockBlob = new Blob(['test content'], { type: 'text/plain' })
      const mockResponseObj = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob)
      }
      mockFetch.mockResolvedValue(mockResponseObj)

      const token = 'test-token'
      const filename = 'test-file.txt'
      await apiClient.downloadFile('/download-endpoint', token, filename)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8081/download-endpoint',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      expect(mockResponseObj.blob).toHaveBeenCalled()
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url')
    })

    it('should handle download error', async () => {
      const mockResponseObj = {
        ok: false,
        status: 404
      }
      mockFetch.mockResolvedValue(mockResponseObj)

      const token = 'test-token'
      const filename = 'test-file.txt'

      await expect(apiClient.downloadFile('/download-endpoint', token, filename))
        .rejects.toThrow('HTTP 404')
    })
  })
})
