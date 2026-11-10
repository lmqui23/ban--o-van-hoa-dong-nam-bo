import { useState } from 'react';
import {
  MapPin,
  Sparkles,
  ArrowRight,
  Play,
  Film,
  Calendar,
  Layers,
  Heart,
} from 'lucide-react';
import { CulturalPoint, CulturalCategoryId, ProvinceId } from '../types/cultural';
import { CULTURAL_CATEGORIES, PROVINCES } from '../data/culturalData';

interface CulturalGallerySectionProps {
  points: CulturalPoint[];
  onSelectPoint: (point: CulturalPoint) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

export function CulturalGallerySection({
  points,
  onSelectPoint,
  bookmarks,
  onToggleBookmark,
}: CulturalGallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<CulturalCategoryId | 'all'>('all');
  const [activeProvince, setActiveProvince] = useState<ProvinceId | 'all'>('all');

  const filteredPoints = points.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchProv = activeProvince === 'all' || p.provinceId === activeProvince;
    return matchCat && matchProv;
  });

  return (
    <section id="gallery-section" className="py-20 bg-stone-900/60 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>TRIỂN LÃM DI SẢN & KỂ CHUYỆN SỐ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight">
              Kho Tàng Văn Hóa & Không Gian Trải Nghiệm
            </h2>
            <p className="text-stone-400 text-sm mt-2 max-w-2xl leading-relaxed">
              Mỗi địa điểm là một chứng tích sống động về lịch sử, bàn tay tài hoa của nghệ nhân và đời sống tâm linh phóng khoáng của con người Đông Nam Bộ.
            </p>
          </div>

          {/* Province Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-stone-950/80 p-1.5 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveProvince('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeProvince === 'all'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Tất cả tỉnh ({points.length})
            </button>
            {PROVINCES.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProvince(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeProvince === p.id
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {p.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 ${
              activeCategory === 'all'
                ? 'bg-stone-100 text-stone-900 font-semibold'
                : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 border border-stone-700/60'
            }`}
          >
            Tất cả chủ đề
          </button>
          {CULTURAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 border border-stone-700/60'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoints.map((point) => {
            const prov = PROVINCES.find((pr) => pr.id === point.provinceId);
            const cat = CULTURAL_CATEGORIES.find((c) => c.id === point.category);
            const isBookmarked = bookmarks.includes(point.id);

            return (
              <div
                key={point.id}
                onClick={() => onSelectPoint(point)}
                className="group flex flex-col rounded-2xl overflow-hidden border border-stone-800 bg-stone-950/70 hover:border-amber-400/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1.5"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={point.coverImage}
                    alt={point.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

                  {/* Category Chip & Video tag */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium backdrop-blur-md border"
                      style={{
                        backgroundColor: `${cat?.color || '#f59e0b'}33`,
                        color: cat?.color || '#f59e0b',
                        borderColor: `${cat?.color || '#f59e0b'}44`,
                      }}
                    >
                      {cat?.shortLabel || 'Di sản'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(point.id);
                      }}
                      className="p-1.5 rounded-full bg-stone-950/70 backdrop-blur-md text-stone-300 hover:text-amber-400 transition-colors"
                      title={isBookmarked ? 'Bỏ lưu' : 'Lưu lại'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isBookmarked ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Province watermark */}
                  <div className="absolute bottom-3 left-3 text-xs font-mono text-stone-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{prov?.name}</span>
                  </div>

                  {point.videoUrl && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md text-[11px] text-amber-300 border border-amber-400/30 font-mono">
                      <Film className="w-3 h-3 text-amber-400" />
                      <span>Video</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-stone-100 group-hover:text-amber-300 transition-colors leading-snug">
                      {point.name}
                    </h3>
                    {point.era && (
                      <div className="text-[11px] font-mono text-amber-400/80 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{point.era}</span>
                      </div>
                    )}
                    <p className="text-xs text-stone-400 mt-2.5 line-clamp-3 leading-relaxed">
                      {point.shortIntro}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                    <span className="line-clamp-1 max-w-[170px]">{point.address}</span>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>Chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
