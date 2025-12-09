<template>
    <div class="image-hotspot-wrapper" :style="{ maxWidth: maxWidth }">
        <img :src="src" :alt="alt" loading="lazy" ref="imageEl" @load="onImageLoad">
        <a v-for="(spot, i) in computedHotspots" :key="i" :href="spot.link" class="hotspot"
            :style="getHotspotStyle(spot)" :aria-label="spot.label">
            <span class="hotspot-tooltip">{{ spot.label }}</span>
        </a>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    maxWidth: { type: String, default: '800px' },
    hotspots: { type: Array, default: () => [] },
    designSize: {
        type: Object,
        default: null, // { width: 406, height: 354 }
        description: '设计稿原始尺寸，用于自动转换像素坐标'
    }
})

const imageEl = ref(null)
// 智能判断坐标类型并转换
const computedHotspots = computed(() => {
    if (!props.hotspots.length) return []

    // 检测第一个热点：如果x>1则认为是像素单位
    const isPixelBased = props.hotspots[0].x > 1
    if (!isPixelBased) return props.hotspots // 已是百分比，直接返回

    // 必须有 designSize 才能转换
    if (!props.designSize?.width || !props.designSize?.height) {
        console.error('❌ 检测到像素坐标但未提供 designSize！')
        return props.hotspots
    }

    return props.hotspots.map(spot => ({
        ...spot,
        x: (spot.x / props.designSize.width) * 100,
        y: (spot.y / props.designSize.height) * 100,
        w: (spot.w / props.designSize.width) * 100,
        h: (spot.h / props.designSize.height) * 100
    }))
})

const getHotspotStyle = (spot) => ({
    left: `${spot.x}%`,
    top: `${spot.y}%`,
    width: `${spot.w}%`,
    height: `${spot.h}%`
})
</script>


<style scoped>
.image-hotspot-wrapper {
    position: relative;
    display: inline-block;
    margin: 16px 0;
}

.image-hotspot-wrapper img {
    width: 100%;
    height: auto;
    display: block;
}

.hotspot {
    position: absolute;
    background: rgba(52, 152, 219, 0.08);
    transition: all 0.2s ease;
    border-radius: 4px;
    pointer-events: auto;
}

.hotspot:hover {
    background: rgba(52, 152, 219, 0.379);
    transform: scale(1.02);
}

.hotspot-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #2c3e50;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
}

.hotspot:hover .hotspot-tooltip {
    opacity: 1;
}
</style>
