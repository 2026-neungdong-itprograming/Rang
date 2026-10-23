import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView.js';
import { SOURCES } from '../data/stats.js';
import Icon from './Icon.jsx';

const nf = new Intl.NumberFormat('ko-KR');
export const fmt = (n) => nf.format(n);

export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, inView] = useInView({ once: true, rootMargin: '0px 0px -10% 0px' });
  return (
    <Tag
      ref={ref}
      data-in={inView}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** 화면에 들어오면 0 → value 로 카운트업 (rAF, 감속 easing) */
export function CountUp({ value, duration = 1400, decimals = 0, className = '' }) {
  const [ref, inView] = useInView({ once: true });
  const [shown, setShown] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 4);
      setShown(value * e);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {decimals ? shown.toFixed(decimals) : fmt(Math.round(shown))}
    </span>
  );
}

const BTN = {
  filled: 'bg-primary text-on-primary hover:elev-1',
  tonal: 'bg-secondary-container text-on-secondary-container',
  outlined: 'border border-outline text-primary',
  text: 'text-primary',
};

export function Button({ variant = 'filled', icon, className = '', children, ...rest }) {
  return (
    <button
      type="button"
      className={`state-layer inline-flex h-10 items-center justify-center gap-2 rounded-full px-6 text-label-lg font-semibold transition-shadow duration-200 ${icon ? 'pl-4' : ''} ${BTN[variant]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

export function IconButton({ icon, label, className = '', ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`state-layer grid size-10 place-items-center rounded-full text-on-surface-variant ${className}`}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  );
}

/** M3 Segmented button (single-select) */
export function Segmented({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border border-outline">
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`state-layer flex h-10 items-center gap-1.5 px-4 text-label-lg font-medium transition-colors duration-200 sm:px-5
              ${i > 0 ? 'border-l border-outline' : ''} ${i === 0 ? 'rounded-l-full' : ''} ${i === options.length - 1 ? 'rounded-r-full' : ''}
              ${on ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface'}`}
          >
            {on && <Icon name="check" size={18} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** M3 Filter chip */
export function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`state-layer inline-flex h-8 items-center gap-1.5 rounded-m3-sm px-3 text-label-lg font-medium transition-colors duration-200
        ${selected ? 'bg-secondary-container text-on-secondary-container' : 'border border-outline text-on-surface-variant'}`}
    >
      {selected && <Icon name="check" size={18} />}
      {children}
    </button>
  );
}

export function Card({ variant = 'filled', className = '', children, ...rest }) {
  const v = {
    filled: 'bg-surface-container-highest',
    elevated: 'bg-surface-container-low elev-1',
    outlined: 'border border-outline-variant bg-surface',
    tonal: 'bg-surface-container',
  }[variant];
  return (
    <div className={`rounded-m3-md ${v} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Source({ id, className = '' }) {
  const s = SOURCES[id];
  if (!s) return null;
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-label-md text-on-surface-variant underline decoration-outline-variant underline-offset-4 hover:text-primary ${className}`}
    >
      출처: {s.label} ({s.date})
      <Icon name="open_in_new" size={14} />
    </a>
  );
}

export function SectionHeader({ eyebrow, title, children }) {
  return (
    <Reveal className="mb-10 max-w-3xl">
      <p className="mb-3 text-label-lg font-semibold tracking-wide text-primary">{eyebrow}</p>
      <h2 className="text-headline-lg font-bold text-on-surface sm:text-display-sm">{title}</h2>
      {children && <p className="mt-4 text-body-lg text-on-surface-variant">{children}</p>}
    </Reveal>
  );
}
