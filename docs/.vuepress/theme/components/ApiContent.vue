<script>
    import Platform from './Platform';
    import Markdown from './Markdown';

    export default {
        data() {
            return {
                localePath: '',
                text: {}
            }
        },
        components: {
            Platform,
            Markdown
        },
        mounted() {
            this.localePath = this.$localePath;
            const locales = this.$site.themeConfig.locales[this.localePath];
            this.text = locales['/api/'];
        }
    }
</script>

<template>
    <div class="content-container api-content-container">
        <h2>{{text.h2}}</h2>
        <div class="description">
            {{text.description}}
        </div>
        <div class="api-platform">
            <Platform :key="this.$page.path" />
        </div>
        <div class="description-container api-description-container">
            <Markdown :key="this.$route.path"/>
        </div>
    </div>
</template>

<style>
    .api-content-container {
        padding-top: 50px;
        flex-direction: column;
    }
    .api-content-container h2 {
        font-size: 32px;
        font-weight: 700;
        color: #191919;
    }
    .api-content-container .description {
        margin: 50px 0;
        font-size: 15px;
        line-height: 26px;
        color: #586376
    }
    .api-description-container {
        position: static !important;
        padding: 24px 20px !important;
        background-color: #f9f9fc;
        border-radius: 4px;
    }
    .api-description-container .content__default {
        padding-right: 0 !important;
    }
    .api-description-container .content__default h1 {
        margin: 0 0 18px 0 !important;
        font-size: 18px !important;
        font-weight: 400 !important;
        color: #191919 !important;
        line-height: 1 !important;
    }
    .api-description-container .content__default p {
        font-size: 15px !important;
        font-weight: 400 !important;
        line-height: 26px !important;
        color: #586376 !important;
    }
    .api-description-container .content__default h1+p {
        margin: 0;
    }
</style>