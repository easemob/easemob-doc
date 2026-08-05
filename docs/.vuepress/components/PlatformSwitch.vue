<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type PlatformKey =
  | 'android'
  | 'ios'
  | 'web'
  | 'harmonyos'
  | 'windows'
  | 'react-native'
  | 'flutter'
  | 'unity'
  | 'applet'
  | 'server-side'

type DocVersion = '5.x' | '4.x'

interface PlatformIcon {
  icon: string
  activeIcon: string
}

interface VersionItem {
  value: DocVersion
  label: string
  homePath: Partial<Record<PlatformKey, string>>
}

interface VersionConfig {
  switchablePlatforms: PlatformKey[]
  fixedVersionLabel: DocVersion
  defaultVersion: DocVersion
  versions: VersionItem[]
}

interface PlatformOption {
  value: PlatformKey
  label: string
}

interface PlatformOptionGroup {
  label: string
  options: PlatformOption[]
}

const PLATFORM_ICON_MAP: Record<PlatformKey, PlatformIcon> = {
  android: {
    icon: '/icon-Android.svg',
    activeIcon: '/icon-Android-hover.svg',
  },
  ios: {
    icon: '/icon-iOS.svg',
    activeIcon: '/icon-iOS-hover.svg',
  },
  web: {
    icon: '/icon-web.svg',
    activeIcon: '/icon-web-hover.svg',
  },
  harmonyos: {
    icon: '/icon-harmonyos.svg',
    activeIcon: '/icon-harmonyos-hover.svg',
  },
  windows: {
    icon: '/icon-windows.svg',
    activeIcon: '/icon-windows-hover.svg',
  },
  'react-native': {
    icon: '/icon-ReactNative.svg',
    activeIcon: '/icon-ReactNative-hover.svg',
  },
  flutter: {
    icon: '/icon-flutter.svg',
    activeIcon: '/icon-flutter-hover.png',
  },
  unity: {
    icon: '/icon-unity.svg',
    activeIcon: '/icon-unity-hover.svg',
  },
  applet: {
    icon: '/icon-mini-program.svg',
    activeIcon: '/icon-mini-program-hover.svg',
  },
  'server-side': {
    icon: '/icon-platform.svg',
    activeIcon: '/icon-platform-hover.svg',
  },
}

/** 版本切换配置：平台、默认版本、各版本按平台的 homePath 均可在此调整 */
const VERSION_CONFIG: VersionConfig = {
  switchablePlatforms: ['android', 'ios', 'web'],
  fixedVersionLabel: '4.x',
  defaultVersion: '5.x',
  versions: [
    {
      value: '4.x',
      label: '4.x',
      homePath: {
        android: '/v4/android/quickstart.html',
        ios: '/v4/ios/quickstart.html',
        web: '/v4/web/quickstart.html',
        applet: '/v4/applet/beginner_guide.html',
      },
    },
    {
      value: '5.x',
      label: '5.x',
      homePath: {
        android: '/document/android/quickstart.html',
        ios: '/document/ios/quickstart.html',
        web: '/document/web/quickstart.html',
      },
    },
  ],
}

const platform = ref<PlatformKey>('android')
const version = ref<DocVersion>(VERSION_CONFIG.defaultVersion)
const platformIcon = computed(() => PLATFORM_ICON_MAP[platform.value].icon)
const canSwitchVersion = computed(() => isSwitchablePlatform(platform.value))
const versionLabel = computed(() =>
  canSwitchVersion.value ? version.value : VERSION_CONFIG.fixedVersionLabel
)
const route = useRoute()
const router = useRouter()

const normalizeHomePath = (home: string): string => home.replace(/\/$/, '')

const isPlatformKey = (value: string): value is PlatformKey =>
  Object.prototype.hasOwnProperty.call(PLATFORM_ICON_MAP, value)

const parsePlatform = (path: string): PlatformKey | null => {
  const matched = path.match(/^\/(?:document|v4)\/([^/]+)/)
  if (!matched) return null
  return isPlatformKey(matched[1]) ? matched[1] : null
}

const isSwitchablePlatform = (platformName: PlatformKey): boolean =>
  VERSION_CONFIG.switchablePlatforms.includes(platformName)

const getHomePath = (versionValue: DocVersion, platformName: PlatformKey): string => {
  const ver = VERSION_CONFIG.versions.find((item) => item.value === versionValue)
  if (!ver) {
    throw new Error(`[PlatformSwitch] Unknown version: ${versionValue}`)
  }
  const home = ver.homePath[platformName]
  if (!home) {
    throw new Error(
      `[PlatformSwitch] Missing homePath for version=${versionValue}, platform=${platformName}`
    )
  }
  return home
}

