import { useState, useEffect, useMemo, useRef } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
  Bookmark,
  BookmarkCheck,
  Maximize2,
  Film,
  BookOpen,
  Compass,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Upload,
  Loader2,
} from 'lucide-react';
import { CulturalPoint } from '../types/cultural';
import { CULTURAL_CATEGORIES, PROVINCES } from '../data/culturalData';
import { uploadImageToSupabase } from '../lib/supabase';

interface CulturalDetailModalProps {
  point: CulturalPoint | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onUpdatePoint?: (point: CulturalPoint) => Promise<void> | void;
}

/* ------------------------------------------------------------------ */
/* Helpers (cùng quy ước với LandingHero)                              */
/* ------------------------------------------------------------------ */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const canHover = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/**
 * Hàm hỗ trợ tự động chuẩn hóa các định dạng URL YouTube sang dạng nhúng /embed/
 */
const getEmbedVideoUrl = (url?: string) => {
  if (!url) return '';
  
  // Nếu đã ở dạng /embed/ chuẩn
  if (url.includes('/embed/')) return url;

  // Xử lý dạng: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // Xử lý dạng ngắn: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/(?:youtu\.be\/)([^?&]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  return url;
};

/* ------------------------------------------------------------------ */
/* Khung ảnh có ánh sáng vàng bám theo con trỏ                         */
/* ------------------------------------------------------------------ */

