<template>
  <div v-if="videoLink">
    <div class="bilibili-desc">
      <a class="sr-only" :href="videoLink">{{ title }}</a>
    </div>
    <iframe
      ref="el"
      :src="videoLink"
      :title="title"
      class="bilibili-iframe"
      :allow="videoIframeAllow"
      :style="{ width: width, height: loaded ? computedHeight : '0' }"
      @load="onLoad"
    />
    <div v-if="!loaded">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 100 100"
      >
        <circle cx="28" cy="75" r="11" fill="currentColor">
          <animate
            attributeName="fill-opacity"
            begin="0s"
            dur="1s"
            keyTimes="0;0.2;1"
            repeatCount="indefinite"
            values="0;1;1"
          />
        </circle>
        <path
          fill="none"
          stroke="#88baf0"
          stroke-width="10"
          d="M28 47a28 28 0 0 1 28 28"
        >
          <animate
            attributeName="stroke-opacity"
            begin="0.1s"
            dur="1s"
            keyTimes="0;0.2;1"
            repeatCount="indefinite"
            values="0;1;1"
          />
        </path>
        <path
          fill="none"
          stroke="#88baf0"
          stroke-width="10"
          d="M28 25a50 50 0 0 1 50 50"
        >
          <animate
            attributeName="stroke-opacity"
            begin="0.2s"
            dur="1s"
            keyTimes="0;0.2;1"
            repeatCount="indefinite"
            values="0;1;1"
          />
        </path>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
const VIDEO_LINK = 'https://player.bilibili.com/player.html'

export default defineComponent({
  name: 'BiliBili',

  props: {
    bvid: {
      type: String,
      default: ''
    },
    aid: {
      type: String,
      default: ''
    },
    cid: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'A BiliBili video'
    },
    page: {
      type: [String, Number],
      default: 1
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: `${100 / (16 / 9)}vh`
    },
    ratio: {
      type: [String, Number],
      default: 16 / 9
    },
    time: {
      type: [String, Number],
      default: 0
    },
    autoplay: Boolean
  },

  setup(props) {
    const loaded = ref(false)
    const el = ref<HTMLElement | null>(null)
    const videoIframeAllow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture'
    const videoLink = computed(() => {
      const { aid, bvid, cid, autoplay, time, page } = props

      return aid && cid
        ? `${VIDEO_LINK}?aid=${aid}&cid=${cid}&t=${time}&autoplay=${
            autoplay ? 1 : 0
          }&p=${page}`
        : bvid
        ? `${VIDEO_LINK}?bvid=${bvid}&t=${time}&autoplay=${autoplay ? 1 : 0}`
        : null
    })

    const computedHeight = ref('0px')

    const updateHeight = () => {
      if (el.value) {
        const width = el.value.clientWidth
        computedHeight.value = `${width / (16 / 9)}px`
      }
    }

    onMounted(() => {
      updateHeight()
      window.addEventListener('resize', updateHeight)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateHeight)
    })

    const onLoad = () => {
      loaded.value = true
    }

    return {
      el,
      loaded,
      videoLink,
      computedHeight,
      onLoad,
      videoIframeAllow,
      title: props.title
    }
  }
})
</script>

<style scoped>
.bilibili-desc a {
  @media print {
    display: block;
  }
}

.bilibili-iframe {
  margin: 8px 0;
  border: none;
  border-radius: 8px;

  @media print {
    display: none;
  }
}
</style>
