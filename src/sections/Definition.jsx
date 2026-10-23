import { useId, useState } from 'react';
import { Card, Reveal, SectionHeader, Source, Chip } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
import { DISPOSITIONS } from '../data/stats.js';

function statusOf(age) {
  if (age < 10)
    return {
      tag: '처벌·보호처분 대상 아님',
      title: '만 10세 미만',
      body: '형사처벌도, 소년부 보호처분도 받지 않습니다. 소년법의 보호사건 대상은 10세 이상부터입니다.',
      tone: 'surface',
    };
  if (age < 14)
    return {
      tag: '촉법소년',
      title: '만 10세 이상 ~ 14세 미만',
      body: '형벌 법령에 저촉되는 행위를 해도 형사처벌하지 않고(형법 제9조), 경찰서장이 직접 소년부에 송치해 보호처분을 받습니다(소년법 제4조).',
      tone: 'error',
    };
  return {
    tag: '범죄소년',
    title: '만 14세 이상 ~ 19세 미만',
    body: '형사책임이 있어 형사재판으로 처벌받을 수 있으며, 소년부 보호사건으로 처리될 수도 있습니다.',
    tone: 'primary',
  };
}

const TONE = {
  surface: 'bg-surface-container-highest text-on-surface',
  error: 'bg-error-container text-on-error-container',
  primary: 'bg-primary-container text-on-primary-container',
};

const KIND = {
  community: '사회 내 처분',
  probation: '보호관찰',
  facility: '시설 위탁',
  detention: '소년원 송치',
};

export default function Definition() {
  const [age, setAge] = useState(12);
  const [filter, setFilter] = useState('all');
  const id = useId();
  const st = statusOf(age);

  const list = DISPOSITIONS.filter((d) => filter === 'all' || d.kind === filter);

  return (
    <section id="define" className="section mx-auto max-w-6xl scroll-mt-28 md:scroll-mt-20 px-4 py-24">
      <SectionHeader eyebrow="01 · 개념" title="촉법소년이란?">
        ‘형벌 법령에 저촉되는 행위를 한 10세 이상 14세 미만인 소년’(소년법 제4조 제1항 제2호). 슬라이더로 나이를 바꿔 보세요.
      </SectionHeader>

      <Reveal>
        <Card variant="elevated" className="p-6 sm:p-8">
          <label htmlFor={id} className="flex items-baseline justify-between text-title-md font-semibold">
            <span>나이</span>
            <span className="text-display-sm font-extrabold tabular-nums text-primary">만 {age}세</span>
          </label>
          <input
            id={id}
            type="range"
            min={8}
            max={18}
            value={age}
            onChange={(e) => setAge(+e.target.value)}
            className="mt-4 h-2 w-full cursor-pointer accent-[var(--md-primary)]"
            aria-valuetext={`만 ${age}세, ${st.tag}`}
          />
          <div className="relative mt-2 h-6 text-label-md text-on-surface-variant" aria-hidden="true">
            {[8, 10, 14, 18].map((a) => (
              <span key={a} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${((a - 8) / 10) * 100}%` }}>
                {a}
              </span>
            ))}
          </div>
          <div className="relative mt-2 flex h-3 overflow-hidden rounded-full" aria-hidden="true">
            <div className="bg-surface-container-highest" style={{ width: '20%' }} />
            <div className="bg-error" style={{ width: '40%' }} />
            <div className="bg-primary" style={{ width: '40%' }} />
          </div>

          <div aria-live="polite" className={`mt-6 rounded-m3-lg p-5 transition-colors duration-300 ${TONE[st.tone]}`}>
            <p className="text-label-lg font-bold">{st.tag}</p>
            <p className="mt-1 text-title-lg font-bold">{st.title}</p>
            <p className="mt-2 text-body-md opacity-90">{st.body}</p>
          </div>
        </Card>
      </Reveal>

      <Reveal className="mt-16">
        <h3 className="text-headline-sm font-bold">보호처분 10가지 (소년법 제32조)</h3>
        <p className="mt-2 text-body-md text-on-surface-variant">
          소년부 판사는 1~10호 중 처분을 결정합니다. 촉법소년에게는 일부 처분에 나이 제한이 있습니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
            전체
          </Chip>
          {Object.entries(KIND).map(([k, v]) => (
            <Chip key={k} selected={filter === k} onClick={() => setFilter(k)}>
              {v}
            </Chip>
          ))}
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => {
            const blocked = age < d.minAge;
            const relevant = age >= 10 && age < 14;
            return (
              <li key={d.no}>
                <Card
                  variant="outlined"
                  className={`flex h-full gap-4 p-4 transition-opacity duration-300 ${relevant && blocked ? 'opacity-45' : ''}`}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary-container text-title-md font-bold text-on-secondary-container">
                    {d.no}
                  </span>
                  <div>
                    <p className="text-title-md font-semibold">{d.name}</p>
                    <p className="text-body-md text-on-surface-variant">{d.period}</p>
                    {d.minAge > 10 && (
                      <p className="mt-1 inline-flex items-center gap-1 text-label-md font-semibold text-tertiary">
                        <Icon name="info" size={14} />
                        {d.minAge}세 이상만 가능
                        {relevant && blocked && ` · 만 ${age}세 불가`}
                      </p>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-body-md text-on-surface-variant">
          ※ 3호(사회봉사)는 14세 이상이므로 촉법소년에게는 내릴 수 없고, 2호(수강명령)·10호(장기 소년원)는 12세 이상만 가능합니다(제32조 제3·4항).
          보호처분은 소년의 장래 신상에 어떠한 영향도 미치지 않습니다(제32조 제6항).
        </p>
        <Source id="law" className="mt-3" />
      </Reveal>
    </section>
  );
}
