<script setup lang="ts">
import { Content } from "@vuepress/client";
import { usePageData, useSiteData } from "@vuepress/client";
import { ref } from "vue";
import { useRouter } from "vue-router";
import pages from "@temp/pages";

const redirectPageKey = ref("");
const pageData = usePageData();
const siteData = useSiteData();
const router = useRouter();
const frontmatter = pageData.value.frontmatter;
const redirectUri = frontmatter.pageUri;

if (redirectUri) {
  const redirectPage = pages.find((item) => item.path === redirectUri);
  if (redirectPage) {
    pageData.value.headers = redirectPage.headers;
    redirectPageKey.value = redirectPage.key;
  }
}
</script>

<template>
  <Content class="theme-hope-content" :page-key="redirectPageKey" />
</template>
