<script setup>
  import Sidebar from "vuepress-theme-hope/modules/sidebar/components/Sidebar.js";
  import PlatformSwitch from './PlatformSwitch.vue'
  import { usePageData } from '@vuepress/client'
  import { ref, watch } from 'vue'

  const pageData = usePageData()
  const showPlatformSwitch = ref(false)
  watch(pageData, ()=> {
    const pagePath = pageData.value.path
    showPlatformSwitch.value = pagePath.indexOf('/document') == 0
  }, {immediate:true})

</script>
<template>
  <Sidebar>
    <template #top>
      <div v-show="showPlatformSwitch" class="platform-switch">
        <PlatformSwitch />
      </div>
    </template>
  </Sidebar>
</template>

<style scope>
  .platform-switch {
    margin-bottom: -2rem;
    padding: 1rem;
  }
</style>




