<script setup>
  import Sidebar from "vuepress-theme-hope/modules/navbar/components/Navbar.js";
  import { useThemeLocaleData } from 'vuepress-theme-hope/composables/index'

  const themeData = useThemeLocaleData()
  const extraNavList = themeData.value.extra_nav || []
</script>

<template>
  <Sidebar>
    <template #endBefore>
      <el-link class="extra-link" :type="item.type" v-for="item in extraNavList" :key="item.text" :href="item.link">{{ item.text }}</el-link>
    </template>
  </Sidebar>
</template>

<style scope>

</style>




