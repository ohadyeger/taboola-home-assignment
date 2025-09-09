import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

type AggregatedMetrics = {
  dimensions: Record<string, any>;
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  recordCount: number;
}

type AdMetrics = { 
  day: string; week: string; month: string; accountId: string; campaign: string; 
  country: string; platform: string; browser: string; 
  spent: number; impressions: number; clicks: number 
}

type PaginatedResponse<T> = {
  data: T[]
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

const apiUrl: string = (import.meta as any).env.VITE_API_URL || 'http://localhost:8081'

const App: React.FC = () => {
  const [token, setToken] = React.useState<string | null>(() => localStorage.getItem('token'))
  const [mode, setMode] = React.useState<'login' | 'register'>('login')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [adMetrics, setAdMetrics] = React.useState<AdMetrics[]>([])
  const [aggregatedData, setAggregatedData] = React.useState<AggregatedMetrics[]>([])
  const [groupByDimensions, setGroupByDimensions] = React.useState<string[]>([])
  const [clickedDimensions, setClickedDimensions] = React.useState<string[]>([])
  const [clickedMetrics, setClickedMetrics] = React.useState<string[]>([])
  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>([])
  const [availableCountries, setAvailableCountries] = React.useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = React.useState<string>('All')
  const [availableCampaigns, setAvailableCampaigns] = React.useState<string[]>([])
  const [selectedCampaign, setSelectedCampaign] = React.useState<string>('All')
  const [availablePlatforms, setAvailablePlatforms] = React.useState<string[]>([])
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>('All')
  const [availableBrowsers, setAvailableBrowsers] = React.useState<string[]>([])
  const [selectedBrowser, setSelectedBrowser] = React.useState<string>('All')
  const [startDate, setStartDate] = React.useState<string>('')
  const [endDate, setEndDate] = React.useState<string>('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>()
  
  // Admin and UI state
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [showRawData, setShowRawData] = React.useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)
  const [totalPages, setTotalPages] = React.useState(0)
  const [totalElements, setTotalElements] = React.useState(0)
  const [paginatedData, setPaginatedData] = React.useState<PaginatedResponse<AdMetrics> | null>(null)
  
  // Aggregation pagination state
  const [aggCurrentPage, setAggCurrentPage] = React.useState(0)
  const [aggPageSize, setAggPageSize] = React.useState(10)
  const [aggTotalPages, setAggTotalPages] = React.useState(0)
  const [aggTotalElements, setAggTotalElements] = React.useState(0)
  const [aggPaginatedData, setAggPaginatedData] = React.useState<PaginatedResponse<AggregatedMetrics> | null>(null)
  
  // Sorting state
  const [sortBy, setSortBy] = React.useState<string>('')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const fetchAdMetrics = React.useCallback(() => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    fetch(`${apiUrl}/api/ads/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: AdMetrics[]) => setAdMetrics(data))
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [token])

  const fetchPaginatedAdMetrics = React.useCallback(() => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    fetch(`${apiUrl}/api/ads/my/paginated?page=${currentPage}&size=${pageSize}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: PaginatedResponse<AdMetrics>) => {
        setPaginatedData(data)
        setAdMetrics(data.data)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [token, currentPage, pageSize])

  const fetchAvailableCountries = React.useCallback(() => {
    if (!token) return
    fetch(`${apiUrl}/api/ads/countries`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: string[]) => setAvailableCountries(data))
      .catch(e => setError(String(e)))
  }, [token])

  const fetchAvailableCampaigns = React.useCallback(() => {
    if (!token) return
    fetch(`${apiUrl}/api/ads/campaigns`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: string[]) => setAvailableCampaigns(data))
      .catch(e => setError(String(e)))
  }, [token])

  const fetchAvailablePlatforms = React.useCallback(() => {
    if (!token) return
    fetch(`${apiUrl}/api/ads/platforms`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: string[]) => setAvailablePlatforms(data))
      .catch(e => setError(String(e)))
  }, [token])

  const fetchAvailableBrowsers = React.useCallback(() => {
    if (!token) return
    fetch(`${apiUrl}/api/ads/browsers`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: string[]) => setAvailableBrowsers(data))
      .catch(e => setError(String(e)))
  }, [token])

  const checkAdminStatus = React.useCallback(() => {
    if (!token) return
    fetch(`${apiUrl}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: any) => setIsAdmin(data.isAdmin || false))
      .catch(e => {
        console.warn('Could not check admin status:', e)
        setIsAdmin(false)
      })
  }, [token])

  const fetchAggregatedData = React.useCallback(() => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    fetch(`${apiUrl}/api/aggregate`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groupBy: clickedDimensions,
        metrics: clickedMetrics,
        countryFilter: selectedCountry,
        campaignFilter: selectedCampaign,
        platformFilter: selectedPlatform,
        browserFilter: selectedBrowser
      })
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: any) => setAggregatedData(data.data))
      .catch(e => setError(String(e)))
      .finally(() => {
        setSelectedMetrics(clickedMetrics)
        setGroupByDimensions(clickedDimensions)
        setLoading(false)
      })
  }, [token, clickedDimensions, clickedMetrics, selectedCountry, selectedCampaign, selectedPlatform, selectedBrowser])

  const fetchPaginatedAggregatedData = React.useCallback(() => {
    if (!token) return
    setLoading(true)
    setError(undefined)
    fetch(`${apiUrl}/api/aggregate/paginated`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groupBy: clickedDimensions,
        metrics: clickedMetrics,
        countryFilter: selectedCountry,
        campaignFilter: selectedCampaign,
        platformFilter: selectedPlatform,
        browserFilter: selectedBrowser,
        startDate: startDate,
        endDate: endDate,
        page: aggCurrentPage,
        size: aggPageSize,
        sortBy: sortBy,
        sortDirection: sortDirection
      })
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: any) => {
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
        setAggTotalPages(data.totalPages)
        setAggTotalElements(data.totalElements)
      })
      .catch(e => setError(String(e)))
      .finally(() => {
        setSelectedMetrics(clickedMetrics)
        setGroupByDimensions(clickedDimensions)
        setLoading(false)
      })
  }, [token, clickedDimensions, clickedMetrics, selectedCountry, selectedCampaign, selectedPlatform, selectedBrowser, startDate, endDate, aggCurrentPage, aggPageSize, sortBy, sortDirection])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field with ascending direction
      setSortBy(field)
      setSortDirection('asc')
    }
    setAggCurrentPage(0) // Reset to first page when sorting
  }

  const exportToCsv = async () => {
    if (!token || clickedMetrics.length === 0) return
    
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/api/aggregate/export/csv`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          groupBy: clickedDimensions,
          metrics: clickedMetrics,
          countryFilter: selectedCountry,
          campaignFilter: selectedCampaign,
          platformFilter: selectedPlatform,
          browserFilter: selectedBrowser,
          startDate: startDate,
          endDate: endDate,
          sortBy: sortBy,
          sortDirection: sortDirection
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aggregated_data_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const exportToJson = async () => {
    if (!token || clickedMetrics.length === 0) return
    
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/api/aggregate/export/json`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          groupBy: clickedDimensions,
          metrics: clickedMetrics,
          countryFilter: selectedCountry,
          campaignFilter: selectedCampaign,
          platformFilter: selectedPlatform,
          browserFilter: selectedBrowser,
          startDate: startDate,
          endDate: endDate,
          sortBy: sortBy,
          sortDirection: sortDirection
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aggregated_data_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { fetchPaginatedAdMetrics() }, [fetchPaginatedAdMetrics])
  React.useEffect(() => { fetchAvailableCountries() }, [fetchAvailableCountries])
  React.useEffect(() => { fetchAvailableCampaigns() }, [fetchAvailableCampaigns])
  React.useEffect(() => { fetchAvailablePlatforms() }, [fetchAvailablePlatforms])
  React.useEffect(() => { fetchAvailableBrowsers() }, [fetchAvailableBrowsers])
  React.useEffect(() => { checkAdminStatus() }, [checkAdminStatus])
  
  // Auto-fetch aggregated data when pagination or sorting changes
  React.useEffect(() => {
    if (aggTotalElements > 0) { // Only fetch if we have data
      fetchPaginatedAggregatedData()
    }
  }, [aggCurrentPage, aggPageSize, sortBy, sortDirection])

  const submitAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const t = json.token as string
      localStorage.setItem('token', t)
      setToken(t)
      setEmail('')
      setPassword('')
    } catch (e: any) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setAdMetrics([])
    setAggregatedData([])
    setIsAdmin(false)
    setShowRawData(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Taboola Ad Metrics Dashboard</h1>
          <p className="text-gray-600">Comprehensive analytics and reporting platform</p>
        </div>

        {!token ? (
          <div className="max-w-md mx-auto">
            <div className="card">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'login' ? 'Sign in to access your dashboard' : 'Get started with your analytics'}
                </p>
              </div>
              
              <form onSubmit={submitAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    type="email" 
                    required 
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    type="password" 
                    required 
                    className="input-field"
                    placeholder="Enter your password"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Please wait…
                    </div>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary w-full" 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                  {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign In'}
                </button>
              </form>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">Error: {error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Ad Metrics Dashboard</h2>
                <p className="text-gray-600 mt-1">Monitor and analyze your advertising performance</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={fetchAdMetrics} 
                  disabled={loading} 
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <button onClick={logout} className="btn-secondary flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg text-gray-600">Loading data...</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">Error: {error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Filters Section */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select 
                    value={selectedCountry} 
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="select-field w-full"
                  >
                    <option value="All">All Countries</option>
                    {availableCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign</label>
                  <select 
                    value={selectedCampaign} 
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="select-field w-full"
                  >
                    <option value="All">All Campaigns</option>
                    {availableCampaigns.map(campaign => (
                      <option key={campaign} value={campaign}>{campaign}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <select 
                    value={selectedPlatform} 
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="select-field w-full"
                  >
                    <option value="All">All Platforms</option>
                    {availablePlatforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Browser</label>
                  <select 
                    value={selectedBrowser} 
                    onChange={(e) => setSelectedBrowser(e.target.value)}
                    className="select-field w-full"
                  >
                    <option value="All">All Browsers</option>
                    {availableBrowsers.map(browser => (
                      <option key={browser} value={browser}>{browser}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="input-field text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Leave empty for last week</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Aggregation Section */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Data Aggregation</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Group By Dimensions</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {['day', 'week', 'month', 'campaign', 'country', 'platform', 'browser'].map(dim => (
                      <label key={dim} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={clickedDimensions.includes(dim)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setClickedDimensions([...clickedDimensions, dim])
                            } else {
                              setClickedDimensions(clickedDimensions.filter(d => d !== dim))
                            }
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">{dim}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Metrics to Aggregate</label>
                  <div className="flex gap-4">
                    {['spent', 'impressions', 'clicks'].map(metric => (
                      <label key={metric} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={clickedMetrics.includes(metric)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setClickedMetrics([...clickedMetrics, metric])
                            } else {
                              setClickedMetrics(clickedMetrics.filter(m => m !== metric))
                            }
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => {
                      setAggCurrentPage(0) // Reset to first page when generating new aggregation
                      fetchPaginatedAggregatedData()
                    }} 
                    disabled={loading || clickedMetrics.length === 0}
                    className="btn-primary flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Generate Aggregation
                  </button>
                  
                  {aggregatedData.length > 0 && (
                    <>
                      <button 
                        onClick={exportToCsv}
                        disabled={loading || clickedMetrics.length === 0}
                        className="btn-success flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export CSV
                      </button>
                      
                      <button 
                        onClick={exportToJson}
                        disabled={loading || clickedMetrics.length === 0}
                        className="btn-info flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Export JSON
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {aggregatedData.length > 0 ? (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900">Aggregated Results</h4>
                  </div>
                  
                  <div className="table-container">
                    <table className="w-full">
                      <thead>
                        <tr className="table-header">
                          {groupByDimensions.map(dim => (
                            <th key={dim} className="table-cell text-left font-semibold capitalize">
                              {dim}
                            </th>
                          ))}
                          {selectedMetrics.includes('spent') && (
                            <th 
                              className="table-cell text-right font-semibold cursor-pointer hover:bg-gray-100 transition-colors" 
                              onClick={() => handleSort('spent')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Total Spent
                                {sortBy === 'spent' && (
                                  <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )}
                              </div>
                            </th>
                          )}
                          {selectedMetrics.includes('impressions') && (
                            <th 
                              className="table-cell text-right font-semibold cursor-pointer hover:bg-gray-100 transition-colors" 
                              onClick={() => handleSort('impressions')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Total Impressions
                                {sortBy === 'impressions' && (
                                  <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )}
                              </div>
                            </th>
                          )}
                          {selectedMetrics.includes('clicks') && (
                            <th 
                              className="table-cell text-right font-semibold cursor-pointer hover:bg-gray-100 transition-colors" 
                              onClick={() => handleSort('clicks')}
                            >
                              <div className="flex items-center justify-end gap-1">
                                Total Clicks
                                {sortBy === 'clicks' && (
                                  <svg className={`w-4 h-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )}
                              </div>
                            </th>
                          )}
                          <th className="table-cell text-right font-semibold">Records</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aggregatedData.map((row, i) => (
                          <tr key={i} className="table-row">
                            {groupByDimensions.map(dim => (
                              <td key={dim} className="table-cell">
                                {row.dimensions[dim] || '-'}
                              </td>
                            ))}
                            {selectedMetrics.includes('spent') && (
                              <td className="table-cell text-right font-mono">
                                ${row.totalSpent.toFixed(2)}
                              </td>
                            )}
                            {selectedMetrics.includes('impressions') && (
                              <td className="table-cell text-right font-mono">
                                {row.totalImpressions.toLocaleString()}
                              </td>
                            )}
                            {selectedMetrics.includes('clicks') && (
                              <td className="table-cell text-right font-mono">
                                {row.totalClicks.toLocaleString()}
                              </td>
                            )}
                            <td className="table-cell text-right font-mono">
                              {row.recordCount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Aggregation Pagination Controls */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Page size:</label>
                        <select 
                          value={aggPageSize} 
                          onChange={(e) => {
                            setAggPageSize(Number(e.target.value))
                            setAggCurrentPage(0) // Reset to first page when changing page size
                          }}
                          className="select-field text-sm"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                      <span className="text-sm text-gray-600">
                        Total: <span className="font-semibold">{aggTotalElements}</span> aggregated records
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setAggCurrentPage(0)}
                        disabled={aggCurrentPage === 0}
                        className={`pagination-btn ${aggCurrentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        First
                      </button>
                      <button 
                        onClick={() => setAggCurrentPage(aggCurrentPage - 1)}
                        disabled={aggCurrentPage === 0}
                        className={`pagination-btn ${aggCurrentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Previous
                      </button>
                      
                      <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded">
                        Page {aggCurrentPage + 1} of {aggTotalPages}
                      </span>
                      
                      <button 
                        onClick={() => setAggCurrentPage(aggCurrentPage + 1)}
                        disabled={aggCurrentPage >= aggTotalPages - 1}
                        className={`pagination-btn ${aggCurrentPage >= aggTotalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Next
                      </button>
                      <button 
                        onClick={() => setAggCurrentPage(aggTotalPages - 1)}
                        disabled={aggCurrentPage >= aggTotalPages - 1}
                        className={`pagination-btn ${aggCurrentPage >= aggTotalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Last
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Raw Data Section - Admin Only */}
            {isAdmin && (
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
                <>
                  <div className="table-container">
                <table className="w-full">
                  <thead>
                    <tr className="table-header">
                      <th className="table-cell text-left font-semibold">Day</th>
                      <th className="table-cell text-left font-semibold">Campaign</th>
                      <th className="table-cell text-left font-semibold">Country</th>
                      <th className="table-cell text-left font-semibold">Platform</th>
                      <th className="table-cell text-left font-semibold">Browser</th>
                      <th className="table-cell text-right font-semibold">Spent</th>
                      <th className="table-cell text-right font-semibold">Impressions</th>
                      <th className="table-cell text-right font-semibold">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adMetrics.map((ad, i) => (
                      <tr key={i} className="table-row">
                        <td className="table-cell">{ad.day}</td>
                        <td className="table-cell">{ad.campaign}</td>
                        <td className="table-cell">{ad.country}</td>
                        <td className="table-cell">{ad.platform}</td>
                        <td className="table-cell">{ad.browser}</td>
                        <td className="table-cell text-right font-mono">${ad.spent.toFixed(2)}</td>
                        <td className="table-cell text-right font-mono">{ad.impressions.toLocaleString()}</td>
                        <td className="table-cell text-right font-mono">{ad.clicks.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Page size:</label>
                    <select 
                      value={pageSize} 
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                        setCurrentPage(0) // Reset to first page when changing page size
                      }}
                      className="select-field text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <span className="text-sm text-gray-600">
                    Total: <span className="font-semibold">{totalElements}</span> records
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(0)}
                    disabled={currentPage === 0}
                    className={`pagination-btn ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    First
                  </button>
                  <button 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={`pagination-btn ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Previous
                  </button>
                  
                  <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className={`pagination-btn ${currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Next
                  </button>
                  <button 
                    onClick={() => setCurrentPage(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className={`pagination-btn ${currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Last
                  </button>
                </div>
              </div>
                </>
              )}
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)


