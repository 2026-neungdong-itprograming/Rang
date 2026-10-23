import Icon from '../components/Icon.jsx';
import { SOURCES } from '../data/stats.js';

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-headline-sm font-bold">출처</h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          검거·송치·법원 접수는 서로 다른 통계입니다. 같은 해라도 기준에 따라 수치가 다를 수 있습니다.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {Object.entries(SOURCES).map(([id, s]) => (
            <li key={id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="state-layer flex items-start gap-2 rounded-m3-sm p-2 text-body-md text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="open_in_new" size={16} className="mt-0.5 shrink-0" />
                <span>
                  {s.label} <span className="text-label-md">({s.date})</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-label-md text-on-surface-variant">
          아이콘: Material Symbols (Apache-2.0) · 글꼴: Pretendard (OFL-1.1) · 이 페이지는 사실 확인을 돕기 위한 교육용 자료입니다.
        </p>
      </div>
    </footer>
  );
}
