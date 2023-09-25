
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter} from 'vue-router'

const PLATFORM_ICON_MAP = {
  privatization: {
    icon : '/icon-server-dark.png',
    activeIcon: '/icon-server-light.png',
  },
  android: {
    icon : '/icon-Android.svg',
    activeIcon: '/icon-Android-hover.svg',
  },
  ios: {
    icon : '/icon-iOS.svg',
    activeIcon: '/icon-iOS-hover.svg',
  },
  web: {
    icon : '/icon-web.svg',
    activeIcon: '/icon-web-hover.png',
  },
  windows: {
    icon : '/icon-windows.svg',
    activeIcon: '/icon-windows-hover.svg',
  },
  ['react-native']: {
    icon : '/icon-ReactNative.svg',
    activeIcon: '/icon-ReactNative-hover.svg',
  },
  flutter: {
    icon : '/icon-flutter.svg',
    activeIcon: '/icon-flutter-hover.png',
  },
  unity: {
    icon : '/icon-unity.svg',
    activeIcon: '/icon-unity-hover.svg',
  },
  applet: {
    icon : '/icon-mini-program.svg',
    activeIcon: '/icon-mini-program-hover.svg',
  },
  ['server-side']: {
    icon : '/icon-platform.svg',
    activeIcon: '/icon-platform-hover.svg',
  },
  electron: {
    icon : '/icon-Electron.svg',
    activeIcon: '/icon-Electron-hover.svg',
  },
  linux: {
    icon : '/icon-linux.svg',
    activeIcon: '/icon-linux-hover.svg',
  },
}

const V1_PLATFORM = ['android', 'ios', 'web', 'applet', 'electron', 'server-side']

const OPTIONS = [
  {
    label: '安装部署',
    options: [
       {
        value: 'privatization',
        label: '环境准备',
      },
    ],
  },
  {
    label: '集成文档',
    options: [
      {
        value: 'android',
        label: 'Android',
      },
      {
        value: 'ios',
        label: 'iOS',
      },
      {
        value: 'web',
        label: 'Web',
      },
      {
        value: 'windows',
        label: 'Windows',
      },
       {
        value: 'react-native',
        label: 'React Native',
      },
      {
        value: 'flutter',
        label: 'Flutter',
      },
      {
        value: 'unity',
        label: 'Unity',
      },
      {
        value: 'applet',
        label: '小程序',
        
      },
      {
        value: 'electron',
        label: 'Electron',
      },
      {
        value: 'linux',
        label: 'Linux',
      },
      {
        value: 'server-side',
        label: 'Rest Api',
      },
    ],
  },
]

const platform = ref('android')
const platformOptions = ref(OPTIONS)
let version = ''
const platformIcon = computed(() => PLATFORM_ICON_MAP[platform.value]?.activeIcon)
const route = useRoute()
const router = useRouter()



const handleVersionOptions = (version:string) =>{
  if (version === 'v2') {
    platformOptions.value = OPTIONS
  }
  if (version === 'v1') {
    let v1Options = JSON.parse(JSON.stringify(OPTIONS))
    v1Options[1].options = v1Options[1].options.filter((item) =>
      V1_PLATFORM.includes(item.value)
    )
    platformOptions.value = v1Options
   
  }
}

watch(()=>route.path, ()=> {
  if (route.path.indexOf('/document') == 0) {
    version = route.path.split('/')[2]
    handleVersionOptions(version)
    platform.value = route.path.split('/')[3]
  }
}, {immediate:true})

// 切换平台，如果有相同路径的route就直接跳转
const onChange = (platform) => {
  if (platform === 'privatization') {
    router.push(`/document/${version}/privatization/uc_deploy.html`)
    return 
  }
  const nextPlatformDocRouters = router.options.routes.filter(item=>item.hasOwnProperty('name') && item?.path.indexOf(`/document/${version}/${platform}`) == 0).map(item=>item.path)

  let newPath = route.path.split('/')
  newPath[3] = platform
  const nextPathPath = newPath.join('/')

  if (nextPlatformDocRouters.indexOf(nextPathPath) > -1) {
    router.push(nextPathPath)
  } else {
    router.push(`/document/${version}/${platform}/overview.html`)
  }
}

</script>


<template>
  <el-select v-model="platform" @change="onChange" placeholder="请选择">
    <template #prefix>
     <img width="20" height="20" :src="platformIcon">
    </template>
    <el-option-group
      v-for="group in platformOptions"
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
          <img class="default" width="20" height="20" :src="PLATFORM_ICON_MAP[item.value]?.icon" />
          <img class="active" width="20" height="20" :src="PLATFORM_ICON_MAP[item.value]?.activeIcon" />
        </span>
        <span>{{ item.label }}</span>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<style lang="scss" scope>

  .option-content:hover .default {
    display: none;
  }

  .option-content .active {
    display: none;
  }

  .option-content:hover .active {
    display: inline-block;
  }

  .label-icon {
    vertical-align: sub;
    padding-right: 5px;

  }

</style>