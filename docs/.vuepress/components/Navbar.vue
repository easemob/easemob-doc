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
          <div class="search-icon">
            <svg
              width="20"
              height="20"
              class="DocSearch-Search-Icon"
              viewBox="0 0 20 20"
            >
              <path
                d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                stroke="currentColor"
                fill="none"
                fill-rule="evenodd"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
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
  padding: 0 0.8em;
  border: 1px solid var(--border-color, rgba(230, 249, 255, 0.15));
  cursor: pointer;
  transition: all 0.3s ease;
  width: 16.25rem;
  height: 32px;
}

.search-box:hover {
  border-color: var(--theme-color);
}

.search-box:hover .search-icon {
  color: var(--theme-color);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
}

.search-input {
  user-select: none;
  background-color: transparent;
  font-weight: 500;
  color: var(--text-color-light, #999);
  font-size: 14px;
  width: 50px;
  margin-left: 0.4em;
  cursor: pointer;
  white-space: nowrap;
}

.search-input::placeholder {
  color: #a0aec0;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-color, #303d4e);
  font-size: 14px;
  transition: color 0.3s;
  width: 18px;
  flex-shrink: 0;
}

.search-icon:hover {
  color: var(--theme-color);
}

.iconfont {
  font-size: 14px;
}

.extra-link {
  width: 4.625rem;
  height: 32px;
  color: var(--theme-color);
  flex-shrink: 0;
}

.extra-link.is-underline:hover:after {
  border-bottom: 0;
}

/* VuePress Theme Hope 官方移动端断点 - 平板端 (≤1024px) */
@media (max-width: 1024px) {
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
@media (max-width: 768px) {
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
