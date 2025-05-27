<template>
  <div class="image-title">{{ title }}</div>
  <img :src="imageSrc" :alt="title" />
</template>

<script>
export default {
  name: 'ImageItem',
  props: {
    src: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  computed: {
    imageSrc() {
      return this.src.replace('@static', '')
    },
    methods: {
      getUrl(url) {
        return new URL(url, import.meta.url).href
      }
    }
  }
}
</script>

<style>
.container {
  background-color: #f3f6f9;
  display: flex;
  max-width: 286px;
  padding: 0 0 36px;
  flex-direction: column;
  overflow: hidden;
  color: #253646;
  white-space: nowrap;
  text-align: center;
  font: 500 14px PingFang SC, -apple-system, Roboto, Helvetica, sans-serif;
}

.header {
  background-color: #ebeff5;
  width: 100%;
  overflow: hidden;
  padding: 10px 70px;
}

.image {
  aspect-ratio: 0.47;
  object-fit: contain;
  object-position: center;
  width: 168px;
  border-radius: 4px;
  align-self: center;
  margin-top: 24px;
  max-width: 100%;
}
</style>
