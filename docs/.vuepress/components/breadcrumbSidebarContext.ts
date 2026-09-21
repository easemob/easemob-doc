/** Keep the originating platform's documentation sidebar on breadcrumb landing pages. */
const sdkV5 = ['android', 'ios', 'web']
const sdkV4 = ['android', 'ios', 'web', 'applet']
const sdkLegacy = ['harmonyos', 'flutter', 'react-native', 'unity', 'windows']
const chatV4 = ['android', 'ios', 'web']
const chatV2 = ['flutter', 'react-native']
const chatV1 = ['harmonyos', 'uniapp']
const roomPlatforms = ['android', 'ios', 'web', 'flutter', 'react-native']
const callV4 = ['android', 'ios']
const callV2 = ['web']

const roots = (prefix: string, platforms: string[]): string[] =>
  platforms.map((platform) => `${prefix}${platform}/`)

const sdkV5Roots = roots('/document/', sdkV5)
const sdkV4Roots = [...roots('/v4/', sdkV4), ...roots('/document/', sdkLegacy)]
const chatV4Roots = roots('/uikit/chatuikit/', chatV4)
const chatV2Roots = roots('/uikit/chatuikit/', chatV2)
const chatV1Roots = roots('/uikit/chatuikit/', chatV1)
const roomRoots = roots('/uikit/chatroomuikit/', roomPlatforms)
const callV4Roots = roots('/callkit/', callV4)
const callV2Roots = roots('/callkit/', callV2)
const valueAddedRoots = [
  '/value-added/push',
  '/value-added/moderation',
  '/value-added/translation',
  '/value-added/search',
  '/value-added/stt',
]

const landingSidebars: Record<string, { fallback: string; allowed: string[] }> = {
  '/sdk/': { fallback: sdkV5Roots[0], allowed: [...sdkV5Roots, ...sdkV4Roots] },
  '/sdk/v5.html': { fallback: sdkV5Roots[0], allowed: sdkV5Roots },
  '/sdk/v4.html': { fallback: sdkV4Roots[0], allowed: sdkV4Roots },
  '/uikit/': {
    fallback: chatV4Roots[0],
    allowed: [...chatV4Roots, ...chatV2Roots, ...chatV1Roots, ...roomRoots],
  },
  '/uikit/chatuikit/': {
    fallback: chatV4Roots[0],
    allowed: [...chatV4Roots, ...chatV2Roots, ...chatV1Roots],
  },
  '/uikit/chatuikit/v4.html': { fallback: chatV4Roots[0], allowed: chatV4Roots },
  '/uikit/chatuikit/v2.html': { fallback: chatV2Roots[0], allowed: chatV2Roots },
  '/uikit/chatuikit/v1.html': { fallback: chatV1Roots[0], allowed: chatV1Roots },
  '/uikit/chatroomuikit/': { fallback: roomRoots[0], allowed: roomRoots },
  '/callkit/': { fallback: callV4Roots[0], allowed: [...callV4Roots, ...callV2Roots] },
  '/callkit/v4.html': { fallback: callV4Roots[0], allowed: callV4Roots },
  '/callkit/v2.html': { fallback: callV2Roots[0], allowed: callV2Roots },
  '/value-added/': { fallback: valueAddedRoots[0], allowed: valueAddedRoots },
}

const allPlatformRoots = new Set([
  ...sdkV5Roots, ...sdkV4Roots, ...chatV4Roots, ...chatV2Roots,
  ...chatV1Roots, ...roomRoots, ...callV4Roots, ...callV2Roots,
])

export const getPlatformSidebarRoot = (path: string): string | null => {
  const match = path.match(/^\/(?:document|v4|uikit\/(?:chatuikit|chatroomuikit)|callkit)\/[^/]+\//)
  return match && allPlatformRoots.has(match[0]) ? match[0] : null
}

export const getValueAddedSidebarRoot = (path: string): string | null => {
  const match = path.match(/^\/value-added\/([^/]+)(?:\/|$)/)
  if (!match) return null
  const root = `/value-added/${match[1]}`
  return valueAddedRoots.includes(root) ? root : null
}

export const getLandingSidebarRoot = (path: string, candidate?: unknown): string | null => {
  const config = landingSidebars[path]
  if (!config) return null
  return typeof candidate === 'string' && config.allowed.includes(candidate)
    ? candidate
    : config.fallback
}
