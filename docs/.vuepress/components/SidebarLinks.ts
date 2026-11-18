import { defineComponent, h, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SidebarChild from 'vuepress-theme-hope/sidebar/components/SidebarChild.js'
import SidebarGroup from 'vuepress-theme-hope/sidebar/components/SidebarGroup.js'
import { isMatchedSidebarItem } from 'vuepress-theme-hope/sidebar/utils/index.js'
import 'vuepress-theme-hope/sidebar/styles/sidebar-links.scss'

// Theme Hope treats a group's inherited directory prefix as an active match.
// On a breadcrumb landing page every group shares that prefix, so the first
// unrelated group (e.g. Token 鉴权) opens automatically.
export default defineComponent({
  name: 'SidebarLinks',
  props: {
    config: { type: Array, required: true },
  },
  setup(props) {
    const route = useRoute()
    const openGroupIndex = ref(-1)
    const defaultOpenGroups = ref(new Set<number>())
    const containsCurrentPage = (item: any): boolean =>
      item.link?.split('#')[0] === route.path ||
      (item.type === 'group' && item.children.some(containsCurrentPage))

    watch(
      [() => route.path, () => props.config],
      () => {
        // Breadcrumb landing pages don't all declare the same frontmatter.
        // Their directory route is the reliable signal for keeping groups closed.
        const isLandingPage = route.path.endsWith('/') &&
          /^\/(?:document|v4|uikit|callkit|product|value-added)\//.test(route.path)
        // Only explicitly marked groups start open together; other menus
        // retain the existing accordion behavior.
        defaultOpenGroups.value = new Set(props.config.flatMap((item: any, index) =>
          item.defaultOpen ? [index] : []
        ))
        openGroupIndex.value = isLandingPage
          ? -1
          : props.config.findIndex((item: any) =>
              route.path.startsWith('/uikit/chatuikit/web/')
                ? containsCurrentPage(item)
                : isMatchedSidebarItem(route, item)
            )
      },
      { immediate: true, flush: 'post' }
    )

    return () => h('ul', { class: 'sidebar-links' }, props.config.map((config: any, index) =>
      h('li', config.type === 'group'
        ? h(SidebarGroup, {
            config,
            open: config.defaultOpen
              ? defaultOpenGroups.value.has(index)
              : index === openGroupIndex.value,
            onToggle: () => {
              if (config.defaultOpen) {
                const next = new Set(defaultOpenGroups.value)
                if (next.has(index)) next.delete(index)
                else next.add(index)
                defaultOpenGroups.value = next
              } else {
                openGroupIndex.value = index === openGroupIndex.value ? -1 : index
              }
            },
          })
        : h(SidebarChild, { config }))
    ))
  },
})
