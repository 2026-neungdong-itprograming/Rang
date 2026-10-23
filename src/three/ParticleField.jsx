import { useEffect, useRef } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, NormalBlending, Points, ShaderMaterial } from 'three';
import { createStage } from './stage.js';
import { cssColor } from './cssColor.js';

const MAX = 21958; // 가장 큰 수치(2025 법원 접수)까지 표현 가능하도록

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uVisible;
  uniform float uPixelRatio;
  attribute float aIndex;
  attribute float aRand;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;
    // 느린 유동: 점마다 위상이 다른 미세한 흔들림
    float t = uTime * 0.25 + aRand * 6.2831;
    p += normalize(p) * sin(t) * 0.06;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // 보이는 개수(uVisible)를 넘는 점은 부드럽게 사라짐
    float on = 1.0 - smoothstep(uVisible - 300.0, uVisible, aIndex);
    vAlpha = on * (0.55 + 0.45 * aRand);
    vMix = aRand;
    gl_PointSize = on * (2.0 + aRand * 2.5) * uPixelRatio * (6.0 / -mv.z);
  }
`;

const frag = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vMix;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(mix(uColorA, uColorB, vMix), a);
  }
`;

function buildGeometry() {
  const pos = new Float32Array(MAX * 3);
  const idx = new Float32Array(MAX);
  const rnd = new Float32Array(MAX);
  // 인덱스를 섞어 두면 어떤 개수를 보여 줘도 구 전체에 고르게 분포
  const order = new Uint32Array(MAX);
  for (let i = 0; i < MAX; i++) order[i] = i;
  for (let i = MAX - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const t = order[i];
    order[i] = order[j];
    order[j] = t;
  }
  // 피보나치 구 + 반지름 지터
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < MAX; i++) {
    const y = 1 - (i / (MAX - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const rad = 2.2 + Math.pow(Math.random(), 2) * 1.6;
    pos[i * 3] = Math.cos(th) * r * rad;
    pos[i * 3 + 1] = y * rad * 0.82;
    pos[i * 3 + 2] = Math.sin(th) * r * rad;
    idx[i] = order[i];
    rnd[i] = Math.random();
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setAttribute('aIndex', new BufferAttribute(idx, 1));
  g.setAttribute('aRand', new BufferAttribute(rnd, 1));
  return g;
}

export default function ParticleField({ visible, theme, active }) {
  const host = useRef(null);
  const api = useRef(null);
  const target = useRef(visible);

  useEffect(() => {
    const pointer = { x: 0, y: 0 };
    const uniforms = {
      uTime: { value: 0 },
      uVisible: { value: 0 },
      uPixelRatio: { value: 1 },
      uColorA: { value: cssColor('--md-primary') },
      uColorB: { value: cssColor('--md-tertiary') },
      uOpacity: { value: 1 },
    };
    const material = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const points = new Points(buildGeometry(), material);
    points.frustumCulled = false;
    const group = new Group();
    group.add(points);

    const stage = createStage(host.current, {
      tick(dt) {
        uniforms.uTime.value += dt;
        uniforms.uVisible.value += (target.current - uniforms.uVisible.value) * Math.min(1, dt * 2.2);
        const k = Math.min(1, dt * 2);
        group.rotation.y += dt * 0.05;
        group.rotation.x += (pointer.y * 0.25 - group.rotation.x) * k;
        group.rotation.z += (-pointer.x * 0.15 - group.rotation.z) * k;
      },
    });
    stage.camera.position.set(0, 0, 7.5);
    stage.scene.add(group);
    uniforms.uPixelRatio.value = stage.renderer.getPixelRatio();

    const onMove = (e) => {
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener('pointermove', onMove, { passive: true });

    api.current = {
      stage,
      setTheme(t) {
        uniforms.uColorA.value = cssColor('--md-primary');
        uniforms.uColorB.value = cssColor('--md-tertiary');
        uniforms.uOpacity.value = t === 'dark' ? 1 : 0.9;
        material.blending = t === 'dark' ? AdditiveBlending : NormalBlending;
        material.needsUpdate = true;
        stage.invalidate();
      },
    };

    return () => {
      removeEventListener('pointermove', onMove);
      stage.dispose();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    target.current = visible;
    api.current?.stage.invalidate();
  }, [visible]);

  useEffect(() => {
    api.current?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    api.current?.stage.loop(active);
  }, [active]);

  return <div ref={host} className="absolute inset-0" />;
}
