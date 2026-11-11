import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

/**
 * Bộ hiệu ứng dùng chung cho các section (đồng bộ với LandingHero):
 *  - tiêu đề hiện từng chữ trồi lên từ sau mặt nạ
 *  - dòng nhỏ quét từ trái sang phải, đoạn mô tả hiện từ mờ sang nét
 *  - đường kẻ vàng vẽ ra, các nút/chip nảy lên lần lượt
 *  - card: ảnh mở dần + zoom-out, vệt sáng vàng, nghiêng 3D theo chuột
 * Mọi hiệu ứng chỉ chạy MỘT LẦN khi phần tử lần đầu cuộn tới, và tắt hoàn toàn
 * với người dùng bật "giảm chuyển động".
 */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const canHover = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** Trả về `true` khi phần tử lần đầu lọt vào màn hình (và giữ nguyên). */
export function useInViewOnce<T extends HTMLElement>(threshold = 0.2, rootMargin = '0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView] as const;
}

/** Nghiêng 3D + ánh sáng bám theo con trỏ. Chỉ chạy trên thiết bị có chuột. */
export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onMouseMove = (e: ReactMouseEvent<T>) => {
    if (!canHover() || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };

  const onMouseEnter = () => {
    if (!canHover() || prefersReducedMotion()) return;
    ref.current?.style.setProperty('--ty', '-6px');
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--ty', '0px');
  };

  return { ref, handlers: { onMouseMove, onMouseEnter, onMouseLeave } };
}

/** Tiêu đề hiện từng chữ. Nội dung `text` được giữ nguyên, chỉ tách theo khoảng trắng. */
export function RevealTitle({
  text,
  className,
  delayMs = 0,
  as: Tag = 'h2',
}: {
  text: string;
  className?: string;
  delayMs?: number;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const words = text.split(' ');
  return (
    <Tag className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="fx-mask">
            <span className="fx-word" style={delay(delayMs + i * 80)}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Quy ước:
 *  - `.fx-sec`  là vùng bao section; thêm `.fx-in` khi section lần đầu lọt vào màn hình.
 *  - `.fx-cs`   là vùng bao từng card; thêm `.fx-in` khi card đó lần đầu lọt vào màn hình.
 * Trạng thái ẩn chỉ áp dụng khi chưa có `.fx-in`, còn animation dùng fill-mode `backwards`
 * nên khi chạy xong phần tử trả về đúng style gốc (hover, transition vẫn hoạt động bình thường).
 */
export const SECTION_FX_CSS = `
.fx-mask {
  display: inline-block; overflow: hidden; vertical-align: top;
  padding-top: 0.2em; margin-top: -0.2em;
  padding-bottom: 0.14em; margin-bottom: -0.14em;
}
.fx-word { display: inline-block; transform-origin: 0 100%; }
.fx-line { transform-origin: left; }
.fx-edge { opacity: 0; }
.fx-tilt {
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--ty, 0px));
  transition: transform 0.3s ease-out, border-color 0.3s, box-shadow 0.3s;
  will-change: transform;
}
.fx-glare {
  background: radial-gradient(240px circle at var(--gx, 50%) var(--gy, 50%), rgba(251, 191, 36, 0.18), transparent 70%);
}

@media (prefers-reduced-motion: no-preference) {
  /* ---------- Trạng thái ẩn (trước khi cuộn tới) ---------- */
  .fx-sec:not(.fx-in) .fx-wipe { clip-path: inset(0 100% 0 0); }
  .fx-sec:not(.fx-in) .fx-word { opacity: 0; transform: translateY(115%) rotate(5deg); }
  .fx-sec:not(.fx-in) :is(.fx-rise, .fx-pop) { opacity: 0; }
  .fx-sec:not(.fx-in) .fx-line { transform: scaleX(0); }

  .fx-cs.fx-card:not(.fx-in) { opacity: 0; }
  .fx-cs:not(.fx-in) .fx-clip { clip-path: inset(0 0 100% 0); }
  .fx-cs:not(.fx-in) .fx-zoom { transform: scale(1.4); }
  .fx-cs:not(.fx-in) :is(.fx-badge, .fx-text) { opacity: 0; }

  /* ---------- Chạy khi lần đầu cuộn tới ---------- */
  .fx-sec.fx-in .fx-wipe  { animation: fx-wipe 1s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }
  .fx-sec.fx-in .fx-word  { animation: fx-word-up 1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .fx-sec.fx-in .fx-rise  { animation: fx-rise 1.1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .fx-sec.fx-in .fx-pop   { animation: fx-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) backwards; }
  .fx-sec.fx-in .fx-line  { animation: fx-draw-x 1.6s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }
  .fx-sec.fx-in .fx-compass { animation: fx-spin 1.6s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }

  .fx-cs.fx-card.fx-in { animation: fx-card-rise 1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .fx-cs.fx-in .fx-clip  { animation: fx-clip-down 1.1s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }
  .fx-cs.fx-in .fx-zoom  { animation: fx-zoom-out 1.6s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .fx-cs.fx-in .fx-badge { animation: fx-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) backwards; }
  .fx-cs.fx-in .fx-text  { animation: fx-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .fx-cs.fx-in .fx-edge  { animation: fx-edge 1.4s ease-out var(--d, 0ms) both; }

  /* ---------- Hiệu ứng lặp nhẹ ---------- */
  .fx-spark { animation: fx-twinkle 2.6s ease-in-out infinite; }
}

@keyframes fx-wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes fx-word-up { from { opacity: 0; transform: translateY(115%) rotate(5deg); } }
@keyframes fx-rise { from { opacity: 0; transform: translateY(18px); filter: blur(8px); } }
@keyframes fx-pop { from { opacity: 0; transform: scale(0.8) translateY(12px); } }
@keyframes fx-draw-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes fx-spin { from { transform: rotate(-200deg) scale(0.6); opacity: 0; } }
@keyframes fx-twinkle { 0%, 100% { transform: scale(1) rotate(0); opacity: 1; } 50% { transform: scale(1.35) rotate(25deg); opacity: 0.7; } }
@keyframes fx-card-rise { from { opacity: 0; transform: translateY(70px) scale(0.95); } }
@keyframes fx-clip-down { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes fx-zoom-out { from { transform: scale(1.4); } }
@keyframes fx-edge { 0% { opacity: 0; transform: scaleX(0); } 40% { opacity: 1; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(1); } }
`;
