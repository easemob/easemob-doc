<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="hero-info">
        <div class="hero-title">环信 IM 开发文档</div>
        <div class="hero-desc">
          提供完整 API 参考、多端 SDK 示例与最佳实践，快速集成消息、群组、聊天室、音视频等核心功能，助您轻松构建稳定可靠的 IM 应用。
        </div>
        <div class="hero-desc">
          探索下面的综合文档，立即释放 IM 即时通讯的力量。
        </div>
        <ul class="hero-version-info">
          <li>
            <strong><a
              class="hero-version-v5"
              href="/document/android/beginner_guide.html"
            >v5 全新上线</a></strong>：<strong>V5 文档已就位！</strong>目前为 Android、iOS 及 Web/小程序提供全新集成指南，带来更优性能与体验。更多平台文档即将陆续登场，选择 V5，即刻开启升级之旅。
          </li>
          <li>
            <a href="/v4/android/quickstart.html">v4.x 持续维护</a>：各端 V4.x 文档仍在正常维护中，现有客户可安心使用。
          </li>
          <li>
            <a
              href="https://docs-im.easemob.com/start/start"
            >v2</a>
            /
            <a href="https://docs-im.easemob.com/ccim/intro">v3</a>
            已停止维护：旧版本文档已归档，不再更新。
          </li>
        </ul>
      </div>
      <img src="/hero_chat.png" alt="Documentation icon" class="hero-img" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "HeroSection",
  methods: {
    openAi() {
      const chatbotBtn = document.getElementById("dify-chatbot-bubble-button");
      if (chatbotBtn) {
        chatbotBtn.click();
      }
    },
  },
});
</script>

<style scoped>
.hero-section {
  position: relative;
  display: flex;
  height: 420px;
  align-items: center;
  justify-content: center;

  background-image: linear-gradient(
      to bottom,
      transparent 0%,
      #FAFDFF 50%,
      #FAFDFF 100%
    ),
    linear-gradient(to right, #dfcaff 0%, #cae5ff 100%);
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  max-width: var(--home-page-width);
  padding: 70px 0 50px 0;
}

.hero-info {
  display: flex;
  flex-direction: column;
  max-width: 660px;
  justify-content: center;
}

.hero-title {
  color: #000;
  font-size: 3.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.hero-desc {
  margin-top: 16px;
  color: #505e72;
  line-height: 24px;

  &:last-child {
    margin-top: 22px;
  }
}

.hero-version-info {
  margin: 14px 0 0;
  padding-left: 20px;
  color: #505e72;
  line-height: 24px;
}

.hero-version-v5 {
  font-size: calc(1em + 4px);
}

.hero-img {
  flex-shrink: 0;
  width: 31.25rem;
  height: 23.4325rem;
  object-fit: contain;
}

@media (max-width: 991px) {
  .hero-img {
    display: none;
  }
}
</style>
