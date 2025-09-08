import React from 'react'
import { createRoot } from 'react-dom/client'

type AdMetrics = { 
  day: string; week: string; month: string; account: string; campaign: string; 
  country: string; platform: string; browser: string; 
  spent: number; impressions: number; clicks: number 
}

const apiUrl: string = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080'

const App: React.FC = () => {
  const [token, setToken] = React.useState<string | null>(() => localStorage.getItem('token'))
  const [mode, setMode] = React.useState<'login' | 'register'>('login')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [adMetrics, setAdMetrics] = React.useState<AdMetrics[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>()

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

  React.useEffect(() => { fetchAdMetrics() }, [fetchAdMetrics])

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
          <div style={{ overflowX: 'auto' }}>
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
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)


