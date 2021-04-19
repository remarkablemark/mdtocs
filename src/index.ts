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

const HEADINGS_REGEX = /^(#{1,6}[ \t].+)$|^(.+[\r\n][=-]{3,})$/gm;
const HEADING_REGEX = /^(#+)[ \t](.+)$|^(.+)[\r\n]([=-])/;
const HYPHEN = '-';

type Heading = {
  level: number;
  text: string;
  fragment: string;
  previous?: Heading;
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
  const initialHeadings: Heading[] = [];

  return headings.reduce((accumulator, currentHeading, index) => {
    const headingMatch = currentHeading.match(HEADING_REGEX);

    if (headingMatch === null) {
      return accumulator;
    }

    let level;
    let text;

    // get heading level and text
    if (headingMatch[4]) {
      text = headingMatch[3].trim();
      if (!text) {
        return accumulator;
      }
      level = headingMatch[4] === HYPHEN ? 2 : 1;
    } else {
      text = headingMatch[2].trim();
      if (!text) {
        return accumulator;
      }
      level = headingMatch[1].length;
    }

    return accumulator.concat({
      level,
      text,
      fragment: createFragment(text, fragments),
      previous: accumulator[index - 1],
    });
  }, initialHeadings);
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
