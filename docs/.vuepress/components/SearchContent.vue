<template>
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
        <div class="search-box">
          <ais-search-box
            autofocus
            placeholder="热门搜索: 登录、消息扩展"
            show-loading-indicator
          />
          <ais-powered-by class="powered-by" />
        </div>
        <div class="search-category">
          <ais-refinement-list v-show="false" attribute="type" />
        </div>
        <ais-state-results>
          <template
            v-slot="{ state: { query }, results: { nbHits }, status }"
          >
            <el-tabs class="search-tabs" :model-value="activeCategoryType">
              <el-tab-pane
                v-for="tab in tabs"
                :key="tab.name"
                :name="tab.name"
                :lazy="true"
              >
                <template #label>
                  <ais-clear-refinements
                    :included-attributes="includeAttributes"
                  >
                    <template v-slot="{ refine }">
                      <div
                        :class="{
                          'ais-tab-item': true,
                          'ais-tab-item--active': activeCategoryType === tab.name
                        }"
                        @click="handleClick({ name: tab.name, refine })"
                      >
                        {{ tab.label }}
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
                        <template v-for="lvl in hierarchyLevels" :key="lvl">
                          <span v-if="item.hierarchy[lvl] && lvl !== 'lvl0'"> > </span>
                          <ais-highlight
                            v-if="item.hierarchy[lvl]"
                            :attribute="'hierarchy.' + lvl"
                            :hit="item"
                          />
                        </template>
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

            <div v-if="nbHits === 0" class="no-results">
              <p>抱歉，对于搜索词"{{ query }}"，我们没有找到任何结果。</p>
            </div>
          </template>
        </ais-state-results>
        <ais-pagination style="margin-top: 1em" />
      </div>
    </div>
  </ais-instant-search>
</template>

<script>
import { liteClient as algoliasearch } from "algoliasearch/lite";

const sdkCategoryMap = {
  "Android 集成文档": "Android",
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
  "UIKit-Android 集成文档": "Android",
  "UIKit-iOS 集成文档": "iOS",
  "UIKit-Web 集成文档": "Web",
  "UIKit-HarmonyOS 集成文档": "HarmonyOS",
  "UIKit-Flutter 集成文档": "Flutter",
  "UIKit-React Native 集成文档": "React Native",
  "UIKit-uniapp": "Uniapp"
};

const productCategoryMap = {
  产品介绍: "产品功能",
  内容审核: "内容审核",
  常见方案: "常见方案",
  即时推送: "即时推送",
  "使用 MCP 集成": "使用 MCP 集成"
};

const apiReferenceCategoryMap = {
  "Android API参考": "Android",
  "IOS API参考": "IOS",
  "Web API参考": "Web",
  "Harmony API参考": "Harmony",
  "Flutter API参考": "Flutter",
  "React Native API参考": "React Native",
  "Unity and Windows API参考": "Unity and Windows"
};

const categoryMap = {
  ...sdkCategoryMap,
  ...uikitCategoryMap,
  ...productCategoryMap,
  ...apiReferenceCategoryMap
};

function buildFilter(map) {
  return Object.keys(map).map(k => `category:'${k}'`).join(" OR ");
}

const productFilters = buildFilter(productCategoryMap);
const sdkFilters = buildFilter(sdkCategoryMap);
const uikitFilters = buildFilter(uikitCategoryMap);
const apiReferenceFilters = buildFilter(apiReferenceCategoryMap);

const filtersMap = {
  product: productFilters,
  sdk: sdkFilters,
  uikit: uikitFilters,
  "api-reference": apiReferenceFilters
};

const categoriesMap = {
  product: Object.keys(productCategoryMap),
  sdk: Object.keys(sdkCategoryMap),
  uikit: Object.keys(uikitCategoryMap),
  "api-reference": Object.keys(apiReferenceCategoryMap)
};

export default {
  name: "SearchContent",
  computed: {
    filter() {
      return filtersMap[this.activeCategoryType] || sdkFilters;
    },
    fixedCategories() {
      return categoriesMap[this.activeCategoryType] || categoriesMap.sdk;
    }
  },
  data() {
    const route = this.$route;
    const queryParam = route.query.query || "";
    const categoryParam = route.query.s;

    return {
      categoryMap,
      searchClient: algoliasearch(
        "5K8UTB3JVE",
        "df9e938d06f6531ce8dd8de71f907f0d"
      ),
      initialUiState: {
        ["im-beta-easemob"]: {
          query: queryParam,
          refinementList: {
            type: ["content"],
            category: categoryMap[categoryParam] ? [categoryParam] : []
          }
        }
      },
      includeAttributes: ["category"],
      activeCategoryType: "product",
      hierarchyLevels: ["lvl0", "lvl1", "lvl2", "lvl3", "lvl4", "lvl5"],
      tabs: [
        { name: "product", label: "产品介绍" },
        { name: "sdk", label: "SDK & REST 集成" },
        { name: "uikit", label: "UIKit 集成" },
        { name: "api-reference", label: "API参考" }
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
      return items
        .filter((item) => this.fixedCategories.includes(item.label))
        .sort(
          (a, b) =>
            this.fixedCategories.indexOf(a.label) -
            this.fixedCategories.indexOf(b.label)
        );
    },
    handleClick({ name, refine }) {
      if (this.activeCategoryType === name) return;
      refine();
      this.$nextTick(() => {
        this.activeCategoryType = name;
      });
    },
    getCategoryTypeByCategoryItem(categoryItem) {
      for (const [type, categories] of Object.entries(categoriesMap)) {
        if (categories.includes(categoryItem)) return type;
      }
      return "product";
    }
  }
};
</script>
