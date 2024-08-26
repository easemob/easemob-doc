<template>
  <div>test</div>
  <!-- <ais-instant-search
    index-name="im-beta-easemob"
    :search-client="searchClient"
  >
    <div class="left-panel">
      <ais-clear-refinements />
      <h2>Brands</h2>
      <ais-refinement-list attribute="lang" searchable />
      <ais-configure :hitsPerPage="8" />
    </div>
    <div class="right-panel">
      <ais-search-box />
      <ais-hits>
        <template v-slot:item="{ item }">
          <h2>{{ item.url }}</h2>
        </template>
      </ais-hits>
      <ais-pagination />
    </div>
  </ais-instant-search> -->
</template>

<script>
// import { liteClient } from 'algoliasearch/lite'
// import 'instantsearch.css/themes/algolia-min.css'

// export default {
//   name: 'InstanceSearchLayout',
//   data() {
//     return {
//       searchClient: liteClient('5K8UTB3JVE', 'df9e938d06f6531ce8dd8de71f907f0d')
//     }
//   }
// }
</script>

<style>
body {
  font-family: sans-serif;
  padding: 1em;
}

.ais-Hits-list {
  margin-top: 0;
  margin-bottom: 1em;
}

.ais-InstantSearch {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 1em;
}
</style>
