/**
 * Generates table of contents given Markdown.
 *
 * @param {string} markdown - The markdown.
 * @return {string} - The table of contents.
 */
export function mdtocs(markdown: string): string {
  validateMarkdown(markdown);
  return transformMarkdownHeadings(parseMarkdownHeadings(markdown));
}

/**
 * Validates markdown.
 *
 * @param {string} markdown - The markdown.
 * @throws {TypeError} - The first argument must be a string.
 */
function validateMarkdown(markdown: string): void {
  if (typeof markdown !== 'string') {
    throw new TypeError('First argument must be a string');
  }
}

/**
 * @see {@link https://www.markdownguide.org/basic-syntax/}
 */
const HEADINGS_REGEX = /^(#{1,6}[ \t].+)$|^(.+[\r\n][=-]{3,})$/gm;
const HEADING_REGEX = /^(#+)[ \t](.+)$|^(.+)[\r\n]([=-])/;
const HYPHEN = '-';

type Heading = {
  level: number;
  text: string;
  fragment: string;
};
type Fragments = Record<string, number>;

/**
 * Parses headings from markdown.
 *
 * @param {string} markdown - The markdown.
 * @return {Heading[]} - The headings.
 */
function parseMarkdownHeadings(markdown: string): Heading[] {
  const headings = markdown.match(HEADINGS_REGEX);

  if (headings === null) {
    return [];
  }

  const fragments: Fragments = {};
  const initialValue: Heading[] = [];

  return headings.reduce((accumulator, currentHeading) => {
    const headingMatch = currentHeading.match(HEADING_REGEX);

    if (headingMatch === null) {
      return accumulator;
    }

    const [
      ,
      headingLevel,
      headingText,
      headingTextAlternate,
      headingLevelAlternate,
    ] = headingMatch;

    let text;
    let level;

    // Heading level 1
    // ===
    // Heading level 2
    // ---
    if (headingLevelAlternate) {
      text = headingTextAlternate.trim();
      level = headingLevelAlternate === HYPHEN ? 2 : 1;

      // # Heading level 1
      // ...
      // ###### Heading level 6
    } else {
      text = headingText.trim();
      level = headingLevel.length;
    }

    if (!text) {
      return accumulator;
    }

    return accumulator.concat({
      level,
      text,
      fragment: createFragment(text, fragments),
    });
  }, initialValue);
}

const SPACE = ' ';
const INDENT = SPACE.repeat(2);
const BULLET = HYPHEN + SPACE;
const NEWLINE = '\n';

/**
 * Transforms parsed markdown headings to table of contents list.
 */
function transformMarkdownHeadings(headings: Heading[]): string {
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

const WHITESPACE_REGEX = /\s/;
const INVALID_FRAGMENT_REGEX = /[^a-zA-Z0-9_-]/g;

/**
 * Creates fragment from heading text.
 *
 * @param {string} text - The heading text.
 * @param {Fragments} fragments - The fragment to count map.
 * @return {string} - The fragment.
 */
function createFragment(text: string, fragments: Fragments): string {
  const fragment = text
    .toLowerCase()
    .split(WHITESPACE_REGEX)
    .join('-')
    .replace(INVALID_FRAGMENT_REGEX, '');

  const count = fragments[fragment];

  if (count) {
    fragments[fragment]++;
    return fragment + HYPHEN + count;
  }

  fragments[fragment] = 1;
  return fragment;
}

/**
 * Creates link from heading text and fragment.
 *
 * @param {string} text - The heading text.
 * @param {string} fragment - The fragment.
 * @return {string} - The markdown link.
 */
function createLink(text: string, fragment: string): string {
  return '[' + text + '](#' + fragment + ')';
}
