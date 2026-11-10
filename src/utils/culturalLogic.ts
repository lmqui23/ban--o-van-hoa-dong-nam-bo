import { CulturalPoint, FilterState, ProvinceId, CulturalCategoryId } from '../types/cultural';

export function filterCulturalPoints(
  points: CulturalPoint[],
  filters: FilterState
): CulturalPoint[] {
  return points.filter((point) => {
    // Province filter
    if (filters.provinceId !== 'all' && point.provinceId !== filters.provinceId) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && point.category !== filters.category) {
      return false;
    }

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = point.name.toLowerCase().includes(q);
      const matchIntro = point.shortIntro.toLowerCase().includes(q);
      const matchAddress = point.address.toLowerCase().includes(q);
      const matchSignificance = point.culturalSignificance.toLowerCase().includes(q);
      const matchEra = point.era ? point.era.toLowerCase().includes(q) : false;
      return matchName || matchIntro || matchAddress || matchSignificance || matchEra;
    }

    return true;
  });
}

export function validateCulturalPoint(point: Partial<CulturalPoint>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!point.name || point.name.trim().length < 2) {
    errors.push('Tên địa điểm phải có ít nhất 2 ký tự');
  }

  if (!point.provinceId || !['hcm', 'dong-nai', 'ba-ria-vung-tau'].includes(point.provinceId)) {
    errors.push('Tỉnh/Thành phố không hợp lệ');
  }

  if (!point.category) {
    errors.push('Vui lòng chọn loại hình văn hóa');
  }

  if (!point.shortIntro || point.shortIntro.trim().length < 10) {
    errors.push('Giới thiệu ngắn phải có ít nhất 10 ký tự');
  }

  if (!point.coords || typeof point.coords.x !== 'number' || typeof point.coords.y !== 'number') {
    errors.push('Tọa độ x và y trên bản đồ là bắt buộc');
  } else {
    if (point.coords.x < 0 || point.coords.x > 100 || point.coords.y < 0 || point.coords.y > 100) {
      errors.push('Tọa độ phải nằm trong khoảng 0 đến 100%');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function computeStats(points: CulturalPoint[]) {
  const total = points.length;
  const byProvince: Record<ProvinceId, number> = {
    hcm: 0,
    'dong-nai': 0,
    'ba-ria-vung-tau': 0,
  };
  const byCategory: Record<CulturalCategoryId, number> = {
    historical: 0,
    architecture: 0,
    craft: 0,
    festival: 0,
    cuisine: 0,
    nature: 0,
  };

  points.forEach((p) => {
    if (byProvince[p.provinceId] !== undefined) {
      byProvince[p.provinceId]++;
    }
    if (byCategory[p.category] !== undefined) {
      byCategory[p.category]++;
    }
  });

  return {
    total,
    byProvince,
    byCategory,
  };
}

export function clampCoords(val: number, min = 5, max = 95): number {
  return Math.max(min, Math.min(max, val));
}
