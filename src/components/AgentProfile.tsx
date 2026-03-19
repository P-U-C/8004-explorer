import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTokenURI, getOwnerOf, REGISTRY_ADDRESS } from '../lib/contract'
import {
  decodeTokenURI,
  fetchLiveStatus,
  shortenAddress,
  type AgentMetadata,
} from '../lib/decode'

export default function AgentProfile() {
  const { tokenId: tokenIdStr } = useParams<{ tokenId: string }>()
  const tokenId = BigInt(tokenIdStr || '0')

  const [meta, setMeta] = useState<AgentMetadata | null>(null)
  const [owner, setOwner] = useState<string | null>(null)
  const [rawUri, setRawUri] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, boolean | null>>({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const [uri, ownerAddr] = await Promise.all([
          getTokenURI(tokenId),
          getOwnerOf(tokenId),
        ])
        if (cancelled) return
        setRawUri(uri)
        const decoded = decodeTokenURI(uri)
        setMeta(decoded)
        setOwner(ownerAddr)

        // Fetch live statuses for services
        if (decoded.services?.length) {
          for (const svc of decoded.services) {
            fetchLiveStatus(svc.endpoint).then((result) => {
              if (!cancelled) {
                setServiceStatuses((prev) => ({
                  ...prev,
                  [svc.endpoint]: result.online,
                }))
              }
            })
          }
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Token not found or no data'
          setError(msg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [tokenIdStr])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-surface-raised rounded animate-pulse" />
        <div className="h-64 bg-surface-raised rounded-xl animate-pulse" />
      </div>
    )
  }

  if (error || !meta) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-muted hover:text-accent font-mono mb-6 inline-block">
          ← Back
        </Link>
        <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-8 text-center">
          <p className="font-mono text-red-400 text-lg mb-2">Agent #{tokenIdStr} not found</p>
          <p className="text-sm text-muted">{error || 'This token may not exist or has no metadata.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="text-sm text-muted hover:text-accent font-mono mb-6 inline-block">
        ← Back
      </Link>

      {/* Hero */}
      <div className="border border-border rounded-xl bg-surface-raised overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-accent/80 via-accent to-accent/40" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5 mb-6">
            {meta.image && (
              <img
                src={meta.image}
                alt={meta.name}
                className="w-20 h-20 rounded-xl object-cover bg-surface border border-border shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{meta.name}</h1>
                {meta.active !== false && (
                  <span className="px-2 py-0.5 text-xs font-mono bg-accent/10 text-accent border border-accent/20 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-muted text-sm font-mono">Token #{tokenIdStr}</p>
            </div>
          </div>

          {meta.description && (
            <p className="text-gray-300 leading-relaxed mb-6">{meta.description}</p>
          )}

          {/* On-chain info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <InfoRow
              label="Owner"
              value={owner ? shortenAddress(owner) : '—'}
              href={owner ? `https://basescan.org/address/${owner}` : undefined}
              mono
            />
            <InfoRow
              label="Registry"
              value={shortenAddress(REGISTRY_ADDRESS)}
              href={`https://basescan.org/address/${REGISTRY_ADDRESS}`}
              mono
            />
            {meta.type && <InfoRow label="Type" value={meta.type} />}
            {meta.supportedTrust?.length && (
              <InfoRow label="Trust" value={meta.supportedTrust.join(', ')} />
            )}
          </div>

          {/* Services */}
          {meta.services && meta.services.length > 0 && (
            <div>
              <h2 className="text-sm font-mono text-muted uppercase tracking-wider mb-3">
                Services ({meta.services.length})
              </h2>
              <div className="space-y-2">
                {meta.services.map((svc, i) => {
                  const status = serviceStatuses[svc.endpoint]
                  return (
                    <div
                      key={i}
                      className="border border-border rounded-lg p-4 bg-surface hover:bg-surface-overlay transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{svc.name}</span>
                          {svc.version && (
                            <span className="text-xs font-mono text-muted">v{svc.version}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {status === true && (
                            <span className="w-2 h-2 rounded-full bg-accent" title="Online" />
                          )}
                          {status === false && (
                            <span className="w-2 h-2 rounded-full bg-red-400" title="Offline / CORS blocked" />
                          )}
                          {status === null && (
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" title="Checking…" />
                          )}
                        </div>
                      </div>
                      <a
                        href={svc.endpoint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-accent/70 hover:text-accent break-all transition-colors"
                      >
                        {svc.endpoint} ↗
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Registrations */}
          {meta.registrations && meta.registrations.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-mono text-muted uppercase tracking-wider mb-3">
                Registrations
              </h2>
              <div className="space-y-2">
                {meta.registrations.map((reg, i) => (
                  <div key={i} className="text-sm font-mono text-gray-400">
                    <span className="text-accent">ID {reg.agentId}</span>
                    <span className="mx-2 text-muted">@</span>
                    <span className="text-muted break-all">{reg.agentRegistry}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw metadata toggle */}
          <details className="mt-6">
            <summary className="text-xs font-mono text-muted cursor-pointer hover:text-accent transition-colors">
              View raw metadata
            </summary>
            <pre className="mt-3 p-4 bg-black rounded-lg border border-border text-xs font-mono text-gray-400 overflow-auto max-h-64">
              {JSON.stringify(meta, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  label,
  value,
  href,
  mono,
}: {
  label: string
  value: string
  href?: string
  mono?: boolean
}) {
  const valClass = `text-sm ${mono ? 'font-mono' : ''} text-white`
  return (
    <div className="bg-surface rounded-lg px-4 py-3 border border-border">
      <p className="text-xs text-muted mb-0.5">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${valClass} hover:text-accent transition-colors`}
        >
          {value} ↗
        </a>
      ) : (
        <p className={valClass}>{value}</p>
      )}
    </div>
  )
}
