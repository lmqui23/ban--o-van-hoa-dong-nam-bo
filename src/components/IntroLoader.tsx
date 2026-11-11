import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface IntroLoaderProps {
  /** Dữ liệu đã sẵn sàng chưa. Mặc định true: loader chỉ chạy theo minDuration. */
  ready?: boolean;
  /** Thời gian tối thiểu hiển thị (ms) để hiệu ứng kịp chạy hết. */
  minDuration?: number;
  /** Quá thời gian này (ms) vẫn mở trang dù ready chưa true, tránh kẹt khi lỗi mạng. */
  maxDuration?: number;
  /** true: chỉ hiện một lần mỗi phiên trình duyệt (sessionStorage). */
  oncePerSession?: boolean;
  /** Gọi khi loader đã đóng hẳn. */
  onFinish?: () => void;
}

type Phase = 'loading' | 'exiting' | 'done';

const SESSION_KEY = 'dnb-intro-seen';
const EXIT_MS = 1500;

// Ba tỉnh đặt theo vị trí địa lý gần đúng: Tây Ninh phía tây bắc, Đồng Nai phía đông bắc,
// TP.HCM ở giữa phía nam. Màu lấy đúng từ bản đồ chính của trang.
const NODES = [
  { name: 'Tây Ninh', color: '#fb7185', x: 60, y: 70, delay: 250, lx: 60, ly: 52, anchor: 'middle' },
  { name: 'Đồng Nai', color: '#60a5fa', x: 180, y: 80, delay: 550, lx: 180, ly: 62, anchor: 'middle' },
  { name: 'TP. Hồ Chí Minh', color: '#facc15', x: 112, y: 170, delay: 1650, lx: 100, ly: 174, anchor: 'end' },
] as const;

// Hai nhánh sông hợp lưu ở TP.HCM rồi chảy ra biển.
const RIVERS = [
  { d: 'M60 70 C 66 108, 134 112, 112 170', delay: 300, dur: 1100 },
  { d: 'M180 80 C 172 118, 128 126, 112 170', delay: 600, dur: 1100 },
  { d: 'M112 170 C 122 196, 168 206, 212 198', delay: 1300, dur: 900 },
];

const STATUS = [
  'Đang nạp địa giới 34 tỉnh, thành…',
  'Đang dựng bản đồ di sản…',
  'Đang chuẩn bị không gian triển lãm…',
];

const GOLD_TEXT =
  'linear-gradient(100deg, #fde68a 0%, #fbbf24 38%, #fffbeb 50%, #fbbf24 62%, #f59e0b 100%)';

const FILL_BOX = { transformBox: 'fill-box', transformOrigin: 'center' } as const;

const IL_CSS = `
@keyframes il-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
@keyframes il-pop { 0% { transform: scale(0); opacity: 0 } 60% { transform: scale(1.35); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
@keyframes il-ring { 0% { transform: scale(1); opacity: .6 } 100% { transform: scale(4); opacity: 0 } }
@keyframes il-rise { from { transform: translateY(110%) } to { transform: translateY(0) } }
@keyframes il-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes il-fade-up { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
@keyframes il-shine { from { background-position: 120% 0 } to { background-position: -20% 0 } }
@keyframes il-glow { 0%, 100% { opacity: .65 } 50% { opacity: 1 } }
@keyframes il-seam { 0% { transform: scaleX(0); opacity: 1 } 50% { transform: scaleX(1); opacity: 1 } 100% { transform: scaleX(1); opacity: 0 } }

.il-draw { stroke-dasharray: 1; animation: il-draw 1100ms cubic-bezier(.65, 0, .35, 1) both; }
.il-pop { animation: il-pop 600ms cubic-bezier(.34, 1.56, .64, 1) both; }
.il-ring { animation: il-ring 2.4s ease-out infinite; }
.il-fade { animation: il-fade 500ms ease-out both; }
.il-fade-up { animation: il-fade-up 600ms cubic-bezier(.22, 1, .36, 1) both; }
.il-title { animation: il-rise 800ms cubic-bezier(.22, 1, .36, 1) both, il-shine 2200ms ease-in-out both; }
.il-glow { animation: il-glow 4s ease-in-out infinite; }
.il-seam { animation: il-seam 1000ms ease both; }

@media (prefers-reduced-motion: reduce) {
  .il-draw, .il-pop, .il-fade, .il-fade-up, .il-title, .il-glow, .il-seam { animation: none !important; }
  .il-ring { display: none; }
  .il-root, .il-root * { transition: none !important; }
}
`;

