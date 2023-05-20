import {
  HEADING_REGEX,
  HEADINGS_REGEX,
  HYPHEN,
  INVALID_FRAGMENT_REGEX,
  WHITESPACE_REGEX,
} from '../constants';
import type { Fragments, Heading } from '../types';

/**
 * Parses headings from markdown.
 *
 * @param markdown - The markdown.
 * @returns - The headings.
 */
export function parseMarkdownHeadings(markdown: string): Heading[] {
  const headings = markdown.match(HEADINGS_REGEX);

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
