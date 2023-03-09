<script setup>
import PageMeta from '@vuepress/theme-default/lib/client/components/PageMeta.vue'
import PageNav from '@vuepress/theme-default/lib/client/components/PageNav.vue'
import { usePageData, useSiteData, useRouteLocale } from '@vuepress/client'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const redirectPageKey = ref('')
const pageData = usePageData()
const siteData = useSiteData()
const routeLocale = useRouteLocale()
const router = useRouter()
console.log({
  pageData,
  siteData,
  routeLocale,
  router
})
const frontmatter = pageData.value.frontmatter
const redirectUri = frontmatter.pageUri
console.log(redirectUri)

if (redirectUri) {
    const redirectPage =router.options.routes.find(item => item.path === redirectUri);
    console.log({redirectPage})
    if (redirectPage) {
      redirectPageKey.value =  redirectPage.name
    }
}

</script>

<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <slot name="content-top" />

      <Content :page-key="redirectPageKey"  />

      <slot name="content-bottom" />
    </div>

    <PageMeta />

    <PageNav />

    <slot name="bottom" />
  </main>
</template>