export function IntroLoader({
  ready = true,
  minDuration = 3600,
  maxDuration = 9000,
  oncePerSession = false,
  onFinish,
}: IntroLoaderProps) {
  const reduced = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const [phase, setPhase] = useState<Phase>(() => {
    if (!oncePerSession || typeof window === 'undefined') return 'loading';
    try {
      return sessionStorage.getItem(SESSION_KEY) ? 'done' : 'loading';
    } catch {
      return 'loading';
    }
  });
  const [progress, setProgress] = useState(0);

  // Dùng ref để effect tiến trình không bị khởi động lại mỗi khi props đổi.
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  // Tiến trình mô phỏng theo thời gian, dừng ở 92% cho tới khi dữ liệu thật sự sẵn sàng.
  useEffect(() => {
    if (phase !== 'loading') return;
    const minMs = reduced ? 600 : minDuration;
    const start = performance.now();
    let raf = 0;
    let last = start;
    let shown = 0;
    let finished = false;
    let holdTimer = 0;

    const tick = (now: number) => {
      const t = now - start;
      const dt = now - last;
      last = now;
      const canFinish = (readyRef.current && t >= minMs) || t >= maxDuration;
      const timeP = 1 - Math.pow(1 - Math.min(1, t / minMs), 3);
      const target = canFinish ? 1 : Math.min(timeP, 0.92);
      shown += (target - shown) * (1 - Math.exp(-dt / 140));
      if (canFinish && shown > 0.995) shown = 1;
      setProgress(shown);

      if (shown >= 1) {
        if (!finished) {
          finished = true;
          holdTimer = window.setTimeout(() => setPhase('exiting'), reduced ? 100 : 400);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
    };
  }, [phase, minDuration, maxDuration, reduced]);

  // Sau khi bắt đầu thoát: chờ hai cánh cửa mở xong rồi gỡ loader.
  useEffect(() => {
    if (phase !== 'exiting') return;
    const id = window.setTimeout(() => setPhase('done'), reduced ? 300 : EXIT_MS);
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== 'done') return;
    if (oncePerSession) {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* bỏ qua */ }
    }
    onFinishRef.current?.();
  }, [phase, oncePerSession]);

  const skip = useCallback(() => {
    setProgress(1);
    setPhase((p) => (p === 'loading' ? 'exiting' : p));
  }, []);

  // Khóa cuộn trang trong lúc loader còn hiển thị; Esc để bỏ qua.
  const active = phase !== 'done';
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') skip(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [active, skip]);

  if (phase === 'done') return null;

  const exiting = phase === 'exiting';
  const pct = Math.round(progress * 100);
  const statusIdx = progress >= 1 ? 3 : progress < 0.3 ? 0 : progress < 0.65 ? 1 : 2;
  const status = statusIdx === 3 ? 'Sẵn sàng khám phá' : STATUS[statusIdx];
  const door = (dir: 1 | -1): React.CSSProperties => ({
    transform: exiting ? `translateY(${dir * 100}%)` : 'translateY(0)',
    transition: `transform 1000ms cubic-bezier(.76, 0, .24, 1) ${exiting ? 450 : 0}ms`,
    willChange: 'transform',
  });

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      aria-label="Đang tải Đông Nam Bộ Di Sản"
      className="il-root fixed inset-0 z-[100] overflow-hidden"
      style={{ pointerEvents: exiting ? 'none' : 'auto' }}
    >
      <style>{IL_CSS}</style>

      {/* Hai cánh cửa: mở ra theo chiều dọc để lộ trang web phía sau */}
      <div className="absolute inset-x-0 top-0 h-[calc(50%+1px)] bg-stone-950" style={door(-1)} />
      <div className="absolute inset-x-0 bottom-0 h-[calc(50%+1px)] bg-stone-950" style={door(1)} />

      {/* Nội dung */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? 'translateY(-12px) scale(1.04)' : 'none',
          transition: 'opacity 450ms ease, transform 600ms cubic-bezier(.22, 1, .36, 1)',
        }}
      >
        {/* Quầng sáng vàng phía sau, chỉ đổi độ trong suốt nên rất nhẹ */}
        <div
          aria-hidden
          className="il-glow pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-[58%] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(251,191,36,.13), rgba(251,191,36,.04) 55%, transparent 75%)' }}
        />

        {/* Khoảnh khắc chính: hai dòng sông tự vẽ, hợp lưu rồi ra biển, nối ba tỉnh */}
        <svg
          viewBox="0 0 240 240"
          className="relative h-[190px] w-[190px] overflow-visible sm:h-[230px] sm:w-[230px]"
          aria-hidden
        >
          <defs>
            <linearGradient id="il-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fde68a" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          <circle cx="120" cy="120" r="108" fill="none" stroke="#fbbf24" strokeOpacity=".16" strokeWidth="1" />

          {RIVERS.map((r, i) => (
            <g key={i}>
              {/* viền sáng mờ rộng thay cho filter blur */}
              <path d={r.d} pathLength={1} fill="none" stroke="#fbbf24" strokeOpacity=".16" strokeWidth="7"
                strokeLinecap="round" className="il-draw"
                style={{ animationDelay: `${r.delay}ms`, animationDuration: `${r.dur}ms` }} />
              <path d={r.d} pathLength={1} fill="none" stroke="url(#il-gold)" strokeWidth="1.8"
                strokeLinecap="round" className="il-draw"
                style={{ animationDelay: `${r.delay}ms`, animationDuration: `${r.dur}ms` }} />
            </g>
          ))}

          {/* cửa biển */}
          <g transform="translate(212 198)">
            <g className="il-pop" style={{ animationDelay: '2200ms' }}>
              <circle r="2.4" fill="#fde68a" />
            </g>
          </g>

          {NODES.map((n) => (
            <g key={n.name}>
              <g transform={`translate(${n.x} ${n.y})`}>
                <g className="il-fade" style={{ animationDelay: `${n.delay + 500}ms` }}>
                  <circle r="4.5" fill="none" stroke={n.color} strokeWidth="1" className="il-ring" style={FILL_BOX} />
                </g>
                <g className="il-pop" style={{ animationDelay: `${n.delay}ms` }}>
                  <circle r="9" fill={n.color} opacity=".18" />
                  <circle r="4.5" fill={n.color} stroke="#0c0a09" strokeWidth="1.5" />
                </g>
              </g>
              <text
                x={n.lx} y={n.ly} textAnchor={n.anchor} fill={n.color} fontSize="9.5" fontStyle="italic"
                fontFamily="ui-serif, Georgia, serif" className="il-fade"
                style={{ animationDelay: `${n.delay + 250}ms` }}
              >
                {n.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Tiêu đề: từng chữ trồi lên từ mép cắt, sau đó một vệt sáng quét qua */}
        <h1 className="mt-4 font-serif text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          <span className="sr-only">Đông Nam Bộ Di Sản</span>
          <span aria-hidden className="flex flex-wrap justify-center gap-x-[0.28em]">
            {['Đông', 'Nam', 'Bộ'].map((w, i) => (
              <span
                key={w}
                className="-mb-[0.18em] -mt-[0.22em] inline-block overflow-hidden pb-[0.18em] pt-[0.22em]"
              >
                <span
                  className="il-title inline-block"
                  style={{
                    animationDelay: `${900 + i * 140}ms, ${1900 + i * 140}ms`,
                    backgroundImage: GOLD_TEXT,
                    backgroundSize: '250% 100%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {w}
                </span>
              </span>
            ))}
          </span>
        </h1>

        <p
          className="il-fade-up mt-3 flex items-center gap-3 font-serif text-base italic text-stone-400 sm:text-lg"
          style={{ animationDelay: '1700ms' }}
        >
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/60" />
          Phương Nam văn hiến
          <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/60" />
        </p>

        {/* Thanh tiến trình */}
        <div className="il-fade-up mt-9 w-[240px] sm:w-[300px]" style={{ animationDelay: '600ms' }}>
          <div className="mb-2 flex items-end justify-between gap-3">
            <span key={statusIdx} className="il-fade truncate text-left text-[12px] text-stone-400">
              {status}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-amber-300">
              {String(pct).padStart(2, '0')}%
            </span>
          </div>
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-stone-800">
            <div
              className="h-full origin-left rounded-full"
              style={{
                transform: `scaleX(${progress})`,
                background: 'linear-gradient(90deg, #fde68a, #f59e0b)',
                boxShadow: '0 0 10px rgba(251,191,36,.7)',
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={skip}
          className="il-fade-up absolute bottom-6 right-6 rounded-md px-2 py-1 text-[12px] text-stone-500 transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
          style={{ animationDelay: '1400ms' }}
        >
          Bỏ qua
        </button>
      </div>

      {/* Đường chỉ vàng ở giữa: kéo ra rồi mờ đi ngay khi hai cánh cửa bắt đầu mở */}
      <div
        aria-hidden
        className={`pointer-events-none absolute left-0 right-0 h-px ${exiting ? 'il-seam' : ''}`}
        style={{
          top: 'calc(50% - .5px)',
          opacity: 0,
          background: 'linear-gradient(90deg, transparent, #fbbf24 20%, #fde68a 50%, #fbbf24 80%, transparent)',
          boxShadow: '0 0 18px 2px rgba(251,191,36,.55)',
        }}
      />
    </div>
  );
}