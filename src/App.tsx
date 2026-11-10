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

const STORAGE_KEY = 'dongnambo_cultural_points_v1';
const BOOKMARKS_KEY = 'dongnambo_bookmarks_v1';

export default function App() {
  const [points, setPoints] = useState<CulturalPoint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_CULTURAL_POINTS;
  });

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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(points));
    } catch {
      // Ignore quota errors
    }
  }, [points]);

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

  // CMS Handlers
  const handleAddPoint = (newPoint: CulturalPoint) => {
    setPoints((prev) => [newPoint, ...prev]);
  };

  const handleUpdatePoint = (updatedPoint: CulturalPoint) => {
    setPoints((prev) =>
      prev.map((p) => (p.id === updatedPoint.id ? updatedPoint : p))
    );
    if (activeModalPoint?.id === updatedPoint.id) {
      setActiveModalPoint(updatedPoint);
    }
  };

  const handleDeletePoint = (id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
    if (activeModalPoint?.id === id) {
      setActiveModalPoint(null);
    }
  };

  const handleResetDefaults = () => {
    setPoints(INITIAL_CULTURAL_POINTS);
    localStorage.removeItem(STORAGE_KEY);
  };

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
