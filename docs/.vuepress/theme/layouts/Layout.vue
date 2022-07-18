<script>
import Header from '../components/Header';
import Sider from '../components/Sider';
import Markdown from '../components/Markdown';

export default {
    components: {
        Header,
        Sider,
        Markdown
    }
}
</script>

<template>
  <div class="theme-container">
    <Header :key="this.$route.path"/>
    <div class="content-container">
        <Sider :key="this.$route.path"/>
        <div class="description-container" :data-key="this.$page.key">
            <Markdown :key="this.$route.path"/>
            <div class="last-updated">{{ this.$page.lastUpdated }}</div>
        </div>
    </div>
  </div>
</template>

<style>
    @import url('../styles/index.styl');
</style>