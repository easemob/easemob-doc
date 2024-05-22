<template>
  <div>
    <div class="card-content">
      <section class="message-section">
        <header class="message-header">
          <div class="links-header">{{ title }}</div>
        </header>
        <p class="message-description">
          {{ desc }}
        </p>
      </section>
      <section class="links-section">
        <div class="links-header">文档链接</div>
        <div v-for="sdk in sdks" :key="sdk.text" class="link-item">
          <img :src="sdk.icon" class="link-icon" width="24px" :alt="sdk.text" />
          <el-link :href="sdk.link" class="link-label">{{ sdk.text }}</el-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SDKLink {
  icon?: string;
  text: string;
  link: string;
}

defineProps<{
  title?: string;
  desc?: string;
  sdks?: SDKLink[];
}>();
</script>

<style scoped>
.card-content {
  display: flex;
  gap: 10px;
  margin: 12px 8px;
}
@media (max-width: 991px) {
  .card-content {
    flex-direction: column;
  }
}
.message-section {
  width: 60%;
  display: flex;
  flex-direction: column;
  padding: 0 20px 0 0;
  font-size: 14px;
  border-right: 1px solid #f0f0f0;
}
.message-header {
  font-weight: 500;
  color: #000;
  font-family: "PingFang SC", sans-serif;
}
.message-description {
  color: #666;
  font-family: "PingFang SC", sans-serif;
  font-weight: 400;
  margin-top: 8px;
}
@media (max-width: 991px) {
  .message-section {
    width: 100%;
  }
}

.links-section {
  width: 40%;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
}
.links-header {
  color: #000;
  font-family: "PingFang SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.link-item {
  display: flex;
  align-items: center;
  margin-top: 16px;
  gap: 4px;
  white-space: nowrap;
}
.link-icon {
  width: 24px;
  object-fit: auto;
  object-position: center;
}
.link-label {
  font-family: "SF Pro", sans-serif;
  margin: auto 0;
}
@media (max-width: 991px) {
  .links-section {
    width: 100%;
  }
}
</style>
