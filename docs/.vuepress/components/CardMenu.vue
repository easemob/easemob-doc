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
          <img
            v-if="sdk.icon"
            :src="sdk.icon"
            class="link-icon"
            width="24px"
            :alt="sdk.text"
          />
          <a :href="sdk.link" class="link-label">{{ sdk.text }}</a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
window.onload = () => {
  console.log('CardMenu loaded')
}

interface SDKLink {
  icon?: string
  text: string
  link: string
}

defineProps<{
  title?: string
  desc?: string
  sdks?: SDKLink[]
}>()
</script>

<style scoped>
.card-content {
  display: flex;
  gap: 16px;
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
  border-right: 1px solid var(--border-color);
}
.message-header {
  font-weight: 500;
  color: #000;
}
.message-description {
  color: #505E72;
  font-weight: 400;
  margin-top: 8px;
  line-height: normal;
}
@media (max-width: 991px) {
  .message-section {
    width: 100%;
  }
}

.links-section {
  width: 40%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
}
.links-header {
  color: var(--text-color);
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

  img {
    display: none;
  }
}
.link-icon {
  width: 24px;
  object-fit: auto;
  object-position: center;
}
.link-label {
  color: #000;
  font-family: "SF Pro";
  font-style: normal;
  font-weight: 400;
  text-underline-offset: 4px;
  line-height: normal;
  margin: auto 0;
  text-decoration: underline;

  &:hover {
    color: #00A0FA;
  }
}
@media (max-width: 991px) {
  .links-section {
    width: 100%;
  }
}
</style>
