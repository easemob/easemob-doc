<script setup lang="ts">
import { computed } from "vue";
import { usePageData } from "@vuepress/client";

interface BreadcrumbItem {
  text: string;
  link?: string;
}

const pageData = usePageData();

const PLATFORM_NAMES: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
};

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const currentPath = pageData.value.path;
  const currentTitle = pageData.value.title || "Untitled";
  const items: BreadcrumbItem[] = [{ text: "Home", link: "/" }];

  if (currentPath.startsWith("/product/")) {
    items.push({ text: "Product Introduction", link: "/product/introduction.html" });

    if (currentPath !== "/product/introduction.html") {
      items.push({ text: currentTitle });
    }

    return items;
  }

  if (currentPath.startsWith("/sdk/v5/")) {
    const platform = currentPath.match(/^\/sdk\/v5\/([^/]+)(?:\/|$)/)?.[1];
    const platformName = platform && PLATFORM_NAMES[platform];
    const platformSdkOverview = platformName
      ? `/sdk/v5/${platform}/sdk_overview.html`
      : "/sdk/v5/";

    items.push({ text: "SDK", link: platformSdkOverview });

    if (currentPath === platformSdkOverview) {
      return items;
    }

    if (platformName) {
      items.push({
        text: platformName,
        link: `/sdk/v5/${platform}/`,
      });
    }

    const isSdkHome = currentPath === "/sdk/v5/";
    const isPlatformHome = platform && currentPath === `/sdk/v5/${platform}/`;
    if (!isSdkHome && !isPlatformHome) {
      items.push({ text: currentTitle });
    }

    return items;
  }

  if (currentPath.startsWith("/rest/")) {
    items.push({ text: "Server APIs", link: "/rest/overview.html" });

    const isWebhookPage = currentPath.startsWith("/rest/callback_");
    if (isWebhookPage) {
      items.push({ text: "Webhooks", link: "/rest/callback_overview.html" });
    }

    const isServerApiHome = currentPath === "/rest/overview.html";
    const isWebhookHome = currentPath === "/rest/callback_overview.html";
    if (!isServerApiHome && !isWebhookHome) {
      items.push({ text: currentTitle });
    }

    return items;
  }

  if (currentPath !== "/") {
    items.push({ text: currentTitle });
  }

  return items;
});
</script>

<template>
  <nav
    v-if="breadcrumbItems.length > 1"
    class="breadcrumb"
    aria-label="Breadcrumb"
  >
    <ol vocab="https://schema.org/" typeof="BreadcrumbList">
      <li
        v-for="(item, index) in breadcrumbItems"
        :key="`${item.text}-${index}`"
        :class="{ 'is-active': index === breadcrumbItems.length - 1 }"
        property="itemListElement"
        typeof="ListItem"
      >
        <RouterLink
          v-if="item.link && index < breadcrumbItems.length - 1"
          :to="item.link"
          property="item"
          typeof="WebPage"
        >
          <span property="name">{{ item.text }}</span>
        </RouterLink>
        <span v-else property="name" aria-current="page">{{ item.text }}</span>
        <meta property="position" :content="String(index + 1)">
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  position: relative;
  z-index: 2;
  padding-top: 1rem;
  font-size: 15px;
}

.breadcrumb ol {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.breadcrumb li {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  line-height: 1.5;
}

.breadcrumb a {
  display: inline-block;
}

.breadcrumb li + li::before {
  content: ">";
  padding: 0 0.5em;
  color: var(--light-grey);
}

.breadcrumb li.is-active > span {
  color: var(--text-color);
}

@media (max-width: 719px) {
  .breadcrumb {
    overflow-x: auto;
    white-space: nowrap;
    padding-top: 0.5rem;
    font-size: 12.8px;
  }
}

@media print {
  .breadcrumb {
    display: none;
  }
}
</style>