const resolveVersion = (path: string, platformName: PlatformKey): DocVersion => {
  // /v4 开头优先判定为 4.x；默认 /document 为 5.x
  if (path.startsWith('/v4/')) {
    return '4.x'
  }

  const candidates = VERSION_CONFIG.versions
    .flatMap((ver) => {
      const home = ver.homePath[platformName]
      if (!home) return []
      return [{ value: ver.value, home: normalizeHomePath(home) }]
    })
    .sort((a, b) => b.home.length - a.home.length)

  for (const item of candidates) {
    if (path === item.home || path.startsWith(`${item.home}/`)) {
      return item.value
    }
  }
  return VERSION_CONFIG.defaultVersion
}

/**
 * VuePress may register generated document routes as nested routes. Flatten
 * the route tree before checking whether a page exists on the target platform.
 */
const getRoutePaths = (
  routes: typeof router.options.routes,
  parentPath = ''
): string[] =>
  routes.flatMap((item) => {
    if (typeof item.path !== 'string') return []
    const path = item.path.startsWith('/')
      ? item.path
      : `${parentPath}/${item.path}`
    return [path, ...(item.children ? getRoutePaths(item.children, path) : [])]
  })

const normalizeRoutePath = (path: string): string =>
  path.replace(/\.html$/, '').replace(/\/$/, '')

const navigateToPlatformDoc = (
  platformName: PlatformKey,
  targetVersion: DocVersion = '5.x'
): void => {
  const documentRoot = targetVersion === '4.x' ? '/v4' : '/document'
  const nextPlatformDocRouters = getRoutePaths(router.options.routes)
    .filter((path) => path.indexOf(`${documentRoot}/${platformName}/`) === 0)
    .map(normalizeRoutePath)

  let newPath = route.path.split('/')
  newPath[1] = documentRoot.slice(1)
  newPath[2] = platformName
  const nextPathPath = newPath.join('/')
  const quickstartPath = `${documentRoot}/${platformName}/quickstart.html`
  const overviewPath = `${documentRoot}/${platformName}/overview.html`
  if (nextPlatformDocRouters.indexOf(normalizeRoutePath(nextPathPath)) > -1) {
    router.push(nextPathPath)
  } else if (nextPlatformDocRouters.indexOf(normalizeRoutePath(quickstartPath)) > -1) {
    router.push(quickstartPath)
  } else if (nextPlatformDocRouters.indexOf(normalizeRoutePath(overviewPath)) > -1) {
    router.push(overviewPath)
  } else {
    router.push(`${documentRoot}/${platformName}`)
  }
}

watch(
  () => route.path,
  () => {
    const nextPlatform = parsePlatform(route.path)
    if (!nextPlatform) return

    platform.value = nextPlatform
    version.value = resolveVersion(route.path, nextPlatform)
  },
  { immediate: true }
)

// 切换平台
const onChange = (nextPlatform: PlatformKey): void => {
  // 小程序仅在 V4 中独立存在。
  if (nextPlatform === 'applet') {
    router.push(getHomePath('4.x', nextPlatform))
    return
  }

  if (isSwitchablePlatform(nextPlatform)) {
    // V4 的 Web 与小程序是两个独立平台，互相切换时保持在 V4。
    const targetVersion = route.path.startsWith('/v4/')
      ? '4.x'
      : version.value
    navigateToPlatformDoc(nextPlatform, targetVersion)
    return
  }
  navigateToPlatformDoc(nextPlatform)
}

// 切换版本：固定跳到配置的平台首页
const onVersionChange = (nextVersion: DocVersion | string): void => {
  if (nextVersion !== '5.x' && nextVersion !== '4.x') {
    throw new Error(`[PlatformSwitch] Unknown version: ${nextVersion}`)
  }
  router.push(getHomePath(nextVersion, platform.value))
}

const options = computed<PlatformOptionGroup[]>(() => {
  const isV5 = version.value === '5.x'
  return [
    {
      label: '平台',
      options: [
        { value: 'android', label: 'Android' },
        { value: 'ios', label: 'iOS' },
        { value: 'web', label: isV5 ? 'Web/小程序' : 'Web' },
        { value: 'harmonyos', label: 'HarmonyOS' },
        { value: 'windows', label: 'Windows' },
      ],
    },
    {
      label: '框架',
      options: [
        { value: 'react-native', label: 'React Native' },
        { value: 'flutter', label: 'Flutter' },
        { value: 'unity', label: 'Unity' },
        ...(!isV5 ? [{ value: 'applet' as PlatformKey, label: '小程序' }] : []),
      ],
    },
    {
      label: '服务端',
      options: [{ value: 'server-side', label: 'Rest Api' }],
    },
  ]
})
</script>


