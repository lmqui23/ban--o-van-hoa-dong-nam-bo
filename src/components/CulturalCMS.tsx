import { useState } from 'react';
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
  Film,
  MapPin,
  Save,
  Layers,
} from 'lucide-react';
import { CulturalPoint, ProvinceId, CulturalCategoryId } from '../types/cultural';
import { PROVINCES, CULTURAL_CATEGORIES } from '../data/culturalData';
import { validateCulturalPoint } from '../utils/culturalLogic';

interface CulturalCMSProps {
  points: CulturalPoint[];
  isOpen: boolean;
  onClose: () => void;
  onAddPoint: (point: CulturalPoint) => void;
  onUpdatePoint: (point: CulturalPoint) => void;
  onDeletePoint: (id: string) => void;
  onResetDefaults: () => void;
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
      coverImage: '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
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

  const handleSave = () => {
    if (!editingPoint) return;

    const validation = validateCulturalPoint(editingPoint);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (isCreatingNew) {
      onAddPoint(editingPoint as CulturalPoint);
      showToast('Đã thêm mới địa điểm di sản thành công!');
    } else {
      onUpdatePoint(editingPoint as CulturalPoint);
      showToast('Đã cập nhật thông tin địa điểm thành công!');
    }

    setEditingPoint(null);
    setIsCreatingNew(false);
    setErrors([]);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${name}" khỏi cơ sở dữ liệu?`)) {
      onDeletePoint(id);
      showToast(`Đã xóa "${name}"!`);
      if (editingPoint?.id === id) {
        setEditingPoint(null);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Khôi phục toàn bộ danh sách di sản về bộ dữ liệu chuẩn ban đầu?')) {
      onResetDefaults();
      showToast('Đã khôi phục dữ liệu ban đầu!');
      setEditingPoint(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/90 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Layers className="w-3.5 h-3.5" />
              <span>HỆ THỐNG QUẢN LÝ NỘI DUNG (CMS)</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-100">
              Quản Trị Cơ Sở Dữ Liệu Văn Hóa & Đa Phương Tiện
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-stone-300 hover:text-amber-400 bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 transition-colors"
              title="Khôi phục dữ liệu mặc định chuẩn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khôi phục mặc định</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Đóng bảng quản trị"
              className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs px-6 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {editingPoint ? (
            /* ================= EDIT / CREATE FORM ================= */
            <div className="space-y-6">
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
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs space-y-1">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Coordinates (x, y on Map in percentage) */}
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

                {/* Cover Image URL */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
                    <span>Đường dẫn ảnh đại diện (Cover Image URL) *</span>
                    <span className="text-[11px] font-normal text-stone-400">
                      Có thể dùng ảnh có sẵn trong hệ thống
                    </span>
                  </label>
                  <input
                    type="text"
                    value={editingPoint.coverImage || ''}
                    onChange={(e) => setEditingPoint({ ...editingPoint, coverImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                  {/* Quick Preset Buttons for High-Res Photos */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-stone-500 font-mono">Ảnh mẫu:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPoint({
                          ...editingPoint,
                          coverImage: '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
                        })
                      }
                      className="text-[11px] px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                    >
                      Bến Nhà Rồng / Sài Gòn
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPoint({
                          ...editingPoint,
                          coverImage: '/src/assets/images/dong_nai_ceramic_craft_1794323909184.jpg',
                        })
                      }
                      className="text-[11px] px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                    >
                      Làng gốm Đồng Nai
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPoint({
                          ...editingPoint,
                          coverImage: '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
                        })
                      }
                      className="text-[11px] px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                    >
                      Lễ hội Nghinh Ông Vũng Tàu
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPoint({
                          ...editingPoint,
                          coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
                        })
                      }
                      className="text-[11px] px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                    >
                      Đại ngàn Cát Tiên
                    </button>
                  </div>
                </div>

                {/* Video URL & Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    Đường dẫn video tư liệu (YouTube Embed hoặc file MP4)
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

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingPoint(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-300 hover:bg-stone-800 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-950/40 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-stone-950" />
                  <span>{isCreatingNew ? 'Thêm vào bản đồ' : 'Lưu cập nhật'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= DATA LIST & TABLE VIEW ================= */
            <div className="space-y-4">
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
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-amber-950/40"
                  >
                    <Plus className="w-4 h-4 text-stone-950" />
                    <span>Thêm địa điểm mới</span>
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
                      filteredPoints.map((p) => {
                        const prov = PROVINCES.find((pr) => pr.id === p.provinceId);
                        const cat = CULTURAL_CATEGORIES.find((c) => c.id === p.category);

                        return (
                          <tr key={p.id} className="hover:bg-stone-900/50 transition-colors">
                            <td className="py-3 px-4 flex items-center gap-3">
                              <img
                                src={p.coverImage}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover border border-stone-800 shrink-0"
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
                                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition-colors inline-flex"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id, p.name)}
                                aria-label={`Xóa ${p.name}`}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors inline-flex"
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
