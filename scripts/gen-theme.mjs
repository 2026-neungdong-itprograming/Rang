// Material 3 색상 토큰 생성기: seed 색 하나로 다크/라이트 스킴을 만들어 CSS 변수로 출력합니다.
// 빌드 시점에 한 번만 계산하므로 런타임 비용이 0입니다. (`npm run theme`)
import { writeFileSync } from 'node:fs';
import {
  argbFromHex,
  hexFromArgb,
  Hct,
  MaterialDynamicColors,
  SchemeTonalSpot,
} from '@material/material-color-utilities';

const SEED = '#3D5AFE'; // 차분한 남색 계열

const ROLES = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'background', 'onBackground', 'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant',
  'surfaceDim', 'surfaceBright', 'surfaceContainerLowest', 'surfaceContainerLow',
  'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
  'inverseSurface', 'inverseOnSurface', 'inversePrimary',
  'outline', 'outlineVariant', 'scrim', 'shadow',
];

const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function block(isDark) {
  const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(SEED)), isDark, 0);
  return ROLES.map((r) => `  --md-${kebab(r)}: ${hexFromArgb(MaterialDynamicColors[r].getArgb(scheme))};`).join('\n');
}

const css = `/* 자동 생성 파일: scripts/gen-theme.mjs (seed ${SEED}). 직접 수정하지 마세요. */
:root,
:root[data-theme='dark'] {
  color-scheme: dark;
${block(true)}
}

:root[data-theme='light'] {
  color-scheme: light;
${block(false)}
}
`;

writeFileSync(new URL('../src/styles/m3-tokens.css', import.meta.url), css);
console.log('m3-tokens.css written');
