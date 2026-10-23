import { useState } from 'react';
import { Card, CountUp, Reveal, SectionHeader, Source, fmt } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
import { NON_TRIAL, OUTCOMES_2025 } from '../data/stats.js';

function LineChart() {
  const [hi, setHi] = useState(NON_TRIAL.length - 1);
  const W = 560, H = 240, P = { l: 36, r: 16, t: 20, b: 32 };
  const x0 = NON_TRIAL[0].year, x1 = NON_TRIAL[NON_TRIAL.length - 1].year;
  const x = (y) => P.l + ((y - x0) / (x1 - x0)) * (W - P.l - P.r);
  const y = (v) => H - P.b - (v / 50) * (H - P.t - P.b);
  const d = NON_TRIAL.map((p, i) => `${i ? 'L' : 'M'}${x(p.year)},${y(p.value)}`).join('');
  const area = `${d}L${x(x1)},${y(0)}L${x(x0)},${y(0)}Z`;
  const cur = NON_TRIAL[hi];

  return (
    <Card variant="tonal" className="p-5 sm:p-6">
      <h3 className="text-title-lg font-bold">재판까지 가지 않는 사건이 늘고 있다</h3>
      <p className="mt-1 text-body-md text-on-surface-variant">
        심리불개시 비율 — 판사가 기록을 검토해 ‘심리할 필요가 없다’고 본 경우
      </p>
      <p className="mt-4 text-display-sm font-extrabold tabular-nums text-tertiary">
        {cur.value}% <span className="text-title-md font-semibold text-on-surface-variant">{cur.year}년</span>
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="연도별 심리불개시 비율 선 그래프">
        <defs>
          <linearGradient id="ntg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--md-tertiary)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--md-tertiary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50].map((g) => (
          <g key={g}>
            <line x1={P.l} x2={W - P.r} y1={y(g)} y2={y(g)} stroke="var(--md-outline-variant)" strokeDasharray="3 4" />
            <text x={P.l - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="var(--md-on-surface-variant)">
              {g}%
            </text>
          </g>
        ))}
        <path d={area} fill="url(#ntg)" />
        <path d={d} fill="none" stroke="var(--md-tertiary)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {NON_TRIAL.map((p, i) => (
          <g key={p.year}>
            <circle cx={x(p.year)} cy={y(p.value)} r={i === hi ? 7 : 4.5} fill={i === hi ? 'var(--md-tertiary)' : 'var(--md-surface)'} stroke="var(--md-tertiary)" strokeWidth="2.5" />
            <text x={x(p.year)} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--md-on-surface-variant)">
              {String(p.year).slice(2)}
            </text>
            {/* 넓은 투명 히트영역 */}
            <rect
              x={x(p.year) - 20}
              y={P.t}
              width={40}
              height={H - P.t}
              fill="transparent"
              tabIndex={0}
              aria-label={`${p.year}년 ${p.value}%`}
              onPointerEnter={() => setHi(i)}
              onFocus={() => setHi(i)}
              className="cursor-pointer outline-none"
            />
          </g>
        ))}
      </svg>
      <Source id="hankook" className="mt-2" />
    </Card>
  );
}

function Outcomes() {
  const o = OUTCOMES_2025;
  const rest = o.total - o.nonTrial - o.noDisposition - o.transfer;
  const parts = [
    { label: '심리불개시', v: o.nonTrial, c: 'var(--md-tertiary)' },
    { label: '불처분', v: o.noDisposition, c: 'var(--md-secondary)' },
    { label: '타법원 이송', v: o.transfer, c: 'var(--md-outline)' },
    { label: '그 외', v: rest, c: 'var(--md-primary)' },
  ];
  const R = 70, C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <Card variant="tonal" className="p-5 sm:p-6">
      <h3 className="text-title-lg font-bold">2025년, 법원에 온 촉법소년 사건은 어떻게 끝났나</h3>
      <p className="mt-1 text-body-md text-on-surface-variant">법원 접수 {fmt(o.total)}건 기준</p>
      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <svg viewBox="0 0 180 180" className="size-44 shrink-0 -rotate-90" role="img" aria-label="2025년 촉법소년 사건 처리 결과 도넛 차트">
          {parts.map((p) => {
            const len = (p.v / o.total) * C;
            const el = (
              <circle key={p.label} cx="90" cy="90" r={R} fill="none" stroke={p.c} strokeWidth="26" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} />
            );
            acc += len;
            return el;
          })}
        </svg>
        <ul className="w-full space-y-2">
          {parts.map((p) => (
            <li key={p.label} className="flex items-center justify-between gap-3 text-body-md">
              <span className="inline-flex items-center gap-2">
                <i className="size-3 rounded-full" style={{ background: p.c }} />
                {p.label}
              </span>
              <span className="tabular-nums">
                {fmt(p.v)} <span className="text-on-surface-variant">({((p.v / o.total) * 100).toFixed(1)}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-body-md">
        심리불개시와 불처분을 합치면 <strong className="text-tertiary">48.8%</strong>. 절반가량이 경미한 사건으로 판단됐습니다.
        같은 해 보호처분을 받은 14세 미만은 <strong>{fmt(o.protective)}명</strong>으로, 전년(7,294명)보다 7.9% 줄었습니다.
      </p>
      <p className="mt-1 text-label-md text-on-surface-variant">※ ‘그 외’는 전체에서 세 항목을 뺀 계산값으로, 보호처분 결정 등이 포함됩니다.</p>
      <div className="mt-2 flex flex-col gap-1">
        <Source id="mt" />
        <Source id="sedaily" />
      </div>
    </Card>
  );
}

export default function Counter() {
  return (
    <section id="counter" className="section mx-auto max-w-6xl scroll-mt-28 md:scroll-mt-20 px-4 py-24">
      <SectionHeader eyebrow="03 · 다른 시각" title="숫자만으로는 알 수 없는 것">
        건수가 늘어난 것은 사실입니다. 하지만 ‘흉포화’의 근거는 부족하다는 반론도 있습니다. 문제를 제대로 풀려면 양쪽을 모두 봐야 합니다.
      </SectionHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <LineChart />
        </Reveal>
        <Reveal delay={100}>
          <Outcomes />
        </Reveal>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: 'warning',
            title: '“통계만으로 죄질을 가릴 수 없다”',
            body: '신고 증가, 무인점포 절도처럼 건수가 늘어도 범죄가 더 잔혹해졌다는 객관적 증거는 부족하다는 지적입니다.',
          },
          {
            icon: 'gavel',
            title: '“이미 실질적 제재가 있다”',
            body: '촉법소년도 소년원 송치 등 보호처분을 받을 수 있어, 사실상의 처벌이 존재한다는 반론입니다.',
          },
          {
            icon: 'menu_book',
            title: '“통계 자체가 부족하다”',
            body: '전건 송치 의무, 경찰 단계 절차 규정 부재, 통계 불일치, 재범률 통계 부재가 함께 지적됐습니다.',
          },
        ].map((c, i) => (
          <Reveal key={c.title} delay={i * 80}>
            <Card variant="outlined" className="h-full p-5">
              <Icon name={c.icon} className="text-tertiary" />
              <p className="mt-3 text-title-md font-bold">{c.title}</p>
              <p className="mt-2 text-body-md text-on-surface-variant">{c.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Source id="sbs" className="mt-4" />
    </section>
  );
}
