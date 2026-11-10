import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Compass, Database } from 'lucide-react';
import { ambientSound } from '../utils/ambientAudio';

interface TopNavProps {
  onNavigate: (sectionId: string) => void;
  onOpenCMS: () => void;
  activeSection: string;
}

export function TopNav({ onNavigate, onOpenCMS, activeSection }: TopNavProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const playing = ambientSound.toggle();
    setIsAudioPlaying(playing);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 py-3 shadow-xl shadow-black/40'
          : 'bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <button
          onClick={() => onNavigate('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-amber-200 group-hover:text-amber-100 transition-colors whitespace-nowrap shrink-0">
            Đông Nam Bộ Di Sản
          </span>
        </button>

        {/* Zone 2: Concise nav links with hover underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={() => onNavigate('hero')}
            className={`whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors py-1 relative ${
              activeSection === 'hero' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Tổng quan
            {activeSection === 'hero' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => onNavigate('map-section')}
            className={`whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors py-1 relative ${
              activeSection === 'map-section' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Bản đồ tương tác
            {activeSection === 'map-section' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => onNavigate('provinces-section')}
            className={`whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors py-1 relative ${
              activeSection === 'provinces-section' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Địa danh trọng điểm
            {activeSection === 'provinces-section' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => onNavigate('gallery-section')}
            className={`whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors py-1 relative ${
              activeSection === 'gallery-section' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Triển lãm văn hóa
            {activeSection === 'gallery-section' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action + Ambient Audio */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            title={isAudioPlaying ? 'Tắt âm thanh mộc phương Nam' : 'Bật âm thanh mộc phương Nam (Đờn ca tài tử ngũ âm)'}
            aria-label="Bật/Tắt âm thanh nền văn hóa"
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
              isAudioPlaying
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-900/30'
                : 'bg-stone-900/80 border-stone-700/60 text-stone-400 hover:text-stone-200 hover:border-stone-600'
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline text-xs font-mono">
              {isAudioPlaying ? 'Âm vang' : 'Âm thanh'}
            </span>
          </button>

          <button
            onClick={onOpenCMS}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-200 bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/70 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Quản lý và cập nhật cơ sở dữ liệu di sản"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Quản lý CMS</span>
          </button>

          <button
            onClick={() => onNavigate('map-section')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Compass className="w-4 h-4 text-stone-950" />
            <span>Khám phá bản đồ</span>
          </button>
        </div>
      </div>
    </header>
  );
}
