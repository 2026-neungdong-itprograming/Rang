import { Suspense } from 'react';
import { useInView } from '../hooks/useInView.js';
import { useReducedMotion } from '../hooks/useMedia.js';

let webgl;
function hasWebGL() {
  if (webgl !== undefined) return webgl;
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webgl = false;
  }
  return webgl;
}

/**
 * 3D 영역 게이트: 화면 근처(위아래 1 화면)에 올 때 처음 마운트하고,
 * 이후엔 보이는 동안에만 active=true 로 렌더 루프를 돌립니다.
 * WebGL 미지원 / 움직임 줄이기 설정이면 fallback 을 렌더합니다.
 */
export default function Lazy3D({ className = '', fallback = null, children }) {
  const [nearRef, near] = useInView({ rootMargin: '100% 0px', once: true });
  const [visRef, visible] = useInView({ rootMargin: '0px' });
  const reduced = useReducedMotion();
  const ok = typeof window !== 'undefined' && hasWebGL() && !reduced;

  return (
    <div ref={nearRef} className={className}>
      <div ref={visRef} className="absolute inset-0">
        {ok ? near && <Suspense fallback={fallback}>{children(visible)}</Suspense> : fallback}
      </div>
    </div>
  );
}
