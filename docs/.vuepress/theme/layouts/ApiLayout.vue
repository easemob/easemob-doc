<script>
    import Header from '../components/Header';
    import ApiContent from '../components/ApiContent';

    export default {
        data() {
            return {
                localePath: '',
                text: {}
            }
        },
        components: {
            Header,
            ApiContent
        },
        mounted() {
            this.localePath = this.$localePath;
            const locales = this.$site.themeConfig.locales[this.localePath];
            this.text = locales['/api/']
        }
    }
</script>

<template>
  <div class="theme-container">
    <Header :key="this.$route.path"/>
    <ApiContent :key="'api-content' + this.$page.path" />
  </div>
</template>

<style>
    @import url('../styles/index.styl');
</style>