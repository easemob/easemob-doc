<template>
  <HopeHomePage>
    <template #center>
      <div class="main-container">
        <HeroSection />
        <main :ref="containerRef" class="main-content">
          <div class="content">
            <div class="content-title">用户指南</div>
            <section class="product-section">
              <div v-for="s in starter" :key="s.title" :id="s.title">
                <h2 class="sdk-start-title">{{ s.title }}</h2>
                <div class="sdk-start-desc">{{ s.desc }}</div>
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
                      class="arrow-icon normal"
                    />
                    <img
                      src="/arrow_right_h.svg"
                      alt="Arrow icon"
                      class="arrow-icon high"
                    />
                  </div>
                </div>
              </div>
              <div class="content-title fun">功能</div>
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
                        target="_blank"
                        :href="context.link"
                      >
                        {{ context.text }}
                      </a>
                      <ClientOnly v-else>
                        <el-popover placement="bottom-start" :width="436">
                          <template #reference>
                            <a
                              class="feature-link"
                              type="primary"
                              :href="context.sdks[0].link"
                              target="_blank"
                            >
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import HopeHomePage from "vuepress-theme-hope/components/HomePage.js";
import HeroSection from "./CustomHero.vue";
import CardMenu from "./CardMenu.vue";
import { usePageFrontmatter } from "@vuepress/client";
const frontmatter = usePageFrontmatter();
const router = useRouter();
const starter = frontmatter.value.starter || [];
const projects = frontmatter.value.projects || [];
const containerRef = ref<HTMLElement | null>(null);

const goTo = (path: string) => {
  if (path.indexOf("http") == 0) {
    window.open(path);
  } else {
    router.push(path);
  }
};

interface AnchorLink {
  text: string;
  children?: AnchorLink[];
}

const buildAnchorLink = () => {
  const values: AnchorLink[] = [];
  starter.forEach((s) => {
    values.push({ text: s.title });
  });
  projects.forEach((project) => {
    const children = [];
    project.features.forEach((feature) => {
      if (feature.title) {
        children.push({ text: feature.title });
      }
    });
    values.push({ text: project.title, children });
  });
  return values;
};
</script>

<style scoped>
.main-container {
  border-radius: 4px;
  background-color: #FAFDFF;
  display: flex;
  flex-direction: column;
}

.main-content {
  align-self: center;
  margin-top: 20px;
  width: 95%;
  max-width: 1200px;
  position: relative;
}

.content {
  width: 100%;
}

.content-title {
  margin-bottom: 24px;
  color: #000;
  text-align: justify;
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: 40px;

  &.fun {
    margin: 8px 0 0 0;
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

.sdk-start-title {
  margin: 0;
  color: #242f3d;
  white-space: nowrap;
  justify-content: center;
  padding: 0;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  border-bottom: 0;
}

@media (max-width: 991px) {
  .sdk-start-title {
    max-width: 100%;
    white-space: initial;
  }
}

.sdk-start-desc {
  margin-top: 8px;
  color: #505e72;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.sdk-start-list {
  display: flex;
  flex-wrap: wrap;
  margin: 1.5rem 0 3rem 0;
  gap: 1.5rem;
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
  display: flex;
  align-items: center;
  border-radius: 0.75rem;
  border: 1px solid #ebf0f9;
  background-color: #fff;
  padding: 0.8125rem 1.5rem;
  width: 14.4rem;
  transform: translateZ(0);
  backface-visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.sdk-start-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 157, 255, 0.02) 0%, rgba(0, 160, 250, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sdk-start-item:hover {
  cursor: pointer;
  border-color: #009dff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 157, 255, 0.15);
}

.sdk-start-item:hover::before {
  opacity: 1;
}

.sdk-start-item:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 157, 255, 0.1);
}

@media (max-width: 991px) {
  .sdk-start-item {
    white-space: initial;
  }
}

.sdk-start-icon {
  display: flex;
  align-items: center;
  width: calc(100% - 20px);
}

@media (max-width: 991px) {
  .sdk-start-icon {
    white-space: initial;
  }
}

.platform-icon {
  aspect-ratio: 1;
  object-fit: contain;
  width: 24px;
  height: 24px;
}


.platform-name {
  color: #303233;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin: 0 8px;
  width: calc(100% - 40px);
  transition: color 0.3s ease;
  position: relative;
  z-index: 1;
}

.sdk-start-item:hover .platform-name {
  color: #009dff;
}

.arrow-icon {
  aspect-ratio: 1;
  object-fit: contain;
  width: 20px;
  margin: auto 0;
  color: #dce2e6;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  position: relative;
  z-index: 1;
}

.arrow-icon.high {
  display: none;
}

.sdk-start-item:hover .arrow-icon.normal {
  display: none;
}

.sdk-start-item:hover .arrow-icon.high {
  display: block;
  transform: translateX(2px);
}

.sdk-features-title {
  width: 100%;
  padding: 0.75rem 0;
  margin: 2.25rem 0;
  color: #242f3d;
  white-space: nowrap;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  border-bottom: 1px solid rgba(230, 230, 230, 1);
}

@media (max-width: 991px) {
  .sdk-features-title {
    max-width: 100%;
    white-space: initial;
  }
}

.sdk-feature-item {
  display: flex;
  margin-top: 28px;
  font-size: 14px;
  color: #096dd9;
  font-weight: 400;
  white-space: nowrap;
}

@media (max-width: 991px) {
  .sdk-feature-item {
    max-width: 100%;
    white-space: initial;
  }
}

.sdk-feature-header {
  display: flex;
  align-self: start;
  flex-shrink: 0;
  min-width: 142px;
  margin-right: 60px;
  gap: 2px;
  font-size: 16px;
  color: #303233;
  font-weight: 600;
}

@media (max-width: 991px) {
  .sdk-feature-header {
    white-space: initial;
  }
}

.feature-icon {
  display: none;
  aspect-ratio: 1;
  object-fit: contain;
  width: 20px;
}

.feature-title {
  padding: 8px 0;
  font-weight: 600;
  font-size: 16px;
  font-style: normal;
  line-height: normal;
  margin: 0;
}

.sdk-feature-links {
  align-content: flex-start;
  flex-wrap: wrap;
  display: flex;
  gap: 8px 100px;
}

@media (max-width: 991px) {
  .sdk-feature-links {
    max-width: 100%;
    white-space: initial;
  }
}

.feature-link {
  padding: 8px 8px 8px 0;
  color: #505e72;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: underline;
  text-underline-offset: 4px;
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