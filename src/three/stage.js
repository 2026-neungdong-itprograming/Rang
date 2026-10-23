import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

/**
 * 최소 three.js 스테이지: 컨테이너 크기 추적(ResizeObserver), DPR 상한, 요청 기반 렌더링.
 * - loop(true): 매 프레임 tick 호출 (연속 애니메이션)
 * - invalidate(): 다음 프레임 1회 렌더 (tick 이 true 를 반환하면 계속 이어감)
 */
export function createStage(container, { fov = 50, maxDpr = 1.5, antialias = false, tick } = {}) {
  const renderer = new WebGLRenderer({ antialias, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, maxDpr));
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(fov, 1, 0.1, 100);
  const size = { width: 1, height: 1 };

  let raf = 0;
  let looping = false;
  let last = 0;

  const frame = (t) => {
    raf = 0;
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 1 / 60;
    last = t;
    const more = tick?.(dt) || false;
    renderer.render(scene, camera);
    if (looping || more) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  const invalidate = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    size.width = w;
    size.height = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    invalidate();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // 탭이 숨겨지면 루프 정지
  const onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    } else if (looping) invalidate();
  };
  document.addEventListener('visibilitychange', onVis);

  return {
    renderer,
    scene,
    camera,
    size,
    invalidate,
    loop(on) {
      looping = on;
      if (on) invalidate();
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
