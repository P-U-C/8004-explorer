import { createPublicClient, http, type Address } from 'viem'
import { base } from 'viem/chains'

export const REGISTRY_ADDRESS = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432' as const
export const FEATURED_TOKEN_ID = 28362n

const abi = [
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

const transferEventAbi = [
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const

export const client = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
})

export async function getTokenURI(tokenId: bigint): Promise<string> {
  return client.readContract({
    address: REGISTRY_ADDRESS,
    abi,
    functionName: 'tokenURI',
    args: [tokenId],
  })
}

export async function getOwnerOf(tokenId: bigint): Promise<Address> {
  return client.readContract({
    address: REGISTRY_ADDRESS,
    abi,
    functionName: 'ownerOf',
    args: [tokenId],
  })
}

export async function getTotalSupply(): Promise<bigint> {
  try {
    return await client.readContract({
      address: REGISTRY_ADDRESS,
      abi,
      functionName: 'totalSupply',
    })
  } catch {
    return 0n
  }
}

export async function getRecentRegistrations(count = 20): Promise<bigint[]> {
  try {
    const zeroAddress = '0x0000000000000000000000000000000000000000' as Address
    const latestBlock = await client.getBlockNumber()
    // Scan last ~50k blocks (~1 day on Base)
    const fromBlock = latestBlock - 50000n > 0n ? latestBlock - 50000n : 0n

    const logs = await client.getLogs({
      address: REGISTRY_ADDRESS,
      event: transferEventAbi[0],
      args: { from: zeroAddress },
      fromBlock,
      toBlock: latestBlock,
    })

    // Extract token IDs, most recent first
    const tokenIds = logs
      .map((log) => log.args.tokenId!)
      .filter(Boolean)
      .reverse()
      .slice(0, count)

    return tokenIds
  } catch (e) {
    console.error('Failed to fetch recent registrations:', e)
    return []
  }
}
