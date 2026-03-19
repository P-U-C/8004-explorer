import { useEffect, useState } from 'react'
import { FEATURED_TOKEN_ID, getRecentRegistrations } from '../lib/contract'
import AgentCard from './AgentCard'

export default function HomePage() {
  const [recentIds, setRecentIds] = useState<bigint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecentRegistrations(20)
      .then((ids) => {
        // Ensure featured is included
        const hasF = ids.some((id) => id === FEATURED_TOKEN_ID)
        if (!hasF) ids = [FEATURED_TOKEN_ID, ...ids]
        setRecentIds(ids)
      })
      .catch(() => {
        setRecentIds([FEATURED_TOKEN_ID])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Agent Registry <span className="text-accent">Explorer</span>
        </h1>
        <p className="text-muted max-w-xl">
          Browse and inspect agents registered on the{' '}
          <a
            href="https://eips.ethereum.org/EIPS/eip-8004"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/70 hover:text-accent transition-colors"
          >
            ERC-8004
          </a>{' '}
          registry on Base. Enter a token ID above or browse recent registrations below.
        </p>
      </div>

      {/* Featured */}
      <div className="mb-8">
        <h2 className="text-sm font-mono text-muted uppercase tracking-wider mb-3">
          ★ Featured Agent
        </h2>
        <AgentCard tokenId={FEATURED_TOKEN_ID} />
      </div>

      {/* Recent */}
      <div>
        <h2 className="text-sm font-mono text-muted uppercase tracking-wider mb-3">
          Recent Registrations
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-surface-raised rounded-xl animate-pulse border border-border" />
            ))}
          </div>
        ) : recentIds.length === 0 ? (
          <p className="text-muted text-sm">No recent registrations found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentIds
              .filter((id) => id !== FEATURED_TOKEN_ID)
              .map((id) => (
                <AgentCard key={id.toString()} tokenId={id} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
