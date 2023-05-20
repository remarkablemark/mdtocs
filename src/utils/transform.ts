import { BULLET, INDENT, NEWLINE } from '../constants';
import type { Heading } from '../types';

/**
 * Transforms parsed markdown headings to table of contents list.
 */
export function transformMarkdownHeadings(headings: Heading[]): string {
  return headings.reduce((accumulator, heading) => {
    const { level, text, fragment } = heading;
    return (
      accumulator +
      INDENT.repeat(level - 1) +
      BULLET +
      createLink(text, fragment) +
      NEWLINE
    );
  }, '');
}

/**
 * Creates link from heading text and fragment.
 *
 * @param text - The heading text.
 * @param fragment - The fragment.
 * @returns - The markdown link.
 */
function createLink(text: string, fragment: string): string {
  return '[' + text + '](#' + fragment + ')';
}
