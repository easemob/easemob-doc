<script setup lang="ts">
import { usePageData } from '@vuepress/client'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'
import ThemePageTitle from 'vuepress-theme-hope/components/PageTitle.js'

const DISMISSED_KEY = 'easemob:v5-sdk-banner-dismissed'

const v4DocumentLinks: Record<string, string> = {
  android: 'https://doc.easemob.com/v4/android/beginner_guide.html',
  ios: 'https://doc.easemob.com/v4/ios/beginner_guide.html',
  web: 'https://doc.easemob.com/v4/web/beginner_guide.html',
  flutter: 'https://doc.easemob.com/v4/flutter/beginner_guide.html',
  'react-native': 'https://doc.easemob.com/v4/react-native/beginner_guide.html',
  harmonyos: 'https://doc.easemob.com/v4/harmonyos/beginner_guide.html'
}

const pageData = usePageData()
const versionBanner = ref<HTMLElement | null>(null)
const versionBannerWidth = ref('100%')
const isReady = ref(false)
const isDismissed = ref(false)
let bannerResizeFrame = 0
let bannerResizeTimer = 0

const currentPlatform = computed(() => {
  const match = pageData.value.path.match(
    /^\/document\/(android|ios|web|flutter|react-native|harmonyos)(?:\/|$)/
  )

  return match?.[1] ?? ''
})

const v4DocumentLink = computed(
  () => v4DocumentLinks[currentPlatform.value] ?? ''
)

const showVersionBanner = computed(
  () => isReady.value && !isDismissed.value && Boolean(v4DocumentLink.value)
)

const updateVersionBannerWidth = () => {
  const banner = versionBanner.value
  const toc = document.querySelector<HTMLElement>('#toc')

  if (!banner || !toc || window.getComputedStyle(toc).display === 'none') {
    versionBannerWidth.value = '100%'
    return
  }

  const bannerLeft = banner.getBoundingClientRect().left
  const tocLeft = toc.getBoundingClientRect().left

  versionBannerWidth.value = tocLeft > bannerLeft
    ? `${Math.round(tocLeft - bannerLeft)}px`
    : '100%'
}

const scheduleVersionBannerWidthUpdate = () => {
  window.cancelAnimationFrame(bannerResizeFrame)
  window.clearTimeout(bannerResizeTimer)
  bannerResizeFrame = window.requestAnimationFrame(updateVersionBannerWidth)

  // 页面主体在桌面端切换宽度时有 0.3 秒的布局过渡，
  // 过渡结束后再次测量，避免横幅使用过渡开始阶段的位置。
  bannerResizeTimer = window.setTimeout(() => {
    bannerResizeFrame = window.requestAnimationFrame(updateVersionBannerWidth)
  }, 350)
}

onMounted(async () => {
  try {
    isDismissed.value = window.sessionStorage.getItem(DISMISSED_KEY) === 'true'
  } catch {
    // 某些浏览器会限制会话存储；不影响横幅的显示和关闭。
    isDismissed.value = false
  }
  isReady.value = true

  window.addEventListener('resize', scheduleVersionBannerWidthUpdate, {
    passive: true
  })

  await nextTick()
  scheduleVersionBannerWidthUpdate()

  void document.fonts?.ready.then(scheduleVersionBannerWidthUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', scheduleVersionBannerWidthUpdate)
  window.cancelAnimationFrame(bannerResizeFrame)
  window.clearTimeout(bannerResizeTimer)
})

watch(
  () => pageData.value.path,
  async () => {
    versionBannerWidth.value = '100%'
    await nextTick()
    scheduleVersionBannerWidthUpdate()
  }
)

const dismissBanner = () => {
  isDismissed.value = true

  try {
    window.sessionStorage.setItem(DISMISSED_KEY, 'true')
  } catch {
    // 无法使用会话存储时，仍在当前页面关闭横幅。
  }
}

const openV4Document = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()

  if (v4DocumentLink.value) {
    window.location.assign(v4DocumentLink.value)
  }
}
</script>

<template>
  <div v-if="showVersionBanner" class="page-title version-banner-wrapper">
    <aside
      ref="versionBanner"
      class="version-banner"
      aria-label="V5 SDK 版本说明"
      :style="{ width: versionBannerWidth }"
    >
      <div class="version-banner-content">
        <strong class="version-banner-primary">V5 SDK</strong> 架构焕新，集成更轻松，数据管理更高效；<span class="version-banner-secondary">V4.x 仍在维护，<a
            class="version-banner-link"
            :href="v4DocumentLink"
            target="_self"
            @click="openV4Document"
          >查看 V4.x 文档</a>。</span>
      </div>
      <button
        class="version-banner-close"
        type="button"
        aria-label="关闭版本说明"
        title="关闭"
        @click.stop="dismissBanner"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.76 3.76 8 8l4.24-4.24 1.06 1.06L9.06 9.06l4.24 4.24-1.06 1.06L8 10.12l-4.24 4.24-1.06-1.06 4.24-4.24L2.7 4.82l1.06-1.06Z" />
        </svg>
      </button>
    </aside>
  </div>

  <ThemePageTitle />
</template>

<style scoped>
.version-banner-wrapper {
  position: relative;
  z-index: 3;
  padding-bottom: 0;
  pointer-events: auto;
}

.version-banner {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  padding: 9px 10px 9px 16px;
  color: #253858;
  font-size: 16px;
  line-height: 24px;
  background: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 6px;
  pointer-events: auto;
}

.version-banner-content {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
}

.version-banner-primary {
  font-weight: 600;
}

.version-banner-secondary {
  color: #606f7b;
}

.version-banner-link {
  position: relative;
  z-index: 1;
  color: inherit;
  font-weight: 400;
  text-decoration-line: underline;
  text-decoration-color: #8c9aa5;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  cursor: pointer;
  pointer-events: auto;
}

.version-banner-link:hover,
.version-banner-link:focus-visible {
  color: var(--theme-color);
  text-decoration-color: currentcolor;
}

.version-banner-link:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--theme-color);
  outline-offset: 2px;
}

.version-banner-close {
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: 12px;
  padding: 0;
  color: #606466;
  background: transparent;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  pointer-events: auto;
}

.version-banner-close:hover {
  color: var(--theme-color);
  background: rgb(255 255 255 / 65%);
}

.version-banner-close:focus-visible {
  outline: 2px solid var(--theme-color);
  outline-offset: 1px;
}

.version-banner-close svg {
  width: 16px;
  height: 16px;
  fill: currentcolor;
}

@media (max-width: 960px) {
  .version-banner {
    align-items: flex-start;
    padding-left: 12px;
  }

  .version-banner-content {
    white-space: normal;
  }

  .version-banner-close {
    margin-left: 8px;
  }
}
</style>
