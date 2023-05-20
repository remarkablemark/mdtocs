/**
 * Validates markdown.
 *
 * @param markdown - The markdown.
 * @throws - The first argument must be a string.
 */
export function validate(markdown: string): void {
  if (typeof markdown !== 'string') {
    throw new TypeError('First argument must be a string');
  }
}
