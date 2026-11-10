import { createClient } from '@supabase/supabase-js';
import { CulturalPoint } from '../types/cultural';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Tải một file ảnh lên Supabase Storage (bucket 'cultural_images')
 */
export async function uploadImageToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `points/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('cultural_images')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('cultural_images').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Chuyển dữ liệu từ kiểu camelCase của ứng dụng sang snake_case của Supabase
 */
export function mapPointToDb(point: CulturalPoint) {
  return {
    id: point.id,
    name: point.name,
    province_id: point.provinceId,
    category: point.category,
    address: point.address,
    coords: point.coords,
    era: point.era || null,
    cover_image: point.coverImage,
    gallery_images: point.galleryImages || [],
    video_url: point.videoUrl || null,
    video_title: point.videoTitle || null,
    short_intro: point.shortIntro,
    historical_story: point.historicalStory,
    cultural_significance: point.culturalSignificance,
    special_highlights: point.specialHighlights || [],
    visiting_tips: point.visitingTips || null,
    is_featured: point.isFeatured || false,
  };
}

/**
 * Chuyển dữ liệu từ snake_case của Supabase sang camelCase cho ứng dụng
 */
export function mapDbToPoint(dbRow: any): CulturalPoint {
  return {
    id: dbRow.id,
    name: dbRow.name,
    provinceId: dbRow.province_id,
    category: dbRow.category,
    address: dbRow.address,
    coords: dbRow.coords,
    era: dbRow.era,
    coverImage: dbRow.cover_image,
    galleryImages: dbRow.gallery_images || [],
    videoUrl: dbRow.video_url,
    videoTitle: dbRow.video_title,
    shortIntro: dbRow.short_intro,
    historicalStory: dbRow.historical_story,
    culturalSignificance: dbRow.cultural_significance,
    specialHighlights: dbRow.special_highlights || [],
    visitingTips: dbRow.visiting_tips,
    isFeatured: dbRow.is_featured,
  };
}