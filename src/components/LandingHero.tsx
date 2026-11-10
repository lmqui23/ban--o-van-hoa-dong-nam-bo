import { ArrowDown, Compass, MapPin, Sparkles, Landmark, Award } from 'lucide-react';
import { PROVINCES } from '../data/culturalData';
import { ProvinceId } from '../types/cultural';

interface LandingHeroProps {
  onExploreMap: (provinceId?: ProvinceId) => void;
  totalPointsCount: number;
}

export function LandingHero({ onExploreMap, totalPointsCount }: LandingHeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* Background Image with Curatorial Scrim */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg"
          alt="Cảnh sắc thiên nhiên và sông nước Đông Nam Bộ"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Multilayer gradient scrim: dark rich museum lacquer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/45" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-stone-950/40 to-stone-950/90" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="max-w-3xl">
          {/* Curatorial Header Decker */}
          <div className="flex items-center gap-3 text-xs tracking-widest uppercase font-mono text-amber-400 mb-4">
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              TRIỂN LÃM DI SẢN KỸ THUẬT SỐ
            </span>
            <span aria-hidden="true">·</span>
            <span>ĐÔNG NAM BỘ VIỆT NAM</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-400">PHƯƠNG NAM VĂN HIẾN</span>
          </div>

          {/* Editorial Display Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-100 tracking-tight leading-[1.15] mb-6 text-balance">
            Khám Phá Di Sản & Bản Sắc Văn Hóa <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">Đông Nam Bộ</span>
          </h1>

          {/* Lead Prose */}
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-light mb-8 max-w-2xl">
            Vùng đất trầm tích lịch sử bên những dòng sông lớn — nơi giao thoa giữa hào khí khẩn hoang, tinh hoa làng nghề gốm sứ trăm năm, văn hóa biển đảo thiêng liêng và nhịp sống đô thị di sản phồn vinh.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button
              onClick={() => onExploreMap()}
              className="px-6 py-3.5 rounded-xl font-medium text-sm text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-950/60 transition-all flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Compass className="w-4 h-4 text-stone-950" />
              <span className="font-semibold">Khám phá bản đồ trực quan</span>
            </button>

            <a
              href="#provinces-section"
              className="px-5 py-3.5 rounded-xl font-medium text-sm text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 transition-all flex items-center gap-2 hover:border-amber-400/50"
            >
              <span>Xem 3 tỉnh thành trọng điểm</span>
              <ArrowDown className="w-4 h-4 text-stone-400" />
            </a>
          </div>

          {/* Unboxed Metadata Stats Row */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-6 border-t border-stone-800/80 text-xs sm:text-sm text-stone-400">
            <div>
              <div className="text-2xl font-serif font-bold text-amber-300 font-mono tabular-nums">
                03
              </div>
              <div className="text-stone-400 text-xs mt-0.5">Tỉnh thành hạt nhân</div>
            </div>
            <div className="w-px h-8 bg-stone-800" />
            <div>
              <div className="text-2xl font-serif font-bold text-amber-300 font-mono tabular-nums">
                {totalPointsCount}+
              </div>
              <div className="text-stone-400 text-xs mt-0.5">Điểm di sản văn hóa</div>
            </div>
            <div className="w-px h-8 bg-stone-800" />
            <div>
              <div className="text-2xl font-serif font-bold text-amber-300 font-mono tabular-nums">
                06
              </div>
              <div className="text-stone-400 text-xs mt-0.5">Trụ cột loại hình di sản</div>
            </div>
            <div className="w-px h-8 bg-stone-800" />
            <div>
              <div className="text-2xl font-serif font-bold text-amber-300 font-mono tabular-nums">
                300+
              </div>
              <div className="text-stone-400 text-xs mt-0.5">Năm văn hiến phương Nam</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Provinces Strip at Bottom of Hero */}
      <div id="provinces-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROVINCES.map((prov) => (
            <div
              key={prov.id}
              onClick={() => onExploreMap(prov.id)}
              className="group relative rounded-2xl overflow-hidden border border-stone-800/80 bg-stone-900/60 hover:border-amber-400/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-amber-950/30 hover:-translate-y-1"
            >
              <div className="h-40 sm:h-44 w-full overflow-hidden relative">
                <img
                  src={prov.heroImage}
                  alt={prov.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium backdrop-blur-md border border-white/10"
                  style={{ backgroundColor: `${prov.color}33`, color: prov.accentColor }}
                >
                  {prov.shortName}
                </div>
              </div>

              <div className="p-4 bg-stone-950/80 backdrop-blur-sm">
                <h3 className="text-lg font-serif font-semibold text-stone-100 group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>{prov.name}</span>
                  <MapPin className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
                </h3>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {prov.tagline}
                </p>
                <div className="mt-3 pt-3 border-t border-stone-800/60 flex items-center justify-between text-xs text-stone-400">
                  <span>Khám phá các điểm di tích</span>
                  <span className="text-amber-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Xem bản đồ &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
