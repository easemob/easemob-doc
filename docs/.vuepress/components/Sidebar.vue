<script setup>
  import Sidebar from "vuepress-theme-hope/modules/sidebar/components/Sidebar.js";
  import PlatformSwitch from './PlatformSwitch.vue'
  import PrivateSwitch from './PrivateSwitch.vue'
  import UIKitSwitch from './UIKitSwitch.vue'
  import CallKitSwitch from './CallKitSwitch.vue'
  import { usePageData } from '@vuepress/client'
  import { ref, watch } from 'vue'

  const pageData = usePageData()
  const showPlatformSwitch = ref(false)
  const showPrivateSwitch = ref(false)
  const showUIKitSwitch = ref(false)
  const showCallKitSwitch = ref(false)
  let title = ref('')
  watch(pageData, ()=> {
    const pagePath = pageData.value.path
    showPrivateSwitch.value = pagePath.indexOf('/private/') == 0
    showPlatformSwitch.value = pagePath.indexOf('/document/') == 0
    showUIKitSwitch.value = pagePath.indexOf('/uikit/') == 0
    showCallKitSwitch.value = pagePath.indexOf('/callkit/') == 0

    if(pagePath.indexOf('/product/') == 0) title.value = '产品介绍'
    else if(pagePath.indexOf('/uikit/') == 0) title.value = 'UIKit'
    else if(pagePath.indexOf('/callkit/') == 0) title.value = 'CallKit'
    else if(pagePath.indexOf('/document/server-side/') == 0) title.value = '服务端 API'
    else if(pagePath.indexOf('/document/') == 0) title.value = 'SDK'
    else if(pagePath.indexOf('/value-added/') == 0) title.value = '增值服务'
  }, {immediate:true})


</script>
<template>
  <Sidebar>
    <template #top>
      <div class="sidebar-header">
        <span class="sidebar-title">{{title}}</span>
        <div v-show="showPlatformSwitch" class="platform-switch">
          <ClientOnly>
            <PlatformSwitch />
          </ClientOnly>
        </div>
        <div v-show="showPrivateSwitch" class="platform-switch">
          <ClientOnly>
            <PrivateSwitch />
          </ClientOnly>
        </div>
        <div v-show="showUIKitSwitch" class="platform-switch">
          <ClientOnly>
            <UIKitSwitch />
          </ClientOnly>
        </div>
        <div v-show="showCallKitSwitch" class="platform-switch">
          <ClientOnly>
            <CallKitSwitch />
          </ClientOnly>
        </div>
      </div>
    </template>
  </Sidebar>
</template>

<style scope>
  .sidebar-header {
    display: flex;
    align-items: center;
    margin-bottom: -2rem;
    padding: 1rem;

    .sidebar-title {
      margin-right: 16px;
      color:var(--text-color);
      font: 500 22px PingFang SC, sans-serif;
    }

    .platform-switch {
      flex-grow: 1;
    }
  }
</style>




