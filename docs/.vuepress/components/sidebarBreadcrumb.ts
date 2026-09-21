export interface SidebarEntry {
  type: string
  text?: string
  link?: string
  children?: SidebarEntry[]
}

export interface SidebarGroupPath {
  item: SidebarEntry
  indices: number[]
}

export const MENU_PAGE = '/breadcrumb/menu.html'

const supportedRoot = (root: string): boolean =>
  root === '/product/' ||
  root.startsWith('/document/') ||
  root.startsWith('/v4/') ||
  root.startsWith('/uikit/') ||
  root.startsWith('/callkit/') ||
  root.startsWith('/value-added/')

export const findSidebarRoot = (
  sidebar: Record<string, unknown> | undefined,
  path: string
): string | null =>
  Object.keys(sidebar ?? {})
    .filter(supportedRoot)
    .sort((a, b) => b.length - a.length)
    .find((root) => path.startsWith(root)) ?? null

export const menuLink = (root: string, indices: number[], from?: string): string =>
  `${MENU_PAGE}?sidebar=${encodeURIComponent(root)}&group=${indices.join('.')}` +
  (from ? `&from=${encodeURIComponent(from)}` : '')

export const getMenuPath = (
  entries: SidebarEntry[],
  raw: unknown
): SidebarGroupPath[] | null => {
  if (typeof raw !== 'string' || !/^\d+(?:\.\d+)*$/.test(raw)) return null
  const indices = raw.split('.').map(Number)
  if (indices.length > 12) return null
  const chain: SidebarGroupPath[] = []
  let children = entries
  for (let depth = 0; depth < indices.length; depth++) {
    const item = children[indices[depth]]
    if (!item || item.type !== 'group') return null
    chain.push({ item, indices: indices.slice(0, depth + 1) })
    children = item.children ?? []
  }
  return chain
}

const samePage = (a: string | undefined, b: string): boolean =>
  Boolean(a && decodeURI(a).replace(/\.html$/, '') === decodeURI(b).replace(/\.html$/, ''))

export const findPageGroups = (
  entries: SidebarEntry[],
  path: string,
  chain: SidebarGroupPath[] = []
): SidebarGroupPath[] | null => {
  for (let index = 0; index < entries.length; index++) {
    const item = entries[index]
    if (item.type === 'group') {
      const next = [...chain, { item, indices: [...(chain[chain.length - 1]?.indices ?? []), index] }]
      const found = findPageGroups(item.children ?? [], path, next)
      if (found) return found
    } else if (item.type === 'page' && samePage(item.link, path)) {
      return chain
    }
  }
  return null
}

export const firstPageLink = (entry: SidebarEntry): string | null => {
  if (entry.type === 'page') return entry.link ?? null
  for (const child of entry.children ?? []) {
    const link = firstPageLink(child)
    if (link) return link
  }
  return null
}

export const sidebarEntryLink = (
  root: string,
  entry: SidebarEntry,
  indices: number[],
  from?: string
): string | null =>
  entry.type === 'group'
    ? menuLink(root, indices, from)
    : entry.link ?? firstPageLink(entry)
