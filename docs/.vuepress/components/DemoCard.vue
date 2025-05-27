<template>
  <div
    :class="[
      'custom-component-card',
      className,
      hoverable && 'hoverable',
      bordered && 'bordered',
      contentCenter && 'content-center'
    ]"
    :style="computedStyle"
  >
    <div v-if="icon" class="card-icon">
      <img :src="icon" :alt="iconAlt || '图标'" :no-view="true" />
    </div>
    <div v-if="title" class="card-title">{{ title }}</div>
    <div v-if="$slots.action" class="card-action-slot">
      <slot name="action"></slot>
    </div>
    <div v-else-if="qrcode" class="card-qrcode">
      <img :src="qrcode" alt="二维码" :no-view="true" />
    </div>
    <div v-if="actionText" class="card-action">
      <a v-if="actionLink" :href="actionLink">{{ actionText }}</a>
      <span v-else>{{ actionText }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  className?: string;
  style?: Record<string, any>;
  bordered?: boolean;
  borderSize?: "small" | "middle" | "large";
  cover?: string;
  hoverable?: boolean;
  height?: string | number;
  paddingVertical?: number | string;
  paddingHorizontal?: number | string;
  background?: string;
  contentCenter?: boolean;
  icon?: string;
  iconAlt?: string;
  title?: string;
  qrcode?: string;
  qrcodeSize?: number | string;
  actionText?: string;
  actionLink?: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: "",
  style: () => ({}),
  bordered: true,
  borderSize: "large",
  cover: "",
  hoverable: false,
  height: "auto",
  paddingVertical: "12px",
  paddingHorizontal: "24px",
  background: "#fff",
  contentCenter: false,
  icon: "",
  iconAlt: "",
  title: "",
  qrcode: "",
  qrcodeSize: 120,
  actionText: "",
  actionLink: ""
});

const computedStyle = computed(() => {
  const style: Record<string, any> = {
    height: props.height,
    padding: `${props.paddingVertical} ${props.paddingHorizontal}`,
    background: props.background,
    ...props.style
  };

  if (props.bordered) {
    switch (props.borderSize) {
      case "small":
        style.borderRadius = "2px";
        break;
      case "middle":
        style.borderRadius = "4px";
        break;
      case "large":
        style.borderRadius = "8px";
        break;
    }
  }
  return style;
});
</script>

<style scoped>
.custom-component-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
    0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 5px 2px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s;
}

.content-center {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.custom-component-card > * {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bordered {
  border: 1px solid #e8e8e8;
}

.hoverable:hover {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
  transition: box-shadow 0.3s;
}

.card-icon {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.card-icon img {
  width: 48px;
  height: 48px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
  text-align: center;
  width: 100%;
}

.card-qrcode {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.card-qrcode img {
  width: v-bind('props.qrcodeSize + "px"');
  height: v-bind('props.qrcodeSize + "px"');
  object-fit: contain;
}

.card-action {
  color: #096dd9;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  width: 100%;
}

/* 为actionText添加hover效果 */
.card-action:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}

/* 确保card-action中的链接样式与原来一致 */
.card-action a {
  color: inherit;
  text-decoration: none;
}

.card-action a:hover {
  text-decoration: underline;
}

.card-action-slot {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: v-bind('props.qrcodeSize + "px"');
}

/* 添加默认按钮样式，与图片中的样式一致 */
.card-action-slot :deep(button) {
  background-color: #096dd9;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 6px 18px;
  font-size: 14px;
  cursor: pointer;
  min-width: 100px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  outline: none;
  transition: background-color 0.3s;
}

.card-action-slot :deep(button:hover) {
  background-color: #0056b3;
}

/* 禁用action插槽中a标签的默认样式并修改颜色 */
.card-action-slot :deep(a) {
  text-decoration: none; /* 禁用a标签的下划线 */
  color: inherit; /* 使用继承的颜色，而不是默认的蓝色 */
}

.card-action-slot :deep(a:hover) {
  text-decoration: none; /* 确保hover状态下也没有下划线 */
  color: inherit; /* 保持hover状态下的颜色一致 */
}
</style>
