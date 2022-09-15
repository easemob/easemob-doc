const path = require('path');

module.exports = (options, ctx) => ({
  define: {
    selector: options.selector || 'div[class*="language-"] pre'
  },
  name: 'vuepress-plugin-code-copy',
  /*
  extendPageData ($page) {
    $page.headersStr = ''
    $page.content = ''
    $page.normalizedContent = ''
  },
  */
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
})