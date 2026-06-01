<template>
  <navbar />
  <ClientOnly>
    <Suspense>
      <SearchContent />
      <template #fallback>
        <div class="search-loading">
          <div class="search-loading-spinner"></div>
          <p>搜索加载中...</p>
        </div>
      </template>
    </Suspense>
  </ClientOnly>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import { defineAsyncComponent } from "vue";

export default {
  name: "InstanceSearchLayout",
  components: {
    Navbar,
    SearchContent: defineAsyncComponent(() =>
      import("../components/SearchContent.vue")
    )
  }
};
</script>

<style>
.search-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #4a5568;
  font-size: 16px;
}

.search-loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--theme-color, #409eff);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

body {
  height: 100%;
}

.ais-Hits-item a {
  color: #242f3d;
}

.ais-Hits-item a:hover {
  color: var(--theme-color);
}

.ais-SearchBox {
  width: 100%;
}

.ais-SearchBox-input {
  height: 40px;
}

.ais-SearchBox-input:focus {
  outline: none;
  border-color: var(--theme-color);
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.ais-RefinementList {
  width: 100%;
  margin: 10px 0;
}

.ais-RefinementList-list {
  display: flex;
  flex-flow: row wrap;
}

.ais-Highlight-highlighted,
.ais-Snippet-highlighted {
  background-color: unset !important;
  color: var(--theme-color) !important;
}

.search-box {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
}

.powered-by {
  margin-left: 20px;
  flex-shrink: 0;
}

.search-box-container {
  font-family: sans-serif;
  padding: 1em;
  max-width: 1080px;
  margin: 75px auto 20px;
  padding: 1em;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-category {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-container {
  flex: 7;
}

.ais-Hits-list {
  margin-top: 0;
  margin-bottom: 1em;
}

.ais-Hits-item {
  width: calc(100% - 1rem) !important;
  border-radius: 8px;
}

.ais-HierarchicalMenu-count,
.ais-Menu-count,
.ais-RefinementList-count,
.ais-ToggleRefinement-count {
  margin-left: 0.3em;
}

.content-snippet {
  color: #505e72;
}

.content-snippet .ais-Snippet-highlighted {
  font-size: 14px;
}

.ais-ClearRefinements {
  height: 100%;
}

.refinement-list-item {
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 15px;
  font-weight: 500;
  color: #242f3d;
  background-color: #f7fafc;
  user-select: none;
  margin: 0 15px 10px 0;
}

.refinement-list-item:hover {
  background-color: var(--theme-color);
  color: #fff;
}

.ais-Pagination-item--selected .ais-Pagination-link {
  background-color: var(--theme-color) !important;
  color: #fff !important;
  border-color: var(--theme-color) !important;
}

.ais-Breadcrumb-link,
.ais-HierarchicalMenu-link,
.ais-Menu-link,
.ais-Pagination-link,
.ais-RatingMenu-link {
  color: var(--theme-color) !important;
}

.refinement-list-item--selected {
  background-color: var(--theme-color);
  color: #ffffff;
}

.search-tabs .el-tabs__item {
  pointer-events: none;
}

.no-results {
  text-align: center;
  color: #4a5568;
  font-size: 1em;
  margin-top: 2em;
  padding: 1.5em;
  border-radius: 0.5em;
}

.no-results p {
  margin-bottom: 0;
  font-weight: 500;
  color: #2d3748;
}

.ais-tab-item {
  color: #303133;
  font-size: 15px !important;
  height: 100%;
  line-height: 40px;
  pointer-events: all;
}

.ais-tab-item--active {
  color: #409eff;
}
</style>
