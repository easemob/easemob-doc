<template>
  <h3>{{ title }}</h3>
  <img :src="imageSrc" :alt="title" />
</template>

<script>
export default {
  name: 'ImageItem',
  props: {
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    imageSrc() {
      return this.src.replace('@static', '')
    },
  },
  methods: {
    getUrl(url) {
      return new URL(url, import.meta.url).href
    },
  },
}
</script>

<style></style>
