import { createTheme } from './create';

describe('createTheme typography scaling', () => {
  it('uses medium app scale as baseline', () => {
    const theme = createTheme({
      mode: 'light',
      brand: 'default',
      fontScalePreference: 'medium',
      systemFontScale: 1.4,
    });

    expect(theme.fontScale).toBe(1);
    expect(theme.typography.body.fontSize).toBe(16);
    expect(theme.typography.body.lineHeight).toBe(24);
  });

  it('uses explicit small app scale', () => {
    const theme = createTheme({
      mode: 'light',
      brand: 'default',
      fontScalePreference: 'small',
      systemFontScale: 1.4,
    });

    expect(theme.fontScale).toBe(0.9);
    expect(theme.typography.body.fontSize).toBe(14);
    expect(theme.typography.body.lineHeight).toBe(22);
  });

  it('reuses precomputed typography reference for fixed app scale', () => {
    const first = createTheme({
      mode: 'light',
      brand: 'default',
      fontScalePreference: 'medium',
      systemFontScale: 1.4,
    });
    const second = createTheme({
      mode: 'light',
      brand: 'default',
      fontScalePreference: 'medium',
      systemFontScale: 2,
    });

    expect(first.typography).toBe(second.typography);
  });

  it('uses device scale when preference is system', () => {
    const theme = createTheme({
      mode: 'dark',
      brand: 'ocean',
      fontScalePreference: 'system',
      systemFontScale: 1.4,
    });

    expect(theme.fontScale).toBe(1.4);
    expect(theme.typography.body.fontSize).toBe(22);
    expect(theme.typography.body.lineHeight).toBe(34);
    expect(theme.typography.button.fontFamily).toBeTruthy();
  });
});
