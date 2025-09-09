import { API_URL } from './constants'

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Ensure Content-Type is always application/json for POST requests
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    
    // Add any additional headers
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers.set(key, value)
        }
      })
    }
    
    console.log('Request to:', `${API_URL}${endpoint}`)
    console.log('Headers:', Object.fromEntries(headers.entries()))
    console.log('Body:', options.body)
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method,
      headers: headers,
      body: options.body,
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return response.json()
  },

  async requestWithAuth<T>(endpoint: string, token: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })
  },

  async downloadFile(endpoint: string, token: string, filename: string, options: RequestInit = {}): Promise<void> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}
