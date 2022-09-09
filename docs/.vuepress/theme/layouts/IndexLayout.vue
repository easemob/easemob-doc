<script>
import Header from '../components/Header';

export default {
    components: {
        Header
    },
    mounted() {
        this.$router.push(this.$localePath + this.$site.themeConfig.locales[this.$localePath].indexUri)
    }
}
</script>

<template>
  <div class="index-layout">
    <Header :key="this.$route.path + 'header'" />
    <Content :key="this.$route.path + 'content'"/>
  </div>
</template>