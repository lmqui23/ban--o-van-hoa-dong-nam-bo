import { X, ArrowRight, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { CulturalPoint } from '../types/cultural';
import { CULTURAL_CATEGORIES } from '../data/culturalData';

interface CulturalPointPreviewProps {
  point: CulturalPoint;
  onClose: () => void;
  onExploreMore: (point: CulturalPoint) => void;
}

export function CulturalPointPreview({ point, onClose, onExploreMore }: CulturalPointPreviewProps) {
  const categoryInfo = CULTURAL_CATEGORIES.find((c) => c.id === point.category);

  return (
    <div className="absolute z-30 bottom-6 right-6 left-6 sm:left-auto sm:w-96 bg-stone-950/95 backdrop-blur-xl border border-stone-800 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Banner Image */}
      <div className="relative h-36 w-full overflow-hidden">
        <img
          src={point.coverImage}
          alt={point.name}
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng bảng xem trước"
          className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Category Badge & Era */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px]">
          <span
            className="px-2.5 py-0.5 rounded-full font-medium border text-xs"
            style={{
              backgroundColor: `${categoryInfo?.color || '#f59e0b'}22`,
              color: categoryInfo?.color || '#f59e0b',
              borderColor: `${categoryInfo?.color || '#f59e0b'}44`,
            }}
          >
            {categoryInfo?.label || 'Di sản văn hóa'}
          </span>
          {point.era && (
            <span className="text-stone-300 font-mono text-[11px] bg-stone-900/80 px-2 py-0.5 rounded border border-white/5 truncate max-w-[160px]">
              {point.era}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-100 leading-snug">
          {point.name}
        </h3>

        <div className="flex items-start gap-1.5 text-xs text-stone-400 mt-2">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{point.address}</span>
        </div>

        <p className="text-xs text-stone-300 mt-2.5 line-clamp-2 leading-relaxed">
          {point.shortIntro}
        </p>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
          >
            Thu nhỏ
          </button>
          <button
            onClick={() => onExploreMore(point)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-950/40 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Khám phá chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-950" />
          </button>
        </div>
      </div>
    </div>
  );
}
