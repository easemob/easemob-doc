<script>
    export default {
        data() {
            return {
                pageKey: '',
                toTopHide: true
            }
        },
        mounted() {
            if (this.$frontmatter.pageUri) {
                const page = this.$site.pages.filter(item => item.path === this.$frontmatter.pageUri);
                if (page.length > 0) {
                    this.pageKey = page[0].key;
                }
            }
            const content = document.querySelector('.description-container');
            if (location.hash && location.hash !== '#') {
                setTimeout(function(){
                    const el = document.querySelector(decodeURIComponent(location.hash));
                    if (el && el.offsetTop) {
                        content.scrollTo(0, el.offsetTop);
                    }
                }, 100);
            } else {
                content.scrollTo(0, 0);
            }

            const _this = this;
            setTimeout(function(){
                const menu = document.querySelector('.table-of-contents');
                if (menu) {
                    const liFirst = menu.querySelector('ul').querySelector('li');
                    if (liFirst) {
                        liFirst.classList.add('active');
                        const lis = menu.querySelectorAll('li');
                        const anchor = menu.querySelectorAll('a[href^="#"]');
                        let dom = null;

                        document.querySelector('.description-container').onscroll = function() {
                            for (let i = 0; i < anchor.length; i++) {
                                if (document.querySelector(anchor[i].getAttribute('href')) && this.scrollTop >= document.querySelector(anchor[i].getAttribute('href')).offsetTop - 10) {
                                    for (let j = 0; j < lis.length; j++) {
                                        lis[j].classList.remove('active');
                                    }
                                    anchor[i].parentNode.classList.add('active');
                                }
                            }

                            _this.toTopHide = this.scrollTop >= 500 ? false : true;
                        }
                    }
                }
            }, 500);
        },
        methods: {
            backToTop() {
                document.querySelector('.description-container').scrollTo({ top: 0, behavior: 'smooth' })
            }
        }
    }
</script>

<template>
    <div>
        <template v-if="this.$frontmatter.pageUri">
        <Content :pageKey="pageKey" />
        </template>
        <template v-else>
        <Content />
        </template>
        <div class="back-to-top" :class="{hidden: toTopHide}" @click="backToTop">
                    
        </div>
    </div>
</template>