const fencedCodeBlockPattern = /(```[\s\S]*?```)/g

const normalizeMathDelimiters = (value: string): string => {
  return value
    .replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_match, content: string) => (
      `\n\n$$\n${content.trim()}\n$$\n\n`
    ))
    .replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_match, content: string) => (
      `$${content.trim()}$`
    ))
}

export const normalizeMarkdown = (value: string): string => {
  if (!value) return ''

  return value
    .split(fencedCodeBlockPattern)
    .map((part) => part.startsWith('```') ? part : normalizeMathDelimiters(part))
    .join('')
}
