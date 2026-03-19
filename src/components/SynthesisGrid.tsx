import { useEffect, useState } from 'react'

interface SynthesisAgent {
  name: string
  slug: string
  description: string
  deployedURL: string
  repoURL: string
  videoURL: string
  coverImageURL: string
  tracks: string[]
  team: string
  members: { name: string }[]
  problemStatement: string
  createdAt: string
}

function AgentModal({
  agent,
  onClose,
}: {
  agent: SynthesisAgent
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-raised border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {agent.coverImageURL && (
              <img
                src={agent.coverImageURL}
                alt={agent.name}
                className="w-16 h-16 rounded-xl object-cover bg-surface shrink-0"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{agent.name}</h2>
              {agent.team && (
                <p className="text-sm text-muted mt-0.5">by {agent.team}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* Track badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {agent.tracks.map((t) => (
            <span
              key={t}
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-accent/10 text-accent/80"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
            {agent.description}
          </p>
        </div>

        {/* Problem statement */}
        {agent.problemStatement && (
          <div className="mb-4 p-3 bg-surface rounded-lg border border-border">
            <p className="text-xs font-mono text-muted uppercase mb-1">
              Problem Statement
            </p>
            <p className="text-sm text-gray-400">{agent.problemStatement}</p>
          </div>
        )}

        {/* Members */}
        {agent.members.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-muted uppercase mb-2">Team</p>
            <div className="flex flex-wrap gap-2">
              {agent.members.map((m, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-surface border border-border text-gray-400"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-border">
          {agent.deployedURL && (
            <a
              href={agent.deployedURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-mono text-accent hover:text-accent/80 transition-colors"
            >
              <span>🌐</span> Live App
            </a>
          )}
          {agent.repoURL && (
            <a
              href={agent.repoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-mono text-gray-400 hover:text-white transition-colors"
            >
              <span>📦</span> Repository
            </a>
          )}
          {agent.videoURL && (
            <a
              href={agent.videoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-mono text-gray-400 hover:text-white transition-colors"
            >
              <span>🎬</span> Demo Video
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SynthesisGrid() {
  const [agents, setAgents] = useState<SynthesisAgent[]>([])
  const [filter, setFilter] = useState<string>('')
  const [trackFilter, setTrackFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<SynthesisAgent | null>(null)

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
      a.description.toLowerCase().includes(filter.toLowerCase()) ||
      a.team.toLowerCase().includes(filter.toLowerCase())
    const matchesTrack =
      trackFilter === 'all' || a.tracks.includes(trackFilter)
    return matchesSearch && matchesTrack
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-48 bg-surface-raised rounded-xl animate-pulse border border-border"
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Synthesis <span className="text-accent">2026</span>
        </h1>
        <p className="text-muted max-w-xl text-sm">
          {agents.length} agent applications submitted to the Synthesis hackathon.
          Browse projects, explore tracks, and discover what's being built.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, description, or team..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 bg-surface-raised border border-border rounded-lg px-4 py-2.5 text-sm
            text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
        <select
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value)}
          className="bg-surface-raised border border-border rounded-lg px-4 py-2.5 text-sm
            text-white focus:outline-none focus:border-accent/50 transition-colors min-w-[200px]"
        >
          <option value="all">All tracks ({agents.length})</option>
          {allTracks.map((t) => (
            <option key={t} value={t}>
              {t} ({agents.filter((a) => a.tracks.includes(t)).length})
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-muted mb-4 font-mono">
        {filtered.length} of {agents.length} applications
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((agent) => (
          <button
            key={agent.slug || agent.name}
            onClick={() => setSelected(agent)}
            className="text-left border border-border hover:border-accent/40 rounded-xl p-5 bg-surface-raised
              hover:bg-surface-overlay transition-all group cursor-pointer"
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

            <p className="text-xs text-muted line-clamp-3 mb-3 leading-relaxed">
              {agent.description.slice(0, 200) || 'No description'}
            </p>

            {/* Track badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              {agent.tracks.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent/70 truncate max-w-[160px]"
                >
                  {t}
                </span>
              ))}
              {agent.tracks.length > 2 && (
                <span className="text-[10px] font-mono text-muted">
                  +{agent.tracks.length - 2}
                </span>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 text-xs font-mono">
              {agent.deployedURL && (
                <span className="text-accent/70">🌐 live</span>
              )}
              {agent.repoURL && <span className="text-muted">📦 repo</span>}
              {agent.videoURL && <span className="text-muted">🎬 demo</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <AgentModal agent={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
