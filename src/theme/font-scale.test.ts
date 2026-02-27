import { resolveFontScale } from './font-scale';

describe('resolveFontScale', () => {
  it('returns system font scale in system mode', () => {
    expect(resolveFontScale('system', 1.3)).toBe(1.3);
  });

  it('returns app-defined scale for explicit modes', () => {
    expect(resolveFontScale('small')).toBe(0.9);
    expect(resolveFontScale('medium')).toBe(1);
    expect(resolveFontScale('large')).toBe(1.15);
  });
});
