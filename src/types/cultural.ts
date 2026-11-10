export type ProvinceId = 'hcm' | 'dong-nai' | 'ba-ria-vung-tau';

export type CulturalCategoryId =
  | 'historical'
  | 'architecture'
  | 'craft'
  | 'festival'
  | 'cuisine'
  | 'nature';

export interface CulturalCategory {
  id: CulturalCategoryId;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface ProvinceInfo {
  id: ProvinceId;
  name: string;
  shortName: string;
  vietnameseName: string;
  tagline: string;
  description: string;
  color: string;
  accentColor: string;
  heroImage: string;
  centerCoords: { x: number; y: number };
  svgPath: string;
  viewBox: string;
  facts: {
    label: string;
    value: string;
  }[];
  culturalHighlights: string[];
}

export interface CulturalPoint {
  id: string;
  name: string;
  provinceId: ProvinceId;
  category: CulturalCategoryId;
  address: string;
  coords: {
    x: number; // 0 to 100 percentage inside map
    y: number; // 0 to 100 percentage inside map
    lat?: number;
    lng?: number;
  };
  era?: string;
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string;
  videoTitle?: string;
  shortIntro: string;
  historicalStory: string;
  culturalSignificance: string;
  specialHighlights: string[];
  visitingTips?: string;
  isFeatured?: boolean;
}

export interface FilterState {
  provinceId: ProvinceId | 'all';
  category: CulturalCategoryId | 'all';
  searchQuery: string;
}
