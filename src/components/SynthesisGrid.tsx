import { useEffect, useState } from 'react'

interface SynthesisAgent {
  name: string
  slug: string
  description: string
  deployedURL: string
  repoURL: string
  coverImageURL: string
  tracks: string[]
  team: string
  members: { name: string }[]
}

export default function SynthesisGrid() {
  const [agents, setAgents] = useState<SynthesisAgent[]>([])
  const [filter, setFilter] = useState<string>('')
  const [trackFilter, setTrackFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/synthesis-agents.json')
      .then((r) => r.json())
      .then((data) => setAgents(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const allTracks = Array.from(new Set(agents.flatMap((a) => a.tracks))).sort()

  const filtered = agents.filter((a) => {
    const matchesSearch =
      !filter ||
      a.name.toLowerCase().includes(filter.toLowerCase()) ||
      a.description.toLowerCase().includes(filter.toLowerCase())
    const matchesTrack =
      trackFilter === 'all' || a.tracks.includes(trackFilter)
    return matchesSearch && matchesTrack
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-48 bg-surface-raised rounded-xl animate-pulse border border-border" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search agents..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 bg-surface-raised border border-border rounded-lg px-4 py-2 text-sm
            text-white placeholder:text-muted focus:outline-none focus:border-accent/50"
        />
        <select
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value)}
          className="bg-surface-raised border border-border rounded-lg px-4 py-2 text-sm
            text-white focus:outline-none focus:border-accent/50"
        >
          <option value="all">All tracks ({agents.length})</option>
          {allTracks.map((t) => (
            <option key={t} value={t}>
              {t} ({agents.filter((a) => a.tracks.includes(t)).length})
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-muted mb-4">
        Showing {filtered.length} of {agents.length} Synthesis 2026 agents
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((agent) => (
          <div
            key={agent.slug || agent.name}
            className="border border-border hover:border-accent/40 rounded-xl p-5 bg-surface-raised
              hover:bg-surface-overlay transition-all group"
          >
            <div className="flex items-start gap-3 mb-3">
              {agent.coverImageURL && (
                <img
                  src={agent.coverImageURL}
                  alt={agent.name}
                  className="w-10 h-10 rounded-lg object-cover bg-surface shrink-0"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white truncate group-hover:text-accent transition-colors text-sm">
                  {agent.name}
                </h3>
                {agent.team && (
                  <p className="text-xs text-muted truncate">by {agent.team}</p>
                )}
              </div>
            </div>

            <p className="text-xs text-muted line-clamp-3 mb-3">
              {agent.description || 'No description'}
            </p>

            {/* Track badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              {agent.tracks.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent/70 truncate max-w-[180px]"
                >
                  {t}
                </span>
              ))}
              {agent.tracks.length > 3 && (
                <span className="text-[10px] font-mono text-muted">
                  +{agent.tracks.length - 3}
                </span>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 text-xs font-mono">
              {agent.deployedURL && (
                <a
                  href={agent.deployedURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent/70 hover:text-accent transition-colors truncate"
                >
                  live ↗
                </a>
              )}
              {agent.repoURL && (
                <a
                  href={agent.repoURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-white transition-colors truncate"
                >
                  repo ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
