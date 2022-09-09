<template>
    <div class="code-copy">
        <span class="change-theme" :class="theme" @click="changeTheme"></span>
        <span class="copy-btn" :class="theme" @click="copyToClipboard"></span>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                theme: 'dark'
            }
        },
        methods: {
            changeTheme() {
                this.theme = this.theme === 'dark' ? 'light' : 'dark';
                let href = '';
                if (this.theme === 'light') {
                    href = (this.$site.base ? this.$site.base : '/') + 'prism-default.css';
                }
                
                document.querySelector('#code-theme').setAttribute('href', href);
            },
            copyToClipboard(el) {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(this.code).then(
                        () => {
                            // this.setSuccessTransitions()
                            this.$message({
                                message: '复制成功',
                                type: 'success'
                            });
                        },
                        () => {}
                    )
                } else {
                    let copyelement = document.createElement('textarea');
                    document.body.appendChild(copyelement);
                    copyelement.value = this.code;
                    copyelement.select();
                    document.execCommand('Copy');
                    copyelement.remove();
                }
            },
        }
    }
</script>