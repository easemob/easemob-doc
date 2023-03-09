<script>
    export default {
        props: ['type', 'title']
    }
</script>

<template>
      <div :class="`hint-container ${type==='notice'?'warning':type}`">
          <p class="hint-container-title">{{title}}</p>
          <p>
              <slot></slot>
          </p>
      </div>
</template>