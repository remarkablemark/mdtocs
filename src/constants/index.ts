/**
 * @see {@link https://www.markdownguide.org/basic-syntax/}
 */
export const HEADING_REGEX = /^(#+)[ \t](.+)$|^(.+)[\r\n]([=-])/;
export const HEADINGS_REGEX = /^(#{1,6}[ \t].+)$|^(.+[\r\n][=-]{3,})$/gm;

export const HYPHEN = '-';
export const NEWLINE = '\n';
const SPACE = ' ';

export const INDENT = SPACE.repeat(2);
export const BULLET = HYPHEN + SPACE;

export const INVALID_FRAGMENT_REGEX = /[^a-zA-Z0-9_-]/g;
export const WHITESPACE_REGEX = /\s/;
