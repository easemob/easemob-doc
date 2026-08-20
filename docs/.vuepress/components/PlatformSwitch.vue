<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type PlatformKey = 'android' | 'ios' | 'web'

const PLATFORM_ICON_MAP = {
  android: { icon: '/icon-Android.svg', activeIcon: '/icon-Android-hover.svg' },
  ios: { icon: '/icon-iOS.svg', activeIcon: '/icon-iOS-hover.svg' },
  web: { icon: '/icon-web.svg', activeIcon: '/icon-web-hover.svg' },
} satisfies Record<PlatformKey, { icon: string; activeIcon: string }>

const platform = ref<PlatformKey>('android')
const platformIcon = computed(() => PLATFORM_ICON_MAP[platform.value].icon)
const route = useRoute()
const router = useRouter()

const normalizeRoutePath = (path: string): string =>
  path.replace(/\.html$/, '').replace(/\/$/, '')

const getRoutePaths = (routes: typeof router.options.routes, parentPath = ''): string[] =>
  routes.flatMap((item) => {
    if (typeof item.path !== 'string') return []
    const path = item.path.startsWith('/') ? item.path : `${parentPath}/${item.path}`
    return [path, ...(item.children ? getRoutePaths(item.children, path) : [])]
  })

watch(
  () => route.path,
  () => {
    const matched = route.path.match(/^\/sdk\/v5\/(android|ios|web)(?:\/|$)/)
    if (matched) platform.value = matched[1] as PlatformKey
  },
  { immediate: true }
)

const onChange = (nextPlatform: PlatformKey): void => {
  const root = `/sdk/v5/${nextPlatform}`
  const currentParts = route.path.split('/')
  currentParts[3] = nextPlatform
  const equivalentPath = currentParts.join('/')
  const availableRoutes = getRoutePaths(router.options.routes).map(normalizeRoutePath)

  if (availableRoutes.includes(normalizeRoutePath(equivalentPath))) {
    router.push(equivalentPath)
  } else if (availableRoutes.includes(`${root}/quickstart`)) {
    router.push(`${root}/quickstart.html`)
  } else if (availableRoutes.includes(`${root}/beginner_guide`)) {
    router.push(`${root}/beginner_guide.html`)
  } else {
    router.push(root)
  }
}

const options = [
  { value: 'android' as PlatformKey, label: 'Android' },
  { value: 'ios' as PlatformKey, label: 'iOS' },
  { value: 'web' as PlatformKey, label: 'Web/小程序' },
]
</script>

<template>
  <div class="platform-version-switch">
    <el-select v-model="platform" class="platform-select" placeholder="请选择客户端"
      placement="bottom-end" popper-class="platform-select-dropdown" @change="onChange">
      <template #prefix><img width="20" height="20" :src="platformIcon"></template>
      <el-option v-for="item in options" :key="item.value" :label="item.label"
        :value="item.value" class="option-content">
        <span class="label-icon">
          <img class="default" width="20" height="20" :src="PLATFORM_ICON_MAP[item.value].icon">
          <img class="active" width="20" height="20" :src="PLATFORM_ICON_MAP[item.value].activeIcon">
        </span>
        <span>{{ item.label }}</span>
      </el-option>
    </el-select>
    <span class="version-fixed">5.x</span>
  </div>
</template>

<style lang="scss" scope>
.platform-version-switch { display: flex; align-items: center; gap: .75rem; width: 100%; }
.platform-select { flex: 1 1 auto; min-width: 0; max-width: calc(100% - 3.5rem); }
.version-fixed { flex: 0 0 auto; color: var(--text-color); font-size: .875rem; font-weight: 500; line-height: 2.125rem; }
.label-icon { vertical-align: sub; padding-right: .625rem; }
.option-content .active { display: none; }
.option-content:hover .default { display: none; }
.option-content:hover .active { display: inline-block; }
.platform-select.el-select .el-select__wrapper { min-height: 2.125rem; }
.platform-select-dropdown {
  width: 17.5rem;
  .el-select-dropdown__item {
    height: 2rem; padding-left: .75rem; color: var(--text-color); font-size: .875rem;
    &:hover, &.is-selected, &.is-hovering { color: var(--theme-color); background-color: var(--switch-hover-bg-color); }
  }
}
</style>
