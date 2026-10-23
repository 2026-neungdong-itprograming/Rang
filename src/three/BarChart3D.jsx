import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';
import { createStage } from './stage.js';
import { cssColor } from './cssColor.js';

const GAP = 1.35;
const HEIGHT = 4;

export default function BarChart3D({ data, hovered, onHover, labelRefs, grow, theme }) {
  const host = useRef(null);
  const api = useRef(null);
  const state = useRef({ grow, hovered });
  const onHoverRef = useRef(onHover);

  useEffect(() => {
    onHoverRef.current = onHover;
  }, [onHover]);

  useEffect(() => {
    const n = data.length;
    const max = Math.max(...data.map((d) => d.value));
    const tmp = new Object3D();
    const v3 = new Vector3();
    const colors = { base: new Color(), hi: new Color() };
    const cam = { yaw: -0.35, pitch: 0.32, tYaw: -0.35, tPitch: 0.32 };
    let progress = 0;

    const bars = new InstancedMesh(
      new BoxGeometry(0.8, 1, 0.8),
      new MeshStandardMaterial({ roughness: 0.45, metalness: 0.1 }),
      n,
    );
    const floorMat = new MeshStandardMaterial({ roughness: 1 });
    const floor = new Mesh(new PlaneGeometry(9, 3), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.001;

    const sun = new DirectionalLight(0xffffff, 2.2);
    sun.position.set(4, 8, 6);
    const rim = new DirectionalLight(0xffffff, 0.6);
    rim.position.set(-6, 3, -4);

    const stage = createStage(host.current, {
      fov: 40,
      maxDpr: 1.75,
      antialias: true,
      tick(dt) {
        const s = state.current;
        const goal = s.grow ? 1 : 0;
        progress += (goal - progress) * Math.min(1, dt * 3);
        if (Math.abs(goal - progress) < 0.001) progress = goal;

        const k = Math.min(1, dt * 6);
        cam.yaw += (cam.tYaw - cam.yaw) * k;
        cam.pitch += (cam.tPitch - cam.pitch) * k;
        // 화면이 좁을수록 카메라를 뒤로 빼서 막대 5개가 모두 들어오게
        const c = stage.camera;
        const r = Math.max(10, 15 / c.aspect);
        c.position.set(Math.sin(cam.yaw) * Math.cos(cam.pitch) * r, 1.8 + Math.sin(cam.pitch) * r, Math.cos(cam.yaw) * Math.cos(cam.pitch) * r);
        c.lookAt(0, 1.8, 0);
        c.updateMatrixWorld();

        for (let i = 0; i < n; i++) {
          // 막대별 시차(stagger)를 둔 성장
          const local = Math.min(1, Math.max(0, progress * 1.4 - i * 0.08));
          const h = Math.max(0.001, (data[i].value / max) * HEIGHT * local);
          const x = (i - (n - 1) / 2) * GAP;
          tmp.position.set(x, h / 2, 0);
          tmp.scale.set(1, h, 1);
          tmp.updateMatrix();
          bars.setMatrixAt(i, tmp.matrix);
          bars.setColorAt(i, i === s.hovered ? colors.hi : colors.base);

          // 막대 꼭대기의 화면 좌표로 HTML 라벨 이동 (React 리렌더 없이 DOM 직접 갱신)
          const el = labelRefs.current[i];
          if (el) {
            v3.set(x, h + 0.25, 0).project(c);
            const sx = (v3.x * 0.5 + 0.5) * stage.size.width;
            const sy = (-v3.y * 0.5 + 0.5) * stage.size.height;
            el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%)`;
            el.style.opacity = local > 0.05 ? '1' : '0';
          }
        }
        bars.instanceMatrix.needsUpdate = true;
        if (bars.instanceColor) bars.instanceColor.needsUpdate = true;
        bars.computeBoundingSphere();

        const camMoving = Math.abs(cam.tYaw - cam.yaw) > 0.0005 || Math.abs(cam.tPitch - cam.pitch) > 0.0005;
        return progress !== goal || camMoving;
      },
    });
    stage.scene.add(new AmbientLight(0xffffff, 1.1), sun, rim, floor, bars);

    // 드래그 회전 + 호버 레이캐스트
    const ray = new Raycaster();
    const ndc = new Vector2();
    const el = stage.renderer.domElement;
    let drag = null;
    let lastHover = -1;

    const pick = (e) => {
      const rect = el.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      const hit = ray.intersectObject(bars)[0];
      const id = hit ? hit.instanceId : -1;
      if (id !== lastHover) {
        lastHover = id;
        onHoverRef.current(id);
      }
    };
    const down = (e) => {
      drag = { x: e.clientX, y: e.clientY, yaw: cam.tYaw, pitch: cam.tPitch };
    };
    const move = (e) => {
      if (drag && e.buttons) {
        cam.tYaw = Math.max(-1.1, Math.min(1.1, drag.yaw + (e.clientX - drag.x) / 200));
        cam.tPitch = Math.max(0.05, Math.min(0.9, drag.pitch + (e.clientY - drag.y) / 300));
        stage.invalidate();
      }
      if (e.pointerType === 'mouse') pick(e);
    };
    const up = (e) => {
      if (e.pointerType !== 'mouse' && drag && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) pick(e); // 터치는 탭으로 선택
      drag = null;
    };
    const leave = () => {
      drag = null;
      if (lastHover !== -1) {
        lastHover = -1;
        onHoverRef.current(-1);
      }
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', leave);

    api.current = {
      stage,
      setTheme() {
        colors.base = cssColor('--md-primary-container');
        colors.hi = cssColor('--md-primary');
        floorMat.color = cssColor('--md-surface-container-high');
        stage.invalidate();
      },
    };

    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointerleave', leave);
      stage.dispose();
      api.current = null;
    };
  }, [data, labelRefs]);

  useEffect(() => {
    api.current?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    state.current.grow = grow;
    state.current.hovered = hovered;
    api.current?.stage.invalidate();
  }, [grow, hovered]);

  return <div ref={host} className="absolute inset-0 touch-pan-y" />;
}
