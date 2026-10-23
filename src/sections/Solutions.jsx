import { useState } from 'react';
import { Card, Reveal, SectionHeader, Segmented, Source } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
import { DELIBERATION, TIMELINE } from '../data/stats.js';

export const SOLUTIONS = [
  {
    id: 'age',
    icon: 'balance',
    title: '촉법소년 연령 하향',
    summary: '강력·중대·반복범죄에 한해 만 14세 미만 → 13세 미만으로 낮추는 안이 국무회의에 보고됐고, 12세·13세 범위가 2차 공론화 중입니다.',
    pros: ['중대 범죄에 대한 책임성 강화', '소년법을 악용하는 사례에 대한 억지 효과 기대', '시민참여단 다수(조건부·일괄 하향 합계 76.9%)가 하향 지지'],
    cons: ['일부 범죄만 하향하는 방식은 법리적 문제가 있다는 법무부 장관 지적', '흉포화 근거 부족, 엄벌이 곧 피해자 보호는 아니라는 전문가 의견', '사회적 대화협의체는 현행 유지를 권고'],
    src: ['fnnews', 'mt2', 'sbs'],
  },
  {
    id: 'care',
    icon: 'psychology',
    title: '보호처분 실효성 강화',
    summary: '공론화 참여자들이 우선 꼽은 제도 개선 과제입니다. 처벌 수위보다 ‘다시 범죄를 저지르지 않게’ 만드는 데 초점을 둡니다.',
    pros: ['치료처분(치료명령제) 내실화', '가족치료명령제 신설', '소년분류심사원 시설 확충', '보호처분 인프라 확충 (중요도 93.4%)'],
    cons: ['시설·인력 확충에 예산과 시간이 필요', '효과를 검증할 재범률 통계가 아직 부족'],
    src: ['fnnews', 'sbs'],
  },
  {
    id: 'police',
    icon: 'shield_person',
    title: '초기 조사 절차 정비',
    summary: '현행 소년법에는 경찰이 출석을 강제하거나 압수수색할 권한이 명시돼 있지 않아, 경찰청이 조사권한 규정 신설 연구를 발주했습니다.',
    pros: ['송치 전 사실관계를 정확히 확인', '소년부 판사의 처분 판단에 도움', '피해자 보호에 유리'],
    cons: ['적정절차·인권침해 논란 우려', '아동 대상 강제수사의 범위 설정이 과제'],
    src: ['newspim'],
  },
  {
    id: 'digital',
    icon: 'school',
    title: '디지털 성범죄 예방 교육',
    summary: '2019→2025년 촉법소년 강간·추행 송치가 357명에서 883명으로 늘었습니다. 토론회 발표에선 사이버 성폭력 3,411건 중 딥페이크가 1,553건, 10대 가해자 비율이 61.8%로 제시됐습니다.',
    pros: ['범죄가 되기 전 단계에서 예방', '학교·가정과 연계 가능'],
    cons: ['교육 효과 측정이 어려움', '플랫폼·기술 대응과 병행 필요'],
    src: ['edupress'],
  },
];

function Timeline() {
  return (
    <ol className="relative ml-3 border-l-2 border-outline-variant">
      {TIMELINE.map((t, i) => (
        <Reveal as="li" key={t.date} delay={i * 90} className="relative pb-8 pl-6 last:pb-0">
          <span className="absolute -left-[9px] top-1 size-4 rounded-full border-4 border-background bg-primary" />
          <p className="text-label-lg font-semibold text-primary">{t.date}</p>
          <p className="mt-1 text-title-md font-bold">{t.title}</p>
          <p className="mt-1 text-body-md text-on-surface-variant">{t.body}</p>
          <Source id={t.src} className="mt-1" />
        </Reveal>
      ))}
    </ol>
  );
}

