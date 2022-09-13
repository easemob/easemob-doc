<script>
import Header from '../components/Header';

export default {
    components: {
        Header
    },
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
            loading.close();
            this.$router.push(this.$localePath + this.$site.themeConfig.locales[this.$localePath].indexUri)
        }, 1000);
    }
}
</script>

<template>
  <!-- <div class="index-layout">
    <Header :key="this.$route.path + 'header'" />
    <Content :key="this.$route.path + 'content'"/>
  </div> -->
</template>