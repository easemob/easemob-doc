<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarBreadcrumb } from './useSidebarBreadcrumb'
import {
  sidebarEntryLink,
  type SidebarEntry,
} from './sidebarBreadcrumb'

const { menu } = useSidebarBreadcrumb()
const route = useRoute()
const title = computed(() => menu.value?.current.text ?? '菜单')
const children = computed(() =>
  (menu.value?.current.children ?? [])
    .map((child, index) => ({ child, index }))
    .filter(({ child }) =>
      (child.type === 'group' || child.type === 'page') && child.text
    )
)

const childLink = (child: SidebarEntry, index: number): string => {
  if (!menu.value) return '/'
  const parent = menu.value.groups[menu.value.groups.length - 1].indices
  return sidebarEntryLink(
    menu.value.root,
    child,
    [...parent, index],
    typeof route.query.from === 'string' ? route.query.from : undefined
  ) ?? '/'
}
</script>

<template>
  <div v-if="menu" class="sidebar-menu-page">
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="item in children" :key="`${item.child.text}-${item.index}`">
        <RouterLink :to="childLink(item.child, item.index)">{{ item.child.text }}</RouterLink>
      </li>
    </ul>
  </div>
</template>
