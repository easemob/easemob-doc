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
    }
  }
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
    // padding: 5px; /* 行的内边距 */
    // border: 1px solid #ccc; /* 行的边框样式 */
    // box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 行的阴影 */
  }

  .image-item {
    flex: 1 1 calc(50% - 15px); /* 每行两个图片，减去间距 */
    background-color: #f3f6f9; /* 行的背景颜色 */
    box-sizing: border-box;
    text-align: center; /* 标题居中 */
    display: flex;
    flex-direction: column;
    align-items: center; /* 居中对齐 */
    border-radius: 6px;
  }

  .image-item .image-title {
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    background-color: #ebeff5;
    padding: 12px 0;
  }

  .image-item img {
    height: 346px;
    display: block;
    margin-top: 20px;
    margin-bottom: 40px;
    border-radius: 16px;
    max-width: 98%;
    border: 4px solid #dde5ee;
  }
}
</style>
