import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { ArrowDown, Compass, MapPin, Sparkles } from 'lucide-react';
import { PROVINCES } from '../data/culturalData';
import { ProvinceId } from '../types/cultural';
import heroBgImage from '../assets/images/dong_nam_bo_landscape_1794323908424.jpg';
interface LandingHeroProps {
  onExploreMap: (provinceId?: ProvinceId) => void;
  totalPointsCount: number;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

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

/** Số chạy từ 0 lên giá trị đích (easeOutExpo). */
function useCountUp(target: number, active: boolean, startDelay = 0, duration = 1800) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    if (!active) return;
    let raf = 0;
    let start = 0;
    const timer = setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now;
        const p = Math.min((now - start) / duration, 1);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setValue(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, active, startDelay, duration]);

  return value;
}

interface StatProps {
  target: number;
  pad?: number;
  suffix?: string;
  label: string;
  active: boolean;
  appearAt: number;
}

function Stat({ target, pad = 0, suffix = '', label, active, appearAt }: StatProps) {
  const n = useCountUp(target, active, appearAt + 200);
  const text = pad ? String(n).padStart(pad, '0') : String(n);
  return (
    <div className="lh-stat" style={delay(appearAt)}>
      <div className="text-2xl font-serif font-bold text-amber-300 font-mono tabular-nums">
        {text}
        {suffix}
      </div>
      <div className="text-stone-400 text-xs mt-0.5">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card tỉnh thành: lật nghiêng 3D + ánh sáng quét theo chuột          */
/* ------------------------------------------------------------------ */

type Province = (typeof PROVINCES)[number];

function ProvinceCard({
  prov,
  index,
  onSelect,
}: {
  prov: Province;
  index: number;
  onSelect: (id: ProvinceId) => void;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canHover() || prefersReducedMotion()) return;
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };

  const handleEnter = () => {
    if (!canHover() || prefersReducedMotion()) return;
    tiltRef.current?.style.setProperty('--ty', '-6px');
  };

  const handleLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--ty', '0px');
  };

  return (
    <div className="lh-card" style={delay(index * 160)}>
      <div
        ref={tiltRef}
        onClick={() => onSelect(prov.id)}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="lh-tilt group relative rounded-2xl overflow-hidden border border-stone-800/80 bg-stone-900/60 hover:border-amber-400/50 transition-[border-color,box-shadow] duration-300 cursor-pointer shadow-lg hover:shadow-amber-950/30"
      >
        {/* Vệt sáng vàng quét qua mép trên khi card xuất hiện */}
        <span
          aria-hidden="true"
          className="lh-edge absolute top-0 left-0 right-0 h-px z-20 bg-gradient-to-r from-transparent via-amber-300 to-transparent"
          style={delay(index * 160 + 500)}
        />

        {/* Ánh sáng bám theo con trỏ */}
        <div
          aria-hidden="true"
          className="lh-glare pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <div className="lh-clip h-40 sm:h-44 w-full overflow-hidden relative" style={delay(index * 160 + 150)}>
          <div className="lh-zoom w-full h-full" style={delay(index * 160 + 150)}>
            <img
              src={prov.heroImage}
              alt={prov.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
          <div
            className="lh-badge absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium backdrop-blur-md border border-white/10"
            style={{
              backgroundColor: `${prov.color}33`,
              color: prov.accentColor,
              ...delay(index * 160 + 750),
            }}
          >
            {prov.shortName}
          </div>
        </div>

        <div className="p-4 bg-stone-950/80 backdrop-blur-sm">
          <h3 className="lh-text text-lg font-serif font-semibold text-stone-100 group-hover:text-amber-300 transition-colors flex items-center justify-between" style={delay(index * 160 + 600)}>
            <span>{prov.name}</span>
            <MapPin className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
          </h3>
          <p className="lh-text text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed" style={delay(index * 160 + 720)}>
            {prov.tagline}
          </p>
          <div className="lh-text mt-3 pt-3 border-t border-stone-800/60 flex items-center justify-between text-xs text-stone-400" style={delay(index * 160 + 840)}>
            <span>Khám phá các điểm di tích</span>
            <span className="text-amber-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
              Xem bản đồ &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const HEADLINE_WORDS = ['Khám', 'Phá', 'Di', 'Sản', '&', 'Bản', 'Sắc', 'Văn', 'Hóa'];

export function LandingHero({ onExploreMap, totalPointsCount }: LandingHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [stripRef, stripInView] = useInViewOnce<HTMLDivElement>(0.15);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Parallax khi cuộn: nền trôi chậm hơn, nội dung nhích lên nhẹ.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(window.scrollY, window.innerHeight * 1.2);
        bgRef.current?.style.setProperty('--sy', `${y * 0.18}px`);
        contentRef.current?.style.setProperty('--cy', `${y * -0.08}px`);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Parallax theo chuột + đèn rọi di chuyển trên nền.
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!canHover() || prefersReducedMotion()) return;
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    bgRef.current?.style.setProperty('--mx', String(px - 0.5));
    bgRef.current?.style.setProperty('--my', String(py - 0.5));
    spotRef.current?.style.setProperty('--px', `${px * 100}%`);
    spotRef.current?.style.setProperty('--py', `${py * 100}%`);
  };

  // Đom đóm / tro bếp bay lên, giá trị cố định để không nhảy giữa các lần render.
  const embers = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: (i * 37 + 11) % 100,
        size: 2 + ((i * 5) % 4),
        dur: 9 + ((i * 7) % 9),
        del: ((i * 13) % 10) * 0.9,
        dx: ((i % 2 ? 1 : -1) * (20 + ((i * 11) % 60))),
        o: 0.35 + ((i * 3) % 5) * 0.1,
      })),
    [],
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="lh-root relative isolate min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden"
    >
      <style>{CSS}</style>

      {/* Background Image with Curatorial Scrim */}
      <div className="absolute inset-0 -z-10">
        <div ref={bgRef} className="lh-bg absolute -inset-x-[4%] -top-[12%] -bottom-[12%]">
          <img
            src={heroBgImage}
            alt="Cảnh sắc thiên nhiên và sông nước Đông Nam Bộ"
            className="lh-kenburns w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Multilayer gradient scrim: dark rich museum lacquer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/45" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-stone-950/40 to-stone-950/90" />
        {/* Đèn rọi vàng đi theo chuột */}
        <div ref={spotRef} aria-hidden="true" className="lh-spot absolute inset-0" />
        {/* Màn đen mở ra như tấm rèm triển lãm */}
        <div aria-hidden="true" className="lh-curtain absolute inset-0 bg-stone-950" />
      </div>

      {/* Đom đóm bay lên */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
        {embers.map((e, i) => (
          <span
            key={i}
            className="lh-ember absolute bottom-0 rounded-full bg-amber-300"
            style={
              {
                left: `${e.left}%`,
                width: e.size,
                height: e.size,
                animationDuration: `${e.dur}s`,
                animationDelay: `${1.2 + e.del}s`,
                '--dx': `${e.dx}px`,
                '--o': e.o,
                boxShadow: '0 0 10px 2px rgba(251,191,36,0.55)',
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div ref={contentRef} className="lh-content max-w-3xl">
          {/* Curatorial Header Decker */}
          <div
            className="lh-wipe flex flex-wrap items-center gap-3 text-xs tracking-widest uppercase font-mono text-amber-400 mb-4"
            style={delay(500)}
          >
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="lh-spark w-3.5 h-3.5 text-amber-400" />
              TRIỂN LÃM DI SẢN KỸ THUẬT SỐ
            </span>
            <span aria-hidden="true">·</span>
            <span>ĐÔNG NAM BỘ VIỆT NAM</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-400">PHƯƠNG NAM VĂN HIẾN</span>
          </div>

          {/* Editorial Display Headline: từng chữ trồi lên từ sau mặt nạ */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-100 tracking-tight leading-[1.15] mb-6 text-balance">
            {HEADLINE_WORDS.map((w, i) => (
              <span key={i}>
                <span className="lh-mask">
                  <span className="lh-word" style={delay(750 + i * 90)}>
                    {w}
                  </span>
                </span>{' '}
              </span>
            ))}
            <span className="lh-mask">
              <span
                className="lh-word lh-shimmer text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100"
                style={delay(750 + HEADLINE_WORDS.length * 90)}
              >
                Đông Nam Bộ
              </span>
            </span>
          </h1>

          {/* Lead Prose */}
          <p
            className="lh-rise text-base sm:text-lg text-stone-300 leading-relaxed font-light mb-8 max-w-2xl"
            style={delay(1800)}
          >
            Vùng đất trầm tích lịch sử bên những dòng sông lớn — nơi giao thoa giữa hào khí khẩn hoang, tinh hoa làng nghề gốm sứ trăm năm, văn hóa biển đảo thiêng liêng và nhịp sống đô thị di sản phồn vinh.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <div className="lh-pop" style={delay(2050)}>
              <button
                onClick={() => onExploreMap()}
                className="lh-cta relative overflow-hidden px-6 py-3.5 rounded-xl font-medium text-sm text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-950/60 transition-all flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span aria-hidden="true" className="lh-sheen absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-md" />
                <Compass className="lh-compass relative w-4 h-4 text-stone-950" />
                <span className="relative font-semibold">Khám phá bản đồ trực quan</span>
              </button>
            </div>

            <div className="lh-pop" style={delay(2200)}>
              <a
                href="#provinces-section"
                className="px-5 py-3.5 rounded-xl font-medium text-sm text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 transition-all flex items-center gap-2 hover:border-amber-400/50"
              >
                <span>Xem 3 tỉnh thành trọng điểm</span>
                <ArrowDown className="lh-bounce w-4 h-4 text-stone-400" />
              </a>
            </div>
          </div>

          {/* Unboxed Metadata Stats Row */}
          <div className="relative flex flex-wrap items-center gap-6 sm:gap-10 pt-6 text-xs sm:text-sm text-stone-400">
            <span
              aria-hidden="true"
              className="lh-draw-x absolute top-0 left-0 h-px w-full bg-gradient-to-r from-amber-400/70 via-stone-700/80 to-stone-800/60"
              style={delay(2350)}
            />
            <Stat target={3} pad={2} label="Tỉnh thành hạt nhân" active={ready} appearAt={2450} />
            <div className="lh-draw-y w-px h-8 bg-stone-800" style={delay(2550)} />
            <Stat target={totalPointsCount} suffix="+" label="Điểm di sản văn hóa" active={ready} appearAt={2600} />
            <div className="lh-draw-y w-px h-8 bg-stone-800" style={delay(2700)} />
            <Stat target={6} pad={2} label="Trụ cột loại hình di sản" active={ready} appearAt={2750} />
            <div className="lh-draw-y w-px h-8 bg-stone-800" style={delay(2850)} />
            <Stat target={300} suffix="+" label="Năm văn hiến phương Nam" active={ready} appearAt={2900} />
          </div>
        </div>
      </div>

      {/* Featured Provinces Strip: chỉ chạy hiệu ứng khi lần đầu cuộn tới */}
      <div
        id="provinces-section"
        ref={stripRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 ${stripInView ? 'lh-in' : ''}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROVINCES.map((prov, i) => (
            <ProvinceCard key={prov.id} prov={prov} index={i} onSelect={onExploreMap} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CSS: toàn bộ trạng thái ẩn + animation nằm trong media query        */
/* no-preference, nên người dùng bật "giảm chuyển động" vẫn thấy đủ    */
/* nội dung, không có hiệu ứng.                                        */
/* ------------------------------------------------------------------ */

const CSS = `
.lh-root .lh-bg {
  transform: translate3d(calc(var(--mx, 0) * -14px), calc(var(--sy, 0px) + var(--my, 0) * -10px), 0);
  transition: transform 0.35s ease-out;
  will-change: transform;
}
.lh-root .lh-content { transform: translate3d(0, var(--cy, 0px), 0); }
.lh-root .lh-spot {
  background: radial-gradient(420px circle at var(--px, 50%) var(--py, 40%), rgba(251, 191, 36, 0.13), transparent 65%);
  mix-blend-mode: screen;
  opacity: 0;
}
.lh-root .lh-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding-top: 0.2em; margin-top: -0.2em;
  padding-bottom: 0.14em; margin-bottom: -0.14em;
}
.lh-root .lh-word { display: inline-block; transform-origin: 0 100%; }
.lh-root .lh-shimmer { background-size: 220% auto; }
.lh-root .lh-curtain, .lh-root .lh-ember { display: none; }
.lh-root .lh-tilt {
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--ty, 0px));
  transition: transform 0.3s ease-out, border-color 0.3s, box-shadow 0.3s;
  will-change: transform;
}
.lh-root .lh-glare {
  background: radial-gradient(240px circle at var(--gx, 50%) var(--gy, 50%), rgba(251, 191, 36, 0.18), transparent 70%);
}
.lh-root .lh-edge { opacity: 0; }

@media (prefers-reduced-motion: no-preference) {
  .lh-root .lh-spot { opacity: 1; transition: opacity 1.2s ease 1.5s; }
  .lh-root .lh-curtain, .lh-root .lh-ember { display: block; }

  /* ---- Màn mở đầu ---- */
  .lh-root .lh-curtain {
    animation: lh-curtain 1.6s cubic-bezier(0.76, 0, 0.24, 1) 0.1s forwards;
    transform-origin: top;
  }
  .lh-root .lh-kenburns { animation: lh-kenburns 14s cubic-bezier(0.22, 1, 0.36, 1) both; }

  .lh-root .lh-wipe  { clip-path: inset(0 100% 0 0); animation: lh-wipe 1s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-word  { opacity: 0; transform: translateY(115%) rotate(5deg); animation: lh-word-up 1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-shimmer { animation: lh-word-up 1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) forwards, lh-shimmer 5s ease-in-out calc(var(--d, 0ms) + 1s) infinite alternate; }
  .lh-root .lh-rise  { opacity: 0; animation: lh-rise 1.1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-pop   { opacity: 0; animation: lh-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-stat  { opacity: 0; animation: lh-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-draw-x { transform: scaleX(0); transform-origin: left; animation: lh-draw-x 1.4s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-draw-y { transform: scaleY(0); transform-origin: center; animation: lh-draw-y 0.6s ease-out var(--d, 0ms) forwards; }

  /* ---- Hiệu ứng lặp nhẹ ---- */
  .lh-root .lh-cta { animation: lh-ring 2.8s ease-out 3.4s infinite; }
  .lh-root .lh-sheen { transform: translateX(-120%) skewX(-20deg); animation: lh-sheen 4.5s ease-in-out 3.2s infinite; }
  .lh-root .lh-spark { animation: lh-twinkle 2.6s ease-in-out infinite; }
  .lh-root .lh-bounce { animation: lh-bounce 1.8s ease-in-out 3s infinite; }
  .lh-root .lh-cta:hover .lh-compass { animation: lh-spin 0.9s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .lh-root .lh-ember { opacity: 0; animation-name: lh-ember; animation-timing-function: linear; animation-iteration-count: infinite; }

  /* ---- Dải tỉnh thành: chạy khi lần đầu cuộn tới ---- */
  .lh-root .lh-card, .lh-root .lh-text, .lh-root .lh-badge { opacity: 0; }
  .lh-root .lh-clip { clip-path: inset(0 0 100% 0); }
  .lh-root .lh-zoom { transform: scale(1.4); }

  .lh-root .lh-in .lh-card  { animation: lh-card-rise 1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-in .lh-clip  { animation: lh-clip-down 1.1s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-in .lh-zoom  { animation: lh-zoom-out 1.6s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-in .lh-badge { animation: lh-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-in .lh-text  { animation: lh-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) forwards; }
  .lh-root .lh-in .lh-edge  { animation: lh-edge 1.4s ease-out var(--d, 0ms) forwards; }
}

/* Giảm chuyển động: hiện đủ nội dung, không animation */
@media (prefers-reduced-motion: reduce) {
  .lh-root .lh-edge { display: none; }
}

@keyframes lh-curtain { to { transform: scaleY(0); } }
@keyframes lh-kenburns { from { transform: scale(1.22); filter: blur(6px); } to { transform: scale(1.06); filter: blur(0); } }
@keyframes lh-wipe { to { clip-path: inset(0 0 0 0); } }
@keyframes lh-word-up { to { opacity: 1; transform: none; } }
@keyframes lh-rise { from { opacity: 0; transform: translateY(18px); filter: blur(8px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes lh-pop { 0% { opacity: 0; transform: scale(0.8) translateY(12px); } 100% { opacity: 1; transform: none; } }
@keyframes lh-draw-x { to { transform: scaleX(1); } }
@keyframes lh-draw-y { to { transform: scaleY(1); } }
@keyframes lh-shimmer { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
@keyframes lh-sheen { 0%, 55% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(420%) skewX(-20deg); } }
@keyframes lh-ring { 0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); } 70%, 100% { box-shadow: 0 0 0 16px rgba(251, 191, 36, 0); } }
@keyframes lh-twinkle { 0%, 100% { transform: scale(1) rotate(0); opacity: 1; } 50% { transform: scale(1.35) rotate(25deg); opacity: 0.7; } }
@keyframes lh-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
@keyframes lh-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes lh-ember {
  0% { transform: translate3d(0, 0, 0) scale(0.6); opacity: 0; }
  12% { opacity: var(--o, 0.5); }
  100% { transform: translate3d(var(--dx, 0px), -100vh, 0) scale(1.1); opacity: 0; }
}
@keyframes lh-card-rise { from { opacity: 0; transform: translateY(70px) scale(0.95); } to { opacity: 1; transform: none; } }
@keyframes lh-clip-down { to { clip-path: inset(0 0 0 0); } }
@keyframes lh-zoom-out { to { transform: scale(1); } }
@keyframes lh-edge { 0% { opacity: 0; transform: scaleX(0); } 40% { opacity: 1; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(1); } }
`;