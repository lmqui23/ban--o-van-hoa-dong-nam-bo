import { useState, useRef, useMemo, useEffect, useCallback, memo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Filter,
  Move,
} from 'lucide-react';
import { CulturalPoint, ProvinceId, CulturalCategoryId } from '../types/cultural';
import { PROVINCES, CULTURAL_CATEGORIES } from '../data/culturalData';
import { CulturalPointPreview } from './CulturalPointPreview';
import { RevealTitle, SECTION_FX_CSS, delay, useInViewOnce } from './sectionFx';


type GeoPosition = [number, number, ...number[]];
type GeoGeometry =
  | { type: 'Polygon'; coordinates: GeoPosition[][] }
  | { type: 'MultiPolygon'; coordinates: GeoPosition[][][] };
type ProvinceFeature = {
  type: 'Feature';
  properties?: Record<string, unknown>;
  geometry: GeoGeometry;
};
type ProvinceFeatureCollection = { type: 'FeatureCollection'; features: ProvinceFeature[] };

type GeoJSONLike = ProvinceFeatureCollection | ProvinceFeature | { features?: unknown[] } | unknown[];

type Bounds = { minX: number; minY: number; maxX: number; maxY: number };
type Camera = { x: number; y: number; w: number; h: number };
type ProvinceShape = { key: string; d: string; id: ProvinceId | null; bounds: Bounds };

const isPolygonFeature = (value: unknown): value is ProvinceFeature => {
  if (!value || typeof value !== 'object') return false;
  const feature = value as any;
  return feature.type === 'Feature' && !!feature.geometry &&
    (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') &&
    Array.isArray(feature.geometry.coordinates);
};

const extractProvinceFeatures = (data: GeoJSONLike): ProvinceFeature[] => {
  const candidates = Array.isArray(data) ? data :
    data && typeof data === 'object' && 'features' in data && Array.isArray((data as any).features)
      ? (data as any).features
      : data && typeof data === 'object' && (data as any).type === 'Feature' ? [data] : [];
  return candidates.filter(isPolygonFeature);
};

// GeoJSON WGS84 -> SVG. Tọa độ được giữ theo cùng một phép chiếu để hình thể
// Việt Nam không bị bóp méo bởi các path SVG vẽ tay.
const projectVietnam = ([lon, lat]: GeoPosition) => ({
  x: 45 + (lon - 102) * 78,
  y: 34 + (23.6 - lat) * 46,
});

const getGeometryBounds = (geometry: GeoGeometry): Bounds => {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const polygon of polygons) for (const ring of polygon) for (const position of ring) {
    const point = projectVietnam(position);
    minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
  }
  return { minX, minY, maxX, maxY };
};

// Bỏ các điểm nằm quá sát nhau (< ~0.05 đơn vị SVG, tức dưới 1px ở mức zoom thường dùng).
// Path nhẹ hơn nhiều => pan/zoom và hover mượt hơn mà hình dạng gần như không đổi.
const MIN_POINT_STEP = 0.05;

const geometryToPath = (geometry: GeoGeometry) => {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  let d = '';
  for (const polygon of polygons) {
    for (const ring of polygon) {
      if (ring.length < 3) continue;
      let last = projectVietnam(ring[0]);
      d += `M${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
      for (let i = 1; i < ring.length; i++) {
        const p = projectVietnam(ring[i]);
        const isLast = i === ring.length - 1;
        if (!isLast && Math.abs(p.x - last.x) + Math.abs(p.y - last.y) < MIN_POINT_STEP) continue;
        d += `L${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
        last = p;
      }
      d += 'Z';
    }
  }
  return d;
};

const normalizeVietnamese = (value: unknown) => String(value ?? '')
  // NFD không tự chuyển Đ/đ thành D/d, nên phải xử lý riêng để nhận diện
  // đúng các địa danh như 'Đồng Nai' trong thuộc tính GeoJSON.
  .replace(/[Đđ]/g, 'd')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[_-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const getFeatureProvinceId = (feature: ProvinceFeature): ProvinceId | null => {
  const props = feature.properties || {};
  // Dataset GIS có thể đặt tên thuộc tính khác nhau (name, NAME_1, ten_tinh...).
  const values = Object.values(props).filter((value) => typeof value === 'string').map(normalizeVietnamese);
  const name = values.join(' | ');
  if (name.includes('tay ninh')) return 'tay-ninh';
  if (name.includes('ho chi minh') || name.includes('thanh pho ho chi minh') || name.includes('ho_chi_minh')) return 'hcm';
  if (name.includes('dong nai') || name.includes('dongnai')) return 'dong-nai';
  return null;
};

interface CulturalMapProps {
  points: CulturalPoint[];
  selectedProvince: ProvinceId | 'all';
  onSelectProvince: (provId: ProvinceId | 'all') => void;
  selectedCategory: CulturalCategoryId | 'all';
  onSelectCategory: (catId: CulturalCategoryId | 'all') => void;
  onExploreMore: (point: CulturalPoint) => void;
}

const TARGET_IDS: ProvinceId[] = ['tay-ninh', 'hcm', 'dong-nai'];

// Bảng màu tập trung một chỗ: dùng chung cho bản đồ, nhãn, legend và badge.
const PROVINCE_STYLE: Record<ProvinceId, {
  color: string; label: string; trans: string; active: string; short: string;
}> = {
  'tay-ninh': { color: '#fb7185', label: '#fda4af', trans: 'url(#trans-pink)', active: 'url(#active-pink)', short: 'TÂY NINH' },
  hcm: { color: '#facc15', label: '#fde68a', trans: 'url(#trans-yellow)', active: 'url(#active-yellow)', short: 'TP. HỒ CHÍ MINH' },
  'dong-nai': { color: '#60a5fa', label: '#bfdbfe', trans: 'url(#trans-blue)', active: 'url(#active-blue)', short: 'ĐỒNG NAI' },
};

// ViewBox được tính động theo bounds thật của GeoJSON. Đây chỉ là giá trị dự phòng
// cho tới khi dữ liệu địa giới tải xong.
const FALLBACK_VIEWBOX: Record<ProvinceId | 'all', Camera> = {
  all: { x: 260, y: 430, w: 430, h: 242 },
  'tay-ninh': { x: 280, y: 480, w: 300, h: 169 },
  hcm: { x: 300, y: 480, w: 300, h: 169 },
  'dong-nai': { x: 330, y: 430, w: 300, h: 169 },
};

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 6;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// Chuyển động ngắn (zoom nút/cuộn) dùng easeOut: phản hồi ngay rồi lướt êm vào đích,
// không bị "ì" ở đầu như easeInOut khi các sự kiện cuộn liên tiếp khởi động lại animation.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const fitBoundsToViewBox = (bounds: Bounds, aspect = 16 / 9, padding = 1.22): Camera => {
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const boundsW = Math.max(1, bounds.maxX - bounds.minX);
  const boundsH = Math.max(1, bounds.maxY - bounds.minY);
  const w = Math.max(boundsW * padding, boundsH * padding * aspect);
  const h = w / aspect;
  return { x: centerX - w / 2, y: centerY - h / 2, w, h };
};

