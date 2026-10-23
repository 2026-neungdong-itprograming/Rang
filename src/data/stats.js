// 모든 수치는 아래 SOURCES 의 원문에서 그대로 옮겼습니다. 계산값은 calc: true 로 표시합니다.

export const SOURCES = {
  police2025: {
    label: '문화일보 · 경찰청 「촉법소년 범죄유형별 검거현황」(국회 법사위 박준태 의원실 공개)',
    date: '2025-10-02',
    url: 'https://www.munhwa.com/article/11537619',
  },
  munhwa2026: {
    label: '문화일보 · 관계당국·법원행정처 자료',
    date: '2026-04-06',
    url: 'https://www.munhwa.com/article/11580142',
  },
  edupress: {
    label: '에듀프레스 · 교권과 촉법소년 제도개선 토론회(신혜진 서울남부지검 부장검사 발표)',
    date: '2026-07-13',
    url: 'https://www.edupress.kr/news/articleView.html?idxno=30342',
  },
  hankook: {
    label: '한국일보 · 법원행정처 자료',
    date: '2026-07-13',
    url: 'https://www.hankookilbo.com/news/article/A2026071216090002367',
  },
  mt: {
    label: '머니투데이 · 촉법소년 사건 처리 현황',
    date: '2026-04-18',
    url: 'https://www.mt.co.kr/policy/2026/04/18/2026041716264144600',
  },
  sedaily: {
    label: '서울경제 · 대법원 「사법연감」',
    date: '2026-10-02',
    url: 'https://m.sedaily.com/article/20097289',
  },
  sbs: {
    label: 'SBS(다음뉴스) · 사회적 대화협의체 권고안',
    date: '2026-05-02',
    url: 'https://v.daum.net/v/20260502104202399',
  },
  fnnews: {
    label: '파이낸셜뉴스(연합뉴스) · 촉법소년 연령 공론화 결과',
    date: '2026-07-14',
    url: 'https://www.fnnews.com/news/202607141632340077',
  },
  mt2: {
    label: '머니투데이 · 법무부 2차 공론화 주도',
    date: '2026-07-16',
    url: 'https://www.mt.co.kr/policy/2026/07/16/2026071613344529751',
  },
  newspim: {
    label: '뉴스핌 · 경찰, 소년법 내 조사권한 명시 연구 추진',
    date: '2026-04-10',
    url: 'https://www.newspim.com/news/view/20260410000942',
  },
  law: {
    label: '국가법령정보센터 · 소년법 [시행 2026.10.2.] / 형법 제9조',
    date: '2026-10-23 조회',
    url: 'https://www.law.go.kr/법령/소년법',
  },
};

// 경찰청 검거 건수 (2021~2024: 2025-10 경찰청 국회 제출 자료)
// 2025년: 21,095명 (2026년 법무부·검찰 발표, 전건 소년부 송치 기준)
export const YEARLY = [
  { year: 2021, value: 11677, src: 'police2025' },
  { year: 2022, value: 16435, src: 'police2025' },
  { year: 2023, value: 19653, src: 'police2025' },
  { year: 2024, value: 20814, src: 'police2025' },
  { year: 2025, value: 21095, src: 'edupress' },
];
export const YEARLY_NOTE =
  '2022·2023년은 출처에 따라 17,066 / 20,479명으로 보도되기도 합니다(문화일보 2026-04-06). 여기서는 경찰청의 국회 제출 자료를 따랐습니다.';

// 범죄 유형 (경찰청 검거, 건)
export const BY_TYPE = [
  { year: 2021, total: 11677, theft: 5733, violence: 2750 },
  { year: 2022, total: 16435, theft: 7874, violence: 4075 },
  { year: 2023, total: 19653, theft: 9406, violence: 4863 },
  { year: 2024, total: 20814, theft: 10418, violence: 4873, warn: true },
];
export const BY_TYPE_NOTE =
  '2024년 폭력은 기사에 4,873건(22.09%)으로 나와 있으나 건수와 비율이 서로 맞지 않아 원자료 확인이 필요합니다.';

// 연령별 소년부 송치 (2019 → 2025, 명)
export const BY_AGE = [
  { age: 10, y2019: 472, y2025: 2060 },
  { age: 11, y2019: 726, y2025: 2892 },
  { age: 12, y2019: 1747, y2025: 5658, calc: true },
  { age: 13, y2019: 5670, y2025: 10485 },
];
export const BY_AGE_TOTAL = { y2019: 8615, y2025: 21095 };

