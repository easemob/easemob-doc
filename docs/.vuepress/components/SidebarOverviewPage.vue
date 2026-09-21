<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeLocaleData } from 'vuepress-theme-hope/composables'
import { useSidebarItems } from 'vuepress-theme-hope/sidebar/composables/index.js'
import { resolveArraySidebarItems } from 'vuepress-theme-hope/sidebar/composables/resolveConfig.js'
import { getLandingSidebarRoot } from './breadcrumbSidebarContext'
import {
  findSidebarRoot,
  sidebarEntryLink,
  type SidebarEntry,
} from './sidebarBreadcrumb'

const props = withDefaults(defineProps<{
  exclude?: string[]
  include?: string[]
}>(), {
  exclude: () => [],
  include: () => [],
})

const route = useRoute()
const theme = useThemeLocaleData()
const defaultSidebarItems = useSidebarItems()

const sidebarContext = computed(() => {
  const configs = theme.value.sidebar as Record<string, SidebarEntry[]>
  const root = getLandingSidebarRoot(route.path, route.query.sidebar) ??
    findSidebarRoot(configs, route.path)

  if (!root) {
    return {
      root: '',
      entries: defaultSidebarItems.value as SidebarEntry[],
    }
  }

  const config = configs[root]
  return {
    root,
    entries: config
      ? resolveArraySidebarItems(
        config,
        theme.value.headerDepth ?? 2,
        root
      ) as SidebarEntry[]
      : defaultSidebarItems.value as SidebarEntry[],
  }
})

const entries = computed(() => {
  const excluded = new Set(props.exclude)
  const { root, entries: sidebarItems } = sidebarContext.value
  if (!root) return []

  return sidebarItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      (item.type === 'group' || item.type === 'page') &&
      item.text &&
      !excluded.has(item.text) &&
      (props.include.length === 0 || props.include.includes(item.text))
    )
    .map(({ item, index }) => ({
      text: item.text ?? '',
      link: sidebarEntryLink(root, item, [index], root),
    }))
    .filter((item): item is { text: string; link: string } => Boolean(item.link))
})
</script>

<template>
  <ul class="sidebar-overview-page">
    <li v-for="entry in entries" :key="`${entry.text}-${entry.link}`">
      <RouterLink :to="entry.link">{{ entry.text }}</RouterLink>
    </li>
  </ul>
</template>
