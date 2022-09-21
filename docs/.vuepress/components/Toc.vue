<script>
    export default {
        data() {
            return {
                toc: []
            }
        },
        mounted() {
            let headers = [];
            if (this.$frontmatter.pageUri) {
                const page = this.$site.pages.filter(item => item.path === this.$frontmatter.pageUri);
                headers = page[0].headers;
            } else {
                headers = this.$page.headers;
            }
            this.toc =  headers ? headers.filter(item => item.level < 5) : [];
        }
    }
</script>

<template>
    <div class="table-of-contents" v-if="toc">
        <ul>
            <li v-for="item in toc"><a :href="'#' + item.slug" :class="'level-' + item.level">{{ item.title }}</a></li>
        </ul>
    </div>
</template>