export const HIGHLIGHTS = [
  { label: '강력범죄 검거', from: 479, to: 826, span: '2021→2025', unit: '명', note: '살인·강도·강간·추행 등', src: 'munhwa2026' },
  { label: '폭력 송치', from: 2148, to: 5520, span: '2019→2025', unit: '명', src: 'edupress' },
  { label: '강간·추행 송치', from: 357, to: 883, span: '2019→2025', unit: '명', src: 'edupress' },
  { label: '법원 접수', from: 6824, to: 21958, span: '2016→2025', unit: '명', src: 'hankook' },
];

// 심리불개시 비율 (법원행정처, %)
export const NON_TRIAL = [
  { year: 2015, value: 17.2 },
  { year: 2020, value: 26.6 },
  { year: 2021, value: 31.8 },
  { year: 2022, value: 34.6 },
  { year: 2023, value: 35.6 },
  { year: 2024, value: 37.4 },
  { year: 2025, value: 41.4 },
];

// 2025년 촉법소년 사건 처리 (법원 접수 21,958건 중)
export const OUTCOMES_2025 = {
  total: 21958,
  nonTrial: 9093, // 심리불개시
  noDisposition: 1631, // 불처분
  transfer: 830, // 타법원 이송
  protective: 6718, // 보호처분 받은 14세 미만 (사법연감)
};

// 연령 공론화 시민참여단 조사 (%)
export const DELIBERATION = [
  { option: '모든 범죄 일괄 하향', before: 37.3, after: 30.2 },
  { option: '강력·중대·반복범죄만 조건부 하향', before: 45.8, after: 46.7 },
  { option: '현행 유지', before: 5.7, after: 17.0 },
];

export const TIMELINE = [
  { date: '2026. 2. 24', title: '대통령, 연령 하향 검토 지시', body: '국무회의에서 두 달 안에 결정하도록 지시', src: 'sbs' },
  { date: '2026. 4. 30', title: '사회적 대화협의체 "14세 유지" 권고', body: '흉포화 근거 부족·보호처분으로 실질 제재 가능 등을 이유로 현행 유지안 가결', src: 'sbs' },
  { date: '2026. 7. 14', title: '국무회의: 조건부 하향안 보고', body: '강력·중대·반복범죄에 한해 만 14세 미만 → 13세 미만, 보호처분 제도 개선 병행', src: 'fnnews' },
  { date: '2026. 7. 16', title: '법무부 주도 2차 공론화', body: '대통령이 "부분·전면, 1년·2년"을 다시 논의하라고 지시. 12세·13세 범위 검토', src: 'mt2' },
];

// 소년법 제32조 보호처분 (제3항: 3호는 14세 이상 / 제4항: 2호·10호는 12세 이상)
export const DISPOSITIONS = [
  { no: 1, name: '보호자 등에게 감호 위탁', period: '6개월 (+6개월 1회 연장)', minAge: 10, kind: 'community' },
  { no: 2, name: '수강명령', period: '100시간 이내', minAge: 12, kind: 'community' },
  { no: 3, name: '사회봉사명령', period: '200시간 이내', minAge: 14, kind: 'community' },
  { no: 4, name: '단기 보호관찰', period: '1년', minAge: 10, kind: 'probation' },
  { no: 5, name: '장기 보호관찰', period: '2년 (+1년 1회 연장)', minAge: 10, kind: 'probation' },
  { no: 6, name: '아동복지시설 등 감호 위탁', period: '6개월 (+6개월 1회 연장)', minAge: 10, kind: 'facility' },
  { no: 7, name: '병원·요양소·의료재활소년원 위탁', period: '6개월 (+6개월 1회 연장)', minAge: 10, kind: 'facility' },
  { no: 8, name: '1개월 이내 소년원 송치', period: '1개월 이내', minAge: 10, kind: 'detention' },
  { no: 9, name: '단기 소년원 송치', period: '6개월 이내', minAge: 10, kind: 'detention' },
  { no: 10, name: '장기 소년원 송치', period: '2년 이내', minAge: 12, kind: 'detention' },
];
