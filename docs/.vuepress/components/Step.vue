<template>
  <div class="step">
    <span class="step-text">{{props.title}}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: ''
});
</script>

<style scoped>
    .step {
      display: table-cell;
      margin-right: .44rem;
      line-height: 1;
      vertical-align: middle;

      .step-text {
        padding: .125rem .625rem;
        background: var(--theme-color);
        color: #fff;
        font-size: .875rem;
        font-style: normal;
        font-weight: 600;
        border-radius: .375rem;
      }
    }
</style>
