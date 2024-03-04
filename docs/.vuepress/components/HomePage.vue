<template>
  <HopeHomePage>
    <template #center>
      <div class="feature-panel">
        <div class="feature-wrapper">
          <div
            class="feature-item"
            v-for="product in products"
            :key="product.title"
          >
            <h3>{{ product.title }}</h3>
            <div class="feature-link-wrapper">
              <a
                v-for="link in product.links"
                :key="link.link"
                class="feature-link-item"
                :href="link.link"
              >
                <img
                  width="20"
                  height="20"
                  v-if="link.icon"
                  :src="link.icon"
                  alt="Platform"
                />
                <span v-if="link.text"> {{ link.text }} </span>
              </a>
            </div>
          </div>
        </div>

        <div class="feature-wrapper">
          <div
            v-for="project in projects"
            :key="project.title"
            class="feature-item"
            style="flex-basis: 100%"
          >
            <h3>{{ project.title }}</h3>
            <p v-if="project.desc">{{ project.desc }}</p>
            <template v-for="info in project.info" :key="info.link">
              <h4 v-if="info.name">{{ info.name }}</h4>
              <div class="feature-link-wrapper">
                <ClientOnly>
                  <template v-for="link in info.links" :key="link.text">
                    <a
                      v-if="!link.children"
                      class="feature-link-item"
                      :href="link.link"
                    >
                      <img
                        width="20"
                        height="20"
                        v-if="link.icon"
                        :src="link.icon"
                        alt="Platform"
                      />
                      <span v-if="link.text">
                        {{ link.text }}
                      </span>
                    </a>

                    <el-popover
                      v-else
                      placement="top"
                      :title="link.text"
                      :width="260"
                      trigger="click"
                    >
                      <template #reference>
                        <a class="feature-link-item" :href="link.link">
                          <img
                            width="20"
                            height="20"
                            v-if="link.icon"
                            :src="link.icon"
                            alt="Platform"
                          />
                          <span v-if="link.text"> {{ link.text }} </span>
                        </a>
                      </template>
                      <template #default>
                        <div>
                          <div v-if="link.children" class="project-detail">
                            <div class="project-sub-content">
                              <div
                                v-if="link.desc"
                                class="project-sub-content-desc"
                              >
                                {{ link.desc }}
                              </div>
                              <div>
                                <a
                                  class="feature-link-item"
                                  :href="subLink.link"
                                  v-for="subLink in link.children"
                                  :key="subLink.link"
                                >
                                  <img
                                    width="20"
                                    height="20"
                                    v-if="subLink.icon"
                                    :src="subLink.icon"
                                    alt="Platform"
                                  />
                                  <span v-if="subLink.text">
                                    {{ subLink.text }}
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-popover>
                  </template>
                </ClientOnly>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </HopeHomePage>
</template>
<script setup lang="ts">
import HopeHomePage from "vuepress-theme-hope/components/HomePage.js";
import Sidebar from "vuepress-theme-hope/modules/sidebar/components/Sidebar.js";
import { usePageFrontmatter } from "@vuepress/client";
import { useRouter } from "vue-router";

const frontmatter = usePageFrontmatter();
const products = frontmatter.value.products || [];
const projects = frontmatter.value.projects || [];
// const router = useRouter()
// router.push('/product/introduction')
</script>
<style scoped>
.home {
  padding-top: var(--navbar-height);
}

.feature-wrapper {
  justify-content: flex-start;
  border-width: 0 0 1px 0;
  border-color: var(--border-color);
  border-style: solid;
}

@media screen and ((min-width: 1440px)) {
  .feature-item {
    flex-basis: calc(33% - 3rem);
  }
}

.feature-link-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.feature-link-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem 0.5rem 0;
  transition: color 0.2s linear;
  transition: padding 0.2s linear;
}

.feature-link-item:hover {
  color: var(--accent-color);
  padding-top: 0.3rem;
}

.project-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-width: 0 0 1px 0;
  border-color: var(--border-color);
  border-style: solid;
}

.project-detail a {
  padding: 0.5rem 0;
  width: 100%;
  transition: background-color 0.2s linear;
}

.project-detail a:hover {
  background-color: #ddd;
}

.project-sub-content {
  display: flex;
}

.project-sub-content-desc {
  width: 40%;
  margin: 0.5rem;
  padding-right: 0.5rem;
  border-right: 1px solid #ddd;
  color: #ddd;
}
</style>