// Giữ tâm camera trong phạm vi lãnh thổ để người dùng không kéo bản đồ ra khỏi màn hình.
const clampCamera = (c: Camera, world: Bounds | null): Camera => {
  if (!world) return c;
  const cx = clamp(c.x + c.w / 2, world.minX, world.maxX);
  const cy = clamp(c.y + c.h / 2, world.minY, world.maxY);
  return { ...c, x: cx - c.w / 2, y: cy - c.h / 2 };
};

// Hiệu ứng riêng của khung bản đồ, chỉ chạy một lần khi người dùng lần đầu cuộn tới
// (cùng thời điểm camera bắt đầu bay vào Đông Nam Bộ).
// LƯU Ý: tuyệt đối không che/ẩn khung bản đồ bằng clip-path hay lớp phủ đục. Bản đồ phải
// luôn hiện thật; các hiệu ứng dưới đây chỉ là lớp trang trí đè lên trên.
const MAP_FX_CSS = `
/* Vệt sáng mềm quét ngang mặt kính: nhiều điểm dừng màu + blur nên không có mép cứng */
.cm-sheen {
  position: absolute; top: -25%; bottom: -25%; left: -45%; width: 45%;
  opacity: 0; pointer-events: none; filter: blur(10px); will-change: transform, opacity;
  background: linear-gradient(100deg,
    rgba(251,191,36,0) 0%, rgba(251,191,36,.04) 22%, rgba(253,224,130,.10) 40%,
    rgba(255,243,199,.18) 50%, rgba(253,224,130,.10) 60%, rgba(251,191,36,.04) 78%, rgba(251,191,36,0) 100%);
}

/* Sóng lan vẽ bằng SVG tại tâm từng tỉnh (nét luôn sắc, không bị răng cưa như gradient) */
.cm-wave { transform-box: fill-box; transform-origin: center; opacity: 0; }

@media (prefers-reduced-motion: no-preference) {
  .cm-frame.cm-in { animation: cm-border 2.8s ease-out backwards; }
  .cm-frame.cm-in .cm-sheen { animation: cm-sheen 2.6s cubic-bezier(.4,0,.2,1) .3s both; }
  .cm-frame.cm-in .cm-wave { animation: cm-wave 3s cubic-bezier(.16,.6,.3,1) var(--d, 0ms) both; }
}
@keyframes cm-border { from { border-color: rgba(251,191,36,.85); } }
@keyframes cm-sheen {
  0% { opacity: 0; transform: translateX(0) skewX(-16deg); }
  18%, 82% { opacity: 1; }
  100% { opacity: 0; transform: translateX(430%) skewX(-16deg); }
}
@keyframes cm-wave {
  0% { opacity: 0; transform: scale(.1); }
  16% { opacity: 1; }
  100% { opacity: 0; transform: scale(1); }
}
`;

const MAP_CSS = `
@keyframes cm-ring { 0% { transform: scale(1); opacity: .7 } 100% { transform: scale(2.8); opacity: 0 } }
@keyframes cm-pop { 0% { transform: scale(0); opacity: 0 } 60% { transform: scale(1.25); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
@keyframes cm-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes cm-label { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
@keyframes cm-slide { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }
.cm-ring { animation: cm-ring 2.6s ease-out infinite; }
.cm-pop { animation: cm-pop 620ms cubic-bezier(.34,1.56,.64,1) both; }
.cm-fade { animation: cm-fade 900ms ease-out both; }
.cm-label { animation: cm-label 220ms ease-out both; }
.cm-slide { animation: cm-slide 300ms ease-out both; }

/* Vệt sáng chạy dọc viền tỉnh đang chọn (nét đứt trôi liên tục, độ dài tính theo pixel màn hình) */
@keyframes cm-march { to { stroke-dashoffset: -32; } }
.cm-march { stroke-dasharray: 7 9; animation: cm-march 1.8s linear infinite; }

/* Quầng sáng biển trôi chậm phía sau bản đồ */
@keyframes cm-drift {
  from { transform: translate3d(-5%, -2%, 0) scale(1); }
  to { transform: translate3d(5%, 3%, 0) scale(1.08); }
}
.cm-drift-a, .cm-drift-b { position: absolute; inset: -20%; pointer-events: none; will-change: transform; }
.cm-drift-a {
  background:
    radial-gradient(38% 32% at 28% 38%, rgba(56,189,248,.075), transparent 70%),
    radial-gradient(30% 26% at 78% 70%, rgba(45,212,191,.055), transparent 70%);
  animation: cm-drift 28s ease-in-out infinite alternate;
}
.cm-drift-b {
  background: radial-gradient(34% 28% at 65% 25%, rgba(125,211,252,.055), transparent 70%);
  animation: cm-drift 36s ease-in-out -12s infinite alternate-reverse;
}

/* Đèn rọi vàng theo con trỏ, mờ dần khi chuột rời khung */
.cm-spot {
  background: radial-gradient(360px circle at var(--sx, 50%) var(--sy, 50%), rgba(251,191,36,.10), transparent 65%);
  mix-blend-mode: screen;
  opacity: var(--so, 0);
  transition: opacity 600ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .cm-ring, .cm-pop, .cm-fade, .cm-label, .cm-slide, .cm-drift-a, .cm-drift-b { animation: none !important; }
  .cm-march { animation: none !important; stroke-dasharray: none; }
  .cm-spot { display: none; }
  .cm-motion, .cm-motion * { transition: none !important; }
}
`;

/* ------------------------------------------------------------------ */
/* Các layer được memo: chỉ vẽ lại khi dữ liệu/trạng thái hover/chọn đổi */
/* ------------------------------------------------------------------ */

