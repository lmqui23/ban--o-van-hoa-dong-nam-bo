/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { LandingHero } from './components/LandingHero';
import { CulturalMap } from './components/CulturalMap';
import { CulturalGallerySection } from './components/CulturalGallerySection';
import { CulturalDetailModal } from './components/CulturalDetailModal';
import { CulturalCMS } from './components/CulturalCMS';
import { Footer } from './components/Footer';
import { CulturalPoint, ProvinceId, CulturalCategoryId } from './types/cultural';
import { INITIAL_CULTURAL_POINTS } from './data/culturalData';
import { supabase, mapDbToPoint, mapPointToDb } from './lib/supabase';

const BOOKMARKS_KEY = 'dongnambo_bookmarks_v1';

export default function App() {
  const [points, setPoints] = useState<CulturalPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return ['hcm-ben-nha-rong', 'dong-nai-gom-bien-hoa'];
  });

  const [selectedProvince, setSelectedProvince] = useState<ProvinceId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<CulturalCategoryId | 'all'>('all');
  const [activeModalPoint, setActiveModalPoint] = useState<CulturalPoint | null>(null);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Load dữ liệu từ Supabase Database
  useEffect(() => {
    async function fetchPointsFromSupabase() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cultural_points')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setPoints(data.map(mapDbToPoint));
        } else {
          // Nếu Database trống, hiển thị dữ liệu mặc định ban đầu
          setPoints(INITIAL_CULTURAL_POINTS);
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu từ Supabase:', err);
        setPoints(INITIAL_CULTURAL_POINTS);
      } finally {
        setLoading(false);
      }
    }

    fetchPointsFromSupabase();
  }, []);

  // Sync Bookmarks vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {
      // Ignore quota errors
    }
  }, [bookmarks]);

  // Handle URL query parameters (e.g. ?autostart=1, ?province=hcm, ?cms=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || params.get('map') === '1') {
      scrollToSection('map-section');
    }
    const prov = params.get('province');
    if (prov === 'hcm' || prov === 'dong-nai' || prov === 'ba-ria-vung-tau') {
      setSelectedProvince(prov);
      scrollToSection('map-section');
    }
    if (params.get('cms') === '1') {
      setIsCMSOpen(true);
    }
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreMap = (provId?: ProvinceId) => {
    if (provId) {
      setSelectedProvince(provId);
    }
    scrollToSection('map-section');
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // CMS Handlers với Supabase
  const handleAddPoint = async (newPoint: CulturalPoint) => {
    try {
      const dbPayload = mapPointToDb(newPoint);
      const { error } = await supabase.from('cultural_points').insert([dbPayload]);
      if (error) throw error;

      setPoints((prev) => [newPoint, ...prev]);
    } catch (error) {
      console.error('Lỗi khi thêm điểm văn hóa:', error);
      alert('Không thể lưu điểm văn hóa vào CSDL Supabase!');
    }
  };

  const handleUpdatePoint = async (updatedPoint: CulturalPoint) => {
    try {
      const dbPayload = mapPointToDb(updatedPoint);
      const { error } = await supabase
        .from('cultural_points')
        .update(dbPayload)
        .eq('id', updatedPoint.id);

      if (error) throw error;

      setPoints((prev) =>
        prev.map((p) => (p.id === updatedPoint.id ? updatedPoint : p))
      );
      if (activeModalPoint?.id === updatedPoint.id) {
        setActiveModalPoint(updatedPoint);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật điểm văn hóa:', error);
      alert('Không thể cập nhật thông tin trên Supabase!');
    }
  };

  const handleDeletePoint = async (id: string) => {
    try {
      const { error } = await supabase.from('cultural_points').delete().eq('id', id);
      if (error) throw error;

      setPoints((prev) => prev.filter((p) => p.id !== id));
      if (activeModalPoint?.id === id) {
        setActiveModalPoint(null);
      }
    } catch (error) {
      console.error('Lỗi khi xóa điểm văn hóa:', error);
      alert('Không thể xóa dữ liệu khỏi Supabase!');
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Bạn có chắc muốn nạp toàn bộ dữ liệu mặc định lên Supabase?')) return;
    try {
      const records = INITIAL_CULTURAL_POINTS.map(mapPointToDb);
      const { error } = await supabase.from('cultural_points').upsert(records);
      if (error) throw error;

      setPoints(INITIAL_CULTURAL_POINTS);
      alert('Đã khôi phục dữ liệu mặc định thành công!');
    } catch (error) {
      console.error('Lỗi khôi phục mặc định:', error);
      alert('Lỗi khi đồng bộ dữ liệu mặc định lên Supabase!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-amber-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Đang tải dữ liệu văn hóa Nam Bộ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-600/30 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <TopNav
        onNavigate={scrollToSection}
        onOpenCMS={() => setIsCMSOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Experience */}
      <main className="flex-1">
        {/* Section 1: Landing Page / Hero */}
        <LandingHero
          onExploreMap={handleExploreMap}
          totalPointsCount={points.length}
        />

        {/* Section 2: Interactive Geographical Cultural Map */}
        <CulturalMap
          points={points}
          selectedProvince={selectedProvince}
          onSelectProvince={setSelectedProvince}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onExploreMore={setActiveModalPoint}
        />

        {/* Section 3: Exhibition Gallery & Digital Storytelling */}
        <CulturalGallerySection
          points={points}
          onSelectPoint={setActiveModalPoint}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onSelectProvince={(p) => {
          setSelectedProvince(p);
          scrollToSection('map-section');
        }}
      />

      {/* Detail Modal (Section 2.5) */}
      <CulturalDetailModal
        point={activeModalPoint}
        onClose={() => setActiveModalPoint(null)}
        isBookmarked={activeModalPoint ? bookmarks.includes(activeModalPoint.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* CMS Management Modal (Section 3) */}
      <CulturalCMS
        points={points}
        isOpen={isCMSOpen}
        onClose={() => setIsCMSOpen(false)}
        onAddPoint={handleAddPoint}
        onUpdatePoint={handleUpdatePoint}
        onDeletePoint={handleDeletePoint}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}