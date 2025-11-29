import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex items-center">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
    </div>
  );
}
