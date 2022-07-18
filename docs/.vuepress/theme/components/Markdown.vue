<script>
    export default {
        data() {
            return {
                toTopHide: true
            }
        },
        mounted() {
            const content = document.querySelector('.description-container');
            content.scrollTop = 0;
            const menu = document.querySelector('.table-of-contents');
            const _this = this;
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
        <Content/>
        <div class="back-to-top" :class="{hidden: toTopHide}" @click="backToTop">
                    
        </div>
    </div>
</template>