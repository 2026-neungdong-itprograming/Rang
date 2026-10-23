import { useEffect, useState } from 'react';
import { IconButton } from '../components/ui.jsx';

const NAV = [
  ['define', '촉법소년이란'],
  ['trend', '증가 실태'],
  ['counter', '다른 시각'],
  ['solution', '해결 방안'],
  ['myview', '나의 생각'],
];

export default function TopAppBar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 8);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    // 현재 읽는 섹션 표시 (scroll-spy)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    NAV.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'bg-surface-container/90 backdrop-blur-md elev-2' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <a href="#top" className="mr-auto flex items-center gap-2 text-title-lg font-bold text-on-surface">
          <span className="grid size-8 place-items-center rounded-m3-sm bg-primary-container text-label-lg font-extrabold text-on-primary-container">
            14
          </span>
          <span className="hidden sm:inline">열넷의 경계</span>
        </a>
        <nav aria-label="섹션" className="hidden md:block">
          <ul className="flex gap-1">
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  className={`state-layer block rounded-full px-4 py-2 text-label-lg font-medium transition-colors ${
                    active === id ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant'
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <IconButton
          icon={theme === 'dark' ? 'light_mode' : 'dark_mode'}
          label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          onClick={onToggleTheme}
        />
      </div>
      <nav aria-label="섹션 (모바일)" className="md:hidden">
        <ul className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {NAV.map(([id, label]) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                aria-current={active === id ? 'true' : undefined}
                className={`state-layer inline-flex h-8 items-center rounded-m3-sm px-3 text-label-lg font-medium ${
                  active === id ? 'bg-secondary-container text-on-secondary-container' : 'border border-outline-variant text-on-surface-variant'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
