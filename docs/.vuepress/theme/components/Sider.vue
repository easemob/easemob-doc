<script>
    import Platform from '../components/Platform';

    export default {
        data() {
            return {
                localePath: '',
                path: '', // 去除语言目录路径
                uri: '',
                root: '',
                language: '',
                version: '',
                file: '',
                sidebar: []
            }
        },
        components: {
            Platform,
        },
        created() {
            this.localePath = this.$localePath;
            this.uri = this.$page.path;
            const locales = this.$site.themeConfig.locales[this.localePath];
            const path = this.$route.path.replace('/en/', '/');
            let temp = path.split('/');
            this.file = temp[temp.length - 1];
            temp.splice(temp.length - 1, 1, '');
            this.root = temp[1] ? temp[1] : '';
            this.language = temp[2] ? temp[2] : '';
            this.version = temp[3] ? temp[3] : '';
            this.sidebar = locales.sidebar[temp.join('/')];
            this.path = this.$localePath + this.root + '/' + (this.language ? this.language + '/' : '');

            if (!this.sidebar) {
                for (let i = temp.length - 2; i > 0 ; i--) {
                    let tempPath = '/';
                    for (let j = 1; j <= i; j++) {
                        tempPath += temp[j] + '/';
                    }
                    
                    this.sidebar = locales.sidebar[tempPath];
                    if (this.sidebar) {
                        break;
                    }
                }
            }
        },
        methods: {
            toggleSub(e) {
                if (e.target.querySelector('.icon-arrow').classList.contains('open')) {
                    e.target.querySelector('.icon-arrow').classList.remove('open');
                    e.target.nextElementSibling.style.display = 'none';
                } else {
                    document.querySelector('.open') && document.querySelector('.open').classList.remove('open');
                    const sub = document.querySelectorAll('.collapsable');
                    for (let i = 0; i < sub.length; i++) {
                        sub[i].style.display = 'none';
                    }
                    
                    e.target.querySelector('.icon-arrow').classList.add('open');
                    e.target.nextElementSibling.style.display = 'block';
                }
                e.stopPropagation();
            }
        }
    }
</script>

<template>
    <div class="sider-container">
        <Platform :key="uri"/>
        <div class="sider-menu">
            <div class="item" v-for="group in sidebar" v-if="(group.show === undefined || group.show !== false) && (!language || ((!group.only && !group.except) || (group.only && group.only.indexOf(language) !== -1) || (group.except && group.except.indexOf(language) === -1)))">
                <h2>{{ group.title }}</h2>
                <ul>
                    <li v-for="item in group.children" :class="{active: item.link == file}" v-if="(item.show === undefined || item.show !== false) && (!language || ((!item.only && !item.except) || (item.only && item.only.indexOf(language) !== -1) || (item.except && item.except.indexOf(language) === -1)))">
                        <template v-if="item.children">
                            <template v-if="item.collapsable">
                                <a href="javascript:;" @click="toggleSub">{{ item.text }}<i class="icon-arrow"></i></a>
                            </template>
                            <template v-else>
                                <a href="javascript:;">{{ item.text }}</a>
                            </template>
                            <ul class="sider-menu-sub" :class="{'collapsable menu-hidden': item.collapsable}">
                                <li v-for="itm in item.children" :class="{active: itm.link == file}" v-if="(itm.show === undefined || itm.show !== false) && (!language || ((!itm.only && !itm.except) || (itm.only && itm.only.indexOf(language) !== -1) || (itm.except && itm.except.indexOf(language) === -1)))"><router-link :to="path + itm.link">{{ itm.text }}</router-link></li>
                            </ul>
                        </template>
                        <template v-else>
                            <router-link :to="path + item.link" v-if="(item.show === undefined || item.show !== false) && (!language || ((!item.only && !item.except) || (item.only && item.only.indexOf(language) !== -1) || (item.except && item.except.indexOf(language) === -1)))">{{ item.text }}</router-link>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style>
    .sider-container {
        position: relative;
        padding: 20px;
        width: 250px;
        height: 100%;
        background-color: #f7f7fa;
        overflow: hidden auto;
    }
    .sider-menu .item+.item {
        margin-top: 36px;
    }
    .sider-menu h2 {
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        color: #191919;
    }
    .sider-menu li {
        margin-top: 15px;
    }
    .sider-menu li a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: HelveticaNeue;
        font-size: 14px;
        line-height: 16px;
        color: #586376;
        transition: all .3s;
    }
    .sider-menu li a:hover, .sider-menu li.active a {
        color: #1890ff;
    }
    .sider-menu li ul {
        padding-left: 12px;
        border-left: 2px solid #dfdfe5;
        transition: all .3s;
    }
    .sider-menu li ul li.active {
        margin-left: -14px;
        padding-left: 12px;
        border-left: 2px solid #1890ff;
    }
</style>