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
.header-container .nav .main-nav a:last-child{
    -webkit-text-fill-color: transparent;
    background: linear-gradient(45deg, #009688, yellowgreen, pink, #03a9f4, #9c27b0, #8bc34a);
    background-clip: text;   
    animation: huerotate 1.5s infinite; 
};
@keyframes huerotate {
    100% {
        filter: hue-rotate(360deg);
    }
    
}
    @import url('../styles/index.styl');
</style>