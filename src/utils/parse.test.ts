import { parse } from './parse';

describe('parse', () => {
  it('returns empty array if markdown does not match headings', () => {
    expect(parse('')).toEqual([]);
  });

  it('returns array if markdown matches headings', () => {
    expect(parse('# heading')).toMatchInlineSnapshot(`
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
