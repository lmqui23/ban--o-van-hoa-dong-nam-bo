import { Compass, Sparkles, MapPin, Heart } from 'lucide-react';
import { PROVINCES } from '../data/culturalData';
import { ProvinceId } from '../types/cultural';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectProvince: (provId: ProvinceId) => void;
}

export function Footer({ onNavigate, onSelectProvince }: FooterProps) {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="text-xl font-serif font-bold text-amber-200">
                Bản Đồ Văn Hóa Đông Nam Bộ
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              Dự án bản đồ tương tác kết hợp nghệ thuật thị giác và kể chuyện số (Visual Storytelling & Digital Exhibition), tôn vinh các di tích lịch sử, làng nghề truyền thống, tín ngưỡng dân gian và nét đẹp ẩm thực của miền Đông gian lao mà anh dũng.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
              <span>Phương Nam văn hiến</span>
              <span aria-hidden="true">·</span>
              <span>Đất đỏ miền Đông</span>
              <span aria-hidden="true">·</span>
              <span>Di sản ngàn năm</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-200">
              Điều Hướng Nhanh
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('hero')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Màn hình mở đầu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map-section')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Bản đồ không gian tương tác
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery-section')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Triển lãm di sản văn hóa
                </button>
              </li>
            </ul>
          </div>

          {/* Core Provinces */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-200">
              Trọng Điểm Khảo Sát
            </h4>
            <ul className="space-y-2 text-xs">
              {PROVINCES.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => {
                      onSelectProvince(p.id);
                      onNavigate('map-section');
                    }}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span>{p.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quiet Copyright & Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Bản Đồ Văn Hóa Đông Nam Bộ. Triển lãm số di sản Việt Nam.</p>
          <div className="flex items-center gap-1">
            <span>Dành trọn tình yêu với văn hóa & con người phương Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
