import { useHref } from "react-router-dom"

import { WIKILINKSregex as WIKILINKSregex } from "obsidian-index-wikilinks/dist/lib/wikilinkRegex"

export const noteToMarkdownContent = (base, note) => {
  const out = `# ${note.title ?? ''}\n\n${note.content}`
  return out.replaceAll(
    WIKILINKSregex,
    (_match, index, _block, title) => {
      return `[${title ?? index}](${base}/${encodeURIComponent(index)})`
    }
  )
}

export const useBase = () => {
  const base = useHref("/")
  return base === '/' ? '' : base
}
