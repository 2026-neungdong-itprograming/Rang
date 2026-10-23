# 열넷의 경계 — 촉법소년 범죄와 해법

촉법소년 범죄 증가 실태를 공식 통계로 살펴보고, 연령 하향 논쟁과 해결 방안을 함께 생각해 보는 인터랙티브 웹입니다.

- **스택**: React 19 · Vite 8 · Tailwind CSS 4 · three.js (3D) · React Compiler
- **디자인**: Google Material 3 — 색상은 `@material/material-color-utilities` 로 seed 색에서 생성(`scripts/gen-theme.mjs`)
- **다크 모드 기본**, 상단 버튼으로 라이트 모드 전환(선택은 브라우저에 저장)

## 실행

```bash
npm install
npm run dev       # 개발 서버
npm run build     # dist/ 로 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
npm run theme     # (선택) seed 색 변경 후 M3 토큰 재생성
```

## Base44 배포

Base44 공식 문서(React 퀵스타트)의 CLI 방식입니다. Node.js 20.19.0 이상이 필요합니다.

```bash
npm install -g base44@latest
base44 create          # 로그인 → basic project 선택 (프로젝트 폴더에서 실행)
```

생성된 `base44/config.jsonc` 에 `base44-config.example.jsonc` 의 `site` 항목을 넣습니다.

```jsonc
"site": { "outputDirectory": "dist", "buildCommand": "npm run build", "serveCommand": "npm run dev" }
```

```bash
base44 build
base44 deploy
base44 site open       # 배포된 사이트 열기
```

이 사이트는 데이터베이스(엔티티)를 쓰지 않는 정적 사이트라서 `@base44/sdk` 가 필요 없습니다.

## 성능 설계

- three.js 는 3D 영역이 화면 근처에 올 때만 동적 import (첫 화면 JS에 미포함)
- R3F 대신 three.js 를 직접 사용해 필요한 클래스만 번들 (3D 청크 gzip ≈132KB)
- 파티클 2만여 개를 셰이더 하나로 그리고, 화면 밖·탭 숨김 시 렌더 루프 정지
- 막대 차트는 InstancedMesh + 요청 기반 렌더링(움직일 때만 그림), DPR 상한
- WebGL 미지원 / `prefers-reduced-motion` 이면 2D 대체 화면
- React Compiler 자동 메모이제이션, `content-visibility: auto`, Pretendard 동적 서브셋 폰트

## 데이터 출처

모든 수치는 `src/data/stats.js` 에 출처 URL과 함께 정리되어 있으며, 페이지 하단에도 표시됩니다.
검거·송치·법원 접수는 서로 다른 통계이므로 화면에 기준을 명시했습니다.
