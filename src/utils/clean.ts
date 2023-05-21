import { BLANK, CODE_BLOCK_REGEX } from '../constants';

/**
 * Cleans Markdown.
 *
 * @param markdown - The raw Markdown.
 * @returns - The cleaned Markdown.
 */
export function clean(markdown: string): string {
  return markdown.replace(CODE_BLOCK_REGEX, BLANK).trim();
}
