<script setup lang="ts">
import { Content } from '@vuepress/client'
import { usePageData } from '@vuepress/client'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import pages from '@temp/pages'

const redirectPageKey = ref('')
const dialogVisible = ref(false)
const pageData = usePageData()
const router = useRouter()
const frontmatter = pageData.value.frontmatter
const redirectUri = frontmatter.pageUri

const nameMap = {
  android: 'Andorid 集成文档',
  ios: 'iOS 集成文档',
  web: 'Web 集成文档',
  applet: '小程序集成文档',
  harmonyos: 'HarmonyOS 集成文档',
  flutter: 'Flutter 集成文档',
  'react-native': 'React Native 集成文档',
  unity: 'Unity 集成文档',
  windows: 'Windows 集成文档',
  'server-side': 'REST API',
  product: '产品介绍',
  push: '即时推送',
  moderation: '内容审核',
  aigc: 'AI 集成'
}

const getCategoryFromPath = () => {
  const pathSegments = pageData.value.path.split('/')
  const segmentLength = pathSegments.length
  let secondLastSegment = ''
  if (segmentLength >= 2) {
    secondLastSegment = pathSegments[segmentLength - 2]
  }
  if (secondLastSegment == 'push' && segmentLength > 3) {
    secondLastSegment = pathSegments[segmentLength - 3]
  }

  let result = nameMap[secondLastSegment] || secondLastSegment
  if (segmentLength >= 3 && pathSegments[1] == 'uikit') {
    result = 'UIKit-' + result
  }
  return result
}
const metaCategory = frontmatter.category || getCategoryFromPath()

if (redirectUri) {
  const redirectPage = pages.find((item) => item.path === redirectUri)
  if (redirectPage) {
    pageData.value.headers = redirectPage.headers
    redirectPageKey.value = redirectPage.key
  }
}
</script>

<template>
  <div id="meta-category" class="hidden">{{ metaCategory }}</div>
  <Content class="theme-hope-content" :page-key="redirectPageKey" />
  <!-- <ClientOnly>
    <div
      id="wjxFloatInsertBtn"
      class="advisor"
      @click="dialogVisible = !dialogVisible"
    >
      有奖调研
    </div>
    <el-dialog v-model="dialogVisible" :fullscreen="true">
      <iframe
        src="https://www.wjx.cn/vm/rXwgWIa.aspx?width=600&source=iframe&s=t"
        style="overflow: auto"
      ></iframe>
    </el-dialog>
  </ClientOnly> -->
</template>

<style scoped>
.hidden {
  display: none;
}

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
