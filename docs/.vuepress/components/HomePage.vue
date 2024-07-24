<template>
  <HopeHomePage>
    <template #center>
      <div class="main-container">
        <HeroSection />
        <main :ref="containerRef" class="main-content">
          <div class="toc">
            <ClientOnly>
              <el-affix :offset="80">
                <el-anchor
                  :container="containerRef"
                  type="underline"
                  :offset="60"
                >
                  <el-anchor-link
                    v-for="anchorLink in anchorLinks"
                    :key="anchorLink.text"
                    :href="`#${anchorLink.text}`"
                  >
                    {{ anchorLink.text }}
                    <template v-if="anchorLink.children" #sub-link>
                      <el-anchor-link
                        v-for="subLink in anchorLink.children"
                        :key="subLink.text"
                        :href="`#${subLink.text}`"
                      >
                        {{ subLink.text }}
                      </el-anchor-link>
                    </template>
                  </el-anchor-link>
                </el-anchor>
              </el-affix>
            </ClientOnly>
          </div>

          <div class="content">
            <section class="product-section">
              <div class="product-links">
                <template v-for="(item, index) in products" :key="item.text">
                  <el-link
                    :href="item.link"
                    type="primary"
                    class="product-link"
                  >
                    {{ item.text }}
                  </el-link>
                  <span v-if="index < products.length - 1">|</span>
                </template>
              </div>
              <div v-for="s in starter" :id="s.title">
                <h2 class="sdk-start-title">{{ s.title }}</h2>
                <div class="sdk-start-list">
                  <div
                    class="sdk-start-item"
                    v-for="item in s.platform"
                    :key="item.text"
                    @click="goTo(item.link)"
                  >
                    <div class="sdk-start-icon">
                      <img
                        :src="item.icon"
                        alt="Platform Icon"
                        class="platform-icon"
                      />
                      <span class="platform-name">{{ item.text }}</span>
                    </div>
                    <img
                      src="/arrow_right.svg"
                      alt="Arrow icon"
                      class="arrow-icon"
                    />
                  </div>
                </div>
              </div>

              <div
                :id="project.title"
                v-for="project in projects"
                :key="project.title"
              >
                <h2 class="sdk-features-title">{{ project.title }}</h2>
                <div
                  class="sdk-feature-item"
                  v-for="feature in project.features"
                  :key="feature.title"
                  :id="feature.title || null"
                >
                  <div v-if="feature.title" class="sdk-feature-header">
                    <img
                      v-if="feature.icon"
                      :src="feature.icon"
                      class="feature-icon"
                    />
                    <h3 v-if="feature.title" class="feature-title">
                      {{ feature.title }}
                    </h3>
                  </div>
                  <div class="sdk-feature-links">
                    <template
                      v-for="context in feature.contexts"
                      :key="context.text"
                    >
                      <a
                        v-if="context.link"
                        class="feature-link"
                        type="primary"
                        :href="context.link"
                      >
                        {{ context.text }}
                      </a>
                      <ClientOnly v-else>
                        <el-popover placement="bottom-start" :width="436">
                          <template #reference>
                            <a class="feature-link" type="primary">
                              {{ context.text }}
                            </a>
                          </template>
                          <template #default>
                            <CardMenu
                              :title="context.text"
                              :sdks="context.sdks"
                              :desc="context.desc"
                            />
                          </template>
                        </el-popover>
                      </ClientOnly>
                    </template>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </template>
  </HopeHomePage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HopeHomePage from 'vuepress-theme-hope/components/HomePage.js'
import HeroSection from './CustomHero.vue'
import CardMenu from './CardMenu.vue'
import { usePageFrontmatter } from '@vuepress/client'
const frontmatter = usePageFrontmatter()
const router = useRouter()
const products = frontmatter.value.products || []
const starter = frontmatter.value.starter || []
const projects = frontmatter.value.projects || []
const containerRef = ref<HTMLElement | null>(null)

const goTo = (path: string) => {
  router.push(path)
}

interface AnchorLink {
  text: string
  children?: AnchorLink[]
}

const buildAnchorLink = () => {
  const values: AnchorLink[] = []
  starter.forEach((s) => {
    values.push({ text: s.title })
  })
  projects.forEach((project) => {
    const children = []
    project.features.forEach((feature) => {
      if (feature.title) {
        children.push({ text: feature.title })
      }
    })
    values.push({ text: project.title, children })
  })
  return values
}

const anchorLinks = buildAnchorLink()
</script>

