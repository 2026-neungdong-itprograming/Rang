import { lazy, useState } from 'react';
import Lazy3D from '../components/Lazy3D.jsx';
import { Chip, CountUp, fmt } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
import { YEARLY } from '../data/stats.js';

const ParticleField = lazy(() => import('../three/ParticleField.jsx'));

function StaticFallback() {
  return (
    <div
      className="absolute inset-0 opacity-60"
      style={{
        background:
          'radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--md-primary) 35%, transparent), transparent 55%), radial-gradient(circle at 65% 60%, color-mix(in srgb, var(--md-tertiary) 25%, transparent), transparent 50%)',
      }}
    />
  );
}

export default function Hero({ theme }) {
  const [year, setYear] = useState(2025);
  const cur = YEARLY.find((d) => d.year === year);
  const base = YEARLY[0];
  const last = YEARLY[YEARLY.length - 1];

  return (
    <section id="top" className="relative isolate flex min-h-svh items-center overflow-hidden pt-16">
      <Lazy3D className="absolute inset-0 -z-10" fallback={<StaticFallback />}>
        {(visible) => <ParticleField visible={cur.value} theme={theme} active={visible} />}
      </Lazy3D>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(to bottom, transparent 55%, var(--md-background))' }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-16">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-error-container/70 px-3 py-1 text-label-lg font-semibold text-on-error-container backdrop-blur">
          <Icon name="trending_up" size={18} />
          촉법소년 사건 {base.year}→{last.year}년 {(last.value / base.value).toFixed(1)}배
        </p>
        <h1 className="max-w-3xl text-display-sm font-extrabold tracking-tight text-on-surface sm:text-display-md lg:text-display-lg">
          점 하나가
          <br />
          사건 하나입니다
        </h1>
        <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">
          만 10세 이상 14세 미만, 형사처벌 대신 보호처분을 받는 <strong className="text-on-surface">촉법소년</strong>.
          배경의 점들은 {year}년 한 해 동안의 촉법소년 사건 규모를 그대로 나타냅니다.
        </p>

        <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6">
          <div>
            <p className="text-label-lg text-on-surface-variant">{year}년</p>
            <p className="text-display-md font-extrabold text-primary sm:text-display-lg">
              <CountUp key={year} value={cur.value} duration={900} />
            </p>
            <p className="text-label-md text-on-surface-variant">
              {year === 2025 ? '명 · 소년부 송치(전건 송치)' : '건 · 경찰 검거'}
            </p>
          </div>
          <div role="group" aria-label="연도 선택" className="flex flex-wrap gap-2 pb-2">
            {YEARLY.map((d) => (
              <Chip key={d.year} selected={d.year === year} onClick={() => setYear(d.year)}>
                {d.year}
              </Chip>
            ))}
          </div>
        </div>
        <p className="mt-3 text-label-md text-on-surface-variant">
          {base.year}년 {fmt(base.value)}건 → {year}년 {fmt(cur.value)}
          {year === 2025 ? '명' : '건'}
        </p>

        <a
          href="#define"
          className="state-layer mt-14 inline-flex items-center gap-2 rounded-full px-4 py-2 text-label-lg font-semibold text-primary"
        >
          <Icon name="arrow_downward" size={18} className="motion-safe:animate-bounce" />
          스크롤해서 살펴보기
        </a>
      </div>
    </section>
  );
}
