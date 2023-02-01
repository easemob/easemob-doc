<script>
export default {
    props: ['all'],
    data() {
        return {
            rootPath: '',
            localePath: '',
            path: '', // 去除语言目录路径
            uri: '',
            root: '',
            language: '',
            version: '',
            file: '',
            enter: false,
            leave: false,
            platformShow: false,
            platform: [],
            default_platform: {},
        }
    },
    created() {
        this.rootPath = this.$site.base;
        this.localePath = this.$localePath;
        this.uri = this.$page.path;
        this.platformShow = this.uri.startsWith(this.localePath + 'document/') || this.uri.startsWith(this.localePath + 'api/') ? true : false;
        const locales = this.$site.themeConfig.locales[this.localePath];
        this.platform = locales.platform;
        const path = this.$route.path.replace('/en/', '/');
        this.path = path.substr(0, path.lastIndexOf('/') + 1);
        let temp = path.split('/');
        this.file = temp[temp.length - 1];
        temp.splice(temp.length - 1, 1, '');
        this.root = temp[1] ? temp[1] : '';
        this.language = temp[2] ? temp[2] : '';
        this.version = temp[3] ? temp[3] : '';
        for (let i = 0; i < this.platform.length; i++) {
            for (let j = 0; j < this.platform[i].children.length; j++) {
                if (this.platform[i].children[j].key === this.language) {
                    this.default_platform = this.platform[i].children[j];
                    break;
                }
            }
        }
    },
    mounted() {
        window.onclick = (e) => {
            this.platformToggleUp(e);
        };
    },
    methods: {
        platformClick(event) {
            if (this.enter) {
                this.platformToggleUp(event);
            } else {
                this.platformToggleDown(event);
            }
        },
        platformToggleUp(event) {
            if (this.enter && !this.leave) {
                this.enter = false;
                this.leave = true;

                document.getElementById('platform-list').addEventListener('webkitAnimationEnd', (e) => {
                    if (e.animationName == 'slideUpOut') {
                        this.enter = false;
                        this.leave = false;
                    }
                });
                event.stopPropagation();
            }
        },
        platformToggleDown(event) {
            this.leave = false;
            this.enter = true;
            event.stopPropagation();
            const plat_list = [...document.querySelectorAll('.option-item')]
            plat_list.map(item => {
                if (item.getAttribute('data-key') === this.default_platform.key) {
                    item.children[2].style.fontWeight = '500'
                    item.children[2].style.color = 'black'
                    item.classList.add('active');
                } else {
                    item.children[2].style.fontWeight = '400'
                    item.children[2].style.color = '#586376'
                    item.classList.remove('active');
                }
            })
        },
        switchPlatform(e) {
            const key = e.currentTarget.getAttribute('data-key');
            const pages = this.$site.pages;
            let uri = '';

            if (this.root === 'api') {
                uri = this.localePath + this.root + '/' + key + '/';
            } else {
                for (let i = 0; i < pages.length; i++) {
                    if (pages[i].regularPath === this.localePath + this.root + '/' + key + '/' + this.file) {
                        uri = pages[i].regularPath;
                        break;
                    }
                }

                if (!uri) {
                    const platform = this.$site.themeConfig.locales[this.localePath].platform;
                    for (let i = 0; i < platform.length; i++) {
                        for (let j = 0; j < platform[i].children.length; j++) {
                            if (platform[i].children[j].key == key) {
                                uri = this.localePath + this.root + '/' + key + '/' + platform[i].children[j].uri;
                                break;
                            }
                        }
                    }
                }
            }
            // console.log(uri);
            this.$router.push(uri).catch(err => { });
        },
        handleMouseEnter(e) {
            e.target.classList.add('active');
        },
        handleMouseLeave(e) {
            if (e.target.getAttribute('data-key') !== this.default_platform.key) {
                e.target.classList.remove('active');
            }
        }
    }
}
</script>

<template>
    <div class="platform" v-show="platformShow">
        <div class="platform-input" @click="platformClick">
            <div class="platform-text">
                <img :src="rootPath + default_platform.hover_icon" alt="">
                <span>{{ root === 'api' ? default_platform.title === 'Web' ? 'Web/小程序' : default_platform.title :
                default_platform.title }}</span>
            </div>
            <div class="select-icon"><i class="icon-arrow" :class="{ open: enter && !leave }"></i></div>
        </div>
        <div class="platform-list" id="platform-list"
            :class="{ 'menu-hidden': !enter && !leave, 'slide-up-enter slide-up-enter-active': enter, 'slide-up-leave slide-up-leave-active': leave }"
            @click="platformToggleDown">
            <template v-for="group in platform">
                <div class="group" :key="group.title"
                    v-if="(group.show === undefined || group.show !== false) && ((!group.only && !group.except) || (group.only && group.only.indexOf(root) !== -1) || (group.except && group.except.indexOf(root) === -1))">
                    <div class="group-title">{{ group.title }}</div>
                    <div class="options">
                        <template v-for="item in group.children">
                            <div class="option-item" :key="item.key" :data-key="item.key" @click="switchPlatform"
                                @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
                                v-if="(item.show === undefined || item.show !== false) && ((!item.only && !item.except) || (item.only && item.only.indexOf(root) !== -1) || (item.except && item.except.indexOf(root) === -1)) && (root === 'api' ? item.title === '小程序' ? false : true : true)">
                                <img :src="rootPath + item.icon" class="default" alt="">
                                <img :src="rootPath + item.hover_icon" class="active" alt="">
                                <span>{{ root === 'api' ? item.key === 'web' ? 'Web/小程序' : item.title : item.title
                                }}</span>
                            </div>
                        </template>
                    </div>
                </div>
            </template>

        </div>
    </div>
</template>