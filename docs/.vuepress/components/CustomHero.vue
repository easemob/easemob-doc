<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="hero-info">
        <div class="hero-title">EasyIM Documentation</div>
        <div class="hero-desc">
          Explore complete API references, client SDK examples, and best practices for integrating messaging, chat groups, chat rooms, and other core features.
        </div>
        <div class="hero-desc">
          Start exploring the documentation and build reliable real-time communication into your app.
        </div>
      </div>
      <img src="/home_right.png" alt="EasyIM messaging experience" class="hero-img" />
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
