import { useMemo, useRef } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { X, ArrowRight, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { CulturalPoint } from '../types/cultural';
import { CULTURAL_CATEGORIES } from '../data/culturalData';

interface CulturalPointPreviewProps {
  point: CulturalPoint;
  onClose: () => void;
  onExploreMore: (point: CulturalPoint) => void;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export function CulturalPointPreview({ point, onClose, onExploreMore }: CulturalPointPreviewProps) {
  const categoryInfo = CULTURAL_CATEGORIES.find((c) => c.id === point.category);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canHover() || prefersReducedMotion()) return;
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const embers = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        left: (i * 37 + 11) % 100,
        size: 2 + ((i * 5) % 3),
        dur: 5 + ((i * 7) % 5),
        del: ((i * 13) % 6) * 0.7,
        dx: (i % 2 ? 1 : -1) * (10 + ((i * 11) % 30)),
        o: 0.4 + ((i * 3) % 4) * 0.1,
      })),
    [],
  );

  const nameWords = point.name.split(/\s+/).filter(Boolean);

  return (
    <div
      key={point.id}
      ref={rootRef}
      onMouseMove={handleMove}
      className="cpp-root cpp-panel group relative w-full bg-stone-950/95 backdrop-blur-xl border border-stone-800 hover:border-amber-400/40 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden transition-[border-color] duration-300"
    >
      <style>{CSS}</style>

      {/* Vệt sáng vàng quét qua mép trên */}
      <span
        aria-hidden="true"
        className="cpp-edge absolute top-0 left-0 right-0 h-px z-20 bg-gradient-to-r from-transparent via-amber-300 to-transparent"
        style={delay(450)}
      />

      {/* Ánh sáng bám theo con trỏ */}
      <div
        aria-hidden="true"
        className="cpp-glare pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Top Banner Image */}
      <div className="cpp-clip relative h-36 w-full overflow-hidden" style={delay(100)}>
        <img
          src={point.coverImage}
          alt={point.name}
          className="cpp-kenburns w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        {/* Đom đóm bay lên */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {embers.map((e, i) => (
            <span
              key={i}
              className="cpp-ember absolute bottom-0 rounded-full bg-amber-300"
              style={
                {
                  left: `${e.left}%`,
                  width: e.size,
                  height: e.size,
                  animationDuration: `${e.dur}s`,
                  animationDelay: `${0.8 + e.del}s`,
                  '--dx': `${e.dx}px`,
                  '--o': e.o,
                  boxShadow: '0 0 8px 2px rgba(251,191,36,0.55)',
                } as CSSProperties
              }
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng bảng xem trước"
          className="group/close absolute top-3 right-3 p-1.5 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white transition-colors cursor-pointer border border-white/10 hover:border-amber-400/50 z-20"
        >
          <X className="w-4 h-4 transition-transform duration-300 group-hover/close:rotate-90" />
        </button>

        {/* Category Badge & Era */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] z-20">
          <span
            className="cpp-pop px-2.5 py-0.5 rounded-full font-medium border text-xs"
            style={{
              backgroundColor: `${categoryInfo?.color || '#f59e0b'}22`,
              color: categoryInfo?.color || '#f59e0b',
              borderColor: `${categoryInfo?.color || '#f59e0b'}44`,
              ...delay(500),
            }}
          >
            {categoryInfo?.label || 'Di sản văn hóa'}
          </span>
          {point.era && (
            <span
              className="cpp-wipe text-stone-300 font-mono text-[11px] bg-stone-900/80 px-2 py-0.5 rounded border border-white/5 truncate max-w-[160px]"
              style={delay(600)}
            >
              {point.era}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-100 group-hover:text-amber-300 transition-colors leading-snug">
          {nameWords.map((w, i) => (
            <span key={i}>
              <span className="cpp-mask">
                <span className="cpp-word" style={delay(450 + i * 70)}>
                  {w}
                </span>
              </span>
              {i < nameWords.length - 1 ? ' ' : null}
            </span>
          ))}
        </h3>

        <div
          className="cpp-rise flex items-start gap-1.5 text-xs text-stone-400 mt-2"
          style={delay(450 + nameWords.length * 70 + 60)}
        >
          <MapPin className="cpp-bounce w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{point.address}</span>
        </div>

        <p
          className="cpp-rise text-xs text-stone-300 mt-2.5 line-clamp-2 leading-relaxed"
          style={delay(450 + nameWords.length * 70 + 180)}
        >
          {point.shortIntro}
        </p>

        {/* Action Button */}
        <div className="relative mt-4 pt-3 flex items-center justify-between">
          <span
            aria-hidden="true"
            className="cpp-draw-x absolute top-0 left-0 h-px w-full bg-gradient-to-r from-amber-400/60 via-stone-700/80 to-stone-800/60"
            style={delay(900)}
          />
          <button
            onClick={onClose}
            className="cpp-pop text-xs text-stone-400 hover:text-stone-200 transition-colors"
            style={delay(1000)}
          >
            Thu nhỏ
          </button>
          <div className="cpp-pop" style={delay(1100)}>
            <button
              onClick={() => onExploreMore(point)}
              className="cpp-cta group/cta relative overflow-hidden flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span aria-hidden="true" className="cpp-sheen absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-md" />
              <span className="relative">Khám phá chi tiết</span>
              <ArrowRight className="relative w-3.5 h-3.5 text-stone-950 transition-transform duration-300 group-hover/cta:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.cpp-root .cpp-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding-top: 0.2em; margin-top: -0.2em;
  padding-bottom: 0.14em; margin-bottom: -0.14em;
}
.cpp-root .cpp-word { display: inline-block; transform-origin: 0 100%; }
.cpp-root .cpp-glare {
  background: radial-gradient(240px circle at var(--gx, 50%) var(--gy, 50%), rgba(251, 191, 36, 0.14), transparent 70%);
}
.cpp-root .cpp-edge { opacity: 0; }
.cpp-root .cpp-ember, .cpp-root .cpp-sheen { display: none; }

@media (prefers-reduced-motion: no-preference) {
  .cpp-root .cpp-ember, .cpp-root .cpp-sheen { display: block; }

  .cpp-root.cpp-panel { animation: cpp-panel 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
  .cpp-root .cpp-clip     { animation: cpp-clip-down 0.9s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }
  .cpp-root .cpp-kenburns { animation: cpp-kenburns 1.6s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
  .cpp-root .cpp-edge     { animation: cpp-edge 1.4s ease-out var(--d, 0ms) backwards; }
  .cpp-root .cpp-wipe     { animation: cpp-wipe 0.8s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }
  .cpp-root .cpp-word     { animation: cpp-word-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .cpp-root .cpp-rise     { animation: cpp-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .cpp-root .cpp-pop      { animation: cpp-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) backwards; }
  .cpp-root .cpp-draw-x   { transform-origin: left; animation: cpp-draw-x 1.2s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }

  .cpp-root .cpp-cta    { animation: cpp-ring 2.8s ease-out 2.2s infinite; }
  .cpp-root .cpp-sheen  { transform: translateX(-120%) skewX(-20deg); animation: cpp-sheen 4.5s ease-in-out 2s infinite; }
  .cpp-root .cpp-bounce { animation: cpp-bounce 1.8s ease-in-out 2s infinite; }
  .cpp-root .cpp-ember  { opacity: 0; animation-name: cpp-ember; animation-timing-function: linear; animation-iteration-count: infinite; }
}

@media (prefers-reduced-motion: reduce) {
  .cpp-root .cpp-edge { display: none; }
}

@keyframes cpp-panel { from { opacity: 0; transform: translateY(28px) scale(0.96); filter: blur(8px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes cpp-clip-down { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes cpp-kenburns { from { transform: scale(1.3); filter: blur(5px); } to { transform: scale(1); filter: blur(0); } }
@keyframes cpp-edge { 0% { opacity: 0; transform: scaleX(0); } 40% { opacity: 1; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(1); } }
@keyframes cpp-wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes cpp-word-up { from { opacity: 0; transform: translateY(115%) rotate(5deg); } to { opacity: 1; transform: none; } }
@keyframes cpp-rise { from { opacity: 0; transform: translateY(14px); filter: blur(6px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes cpp-pop { 0% { opacity: 0; transform: scale(0.8) translateY(10px); } 100% { opacity: 1; transform: none; } }
@keyframes cpp-draw-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes cpp-sheen { 0%, 55% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(520%) skewX(-20deg); } }
@keyframes cpp-ring { 0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); } 70%, 100% { box-shadow: 0 0 0 12px rgba(251, 191, 36, 0); } }
@keyframes cpp-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
@keyframes cpp-ember {
  0% { transform: translate3d(0, 0, 0) scale(0.6); opacity: 0; }
  12% { opacity: var(--o, 0.5); }
  100% { transform: translate3d(var(--dx, 0px), -150px, 0) scale(1.1); opacity: 0; }
}
`;