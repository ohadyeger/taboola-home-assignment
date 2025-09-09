import React from 'react'
import { createRoot } from 'react-dom/client'

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
  const [showAggregation, setShowAggregation] = React.useState(true)
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

  React.useEffect(() => { fetchPaginatedAdMetrics() }, [fetchPaginatedAdMetrics])
  React.useEffect(() => { fetchAvailableCountries() }, [fetchAvailableCountries])
  React.useEffect(() => { fetchAvailableCampaigns() }, [fetchAvailableCampaigns])
  React.useEffect(() => { fetchAvailablePlatforms() }, [fetchAvailablePlatforms])
  React.useEffect(() => { fetchAvailableBrowsers() }, [fetchAvailableBrowsers])
  
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
    setShowAggregation(false)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 720 }}>
      <h1>Demo App</h1>
      {!token ? (
        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, maxWidth: 420 }}>
          <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
          <form onSubmit={submitAuth}>
            <div style={{ marginBottom: 8 }}>
              <label>Email<br />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: 8 }} />
              </label>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Password<br />
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: 8 }} />
              </label>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
              {loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Register')}
            </button>
            <button type="button" style={{ marginLeft: 8 }} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Ad Metrics</h2>
            <div>
              <button onClick={fetchAdMetrics} disabled={loading} style={{ marginRight: 8 }}>Refresh</button>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
          {loading && <p>Loading…</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          
          <div style={{ marginBottom: 32 }}>
            <h3>Filters</h3>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Country:</label>
                <select 
                  value={selectedCountry} 
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  style={{ padding: 8, fontSize: '14px', minWidth: 120 }}
                >
                  <option value="All">All</option>
                  {availableCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Campaign:</label>
                <select 
                  value={selectedCampaign} 
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  style={{ padding: 8, fontSize: '14px', minWidth: 120 }}
                >
                  <option value="All">All</option>
                  {availableCampaigns.map(campaign => (
                    <option key={campaign} value={campaign}>{campaign}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Platform:</label>
                <select 
                  value={selectedPlatform} 
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  style={{ padding: 8, fontSize: '14px', minWidth: 120 }}
                >
                  <option value="All">All</option>
                  {availablePlatforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Browser:</label>
                <select 
                  value={selectedBrowser} 
                  onChange={(e) => setSelectedBrowser(e.target.value)}
                  style={{ padding: 8, fontSize: '14px', minWidth: 120 }}
                >
                  <option value="All">All</option>
                  {availableBrowsers.map(browser => (
                    <option key={browser} value={browser}>{browser}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>Date Range:</label>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>Start Date:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4, fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: '14px' }}>End Date:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4, fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 20 }}>
                    (Leave empty for last week)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3>Data Aggregation</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Group By Dimensions:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['day', 'week', 'month', 'campaign', 'country', 'platform', 'browser'].map(dim => (
                  <label key={dim} style={{ display: 'flex', alignItems: 'center' }}>
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
                      style={{ marginRight: 4 }}
                    />
                    {dim}
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Metrics to Aggregate:</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['spent', 'impressions', 'clicks'].map(metric => (
                  <label key={metric} style={{ display: 'flex', alignItems: 'center' }}>
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
                      style={{ marginRight: 4 }}
                    />
                    {metric}
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => {
                setAggCurrentPage(0) // Reset to first page when generating new aggregation
                fetchPaginatedAggregatedData()
              }} 
              disabled={loading || clickedMetrics.length === 0}
            >
              Generate Aggregation
            </button>
            
            {aggregatedData.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4>Aggregated Results:</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        {groupByDimensions.map(dim => (
                          <th key={dim} style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>
                            {dim}
                          </th>
                        ))}
                        {selectedMetrics.includes('spent') && (
                          <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('spent')}>
                            Total Spent {sortBy === 'spent' && (sortDirection === 'asc' ? '↑' : '↓')}
                          </th>
                        )}
                        {selectedMetrics.includes('impressions') && (
                          <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('impressions')}>
                            Total Impressions {sortBy === 'impressions' && (sortDirection === 'asc' ? '↑' : '↓')}
                          </th>
                        )}
                        {selectedMetrics.includes('clicks') && (
                          <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('clicks')}>
                            Total Clicks {sortBy === 'clicks' && (sortDirection === 'asc' ? '↑' : '↓')}
                          </th>
                        )}
                        <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>Records</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aggregatedData.map((row, i) => (
                        <tr key={i}>
                          {groupByDimensions.map(dim => (
                            <td key={dim} style={{ border: '1px solid #ddd', padding: 8 }}>
                              {row.dimensions[dim] || '-'}
                            </td>
                          ))}
                          {selectedMetrics.includes('spent') && (
                            <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>
                              ${row.totalSpent.toFixed(2)}
                            </td>
                          )}
                          {selectedMetrics.includes('impressions') && (
                            <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>
                              {row.totalImpressions.toLocaleString()}
                            </td>
                          )}
                          {selectedMetrics.includes('clicks') && (
                            <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>
                              {row.totalClicks.toLocaleString()}
                            </td>
                          )}
                          <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>
                            {row.recordCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Aggregation Pagination Controls */}
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span>Page size:</span>
                    <select 
                      value={aggPageSize} 
                      onChange={(e) => {
                        setAggPageSize(Number(e.target.value))
                        setAggCurrentPage(0) // Reset to first page when changing page size
                      }}
                      style={{ padding: 4, fontSize: '14px' }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>Total: {aggTotalElements} aggregated records</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button 
                      onClick={() => setAggCurrentPage(0)}
                      disabled={aggCurrentPage === 0}
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '14px',
                        backgroundColor: aggCurrentPage === 0 ? '#f5f5f5' : '#007bff',
                        color: aggCurrentPage === 0 ? '#999' : 'white',
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: aggCurrentPage === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      First
                    </button>
                    <button 
                      onClick={() => setAggCurrentPage(aggCurrentPage - 1)}
                      disabled={aggCurrentPage === 0}
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '14px',
                        backgroundColor: aggCurrentPage === 0 ? '#f5f5f5' : '#007bff',
                        color: aggCurrentPage === 0 ? '#999' : 'white',
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: aggCurrentPage === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Previous
                    </button>
                    
                    <span style={{ padding: '4px 8px', fontSize: '14px' }}>
                      Page {aggCurrentPage + 1} of {aggTotalPages}
                    </span>
                    
                    <button 
                      onClick={() => setAggCurrentPage(aggCurrentPage + 1)}
                      disabled={aggCurrentPage >= aggTotalPages - 1}
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '14px',
                        backgroundColor: aggCurrentPage >= aggTotalPages - 1 ? '#f5f5f5' : '#007bff',
                        color: aggCurrentPage >= aggTotalPages - 1 ? '#999' : 'white',
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: aggCurrentPage >= aggTotalPages - 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Next
                    </button>
                    <button 
                      onClick={() => setAggCurrentPage(aggTotalPages - 1)}
                      disabled={aggCurrentPage >= aggTotalPages - 1}
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '14px',
                        backgroundColor: aggCurrentPage >= aggTotalPages - 1 ? '#f5f5f5' : '#007bff',
                        color: aggCurrentPage >= aggTotalPages - 1 ? '#999' : 'white',
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: aggCurrentPage >= aggTotalPages - 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <h3>Raw Data</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Day</th>
                  <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Campaign</th>
                  <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Country</th>
                  <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Platform</th>
                  <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left' }}>Browser</th>
                  <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>Spent</th>
                  <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>Impressions</th>
                  <th style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>Clicks</th>
                </tr>
              </thead>
              <tbody>
                {adMetrics.map((ad, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{ad.day}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{ad.campaign}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{ad.country}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{ad.platform}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{ad.browser}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>${ad.spent.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>{ad.impressions.toLocaleString()}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8, textAlign: 'right' }}>{ad.clicks.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span>Page size:</span>
              <select 
                value={pageSize} 
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(0) // Reset to first page when changing page size
                }}
                style={{ padding: 4, fontSize: '14px' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>Total: {totalElements} records</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button 
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '14px',
                  backgroundColor: currentPage === 0 ? '#f5f5f5' : '#007bff',
                  color: currentPage === 0 ? '#999' : 'white',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                First
              </button>
              <button 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '14px',
                  backgroundColor: currentPage === 0 ? '#f5f5f5' : '#007bff',
                  color: currentPage === 0 ? '#999' : 'white',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              
              <span style={{ padding: '4px 8px', fontSize: '14px' }}>
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '14px',
                  backgroundColor: currentPage >= totalPages - 1 ? '#f5f5f5' : '#007bff',
                  color: currentPage >= totalPages - 1 ? '#999' : 'white',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage >= totalPages - 1}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '14px',
                  backgroundColor: currentPage >= totalPages - 1 ? '#f5f5f5' : '#007bff',
                  color: currentPage >= totalPages - 1 ? '#999' : 'white',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)


