import { promises } from 'fs';
import { resolve } from 'path';

import { mdtocs } from '../src';

const { readFile } = promises;

const noop = () => {};

describe('error', () => {
  it.each([undefined, null, 0, 1, {}, [], noop, new Date(), Symbol()])(
    'throws when first argument=%p',
    (value) => {
      expect(() => {
        mdtocs(value as string);
      }).toThrow('First argument must be a string');
    },
  );
});

describe('mdtocs', () => {
  it('returns empty string for markdown with no headings', async () => {
    const markdown = await readFile(
      resolve(__dirname, '__fixtures__/no-headings.md'),
      'utf8',
    );
    expect(mdtocs(markdown)).toBe('');
  });

  it.each([
    ['single heading', '# Heading'],
    [
      'all heading levels',
      `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`,
    ],
    [
      'alternative headings',
      `
Heading 1
===
Heading 2
---
Heading 1
=========
Heading 2
---------
`,
    ],
    [
      'nested heading',
      `
## Heading 2
#### Heading 4
# Heading 1
### Heading 3
##### Heading 5
###### Heading 6
`,
    ],
    ['heading with invalid characters', '# ˙eådin©! @ #'],
    ['heading with bold text', '# **Bold heading**'],
    [
      'headings with the same fragment',
      `
# A Heading
# A Heading
## a heading?
## A HEADING!
`,
    ],
  ])('generates table of contents for markdown with %s', (_type, markdown) => {
    expect(mdtocs(markdown)).toMatchSnapshot();
  });

  it('generates table of contents for markdown with headings', async () => {
    const markdown = await readFile(
      resolve(__dirname, '__fixtures__/headings.md'),
      'utf8',
    );
    expect(mdtocs(markdown)).toMatchSnapshot();
  });
});
