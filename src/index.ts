const HEADING_REGEX = /^(#+)[ \t](.+)$|^(.+)[\r\n]([=-])/;
const WHITESPACE_REGEX = /\s/;
const INVALID_FRAGMENT_REGEX = /[^a-zA-Z0-9_-]/g;

const SPACE = ' ';
const HYPHEN = '-';
const MARKDOWN_BULLET = HYPHEN + SPACE;
const MARKDOWN_INDENT_LENGTH = 2;
const MARKDOWN_INDENT = Array(MARKDOWN_INDENT_LENGTH + 1).join(SPACE); // SPACE + SPACE
const NEWLINE = '\n';

/**
 * Generates table of contents given Markdown.
 */
export function mdtocs(markdown: string): string {
  validateMarkdown(markdown);
  return transformMarkdownHeadings(parseMarkdownHeadings(markdown));
}

/**
 * Validates markdown.
 */
function validateMarkdown(markdown: string): void {
  if (typeof markdown !== 'string') {
    throw new TypeError('First argument must be a string');
  }
}

const HEADINGS_REGEX = /^(#{1,6}[ \t].+)$|^(.+[\r\n][=-]{3,})$/gm;

type Heading = {
  level: number;
  text: string;
  fragment: string;
  previous?: Heading;
};

/**
 * Parses markdown headings.
 */
function parseMarkdownHeadings(markdown: string): Heading[] {
  const headings = markdown.match(HEADINGS_REGEX);

  if (headings === null) {
    return [];
  }

  const fragments: Record<string, number> = {};
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

    let fragment = getFragment(text);
    const fragmentCount = fragments[fragment];

    if (fragmentCount) {
      fragments[fragment] += 1;
      fragment += '-' + fragmentCount;
    } else {
      fragments[fragment] = 1;
    }

    const previous = accumulator[index - 1];

    const current = {
      level,
      text,
      fragment,
      previous,
    };

    return accumulator.concat(current);
  }, initialHeadings);
}

/**
 * Transforms parsed markdown headings to table of contents list.
 */
function transformMarkdownHeadings(headings: Heading[]): string {
  return headings.reduce((accumulator, heading) => {
    const { level, text, fragment } = heading;
    return (
      accumulator +
      MARKDOWN_INDENT.repeat(level - 1) +
      MARKDOWN_BULLET +
      getLink(text, fragment) +
      NEWLINE
    );
  }, '');
}

/**
 * Transforms heading to URL fragment (without #).
 */
function getFragment(heading: string): string {
  return heading
    .toLowerCase()
    .split(WHITESPACE_REGEX)
    .join('-')
    .replace(INVALID_FRAGMENT_REGEX, '');
}

/**
 * Transforms heading and fragment to Markdown.
 */
function getLink(heading: string, fragment: string): string {
  return '[' + heading + '](#' + fragment + ')';
}
