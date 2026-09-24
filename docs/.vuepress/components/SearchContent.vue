<template>
  <ais-instant-search
    index-name="easyim-doc"
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
            placeholder="Popular searches: login, message extension"
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
              <p>Sorry, no results found for "{{ query }}".</p>
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
import { getTabBySParam, isValidSParam } from "../utils/docCategory.js";

const sdkCategoryMap = {
  Android: "Android",
  iOS: "iOS",
  Web: "Web",
  rest: "REST API"
};

const productCategoryMap = {
  Product: "Product",
  console: "Console"
};

const apiReferenceCategoryMap = {
  "Android API Reference": "Android",
  "iOS API Reference": "iOS",
  "Web API Reference": "Web"
};

const categoryMap = {
  ...sdkCategoryMap,
  ...productCategoryMap,
  ...apiReferenceCategoryMap
};

function buildFilter(map) {
  return Object.keys(map).map(k => `category:'${k}'`).join(" OR ");
}

const productFilters = buildFilter(productCategoryMap);
const sdkFilters = buildFilter(sdkCategoryMap);
const apiReferenceFilters = buildFilter(apiReferenceCategoryMap);

const filtersMap = {
  product: productFilters,
  sdk: sdkFilters,
  "api-reference": apiReferenceFilters
};

const categoriesMap = {
  product: Object.keys(productCategoryMap),
  sdk: Object.keys(sdkCategoryMap),
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
    const categoryParam = Array.isArray(route.query.s)
      ? route.query.s[0]
      : route.query.s || "";

    return {
      categoryMap,
      searchClient: algoliasearch(
        "5K8UTB3JVE",
        "704ce0264ed7d6fd61300b1fddf0e14a"
      ),
      initialUiState: {
        ["easyim-doc"]: {
          query: queryParam,
          refinementList: {
            type: ["content"],
            category: isValidSParam(categoryParam) ? [categoryParam] : []
          }
        }
      },
      includeAttributes: ["category"],
      activeCategoryType: "product",
      hierarchyLevels: ["lvl0", "lvl1", "lvl2", "lvl3", "lvl4", "lvl5"],
      tabs: [
        { name: "product", label: "Product" },
        { name: "sdk", label: "SDK & REST" },
        { name: "api-reference", label: "API Reference" }
      ]
    };
  },
  created() {
    this.activeCategoryType = this.getCategoryTypeByCategoryItem(
      Array.isArray(this.$route.query.s)
        ? this.$route.query.s[0]
        : this.$route.query.s
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
      return getTabBySParam(categoryItem);
    }
  }
};
</script>
