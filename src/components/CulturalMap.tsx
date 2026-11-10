import { useState, useRef, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
  Check,
  Compass,
} from 'lucide-react';
import { CulturalPoint, ProvinceId, CulturalCategoryId } from '../types/cultural';
import { PROVINCES, CULTURAL_CATEGORIES } from '../data/culturalData';
import { CulturalPointPreview } from './CulturalPointPreview';

interface CulturalMapProps {
  points: CulturalPoint[];
  selectedProvince: ProvinceId | 'all';
  onSelectProvince: (provId: ProvinceId | 'all') => void;
  selectedCategory: CulturalCategoryId | 'all';
  onSelectCategory: (catId: CulturalCategoryId | 'all') => void;
  onExploreMore: (point: CulturalPoint) => void;
}

// Map ViewBoxes in SVG space (0 0 1000 700)
const REGION_VIEWBOXES: Record<ProvinceId | 'all', { x: number; y: number; w: number; h: number }> = {
  all: { x: 0, y: 0, w: 1000, h: 700 },
  hcm: { x: 120, y: 220, w: 380, h: 360 },
  'dong-nai': { x: 260, y: 40, w: 520, h: 480 },
  'ba-ria-vung-tau': { x: 500, y: 340, w: 420, h: 340 },
};

export function CulturalMap({
  points,
  selectedProvince,
  onSelectProvince,
  selectedCategory,
  onSelectCategory,
  onExploreMore,
}: CulturalMapProps) {
  const [activePoint, setActivePoint] = useState<CulturalPoint | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceId | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<CulturalPoint | null>(null);
  const [manualZoomLevel, setManualZoomLevel] = useState<number>(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Compute active viewBox
  const currentViewBox = useMemo(() => {
    const base = REGION_VIEWBOXES[selectedProvince];
    const zoomFactor = manualZoomLevel;
    const w = base.w / zoomFactor;
    const h = base.h / zoomFactor;
    const x = base.x + (base.w - w) / 2;
    const y = base.y + (base.h - h) / 2;
    return `${x} ${y} ${w} ${h}`;
  }, [selectedProvince, manualZoomLevel]);

  // Filtered points for map display
  const displayedPoints = useMemo(() => {
    return points.filter((p) => {
      const matchProv = selectedProvince === 'all' || p.provinceId === selectedProvince;
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchProv && matchCat;
    });
  }, [points, selectedProvince, selectedCategory]);

  const handleZoom = (delta: number) => {
    setManualZoomLevel((prev) => Math.min(2.5, Math.max(0.8, prev + delta)));
  };

  const handleReset = () => {
    onSelectProvince('all');
    setManualZoomLevel(1);
    setActivePoint(null);
  };

  const activeProvinceInfo = PROVINCES.find((p) => p.id === selectedProvince);

  // Map 0-100 percentage coordinates to the SVG coordinate space (1000 x 700)
  const getSvgCoordinates = (point: CulturalPoint) => {
    // Exact calibrated mapping coordinates to fit within the province geographical SVG boundaries
    let svgX = 500;
    let svgY = 350;

    if (point.provinceId === 'hcm') {
      // HCM area in SVG: x: 180 to 360, y: 280 to 520
      svgX = 180 + (point.coords.x / 100) * 180;
      svgY = 260 + (point.coords.y / 100) * 220;
    } else if (point.provinceId === 'dong-nai') {
      // Dong Nai area in SVG: x: 340 to 680, y: 80 to 420
      svgX = 300 + (point.coords.x / 100) * 380;
      svgY = 60 + (point.coords.y / 100) * 340;
    } else if (point.provinceId === 'ba-ria-vung-tau') {
      // Ba Ria Vung Tau area in SVG: x: 560 to 860, y: 400 to 620
      svgX = 540 + ((point.coords.x - 60) / 40) * 280;
      svgY = 380 + ((point.coords.y - 50) / 50) * 220;
    }

    return { x: svgX, y: svgY };
  };

  return (
    <div id="map-section" className="relative w-full bg-stone-950 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>BẢN ĐỒ TƯƠNG TÁC ĐỊA LÝ & DI SẢN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight">
              Bản Đồ Không Gian Văn Hóa Đông Nam Bộ
            </h2>
            <p className="text-stone-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Chọn tỉnh thành để phóng to chi tiết địa bàn hoặc nhấn vào các điểm đánh dấu phát sáng để khám phá câu chuyện, lịch sử và hình ảnh di sản.
            </p>
          </div>

          {/* Quick Province Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-stone-900/90 p-1.5 rounded-xl border border-stone-800/80">
            <button
              onClick={() => {
                onSelectProvince('all');
                setManualZoomLevel(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedProvince === 'all'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Toàn vùng Đông Nam Bộ
            </button>
            {PROVINCES.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectProvince(p.id);
                  setManualZoomLevel(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedProvince === p.id
                    ? 'bg-stone-800 text-stone-100 border border-stone-700 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar by Category */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <span className="text-xs text-stone-500 font-mono flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Phân loại:</span>
          </span>
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-medium'
                : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            Tất cả ({points.length})
          </button>
          {CULTURAL_CATEGORIES.map((cat) => {
            const count = points.filter(
              (p) =>
                (selectedProvince === 'all' || p.provinceId === selectedProvince) &&
                p.category === cat.id
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? `${cat.bgColor} border font-medium`
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.label}</span>
                <span className="text-[11px] opacity-70 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Map Canvas Container */}
        <div
          ref={mapContainerRef}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-stone-950 rounded-3xl border border-stone-800 shadow-2xl shadow-black overflow-hidden select-none group/canvas"
        >
          {/* Subtle Topographic & Compass Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

          {/* Interactive SVG Projection */}
          <svg
            viewBox={currentViewBox}
            className="w-full h-full transition-all duration-700 ease-in-out cursor-grab active:cursor-grabbing"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              {/* Radial Gradients for Provinces */}
              <linearGradient id="grad-hcm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.12" />
              </linearGradient>
              <linearGradient id="grad-dong-nai" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.12" />
              </linearGradient>
              <linearGradient id="grad-vung-tau" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.12" />
              </linearGradient>

              {/* Ocean Gradient */}
              <linearGradient id="grad-sea" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#082f49" stopOpacity="0.8" />
              </linearGradient>

              {/* Glow Filter for Markers */}
              <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sea Area: East Sea (Biển Đông) in the Southeast */}
            <path
              d="M 680 700 L 680 500 C 720 530 760 550 820 570 C 880 590 940 600 1000 620 L 1000 700 Z"
              fill="url(#grad-sea)"
              stroke="#0369a1"
              strokeWidth="0.8"
              strokeDasharray="4 4"
              opacity="0.7"
            />
            {/* Sea waves decorative paths */}
            <path
              d="M 720 620 Q 750 610 780 620 T 840 620 T 900 620"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.8"
              opacity="0.3"
            />
            <path
              d="M 750 650 Q 780 640 810 650 T 870 650 T 930 650"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.8"
              opacity="0.2"
            />
            <text
              x="830"
              y="660"
              fill="#38bdf8"
              opacity="0.6"
              fontSize="14"
              fontFamily="serif"
              fontStyle="italic"
              letterSpacing="3"
            >
              BIỂN ĐÔNG VIỆT NAM
            </text>

            {/* River Systems: Sông Đồng Nai, Sông Sài Gòn & Cửa biển */}
            {/* Sông Sài Gòn */}
            <path
              d="M 190 240 Q 220 280 230 330 T 260 410 T 290 470 T 340 520"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Sông Đồng Nai */}
            <path
              d="M 440 90 Q 430 160 410 210 T 360 290 T 320 380 T 340 450 T 370 510 T 420 560"
              fill="none"
              stroke="#0284c7"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* Sông Bé & Hồ Trị An water reservoir */}
            <ellipse
              cx="450"
              cy="230"
              rx="38"
              ry="22"
              fill="#0369a1"
              opacity="0.4"
            />
            <text
              x="450"
              y="234"
              fill="#7dd3fc"
              fontSize="9"
              textAnchor="middle"
              opacity="0.8"
              fontFamily="sans-serif"
            >
              Hồ Trị An
            </text>

            {/* Outer Neighboring Region Silhouettes for Geographic Realism */}
            <g opacity="0.15">
              {/* Tay Ninh (Northwest) */}
              <path
                d="M 60 210 L 150 170 L 220 230 L 170 300 L 90 280 Z"
                fill="#3f3f46"
                stroke="#71717a"
                strokeWidth="1"
              />
              <text x="130" y="240" fill="#a1a1aa" fontSize="12" fontFamily="sans-serif">
                Tây Ninh
              </text>

              {/* Binh Duong (North Central) */}
              <path
                d="M 180 220 L 260 160 L 320 180 L 300 280 L 220 270 Z"
                fill="#3f3f46"
                stroke="#71717a"
                strokeWidth="1"
              />
              <text x="240" y="215" fill="#a1a1aa" fontSize="12" fontFamily="sans-serif">
                Bình Dương
              </text>

              {/* Binh Phuoc (North) */}
              <path
                d="M 280 70 L 460 30 L 530 100 L 410 160 L 290 120 Z"
                fill="#3f3f46"
                stroke="#71717a"
                strokeWidth="1"
              />
              <text x="390" y="100" fill="#a1a1aa" fontSize="12" fontFamily="sans-serif">
                Bình Phước
              </text>

              {/* Long An (Southwest) */}
              <path
                d="M 70 340 L 160 360 L 180 470 L 100 520 L 50 420 Z"
                fill="#3f3f46"
                stroke="#71717a"
                strokeWidth="1"
              />
              <text x="110" y="440" fill="#a1a1aa" fontSize="12" fontFamily="sans-serif">
                Long An
              </text>
            </g>

            {/* ================= CORE PROVINCE: ĐỒNG NAI ================= */}
            <g
              onClick={() => {
                onSelectProvince(selectedProvince === 'dong-nai' ? 'all' : 'dong-nai');
                setManualZoomLevel(1);
              }}
              onMouseEnter={() => setHoveredProvince('dong-nai')}
              onMouseLeave={() => setHoveredProvince(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 290 160 C 340 100 420 70 510 90 C 590 110 680 140 700 210 C 720 280 660 340 620 380 C 570 420 500 430 450 435 C 390 440 340 410 320 380 C 300 350 280 300 270 240 C 265 190 280 170 290 160 Z"
                fill={
                  selectedProvince === 'dong-nai'
                    ? 'url(#grad-dong-nai)'
                    : hoveredProvince === 'dong-nai'
                    ? '#10b98130'
                    : '#10b98115'
                }
                stroke={selectedProvince === 'dong-nai' || hoveredProvince === 'dong-nai' ? '#10b981' : '#059669'}
                strokeWidth={selectedProvince === 'dong-nai' ? '3' : hoveredProvince === 'dong-nai' ? '2.2' : '1.2'}
                strokeDasharray={selectedProvince === 'dong-nai' ? 'none' : '6 3'}
                className="transition-all duration-300"
                style={{
                  filter:
                    selectedProvince === 'dong-nai' || hoveredProvince === 'dong-nai'
                      ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.45))'
                      : 'none',
                }}
              />
              {/* Province Label */}
              <text
                x="480"
                y="310"
                fill="#6ee7b7"
                fontSize={selectedProvince === 'dong-nai' ? '18' : '16'}
                fontWeight="bold"
                fontFamily="serif"
                textAnchor="middle"
                className="pointer-events-none select-none tracking-wider"
              >
                ĐỒNG NAI
              </text>
              <text
                x="480"
                y="330"
                fill="#a7f3d0"
                fontSize="11"
                textAnchor="middle"
                opacity="0.8"
                className="pointer-events-none select-none"
              >
                Cái nôi văn minh sông Trấn Biên
              </text>
            </g>

            {/* ================= CORE PROVINCE: TP. HỒ CHÍ MINH ================= */}
            <g
              onClick={() => {
                onSelectProvince(selectedProvince === 'hcm' ? 'all' : 'hcm');
                setManualZoomLevel(1);
              }}
              onMouseEnter={() => setHoveredProvince('hcm')}
              onMouseLeave={() => setHoveredProvince(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 180 260 C 210 240 250 250 270 270 C 290 290 280 330 300 370 C 320 400 350 440 340 480 C 330 520 300 560 260 565 C 220 570 190 530 180 480 C 160 440 145 390 150 340 C 155 300 170 270 180 260 Z"
                fill={
                  selectedProvince === 'hcm'
                    ? 'url(#grad-hcm)'
                    : hoveredProvince === 'hcm'
                    ? '#f59e0b35'
                    : '#f59e0b15'
                }
                stroke={selectedProvince === 'hcm' || hoveredProvince === 'hcm' ? '#f59e0b' : '#d97706'}
                strokeWidth={selectedProvince === 'hcm' ? '3' : hoveredProvince === 'hcm' ? '2.2' : '1.2'}
                strokeDasharray={selectedProvince === 'hcm' ? 'none' : '6 3'}
                className="transition-all duration-300"
                style={{
                  filter:
                    selectedProvince === 'hcm' || hoveredProvince === 'hcm'
                      ? 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.45))'
                      : 'none',
                }}
              />
              {/* Province Label */}
              <text
                x="240"
                y="410"
                fill="#fde68a"
                fontSize={selectedProvince === 'hcm' ? '18' : '15'}
                fontWeight="bold"
                fontFamily="serif"
                textAnchor="middle"
                className="pointer-events-none select-none tracking-wider"
              >
                TP. HỒ CHÍ MINH
              </text>
              <text
                x="240"
                y="430"
                fill="#fef08a"
                fontSize="11"
                textAnchor="middle"
                opacity="0.8"
                className="pointer-events-none select-none"
              >
                Giao lộ di sản sông Sài Gòn
              </text>
            </g>

            {/* ================= CORE PROVINCE: BÀ RỊA - VŨNG TÀU ================= */}
            <g
              onClick={() => {
                onSelectProvince(selectedProvince === 'ba-ria-vung-tau' ? 'all' : 'ba-ria-vung-tau');
                setManualZoomLevel(1);
              }}
              onMouseEnter={() => setHoveredProvince('ba-ria-vung-tau')}
              onMouseLeave={() => setHoveredProvince(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 520 420 C 570 395 640 400 700 425 C 760 450 820 480 840 520 C 850 560 800 600 740 615 C 680 625 630 600 590 570 C 560 545 540 500 525 460 C 515 440 515 430 520 420 Z"
                fill={
                  selectedProvince === 'ba-ria-vung-tau'
                    ? 'url(#grad-vung-tau)'
                    : hoveredProvince === 'ba-ria-vung-tau'
                    ? '#06b6d435'
                    : '#06b6d415'
                }
                stroke={
                  selectedProvince === 'ba-ria-vung-tau' || hoveredProvince === 'ba-ria-vung-tau'
                    ? '#06b6d4'
                    : '#0891b2'
                }
                strokeWidth={
                  selectedProvince === 'ba-ria-vung-tau' ? '3' : hoveredProvince === 'ba-ria-vung-tau' ? '2.2' : '1.2'
                }
                strokeDasharray={selectedProvince === 'ba-ria-vung-tau' ? 'none' : '6 3'}
                className="transition-all duration-300"
                style={{
                  filter:
                    selectedProvince === 'ba-ria-vung-tau' || hoveredProvince === 'ba-ria-vung-tau'
                      ? 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.45))'
                      : 'none',
                }}
              />
              {/* Vung Tau Peninsula jutting out */}
              <path
                d="M 580 565 C 575 580 560 610 550 635 C 540 655 530 650 525 640 C 520 625 540 590 560 570 Z"
                fill={
                  selectedProvince === 'ba-ria-vung-tau'
                    ? '#06b6d440'
                    : hoveredProvince === 'ba-ria-vung-tau'
                    ? '#06b6d430'
                    : '#06b6d420'
                }
                stroke="#06b6d4"
                strokeWidth="1.5"
              />
              {/* Province Label */}
              <text
                x="680"
                y="500"
                fill="#a5f3fc"
                fontSize={selectedProvince === 'ba-ria-vung-tau' ? '18' : '15'}
                fontWeight="bold"
                fontFamily="serif"
                textAnchor="middle"
                className="pointer-events-none select-none tracking-wider"
              >
                BÀ RỊA - VŨNG TÀU
              </text>
              <text
                x="680"
                y="520"
                fill="#cffafe"
                fontSize="11"
                textAnchor="middle"
                opacity="0.8"
                className="pointer-events-none select-none"
              >
                Xứ biển trầm tích & Nghinh Ông
              </text>
            </g>

            {/* ================= CULTURAL POINT MARKERS ================= */}
            {displayedPoints.map((point) => {
              const { x, y } = getSvgCoordinates(point);
              const isSelected = activePoint?.id === point.id;
              const isHovered = hoveredPoint?.id === point.id;
              const category = CULTURAL_CATEGORIES.find((c) => c.id === point.category);
              const markerColor = category?.color || '#f59e0b';

              return (
                <g
                  key={point.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePoint(point);
                  }}
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer group/marker"
                >
                  {/* Outer pulsating radar wave ring */}
                  <circle
                    r={isSelected || isHovered ? '24' : '16'}
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="1.2"
                    opacity={isSelected ? '0.9' : isHovered ? '0.7' : '0.35'}
                    className={point.isFeatured ? 'animate-ping' : ''}
                    style={{ animationDuration: '3s' }}
                  />

                  {/* Secondary soft aura */}
                  <circle
                    r={isSelected || isHovered ? '16' : '10'}
                    fill={markerColor}
                    opacity={isSelected ? '0.4' : '0.2'}
                  />

                  {/* Core marker disc */}
                  <circle
                    r={isSelected ? '10' : isHovered ? '9' : '7.5'}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{
                      filter: `drop-shadow(0 0 6px ${markerColor})`,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />

                  {/* Inner dot */}
                  <circle
                    r="2.5"
                    fill="#0c0a09"
                  />

                  {/* Hover Tag label */}
                  {(isHovered || isSelected) && (
                    <g transform="translate(0, -22)" className="pointer-events-none">
                      <rect
                        x="-70"
                        y="-16"
                        width="140"
                        height="22"
                        rx="6"
                        fill="#0c0a09"
                        stroke={markerColor}
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="-1"
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {point.name.length > 20 ? point.name.slice(0, 18) + '...' : point.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Map Controls: Floating Action Bar */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <button
              onClick={() => handleZoom(0.25)}
              aria-label="Phóng to bản đồ"
              title="Phóng to bản đồ"
              className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.25)}
              aria-label="Thu nhỏ bản đồ"
              title="Thu nhỏ bản đồ"
              className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              aria-label="Đặt lại toàn cảnh vùng"
              title="Đặt lại góc nhìn toàn cảnh Đông Nam Bộ"
              className="p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Active Province Status Badge (Top-Left) */}
          <div className="absolute top-4 left-4 z-20 max-w-sm">
            {activeProvinceInfo ? (
              <div className="bg-stone-950/90 backdrop-blur-md border border-stone-800 p-3.5 rounded-2xl shadow-xl flex items-start gap-3">
                <div
                  className="w-3 h-3 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: activeProvinceInfo.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                      Đang xem chi tiết
                    </span>
                    <span aria-hidden="true" className="text-stone-600">·</span>
                    <button
                      onClick={handleReset}
                      className="text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      Quay lại toàn vùng
                    </button>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-100">
                    {activeProvinceInfo.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                    {activeProvinceInfo.tagline}
                  </p>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 bg-stone-950/80 backdrop-blur-md border border-stone-800/80 px-3 py-1.5 rounded-xl text-xs text-stone-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Toàn cảnh Đông Nam Bộ · Nhấp vào một tỉnh để phóng to</span>
              </div>
            )}
          </div>

          {/* Bottom Left Legend */}
          <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-4 bg-stone-950/85 backdrop-blur-md border border-stone-800/80 px-3.5 py-2 rounded-xl text-[11px] text-stone-400">
            <span className="font-mono text-stone-500">Ký hiệu:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>TP.HCM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Đồng Nai</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Bà Rịa - Vũng Tàu</span>
            </div>
            <span className="text-stone-600">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-stone-300" />
              <span>Điểm văn hóa</span>
            </div>
          </div>

          {/* Cultural Point Preview Popup */}
          {activePoint && (
            <CulturalPointPreview
              point={activePoint}
              onClose={() => setActivePoint(null)}
              onExploreMore={(p) => {
                onExploreMore(p);
                setActivePoint(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
