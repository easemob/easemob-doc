<script setup lang="ts">
import { usePageData } from "@vuepress/client";
import { onMounted, useSlots, watch } from "vue";

const props = withDefaults(
  defineProps<{
    show?: boolean;
    /** Optional heading slugs to remove if a heading cannot be read from the slot. */
    headings?: string[];
  }>(),
  {
    show: false,
    headings: () => [],
  }
);

const slots = useSlots();
const pageData = usePageData();

const normalizeSlug = (value: string): string =>
  value.replace(/^#/, "").trim().toLowerCase();

const collectHeadingSlugs = (
  nodes: any[],
  result = new Set<string>()
): Set<string> => {
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;

    if (typeof node.type === "string" && /^h[1-6]$/.test(node.type)) {
      const id = node.props?.id;
      if (typeof id === "string" && id) result.add(normalizeSlug(id));
    }

    if (Array.isArray(node.children)) collectHeadingSlugs(node.children, result);
    if (node.component?.subTree) collectHeadingSlugs([node.component.subTree], result);
  }
  return result;
};

const removeHeaders = (headers: any[], hiddenSlugs: Set<string>): any[] =>
  headers
    .filter(
      (header) =>
        !hiddenSlugs.has(normalizeSlug(header.slug ?? header.link ?? ""))
    )
    .map((header) => ({
      ...header,
      children: Array.isArray(header.children)
        ? removeHeaders(header.children, hiddenSlugs)
        : [],
    }));

const syncHeaders = (): void => {
  if (props.show) return;

  const hiddenSlugs = collectHeadingSlugs(slots.default?.() ?? []);
  props.headings.forEach((heading) =>
    hiddenSlugs.add(normalizeSlug(heading))
  );
  if (!hiddenSlugs.size) return;

  pageData.value.headers = removeHeaders(
    pageData.value.headers ?? [],
    hiddenSlugs
  );
};

watch(() => props.show, syncHeaders, { immediate: true });
onMounted(syncHeaders);
</script>

<template>
  <template v-if="show">
    <slot />
  </template>
</template>
