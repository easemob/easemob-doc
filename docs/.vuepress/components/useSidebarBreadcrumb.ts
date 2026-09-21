import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeLocaleData } from 'vuepress-theme-hope/composables'
import { useSidebarItems } from 'vuepress-theme-hope/sidebar/composables/index.js'
import { resolveArraySidebarItems } from 'vuepress-theme-hope/sidebar/composables/resolveConfig.js'
import {
  MENU_PAGE,
  findPageGroups,
  findSidebarRoot,
  getMenuPath,
  menuLink,
  type SidebarEntry,
} from './sidebarBreadcrumb'

export const useSidebarBreadcrumb = () => {
  const route = useRoute()
  const theme = useThemeLocaleData()
  const sidebarItems = useSidebarItems()

  const menu = computed(() => {
    if (route.path !== MENU_PAGE) return null
    const root = route.query.sidebar
    const configs = theme.value.sidebar as Record<string, SidebarEntry[]>
    if (typeof root !== 'string' || findSidebarRoot(configs, root) !== root) return null
    const config = configs[root]
    if (!Array.isArray(config)) return null
    const entries = resolveArraySidebarItems(config, theme.value.headerDepth ?? 2, root)
    const groups = getMenuPath(entries, route.query.group)
    return groups ? { root, entries, groups, current: groups[groups.length - 1].item } : null
  })

  const pageGroups = computed(() => {
    if (route.path === MENU_PAGE) return []
    const configs = theme.value.sidebar as Record<string, SidebarEntry[]>
    const root = findSidebarRoot(configs, route.path)
    if (!root) return []
    return (findPageGroups(sidebarItems.value, route.path) ?? []).map((group) => ({
      title: group.item.text ?? '',
      path: menuLink(root, group.indices, route.path),
    }))
  })

  return { menu, pageGroups }
}
