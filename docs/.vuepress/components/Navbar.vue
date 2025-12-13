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
              width="14"
              height="14"
              class="DocSearch-Search-Icon"
              viewBox="0 0 14 14"
            >
              <path
                d="M6.65869 1.08154C8.1351 1.05413 9.46173 1.56016 10.6372 2.59912C11.758 3.68352 12.3612 4.96398 12.4478 6.43994C12.5343 7.91594 12.0816 9.26005 11.0884 10.4722H11.0874L12.7964 12.1812C12.8783 12.2724 12.9194 12.3751 12.9194 12.4888C12.9194 12.6024 12.8761 12.7027 12.7896 12.7896C12.703 12.8764 12.6027 12.9196 12.4888 12.9194C12.3748 12.9191 12.2721 12.878 12.1812 12.7964L10.4722 11.0884C9.26034 12.0813 7.9162 12.5343 6.43994 12.4478C4.96353 12.3611 3.68332 11.7571 2.59912 10.6362C1.56019 9.46083 1.05413 8.135 1.08154 6.65869C1.10899 5.18242 1.66508 3.8794 2.74951 2.74951C3.8794 1.66515 5.18243 1.10904 6.65869 1.08154ZM6.76807 1.95654C5.40116 1.99306 4.26661 2.46262 3.36475 3.36475C2.46286 4.26691 1.99331 5.40143 1.95654 6.76807C1.99299 8.13498 2.46263 9.26951 3.36475 10.1714C4.2669 11.0732 5.40146 11.5428 6.76807 11.5796C8.13513 11.5431 9.27042 11.0736 10.1724 10.1714C11.0741 9.26924 11.5429 8.13462 11.5796 6.76807C11.5431 5.40121 11.0745 4.26659 10.1724 3.36475C9.27013 2.46284 8.13483 1.99328 6.76807 1.95654Z"
                stroke="currentColor"
                fill="none"
                fill-rule="evenodd"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="0.2"
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
  padding: 0 0.75em;
  border: 1px solid #DCE2E6;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 14.625rem;
  height: 1.875rem;
}

.search-box:hover {
  border-color: var(--theme-color);

  .search-input {
    color: var(--theme-color);
  }
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
  color: #A8ABB2;
  font-size: 14px;
  width: fit-content;
  margin-left: 6px;
  cursor: pointer;
  white-space: nowrap;
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

  &:hover {
    color: var(--theme-color);
  }
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
@media (max-width: 1240px) {
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
@media (max-width: 1160px) {
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
