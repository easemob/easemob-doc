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
  web: 'https://doc.easemob.com/v4/web/beginner_guide.html'
}

const pageData = usePageData()
const isSidebarMenuPage = computed(() => pageData.value.path === '/breadcrumb/menu.html')
const versionBanner = ref<HTMLElement | null>(null)
const versionBannerWidth = ref('100%')
const isReady = ref(false)
const isDismissed = ref(false)
let bannerResizeFrame = 0
let bannerResizeTimer = 0

const currentPlatform = computed(() => {
  const match = pageData.value.path.match(
    /^\/document\/(android|ios|web)(?:\/|$)/
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
        <p class="version-banner-intro">
          <strong class="version-banner-primary">V5 SDK 架构焕新</strong>，集成更轻松、数据管理更高效；<span class="version-banner-secondary">V4.x 持续维护中，<a
            class="version-banner-link"
            :href="v4DocumentLink"
            target="_self"
            @click="openV4Document"
          >查看 V4.x 文档</a>。</span>
        </p>
        <p class="version-banner-notice">
          <span class="version-banner-icon" aria-hidden="true">ℹ️</span>
          <span>V5 SDK 依赖新版数据同步通道，使用前请确认应用所在数据中心/集群是否已支持：</span>
        </p>
        <ul class="version-banner-status-list">
          <li class="version-banner-status">
            <span class="version-banner-icon" aria-hidden="true">✅</span>
            <span><strong>已支持：</strong>国内 1 区、国内 2 区、国内 VIP 区、新加坡 1 区</span>
          </li>
          <li class="version-banner-status">
            <span class="version-banner-icon" aria-hidden="true">🕒</span>
            <span><strong>即将支持：</strong>德国 2 区、美国 1 区（急需上线建议用 V4.x SDK，V5 SDK 支持具体时间请咨询商务）</span>
          </li>
        </ul>
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

  <ThemePageTitle v-if="!isSidebarMenuPage" />
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
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  padding: 12px 10px 12px 16px;
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
}

.version-banner-intro,
.version-banner-notice {
  margin: 0;
}

.version-banner-notice {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  margin-top: 8px;
}

.version-banner-status-list {
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.version-banner-status {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.version-banner-icon {
  flex: 0 0 20px;
  width: 20px;
  font-family: "Segoe UI Emoji", "Apple Color Emoji", sans-serif;
  font-size: 15px;
  line-height: 24px;
  text-align: center;
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
    padding-left: 12px;
  }

  .version-banner-close {
    margin-left: 8px;
  }
}
</style>
