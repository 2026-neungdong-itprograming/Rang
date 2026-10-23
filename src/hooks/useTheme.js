import { useCallback, useState } from 'react';

const META = { dark: '#131318', light: '#fbf8ff' };

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META[next]);
      setTheme(next);
    };
    try { localStorage.setItem('theme', next); } catch {}
    // View Transitions API 가 있으면 부드럽게 전환
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(apply);
    } else apply();
  }, [theme]);

  return [theme, toggle];
}
