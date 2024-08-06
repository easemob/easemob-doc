<script setup lang="ts">
import { Content } from '@vuepress/client'
import { usePageData, useSiteData } from '@vuepress/client'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import pages from '@temp/pages'

const redirectPageKey = ref('')
const dialogVisible = ref(false)
const pageData = usePageData()
const siteData = useSiteData()
const router = useRouter()
const frontmatter = pageData.value.frontmatter
const redirectUri = frontmatter.pageUri

if (redirectUri) {
  const redirectPage = pages.find((item) => item.path === redirectUri)
  if (redirectPage) {
    pageData.value.headers = redirectPage.headers
    redirectPageKey.value = redirectPage.key
  }
}
</script>

<template>
  <Content class="theme-hope-content" :page-key="redirectPageKey" />
  <ClientOnly>
    <div
      id="wjxFloatInsertBtn"
      class="advisor"
      @click="dialogVisible = !dialogVisible"
    >
      参与调查
    </div>
    <el-dialog v-model="dialogVisible" :fullscreen="true">
      <iframe
        src="https://www.wjx.cn/vm/rXwgWIa.aspx?width=600&source=iframe&s=t"
        style="overflow: auto"
      ></iframe>
    </el-dialog>
  </ClientOnly>
</template>

<style scoped>
.advisor {
  position: fixed;
  z-index: 2147483583;
  border-radius: 2px;
  cursor: pointer;
  background: rgb(0, 0, 0);
  right: 0px;
  top: 60%;
  text-decoration: none;
  outline: none;
  font-family: 'Microsoft Yahei', Arial, Helvetica;
  font-size: 14px;
  display: inline-block;
  margin: 0px;
  border: none;
  float: none;
  color: rgb(255, 255, 255);
  line-height: 18px;
  padding: 12px 7px;
  width: 16px;
  box-sizing: content-box !important;
}

iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
