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
          <div class="search-input">搜索关键字</div>
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
export default {
  methods: {
    handleSearch() {
      const s = document.getElementById("meta-category")?.innerText;
      const url = s ? "/form/search.html?s=" + s : "/form/search.html";
      window.open(url, "_blank");
    }
  }
};
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8; /* 背景色 */
  border-radius: 20px; /* 圆角 */
  padding: 0 0.8em; /* 缩小内边距 */
  border: 1px solid rgba(230, 249, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s;
  height: 36px;
}

.search-box:hover {
  border: 1px solid var(--theme-color);
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
  color: #999; /* 字体颜色 */
  font-size: 14px; /* 缩小字体大小 */
  width: 100px; /* 缩小输入框宽度 */
  margin-left: 0.4em; /* 缩小间距 */
  cursor: pointer;
}

.search-input::placeholder {
  color: #a0aec0; /* 占位符颜色 */
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #303d4e; /* 图标颜色 */
  font-size: 14px; /* 缩小图标大小 */
  transition: color 0.3s;
  width: 18px;
}

.search-icon:hover {
  color: var(--theme-color); /* 悬停时的图标颜色 */
}

.iconfont {
  font-size: 14px; /* 缩小图标大小 */
}

/* 小屏幕隐藏输入框 */
@media (max-width: 900px) {
  .search-input {
    display: none;
  }
}


</style>

<style>
.back-to-top {
  bottom: 1rem;
  width: 50px;
  height: 50px;
  border-radius: 25px;
}
</style>