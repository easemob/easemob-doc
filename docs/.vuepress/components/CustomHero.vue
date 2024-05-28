<template>
  <div class="hero-section">
    <img src="/hero_bg.png" alt="Background image" class="background-image" />
    <div class="hero-content">
      <h1 class="hero-title">环信 IM 开发文档</h1>
      <p class="hero-description">
        12小时快速集成单聊、群聊、聊天室、推送系统通知等完备 IM 功能，全平台覆盖
      </p>
      <div class="hero-actions" @click="openAi">
        <div class="documentation-button">
          <img
            src="/aibot.png"
            alt="Documentation icon"
            class="documentation-icon"
          />
          <span>有集成问题？问环信文档AI助手</span>
        </div>
        <button class="go-button">Go</button>
      </div>
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
  min-height: 220px;
  align-items: center;
  justify-content: center;
}

.background-image {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-content {
  position: relative;
  display: flex;
  width: 640px;
  max-width: 100%;
  flex-direction: column;
  align-items: center;
}

.hero-title {
  margin: 0;
  text-align: center;
  background: linear-gradient(
    98deg,
    #73cdff -27.44%,
    #0082fa 40.66%,
    #1548ff 98.44%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font: 600 32px PingFang SC, sans-serif;
}

.hero-description {
  color: #666;
  text-align: center;
  align-self: stretch;
  margin: 23px;
  font: 400 16px PingFang SC, sans-serif;
}

@media (max-width: 991px) {
  .hero-description {
    max-width: 100%;
  }
}

.hero-actions {
  display: flex;
  justify-content: center;
  width: 388px;
  max-width: 100%;
  gap: 0;
  white-space: nowrap;
  cursor: pointer;
}

@media (max-width: 991px) {
  .hero-actions {
    white-space: initial;
  }
}

.documentation-button {
  border-radius: 24px 0 0 24px;
  background-color: #fff;
  display: flex;
  gap: 4px;
  font-size: 16px;
  color: #919ba1;
  font-weight: 400;
  line-height: 150%;
  padding: 12px 16px;
  border: none;
}

@media (max-width: 991px) {
  .documentation-button {
    white-space: initial;
  }
}

.documentation-icon {
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 24px;
}

.go-button {
  justify-content: center;
  align-items: start;
  border-radius: 0 24px 24px 0;
  background: linear-gradient(180deg, #009eff 0%, #6678ff 100%);
  color: #f9fafa;
  text-align: center;
  padding: 12px 34px;
  font: 500 18px/133% Roboto, sans-serif;
  border: none;
  cursor: pointer;
}

@media (max-width: 991px) {
  .go-button {
    padding-left: 20px;
    white-space: initial;
  }
}
</style>