<style scoped>
.main-container {
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.main-content {
  align-self: center;
  margin-top: 16px;
  width: 100%;
  max-width: 772px;
  position: relative;
}

@media (max-width: 991px) {
  .main-content {
    max-width: 95%;
  }
}

.content {
  width: 100%;
}

.toc {
  margin-top: 20px;
  position: absolute;
  top: 0;
  left: -200px;
  visibility: visible;
  width: unset;
  height: unset;
}

@media (max-width: 1200px) {
  .toc {
    visibility: hidden;
    width: 0;
    height: 0;
  }
}

.columns {
  gap: 20px;
  display: flex;
  justify-content: center;
}

.sdk-features {
  justify-content: flex-end;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  gap: 20px;
  white-space: nowrap;
  padding: 10px;
}

@media (max-width: 991px) {
  .sdk-features {
    white-space: initial;
  }
}

.feature-title {
  font-family: PingFang SC, sans-serif;
  flex-grow: 1;
  font-size: 16px;
  flex-basis: auto;
}

.sdk-list {
  display: flex;
  padding-left: 12px;
  flex-direction: column;
  font-size: 14px;
  color: #808080;
  white-space: nowrap;
}

@media (max-width: 991px) {
  .sdk-list {
    white-space: initial;
  }
}

.sdk-item {
  font-family: PingFang SC, sans-serif;
  align-items: start;
  border-left: 2px solid rgba(204, 204, 204, 1);
  background-color: #fff;
  justify-content: center;
  padding: 10px 12px;
}

@media (max-width: 991px) {
  .sdk-item {
    padding-right: 20px;
    white-space: initial;
  }
}

.sdk-item.active {
  border-left-color: rgba(9, 109, 217, 1);
  color: #096dd9;
  padding: 9px 12px;
}

.column:last-child {
  display: flex;
  flex-direction: column;
  line-height: normal;
  width: 81%;
  margin-left: 20px;
}

@media (max-width: 991px) {
  .column:last-child {
    width: 100%;
  }
}

.product-section {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

@media (max-width: 991px) {
  .product-section {
    max-width: 100%;
    margin-top: 40px;
  }
}

.product-links {
  justify-content: space-between;
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #096dd9;
  font-weight: 400;
  white-space: nowrap;
  padding: 8px;
}

@media (max-width: 991px) {
  .product-links {
    max-width: 100%;
    flex-wrap: wrap;
    white-space: initial;
  }
}

.product-link {
  font-family: PingFang SC, sans-serif;
}

.sdk-start-title {
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  margin-top: 20px;
  color: #1a1a1a;
  white-space: nowrap;
  justify-content: center;
  padding: 8px 0;
  font: 600 20px PingFang SC, sans-serif;
}

@media (max-width: 991px) {
  .sdk-start-title {
    max-width: 100%;
    white-space: initial;
  }
}

.sdk-start-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
  gap: 12px;
  font-size: 14px;
  color: #000;
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 991px) {
  .sdk-start-list {
    flex-wrap: wrap;
    white-space: initial;
  }
}

.sdk-start-item {
  border-radius: 25px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(230, 230, 230, 1);
  background-color: #fff;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  padding: 6px 12px;
  width: 157px;
}

.sdk-start-item:hover {
  cursor: pointer;
  background: #e1f3d8;
}

@media (max-width: 991px) {
  .sdk-start-item {
    white-space: initial;
  }
}

.sdk-start-icon {
  display: flex;
  gap: 4px;
}

@media (max-width: 991px) {
  .sdk-start-icon {
    white-space: initial;
  }
}

.platform-icon {
  aspect-ratio: 1;
  object-fit: contain;
  width: 28px;
}

.platform-name {
  font-family: PingFang SC, sans-serif;
  margin: auto 0;
}

.arrow-icon {
  aspect-ratio: 1;
  object-fit: contain;
  width: 16px;
  margin: auto 0;
}

.sdk-features-title {
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  margin-top: 36px;
  color: #1a1a1a;
  white-space: nowrap;
  justify-content: center;
  padding: 8px 0;
  font: 600 20px PingFang SC, sans-serif;
}

@media (max-width: 991px) {
  .sdk-features-title {
    max-width: 100%;
    white-space: initial;
  }
}

.sdk-feature-item {
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(230, 230, 230, 1);
  display: flex;
  margin-top: 16px;
  flex-direction: column;
  font-size: 14px;
  color: #096dd9;
  font-weight: 400;
  white-space: nowrap;
  padding: 16px;
}

@media (max-width: 991px) {
  .sdk-feature-item {
    max-width: 100%;
    white-space: initial;
  }
}

.sdk-feature-header {
  align-self: start;
  display: flex;
  gap: 2px;
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 600;
}

@media (max-width: 991px) {
  .sdk-feature-header {
    white-space: initial;
  }
}

.feature-icon {
  aspect-ratio: 1;
  object-fit: contain;
  width: 20px;
}

.feature-title {
  font-family: PingFang SC, sans-serif;
  margin: 0;
}

.sdk-feature-links {
  align-content: flex-start;
  flex-wrap: wrap;
  display: flex;
  margin-top: 16px;
  gap: 20px;
  padding: 8px 0;
}

@media (max-width: 991px) {
  .sdk-feature-links {
    max-width: 100%;
    white-space: initial;
  }
}

.feature-link {
  font-family: PingFang SC, sans-serif;
  text-decoration: underline;
  min-width: 120px;
  cursor: pointer;
}

.feature-link-group {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

@media (max-width: 991px) {
  .feature-link-group {
    white-space: initial;
  }
}
</style>
