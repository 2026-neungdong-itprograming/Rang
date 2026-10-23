import { Color } from 'three';

// M3 토큰(CSS 변수)을 three.js Color 로 읽어 테마와 3D 색을 일치시킵니다.
export function cssColor(name) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new Color(v || '#ffffff');
}
