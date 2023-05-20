import { BULLET, INDENT, NEWLINE } from '../constants';
import type { Heading } from '../types';

/**
 * Transforms parsed Markdown headings to table of contents list.
 */
export function transform(headings: Heading[]): string {
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
 * @returns - The Markdown link.
 */
function createLink(text: string, fragment: string): string {
  return '[' + text + '](#' + fragment + ')';
}
