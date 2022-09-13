<script>
import Header from '../components/Header';
import Sider from '../components/Sider';
import Markdown from '../components/Markdown';
import PageEdit from '../components/PageEdit';


export default {
    components: {
        Header,
        Sider,
        Markdown,
        PageEdit
    }
}
</script>

<template>
  <div class="theme-container">
    <Header :key="this.$route.path + 'header'"/>
    <div class="content-container">
        <Sider :key="this.$route.path + 'sider'"/>
        <div class="description-container" :data-key="this.$page.key">
            <Markdown :key="this.$route.path"/>
            <PageEdit :key="this.$route.path + 'page-edit'"/>
        </div>
    </div>
    <link id="code-theme" rel="stylesheet" />
  </div>
</template>

<style>
    @import url('../styles/index.styl');
</style>