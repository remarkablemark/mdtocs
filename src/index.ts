import {
  BULLET,
  HEADING_REGEX,
  HEADINGS_REGEX,
  HYPHEN,
  INDENT,
  INVALID_FRAGMENT_REGEX,
  NEWLINE,
  WHITESPACE_REGEX,
} from './constants';

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

/**
 * Validates markdown.
 *
 * @param markdown - The markdown.
 * @throws - The first argument must be a string.
 */
function validateMarkdown(markdown: string): void {
  if (typeof markdown !== 'string') {
    throw new TypeError('First argument must be a string');
  }
}

interface Heading {
  level: number;
  text: string;
  fragment: string;
}

type Fragments = Record<string, number>;

/**
 * Parses headings from markdown.
 *
 * @param markdown - The markdown.
 * @returns - The headings.
 */
function parseMarkdownHeadings(markdown: string): Heading[] {
  const headings = markdown.match(HEADINGS_REGEX);

  /* istanbul ignore next */
  if (headings === null) {
    return [];
  }

  const fragments: Fragments = {};
  const initialValue: Heading[] = [];

  return headings.reduce((accumulator, heading) => {
    const [level, text] = getHeadingLevelAndText(heading);

    if (level && text) {
      accumulator.push({
        level,
        text,
        fragment: createFragment(text, fragments),
      });
    }

    return accumulator;
  }, initialValue);
}

/**
 * Gets heading level and text.
 *
 * @param heading - The markdown heading.
 * @returns - The heading level and text.
 */
function getHeadingLevelAndText(heading: string): [] | [number, string] {
  const headingMatch = heading.match(HEADING_REGEX);

  /* istanbul ignore next */
  if (headingMatch === null) {
    return [];
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
    level = headingLevelAlternate === HYPHEN ? 2 : 1;
    text = headingTextAlternate.trim();

    // # Heading level 1
    // ...
    // ###### Heading level 6
  } else {
    level = headingLevel.length;
    text = headingText.trim();
  }

  if (!text) {
    return [];
  }

  return [level, text];
}

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

/**
 * Creates fragment from heading text.
 *
 * @param text - The heading text.
 * @param fragments - The fragment to count map.
 * @returns - The fragment.
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
 * @param text - The heading text.
 * @param fragment - The fragment.
 * @returns - The markdown link.
 */
function createLink(text: string, fragment: string): string {
  return '[' + text + '](#' + fragment + ')';
}
