'use client';

import { useEffect } from 'react';

export default function ThemeApplier() {
  useEffect(() => {
    const dark = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('theme-dark', dark);
  }, []);

  return null;
}
