import {
  parseMarkdownHeadings,
  transformMarkdownHeadings,
  validateMarkdown,
} from './utils';

/**
 * Generates table of contents given Markdown.
 *
 * @param markdown - The markdown.
 * @returns - The table of contents.
 */
export function mdtocs(markdown: string): string {
  validateMarkdown(markdown);
  return transformMarkdownHeadings(parseMarkdownHeadings(markdown));
}
