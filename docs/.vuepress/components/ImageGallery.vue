<template>
  <div class="image-gallery">
    <div class="image-row" v-for="(row, rowIndex) in imageRows" :key="rowIndex">
      <div class="image-item" v-for="(item, index) in row" :key="index">
        <component :is="item"> </component>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageGallery',
  computed: {
    imageRows() {
      const rows = []
      const slotsContent = this.$slots.default()
      const imagesPerRow = 2
      for (let i = 0; i < slotsContent.length; i += imagesPerRow) {
        rows.push(slotsContent.slice(i, i + imagesPerRow))
      }
      return rows
    },
  },
}
</script>

<style lang="scss">
.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 行之间的间距 */
  padding: 20px;

  .image-row {
    display: flex;
    justify-content: space-between; /* 确保每行两个图片均匀分布 */
    gap: 15px; /* 图片之间的间距 */
    padding: 5px; /* 行的内边距 */
    border: 1px solid #ccc; /* 行的边框样式 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 行的阴影 */
  }

  .image-item {
    flex: 1 1 calc(50% - 15px); /* 每行两个图片，减去间距 */
    background-color: #fdfdfd; /* 行的背景颜色 */
    box-sizing: border-box;
    text-align: center; /* 标题居中 */
    display: flex;
    flex-direction: column;
    align-items: center; /* 居中对齐 */
    border: 1px solid #ddd; /* 图片和标题的边框 */
    padding: 5px; /* 图片和标题的内边距 */
  }

  .image-item h3 {
    width: 100%;
    font-size: 18px;
    margin-bottom: 10px; /* 标题与图片之间的间距 */
    border-bottom: 1px solid #ddd; /* 标题下方的边框 */
    padding-bottom: 12px; /* 标题下方的内边距 */
  }

  .image-item img {
    /* width: 100%; */
    height: 350px;
    display: block;
    padding-top: 5px; /* 图片上方的内边距 */
  }
}
</style>
