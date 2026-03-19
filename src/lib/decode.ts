export interface AgentService {
  name: string
  endpoint: string
  version?: string
}

export interface AgentRegistration {
  agentId: number
  agentRegistry: string
}

export interface AgentMetadata {
  type?: string
  name: string
  description: string
  image?: string
  services?: AgentService[]
  active?: boolean
  registrations?: AgentRegistration[]
  supportedTrust?: string[]
  [key: string]: unknown
}

export function decodeTokenURI(uri: string): AgentMetadata {
  // Handle data:application/json;base64,...
  if (uri.startsWith('data:application/json;base64,')) {
    const b64 = uri.slice('data:application/json;base64,'.length)
    const json = atob(b64)
    return JSON.parse(json)
  }

  // Handle data:application/json,...
  if (uri.startsWith('data:application/json,')) {
    const json = decodeURIComponent(uri.slice('data:application/json,'.length))
    return JSON.parse(json)
  }

  // Handle plain JSON
  try {
    return JSON.parse(uri)
  } catch {
    throw new Error('Unable to decode tokenURI')
  }
}

export async function fetchLiveStatus(
  endpoint: string
): Promise<{ online: boolean; data?: Record<string, unknown> }> {
  try {
    // Try well-known first
    const wellKnownUrl = new URL('/.well-known/agent-registration.json', endpoint).toString()
    const res = await fetch(wellKnownUrl, { signal: AbortSignal.timeout(5000) })
    if (res.ok) {
      const data = await res.json()
      return { online: true, data }
    }
  } catch {
    // Ignore CORS / network errors
  }

  try {
    // Try endpoint root
    const res = await fetch(endpoint, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
    return { online: res.ok }
  } catch {
    return { online: false }
  }
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
