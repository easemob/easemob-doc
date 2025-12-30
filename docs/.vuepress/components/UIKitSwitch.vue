<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const PLATFORM_ICON_MAP = {
  android: {
    icon: "/icon-Android.svg",
    activeIcon: "/icon-Android-hover.svg",
  },
  ios: {
    icon: "/icon-iOS.svg",
    activeIcon: "/icon-iOS-hover.svg",
  },
  web: {
    icon: "/icon-web.svg",
    activeIcon: "/icon-web-hover.svg",
  },
  harmonyos: {
    icon : "/icon-harmonyos.svg",
    activeIcon: "/icon-harmonyos-hover.svg",
  },
  windows: {
    icon: "/icon-windows.svg",
    activeIcon: "/icon-windows-hover.svg",
  },
  ["react-native"]: {
    icon: "/icon-ReactNative.svg",
    activeIcon: "/icon-ReactNative-hover.svg",
  },
  flutter: {
    icon: "/icon-flutter.svg",
    activeIcon: "/icon-flutter-hover.png",
  },
  unity: {
    icon: "/icon-unity.svg",
    activeIcon: "/icon-unity-hover.svg",
  },
  uniapp: {
    icon: "/icon-uni-app.svg",
    activeIcon: "/icon-uni-app-hover.svg",
  },
  applet: {
    icon: "/icon-mini-program.svg",
    activeIcon: "/icon-mini-program-hover.svg",
  },
  ["server-side"]: {
    icon: "/icon-platform.svg",
    activeIcon: "/icon-platform-hover.svg",
  },
};

const options = [
  {
    label: "平台",
    options: [
      {
        value: "android",
        label: "Android",
      },
      {
        value: "ios",
        label: "iOS",
      },
      {
        value: "web",
        label: "Web",
      },
      {
        value: "harmonyos",
        label: "HarmonyOS",
      },
    ],
  },
  {
    label: "框架",
    options: [
      {
        value: "react-native",
        label: "React Native",
      },
      {
        value: "flutter",
        label: "Flutter",
      },
      {
        value: "uniapp",
        label: "Uniapp",
      },
    ],
  },
];

const platform = ref("android");
const kitType = ref("chatuikit");
const platformIcon = computed(
  () => PLATFORM_ICON_MAP[platform.value]?.icon
);
const route = useRoute();
const router = useRouter();
watch(
  () => route.path,
  () => {
    if (route.path.indexOf("/uikit") == 0) {
      const splitRoute = route.path.split("/");
      kitType.value = splitRoute[2];
      platform.value = splitRoute[3];
    }
  },
  { immediate: true }
);

// 切换平台，如果有相同路径的route就直接跳转
const onChange = (platform) => {
  const nextPlatformDocRouters = router.options.routes
    .filter(
      (item) =>
        item.hasOwnProperty("name") &&
        item?.path.indexOf(`/uikit/${kitType.value}/${platform}`) == 0
    )
    .map((item) => item.path);

  let newPath = route.path.split("/");
  newPath[3] = platform;
  const nextPathPath = newPath.join("/");

  if (nextPlatformDocRouters.indexOf(nextPathPath) > -1) {
    router.push(nextPathPath);
  } else {
    if (kitType.value == "chatuikit") {
      router.push(
        `/uikit/${kitType.value}/${platform}/chatuikit_overview.html`
      );
    }
    if (kitType.value == "chatroomuikit") {
      router.push(
        `/uikit/${kitType.value}/${platform}/roomuikit_overview.html`
      );
    }
  }
};
</script>

<template>
  <el-select v-model="platform" @change="onChange" placeholder="请选择" placement="bottom-end" popper-class="platform-select-dropdown">
    <template #prefix>
      <img width="20" height="20" :src="platformIcon" />
    </template>
    <el-option-group
      v-for="group in options"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        class="option-content"
      >
        <span class="label-icon">
          <img
            class="default"
            width="20"
            height="20"
            :src="PLATFORM_ICON_MAP[item.value]?.icon"
          />
          <img
            class="active"
            width="20"
            height="20"
            :src="PLATFORM_ICON_MAP[item.value]?.activeIcon"
          />
        </span>
        <span>{{ item.label }}</span>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<style lang="scss" scope>
.option-content:hover .default,
.option-content.is-selected .default {
  display: none;
}

.option-content .active {
  display: none;
}

.option-content:hover .active,
.option-content.is-selected .active {
  display: inline-block;
}

.label-icon {
  vertical-align: sub;
  padding-right: 5px;
}

.el-select {
  .el-select__wrapper {
    min-height: 2.125rem;
    .el-select__icon {
      width: 0.88rem;
      height: 0.88rem;
      background: url(/icon-arrow-down.svg) no-repeat center center;
      svg {
        display: none;
      }
    }

    &.is-focused {
      .el-select__icon {
        background-image: url(/icon-arrow-down-hover.svg);
      }
    }
  }
}

.platform-select-dropdown {
  width: 16rem;

  .el-select-group__wrap {
    position: relative;
    padding-bottom: .5rem;
    margin-bottom: .5rem;

    .el-select-group__title {
      display: flex;
      align-items: center;
      height: 2rem;
      padding-left: 1.25rem;
      align-self: stretch;
      color: var(--text-color-light);
      font-size: 0.75rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.25rem;
    }

    .el-select-group {
      .el-select-dropdown__item {
        height: 2rem;
        padding-left: .75rem;
        color: var(--text-color);
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;

        .label-icon {
            padding-right: .62rem;
        }

        &:hover,
        &.is-selected,
        &.is-hovering {
          color: var(--theme-color);
          background-color: transparent;
        }
        &:hover {
          background-color: var(--switch-hover-bg-color);
        }
      }
    }

    &::after {
      content: '';        
      position: absolute; 
      bottom: 0;          
      left: 1.5rem;
      width: calc(100% - 3rem);        
      height: 1px;       
      background-color: var(--border-color); 
    }

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;

      &::after {
        display: none;
      }
    }
  }
}
</style>
