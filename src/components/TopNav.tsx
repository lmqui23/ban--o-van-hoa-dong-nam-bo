import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Compass, Database } from 'lucide-react';

interface TopNavProps {
  onNavigate: (sectionId: string) => void;
  onOpenCMS: () => void;
  activeSection: string;
}

/* ------------------------------------------------------------------ */
/* Helpers (cùng quy ước với LandingHero)                              */
/* ------------------------------------------------------------------ */

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

const BRAND_WORDS = ['Đông', 'Nam', 'Bộ', 'Di', 'Sản'];

const NAV_ITEMS = [
  { id: 'hero', label: 'Tổng quan' },
  { id: 'map-section', label: 'Bản đồ tương tác' },
  { id: 'provinces-section', label: 'Địa danh trọng điểm' },
  { id: 'gallery-section', label: 'Triển lãm văn hóa' },
];

export function TopNav({ onNavigate, onOpenCMS, activeSection }: TopNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`tn-root tn-drop fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 py-3 shadow-xl shadow-black/40'
          : 'bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-transparent py-5'
      }`}
    >
      <style>{CSS}</style>

      {/* Hairline vàng ở mép dưới, hiện ra khi cuộn trang */}
      <span
        aria-hidden="true"
        className={`absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <button
          onClick={() => onNavigate('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-amber-200 group-hover:text-amber-100 transition-colors whitespace-nowrap shrink-0">
            {BRAND_WORDS.map((w, i) => (
              <span key={i}>
                <span className="tn-mask">
                  <span className="tn-word" style={delay(150 + i * 80)}>
                    {w}
                  </span>
                </span>
                {i < BRAND_WORDS.length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
        </button>

        {/* Zone 2: Concise nav links with hover underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          {NAV_ITEMS.map((item, i) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={delay(450 + i * 90)}
                className={`tn-pop group whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors py-1 relative ${
                  isActive ? 'text-amber-300 font-semibold' : ''
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 origin-left transition-transform duration-300 ${
                    isActive
                      ? 'scale-x-100 shadow-[0_0_8px_rgba(251,191,36,0.7)]'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCMS}
            className="tn-pop tn-cms flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-200 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/70 hover:border-amber-400/50 rounded-lg transition-colors whitespace-nowrap shrink-0"
            style={delay(850)}
            title="Quản lý và cập nhật cơ sở dữ liệu di sản"
          >
            <Database className="tn-icon w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Quản lý CMS</span>
          </button>

          <div className="tn-pop" style={delay(950)}>
            <button
              onClick={() => onNavigate('map-section')}
              className="tn-cta group/cta relative overflow-hidden flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <span aria-hidden="true" className="tn-sheen absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-md" />
              <Compass className="tn-compass relative w-4 h-4 text-stone-950" />
              <span className="relative">Khám phá bản đồ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* CSS: trạng thái ẩn + animation nằm trong media query no-preference, */
/* nên người dùng bật "giảm chuyển động" vẫn thấy đủ nội dung.         */
/* Dùng fill-mode `backwards` để sau khi chạy xong phần tử trở về      */
/* style gốc, không đè lên các hiệu ứng hover của Tailwind.            */
/* ------------------------------------------------------------------ */

const CSS = `
.tn-root .tn-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding-top: 0.2em; margin-top: -0.2em;
  padding-bottom: 0.14em; margin-bottom: -0.14em;
}
.tn-root .tn-word { display: inline-block; transform-origin: 0 100%; }
.tn-root .tn-sheen { display: none; }

@media (prefers-reduced-motion: no-preference) {
  .tn-root .tn-sheen { display: block; }

  /* ---- Khi tải trang ---- */
  .tn-root.tn-drop { animation: tn-drop 0.9s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
  .tn-root .tn-word { animation: tn-word-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .tn-root .tn-pop  { animation: tn-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) backwards; }

  /* ---- Hiệu ứng lặp nhẹ / khi hover ---- */
  .tn-root .tn-cta   { animation: tn-ring 2.8s ease-out 3s infinite; }
  .tn-root .tn-sheen { transform: translateX(-120%) skewX(-20deg); animation: tn-sheen 4.5s ease-in-out 2.5s infinite; }
  .tn-root .tn-cta:hover .tn-compass { animation: tn-spin 0.9s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .tn-root .tn-cms:hover .tn-icon    { animation: tn-wiggle 0.6s ease-in-out; }
}

@keyframes tn-drop { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: none; } }
@keyframes tn-word-up { from { opacity: 0; transform: translateY(115%) rotate(5deg); } to { opacity: 1; transform: none; } }
@keyframes tn-pop { 0% { opacity: 0; transform: scale(0.8) translateY(-8px); } 100% { opacity: 1; transform: none; } }
@keyframes tn-sheen { 0%, 55% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(520%) skewX(-20deg); } }
@keyframes tn-ring { 0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); } 70%, 100% { box-shadow: 0 0 0 12px rgba(251, 191, 36, 0); } }
@keyframes tn-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes tn-wiggle { 0%, 100% { transform: rotate(0) scale(1); } 30% { transform: rotate(-12deg) scale(1.15); } 70% { transform: rotate(10deg) scale(1.15); } }
`;