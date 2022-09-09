<script>
    import SearchBox from '@SearchBox';

    export default {
        data() {
            return {
                path: '',
                localePath: '',
                mainNav: [],
                secondaryNav: [],
                extraNav: [],
                languageLabel: '',
                languages: [],
                defLanguage: '',
                mouseEnter: false,
                mouseLeave: false,
                isMobile: false,
                showMobileMenu: false,
                showSidebarMenu: false,
                showMobileLangList: false,
            }
        },
        components: {
            SearchBox
        },
        created() {
            this.path = this.$route.path.replace('/en/', '/').substr(1);
            this.localePath = this.$localePath;
            const locales = this.$site.themeConfig.locales[this.localePath];
            this.mainNav = locales.main_nav;
            this.secondaryNav = locales.secondary_nav;
            this.extraNav = locales.extra_nav;
            this.languageLabel = locales.selectText;
            this.defLanguage = locales.label;
            for (let key in this.$site.themeConfig.locales) {
                this.languages.push({
                    label: this.$site.themeConfig.locales[key].label,
                    path: key
                });
            }
        },
        mounted() {
            this.isMobile = document.body.clientWidth <= 991 ? true : false;
            window.onresize = () => {
                if (document.body.clientWidth <= 991) {
                    this.isMobile = true;
                } else {
                    this.isMobile = false;
                    document.querySelector('.sider-container').style.cssText = '';
                }
            }
        },
        methods: {
            mouseEnterLang(e) {
                this.mouseLeave = false;
                this.mouseEnter = true;
            },
            mouseLeaveLang(e) {
                this.mouseEnter = false;
                this.mouseLeave = true;

                document.getElementById('sub-menu').addEventListener('webkitAnimationEnd', (e) => {
                    if (e.animationName == 'slideUpOut') {
                        this.mouseLeave = false;
                        this.mouseEnter = false;
                    }
                });
            },
            toggleMenu() {
                this.showMobileMenu = !this.showMobileMenu;
            },
            toggleSidebar() {
                this.showSidebarMenu = !this.showSidebarMenu;

                document.querySelector('.sider-container').style.cssText = this.showSidebarMenu ? 'transform: translateX(0)' : 'transform: translateX(-100%)';
            },
            showLangList(e) {
                this.showMobileLangList = !this.showMobileLangList;

                const parent = e.currentTarget.parentNode;
                if (this.showMobileLangList) {
                    parent.querySelector('ul').style.height = (parent.querySelector('li').offsetHeight * this.languages.length) + 'px';
                } else {
                    parent.querySelector('ul').style.height = 0;
                }

            }
        }
    }
</script>

<template>
    <div>
        <div class="header-container" :class="{'mobile-header-container': isMobile}">
            <div class="logo">
                <router-link :to="localePath">
                    <span><img :src="$withBase('/logo.png')"></span>
                    <h1>{{ this.$site.locales[localePath].title }}</h1>
                </router-link>
            </div>
            <div class="nav pc-nav">
                <div class="main-nav">
                    <router-link v-for="item in mainNav" v-if="item.show === undefined || item.show !== false" :to="item.link" :class="{active: item.link.startsWith(localePath + path.split('/')[0] + '/')}">{{ item.text }}</router-link>
                </div>
                <div class="nav-extra">
                    <div class="search-container">
                        <SearchBox/>
                    </div>
                    <div class="secondary-nav">
                        <template v-for="item in secondaryNav">
                            <template v-if="item.link.startsWith('http://') || item.link.startsWith('https://')">
                                <a :href="item.link" target="_blank" v-if="item.show === undefined || item.show !== false">{{ item.text }}</a>
                            </template>
                            <template v-else>
                                <router-link :to="item.link" v-if="item.show === undefined || item.show !== false">{{ item.text }}</router-link>
                            </template>
                        </template>
                    </div>
                    <div v-if="this.$site.themeConfig.switchLang" class="switch-lang" @mouseenter="mouseEnterLang" @mouseleave="mouseLeaveLang">
                        <a href="javascript:;">{{ languageLabel }}<span class="triangle"></span></a>
                        <div class="sub-menu" id="sub-menu" :class="{'menu-hidden': !mouseEnter && !mouseLeave, 'slide-up-enter slide-up-enter-active': mouseEnter, 'slide-up-leave slide-up-leave-active': mouseLeave}">
                            <ul>
                                <li v-for="item in languages" :class="{active: item.path == localePath}"><router-link :to="item.path + path">{{ item.label }}</router-link></li>
                            </ul>
                        </div>
                    </div>
                    <div class="login-register">
                        <a :href="item.link" target="_blank" v-if="item.show === undefined || item.show !== false" v-for="item in extraNav">{{ item.text }}</a>
                    </div>
                </div>
            </div>
            <div class="mobile-nav">
                <template v-if="showMobileMenu">
                    <img :src="$withBase('/icon-close.png')" @click="toggleMenu" />
                </template>
                <template v-else>
                    <img :src="$withBase('/icon-menu.png')" @click="toggleMenu" />
                </template>
            </div>
        </div>
        <div class="m-header-search" v-if="isMobile && !showMobileMenu">
            <div class="sidebar-menu" v-if="!path.startsWith('api/')">
                <template v-if="showSidebarMenu">
                    <img :src="$withBase('/icon-close.png')" @click="toggleSidebar" />
                </template>
                <template v-else>
                    <img :src="$withBase('/icon-sidebar.png')" @click="toggleSidebar" />
                </template>
            </div>
            <div class="search-container">
                <SearchBox/>
            </div>
        </div>
        <div class="mobile-nav-list" v-if="showMobileMenu">
            <ul>
                <li v-for="item in mainNav" v-if="item.show === undefined || item.show !== false">
                    <router-link :to="item.link">{{ item.text }}</router-link>
                </li>
                <li v-for="item in secondaryNav" v-if="item.show === undefined || item.show !== false">
                    <router-link :to="item.link">{{ item.text }}</router-link>
                </li>
                <li v-for="item in extraNav" v-if="item.show === undefined || item.show !== false">
                    <router-link :to="item.link">{{ item.text }}</router-link>
                </li>
                <li class="switch-lang" :class="{open: showMobileLangList}">
                    <a @click="showLangList">{{ languageLabel }}</a>
                    <ul>
                        <li v-for="item in languages" :class="{active: item.path == localePath}"><router-link :to="item.path + path">{{ item.label }}</router-link></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<style>
    @-webkit-keyframes slideUpIn {
    0% {
        transform: scaleY(.8);
        transform-origin: 0% 0%;
        opacity: 0;
    }
    to {
        transform: scaleY(1);
        transform-origin: 0% 0%;
        opacity: 1;
    }
    }
    @keyframes slideUpIn {
    0% {
        transform: scaleY(.8);
        transform-origin: 0% 0%;
        opacity: 0;
    }
    to {
        transform: scaleY(1);
        transform-origin: 0% 0%;
        opacity: 1;
    }
    }
    @-webkit-keyframes slideUpOut {
    0% {
        transform: scaleY(1);
        transform-origin: 0% 0%;
        opacity: 1;
    }
    to {
        transform: scaleY(.8);
        transform-origin: 0% 0%;
        opacity: 0;
    }
    }
    @keyframes slideUpOut {
    0% {
        transform: scaleY(1);
        transform-origin: 0% 0%;
        opacity: 1;
    }
    to {
        transform: scaleY(.8);
        transform-origin: 0% 0%;
        opacity: 0;
    }
    }
</style>