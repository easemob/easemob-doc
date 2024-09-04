<template>
  <ClientOnly>
    <ais-instant-search
      index-name="im-beta-easemob"
      :search-client="searchClient"
      :initial-ui-state="initialUiState"
    >
      <ais-configure
        :hitsPerPage="8"
        :maxValuesPerFacet="22"
        :attributesToSnippet="[
          'hierarchy.lvl1:20',
          'hierarchy.lvl2:20',
          'hierarchy.lvl3:20',
          'hierarchy.lvl4:20',
          'content:50'
        ]"
      />
      <div class="searchBoxContainer">
        <div class="searchLeft">
          <h3 class="searchCategory">文档分类</h3>
          <ais-refinement-list attribute="category" />
        </div>
        <div class="searchRight">
          <ais-search-box />
          <div class="stateContainer">
            <ais-stats />
            <ais-powered-by />
          </div>

          <ais-hits>
            <template v-slot:item="{ item }">
              <!-- <ais-hierarchical-menu
              :attributes="[
                'hierarchy.lvl0',
                'hierarchy.lvl1',
                'hierarchy.lvl2',
                'hierarchy.lvl3'
              ]"
            /> -->
              <p>
                <a :href="item.url" target="_blank">
                  <ais-highlight attribute="hierarchy.lvl0" :hit="item" />
                  <span v-if="item.hierarchy.lvl1"> > </span>
                  <ais-highlight attribute="hierarchy.lvl1" :hit="item" />
                  <span v-if="item.hierarchy.lvl2"> > </span>
                  <ais-highlight attribute="hierarchy.lvl2" :hit="item" />
                  <span v-if="item.hierarchy.lvl3"> > </span>
                  <ais-highlight attribute="hierarchy.lvl3" :hit="item" />
                </a>
              </p>
              <div>
                <ais-snippet attribute="content" :hit="item" />
              </div>
            </template>
          </ais-hits>
          <ais-pagination style="margin-top: 1em" />
        </div>
      </div>
    </ais-instant-search>
  </ClientOnly>
</template>

<script>
import { liteClient } from 'algoliasearch/lite'
import { useRoute } from 'vue-router'

export default {
  name: 'InstanceSearchLayout',

  data() {
    return {
      searchClient: liteClient(
        '5K8UTB3JVE',
        'df9e938d06f6531ce8dd8de71f907f0d'
      ),
      initialUiState: {
        ['im-beta-easemob']: {
          query: useRoute().query.query || ''
        }
      },
      snippet: [
        'hierarchy.lvl1:20',
        'hierarchy.lvl2:20',
        'hierarchy.lvl3:20',
        'hierarchy.lvl4:20',
        'hierarchy.lvl5:20',
        'hierarchy.lvl6:20',
        'content:50'
      ]
    }
  }
}
</script>

<style>
.searchBoxContainer {
  max-width: 1280px;
  margin: 1em auto;
  display: flex;
  font-family: sans-serif;
  padding: 1em;
}

.searchCategory {
  margin: 0 0 10px 0;
}

.searchLeft {
  flex: 3;
}

.searchRight {
  flex: 7;
}

.stateContainer {
  display: flex;
  justify-content: space-between;
  padding: 0.5em 0;
}

.ais-Hits-list {
  margin-top: 0;
  margin-bottom: 1em;
}

.ais-Hits-item {
  width: calc(100% - 1rem) !important;
}

.ais-InstantSearch {
  /* display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 1em; */
}
</style>
