<template>
    <div class="page-edit">
        <div v-if="editLink" class="edit-link">
            <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
            <OutboundLink />
        </div>
        <div class="last-updated" v-if="this.$page.lastUpdated">{{ this.$site.themeConfig.locales[this.$localePath].lastUpdated }}{{ this.$page.lastUpdated }}</div>
    </div>
</template>

<script>
    import isNil from 'lodash/isNil';

    const outboundRE = /^[a-z]+:/i;
    const endingSlashRE = /\/$/;

    export default {
        computed: {
            editLink () {
                const showEditLink = isNil(this.$page.frontmatter.editLink)
                    ? this.$site.themeConfig.editLinks
                    : this.$page.frontmatter.editLink

                const {
                    repo,
                    docsDir = '',
                    docsBranch = 'master',
                    docsRepo = repo
                } = this.$site.themeConfig

                if (showEditLink && docsRepo && this.$page.relativePath) {
                    return this.createEditLink(
                        repo,
                        docsRepo,
                        docsDir,
                        docsBranch,
                        this.$page.relativePath
                    )
                }
                return null
            },

            editLinkText () {
                return (
                    this.$themeLocaleConfig.editLinkText
                    || this.$site.themeConfig.editLinkText
                    || `Edit this page`
                )
            }
        },
        methods: {
            createEditLink (repo, docsRepo, docsDir, docsBranch, path) {
                const bitbucket = /bitbucket.org/
                if (bitbucket.test(docsRepo)) {
                    const base = docsRepo
                    return (
                        base.replace(endingSlashRE, '')
                        + `/src`
                        + `/${docsBranch}/`
                        + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
                        + path
                        + `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
                    )
                }

                const gitlab = /gitlab.com/
                if (gitlab.test(docsRepo)) {
                    const base = docsRepo
                    return (
                        base.replace(endingSlashRE, '')
                        + `/-/edit`
                        + `/${docsBranch}/`
                        + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
                        + path
                    )
                }

                const base = outboundRE.test(docsRepo)
                ? docsRepo
                : `https://github.com/${docsRepo}`
                return (
                    base.replace(endingSlashRE, '')
                    + '/edit'
                    + `/${docsBranch}/`
                    + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
                    + path
                )
            }
        }
    }
</script>

<style>
    .page-edit {
        margin-top: 40px;
    }
    .edit-link a {
        font-size: 16px;
        color: #4e6e8e;
        transition: all .3s;
    }
    .edit-link a:hover {
        color: #1890ff;
    }
</style>