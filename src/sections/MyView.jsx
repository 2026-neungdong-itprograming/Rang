import { useEffect, useState } from 'react';
import { Button, Card, Reveal, SectionHeader, Segmented } from '../components/ui.jsx';
import Icon from '../components/Icon.jsx';
import { SOLUTIONS } from './Solutions.jsx';

const KEY = 'myview-v1';
const CHOICES = [
  { value: 'yes', label: '찬성' },
  { value: 'unsure', label: '고민 중' },
  { value: 'no', label: '반대' },
];

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export default function MyView() {
  const [votes, setVotes] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(votes));
    } catch {}
  }, [votes]);

  const done = SOLUTIONS.filter((s) => votes[s.id]).length;
  const yes = SOLUTIONS.filter((s) => votes[s.id] === 'yes');
  const complete = done === SOLUTIONS.length;

  let verdict = '';
  if (complete) {
    const ageYes = votes.age === 'yes';
    const others = yes.filter((s) => s.id !== 'age').length;
    if (ageYes && others >= 2) verdict = '처벌 강화와 예방·교화를 함께 추진해야 한다고 보시는군요.';
    else if (ageYes) verdict = '연령 하향을 중심으로 책임을 분명히 해야 한다고 보시는군요.';
    else if (others >= 2) verdict = '연령 하향보다는 보호처분·예방 체계를 고치는 쪽에 무게를 두시는군요.';
    else verdict = '아직 판단을 유보하고 계시네요. 더 많은 자료와 토론이 필요한 주제입니다.';
  }

  return (
    <section id="myview" className="section mx-auto max-w-6xl scroll-mt-28 md:scroll-mt-20 px-4 py-24">
      <SectionHeader eyebrow="05 · 나의 생각" title="당신이라면 어떻게 하시겠어요?">
        앞에서 본 해결 방안마다 입장을 골라 보세요. 선택은 이 브라우저에만 저장되고 어디에도 전송되지 않습니다.
      </SectionHeader>

      <div className="grid gap-4">
        {SOLUTIONS.map((s, i) => (
          <Reveal key={s.id} delay={i * 60}>
            <Card variant="outlined" className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
                <Icon name={s.icon} size={20} />
              </span>
              <p className="flex-1 text-title-md font-semibold">{s.title}</p>
              <Segmented
                label={`${s.title}에 대한 입장`}
                value={votes[s.id]}
                onChange={(v) => setVotes((p) => ({ ...p, [s.id]: v }))}
                options={CHOICES}
              />
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <Card variant="filled" className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <Icon name="how_to_vote" size={40} className="shrink-0 text-primary" />
          <div className="flex-1" aria-live="polite">
            <p className="text-label-lg text-on-surface-variant">
              {done} / {SOLUTIONS.length} 선택 완료
            </p>
            <p className="mt-1 text-title-lg font-bold">
              {complete ? verdict : '모든 항목을 고르면 나의 입장을 정리해 드려요.'}
            </p>
            {complete && (
              <p className="mt-1 text-body-md text-on-surface-variant">
                참고로 공론화 시민참여단은 숙의 후 46.7%가 ‘강력·중대·반복범죄만 조건부 하향’을 선택했습니다.
              </p>
            )}
          </div>
          {done > 0 && (
            <Button variant="outlined" icon="replay" onClick={() => setVotes({})}>
              다시 하기
            </Button>
          )}
        </Card>
      </Reveal>
    </section>
  );
}
