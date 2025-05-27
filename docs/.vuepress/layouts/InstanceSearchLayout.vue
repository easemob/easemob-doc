<template>
  <navbar />
  <ClientOnly>
    <ais-instant-search
      index-name="im-beta-easemob"
      :search-client="searchClient"
      :initial-ui-state="initialUiState"
    >
      <ais-configure
        :hitsPerPage="10"
        :maxValuesPerFacet="22"
        :filters="filter"
        :attributesToSnippet="[
          'hierarchy.lvl1:20',
          'hierarchy.lvl2:20',
          'hierarchy.lvl3:20',
          'hierarchy.lvl4:20',
          'content:150'
        ]"
      />
      <div class="search-box-container">
        <div class="search-container">
          <ais-search-box
            placeholder="热门搜索: 登录、消息扩展"
            show-loading-indicator
          />
          <div class="search-category">
            <ais-refinement-list v-show="false" attribute="type" />
          </div>
          <ais-state-results>
            <template
              v-slot="{ state: { query }, results: { nbHits }, status }"
            >
              <el-tabs class="search-tabs" :model-value="activeCategoryType">
                <el-tab-pane name="product" lazy="true">
                  <template #label>
                    <ais-clear-refinements
                      :included-attributes="includeAttributes"
                    >
                      <template v-slot="{ canRefine, refine, createURL }">
                        <div
                          :class="{
                            'ais-tab-item': true,
                            'ais-tab-item--active':
                              activeCategoryType === 'product'
                          }"
                          @click="handleClick({ name: 'product', refine })"
                        >
                          产品介绍
                        </div>
                      </template>
                    </ais-clear-refinements>
                  </template>
                  <ais-refinement-list
                    attribute="category"
                    :limit="100"
                    :transform-items="filterCategories"
                  >
                    <template v-slot:item="{ item, refine }">
                      <div
                        :class="{
                          'refinement-list-item': true,
                          'refinement-list-item--selected': item.isRefined
                        }"
                        @click="refine(item.value)"
                      >
                        {{ categoryMap[item.label] }}
                      </div>
                    </template>
                  </ais-refinement-list>
                  <ais-hits v-loading="status === 'stalled'">
                    <template v-slot:item="{ item }">
                      <p>
                        <a :href="item.url" target="_blank">
                          <ais-highlight
                            attribute="hierarchy.lvl0"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl1"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl1"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl2"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl2"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl3"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl3"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl4"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl4"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl5"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl5"
                            :hit="item"
                          />
                        </a>
                      </p>
                      <div class="content-snippet">
                        <ais-snippet
                          style="font-size: 14px"
                          attribute="content"
                          :hit="item"
                        />
                      </div>
                    </template>
                  </ais-hits>
                </el-tab-pane>

                <el-tab-pane name="sdk">
                  <template #label>
                    <ais-clear-refinements
                      :included-attributes="includeAttributes"
                    >
                      <template v-slot="{ canRefine, refine, createURL }">
                        <div
                          :class="{
                            'ais-tab-item': true,
                            'ais-tab-item--active': activeCategoryType === 'sdk'
                          }"
                          @click="handleClick({ name: 'sdk', refine })"
                        >
                          SDK & REST 集成
                        </div>
                      </template>
                    </ais-clear-refinements>
                  </template>
                  <ais-refinement-list
                    attribute="category"
                    :limit="100"
                    :transform-items="filterCategories"
                  >
                    <template v-slot:item="{ item, refine }">
                      <div
                        :class="{
                          'refinement-list-item': true,
                          'refinement-list-item--selected': item.isRefined
                        }"
                        @click="refine(item.value)"
                      >
                        {{ categoryMap[item.label] }}
                      </div>
                    </template>
                  </ais-refinement-list>
                  <ais-hits v-loading="status === 'stalled'">
                    <template v-slot:item="{ item }">
                      <p>
                        <a :href="item.url" target="_blank">
                          <ais-highlight
                            attribute="hierarchy.lvl0"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl1"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl1"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl2"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl2"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl3"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl3"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl4"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl4"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl5"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl5"
                            :hit="item"
                          />
                        </a>
                      </p>
                      <div class="content-snippet">
                        <ais-snippet
                          style="font-size: 14px"
                          attribute="content"
                          :hit="item"
                        />
                      </div>
                    </template>
                  </ais-hits>
                </el-tab-pane>
                <el-tab-pane name="uikit">
                  <template #label>
                    <ais-clear-refinements
                      :included-attributes="includeAttributes"
                    >
                      <template v-slot="{ canRefine, refine, createURL }">
                        <div
                          :class="{
                            'ais-tab-item': true,
                            'ais-tab-item--active':
                              activeCategoryType === 'uikit'
                          }"
                          @click="handleClick({ name: 'uikit', refine })"
                        >
                          UIKit 集成
                        </div>
                      </template>
                    </ais-clear-refinements>
                  </template>
                  <ais-refinement-list
                    attribute="category"
                    :limit="100"
                    :transform-items="filterCategories"
                  >
                    <template v-slot:item="{ item, refine }">
                      <div
                        :class="{
                          'refinement-list-item': true,
                          'refinement-list-item--selected': item.isRefined
                        }"
                        @click="refine(item.value)"
                      >
                        {{ categoryMap[item.label] }}
                      </div>
                    </template>
                  </ais-refinement-list>
                  <ais-hits v-loading="status === 'stalled'">
                    <template v-slot:item="{ item }">
                      <p>
                        <a :href="item.url" target="_blank">
                          <ais-highlight
                            attribute="hierarchy.lvl0"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl1"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl1"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl2"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl2"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl3"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl3"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl4"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl4"
                            :hit="item"
                          />
                          <span v-if="item.hierarchy.lvl5"> > </span>
                          <ais-highlight
                            attribute="hierarchy.lvl5"
                            :hit="item"
                          />
                        </a>
                      </p>
                      <div class="content-snippet">
                        <ais-snippet
                          style="font-size: 14px"
                          attribute="content"
                          :hit="item"
                        />
                      </div>
                    </template>
                  </ais-hits>
                </el-tab-pane>
              </el-tabs>

              <div v-if="nbHits === 0">
                <div class="no-results">
                  <p>
                    抱歉，对于搜索词“**{{ query }}**”，我们没有找到任何结果。
                  </p>
                </div>
              </div>
              <div v-else></div>
            </template>
          </ais-state-results>
          <ais-pagination style="margin-top: 1em" />
        </div>
      </div>
    </ais-instant-search>
  </ClientOnly>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import { liteClient as algoliasearch } from "algoliasearch/lite";

