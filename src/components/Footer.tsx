import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Compass, Sparkles, MapPin, Heart } from 'lucide-react';
import { PROVINCES } from '../data/culturalData';
import { ProvinceId } from '../types/cultural';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectProvince: (provId: ProvinceId) => void;
}

/* ------------------------------------------------------------------ */
/* Helpers (cùng quy ước với LandingHero)                              */
/* ------------------------------------------------------------------ */

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** Chỉ kích hoạt MỘT LẦN, khi phần tử lần đầu tiên lọt vào màn hình. */
function useInViewOnce<T extends HTMLElement>(threshold = 0.2) {
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
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

/** Liên kết trong footer: gạch chân vàng vẽ dần + nhích nhẹ khi hover. */
function FooterLink({
  onClick,
  leading,
  children,
}: {
  onClick: () => void;
  leading?: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="group/link inline-flex items-center gap-1.5 hover:text-amber-300 hover:translate-x-1 transition-all duration-300"
    >
      {leading}
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-px w-full bg-amber-300/70 origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100"
        />
      </span>
    </button>
  );
}

export function Footer({ onNavigate, onSelectProvince }: FooterProps) {
  const [footerRef, inView] = useInViewOnce<HTMLElement>(0.15);

  // Đom đóm mờ bay lên, giá trị cố định để không nhảy giữa các lần render.
  const embers = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        left: (i * 37 + 11) % 100,
        size: 2 + ((i * 5) % 3),
        dur: 8 + ((i * 7) % 7),
        del: ((i * 13) % 8) * 0.9,
        dx: (i % 2 ? 1 : -1) * (15 + ((i * 11) % 40)),
        o: 0.25 + ((i * 3) % 4) * 0.08,
      })),
    [],
  );

  return (
    <footer
      ref={footerRef}
      className={`ft-root relative overflow-hidden bg-stone-950 border-t border-stone-800 text-stone-400 py-12 ${
        inView ? 'ft-in' : ''
      }`}
    >
      <style>{CSS}</style>

      {/* Vệt sáng vàng quét qua mép trên khi footer lần đầu xuất hiện */}
      <span
        aria-hidden="true"
        className="ft-edge absolute top-0 left-0 right-0 h-px z-10 bg-gradient-to-r from-transparent via-amber-300 to-transparent"
        style={delay(100)}
      />

      {/* Đom đóm bay lên */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {embers.map((e, i) => (
          <span
            key={i}
            className="ft-ember absolute bottom-0 rounded-full bg-amber-300"
            style={
              {
                left: `${e.left}%`,
                width: e.size,
                height: e.size,
                animationDuration: `${e.dur}s`,
                animationDelay: `${1 + e.del}s`,
                '--dx': `${e.dx}px`,
                '--o': e.o,
                boxShadow: '0 0 8px 2px rgba(251,191,36,0.5)',
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800/80">
          {/* Đường kẻ vàng vẽ dần phủ lên viền dưới */}
          <span
            aria-hidden="true"
            className="ft-draw-x absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-amber-400/70 via-stone-700/80 to-stone-800/60"
            style={delay(900)}
          />

          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="ft-rise group flex items-center gap-2" style={delay(150)}>
              <Compass className="ft-compass w-5 h-5 text-amber-400" />
              <span className="text-xl font-serif font-bold text-amber-200 group-hover:text-amber-100 transition-colors">
                Bản Đồ Văn Hóa Đông Nam Bộ
              </span>
            </div>
            <p className="ft-rise text-xs text-stone-400 max-w-md leading-relaxed" style={delay(280)}>
              Dự án bản đồ tương tác kết hợp nghệ thuật thị giác và kể chuyện số (Visual Storytelling & Digital Exhibition), tôn vinh các di tích lịch sử, làng nghề truyền thống, tín ngưỡng dân gian và nét đẹp ẩm thực của miền Đông gian lao mà anh dũng.
            </p>
            <div className="ft-rise flex items-center gap-2 text-xs text-stone-500 pt-1" style={delay(410)}>
              <span>Phương Nam văn hiến</span>
              <span aria-hidden="true">·</span>
              <span>Đất đỏ miền Đông</span>
              <span aria-hidden="true">·</span>
              <span>Di sản ngàn năm</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="ft-rise text-xs font-mono uppercase tracking-wider text-stone-200" style={delay(250)}>
              Điều Hướng Nhanh
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="ft-rise" style={delay(360)}>
                <FooterLink onClick={() => onNavigate('hero')}>Màn hình mở đầu</FooterLink>
              </li>
              <li className="ft-rise" style={delay(450)}>
                <FooterLink onClick={() => onNavigate('map-section')}>
                  Bản đồ không gian tương tác
                </FooterLink>
              </li>
              <li className="ft-rise" style={delay(540)}>
                <FooterLink onClick={() => onNavigate('gallery-section')}>
                  Triển lãm di sản văn hóa
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Core Provinces */}
          <div className="space-y-3">
            <h4 className="ft-rise text-xs font-mono uppercase tracking-wider text-stone-200" style={delay(350)}>
              Trọng Điểm Khảo Sát
            </h4>
            <ul className="space-y-2 text-xs">
              {PROVINCES.map((p, i) => (
                <li key={p.id} className="ft-rise" style={delay(460 + i * 90)}>
                  <FooterLink
                    onClick={() => {
                      onSelectProvince(p.id);
                      onNavigate('map-section');
                    }}
                    leading={
                      <span className="relative inline-flex w-1.5 h-1.5">
                        <span
                          aria-hidden="true"
                          className="ft-ping absolute inset-0 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <span
                          className="relative w-1.5 h-1.5 rounded-full transition-transform duration-300 group-hover/link:scale-150"
                          style={{ backgroundColor: p.color }}
                        />
                      </span>
                    }
                  >
                    {p.name}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quiet Copyright & Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p className="ft-rise" style={delay(1000)}>
            © 2026 Bản Đồ Văn Hóa Đông Nam Bộ. Triển lãm số di sản Việt Nam.
          </p>
          <div className="ft-rise flex items-center gap-1" style={delay(1100)}>
            <span>Dành trọn tình yêu với văn hóa & con người phương Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* CSS: trạng thái ẩn + animation nằm trong media query no-preference, */
/* nên người dùng bật "giảm chuyển động" vẫn thấy đủ nội dung.         */
/* Hiệu ứng chỉ chạy MỘT LẦN khi footer lần đầu cuộn tới (.ft-in).     */
/* ------------------------------------------------------------------ */

const CSS = `
.ft-root .ft-edge { opacity: 0; }
.ft-root .ft-ember, .ft-root .ft-ping { display: none; }

@media (prefers-reduced-motion: no-preference) {
  .ft-root .ft-ember, .ft-root .ft-ping { display: block; }

  .ft-root .ft-rise   { opacity: 0; }
  .ft-root .ft-draw-x { transform: scaleX(0); transform-origin: left; }

  .ft-root.ft-in .ft-rise   { animation: ft-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) forwards; }
  .ft-root.ft-in .ft-draw-x { animation: ft-draw-x 1.4s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) forwards; }
  .ft-root.ft-in .ft-edge   { animation: ft-edge 1.4s ease-out var(--d, 0ms) forwards; }

  /* ---- Hiệu ứng lặp nhẹ / khi hover ---- */
  .ft-root .ft-ping  { animation: ft-ping 2.4s ease-out infinite; }
  .ft-root .ft-ember { opacity: 0; animation-name: ft-ember; animation-timing-function: linear; animation-iteration-count: infinite; }
  .ft-root .group:hover .ft-compass { animation: ft-spin 0.9s cubic-bezier(0.34, 1.56, 0.64, 1); }
}

@media (prefers-reduced-motion: reduce) {
  .ft-root .ft-edge { display: none; }
}

@keyframes ft-rise { from { opacity: 0; transform: translateY(18px); filter: blur(8px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes ft-draw-x { to { transform: scaleX(1); } }
@keyframes ft-edge { 0% { opacity: 0; transform: scaleX(0); } 40% { opacity: 1; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(1); } }
@keyframes ft-ping { 0% { transform: scale(1); opacity: 0.7; } 80%, 100% { transform: scale(3); opacity: 0; } }
@keyframes ft-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes ft-ember {
  0% { transform: translate3d(0, 0, 0) scale(0.6); opacity: 0; }
  12% { opacity: var(--o, 0.4); }
  100% { transform: translate3d(var(--dx, 0px), -260px, 0) scale(1.1); opacity: 0; }
}
`;