<template>
    <div>
        <template v-if="menu.collapsable">
            <a href="javascript:;" @click="toggleSub">{{ menu.text }}<i class="icon-arrow" :class="{open: menu.active}"></i></a>
        </template>
        <template v-else>
            <a href="javascript:;">{{ menu.text }}</a>
        </template>
        <ul class="sider-menu-sub" :class="{'collapsable': menu.collapsable, 'menu-hidden': !menu.active}">
            <li v-for="itm in menu.children" :class="{active: itm.link == file}" v-if="(itm.show === undefined || itm.show !== false) && (!language || ((!itm.only && !itm.except) || (itm.only && itm.only.indexOf(language) !== -1) || (itm.except && itm.except.indexOf(language) === -1)))"><router-link :to="itm.link.slice(0, 1) == '/' ? itm.link : (path + itm.link)">{{ itm.text }}</router-link></li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ['menu'],
        data() {
            return {
                path: '', // 去除语言目录路径
                file: '',
            }
        },
        created() {
            const path = this.$route.path.replace('/en/', '/');
            let temp = path.split('/');
            temp.splice(temp.length - 1, 1, '');
            this.root = temp[1] ? temp[1] : '';
            this.language = temp[2] ? temp[2] : '';
            this.version = temp[3] ? temp[3] : '';
            this.path = this.$localePath + this.root + '/' + (this.language ? this.language + '/' : '');
            
            temp = this.$page.regularPath.split('/');
            this.file = temp[temp.length - 1];
            this.menu.active = false;
            for (let i = 0; i < this.menu.children.length; i++) {
                if (this.menu.children[i].link == this.file) {
                    this.menu.active = true;
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