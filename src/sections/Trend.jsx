import { lazy, useRef, useState } from 'react';
import Lazy3D from '../components/Lazy3D.jsx';
import { Card, CountUp, Reveal, SectionHeader, Segmented, Source, fmt } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
import { useInView } from '../hooks/useInView.js';
import { BY_AGE, BY_AGE_TOTAL, BY_TYPE, BY_TYPE_NOTE, HIGHLIGHTS, YEARLY, YEARLY_NOTE } from '../data/stats.js';

const BarChart3D = lazy(() => import('../three/BarChart3D.jsx'));

/** 3D 미지원·움직임 줄이기 환경용 2D 막대 */
function FlatBars({ data, hovered, onHover }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-3 px-6 pb-14 pt-10 sm:gap-6">
      {data.map((d, i) => (
        <div key={d.year} className="flex h-full w-12 flex-col justify-end sm:w-16" onPointerEnter={() => onHover(i)} onPointerLeave={() => onHover(-1)}>
          <p className="mb-1 text-center text-label-md font-semibold tabular-nums">{fmt(d.value)}</p>
          <div
            className={`rounded-t-m3-sm transition-colors ${i === hovered ? 'bg-primary' : 'bg-primary-container'}`}
            style={{ height: `${(d.value / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function YearChart({ theme }) {
  const [hovered, setHovered] = useState(-1);
  const labelRefs = useRef([]);
  const [ref, inView] = useInView({ once: true, threshold: 0.35 });
  const data = YEARLY;
  const h = hovered >= 0 ? data[hovered] : null;
  const prev = hovered > 0 ? data[hovered - 1] : null;

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div ref={ref} className="relative h-[380px] sm:h-[460px]">
        <Lazy3D className="absolute inset-0" fallback={<FlatBars data={data} hovered={hovered} onHover={setHovered} />}>
          {() => (
            <>
              <BarChart3D data={data} hovered={hovered} onHover={setHovered} labelRefs={labelRefs} grow={inView} theme={theme} />
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {data.map((d, i) => (
                  <span
                    key={d.year}
                    ref={(el) => {
                      labelRefs.current[i] = el;
                    }}
                    className={`absolute left-0 top-0 whitespace-nowrap rounded-m3-xs px-1.5 py-0.5 text-label-md font-bold tabular-nums opacity-0 transition-colors ${
                      i === hovered ? 'bg-primary text-on-primary' : 'text-on-surface'
                    }`}
                  >
                    {d.year}
                    <br />
                    {fmt(d.value)}
                  </span>
                ))}
              </div>
            </>
          )}
        </Lazy3D>
        <p className="pointer-events-none absolute left-4 top-3 text-label-md text-on-surface-variant">
          드래그해 돌려 보고, 막대에 올려 보세요
        </p>
      </div>
      <div className="grid gap-4 border-t border-outline-variant p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div aria-live="polite" className="min-h-12">
          {h ? (
            <p className="text-body-md">
              <strong className="text-title-md">{h.year}년 {fmt(h.value)}</strong>
              {prev && (
                <span className="ml-2 text-on-surface-variant">
                  전년 대비 {h.value >= prev.value ? '+' : ''}
                  {(((h.value - prev.value) / prev.value) * 100).toFixed(1)}%
                </span>
              )}
            </p>
          ) : (
            <p className="text-body-md text-on-surface-variant">2024년, 처음으로 연 2만 건을 넘었습니다.</p>
          )}
          <p className="mt-1 text-label-md text-on-surface-variant">{YEARLY_NOTE}</p>
        </div>
        <div className="flex flex-col gap-1">
          <Source id="police2025" />
          <Source id="edupress" />
        </div>
      </div>
      {/* 스크린리더용 데이터 표 */}
      <table className="sr-only">
        <caption>연도별 촉법소년 검거·송치 규모</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.year}>
              <th>{d.year}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function TypeChart() {
  return (
    <Card variant="tonal" className="p-5 sm:p-6">
      <h3 className="text-title-lg font-bold">무슨 범죄가 많을까</h3>
      <p className="mt-1 text-body-md text-on-surface-variant">경찰 검거 건수 중 절도와 폭력의 비중</p>
      <div className="mt-5 flex flex-wrap gap-4 text-label-md">
        <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full bg-primary" />절도</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full bg-tertiary" />폭력</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full bg-outline-variant" />그 외</span>
      </div>
      <ul className="mt-4 space-y-4">
        {BY_TYPE.map((d) => {
          const t = (d.theft / d.total) * 100;
          const v = (d.violence / d.total) * 100;
          return (
            <li key={d.year}>
              <div className="mb-1 flex justify-between text-label-md">
                <span className="font-semibold">{d.year}</span>
                <span className="tabular-nums text-on-surface-variant">
                  절도 {fmt(d.theft)} · 폭력 {fmt(d.violence)}
                  {d.warn && <span className="text-error"> *</span>} / {fmt(d.total)}건
                </span>
              </div>
              <Reveal className="flex h-6 overflow-hidden rounded-full bg-outline-variant">
                <div className="bg-primary" style={{ width: `${t}%` }} title={`절도 ${t.toFixed(1)}%`} />
                <div className="bg-tertiary" style={{ width: `${v}%` }} title={`폭력 ${v.toFixed(1)}%`} />
              </Reveal>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-label-md text-on-surface-variant">
        <span className="text-error">*</span> {BY_TYPE_NOTE}
      </p>
      <Source id="police2025" className="mt-2" />
    </Card>
  );
}

function AgeChart() {
  const [year, setYear] = useState('y2025');
  const max = Math.max(...BY_AGE.map((d) => d.y2025));
  return (
    <Card variant="tonal" className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-title-lg font-bold">더 어려지고 있다</h3>
          <p className="mt-1 text-body-md text-on-surface-variant">나이별 소년부 송치 인원</p>
        </div>
        <Segmented
          label="연도"
          value={year}
          onChange={setYear}
          options={[
            { value: 'y2019', label: '2019' },
            { value: 'y2025', label: '2025' },
          ]}
        />
      </div>
      <ul className="mt-6 space-y-3">
        {BY_AGE.map((d) => (
          <li key={d.age} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3">
            <span className="text-label-lg font-semibold">만 {d.age}세</span>
            <div className="h-7 overflow-hidden rounded-m3-xs bg-surface-container-highest">
              <div
                className={`h-full rounded-m3-xs transition-[width] duration-700 ease-emphasized ${d.calc ? 'bg-secondary' : 'bg-primary'}`}
                style={{ width: `${(d[year] / max) * 100}%` }}
              />
            </div>
            <span className="w-28 text-right text-label-lg tabular-nums">
              {fmt(d[year])}
              {d.calc && <span className="text-on-surface-variant">†</span>}
              <span className="ml-1 text-label-md text-tertiary">×{(d.y2025 / d.y2019).toFixed(1)}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-label-md text-on-surface-variant">
        전체 {fmt(BY_AGE_TOTAL.y2019)}명(2019) → {fmt(BY_AGE_TOTAL.y2025)}명(2025). 만 10세는 4.4배로 증가 폭이 가장 큽니다.
        <br />† 만 12세는 기사에 따로 나오지 않아 ‘전체 − 나머지 연령’으로 계산한 값입니다.
      </p>
      <Source id="edupress" className="mt-2" />
    </Card>
  );
}

export default function Trend({ theme }) {
  return (
    <section id="trend" className="section mx-auto max-w-6xl scroll-mt-28 md:scroll-mt-20 px-4 py-24">
      <SectionHeader eyebrow="02 · 실태" title="얼마나 늘었나">
        2021년 1만 1천여 건이던 촉법소년 사건은 2025년 2만 1천 명을 넘었습니다. 숫자는 모두 공식 자료를 인용한 보도에서 가져왔습니다.
      </SectionHeader>

      <Reveal>
        <YearChart theme={theme} />
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h, i) => (
          <Reveal key={h.label} delay={i * 80}>
            <Card variant="filled" className="flex h-full flex-col p-5">
              <p className="text-label-lg font-semibold text-on-surface-variant">{h.label}</p>
              <p className="mt-2 flex items-baseline gap-1 text-headline-lg font-extrabold text-primary">
                <Icon name="trending_up" size={24} className="self-center text-error" />
                <CountUp value={(h.to / h.from) * 100 - 100} decimals={0} />%
              </p>
              <p className="mt-1 text-body-md tabular-nums">
                {fmt(h.from)} → {fmt(h.to)}
                {h.unit}
              </p>
              <p className="text-label-md text-on-surface-variant">
                {h.span}
                {h.note && ` · ${h.note}`}
              </p>
              <Source id={h.src} className="mt-auto pt-3" />
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <TypeChart />
        </Reveal>
        <Reveal delay={100}>
          <AgeChart />
        </Reveal>
      </div>
    </section>
  );
}
