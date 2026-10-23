import { ICONS } from './icons.js';

export default function Icon({ name, size = 24, className = '', title }) {
  return (
    <svg
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      <path d={ICONS[name]} />
    </svg>
  );
}
