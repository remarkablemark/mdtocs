const HEADINGS_REGEX = /^(#{1,6}[ \t].+)$|^(.+[\r\n][=-]{3,})$/gm;
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
  const headings = markdown.match(HEADINGS_REGEX);

  if (headings === null) {
    return '';
  }

  let result = '';
  let previousLevel = null;
  let indent = '';
  const fragments: Record<string, number> = {};

  for (let i = 0, len = headings.length; i < len; i++) {
    const heading = headings[i].match(HEADING_REGEX);

    if (heading === null) {
      continue;
    }

    let currentLevel;
    let headingText;

    // get heading level and text
    if (heading[4]) {
      headingText = heading[3].trim();
      if (!headingText) {
        continue;
      }
      currentLevel = heading[4] === HYPHEN ? 2 : 1;
    } else {
      headingText = heading[2].trim();
      if (!headingText) {
        continue;
      }
      currentLevel = heading[1].length;
    }

    // build indent
    if (!previousLevel) {
      // continue
    } else if (currentLevel === 1) {
      indent = '';
    } else if (currentLevel > previousLevel) {
      indent += MARKDOWN_INDENT;
    } else if (currentLevel < previousLevel) {
      indent = indent.slice(MARKDOWN_INDENT_LENGTH);
    }
    previousLevel = currentLevel;

    let fragment = getFragment(headingText);
    const fragmentCount = fragments[fragment];

    if (fragmentCount > 0) {
      fragments[fragment] += 1;
      fragment += '-' + fragmentCount;
    } else if (fragmentCount === undefined) {
      fragments[fragment] = 1;
    }

    result +=
      indent + MARKDOWN_BULLET + getLink(headingText, fragment) + NEWLINE;
  }

  return result;
}

/**
 * Validates markdown.
 */
function validateMarkdown(markdown: string): void {
  if (typeof markdown !== 'string') {
    throw new TypeError('First argument must be a string');
  }
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