function GlareFrame({
  className,
  style,
  children,
}: {
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canHover() || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div ref={ref} onMouseMove={handleMove} className={`group ${className}`} style={style}>
      <div
        aria-hidden="true"
        className="cdm-glare pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nút tab: tab đang chọn có dải sáng quét qua như nút CTA ở Landing   */
/* ------------------------------------------------------------------ */

function TabButton({
  active,
  onClick,
  icon,
  children,
  d,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
  d: number;
}) {
  return (
    <button
      onClick={onClick}
      style={delay(d)}
      className={`cdm-tab cdm-pop relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
        active
          ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-950/40'
          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
      }`}
    >
      {active && (
        <span aria-hidden="true" className="cdm-sheen absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-md" />
      )}
      <span className="cdm-tab-icon relative">{icon}</span>
      <span className="relative">{children}</span>
    </button>
  );
}

export function CulturalDetailModal({
  point,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onUpdatePoint,
}: CulturalDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'gallery' | 'video' | 'visiting'>('story');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const spotRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, onClose]);

  // Reset selected image index when point changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [point?.id]);

  // Đom đóm bay lên phía sau hộp thoại, giá trị cố định để không nhảy giữa các lần render.
  const embers = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: (i * 37 + 11) % 100,
        size: 2 + ((i * 5) % 4),
        dur: 9 + ((i * 7) % 9),
        del: ((i * 13) % 10) * 0.9,
        dx: (i % 2 ? 1 : -1) * (20 + ((i * 11) % 60)),
        o: 0.3 + ((i * 3) % 5) * 0.08,
      })),
    [],
  );

  if (!point) return null;

  const categoryInfo = CULTURAL_CATEGORIES.find((c) => c.id === point.category);
  const provinceInfo = PROVINCES.find((p) => p.id === point.provinceId);

  // Tập hợp ảnh đại diện chính (coverImage) và mảng ảnh phụ (galleryImages)
  const allImages = [point.coverImage, ...(point.galleryImages || [])].filter(
    (img, idx, arr) => arr.indexOf(img) === idx && img
  );

  // Tách tên địa danh thành từng chữ để trồi lên từ sau mặt nạ (nội dung không đổi).
  const nameWords = point.name.split(/\s+/).filter(Boolean);
  const titleEnd = 450 + nameWords.length * 70;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Đèn rọi vàng đi theo chuột trên nền mờ.
  const handleOverlayMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!canHover() || prefersReducedMotion()) return;
    const el = spotRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty('--px', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--py', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  // Hỗ trợ upload ảnh phụ bổ sung trực tiếp trong Modal xem chi tiết
  const handleUploadMoreImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onUpdatePoint) return;

    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadImageToSupabase(file));
      const newUrls = await Promise.all(uploadPromises);

      const currentGallery = point.galleryImages || [];
      const updatedPoint: CulturalPoint = {
        ...point,
        galleryImages: [...currentGallery, ...newUrls],
      };

      await onUpdatePoint(updatedPoint);
    } catch (err) {
      console.error(err);
      alert('Không thể tải ảnh lên Supabase Storage!');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <style>{CSS}</style>

      <div
        onMouseMove={handleOverlayMove}
        className="cdm-root cdm-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/85 backdrop-blur-md"
      >
        {/* Đèn rọi vàng đi theo chuột */}
        <div ref={spotRef} aria-hidden="true" className="cdm-spot pointer-events-none absolute inset-0" />

        {/* Đom đóm bay lên */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {embers.map((e, i) => (
            <span
              key={i}
              className="cdm-ember absolute bottom-0 rounded-full bg-amber-300"
              style={
                {
                  left: `${e.left}%`,
                  width: e.size,
                  height: e.size,
                  animationDuration: `${e.dur}s`,
                  animationDelay: `${0.8 + e.del}s`,
                  '--dx': `${e.dx}px`,
                  '--o': e.o,
                  boxShadow: '0 0 10px 2px rgba(251,191,36,0.55)',
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div
          className="cdm-panel relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl shadow-black overflow-hidden my-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Vệt sáng vàng quét qua mép trên khi hộp thoại mở */}
          <span
            aria-hidden="true"
            className="cdm-edge absolute top-0 left-0 right-0 h-px z-20 bg-gradient-to-r from-transparent via-amber-300 to-transparent"
            style={delay(500)}
          />

          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/90 z-10 shrink-0">
            <div className="cdm-wipe flex items-center gap-2 text-xs text-stone-400" style={delay(250)}>
              <span className="font-semibold text-amber-300 font-serif">
                {provinceInfo?.name}
              </span>
              <span aria-hidden="true">/</span>
              <span
                className="font-medium"
                style={{ color: categoryInfo?.color || '#f59e0b' }}
              >
                {categoryInfo?.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                aria-label="Chia sẻ liên kết di sản"
                title="Sao chép đường dẫn chia sẻ"
                className="cdm-pop p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                style={delay(350)}
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleBookmark(point.id)}
                aria-label={isBookmarked ? 'Bỏ lưu địa danh' : 'Lưu địa danh yêu thích'}
                title={isBookmarked ? 'Đã lưu' : 'Lưu vào sổ tay di sản'}
                className="cdm-pop p-2 rounded-xl text-stone-400 hover:text-amber-400 hover:bg-stone-800 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                style={delay(430)}
              >
                {isBookmarked ? (
                  <BookmarkCheck key="saved" className="cdm-pop w-4 h-4 text-amber-400" />
                ) : (
                  <Bookmark key="unsaved" className="w-4 h-4" />
                )}
              </button>

              <div className="w-px h-5 bg-stone-800 mx-1" />

              <button
                onClick={onClose}
                aria-label="Đóng cửa sổ thông tin"
                className="group/close cdm-pop p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
                style={delay(510)}
              >
                <X className="w-5 h-5 transition-transform duration-300 group-hover/close:rotate-90" />
              </button>
            </div>
          </div>

          {/* Modal Body: Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Copied toast notification */}
            {copiedToast && (
              <div className="cdm-pop bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-4 py-2 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Đã sao chép liên kết vào bộ nhớ tạm!</span>
              </div>
            )}

            {/* Title & Meta Header */}
            <div>
              <div
                className="cdm-wipe flex flex-wrap items-center gap-3 text-xs text-stone-400 mb-2"
                style={delay(350)}
              >
                {point.era && (
                  <span className="flex items-center gap-1.5 font-mono text-amber-400/90">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{point.era}</span>
                  </span>
                )}
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="flex items-center gap-1.5 text-stone-300">
                  <MapPin className="cdm-bounce w-3.5 h-3.5 text-amber-400" />
                  <span>{point.address}</span>
                </span>
              </div>

              <h2
                id="modal-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-100 tracking-tight leading-snug"
              >
                {nameWords.map((w, i) => {
                  const isLast = i === nameWords.length - 1;
                  return (
                    <span key={i}>
                      <span className="cdm-mask">
                        <span
                          className={`cdm-word ${
                            isLast
                              ? 'cdm-shimmer text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100'
                              : ''
                          }`}
                          style={delay(450 + i * 70)}
                        >
                          {w}
                        </span>
                      </span>
                      {i < nameWords.length - 1 ? ' ' : null}
                    </span>
                  );
                })}
              </h2>

              <p
                className="cdm-rise text-sm sm:text-base text-stone-300 font-light mt-3 leading-relaxed"
                style={delay(titleEnd + 100)}
              >
                {point.shortIntro}
              </p>
            </div>

            {/* Navigation Tabs for Media & Content */}
            <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
              <TabButton
                active={activeTab === 'story'}
                onClick={() => setActiveTab('story')}
                icon={<BookOpen className="w-4 h-4" />}
                d={titleEnd + 200}
              >
                Câu chuyện di sản
              </TabButton>

              <TabButton
                active={activeTab === 'gallery'}
                onClick={() => setActiveTab('gallery')}
                icon={<Sparkles className="w-4 h-4" />}
                d={titleEnd + 280}
              >
                Thư viện ảnh ({allImages.length})
              </TabButton>

              {point.videoUrl && (
                <TabButton
                  active={activeTab === 'video'}
                  onClick={() => setActiveTab('video')}
                  icon={<Film className="w-4 h-4" />}
                  d={titleEnd + 360}
                >
                  Video tư liệu
                </TabButton>
              )}

              <TabButton
                active={activeTab === 'visiting'}
                onClick={() => setActiveTab('visiting')}
                icon={<Compass className="w-4 h-4" />}
                d={titleEnd + 440}
              >
                Thông tin tham quan
              </TabButton>
            </div>

            {/* TAB 1: STORYTELLING */}
            {activeTab === 'story' && (
              <div className="space-y-6">
                {/* Hero Showcase Image */}
                <GlareFrame
                  className="cdm-clip relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-400/40 transition-[border-color] duration-300"
                  style={delay(0)}
                >
                  <img
                    key={selectedImageIndex}
                    src={allImages[selectedImageIndex] || point.coverImage}
                    alt={point.name}
                    className="cdm-swap w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950/80 hover:bg-stone-900 text-xs text-stone-200 backdrop-blur-md border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Xem toàn màn hình</span>
                  </button>
                </GlareFrame>

                {/* Section: Historical Chronicle with Drop Cap */}
                <div className="cdm-rise space-y-4" style={delay(150)}>
                  <h3 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                    <span className="font-mono text-sm text-stone-500">01.</span>
                    <span>Dấu Ấn Lịch Sử & Bối Cảnh Hình Thành</span>
                  </h3>
                  <div className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                    <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-2.5 first-letter:mt-1">
                      {point.historicalStory}
                    </p>
                  </div>
                </div>

                {/* Hairline Divider */}
                <div className="cdm-draw-x border-b border-stone-800/80" style={delay(350)} />

                {/* Section: Cultural Significance */}
                <div className="cdm-rise space-y-4" style={delay(400)}>
                  <h3 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                    <span className="font-mono text-sm text-stone-500">02.</span>
                    <span>Giá Trị Văn Hóa & Ý Nghĩa Di Sản</span>
                  </h3>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                    {point.culturalSignificance}
                  </p>
                </div>

                {/* Hairline Divider */}
                <div className="cdm-draw-x border-b border-stone-800/80" style={delay(600)} />

                {/* Section: Special Highlights */}
                <div className="space-y-4">
                  <h3
                    className="cdm-rise text-xl font-serif font-bold text-amber-300 flex items-center gap-2"
                    style={delay(650)}
                  >
                    <span className="font-mono text-sm text-stone-500">03.</span>
                    <span>Những Nét Đặc Trưng & Trải Nghiệm Nổi Bật</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {point.specialHighlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="cdm-pop group/card p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 hover:border-amber-400/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/30 transition-all duration-300 flex items-start gap-2.5"
                        style={delay(750 + idx * 90)}
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 transition-transform duration-300 group-hover/card:scale-125" />
                        <span className="text-xs sm:text-sm text-stone-200 leading-snug">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GALLERY & CAROUSEL */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                {/* Main Large Display with Carousel controls */}
                <GlareFrame
                  className="cdm-clip relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-400/40 transition-[border-color] duration-300 bg-stone-950 flex items-center justify-center"
                  style={delay(0)}
                >
                  <img
                    key={selectedImageIndex}
                    src={allImages[selectedImageIndex]}
                    alt={`${point.name} - ảnh ${selectedImageIndex + 1}`}
                    className="cdm-swap w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        aria-label="Ảnh trước"
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-200 border border-white/10 hover:border-amber-400/50 hover:scale-110 active:scale-95 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        aria-label="Ảnh kế tiếp"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-200 border border-white/10 hover:border-amber-400/50 hover:scale-110 active:scale-95 transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950/80 text-xs text-stone-200 backdrop-blur-md border border-white/10 hover:border-amber-400/50 transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mở rộng</span>
                  </button>
                </GlareFrame>

                {/* Thumbnails Strip & Quick Upload */}
                <div className="space-y-3">
                  <div className="cdm-rise flex items-center justify-between" style={delay(200)}>
                    <span className="text-xs text-stone-400 font-medium">
                      Danh sách ảnh ({allImages.length}):
                    </span>
                    {onUpdatePoint && (
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-medium border border-stone-700 hover:border-amber-400/50 transition-colors cursor-pointer">
                        {uploadingGallery ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{uploadingGallery ? 'Đang tải...' : 'Bổ sung ảnh phụ'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={uploadingGallery}
                          onChange={handleUploadMoreImages}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={delay(300 + Math.min(idx, 8) * 70)}
                        className={`cdm-pop relative h-20 w-28 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-amber-400 scale-105 shadow-md shadow-amber-950/50'
                            : 'border-transparent opacity-60 hover:opacity-100 hover:border-amber-400/40'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Ảnh thu nhỏ ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VIDEO THEATER */}
            {activeTab === 'video' && point.videoUrl && (
              <div className="space-y-4">
                <div
                  className="cdm-clip relative aspect-video w-full rounded-2xl overflow-hidden border border-stone-800 bg-black shadow-xl"
                  style={delay(0)}
                >
                  {point.videoUrl.includes('youtube.com') || point.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={getEmbedVideoUrl(point.videoUrl)}
                      title={point.videoTitle || point.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      controls
                      src={point.videoUrl}
                      poster={point.coverImage}
                      className="w-full h-full object-cover"
                    >
                      Trình duyệt không hỗ trợ thẻ phát video.
                    </video>
                  )}
                </div>
                {point.videoTitle && (
                  <div
                    className="cdm-rise p-4 rounded-xl bg-stone-950/60 border border-stone-800"
                    style={delay(300)}
                  >
                    <h4 className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                      <Film className="cdm-twinkle w-4 h-4 text-amber-400" />
                      <span>{point.videoTitle}</span>
                    </h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Thước phim tư liệu và hình ảnh trải nghiệm thực tế tại địa danh {point.name}.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: VISITING INFORMATION & TIPS */}
            {activeTab === 'visiting' && (
              <div className="space-y-5">
                <div
                  className="cdm-rise p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3"
                  style={delay(0)}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="cdm-bounce w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-200">Địa chỉ chính xác</h4>
                      <p className="text-xs text-stone-300 mt-0.5">{point.address}</p>
                    </div>
                  </div>

                  {point.coords.lat && point.coords.lng && (
                    <div className="pt-2 border-t border-stone-800 text-xs font-mono text-stone-400 flex items-center gap-3">
                      <span>Vĩ độ: {point.coords.lat.toFixed(4)}° N</span>
                      <span>Kinh độ: {point.coords.lng.toFixed(4)}° E</span>
                    </div>
                  )}
                </div>

                {point.visitingTips && (
                  <div
                    className="cdm-rise relative overflow-hidden p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30"
                    style={delay(150)}
                  >
                    <span
                      aria-hidden="true"
                      className="cdm-edge absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
                      style={delay(500)}
                    />
                    <h4 className="text-sm font-serif font-bold text-amber-300 flex items-center gap-2">
                      <Sparkles className="cdm-twinkle w-4 h-4 text-amber-400" />
                      <span>Kinh nghiệm & Lưu ý khi tham quan</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                      {point.visitingTips}
                    </p>
                  </div>
                )}

                {/* External Maps Simulator Link */}
                <div className="cdm-pop flex justify-end pt-2" style={delay(300)}>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${point.name} ${point.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cdm-cta group/cta relative overflow-hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span aria-hidden="true" className="cdm-sheen absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-md" />
                    <span className="relative">Mở vị trí trên bản đồ lớn</span>
                    <ExternalLink className="relative w-3.5 h-3.5 text-stone-950 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="relative px-6 py-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
            <span
              aria-hidden="true"
              className="cdm-draw-x absolute top-0 left-0 h-px w-full bg-gradient-to-r from-amber-400/70 via-stone-700/80 to-stone-800/60"
              style={delay(900)}
            />
            <span className="cdm-rise" style={delay(950)}>
              Bản đồ Văn hóa Đông Nam Bộ · Triển lãm số
            </span>
            <button
              onClick={onClose}
              className="cdm-pop px-4 py-2 rounded-xl text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-transparent hover:border-amber-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              style={delay(1050)}
            >
              Đóng và quay lại bản đồ
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX FOR IMAGES */}
      {isLightboxOpen && (
        <div
          className="cdm-root cdm-fade fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Đóng ảnh phóng to"
            className="group/close absolute top-6 right-6 p-3 rounded-full bg-stone-900/80 text-stone-200 hover:text-white border border-white/20 hover:border-amber-400/60 transition-colors"
          >
            <X className="w-6 h-6 transition-transform duration-300 group-hover/close:rotate-90" />
          </button>

          <img
            key={selectedImageIndex}
            src={allImages[selectedImageIndex]}
            alt={point.name}
            className="cdm-pop max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />

          <div className="cdm-rise mt-4 text-xs font-mono text-stone-400" style={delay(250)}>
            {point.name} · Ảnh {selectedImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* CSS: trạng thái ẩn + animation nằm trong media query no-preference, */
/* nên người dùng bật "giảm chuyển động" vẫn thấy đủ nội dung.         */
/* Dùng fill-mode `backwards` để sau khi chạy xong phần tử trở về      */
/* style gốc, không đè lên các hiệu ứng hover của Tailwind.            */
/* ------------------------------------------------------------------ */

const CSS = `
.cdm-root .cdm-spot {
  background: radial-gradient(420px circle at var(--px, 50%) var(--py, 30%), rgba(251, 191, 36, 0.10), transparent 65%);
  mix-blend-mode: screen;
  opacity: 0;
}
.cdm-root .cdm-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding-top: 0.2em; margin-top: -0.2em;
  padding-bottom: 0.14em; margin-bottom: -0.14em;
}
.cdm-root .cdm-word { display: inline-block; transform-origin: 0 100%; }
.cdm-root .cdm-shimmer { background-size: 220% auto; }
.cdm-root .cdm-glare {
  background: radial-gradient(260px circle at var(--gx, 50%) var(--gy, 50%), rgba(251, 191, 36, 0.16), transparent 70%);
}
.cdm-root .cdm-edge { opacity: 0; }
.cdm-root .cdm-ember, .cdm-root .cdm-sheen { display: none; }

@media (prefers-reduced-motion: no-preference) {
  .cdm-root .cdm-spot { opacity: 1; transition: opacity 1.2s ease 0.8s; }
  .cdm-root .cdm-ember, .cdm-root .cdm-sheen { display: block; }

  /* ---- Mở hộp thoại ---- */
  .cdm-root.cdm-overlay, .cdm-root.cdm-fade { animation: cdm-fade 0.35s ease backwards; }
  .cdm-root .cdm-panel { animation: cdm-panel 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
  .cdm-root .cdm-edge  { animation: cdm-edge 1.4s ease-out var(--d, 0ms) backwards; }
  .cdm-root .cdm-wipe  { animation: cdm-wipe 0.9s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }
  .cdm-root .cdm-word  { animation: cdm-word-up 1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .cdm-root .cdm-shimmer {
    animation:
      cdm-word-up 1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards,
      cdm-shimmer 5s ease-in-out calc(var(--d, 0ms) + 1s) infinite alternate;
  }
  .cdm-root .cdm-rise    { animation: cdm-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .cdm-root .cdm-pop     { animation: cdm-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) backwards; }
  .cdm-root .cdm-draw-x  { transform-origin: left; animation: cdm-draw-x 1.2s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }
  .cdm-root .cdm-clip    { animation: cdm-clip-down 1s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }
  .cdm-root .cdm-swap    { animation: cdm-swap 1s cubic-bezier(0.16, 1, 0.3, 1) backwards; }

  /* ---- Hiệu ứng lặp nhẹ ---- */
  .cdm-root .cdm-cta    { animation: cdm-ring 2.8s ease-out 1.8s infinite; }
  .cdm-root .cdm-sheen  { transform: translateX(-120%) skewX(-20deg); animation: cdm-sheen 4.5s ease-in-out 1.5s infinite; }
  .cdm-root .cdm-twinkle { animation: cdm-twinkle 2.6s ease-in-out infinite; }
  .cdm-root .cdm-bounce { animation: cdm-bounce 1.8s ease-in-out 2s infinite; }
  .cdm-root .cdm-tab:hover .cdm-tab-icon { animation: cdm-wiggle 0.6s ease-in-out; }
  .cdm-root .cdm-ember  { opacity: 0; animation-name: cdm-ember; animation-timing-function: linear; animation-iteration-count: infinite; }
}

/* Giảm chuyển động: hiện đủ nội dung, không animation */
@media (prefers-reduced-motion: reduce) {
  .cdm-root .cdm-edge { display: none; }
}

@keyframes cdm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes cdm-panel { from { opacity: 0; transform: translateY(32px) scale(0.94); filter: blur(10px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes cdm-edge { 0% { opacity: 0; transform: scaleX(0); } 40% { opacity: 1; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(1); } }
@keyframes cdm-wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes cdm-word-up { from { opacity: 0; transform: translateY(115%) rotate(5deg); } to { opacity: 1; transform: none; } }
@keyframes cdm-rise { from { opacity: 0; transform: translateY(18px); filter: blur(8px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes cdm-pop { 0% { opacity: 0; transform: scale(0.8) translateY(12px); } 100% { opacity: 1; transform: none; } }
@keyframes cdm-draw-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes cdm-clip-down { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes cdm-swap { from { opacity: 0; transform: scale(1.08); filter: blur(6px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes cdm-shimmer { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
@keyframes cdm-sheen { 0%, 55% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(520%) skewX(-20deg); } }
@keyframes cdm-ring { 0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); } 70%, 100% { box-shadow: 0 0 0 14px rgba(251, 191, 36, 0); } }
@keyframes cdm-twinkle { 0%, 100% { transform: scale(1) rotate(0); opacity: 1; } 50% { transform: scale(1.3) rotate(20deg); opacity: 0.75; } }
@keyframes cdm-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
@keyframes cdm-wiggle { 0%, 100% { transform: rotate(0) scale(1); } 30% { transform: rotate(-12deg) scale(1.15); } 70% { transform: rotate(10deg) scale(1.15); } }
@keyframes cdm-ember {
  0% { transform: translate3d(0, 0, 0) scale(0.6); opacity: 0; }
  12% { opacity: var(--o, 0.5); }
  100% { transform: translate3d(var(--dx, 0px), -100vh, 0) scale(1.1); opacity: 0; }
}
`;