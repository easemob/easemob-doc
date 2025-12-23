<script setup>
import Navbar from "vuepress-theme-hope/modules/navbar/components/Navbar.js";
import { useThemeLocaleData } from "vuepress-theme-hope/composables/index";

const themeData = useThemeLocaleData();
const extraNavList = themeData.value.extra_nav || [];
</script>

<template>
  <Navbar>
    <template #endBefore>
      <!-- <Docsearch /> -->
      <div class="search-box" @click="handleSearch">
        <div class="search-input-wrapper">
          <div class="search-icon"></div>
          <div class="search-input">搜索关键词</div>
        </div>
      </div>
      
      <el-link
        class="extra-link"
        :type="item.type"
        v-for="item in extraNavList"
        :key="item.text"
        :href="item.link"
        >{{ item.text }}
      </el-link>
    </template>
  </Navbar>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
  methods: {
    handleSearch() {
      const s = document.getElementById("meta-category")?.innerText;
      const url = s ? "/form/search.html?s=" + s : "/form/search.html";
      window.open(url, "_blank");
    },
    handleCopyClick(e) {
      if (e.target.className === "header-anchor") {
        setTimeout(() => {
          navigator.clipboard.writeText(window.document.location.href);
        }, 300);
        ElMessage.success("已复制链接");
      } else if (
        e.target.tagName === "CODE" &&
        e.target.parentElement.tagName != "PRE"
      ) {
        navigator.clipboard.writeText(e.target.innerHTML);
        ElMessage.success("已复制");
      }
    }
  },
  mounted() {
    window.addEventListener("click", this.handleCopyClick);
  },
  unmounted() {
    window.removeEventListener("click", this.handleCopyClick);
  }
};
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 6px;
  padding: 0 0.75em;
  border: 1px solid #DCE2E6;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 14.625rem;
  height: 1.875rem;
}

.search-box:hover {
  border-color: var(--theme-color);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
}

.search-input {
  user-select: none;
  background-color: transparent;
  color: #A8ABB2;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  width: fit-content;
  margin-left: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 0.875rem;
  height: 0.875rem;
  background-image: url(/icon-search.svg);
  background-repeat: no-repeat;
  cursor: pointer;
}

.extra-link {
  padding: 0.3125rem 1rem;
  margin: 0 !important;
  color: #606466;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
}

.extra-link {
  padding: 0.3125rem 1rem;
  margin: 0 !important;
  color: #606466;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
}

.extra-link:not(:last-of-type):hover {
  color: var(--theme-color);
}

.extra-link:last-of-type {
  padding: 0.25rem 0.9375rem;
  color: var(--theme-color);
  border-radius: 0.375rem;
  border: 1px solid var(--theme-color);
  background: #ECF8FF;
}

.extra-link:last-of-type:hover {
  color: #fff;
  background: var(--theme-color);
}

.extra-link.is-underline:hover:after {
  border-bottom: 0;
}

/* VuePress Theme Hope 官方移动端断点 - 平板端 (≤1024px) */
@media (max-width: 1380px) {
  .search-box {
    width: 10rem;
  }
  
  .search-input {
    font-size: 13px;
    width: auto;
  }
  
  .extra-link {
    width: auto;
    padding: 0 0.6rem;
  }
}

/* VuePress Theme Hope 官方移动端断点 - 手机端 (≤768px) */
@media (max-width: 1300px) {
  .search-box {
    width: 36px;
    min-width: 36px;
    height: 36px;
    padding: 0;
    justify-content: center;
    border: none;
    background-color: transparent;
  }
  
  .search-input {
    display: none;
  }
  
  .search-input-wrapper {
    width: 100%;
    justify-content: center;
  }
  
  .search-icon {
    width: 18px;
    font-size: 14px;
  }
  
  .extra-link {
    width: auto;
    min-width: auto;
    padding: 0 0.5rem;
    font-size: 13px;
  }
}

/* VuePress Theme Hope 官方移动端断点 - 小屏手机 (≤419px) */
@media (max-width: 419px) {
  .search-box {
    width: 32px;
    min-width: 32px;
    height: 32px;
    border: none;
    background-color: transparent;
  }
  
  .search-icon {
    width: 16px;
    font-size: 13px;
  }
  
  .extra-link {
    padding: 0 0.4rem;
    font-size: 12px;
  }
}
</style>

<style>
.back-to-top {
  bottom: 3rem;
  width: 50px;
  height: 50px;
  border-radius: 25px;
}
</style>
