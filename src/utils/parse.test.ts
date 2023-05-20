import { parseMarkdownHeadings } from './parse';

describe('parseMarkdownHeadings', () => {
  it('returns empty array if markdown does not match headings', () => {
    expect(parseMarkdownHeadings('')).toEqual([]);
  });

  it('returns array if markdown matches headings', () => {
    expect(parseMarkdownHeadings('# heading')).toMatchInlineSnapshot(`
      [
        {
          "fragment": "heading",
          "level": 1,
          "text": "heading",
        },
      ]
    `);
  });
});
