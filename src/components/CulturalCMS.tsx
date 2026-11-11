import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Save,
  Layers,
  Upload,
  Loader2,
} from 'lucide-react';
import { CulturalPoint, ProvinceId, CulturalCategoryId } from '../types/cultural';
import { PROVINCES, CULTURAL_CATEGORIES } from '../data/culturalData';
import { validateCulturalPoint } from '../utils/culturalLogic';
import { uploadImageToSupabase } from '../lib/supabase';

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

/** Tách câu thành từng chữ trồi lên từ sau mặt nạ (nội dung không đổi). */
function Words({ text, start, step = 60 }: { text: string; start: number; step?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="cms-mask">
            <span className="cms-word" style={delay(start + i * step)}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  );
}

interface CulturalCMSProps {
  points: CulturalPoint[];
  isOpen: boolean;
  onClose: () => void;
  onAddPoint: (point: CulturalPoint) => Promise<void> | void;
  onUpdatePoint: (point: CulturalPoint) => Promise<void> | void;
  onDeletePoint: (id: string) => Promise<void> | void;
  onResetDefaults: () => Promise<void> | void;
}

export function CulturalCMS({
  points,
  isOpen,
  onClose,
  onAddPoint,
  onUpdatePoint,
  onDeletePoint,
  onResetDefaults,
}: CulturalCMSProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvince, setFilterProvince] = useState<ProvinceId | 'all'>('all');
  const [editingPoint, setEditingPoint] = useState<Partial<CulturalPoint> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // States hỗ trợ Tải ảnh lên Supabase Storage
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const spotRef = useRef<HTMLDivElement>(null);

  // Đom đóm bay lên phía sau bảng quản trị, giá trị cố định để không nhảy giữa các lần render.
  const embers = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: (i * 37 + 11) % 100,
        size: 2 + ((i * 5) % 4),
        dur: 9 + ((i * 7) % 9),
        del: ((i * 13) % 10) * 0.9,
        dx: (i % 2 ? 1 : -1) * (20 + ((i * 11) % 60)),
        o: 0.3 + ((i * 3) % 5) * 0.08,
      })),
    [],
  );

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredPoints = points.filter((p) => {
    const matchProv = filterProvince === 'all' || p.provinceId === filterProvince;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchProv && matchSearch;
  });

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setErrors([]);
    setEditingPoint({
      id: `custom-${Date.now()}`,
      name: '',
      provinceId: 'hcm',
      category: 'historical',
      address: '',
      coords: { x: 35, y: 50 },
      era: '',
      coverImage: '',
      galleryImages: [],
      videoUrl: '',
      videoTitle: '',
      shortIntro: '',
      historicalStory: '',
      culturalSignificance: '',
      specialHighlights: ['Đặc trưng văn hóa phương Nam'],
      visitingTips: '',
    });
  };

  const handleStartEdit = (p: CulturalPoint) => {
    setIsCreatingNew(false);
    setErrors([]);
    setEditingPoint({ ...p });
  };

  // Upload 1 ảnh chính lên Supabase Storage
  const handleUploadCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPoint) return;

    setUploadingCover(true);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setEditingPoint({ ...editingPoint, coverImage: publicUrl });
      showToast('Đã tải ảnh đại diện lên thành công!');
    } catch (err: any) {
      console.error(err);
      alert('Tải ảnh đại diện thất bại. Vui lòng kiểm tra cấu hình Supabase Storage!');
    } finally {
      setUploadingCover(false);
      e.target.value = '';
    }
  };

  // Upload nhiều ảnh phụ lên Supabase Storage
  const handleUploadGalleryImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingPoint) return;

    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadImageToSupabase(file));
      const newUrls = await Promise.all(uploadPromises);

      const currentGallery = editingPoint.galleryImages || [];
      setEditingPoint({
        ...editingPoint,
        galleryImages: [...currentGallery, ...newUrls],
      });
      showToast(`Đã tải thêm ${newUrls.length} ảnh phụ thành công!`);
    } catch (err: any) {
      console.error(err);
      alert('Tải tập hợp ảnh phụ thất bại. Vui lòng thử lại!');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  // Xóa 1 ảnh phụ khỏi danh sách xem trước
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (!editingPoint || !editingPoint.galleryImages) return;
    const updatedGallery = editingPoint.galleryImages.filter((_, idx) => idx !== indexToRemove);
    setEditingPoint({ ...editingPoint, galleryImages: updatedGallery });
  };

  const handleSave = async () => {
    if (!editingPoint) return;

    const validation = validateCulturalPoint(editingPoint);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSaving(true);
    try {
      if (isCreatingNew) {
        await onAddPoint(editingPoint as CulturalPoint);
        showToast('Đã thêm mới địa điểm di sản thành công!');
      } else {
        await onUpdatePoint(editingPoint as CulturalPoint);
        showToast('Đã cập nhật thông tin địa điểm thành công!');
      }

      setEditingPoint(null);
      setIsCreatingNew(false);
      setErrors([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${name}" khỏi cơ sở dữ liệu?`)) {
      await onDeletePoint(id);
      showToast(`Đã xóa "${name}"!`);
      if (editingPoint?.id === id) {
        setEditingPoint(null);
      }
    }
  };

  const handleReset = async () => {
    if (window.confirm('Khôi phục toàn bộ danh sách di sản về bộ dữ liệu chuẩn ban đầu?')) {
      await onResetDefaults();
      showToast('Đã khôi phục dữ liệu ban đầu!');
      setEditingPoint(null);
    }
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

  return (
    <div
      onMouseMove={handleOverlayMove}
      className="cms-root cms-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto"
    >
      <style>{CSS}</style>

      {/* Đèn rọi vàng đi theo chuột */}
      <div ref={spotRef} aria-hidden="true" className="cms-spot pointer-events-none absolute inset-0" />

      {/* Đom đóm bay lên */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {embers.map((e, i) => (
          <span
            key={i}
            className="cms-ember absolute bottom-0 rounded-full bg-amber-300"
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

      <div className="cms-panel relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Vệt sáng vàng quét qua mép trên khi bảng mở */}
        <span
          aria-hidden="true"
          className="cms-edge absolute top-0 left-0 right-0 h-px z-20 bg-gradient-to-r from-transparent via-amber-300 to-transparent"
          style={delay(500)}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/90 shrink-0">
          <div>
            <div className="cms-wipe flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400" style={delay(250)}>
              <Layers className="cms-twinkle w-3.5 h-3.5" />
              <span>HỆ THỐNG QUẢN LÝ NỘI DUNG (CMS - SUPABASE)</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-100">
              <Words text="Quản Trị Cơ Sở Dữ Liệu Văn Hóa & Đa Phương Tiện" start={350} />
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="cms-pop group/reset flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-stone-300 hover:text-amber-400 bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-400/50 transition-colors"
              style={delay(400)}
              title="Khôi phục dữ liệu mặc định chuẩn"
            >
              <RotateCcw className="w-3.5 h-3.5 transition-transform duration-500 group-hover/reset:-rotate-180" />
              <span className="hidden sm:inline">Khôi phục mặc định</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Đóng bảng quản trị"
              className="cms-pop group/close p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
              style={delay(480)}
            >
              <X className="w-5 h-5 transition-transform duration-300 group-hover/close:rotate-90" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="cms-pop bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs px-6 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {editingPoint ? (
            /* ================= EDIT / CREATE FORM ================= */
            <div className="cms-stagger space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <h3 className="text-lg font-serif font-bold text-amber-300">
                  {isCreatingNew ? 'Thêm Địa Điểm Di Sản Mới' : `Chỉnh Sửa: ${editingPoint.name}`}
                </h3>
                <button
                  onClick={() => setEditingPoint(null)}
                  className="text-xs text-stone-400 hover:text-stone-200"
                >
                  Hủy thao tác
                </button>
              </div>

              {/* Validation Errors */}
              {errors.length > 0 && (
                <div className="cms-alert p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Vui lòng kiểm tra các thông tin sau:</span>
                  </div>
                  <ul className="list-disc list-inside pl-1 space-y-0.5">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Form Grid */}
              <div className="cms-stagger grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-stone-300">Tên địa điểm di sản *</label>
                  <input
                    type="text"
                    value={editingPoint.name || ''}
                    onChange={(e) => setEditingPoint({ ...editingPoint, name: e.target.value })}
                    placeholder="VD: Làng gốm Biên Hòa, Bến Nhà Rồng..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Province */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Tỉnh / Thành phố *</label>
                  <select
                    value={editingPoint.provinceId || 'hcm'}
                    onChange={(e) =>
                      setEditingPoint({ ...editingPoint, provinceId: e.target.value as ProvinceId })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Loại hình văn hóa *</label>
                  <select
                    value={editingPoint.category || 'historical'}
                    onChange={(e) =>
                      setEditingPoint({ ...editingPoint, category: e.target.value as CulturalCategoryId })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  >
                    {CULTURAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Era */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Niên đại / Thời gian hình thành</label>
                  <input
                    type="text"
                    value={editingPoint.era || ''}
                    onChange={(e) => setEditingPoint({ ...editingPoint, era: e.target.value })}
                    placeholder="VD: Thế kỷ XIX, Năm 1863, Triều Nguyễn..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Địa chỉ cụ thể *</label>
                  <input
                    type="text"
                    value={editingPoint.address || ''}
                    onChange={(e) => setEditingPoint({ ...editingPoint, address: e.target.value })}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Coordinates (x, y) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    Tọa độ bản đồ X (%) [0 - 100]
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="95"
                    value={editingPoint.coords?.x ?? 50}
                    onChange={(e) =>
                      setEditingPoint({
                        ...editingPoint,
                        coords: {
                          ...editingPoint.coords!,
                          x: parseFloat(e.target.value) || 50,
                          y: editingPoint.coords?.y ?? 50,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    Tọa độ bản đồ Y (%) [0 - 100]
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="95"
                    value={editingPoint.coords?.y ?? 50}
                    onChange={(e) =>
                      setEditingPoint({
                        ...editingPoint,
                        coords: {
                          ...editingPoint.coords!,
                          y: parseFloat(e.target.value) || 50,
                          x: editingPoint.coords?.x ?? 50,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* 1. COVER IMAGE (Ảnh chính) */}
                <div className="space-y-2 md:col-span-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                  <label className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      1. Ảnh đại diện chính (Cover Image) *
                    </span>
                    <span className="text-[11px] font-normal text-stone-400">
                      Tải tệp trực tiếp hoặc dán URL
                    </span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Tải tệp lên Supabase */}
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors cursor-pointer w-full sm:w-auto shrink-0">
                      {uploadingCover ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{uploadingCover ? 'Đang tải lên Supabase...' : 'Tải tệp ảnh từ máy'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingCover}
                        onChange={handleUploadCoverImage}
                        className="hidden"
                      />
                    </label>

                    {/* Dán URL */}
                    <input
                      type="text"
                      value={editingPoint.coverImage || ''}
                      onChange={(e) => setEditingPoint({ ...editingPoint, coverImage: e.target.value })}
                      placeholder="Hoặc dán URL ảnh trực tiếp..."
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Preview ảnh chính */}
                  {editingPoint.coverImage && (
                    <div className="cms-pop pt-2 flex items-center gap-3">
                      <img
                        src={editingPoint.coverImage}
                        alt="Ảnh đại diện"
                        className="w-20 h-14 object-cover rounded-lg border border-amber-500/30"
                      />
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã chọn ảnh đại diện thành công
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. GALLERY IMAGES (Nhiều ảnh phụ) */}
                <div className="space-y-2 md:col-span-2 bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                  <label className="text-xs font-semibold text-amber-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      2. Bộ sưu tập ảnh phụ (Gallery Images)
                    </span>
                    <span className="text-[11px] font-normal text-stone-400">
                      Có thể chọn nhiều tệp cùng lúc
                    </span>
                  </label>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors cursor-pointer w-full sm:w-auto shrink-0">
                      {uploadingGallery ? (
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{uploadingGallery ? 'Đang tải mảng ảnh...' : 'Chọn nhiều ảnh phụ'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingGallery}
                        onChange={handleUploadGalleryImages}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Danh sách các ảnh phụ đã upload */}
                  {editingPoint.galleryImages && editingPoint.galleryImages.length > 0 && (
                    <div className="pt-3">
                      <p className="text-[11px] text-stone-400 mb-2">
                        Danh sách ảnh phụ ({editingPoint.galleryImages.length} ảnh):
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {editingPoint.galleryImages.map((url, idx) => (
                          <div key={idx} className="cms-pop relative group rounded-lg overflow-hidden border border-stone-800 hover:border-amber-400/50 transition-colors aspect-video" style={delay(Math.min(idx, 8) * 50)}>
                            <img src={url} alt={`Ảnh phụ ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Xóa ảnh này"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Video URL & Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    Đường dẫn video tư liệu (YouTube Embed hoặc MP4)
                  </label>
                  <input
                    type="text"
                    value={editingPoint.videoUrl || ''}
                    onChange={(e) => setEditingPoint({ ...editingPoint, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Tiêu đề video tư liệu</label>
                  <input
                    type="text"
                    value={editingPoint.videoTitle || ''}
                    onChange={(e) => setEditingPoint({ ...editingPoint, videoTitle: e.target.value })}
                    placeholder="VD: Phóng sự di sản văn hóa..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Short Intro */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-stone-300">Giới thiệu ngắn (Preview) *</label>
                  <textarea
                    rows={2}
                    value={editingPoint.shortIntro || ''}
                    onChange={(e) => setEditingPoint({ ...editingPoint, shortIntro: e.target.value })}
                    placeholder="Tóm tắt 1-2 câu ngắn gọn xuất hiện trên popup bản đồ..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Historical Story */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-stone-300">Câu chuyện lịch sử chuyên sâu</label>
                  <textarea
                    rows={3}
                    value={editingPoint.historicalStory || ''}
                    onChange={(e) =>
                      setEditingPoint({ ...editingPoint, historicalStory: e.target.value })
                    }
                    placeholder="Nguồn gốc, quá trình hình thành, nhân vật lịch sử gắn liền..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Cultural Significance */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-stone-300">Giá trị văn hóa & Ý nghĩa di sản</label>
                  <textarea
                    rows={2}
                    value={editingPoint.culturalSignificance || ''}
                    onChange={(e) =>
                      setEditingPoint({ ...editingPoint, culturalSignificance: e.target.value })
                    }
                    placeholder="Ý nghĩa đối với cộng đồng, mỹ thuật, tâm linh..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Visiting Tips (Bổ sung ô nhập kinh nghiệm tham quan) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-stone-300">
                  Kinh nghiệm & Lưu ý khi tham quan (Visiting Tips)
                </label>
                <textarea
                  rows={2}
                  value={editingPoint.visitingTips || ''}
                  onChange={(e) =>
                    setEditingPoint({ ...editingPoint, visitingTips: e.target.value })
                  }
                  placeholder="VD: Mở cửa từ 8h-17h, nên mặc trang phục lịch sự, thời điểm đẹp nhất để chụp ảnh..."
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingPoint(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-300 hover:bg-stone-800 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={isSaving || uploadingCover || uploadingGallery}
                  onClick={handleSave}
                  className="cms-cta relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <span aria-hidden="true" className="cms-sheen absolute inset-y-0 left-0 w-1/4 bg-white/40 blur-md" />
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-stone-950" />}
                  <span className="relative">{isCreatingNew ? 'Thêm vào bản đồ' : 'Lưu cập nhật'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= DATA LIST & TABLE VIEW ================= */
            <div className="cms-stagger space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên địa điểm..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <select
                    value={filterProvince}
                    onChange={(e) => setFilterProvince(e.target.value as ProvinceId | 'all')}
                    className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 text-xs focus:outline-none"
                  >
                    <option value="all">Tất cả tỉnh thành</option>
                    {PROVINCES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleStartCreate}
                    className="cms-cta group/add relative overflow-hidden flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer shadow-sm shadow-amber-950/40"
                  >
                    <span aria-hidden="true" className="cms-sheen absolute inset-y-0 left-0 w-1/4 bg-white/40 blur-md" />
                    <Plus className="relative w-4 h-4 text-stone-950 transition-transform duration-300 group-hover/add:rotate-90" />
                    <span className="relative">Thêm địa điểm mới</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-stone-800 overflow-hidden bg-stone-950/50">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 font-mono uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-4">Ảnh & Tên địa điểm</th>
                      <th className="py-3 px-4">Tỉnh / Thành</th>
                      <th className="py-3 px-4">Loại hình</th>
                      <th className="py-3 px-4">Tọa độ (%)</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredPoints.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-stone-500">
                          Không tìm thấy địa điểm văn hóa nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredPoints.map((p, rowIndex) => {
                        const prov = PROVINCES.find((pr) => pr.id === p.provinceId);
                        const cat = CULTURAL_CATEGORIES.find((c) => c.id === p.category);

                        return (
                          <tr key={p.id} className="cms-row group hover:bg-stone-900/50 transition-colors" style={delay(Math.min(rowIndex, 10) * 50)}>
                            <td className="py-3 px-4 flex items-center gap-3">
                              <img
                                src={p.coverImage}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover border border-stone-800 group-hover:border-amber-400/50 group-hover:scale-110 transition-all duration-300 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="font-semibold text-stone-100">{p.name}</div>
                                <div className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">
                                  {p.address}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium text-stone-200">
                              {prov?.shortName || p.provinceId}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className="px-2 py-0.5 rounded text-[11px] font-medium"
                                style={{
                                  backgroundColor: `${cat?.color || '#f59e0b'}20`,
                                  color: cat?.color || '#f59e0b',
                                }}
                              >
                                {cat?.shortLabel || p.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                              X: {p.coords.x} · Y: {p.coords.y}
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => handleStartEdit(p)}
                                aria-label={`Sửa ${p.name}`}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-300 hover:bg-stone-800 hover:scale-110 active:scale-95 transition-all inline-flex"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id, p.name)}
                                aria-label={`Xóa ${p.name}`}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 hover:scale-110 active:scale-95 transition-all inline-flex"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* CSS: trạng thái ẩn + animation nằm trong media query no-preference, */
/* nên người dùng bật "giảm chuyển động" vẫn thấy đủ nội dung.         */
/* Dùng fill-mode `backwards` để sau khi chạy xong phần tử trở về      */
/* style gốc, không đè lên các hiệu ứng hover của Tailwind.            */
/* ------------------------------------------------------------------ */

// Mỗi phần tử con trực tiếp của .cms-stagger hiện lần lượt, cách nhau 60ms.
const STAGGER = Array.from(
  { length: 18 },
  (_, i) => `:where(.cms-root .cms-stagger) > :nth-child(${i + 1}) { --d: ${100 + i * 60}ms; }`,
).join('\n');

const CSS = `
.cms-root .cms-spot {
  background: radial-gradient(420px circle at var(--px, 50%) var(--py, 30%), rgba(251, 191, 36, 0.10), transparent 65%);
  mix-blend-mode: screen;
  opacity: 0;
}
.cms-root .cms-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding-top: 0.2em; margin-top: -0.2em;
  padding-bottom: 0.14em; margin-bottom: -0.14em;
}
.cms-root .cms-word { display: inline-block; transform-origin: 0 100%; }
.cms-root .cms-edge { opacity: 0; }
.cms-root .cms-ember, .cms-root .cms-sheen { display: none; }

/* Ô nhập liệu: viền vàng + quầng sáng nhẹ khi focus */
.cms-root input:focus, .cms-root textarea:focus, .cms-root select:focus {
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.14);
}

${STAGGER}

@media (prefers-reduced-motion: no-preference) {
  .cms-root .cms-spot { opacity: 1; transition: opacity 1.2s ease 0.8s; }
  .cms-root .cms-ember, .cms-root .cms-sheen { display: block; }
  .cms-root input, .cms-root textarea, .cms-root select { transition: border-color 0.2s, box-shadow 0.25s; }

  /* ---- Mở bảng quản trị ---- */
  .cms-root.cms-overlay { animation: cms-fade 0.35s ease backwards; }
  .cms-root .cms-panel  { animation: cms-panel 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
  .cms-root .cms-edge   { animation: cms-edge 1.4s ease-out var(--d, 0ms) backwards; }
  .cms-root .cms-wipe   { animation: cms-wipe 0.9s cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) backwards; }
  .cms-root .cms-word   { animation: cms-word-up 1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .cms-root .cms-pop    { animation: cms-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) backwards; }
  .cms-root .cms-row    { animation: cms-row 0.6s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }
  .cms-root .cms-alert  { animation: cms-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards, cms-shake 0.5s ease 0.5s; }
  :where(.cms-root .cms-stagger) > * { animation: cms-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) backwards; }

  /* ---- Hiệu ứng lặp nhẹ ---- */
  .cms-root .cms-cta     { animation: cms-ring 2.8s ease-out 2s infinite; }
  .cms-root .cms-sheen   { transform: translateX(-120%) skewX(-20deg); animation: cms-sheen 4.5s ease-in-out 1.5s infinite; }
  .cms-root .cms-twinkle { animation: cms-twinkle 2.6s ease-in-out infinite; }
  .cms-root .cms-ember   { opacity: 0; animation-name: cms-ember; animation-timing-function: linear; animation-iteration-count: infinite; }
}

/* Giảm chuyển động: hiện đủ nội dung, không animation */
@media (prefers-reduced-motion: reduce) {
  .cms-root .cms-edge { display: none; }
}

@keyframes cms-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes cms-panel { from { opacity: 0; transform: translateY(32px) scale(0.94); filter: blur(10px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes cms-edge { 0% { opacity: 0; transform: scaleX(0); } 40% { opacity: 1; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(1); } }
@keyframes cms-wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes cms-word-up { from { opacity: 0; transform: translateY(115%) rotate(5deg); } to { opacity: 1; transform: none; } }
@keyframes cms-rise { from { opacity: 0; transform: translateY(16px); filter: blur(6px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes cms-row { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes cms-pop { 0% { opacity: 0; transform: scale(0.8) translateY(12px); } 100% { opacity: 1; transform: none; } }
@keyframes cms-shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(2px); } }
@keyframes cms-sheen { 0%, 55% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(560%) skewX(-20deg); } }
@keyframes cms-ring { 0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); } 70%, 100% { box-shadow: 0 0 0 12px rgba(251, 191, 36, 0); } }
@keyframes cms-twinkle { 0%, 100% { transform: scale(1) rotate(0); opacity: 1; } 50% { transform: scale(1.3) rotate(20deg); opacity: 0.75; } }
@keyframes cms-ember {
  0% { transform: translate3d(0, 0, 0) scale(0.6); opacity: 0; }
  12% { opacity: var(--o, 0.5); }
  100% { transform: translate3d(var(--dx, 0px), -100vh, 0) scale(1.1); opacity: 0; }
}
`;