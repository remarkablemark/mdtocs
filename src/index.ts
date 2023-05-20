import {
  parseMarkdownHeadings,
  transformMarkdownHeadings,
  validate,
} from './utils';

/**
 * Generates table of contents given Markdown.
 *
 * @param markdown - The markdown.
 * @returns - The table of contents.
 * @throws - The first argument must be a string.
 */
export function mdtocs(markdown: string): string {
  validate(markdown);
  return transformMarkdownHeadings(parseMarkdownHeadings(markdown));
}
