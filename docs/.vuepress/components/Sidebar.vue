<script setup>
  import Sidebar from "vuepress-theme-hope/modules/sidebar/components/Sidebar.js";
  import SidebarLinks from './SidebarLinks'
  import PlatformSwitch from './PlatformSwitch.vue'
  import PrivateSwitch from './PrivateSwitch.vue'
  import UIKitSwitch from './UIKitSwitch.vue'
  import CallKitSwitch from './CallKitSwitch.vue'
  import { usePageData } from '@vuepress/client'
  import { useRoute } from 'vue-router'
  import { useThemeLocaleData } from 'vuepress-theme-hope/composables'
  import { useSidebarItems } from 'vuepress-theme-hope/sidebar/composables/index.js'
  import { resolveArraySidebarItems } from 'vuepress-theme-hope/sidebar/composables/resolveConfig.js'
  import { getLandingSidebarRoot } from './breadcrumbSidebarContext'
  import { MENU_PAGE, findSidebarRoot } from './sidebarBreadcrumb'
  import { computed, nextTick, ref, onMounted, watch} from 'vue'

  const pageData = usePageData()
  const route = useRoute()
  const themeLocale = useThemeLocaleData()
  const defaultSidebarItems = useSidebarItems()
  const hasHydrated = ref(false)
  const landingSidebarRoot = computed(() =>
    route.path === MENU_PAGE && typeof route.query.sidebar === 'string'
      ? findSidebarRoot(themeLocale.value.sidebar, route.query.sidebar)
      : getLandingSidebarRoot(route.path, hasHydrated.value ? route.query.sidebar : undefined)
  )
  const visibleSidebarItems = computed(() => {
    const root = landingSidebarRoot.value
    if (!root) return defaultSidebarItems.value
    const config = themeLocale.value.sidebar?.[root]
    return config
      ? resolveArraySidebarItems(config, themeLocale.value.headerDepth ?? 2, root)
      : defaultSidebarItems.value
  })
  const showPlatformSwitch = ref(false)
  const showPrivateSwitch = ref(false)
  const showUIKitSwitch = ref(false)
  const showCallKitSwitch = ref(false)
  let title = ref('')
  let isNull = ref(false)
  const isMounted = ref(false)

  const initSubheading = ()=>{
    nextTick(()=>{
      const subheadingLis = document.querySelectorAll('li.subheading');
      subheadingLis.forEach(li => {
        if (li.classList.contains('subheading')) {
          li.classList.remove('subheading');
        }
      });

      const separatorLis = document.querySelectorAll('li:has(.sidebar-separator)');
      const lastSeparatorLi = separatorLis[separatorLis.length - 1];
      if (lastSeparatorLi) {
        // 选所有后面的兄弟li
        const allNextLis = [];
        let current = lastSeparatorLi.nextElementSibling;
        while (current) {
          allNextLis.push(current);
          current = current.nextElementSibling;
        }
        allNextLis.forEach(li => li.classList.add('subheading'));
      }
      isMounted.value = true
    })
  }

  onMounted(() => {
    hasHydrated.value = true
    initSubheading()
  })

  watch([pageData, () => route.fullPath], ()=> {
    const pagePath = pageData.value.path
    const isSdkDocPath =
      (pagePath.indexOf('/document/') == 0 || pagePath.indexOf('/v4/') == 0) &&
      pagePath.indexOf('/document/server-side/') < 0
    showPrivateSwitch.value = pagePath.indexOf('/private/') == 0
    const menuRoot = pagePath === MENU_PAGE && typeof route.query.sidebar === 'string'
      ? route.query.sidebar
      : ''
    const isServerMenu = menuRoot.indexOf('/document/server-side/') == 0
    showPlatformSwitch.value = isSdkDocPath || pagePath.indexOf('/sdk/') == 0 ||
      ((!isServerMenu && menuRoot.indexOf('/document/') == 0) ||
        menuRoot.indexOf('/v4/') == 0)
    showUIKitSwitch.value = pagePath.indexOf('/uikit/') == 0 || menuRoot.indexOf('/uikit/') == 0
    showCallKitSwitch.value = pagePath.indexOf('/callkit/') == 0 || menuRoot.indexOf('/callkit/') == 0

    if((menuRoot.indexOf('/document/') == 0 && !isServerMenu) || menuRoot.indexOf('/v4/') == 0) title.value = 'SDK'
    else if(menuRoot.indexOf('/uikit/') == 0) title.value = 'UIKit'
    else if(menuRoot.indexOf('/callkit/') == 0) title.value = 'CallKit'
    else if(isServerMenu) title.value = ''
    else if(pagePath.indexOf('/sdk/') == 0) title.value = 'SDK'
    else if(pagePath.indexOf('/product/') == 0) title.value = ''
    else if(pagePath.indexOf('/uikit/') == 0) title.value = 'UIKit'
    else if(pagePath.indexOf('/callkit/') == 0) title.value = 'CallKit'
    else if(pagePath.indexOf('/document/server-side/') == 0) title.value = ''
    else if(pagePath.indexOf('/document/') == 0 || pagePath.indexOf('/v4/') == 0) title.value = 'SDK'
    else if(pagePath.indexOf('/value-added/') == 0) title.value = ''
    isNull.value = title.value ? false : true

    if (typeof window !== 'undefined' && isMounted.value) initSubheading();
    
  }, {immediate:true})
</script>
<template>
  <Sidebar>
    <template #default>
      <SidebarLinks :config="visibleSidebarItems" />
    </template>
    <template #top>
      <div class="sidebar-header" :class="{'pt20':isNull}">
        <span class="sidebar-title">{{title}}</span>
        <div v-show="showPlatformSwitch" class="platform-switch">
          <ClientOnly>
            <PlatformSwitch />
          </ClientOnly>
        </div>
        <div v-show="showPrivateSwitch" class="platform-switch">
          <ClientOnly>
            <PrivateSwitch />
          </ClientOnly>
        </div>
        <div v-show="showUIKitSwitch" class="platform-switch">
          <ClientOnly>
            <UIKitSwitch />
          </ClientOnly>
        </div>
        <div v-show="showCallKitSwitch" class="platform-switch">
          <ClientOnly>
            <CallKitSwitch />
          </ClientOnly>
        </div>
      </div>
    </template>
  </Sidebar>
</template>

<style scope>
  .sidebar-header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    margin-bottom: -2rem;
    padding: 1.25rem;
    background-color: #fff;
    z-index: 100;

    .sidebar-title {
      margin-right: 1rem;
      color:var(--text-color);
      font-weight: 500;
      font-size: 1.375rem;
    }

    .platform-switch {
      flex: 1 1 auto;
      min-width: 0;
    }

    &.pt20 {
      padding: .625rem 1.25rem;
    }
  }
</style>




