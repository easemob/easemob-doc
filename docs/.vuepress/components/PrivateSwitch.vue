
<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter} from 'vue-router'

const PLATFORM_INDEX_URL = {
  im: '/private/im/uc_deploy.html',
  media: '/private/media/common_introduction.html'
}

const platform = ref('im')
const route = useRoute()
const router = useRouter()
watch(()=>route.path, ()=> {
  if (route.path.indexOf('/private') == 0) {
    platform.value = route.path.split('/')[2]
  }
}, {immediate:true})

// 切换平台，如果有相同路径的route就直接跳转
const onChange = (platform) => {
  router.push(PLATFORM_INDEX_URL[platform])
}

const options = [
  {
    label: '即时通讯',
    value: 'im'
  },
  {
    label: '音视频',
    value: 'media'
  }
]
</script>


<template>
  <el-select v-model="platform" @change="onChange" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <span>{{ item.label }}</span>
    </el-option>
  </el-select>
</template>