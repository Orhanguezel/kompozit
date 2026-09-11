'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { applyThemeMode, readThemeMode } from '@/lib/preferences/theme-utils';
import { THEME_STORAGE_KEYS, type ThemeMode } from '@/lib/preferences/theme';

const subscribeTheme = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  window.addEventListener('ensotek-theme-change', onChange);
  return () => { window.removeEventListener('storage', onChange); window.removeEventListener('ensotek-theme-change', onChange); };
};
const subscribeHydration = () => () => {};
export function ThemeToggle() {
  const mounted = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const mode = useSyncExternalStore(subscribeTheme, readThemeMode, () => 'dark' as ThemeMode);

  function toggleMode() {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    applyThemeMode(nextMode);
    localStorage.setItem(THEME_STORAGE_KEYS.mode, nextMode);
    window.dispatchEvent(new Event('ensotek-theme-change'));
  }

  const isDark = mounted && mode === 'dark';
  const ariaLabel = !mounted
    ? 'Toggle theme'
    : isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode';
  const title = !mounted ? 'Toggle theme' : isDark ? 'Light mode' : 'Dark mode';

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
      aria-label={ariaLabel}
      title={title}
      suppressHydrationWarning
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