// Phần đất liền còn lại của Việt Nam (không thuộc 3 tỉnh trọng tâm). Hoàn toàn tĩnh.
const BaseLayer = memo(function BaseLayer({ shapes }: { shapes: ProvinceShape[] }) {
  return (
    <g pointerEvents="none">
      {shapes.map((s) => (
        <g key={s.key}>
          {/* Viền sáng mờ rộng giả lập hào quang bờ biển, không cần SVG filter */}
          <path d={s.d} fill="none" stroke="#a5e8ff" strokeOpacity="0.07" strokeWidth="5"
            strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d={s.d} fill="url(#land-glass)" fillOpacity="0.9" stroke="#9db8c7" strokeOpacity="0.4"
            strokeWidth="0.75" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </g>
  );
});

interface FocusLayerProps {
  shapes: ProvinceShape[];
  selected: ProvinceId | 'all';
  hovered: ProvinceId | null;
  onHover: (id: ProvinceId | null) => void;
  onSelect: (id: ProvinceId) => void;
}

// Ba tỉnh trọng tâm. Hiệu ứng nâng/hào quang chạy bằng CSS transition (mượt, chạy trên compositor)
// thay vì đổi attribute SVG. Vùng bắt chuột là path trong suốt đứng yên nên không bị nhấp nháy
// khi tỉnh nhô lên.
const FocusLayer = memo(function FocusLayer({ shapes, selected, hovered, onHover, onSelect }: FocusLayerProps) {
  const ease = 'cubic-bezier(.22,1,.36,1)';
  return (
    <g className="cm-motion">
      <g pointerEvents="none">
        {shapes.map((s) => {
          const id = s.id as ProvinceId;
          const st = PROVINCE_STYLE[id];
          const isActive = selected === id;
          const isHovered = hovered === id;
          const raised = isActive || isHovered;
          const dim = selected !== 'all' && !isActive;
          return (
            <g key={s.key} style={{ opacity: dim ? 0.5 : 1, transition: 'opacity 500ms ease' }}>
              <g style={{
                transform: raised ? 'translateY(calc(var(--cm-lift) * -1))' : 'translateY(0px)',
                transition: `transform 450ms ${ease}`,
              }}>
                {/* bóng đổ */}
                <path d={s.d} fill="#020617" style={{
                  opacity: isActive ? 0.4 : isHovered ? 0.26 : 0,
                  transform: 'translateY(calc(var(--cm-lift) * 1.7))',
                  transition: 'opacity 450ms ease',
                }} />
                {/* nền kính */}
                <path d={s.d} fill={st.trans} />
                {/* lớp màu đậm khi chọn/hover: cross-fade thay vì đổi gradient đột ngột */}
                <path d={s.d} fill={st.active} style={{
                  opacity: isActive ? 1 : isHovered ? 0.55 : 0,
                  transition: 'opacity 450ms ease',
                }} />
                {/* hào quang */}
                <path d={s.d} fill="none" stroke={st.color} strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{
                  strokeWidth: isActive ? 9 : 7,
                  strokeOpacity: isActive ? 0.22 : isHovered ? 0.16 : 0,
                  transition: 'stroke-opacity 450ms ease, stroke-width 450ms ease',
                }} />
                {/* viền chính */}
                <path d={s.d} fill="none" stroke={st.color} strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{
                  strokeWidth: isActive ? 2.6 : isHovered ? 2.1 : 1.5,
                  strokeOpacity: isActive ? 1 : isHovered ? 0.95 : 0.78,
                  transition: 'stroke-width 350ms ease, stroke-opacity 350ms ease',
                }} />
                {/* viền sáng bên trong khi được chọn */}
                <path d={s.d} fill="none" stroke="#fff" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{
                  strokeWidth: 0.75,
                  strokeOpacity: isActive ? 0.6 : 0,
                  transition: 'stroke-opacity 450ms ease',
                }} />
                {/* vệt sáng chạy dọc đường viền khi tỉnh được chọn */}
                <path d={s.d} fill="none" stroke={st.label} strokeLinejoin="round" strokeLinecap="round"
                  vectorEffect="non-scaling-stroke" className="cm-march" style={{
                    strokeWidth: 1.4,
                    strokeOpacity: isActive ? 0.85 : 0,
                    transition: 'stroke-opacity 450ms ease',
                  }} />
              </g>
            </g>
          );
        })}
      </g>
      <g>
        {shapes.map((s) => (
          <path key={`hit-${s.key}`} d={s.d} fill="transparent" stroke="none" className="cursor-pointer"
            onClick={() => onSelect(s.id as ProvinceId)}
            onMouseEnter={() => onHover(s.id)}
            onMouseLeave={() => onHover(null)} />
        ))}
      </g>
    </g>
  );
});

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
  const [zoom, setZoom] = useState(1);
  const [provinceFeatures, setProvinceFeatures] = useState<ProvinceFeature[]>([]);
  const [mapDataError, setMapDataError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [inView, setInView] = useState(false);
  const [size, setSize] = useState({ w: 1100, h: 620 });
  const [secRef, secInView] = useInViewOnce<HTMLDivElement>(0.12);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Thẻ bọc ngoài khung bản đồ: IntersectionObserver phải theo dõi phần tử KHÔNG bị clip-path,
  // vì phần tử đang bị clip-path circle(0%) sẽ không bao giờ được tính là "đã vào màn hình".
  const frameWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Camera: state để React vẽ lại, ref để các handler/animation đọc giá trị mới nhất.
  const [camera, setCamera] = useState<Camera>(FALLBACK_VIEWBOX.all);
  const cameraRef = useRef<Camera>(FALLBACK_VIEWBOX.all);   // camera đang hiển thị
  const targetRef = useRef<Camera>(FALLBACK_VIEWBOX.all);   // camera đích
  const baseRef = useRef<Camera>(FALLBACK_VIEWBOX.all);     // khung nhìn gốc của lựa chọn hiện tại
  const worldRef = useRef<Bounds | null>(null);
  const zoomRef = useRef(1);
  const animRef = useRef(0);
  const introStartedRef = useRef(false);
  const markersReadyRef = useRef(false); // false = marker đang chờ camera bay xong mới nảy lên
  const suppressClickRef = useRef(false);
  const inertiaRef = useRef(false); // true = camera đang trượt theo quán tính sau khi thả tay

  const selectedProvinceRef = useRef(selectedProvince);
  selectedProvinceRef.current = selectedProvince;
  const onSelectProvinceRef = useRef(onSelectProvince);
  onSelectProvinceRef.current = onSelectProvince;

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  /* ------------------------------ Tải dữ liệu ------------------------------ */
  useEffect(() => {
    let cancelled = false;

    // Thử cả đường dẫn tương đối theo BASE_URL (Vite/GitHub Pages) và đường dẫn public tuyệt đối.
    // Cuối cùng dùng raw GitHub làm fallback để không phụ thuộc việc người dùng đã tự chép GeoJSON.
    const baseUrl = (import.meta as any).env?.BASE_URL || '/';
    const localCandidates = Array.from(new Set([
      `${baseUrl.replace(/\/?$/, '/') }data/vietnam-provinces-34.geojson`,
      '/data/vietnam-provinces-34.geojson',
    ]));
    const candidates = [
      ...localCandidates,
      'https://raw.githubusercontent.com/nguyenduy1133/Free-GIS-Data/main/Vietnam%20Administrative%20Divisions%20%28Post-2025%29%20-%20%C4%90%C6%A1n%20v%E1%BB%8B%20h%C3%A0nh%20ch%C3%ADnh%20Vi%E1%BB%87t%20Nam%20%28T%E1%BB%AB%202025%29/Provinces.geojson',
    ];

    const load = async () => {
      const errors: string[] = [];
      for (const url of candidates) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json() as GeoJSONLike;
          const features = extractProvinceFeatures(data);
          if (!features.length) throw new Error('JSON không chứa Feature Polygon/MultiPolygon hợp lệ');
          if (!cancelled) {
            setProvinceFeatures(features);
            setMapDataError(false);
          }
          return;
        } catch (error) {
          errors.push(`${url}: ${error instanceof Error ? error.message : 'lỗi không xác định'}`);
        }
      }
      console.error('[CulturalMap] Không tải được dữ liệu địa giới:', errors);
      if (!cancelled) setMapDataError(true);
    };

    void load();
    return () => { cancelled = true; };
  }, [reloadKey]);

  /* ------------------------- Kích thước khung bản đồ ------------------------- */
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Chỉ bắt đầu hiệu ứng bay vào Đông Nam Bộ khi người dùng đã cuộn tới bản đồ.
  useEffect(() => {
    const el = frameWrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Marker chờ camera bay vào Đông Nam Bộ rồi mới nảy lên. Sau khi mở màn xong
  // (về sau đổi bộ lọc), marker mới xuất hiện ngay không cần chờ.
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => { markersReadyRef.current = true; }, 4500);
    return () => window.clearTimeout(t);
  }, [inView]);

  /* ------------------------- Dữ liệu hình học (tính 1 lần) ------------------------- */
  // Trước đây geometryToPath bị gọi lại ở mọi lần render (kể cả mỗi lần hover).
  const shapes = useMemo<ProvinceShape[]>(() => provinceFeatures.map((f, i) => ({
    key: String(i),
    d: geometryToPath(f.geometry),
    id: getFeatureProvinceId(f),
    bounds: getGeometryBounds(f.geometry),
  })), [provinceFeatures]);

  const baseShapes = useMemo(() => shapes.filter((s) => !s.id), [shapes]);
  const focusShapes = useMemo(
    () => TARGET_IDS.flatMap((id) => shapes.filter((s) => s.id === id)),
    [shapes],
  );

  const provinceBounds = useMemo(() => {
    const result = new Map<ProvinceId, Bounds>();
    for (const s of shapes) {
      if (!s.id) continue;
      const old = result.get(s.id);
      result.set(s.id, old ? {
        minX: Math.min(old.minX, s.bounds.minX), minY: Math.min(old.minY, s.bounds.minY),
        maxX: Math.max(old.maxX, s.bounds.maxX), maxY: Math.max(old.maxY, s.bounds.maxY),
      } : s.bounds);
    }
    return result;
  }, [shapes]);

  const worldBounds = useMemo<Bounds | null>(() => {
    if (!shapes.length) return null;
    return shapes.reduce((acc, s) => ({
      minX: Math.min(acc.minX, s.bounds.minX), minY: Math.min(acc.minY, s.bounds.minY),
      maxX: Math.max(acc.maxX, s.bounds.maxX), maxY: Math.max(acc.maxY, s.bounds.maxY),
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
  }, [shapes]);

  // Tỉ lệ khung thật của container để bản đồ lấp đầy khung, không bị viền đen hai bên.
  const aspect = useMemo(() => Math.round((size.w / size.h) * 100) / 100 || 16 / 9, [size]);

  const viewBoxObject = useMemo<Camera>(() => {
    if (selectedProvince !== 'all') {
      const bounds = provinceBounds.get(selectedProvince);
      if (bounds) return fitBoundsToViewBox(bounds, aspect, 1.24);
    } else {
      const regionBounds = TARGET_IDS.map((id) => provinceBounds.get(id)).filter(Boolean) as Bounds[];
      if (regionBounds.length) {
        const union = {
          minX: Math.min(...regionBounds.map((b) => b.minX)),
          minY: Math.min(...regionBounds.map((b) => b.minY)),
          maxX: Math.max(...regionBounds.map((b) => b.maxX)),
          maxY: Math.max(...regionBounds.map((b) => b.maxY)),
        };
        return fitBoundsToViewBox(union, aspect, 1.28);
      }
    }
    return { ...(FALLBACK_VIEWBOX[selectedProvince] || FALLBACK_VIEWBOX.all) };
  }, [selectedProvince, provinceBounds, aspect]);

  /* ---------------------------- Camera + animation ---------------------------- */
  const commitCamera = useCallback((c: Camera) => {
    cameraRef.current = c;
    setCamera(c);
  }, []);

  // Bay camera tới đích bằng requestAnimationFrame. Tâm nội suy tuyến tính,
  // độ rộng/cao nội suy theo log để cảm giác zoom đều tay. Nếu bị ngắt giữa chừng
  // (đổi tỉnh, bấm zoom, kéo bản đồ) sẽ tiếp tục từ vị trí hiện tại nên không bị giật.
  const flyTo = useCallback((target: Camera, duration = 900) => {
    cancelAnimationFrame(animRef.current);
    inertiaRef.current = false;
    targetRef.current = target;
    if (reducedMotion || duration <= 0) {
      commitCamera(target);
      return;
    }
    const from = cameraRef.current;
    const fcx = from.x + from.w / 2, fcy = from.y + from.h / 2;
    const tcx = target.x + target.w / 2, tcy = target.y + target.h / 2;
    const lw0 = Math.log(from.w), lw1 = Math.log(target.w);
    const lh0 = Math.log(from.h), lh1 = Math.log(target.h);
    const t0 = performance.now();
    const ease = duration <= 600 ? easeOutCubic : easeInOutCubic;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = ease(p);
      const w = Math.exp(lw0 + (lw1 - lw0) * e);
      const h = Math.exp(lh0 + (lh1 - lh0) * e);
      const cx = fcx + (tcx - fcx) * e;
      const cy = fcy + (tcy - fcy) * e;
      commitCamera({ x: cx - w / 2, y: cy - h / 2, w, h });
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, [reducedMotion, commitCamera]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  // Khi đổi tỉnh/tải xong dữ liệu/đổi kích thước: đặt lại zoom và bay camera tới khung mới.
  useEffect(() => {
    baseRef.current = viewBoxObject;
    worldRef.current = worldBounds;
    zoomRef.current = 1;
    setZoom(1);
    const target = clampCamera(viewBoxObject, worldBounds);

    if (!worldBounds) {
      // Chưa có dữ liệu: đặt thẳng khung dự phòng, chưa cần animation.
      targetRef.current = target;
      commitCamera(target);
      return;
    }
    if (!introStartedRef.current) {
      // Khoảnh khắc mở màn duy nhất: giữ nguyên toàn cảnh Việt Nam cho tới khi người dùng
      // cuộn tới bản đồ, lúc đó mới bay vào Đông Nam Bộ.
      const start = clampCamera(fitBoundsToViewBox(worldBounds, aspect, 1.1), worldBounds);
      if (!inView) {
        targetRef.current = start;
        commitCamera(start);
        return;
      }
      commitCamera(start);
      introStartedRef.current = true;
      flyTo(target, 2200);
      return;
    }
    flyTo(target, 1100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewBoxObject, worldBounds, inView]);

  const zoomAt = useCallback((nextZoom: number, fx = 0.5, fy = 0.5, duration = 420) => {
    const z = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    const base = baseRef.current;
    const t = targetRef.current;
    const nw = base.w / z, nh = base.h / z;
    // Giữ nguyên điểm dưới con trỏ (fx, fy) khi zoom, giống bản đồ trực tuyến.
    const ax = t.x + fx * t.w, ay = t.y + fy * t.h;
    zoomRef.current = z;
    setZoom(z);
    flyTo(clampCamera({ x: ax - fx * nw, y: ay - fy * nh, w: nw, h: nh }, worldRef.current), duration);
  }, [flyTo]);

  const resetView = useCallback(() => {
    zoomRef.current = 1;
    setZoom(1);
    flyTo(clampCamera(baseRef.current, worldRef.current), 1000);
  }, [flyTo]);

  // Kéo để di chuyển + Ctrl/⌘ + cuộn (hoặc pinch trên trackpad) để thu phóng.
  // Không chiếm cuộn trang thường, tránh "kẹt" khi người dùng lướt qua bản đồ.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let drag: { x: number; y: number; cam: Camera; moved: boolean } | null = null;

    // Gộp các sự kiện pointermove: tối đa một lần vẽ lại mỗi khung hình (mượt hơn trên chuột/trackpad tần số cao).
    let pendingCam: Camera | null = null;
    let dragRaf = 0;
    const flushDrag = () => {
      dragRaf = 0;
      if (pendingCam) { commitCamera(pendingCam); pendingCam = null; }
    };

    // Vận tốc kéo (px/ms), làm mượt bằng trung bình trượt để quán tính không bị giật.
    let vx = 0, vy = 0, lastX = 0, lastY = 0, lastT = 0;

    // Sau khi thả tay, bản đồ trượt tiếp rồi chậm dần như vật thể có ma sát.
    const startInertia = (rect: DOMRect) => {
      let prev = performance.now();
      inertiaRef.current = true;
      const tick = (now: number) => {
        if (!inertiaRef.current) return;
        const dt = Math.min(32, now - prev);
        prev = now;
        const decay = Math.exp(-dt / 260);
        vx *= decay; vy *= decay;
        const cam = cameraRef.current;
        const c = clampCamera({
          x: cam.x - (vx * dt * cam.w) / rect.width,
          y: cam.y - (vy * dt * cam.h) / rect.height,
          w: cam.w,
          h: cam.h,
        }, worldRef.current);
        targetRef.current = c;
        commitCamera(c);
        if (Math.hypot(vx, vy) > 0.02) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          inertiaRef.current = false;
        }
      };
      animRef.current = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const fx = (e.clientX - rect.left) / rect.width;
      const fy = (e.clientY - rect.top) / rect.height;
      const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      zoomAt(zoomRef.current * Math.exp(-dy * 0.0022), fx, fy, 180);
    };

    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      let dx = e.clientX - drag.x;
      let dy = e.clientY - drag.y;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < 5) return;
        drag.moved = true;
        cancelAnimationFrame(animRef.current);
        // Bắt đầu kéo từ đúng vị trí camera đang hiển thị để không bị nhảy.
        drag.cam = { ...cameraRef.current };
        drag.x = e.clientX; drag.y = e.clientY;
        dx = 0; dy = 0;
        lastX = e.clientX; lastY = e.clientY; lastT = performance.now();
        vx = 0; vy = 0;
        setIsDragging(true);
      }
      const nowT = performance.now();
      const dtv = nowT - lastT;
      if (dtv > 0) {
        vx = vx * 0.5 + ((e.clientX - lastX) / dtv) * 0.5;
        vy = vy * 0.5 + ((e.clientY - lastY) / dtv) * 0.5;
      }
      lastX = e.clientX; lastY = e.clientY; lastT = nowT;
      const rect = el.getBoundingClientRect();
      const c = clampCamera({
        x: drag.cam.x - (dx * drag.cam.w) / rect.width,
        y: drag.cam.y - (dy * drag.cam.h) / rect.height,
        w: drag.cam.w,
        h: drag.cam.h,
      }, worldRef.current);
      targetRef.current = c;
      pendingCam = c;
      if (!dragRaf) dragRaf = requestAnimationFrame(flushDrag);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (dragRaf) { cancelAnimationFrame(dragRaf); flushDrag(); }
      if (drag?.moved) {
        // Chặn cú click ngay sau khi thả chuột để không vô tình chọn tỉnh/marker.
        suppressClickRef.current = true;
        window.setTimeout(() => { suppressClickRef.current = false; }, 60);
        // Thả tay khi vẫn đang kéo nhanh thì trượt tiếp; dừng tay trước khi thả thì không trượt.
        const idle = performance.now() - lastT;
        if (!reducedMotion && idle < 90 && Math.hypot(vx, vy) > 0.08) {
          startInertia(el.getBoundingClientRect());
        }
      }
      drag = null;
      setIsDragging(false);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || !e.isPrimary) return;
      // Chạm vào bản đồ đang trượt thì giữ nó lại ngay.
      if (inertiaRef.current) {
        cancelAnimationFrame(animRef.current);
        inertiaRef.current = false;
      }
      vx = 0; vy = 0;
      drag = { x: e.clientX, y: e.clientY, cam: { ...targetRef.current }, moved: false };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onDown);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onDown);
      cancelAnimationFrame(dragRaf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [zoomAt, commitCamera, reducedMotion]);

  /* --------------------------------- Dữ liệu điểm --------------------------------- */
  const displayedPoints = useMemo(() => {
    return points.filter((p) => {
      const matchProv = selectedProvince === 'all' || p.provinceId === selectedProvince;
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchProv && matchCat;
    });
  }, [points, selectedProvince, selectedCategory]);

  const countByProvince = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of points) m[p.provinceId] = (m[p.provinceId] || 0) + 1;
    return m;
  }, [points]);

  // coords.x/y là phần trăm 0–100 trong bounds của tỉnh. Dùng bounds thật
  // từ chính GeoJSON đang vẽ để marker không bị lệch do hard-code kinh/vĩ độ.
  const getSvgCoordinates = (point: CulturalPoint) => {
    const bounds = provinceBounds.get(point.provinceId);
    if (!bounds) return { x: 0, y: 0 };
    const px = Math.max(0, Math.min(100, Number(point.coords.x)));
    const py = Math.max(0, Math.min(100, Number(point.coords.y)));
    return {
      x: bounds.minX + (px / 100) * (bounds.maxX - bounds.minX),
      y: bounds.minY + (py / 100) * (bounds.maxY - bounds.minY),
    };
  };

  /* --------------------------------- Handler UI --------------------------------- */
  const handleProvinceClick = useCallback((id: ProvinceId) => {
    if (suppressClickRef.current) return;
    onSelectProvinceRef.current(selectedProvinceRef.current === id ? 'all' : id);
  }, []);

  const selectProvince = (id: ProvinceId) => {
    onSelectProvince(id);
    // Cùng một tỉnh nhưng đang zoom/pan lệch: đưa camera về lại khung gốc.
    if (id === selectedProvince) resetView();
  };

  const handleReset = () => {
    onSelectProvince('all');
    setActivePoint(null);
    if (selectedProvince === 'all') resetView();
  };

  const activeProvinceInfo = PROVINCES.find((p) => p.id === selectedProvince);
  const hoveredInfo = hoveredProvince && hoveredProvince !== selectedProvince
    ? PROVINCES.find((p) => p.id === hoveredProvince)
    : null;

  // 1 đơn vị "px" cục bộ = 1 pixel màn hình thật. Marker/nhãn dùng hệ số này
  // nên luôn giữ kích thước đều đặn kể cả khi camera đang bay.
  const pxScale = camera.w / Math.max(1, size.w);
  // Độ nhô lên của tỉnh được hover/chọn, tính theo khung gốc để không rung khi zoom.
  const liftUnit = (viewBoxObject.w / Math.max(1, size.w)) * 3.2;
  const currentViewBox = `${camera.x} ${camera.y} ${camera.w} ${camera.h}`;
  const seaLabelOpacity = clamp((camera.w - 260) / 260, 0, 0.5);

  const labelPoints = useMemo(() => {
    const list: CulturalPoint[] = [];
    if (activePoint) list.push(activePoint);
    if (hoveredPoint && hoveredPoint.id !== activePoint?.id) list.push(hoveredPoint);
    return list;
  }, [activePoint, hoveredPoint]);

  // Đèn rọi vàng mềm đi theo con trỏ trong khung bản đồ. Chỉ đặt biến CSS, không làm React vẽ lại.
  const handleFrameMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || reducedMotion) return;
    const el = mapContainerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
    el.style.setProperty('--so', '1');
  };
  const handleFrameLeave = () => {
    mapContainerRef.current?.style.setProperty('--so', '0');
  };

  // Lưới chấm trôi theo camera (thị sai nhẹ) để khi kéo/zoom bản đồ có chiều sâu thay vì đứng yên.
  const GRID_STEP = 24;
  const gridPx = size.w / Math.max(1, camera.w);
  const gridPos = (v: number) => `${(((-v * gridPx * 0.35) % GRID_STEP) + GRID_STEP) % GRID_STEP}px`;

  const zoomBtn =
    'group p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-amber-300 border border-stone-700/80 hover:border-amber-400/50 shadow-lg ' +
    'backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70';

  return (
    <div
      id="map-section"
      ref={secRef}
      className={`fx-sec relative w-full bg-stone-950 py-10 border-t border-stone-800 ${secInView ? 'fx-in' : ''}`}
    >
      <style>{MAP_CSS + MAP_FX_CSS + SECTION_FX_CSS}</style>

      {/* Đường kẻ vàng vẽ ra ở mép trên section */}
      <span
        aria-hidden="true"
        className="fx-line absolute top-0 left-0 h-px w-full bg-gradient-to-r from-amber-400/70 via-stone-700/80 to-transparent"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="fx-wipe flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2" style={delay(0)}>
              <Compass className="fx-compass w-4 h-4 text-amber-400" />
              <span>BẢN ĐỒ TƯƠNG TÁC ĐỊA LÝ & DI SẢN</span>
            </div>
            <RevealTitle
              text="Không Gian Văn Hóa Việt Nam · Trọng tâm Đông Nam Bộ"
              className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-tight"
              delayMs={200}
            />
            <p className="fx-rise text-stone-400 text-sm mt-1 max-w-2xl leading-relaxed" style={delay(900)}>
              Địa giới hành chính 34 tỉnh, thành sau sắp xếp 2025 · Làm nổi bật Đông Nam Bộ và đường biên giới Việt Nam.
            </p>
          </div>

          {/* Province Selector Pills */}
          <div className="fx-pop flex flex-wrap items-center gap-2 bg-stone-900/90 p-1.5 rounded-xl border border-stone-800/80" style={delay(1000)}>
            <button
              onClick={handleReset}
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
                onClick={() => selectProvince(p.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedProvince === p.id
                    ? 'bg-stone-800 text-stone-100 border border-stone-700 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PROVINCE_STYLE[p.id].color }} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <span className="fx-pop text-xs text-stone-500 font-mono flex items-center gap-1 shrink-0 mr-1" style={delay(1100)}>
            <Filter className="w-3.5 h-3.5" />
            <span>Phân loại:</span>
          </span>
          <button
            onClick={() => onSelectCategory('all')}
            className={`fx-pop px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-medium'
                : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
            style={delay(1160)}
          >
            Tất cả ({points.length})
          </button>
          {CULTURAL_CATEGORIES.map((cat, catIdx) => {
            const count = points.filter(
              (p) =>
                (selectedProvince === 'all' || p.provinceId === selectedProvince) &&
                p.category === cat.id
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`fx-pop px-3 py-1 rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? `${cat.bgColor} border font-medium`
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
                style={delay(1240 + catIdx * 70)}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span>{cat.label}</span>
                <span className="text-[11px] opacity-70 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Map Canvas Container (bọc ngoài để observer không bị clip-path chặn) */}
        <div ref={frameWrapRef} className="relative w-full">
        <div
          ref={mapContainerRef}
          className={`cm-frame ${inView ? 'cm-in' : ''} relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl border border-stone-800 hover:border-amber-400/25 shadow-2xl overflow-hidden select-none transition-[border-color] duration-500`}
          onPointerMove={handleFrameMove}
          onPointerLeave={handleFrameLeave}
          style={{ background: 'radial-gradient(120% 110% at 50% 0%, #0c2536 0%, #07111b 55%, #04080f 100%)' }}
        >
          {/* Lưới chấm tọa độ */}
          <div
            className="absolute inset-0 bg-[radial-gradient(#3b4a57_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"
            style={{ backgroundPosition: `${gridPos(camera.x)} ${gridPos(camera.y)}` }}
          />

          {/* Ánh sáng biển trôi chậm: hai quầng sáng mờ lướt nhẹ phía sau bản đồ */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="cm-drift-a" />
            <div className="cm-drift-b" />
          </div>

          {/* SVG Map Canvas */}
          <svg
            ref={svgRef}
            viewBox={currentViewBox}
            className={`relative w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              shapeRendering: 'geometricPrecision',
              touchAction: 'pan-y',
              ['--cm-lift' as string]: `${liftUnit}px`,
            } as React.CSSProperties}
          >
            <defs>
              <linearGradient id="sea-glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0b3852" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#0b617a" stopOpacity="0.10" />
              </linearGradient>
              <linearGradient id="land-glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d9f3ee" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#8bb7c4" stopOpacity="0.07" />
              </linearGradient>
              <linearGradient id="trans-pink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fb7185" stopOpacity="0.27" />
                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.11" />
              </linearGradient>
              <linearGradient id="trans-yellow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0.12" />
              </linearGradient>
              <linearGradient id="trans-blue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.11" />
              </linearGradient>
              {/* Màu nhấn khi chọn: đậm vừa đủ, có chiều sâu nhưng không thành mảng màu phẳng */}
              <linearGradient id="active-pink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fda4af" stopOpacity="0.78" />
                <stop offset="55%" stopColor="#fb7185" stopOpacity="0.66" />
                <stop offset="100%" stopColor="#be123c" stopOpacity="0.58" />
              </linearGradient>
              <linearGradient id="active-yellow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.82" />
                <stop offset="55%" stopColor="#facc15" stopOpacity="0.68" />
                <stop offset="100%" stopColor="#a16207" stopOpacity="0.58" />
              </linearGradient>
              <linearGradient id="active-blue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.82" />
                <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.68" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.58" />
              </linearGradient>
            </defs>

            {/* Biển: phủ rộng để khi kéo/zoom ra xa vẫn không lộ mép */}
            <rect x="-3000" y="-2000" width="6000" height="5000" fill="url(#sea-glass)" pointerEvents="none" />
            <g transform="translate(865 445)" pointerEvents="none">
              <text fill="#7dd3fc" fontSize={18} fontFamily="serif" fontStyle="italic" letterSpacing="6"
                textAnchor="middle" transform="rotate(90)" opacity={seaLabelOpacity}>BIỂN ĐÔNG</text>
            </g>

            {/* Toàn bộ 34 tỉnh/thành: đất liền tĩnh + 3 tỉnh trọng tâm tương tác */}
            {shapes.length > 0 && (
              <g className="cm-fade">
                <BaseLayer shapes={baseShapes} />
                <FocusLayer
                  shapes={focusShapes}
                  selected={selectedProvince}
                  hovered={hoveredProvince}
                  onHover={setHoveredProvince}
                  onSelect={handleProvinceClick}
                />
              </g>
            )}

            {/* Nhãn tỉnh đặt theo tâm bounds thật, kích thước chữ cố định theo pixel màn hình */}
            <g pointerEvents="none" fontFamily="ui-sans-serif, system-ui, sans-serif" textAnchor="middle">
              {TARGET_IDS.map((id) => {
                const b = provinceBounds.get(id);
                if (!b) return null;
                const st = PROVINCE_STYLE[id];
                const isSel = selectedProvince === id;
                const other = selectedProvince !== 'all' && !isSel;
                const opacity = isSel ? 0.45 : other ? 0.3 : hoveredProvince === id ? 1 : 0.82;
                return (
                  <g key={id} transform={`translate(${(b.minX + b.maxX) / 2} ${(b.minY + b.maxY) / 2}) scale(${pxScale})`}
                    style={{ opacity, transition: 'opacity 400ms ease' }}>
                    <text fill={st.label} fontSize="12" fontWeight="800" letterSpacing="1.2"
                      stroke="rgba(3,10,20,0.8)" strokeWidth="3.5" strokeLinejoin="round" paintOrder="stroke">
                      {st.short}
                      <tspan x="0" dy="15" fontSize="10" fontWeight="600" letterSpacing="0.4">
                        {countByProvince[id] || 0} điểm di sản
                      </tspan>
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Sóng lan từ tâm 3 tỉnh, chạy một lần khi bản đồ lần đầu hiện ra */}
            <g pointerEvents="none">
              {TARGET_IDS.map((id, idx) => {
                const b = provinceBounds.get(id);
                if (!b) return null;
                return (
                  <g key={`wave-${id}`} transform={`translate(${(b.minX + b.maxX) / 2} ${(b.minY + b.maxY) / 2}) scale(${pxScale})`}>
                    {[0, 1, 2].map((k) => (
                      <circle key={k} r="140" fill={PROVINCE_STYLE[id].color} fillOpacity="0.05"
                        stroke={PROVINCE_STYLE[id].color} strokeWidth="1.6" vectorEffect="non-scaling-stroke"
                        className="cm-wave" style={delay(1500 + idx * 240 + k * 420)} />
                    ))}
                  </g>
                );
              })}
            </g>

            {/* Marker điểm di sản. Nhóm ngoài chỉ dùng attribute transform (định vị + tỉ lệ),
                animation/hover chạy ở nhóm trong bằng CSS để hai thứ không đè nhau. */}
            {displayedPoints.map((point, i) => {
              const { x, y } = getSvgCoordinates(point);
              const isSelected = activePoint?.id === point.id;
              const isHovered = hoveredPoint?.id === point.id;
              const category = CULTURAL_CATEGORIES.find((c) => c.id === point.category);
              const markerColor = category?.color || '#f59e0b';
              const openPoint = () => { if (!suppressClickRef.current) setActivePoint(point); };
              return (
                <g key={point.id} transform={`translate(${x} ${y}) scale(${pxScale})`}
                  className="cursor-pointer outline-none"
                  role="button" tabIndex={0} aria-label={point.name}
                  onClick={(e) => { e.stopPropagation(); openPoint(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActivePoint(point); } }}
                  onMouseEnter={() => setHoveredPoint(point)} onMouseLeave={() => setHoveredPoint(null)}
                  onFocus={() => setHoveredPoint(point)} onBlur={() => setHoveredPoint(null)}>
                  <g
                    className={inView ? 'cm-pop' : undefined}
                    style={{
                      animationDelay: `${Math.min(i * 55, 600) + (markersReadyRef.current ? 0 : 1500)}ms`,
                      opacity: inView ? undefined : 0,
                    }}
                  >
                    <g className="cm-motion" style={{
                      transform: isHovered || isSelected ? 'scale(1.3)' : 'scale(1)',
                      transition: 'transform 260ms cubic-bezier(.34,1.56,.64,1)',
                    }}>
                      <circle r="16" fill="transparent" />
                      {/* quầng sáng mềm, đậm hơn khi hover/chọn */}
                      <circle r="19" fill={markerColor} style={{
                        opacity: isHovered || isSelected ? 0.16 : 0.06,
                        transition: 'opacity 300ms ease',
                      }} />
                      {point.isFeatured && (
                        <circle r="9" fill="none" stroke={markerColor} strokeWidth="1.5" className="cm-ring"
                          style={{ animationDelay: `${(i % 5) * 450}ms` }} />
                      )}
                      {isSelected && <circle r="12" fill="none" stroke={markerColor} strokeWidth="1.5" opacity="0.9" />}
                      {isSelected && <circle r="12" fill="none" stroke={markerColor} strokeWidth="1.2" className="cm-ring"
                        style={{ animationDuration: '1.8s' }} />}
                      <circle r="11" fill={markerColor} opacity="0.2" />
                      <circle r="5.5" fill={markerColor} stroke="#fff" strokeWidth="1.8" />
                      <circle r="1.8" fill="#fff" opacity="0.85" />
                    </g>
                  </g>
                </g>
              );
            })}

            {/* Nhãn marker nằm ở layer trên cùng để không bị marker khác che */}
            {labelPoints.map((point) => {
              const { x, y } = getSvgCoordinates(point);
              const category = CULTURAL_CATEGORIES.find((c) => c.id === point.category);
              const markerColor = category?.color || '#f59e0b';
              const text = point.name.length > 24 ? `${point.name.slice(0, 22)}…` : point.name;
              const w = Math.round(text.length * 6.4 + 38);
              return (
                <g key={`label-${point.id}`} transform={`translate(${x} ${y - 20 * pxScale}) scale(${pxScale})`} pointerEvents="none">
                  <g className="cm-label">
                    <rect x={-w / 2} y="-24" width={w} height="22" rx="11" fill="#050b14" fillOpacity="0.94"
                      stroke={markerColor} strokeOpacity="0.9" strokeWidth="1" />
                    <circle cx={-w / 2 + 12} cy="-13" r="3" fill={markerColor} />
                    <text x="6" y="-9" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle"
                      fontFamily="ui-sans-serif, system-ui, sans-serif">{text}</text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Viền tối nhẹ quanh khung để mắt tập trung vào giữa bản đồ */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_110px_rgba(2,6,14,0.85)]" />

          {/* Đèn rọi vàng theo con trỏ */}
          <div aria-hidden="true" className="cm-spot absolute inset-0 z-[4] pointer-events-none rounded-3xl" />

          {/* Vệt sáng mềm quét ngang mặt kính một lần khi bản đồ lần đầu hiện ra */}
          <div aria-hidden="true" className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
            <div className="cm-sheen" />
          </div>

          {/* Trạng thái tải / lỗi */}
          {!shapes.length && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-stone-300">
              {mapDataError ? (
                <>
                  <p className="text-sm">Không tải được dữ liệu địa giới. Mở Console để xem lỗi chi tiết.</p>
                  <button
                    onClick={() => { setMapDataError(false); setReloadKey((k) => k + 1); }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors"
                  >
                    Thử lại
                  </button>
                </>
              ) : (
                <>
                  <div className="h-8 w-8 rounded-full border-2 border-cyan-400/25 border-t-cyan-300 animate-spin" />
                  <p className="text-sm">Đang tải dữ liệu địa giới Việt Nam…</p>
                </>
              )}
            </div>
          )}

          {/* Floating Action Bar */}
          <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-2">
            <button onClick={() => zoomAt(zoomRef.current * 1.4)} disabled={zoom >= MAX_ZOOM - 0.01}
              aria-label="Phóng to" className={zoomBtn}>
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-stone-400 tabular-nums select-none">{Math.round(zoom * 100)}%</span>
            <button onClick={() => zoomAt(zoomRef.current / 1.4)} disabled={zoom <= MIN_ZOOM + 0.01}
              aria-label="Thu nhỏ" className={zoomBtn}>
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleReset} aria-label="Đặt lại bản đồ" className={zoomBtn}>
              <RotateCcw className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-180" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-20">
            {activeProvinceInfo ? (
              <div key={activeProvinceInfo.id}
                className="cm-slide bg-stone-950/90 backdrop-blur-md border border-stone-800 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                <span className="relative flex w-3 h-3 shrink-0">
                  <span className="cm-ring absolute inset-0 rounded-full"
                    style={{ backgroundColor: PROVINCE_STYLE[activeProvinceInfo.id].color }} />
                  <span className="relative w-3 h-3 rounded-full"
                    style={{ backgroundColor: PROVINCE_STYLE[activeProvinceInfo.id].color }} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-stone-100">{activeProvinceInfo.name}</h4>
                  <p className="text-[11px] text-stone-400">{activeProvinceInfo.mergedFrom || activeProvinceInfo.tagline}</p>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 bg-stone-950/80 backdrop-blur-md border border-stone-800 px-3 py-1.5 rounded-xl text-xs text-stone-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Bản đồ Việt Nam · 34 tỉnh/thành mới</span>
              </div>
            )}
          </div>

          {/* Gợi ý khi rê chuột vào tỉnh */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 hidden sm:block pointer-events-none transition-all duration-300"
            style={{ opacity: hoveredInfo ? 1 : 0, transform: `translate(-50%, ${hoveredInfo ? 0 : -6}px)` }}
          >
            {hoveredInfo && (
              <div className="flex items-center gap-2 bg-stone-950/90 backdrop-blur-md border border-stone-800 px-3 py-1.5 rounded-xl text-xs text-stone-200 shadow-lg whitespace-nowrap">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PROVINCE_STYLE[hoveredInfo.id].color }} />
                <span className="font-semibold">{hoveredInfo.name}</span>
                <span className="text-stone-500">·</span>
                <span className="text-stone-400">{countByProvince[hoveredInfo.id] || 0} điểm di sản · nhấn để phóng vào</span>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-4 bg-stone-950/90 backdrop-blur-md border border-stone-800 px-3.5 py-2 rounded-xl text-[11px] text-stone-300">
            <span className="font-mono text-stone-500">Đông Nam Bộ:</span>
            {TARGET_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => selectProvince(id)}
                onMouseEnter={() => setHoveredProvince(id)}
                onMouseLeave={() => setHoveredProvince(null)}
                onFocus={() => setHoveredProvince(id)}
                onBlur={() => setHoveredProvince(null)}
                className={`group/leg flex items-center gap-1.5 transition-colors hover:text-stone-100 focus-visible:outline-none focus-visible:text-amber-300 ${
                  selectedProvince === id ? 'text-stone-100' : ''
                }`}
              >
                <span className="w-3 h-3 rounded-sm border transition-transform duration-300 group-hover/leg:scale-125"
                  style={{ backgroundColor: `${PROVINCE_STYLE[id].color}80`, borderColor: PROVINCE_STYLE[id].color }} />
                <span>{id === 'hcm' ? 'Thành phố Hồ Chí Minh' : id === 'tay-ninh' ? 'Tây Ninh' : 'Đồng Nai'}</span>
              </button>
            ))}
          </div>

          {/* Gợi ý thao tác */}
          <div className="absolute bottom-4 right-4 z-20 hidden lg:flex items-center gap-1.5 text-[10px] text-stone-500 pointer-events-none">
            <Move className="w-3 h-3" />
            <span>Kéo để di chuyển · Ctrl + cuộn để thu phóng</span>
          </div>

          {/* Preview Popup */}
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
    </div>
  );
}