import { useRoute } from "vue-router";

const sdkCategoryMap = {
  "Andorid 集成文档": "Android",
  "iOS 集成文档": "iOS",
  "Web 集成文档": "Web",
  "HarmonyOS 集成文档": "HarmonyOS",
  小程序集成文档: "小程序",
  "Flutter 集成文档": "Flutter",
  "React Native 集成文档": "React Native",
  "Windows 集成文档": "Windows",
  "Unity 集成文档": "Unity",
  "REST API": "REST API"
};

const uikitCategoryMap = {
  "UIKit-Andorid 集成文档": "Android",
  "UIKit-iOS 集成文档": "iOS",
  "UIKit-Web 集成文档": "Web",
  "UIKit-HarmonyOS 集成文档": "HarmonyOS",
  "UIKit-Flutter 集成文档": "Flutter",
  "UIKit-React Native 集成文档": "React Native",
  "UIKit-uniapp": "Uniapp"
};

const productCategoryMap = {
  产品介绍: "产品介绍",
  内容审核: "内容审核",
  solution_common: "常见方案",
  即时推送: "即时推送",
  "AI 集成": "AI 集成"
};

const categoryMap = {
  ...sdkCategoryMap,
  ...uikitCategoryMap,
  ...productCategoryMap
};

const productFilters =
  "category:'产品介绍' OR category:'即时推送' OR category:'内容审核' OR category:'AI 集成' OR category:'solution_common1'";

