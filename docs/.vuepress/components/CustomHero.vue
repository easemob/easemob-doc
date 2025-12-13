<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="hero-info">
        <div class="hero-title">环信 IM 开发文档</div>
        <div class="hero-desc">
          基于即时通讯 (Instant Messaging, IM)
          的高可靠性、低延时、强扩展性及高并发特性，可轻松切入即时通讯领域，为产品带来卓越沟通体验，快速增强用户粘性和市场竞争力。即时通讯
          IM
          解决方案支持丰富的消息类型、群组功能和跨平台体验，轻松构建满足不同场景需求的高效沟通平台，助力用户享受流畅便捷的交流方式。
        </div>
        <div class="hero-desc">
          探索下面的综合文档，立即释放 IM 即时通讯的力量。
        </div>
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
  width: 95%;
  max-width: var(--home-page-width);
  padding: 70px 0 50px 0;
}

.hero-info {
  display: flex;
  flex-direction: column;
  max-width: 660px;
}

.hero-title {
  margin-top: 24px;
  color: #000;
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

.hero-img {
  flex-shrink: 0;
  width: 400px;
  height: 300px;
  margin-right: 33px;
}

@media (max-width: 991px) {
  .hero-img {
    display: none;
  }
}
</style>
