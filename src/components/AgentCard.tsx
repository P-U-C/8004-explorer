import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTokenURI, getOwnerOf } from '../lib/contract'
import { decodeTokenURI, shortenAddress, type AgentMetadata } from '../lib/decode'

interface Props {
  tokenId: bigint
}

export default function AgentCard({ tokenId }: Props) {
  const [meta, setMeta] = useState<AgentMetadata | null>(null)
  const [owner, setOwner] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [uri, ownerAddr] = await Promise.all([
          getTokenURI(tokenId),
          getOwnerOf(tokenId),
        ])
        if (cancelled) return
        const decoded = decodeTokenURI(uri)
        setMeta(decoded)
        setOwner(ownerAddr)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [tokenId])

  if (loading) {
    return (
      <div className="border border-border rounded-xl p-5 bg-surface-raised animate-pulse h-48" />
    )
  }

  if (error || !meta) {
    return (
      <div className="border border-border rounded-xl p-5 bg-surface-raised opacity-50">
        <p className="font-mono text-sm text-muted">#{tokenId.toString()} — unavailable</p>
      </div>
    )
  }

  return (
    <Link
      to={`/${tokenId.toString()}`}
      className="group border border-border hover:border-accent/40 rounded-xl p-5 bg-surface-raised
        hover:bg-surface-overlay transition-all block"
    >
      <div className="flex items-start gap-4">
        {meta.image && (
          <img
            src={meta.image}
            alt={meta.name}
            className="w-12 h-12 rounded-lg object-cover bg-surface shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate group-hover:text-accent transition-colors">
              {meta.name}
            </h3>
            {meta.active !== false && (
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" title="Active" />
            )}
          </div>
          <p className="text-sm text-muted line-clamp-2 mb-3">{meta.description}</p>
          <div className="flex items-center gap-3 text-xs font-mono text-muted">
            <span className="text-accent/70">#{tokenId.toString()}</span>
            {owner && <span>{shortenAddress(owner)}</span>}
            {meta.services && (
              <span>{meta.services.length} service{meta.services.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
