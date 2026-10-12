import { useEffect, useRef } from 'react';
import { onMotionPause, isMotionPaused } from '../../motion/gsap';

/**
 * The AI Core: an iridescent, breathing neural orb rendered with a single fragment shader.
 * Dependency-free WebGL (no Three.js), so it adds ~4 KB instead of ~150 KB.
 * - Reacts to the pointer and to scroll (`--energy` CSS variable set by the hero).
 * - Renders only while visible, the tab is visible and motion isn't paused.
 * - DPR capped at 1.5. Calls `onFail` if WebGL is unavailable so the parent shows the fallback.
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uEnergy;

float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
vec3 spectrum(float t){
  // magenta -> violet -> blue -> cyan -> mint
  vec3 a = vec3(0.925, 0.282, 0.600), b = vec3(0.545, 0.361, 0.965), c = vec3(0.231, 0.510, 0.965), d = vec3(0.133, 0.827, 0.933), e = vec3(0.204, 0.827, 0.600);
  t = fract(t) * 4.0;
  if (t < 1.0) return mix(a, b, t); if (t < 2.0) return mix(b, c, t - 1.0); if (t < 3.0) return mix(c, d, t - 2.0); return mix(d, e, t - 3.0);
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  uv -= uMouse * 0.035;
  float t = uTime * 0.3;
  float r = length(uv);
  float ang = atan(uv.y, uv.x);
  float R = 0.4 + 0.01 * sin(uTime * 1.2) + 0.015 * uEnergy
          + fbm(vec3(cos(ang) * 1.4, sin(ang) * 1.4, t)) * 0.03 * (1.0 + uEnergy);
  float halo = exp(-9.0 * max(r - R, 0.0));
  vec3 haloCol = spectrum(ang / 6.2831 + t * 0.15) * halo * 0.55;
  vec3 sph = vec3(0.0);
  if (r < R + 0.01) {
    float rr = min(r, R);
    float z = sqrt(max(R * R - rr * rr, 0.0));
    vec3 n = normalize(vec3(uv, z));
    vec3 q = n * 2.0 + vec3(t * 0.6, -t * 0.4, t);
    float warp = fbm(q * 1.6 + t);
    float f = fbm(q + warp * 1.5);
    float ridge = pow(1.0 - abs(f * 2.0 - 1.0), 12.0);
    float ridge2 = pow(1.0 - abs(fbm(q * 2.3 - t) * 2.0 - 1.0), 16.0);
    float spark = pow(noise(q * 7.0 + t * 2.0), 18.0) * 3.0;
    float fres = pow(1.0 - n.z, 2.6);
    sph = vec3(0.012, 0.012, 0.035) + spectrum(f * 0.8 + t * 0.1) * 0.08;
    sph += ridge * spectrum(f + n.x * 0.3 + t * 0.12) * 1.25;
    sph += ridge2 * spectrum(f + 0.45 + t * 0.08) * 0.8;
    sph += spark * vec3(0.85, 0.9, 1.0);
    sph += fres * spectrum(ang / 6.2831 + 0.6 + t * 0.1) * 1.3;
    vec3 l = normalize(vec3(-0.45 + uMouse.x * 0.4, 0.55 - uMouse.y * 0.4, 0.75));
    sph += pow(max(dot(n, l), 0.0), 60.0) * 0.7;
    sph += vec3(1.0, 0.42, 0.24) * exp(-rr * rr * 70.0) * (0.5 + 0.3 * uEnergy + 0.15 * sin(uTime * 2.0));
  }
  float m = smoothstep(R + 0.004, R - 0.004, r);
  vec3 col = mix(haloCol * smoothstep(0.5, 0.43, r), sph, m);
  halo *= smoothstep(0.5, 0.43, r);
  float alpha = clamp(max(halo * 0.9, m), 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}`;

interface Props { className?: string; onFail?: () => void; }

export default function AICore({ className, onFail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: true, powerPreference: 'low-power' });
    if (!gl) { onFail?.(); return; }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    } catch {
      onFail?.();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uEnergy = gl.getUniformLocation(prog, 'uEnergy');

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.tx = Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width - 0.5) * 2));
      mouse.ty = Math.max(-1, Math.min(1, ((e.clientY - b.top) / b.height - 0.5) * 2));
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true, paused = isMotionPaused(), raf = 0, time = 0, last = performance.now();
    const draw = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      time += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
      const energy = parseFloat(getComputedStyle(canvas).getPropertyValue('--energy')) || 0;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, time); gl.uniform2f(uMouse, mouse.x, mouse.y); gl.uniform1f(uEnergy, energy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      schedule();
    };
    const schedule = () => { if (!raf && visible && !paused && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(draw); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; schedule(); });
    io.observe(canvas);
    const onVis = () => schedule();
    document.addEventListener('visibilitychange', onVis);
    const off = onMotionPause((p) => { paused = p; schedule(); });
    draw(performance.now());

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); off();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      gl.deleteBuffer(buf); gl.deleteProgram(prog);
    };
  }, [onFail]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