function Deliberation() {
  const [phase, setPhase] = useState('after');
  return (
    <Card variant="tonal" className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-title-lg font-bold">숙의하면 생각이 바뀔까</h3>
          <p className="mt-1 text-body-md text-on-surface-variant">공론화 시민참여단 조사</p>
        </div>
        <Segmented
          label="조사 시점"
          value={phase}
          onChange={setPhase}
          options={[
            { value: 'before', label: '숙의 전' },
            { value: 'after', label: '숙의 후' },
          ]}
        />
      </div>
      <ul className="mt-6 space-y-4">
        {DELIBERATION.map((d) => {
          const v = d[phase];
          const delta = d.after - d.before;
          return (
            <li key={d.option}>
              <div className="mb-1 flex justify-between gap-3 text-body-md">
                <span>{d.option}</span>
                <span className="shrink-0 font-bold tabular-nums">
                  {v.toFixed(1)}%
                  {phase === 'after' && (
                    <span className={`ml-1.5 text-label-md ${delta > 0 ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                      {delta > 0 ? '+' : ''}
                      {delta.toFixed(1)}%p
                    </span>
                  )}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full rounded-full bg-primary transition-[width] duration-700 ease-emphasized" style={{ width: `${v}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-label-md text-on-surface-variant">
        청소년 참가자만 보면 일괄 하향 41.9% → 19.4%, 조건부 하향 38.7% → 64.5%로 바뀌었습니다.
      </p>
      <Source id="fnnews" className="mt-2" />
    </Card>
  );
}

function SolutionCard({ s }) {
  const [open, setOpen] = useState(false);
  const panel = `sol-${s.id}`;
  return (
    <Card variant="elevated" className="overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen(!open)}
        className="state-layer flex w-full items-start gap-4 p-5 text-left"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-m3-lg bg-primary-container text-on-primary-container">
          <Icon name={s.icon} />
        </span>
        <span className="flex-1">
          <span className="block text-title-lg font-bold">{s.title}</span>
          <span className="mt-1 block text-body-md text-on-surface-variant">{s.summary}</span>
        </span>
        <Icon name="arrow_downward" className={`mt-1 shrink-0 transition-transform duration-300 ease-emphasized ${open ? 'rotate-180' : ''}`} />
      </button>
      <div id={panel} className={`grid transition-[grid-template-rows] duration-400 ease-emphasized ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
            <div className="rounded-m3-md bg-primary-container/40 p-4">
              <p className="flex items-center gap-1.5 text-label-lg font-bold text-primary">
                <Icon name="check" size={18} /> 찬성 논거·기대 효과
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-body-md">
                {s.pros.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div className="rounded-m3-md bg-error-container/40 p-4">
              <p className="flex items-center gap-1.5 text-label-lg font-bold text-error">
                <Icon name="warning" size={18} /> 우려·과제
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-body-md">
                {s.cons.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              {s.src.map((id) => <Source key={id} id={id} />)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function Solutions() {
  return (
    <section id="solution" className="section mx-auto max-w-6xl scroll-mt-28 md:scroll-mt-20 px-4 py-24">
      <SectionHeader eyebrow="04 · 해결 방안" title="무엇을 바꿔야 할까">
        2026년 정부는 촉법소년 연령 기준을 두고 두 차례 공론화를 진행하고 있습니다. 연령 하향만이 답은 아닙니다. 각 방안을 눌러 장단점을 살펴보세요.
      </SectionHeader>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h3 className="mb-6 text-headline-sm font-bold">연령 기준 논의 흐름</h3>
          <Timeline />
          <p className="mt-6 text-label-md text-on-surface-variant">
            ※ 2026년 7월 16일 보도까지 확인한 내용입니다. 2차 공론화 결과는 법무부 발표를 확인해 주세요.
          </p>
        </div>
        <Reveal>
          <Deliberation />
        </Reveal>
      </div>

      <div className="mt-12 grid gap-4">
        {SOLUTIONS.map((s, i) => (
          <Reveal key={s.id} delay={i * 60}>
            <SolutionCard s={s} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