<template>
  <div class="platform-version-switch">
    <el-select
      v-model="platform"
      class="platform-select"
      placeholder="请选择"
      placement="bottom-end"
      popper-class="platform-select-dropdown"
      @change="onChange"
    >
      <template #prefix>
       <img width="20" height="20" :src="platformIcon">
      </template>
      <el-option-group
        v-for="group in options"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          class="option-content"
        >
          <span class="label-icon">
            <img class="default" width="20" height="20" :src="PLATFORM_ICON_MAP[item.value]?.icon" />
            <img class="active" width="20" height="20" :src="PLATFORM_ICON_MAP[item.value]?.activeIcon" />
          </span>
          <span>{{ item.label }}</span>
        </el-option>
      </el-option-group>
    </el-select>

    <el-dropdown
      v-if="canSwitchVersion"
      class="version-dropdown"
      trigger="click"
      popper-class="version-dropdown-menu"
      @command="onVersionChange"
    >
      <button type="button" class="version-trigger">
        <span>{{ version }}</span>
        <i class="version-trigger-arrow" aria-hidden="true" />
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in VERSION_CONFIG.versions"
            :key="item.value"
            :command="item.value"
            :class="{ 'is-active-version': item.value === version }"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span v-else class="version-fixed">{{ versionLabel }}</span>
  </div>
</template>

<style lang="scss" scope>

  .platform-version-switch {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .option-content:hover .default {
    display: none;
  }

  .option-content .active {
    display: none;
  }

  .option-content:hover .active {
    display: inline-block;
  }

  .label-icon {
    vertical-align: sub;
    padding-right: 5px;
  }

  .platform-select {
    flex: 1 1 auto;
    min-width: 0;
    max-width: calc(100% - 3.5rem);
  }

  .version-dropdown {
    flex: 0 0 auto;
  }

  .version-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    height: 2.125rem;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--text-color);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;

    &:hover {
      color: var(--theme-color);

      .version-trigger-arrow {
        background-color: var(--theme-color);
      }
    }
  }

  .version-trigger-arrow {
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    background-color: #909399;
    mask: url(/icon-arrow-down.svg) no-repeat center / contain;
    -webkit-mask: url(/icon-arrow-down.svg) no-repeat center / contain;
  }

  .version-fixed {
    flex: 0 0 auto;
    color: var(--text-color);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 2.125rem;
  }

  .platform-select.el-select {
    .el-select__wrapper {
      min-height: 2.125rem;
      .el-select__icon {
        width: 0.88rem;
        height: 0.88rem;
        background: url(/icon-arrow-down.svg) no-repeat center center;
        svg {
          display: none;
        }
      }

      &.is-focused {
        .el-select__icon {
          background-image: url(/icon-arrow-down-hover.svg);
        }
      }
    }
  }

  .platform-select-dropdown {
    width: 17.5rem;

    .el-select-group__wrap {
      position: relative;
      padding-bottom: .5rem;
      margin-bottom: .5rem;

      .el-select-group__title {
        display: flex;
        align-items: center;
        height: 2rem;
        padding-left: 1.25rem;
        align-self: stretch;
        color: var(--text-color-light);
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.25rem;
      }

      .el-select-group {
        .el-select-dropdown__item {
          height: 2rem;
          padding-left: .75rem;
          color: var(--text-color);
          font-size: 0.875rem;
          font-style: normal;
          font-weight: 400;

          .label-icon {
              padding-right: .62rem;
          }

          &:hover,
          &.is-selected,
          &.is-hovering {
            color: var(--theme-color);
            background-color: transparent;
          }
          &:hover {
            background-color: var(--switch-hover-bg-color);
          }
        }
      }

      &::after {
        content: '';        
        position: absolute; 
        bottom: 0;          
        left: 1.5rem;
        width: calc(100% - 3rem);        
        height: 1px;       
        background-color: var(--border-color); 
      }

      &:last-child {
        padding-bottom: 0;
        margin-bottom: 0;

        &::after {
          display: none;
        }
      }
    }
  }

  .version-dropdown-menu {
    min-width: 5.5rem;

    .el-dropdown-menu__item {
      min-width: 5.5rem;
      height: 2rem;
      padding: 0 1rem;
      line-height: 2rem;
      color: var(--text-color);
      font-size: 0.875rem;

      &:hover,
      &:focus,
      &.is-active-version {
        color: var(--theme-color);
        background-color: var(--switch-hover-bg-color);
      }
    }
  }
</style>
