import test from 'node:test';
import assert from 'node:assert/strict';
import { filterCulturalPoints, validateCulturalPoint, computeStats, clampCoords } from './culturalLogic';
import { CulturalPoint } from '../types/cultural';

const samplePoints: CulturalPoint[] = [
  {
    id: 'test-1',
    name: 'Bến Nhà Rồng',
    provinceId: 'hcm',
    category: 'historical',
    address: 'Số 01 Nguyễn Tất Thành, Q.4, TP.HCM',
    coords: { x: 38, y: 55 },
    coverImage: '/sample.jpg',
    galleryImages: [],
    shortIntro: 'Nơi Bác Hồ ra đi tìm đường cứu nước năm 1911.',
    historicalStory: 'Được xây dựng năm 1863...',
    culturalSignificance: 'Di tích lịch sử quan trọng...',
    specialHighlights: ['Kiến trúc Pháp cổ'],
  },
  {
    id: 'test-2',
    name: 'Làng gốm Biên Hòa',
    provinceId: 'dong-nai',
    category: 'craft',
    address: 'P. Bửu Long, TP. Biên Hòa, Đồng Nai',
    coords: { x: 55, y: 35 },
    coverImage: '/sample2.jpg',
    galleryImages: [],
    shortIntro: 'Nghề gốm men xanh đồng trổ bông nổi tiếng từ thế kỷ XIX.',
    historicalStory: 'Trường Mỹ nghệ Biên Hòa thành lập 1903...',
    culturalSignificance: 'Di sản làng nghề truyền thống...',
    specialHighlights: ['Men đồng trổ bông'],
  },
  {
    id: 'test-3',
    name: 'Lễ hội Nghinh Ông Thắng Tam',
    provinceId: 'ba-ria-vung-tau',
    category: 'festival',
    address: 'Đình Thắng Tam, TP. Vũng Tàu',
    coords: { x: 70, y: 80 },
    coverImage: '/sample3.jpg',
    galleryImages: [],
    shortIntro: 'Lễ hội cầu ngư truyền thống của ngư dân miền biển phương Nam.',
    historicalStory: 'Lễ hội có từ thời vua Gia Long...',
    culturalSignificance: 'Tín ngưỡng dân gian thờ cúng cá Ông...',
    specialHighlights: ['Rước kiệu Nghinh Ông trên biển'],
  },
];

test('filterCulturalPoints filters correctly by province', () => {
  const result = filterCulturalPoints(samplePoints, {
    provinceId: 'hcm',
    category: 'all',
    searchQuery: '',
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'test-1');
});

test('filterCulturalPoints filters correctly by category', () => {
  const result = filterCulturalPoints(samplePoints, {
    provinceId: 'all',
    category: 'craft',
    searchQuery: '',
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'test-2');
});

test('filterCulturalPoints searches across name, intro and address', () => {
  const result = filterCulturalPoints(samplePoints, {
    provinceId: 'all',
    category: 'all',
    searchQuery: 'Biên Hòa',
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'test-2');
});

test('validateCulturalPoint checks required fields', () => {
  const invalidPoint: Partial<CulturalPoint> = {
    name: '',
    shortIntro: 'ngắn',
  };
  const validation = validateCulturalPoint(invalidPoint);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.length > 0);

  const validPoint: Partial<CulturalPoint> = {
    name: 'Địa đạo Củ Chi',
    provinceId: 'hcm',
    category: 'historical',
    shortIntro: 'Hệ thống phòng thủ ngầm trong lòng đất anh hùng.',
    coords: { x: 30, y: 40 },
  };
  const validCheck = validateCulturalPoint(validPoint);
  assert.equal(validCheck.valid, true);
});

test('computeStats aggregates totals correctly', () => {
  const stats = computeStats(samplePoints);
  assert.equal(stats.total, 3);
  assert.equal(stats.byProvince.hcm, 1);
  assert.equal(stats.byProvince['dong-nai'], 1);
  assert.equal(stats.byProvince['ba-ria-vung-tau'], 1);
  assert.equal(stats.byCategory.historical, 1);
  assert.equal(stats.byCategory.craft, 1);
  assert.equal(stats.byCategory.festival, 1);
});

test('clampCoords restricts within minimum and maximum boundaries', () => {
  assert.equal(clampCoords(-10, 5, 95), 5);
  assert.equal(clampCoords(105, 5, 95), 95);
  assert.equal(clampCoords(50, 5, 95), 50);
});
