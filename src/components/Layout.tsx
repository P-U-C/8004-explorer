import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-accent font-mono text-sm font-bold">S</span>
            </div>
            <span className="font-mono text-sm text-muted hidden sm:block">
              Synthesis <span className="text-white">2026</span>
            </span>
          </Link>
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4 shrink-0 hidden sm:flex">
            <Link
              to="/synthesis"
              className="text-xs font-mono text-muted hover:text-accent transition-colors"
            >
              Synthesis 2026
            </Link>
            <a
              href="https://basescan.org/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-muted hover:text-accent transition-colors"
            >
              Contract ↗
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-muted font-mono">
          <span>ERC-8004 Agent Registry — Base</span>
          <a
            href="https://eips.ethereum.org/EIPS/eip-8004"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            EIP-8004 Spec ↗
          </a>
        </div>
      </footer>
    </div>
  )
}
