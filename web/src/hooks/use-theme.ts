import { useEffect, useState } from 'react';
type Theme = 'dark' | 'light';
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return localStorage.getItem('cat-lab-theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('cat-lab-theme', theme); } catch { /* Storage may be disabled. */ }
  }, [theme]);
  return {theme, setTheme};
}
