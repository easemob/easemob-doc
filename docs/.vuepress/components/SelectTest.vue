<template>
  <div style="margin: 20px; text-align: right;">
    <el-select v-model="value" placeholder="请选择" placement="bottom-end" style="width: 200px;">
      <el-option label="选项1" value="1" />
      <el-option label="选项2" value="2" />
      <el-option label="选项3" value="3" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>