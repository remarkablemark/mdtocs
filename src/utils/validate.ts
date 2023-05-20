/**
 * Validates Markdown.
 *
 * @param markdown - The Markdown.
 * @returns - The Markdown.
 * @throws - The first argument must be a string.
 */
export function validate(markdown: string): string {
  if (typeof markdown !== 'string') {
    throw new TypeError('First argument must be a string');
  }
  return markdown;
}
