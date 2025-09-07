import React from 'react'
import { createRoot } from 'react-dom/client'

const App: React.FC = () => {
  const [items, setItems] = React.useState<{id:number; name:string; createdAt:string}[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string|undefined>()

  React.useEffect(() => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080'
    fetch(`${apiUrl}/api/items`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setItems)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{fontFamily:'sans-serif', padding:24}}>
      <h1>Items</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>Error: {error}</p>}
      <ul>
        {items.map(i => (
          <li key={i.id}>{i.id}. {i.name} <small>({i.createdAt})</small></li>
        ))}
      </ul>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)


