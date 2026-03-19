import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed && /^\d+$/.test(trimmed)) {
      navigate(`/${trimmed}`)
      setQuery('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter token ID…"
        className="w-full bg-surface-raised border border-border rounded-lg px-4 py-2 text-sm font-mono
          text-white placeholder:text-muted focus:outline-none focus:border-accent/50 focus:ring-1
          focus:ring-accent/20 transition-all"
      />
    </form>
  )
}
