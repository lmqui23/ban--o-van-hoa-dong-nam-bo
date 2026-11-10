import { useState, useEffect } from 'react';
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

  if (!point) return null;

  const categoryInfo = CULTURAL_CATEGORIES.find((c) => c.id === point.category);
  const provinceInfo = PROVINCES.find((p) => p.id === point.provinceId);

  // Tập hợp ảnh đại diện chính (coverImage) và mảng ảnh phụ (galleryImages)
  const allImages = [point.coverImage, ...(point.galleryImages || [])].filter(
    (img, idx, arr) => arr.indexOf(img) === idx && img
  );

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-300">
        <div
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl shadow-black overflow-hidden my-auto animate-in zoom-in-95 duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/90 z-10 shrink-0">
            <div className="flex items-center gap-2 text-xs text-stone-400">
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
                className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleBookmark(point.id)}
                aria-label={isBookmarked ? 'Bỏ lưu địa danh' : 'Lưu địa danh yêu thích'}
                title={isBookmarked ? 'Đã lưu' : 'Lưu vào sổ tay di sản'}
                className="p-2 rounded-xl text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-400" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              <div className="w-px h-5 bg-stone-800 mx-1" />

              <button
                onClick={onClose}
                aria-label="Đóng cửa sổ thông tin"
                className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Copied toast notification */}
            {copiedToast && (
              <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-4 py-2 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Đã sao chép liên kết vào bộ nhớ tạm!</span>
              </div>
            )}

            {/* Title & Meta Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mb-2">
                {point.era && (
                  <span className="flex items-center gap-1.5 font-mono text-amber-400/90">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{point.era}</span>
                  </span>
                )}
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="flex items-center gap-1.5 text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{point.address}</span>
                </span>
              </div>

              <h2
                id="modal-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-100 tracking-tight leading-snug"
              >
                {point.name}
              </h2>

              <p className="text-sm sm:text-base text-stone-300 font-light mt-3 leading-relaxed">
                {point.shortIntro}
              </p>
            </div>

            {/* Navigation Tabs for Media & Content */}
            <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('story')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'story'
                    ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Câu chuyện di sản</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'gallery'
                    ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Thư viện ảnh ({allImages.length})</span>
              </button>

              {point.videoUrl && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                    activeTab === 'video'
                      ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Video tư liệu</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('visiting')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === 'visiting'
                    ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Thông tin tham quan</span>
              </button>
            </div>

            {/* TAB 1: STORYTELLING */}
            {activeTab === 'story' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Hero Showcase Image */}
                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-stone-800 group">
                  <img
                    src={allImages[selectedImageIndex] || point.coverImage}
                    alt={point.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950/80 hover:bg-stone-900 text-xs text-stone-200 backdrop-blur-md border border-white/10 transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Xem toàn màn hình</span>
                  </button>
                </div>

                {/* Section: Historical Chronicle with Drop Cap */}
                <div className="space-y-4">
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
                <div className="border-b border-stone-800/80" />

                {/* Section: Cultural Significance */}
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                    <span className="font-mono text-sm text-stone-500">02.</span>
                    <span>Giá Trị Văn Hóa & Ý Nghĩa Di Sản</span>
                  </h3>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                    {point.culturalSignificance}
                  </p>
                </div>

                {/* Hairline Divider */}
                <div className="border-b border-stone-800/80" />

                {/* Section: Special Highlights */}
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                    <span className="font-mono text-sm text-stone-500">03.</span>
                    <span>Những Nét Đặc Trưng & Trải Nghiệm Nổi Bật</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {point.specialHighlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
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
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Main Large Display with Carousel controls */}
                <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 flex items-center justify-center">
                  <img
                    src={allImages[selectedImageIndex]}
                    alt={`${point.name} - ảnh ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        aria-label="Ảnh trước"
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-200 border border-white/10 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        aria-label="Ảnh kế tiếp"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-200 border border-white/10 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950/80 text-xs text-stone-200 backdrop-blur-md border border-white/10"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mở rộng</span>
                  </button>
                </div>

                {/* Thumbnails Strip & Quick Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-medium">
                      Danh sách ảnh ({allImages.length}):
                    </span>
                    {onUpdatePoint && (
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-medium border border-stone-700 transition-colors cursor-pointer">
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
                        className={`relative h-20 w-28 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-amber-400 scale-105 shadow-md shadow-amber-950/50'
                            : 'border-transparent opacity-60 hover:opacity-100'
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
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-stone-800 bg-black shadow-xl">
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
                  <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                    <h4 className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                      <Film className="w-4 h-4 text-amber-400" />
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
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
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
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                    <h4 className="text-sm font-serif font-bold text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Kinh nghiệm & Lưu ý khi tham quan</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                      {point.visitingTips}
                    </p>
                  </div>
                )}

                {/* External Maps Simulator Link */}
                <div className="flex justify-end pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${point.name} ${point.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                  >
                    <span>Mở vị trí trên bản đồ lớn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-950" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
            <span>Bản đồ Văn hóa Đông Nam Bộ · Triển lãm số</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Đóng và quay lại bản đồ
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX FOR IMAGES */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Đóng ảnh phóng to"
            className="absolute top-6 right-6 p-3 rounded-full bg-stone-900/80 text-stone-200 hover:text-white border border-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={allImages[selectedImageIndex]}
            alt={point.name}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />

          <div className="mt-4 text-xs font-mono text-stone-400">
            {point.name} · Ảnh {selectedImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}