const sdkFilters =
  "category:'Andorid 集成文档' OR category:'iOS 集成文档' OR category:'Web 集成文档' OR category:'HarmonyOS 集成文档' OR category:'小程序集成文档' OR category:'Flutter 集成文档' OR category:'React Native 集成文档' OR category:'Windows 集成文档' OR category:'Unity 集成文档' OR category:'REST API'";

const uikitFilters =
  "category:'UIKit-Andorid 集成文档' OR category:'UIKit-iOS 集成文档' OR category:'UIKit-Web 集成文档' OR category:'UIKit-HarmonyOS 集成文档' OR category:'UIKit-Flutter 集成文档' OR category:'UIKit-React Native 集成文档' OR category:'UIKit-uniapp'";

export default {
  name: "InstanceSearchLayout",
  components: {
    Navbar
  },
  computed: {
    filter() {
      if (this.activeCategoryType === "product") {
        return productFilters;
      } else if (this.activeCategoryType === "uikit") {
        return uikitFilters;
      } else {
        return sdkFilters;
      }
    },
    fixedCategories() {
      if (this.activeCategoryType === "product") {
        return this.productCategories;
      } else if (this.activeCategoryType === "uikit") {
        return this.uikitCategories;
      } else {
        return this.sdkCategories;
      }
    }
  },
  data() {
    return {
      categoryMap,
      searchClient: algoliasearch(
        "5K8UTB3JVE",
        "df9e938d06f6531ce8dd8de71f907f0d"
      ),
      initialUiState: {
        ["im-beta-easemob"]: {
          query: useRoute().query.query || "IM",
          refinementList: {
            type: ["content"],
            category: categoryMap[this.$route.query.s]
              ? [this.$route.query.s]
              : []
          }
        }
      },
      includeAttributes: ["category"],
      activeCategoryType: "product",
      sdkCategories: Object.keys(sdkCategoryMap),
      uikitCategories: Object.keys(uikitCategoryMap),
      productCategories: Object.keys(productCategoryMap),
      snippet: [
        "hierarchy.lvl1:20",
        "hierarchy.lvl2:20",
        "hierarchy.lvl3:20",
        "hierarchy.lvl4:20",
        "hierarchy.lvl5:20",
        "hierarchy.lvl6:20",
        "content:50"
      ]
    };
  },
  created() {
    this.activeCategoryType = this.getCategoryTypeByCategoryItem(
      this.$route.query.s
    );
  },
  methods: {
    filterCategories(items) {
      let filteredItems = items
        .filter((item) => this.fixedCategories.includes(item.label))
        .sort(
          (a, b) =>
            this.fixedCategories.indexOf(a.label) -
            this.fixedCategories.indexOf(b.label)
        );
      return filteredItems;
    },
    handleClick({ name, refine }) {
      if (this.activeCategoryType === name) {
        return;
      }
      refine();
      setTimeout(() => {
        this.activeCategoryType = name;
      }, 20);
    },
    getCategoryTypeByCategoryItem(categoryItem) {
      if (this.sdkCategories.includes(categoryItem)) {
        return "sdk";
      } else if (this.uikitCategories.includes(categoryItem)) {
        return "uikit";
      } else {
        return "product";
      }
    }
  }
};
</script>

<style>
body {
  height: 100%;
}

.ais-Hits-item a {
  color: #242f3d;
}

.ais-Hits-item a:hover {
  color: var(--theme-color);
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

.search-box-container {
  display: flex;
  font-family: sans-serif;
  padding: 1em;
  max-width: 1080px;
  margin: 75px auto 20px;
  padding: 2em;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  justify-content: center;
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

/* 分类项的基础样式 */
.refinement-list-item {
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 15px;
  font-weight: 500;
  color: #242f3d; /* 非active状态的文本颜色 */
  background-color: #f7fafc; /* 非active状态的背景色 */
  user-select: none;
  margin: 0 15px 10px 0;
}

/* 悬停效果 */
.refinement-list-item:hover {
  background-color: var(--theme-color); /* 悬停时的背景色 */
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
/* active状态的样式 */
.refinement-list-item--selected {
  background-color: var(--theme-color); /* active状态的背景色 */
  color: #ffffff; /* active状态的文本颜色 */
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
