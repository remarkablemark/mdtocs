import { clean } from '../../src/utils/clean';

describe('parse', () => {
  it.each([
    '```\n```',
    '```\n```\n',
    '```py\n```',
    '```py\n# comment\n```',
    '```markdown\n\n\n```',
    '```\n```\n```\n```',
  ])('removes code block', (markdown) => {
    expect(clean(markdown)).toBe('');
  });
});
