import type MarkdownIt from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer'
import container from 'markdown-it-container'


export const containerPlugin = (md: MarkdownIt) => {
  md.use(...createContainer('notice', '提示', md))
}

type ContainerArgs = [typeof container, string, { render: RenderRule }]

function createContainer(
  klass: string,
  defaultTitle: string,
  md: MarkdownIt
): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx) {
        const token = tokens[idx]
        const info = token.info.trim().slice(klass.length).trim()
        if (token.nesting === 1) {
          const title = md.renderInline(info || defaultTitle)
          return `<div class="${klass=='notice'?'note':klass} hint-container"><p class="hint-container-title">${title}</p>\n`
        } else {
          return `</div>\n`
        }
      }
    }
  ]
}
