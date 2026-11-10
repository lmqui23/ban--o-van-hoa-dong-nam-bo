import { ProvinceInfo, CulturalCategory, CulturalPoint } from '../types/cultural';

export const CULTURAL_CATEGORIES: CulturalCategory[] = [
  {
    id: 'historical',
    label: 'Di tích Lịch sử',
    shortLabel: 'Lịch sử',
    icon: 'Landmark',
    color: '#ef4444', // Red-500
    bgColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    borderColor: '#ef4444',
  },
  {
    id: 'architecture',
    label: 'Kiến trúc & Di sản',
    shortLabel: 'Kiến trúc',
    icon: 'Building2',
    color: '#f59e0b', // Amber-500
    bgColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    borderColor: '#f59e0b',
  },
  {
    id: 'craft',
    label: 'Làng nghề Truyền thống',
    shortLabel: 'Làng nghề',
    icon: 'Hammer',
    color: '#10b981', // Emerald-500
    bgColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderColor: '#10b981',
  },
  {
    id: 'festival',
    label: 'Lễ hội & Tín ngưỡng',
    shortLabel: 'Lễ hội',
    icon: 'Sparkles',
    color: '#a855f7', // Purple-500
    bgColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    borderColor: '#a855f7',
  },
  {
    id: 'cuisine',
    label: 'Văn hóa Ẩm thực',
    shortLabel: 'Ẩm thực',
    icon: 'Utensils',
    color: '#f97316', // Orange-500
    bgColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    borderColor: '#f97316',
  },
  {
    id: 'nature',
    label: 'Sinh thái & Cảnh quan',
    shortLabel: 'Sinh thái',
    icon: 'Trees',
    color: '#06b6d4', // Cyan-500
    bgColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    borderColor: '#06b6d4',
  },
];

// CẬP NHẬT 3 ĐƠN VỊ HÀNH CHÍNH THEO SÁP NHẬP ĐỊA GIỚI MỚI
export const PROVINCES: ProvinceInfo[] = [
  {
    id: 'dong-nai',
    name: 'Đồng Nai',
    shortName: 'Đồng Nai',
    vietnameseName: 'Tỉnh Đồng Nai (Bình Phước + Đồng Nai)',
    tagline: 'Cái nôi văn hóa Đông Nam Bộ & Tinh hoa gốm men Trấn Biên',
    description:
      'Đồng Nai mới kết hợp địa giới Bình Phước và Đồng Nai, lưu giữ dấu tích văn hóa cổ xưa nhất vùng Đông Nam Bộ từ di tích tiền sử Hàng Gòn, Văn Miếu Trấn Biên, làng gốm Biên Hòa đến rừng nguyên sinh Nam Cát Tiên bạt ngàn.',
    color: '#10b981', // Forest Emerald
    accentColor: '#34d399',
    heroImage: '/src/assets/images/dong_nai_ceramic_craft_1794323909184.jpg',
    centerCoords: { x: 58, y: 36 },
    viewBox: '230 180 320 280',
    svgPath:
      'M 255 210 C 290 190 350 180 400 200 C 450 220 510 240 530 280 C 545 310 520 350 500 380 C 475 410 440 430 400 440 C 360 450 330 430 300 420 C 270 410 250 370 240 330 C 235 285 240 240 255 210 Z',
    facts: [
      { label: 'Địa giới sáp nhập', value: 'Bình Phước + Đồng Nai' },
      { label: 'Di tích khảo cổ', value: 'Mộ Cự thạch Hàng Gòn 2.000 năm tuổi' },
      { label: 'Làng nghề nổi bật', value: 'Gốm Biên Hòa men xanh đồng trổ bông' },
    ],
    culturalHighlights: [
      'Gốm mỹ nghệ Biên Hòa men xanh đồng trổ bông',
      'Chiến khu Đ và căn cứ Trung ương Cục Miền Nam',
      'Văn Miếu Trấn Biên - biểu trưng hiếu học phương Nam',
      'Vườn Quốc gia Cát Tiên - Khu Dự trữ Sinh quyển Thế giới',
    ],
  },
  {
    id: 'hcm',
    name: 'Hồ Chí Minh',
    shortName: 'TP. Hồ Chí Minh',
    vietnameseName: 'Thành phố Hồ Chí Minh (Bình Dương + TP.HCM + Bà Rịa – Vũng Tàu)',
    tagline: 'Đô thị di sản biển sông & Giao lộ hội tụ tinh hoa phương Nam',
    description:
      'TP. Hồ Chí Minh mở rộng hợp nhất Bình Dương, TP.HCM và Bà Rịa – Vũng Tàu, trở thành đại đô thị hội tụ di sản sông nước Sài Gòn, phố cổ Chợ Lớn, làng nghề gốm gạch Bình Dương cùng văn hóa biển đảo Thắng Tam Vũng Tàu.',
    color: '#f59e0b', // Warm Gold
    accentColor: '#fbbf24',
    heroImage: '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    centerCoords: { x: 45, y: 60 },
    viewBox: '120 280 460 320',
    svgPath:
      'M 160 300 C 180 290 220 285 240 310 C 260 330 250 360 270 380 C 285 395 300 400 310 430 C 315 455 300 480 280 495 C 255 510 230 490 210 475 C 190 460 170 470 150 450 C 130 430 140 400 135 370 C 130 340 145 310 160 300 Z',
    facts: [
      { label: 'Địa giới sáp nhập', value: 'Bình Dương + TP.HCM + Bà Rịa – Vũng Tàu' },
      { label: 'Di tích xếp hạng', value: 'Hơn 250 di tích lịch sử - văn hóa & biển đảo' },
      { label: 'Di sản phi vật thể', value: 'Lễ hội Nghinh Ông Thắng Tam, Đờn ca tài tử' },
    ],
    culturalHighlights: [
      'Bến Nhà Rồng & Sông Sài Gòn hào hùng',
      'Khu di tích lịch sử Địa đạo Củ Chi đất thép thành đồng',
      'Lễ hội Nghinh Ông Thắng Tam Vũng Tàu rực rỡ sắc cờ',
      'Di tích Bạch Dinh ngắm trọn biển trời Vũng Tàu',
      'Khu phố cổ Chợ Lớn đậm đà phong vị người Hoa',
    ],
  },
  {
    id: 'tay-ninh',
    name: 'Tây Ninh',
    shortName: 'Tây Ninh',
    vietnameseName: 'Tỉnh Tây Ninh (Long An + Tây Ninh)',
    tagline: 'Vùng đất di sản biên giới, núi thiêng & sông Vàm Cỏ Đông',
    description:
      'Tây Ninh mới hợp nhất Long An và Tây Ninh, trải dài từ dãy Núi Bà Đen nóc nhà Nam Bộ, Tòa Thánh Tây Ninh độc đáo đến dòng sông Vàm Cỏ Đông thơ mộng và các làng nghề bánh tráng, ngó khoai nức tiếng.',
    color: '#06b6d4', // Ocean Cyan
    accentColor: '#22d3ee',
    heroImage: '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
    centerCoords: { x: 28, y: 38 },
    viewBox: '100 160 220 280',
    svgPath:
      'M 110 180 C 140 160 190 150 230 170 C 260 190 270 230 250 270 C 230 300 200 330 170 340 C 140 350 120 320 110 290 Z',
    facts: [
      { label: 'Địa giới sáp nhập', value: 'Long An + Tây Ninh' },
      { label: 'Danh thắng tâm linh', value: 'Quần thể Núi Bà Đen cao nhất Nam Bộ' },
      { label: 'Di sản độc đáo', value: 'Tòa Thánh Tây Ninh & Nghề làm bánh tráng phơi sương' },
    ],
    culturalHighlights: [
      'Nóc nhà Nam Bộ - Núi Bà Đen linh thiêng',
      'Tòa Thánh Tây Ninh - Kiến trúc Đạo Cao Đài độc nhất',
      'Sông Vàm Cỏ Đông huyền thoại đậm dấu ấn lịch sử',
      'Làng nghề Bánh tráng phơi sương Trảng Bàng',
    ],
  },
];

export const INITIAL_CULTURAL_POINTS: CulturalPoint[] = [
  // ================= TP. HỒ CHÍ MINH (Bình Dương + TP.HCM + BR-VT) =================
  {
    id: 'hcm-ben-nha-rong',
    name: 'Bến Nhà Rồng – Bảo tàng Hồ Chí Minh',
    provinceId: 'hcm',
    category: 'historical',
    address: 'Số 01 Nguyễn Tất Thành, Phường 12, Quận 4, TP. Hồ Chí Minh',
    coords: { x: 33, y: 56, lat: 10.7681, lng: 106.7067 },
    era: 'Khởi dựng 1863 thời Pháp thuộc',
    coverImage: '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    galleryImages: [
      '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    videoUrl: 'https://www.youtube.com/embed/8w5g67gXwR0',
    videoTitle: 'Hành trình di sản Bến Nhà Rồng bên dòng sông Sài Gòn',
    shortIntro:
      'Nơi người thanh niên yêu nước Nguyễn Tất Thành ra đi tìm đường cứu nước ngày 5/6/1911, mang kiến trúc giao thoa Đông - Tây độc đáo với đôi rồng chầu mặt trăng trên đỉnh mái ngói.',
    historicalStory:
      'Được hãng vận tải đường biển Pháp Messageries Impériales xây dựng vào năm 1863 làm trụ sở thương cảng Sài Gòn, tòa nhà mang phong cách kiến trúc Pháp cổ kết hợp tinh tế họa tiết rồng gốm truyền thống phương Đông trên nóc mái ngói đỏ. Ngày 5 tháng 6 năm 1911, người thanh niên Nguyễn Tất Thành khi ấy mới 21 tuổi đã bước chân lên con tàu Amiral Latouche-Tréville rời bến cảng, mở ra bước ngoặt vĩ đại cho lịch sử giải phóng dân tộc Việt Nam.',
    culturalSignificance:
      'Bến Nhà Rồng vừa là một chứng tích lịch sử tiêu biểu của phong trào giải phóng dân tộc, vừa là biểu tượng di sản văn hóa sông nước của Sài Gòn - TP.HCM. Tòa nhà lưu giữ hơn 20.000 tư liệu, hiện vật quý giá về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh.',
    specialHighlights: [
      'Kiến trúc mái ngói Lưỡng Long Triều Nguyệt độc đáo thời Pháp thuộc',
      'Phòng trưng bày chuyên đề hành trình 30 năm bôn ba cứu nước',
      'Không gian ngắm bình minh và hoàng hôn lộng gió trên ngã ba sông Sài Gòn',
      'Khu vườn tượng và bảo tàng lưu niệm với hàng ngàn hiện vật gốc',
    ],
    visitingTips: 'Mở cửa từ 7:30 đến 17:00 các ngày trong tuần. Thời điểm lý tưởng để tham quan là buổi chiều tà.',
    isFeatured: true,
  },
  {
    id: 'hcm-vung-tau-nghinh-ong',
    name: 'Lễ hội Nghinh Ông Thắng Tam Vũng Tàu',
    provinceId: 'hcm',
    category: 'festival',
    address: 'Khu di tích Đình Thắng Tam, Đường Hoàng Hoa Thám, TP. Vũng Tàu',
    coords: { x: 74, y: 76, lat: 10.3456, lng: 107.0831 },
    era: 'Hình thành từ thời vua Gia Long (đầu thế kỷ XIX)',
    coverImage: '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
    galleryImages: [
      '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    videoUrl: 'https://www.youtube.com/embed/PjEwFmD-d98',
    videoTitle: 'Lễ hội Nghinh Ông Vũng Tàu - Di sản văn hóa phi vật thể Quốc gia',
    shortIntro:
      'Di sản văn hóa phi vật thể quốc gia tiêu biểu cho tín ngưỡng thờ thần Nam Hải (Cá Ông) của ngư dân miền biển, diễn ra hàng năm vào ngày 16 - 18 tháng 8 âm lịch.',
    historicalStory:
      'Theo truyền thuyết miền biển, Cá Ông (cá voi) là hóa thân linh thiêng thường cứu giúp ngư dân vượt qua sóng to gió lớn trên biển cả bao la. Đình Thắng Tam được xây dựng từ năm 1840 để thờ ba vị tiền hiền có công lập ba làng Thắng tại Vũng Tàu, đồng thời bên cạnh là Lăng Ông Nam Hải lưu giữ bộ xương cá voi khổng lồ trôi dạt vào bờ hơn 100 năm trước.',
    culturalSignificance:
      'Lễ hội Nghinh Ông là sinh hoạt văn hóa tinh thần cốt lõi của cộng đồng ngư dân vùng biển. Đây không chỉ là dịp cầu cho quốc thái dân an, mưa thuận gió hòa mà còn là ngày hội thắt chặt tình nghĩa giữa những người đi biển.',
    specialHighlights: [
      'Đoàn thuyền rồng hoa lộng lẫy dong buồm ra khơi rước kiệu Ông về đình',
      'Lễ tế thần trang trọng với dàn nhạc ngũ âm, múa lân sư rồng và hát bả trạo',
      'Chiêm ngưỡng bộ xương cá voi dài gần 20m trong Lăng Ông Nam Hải',
      'Hội thi bơi lội, đua thuyền thúng, quăng chài bắt cá sôi động trên bãi biển',
    ],
    visitingTips: 'Hãy đến vào sáng sớm ngày 16 tháng 8 âm lịch tại Bãi Trước để xem đoàn thuyền rước kiệu trên biển.',
    isFeatured: true,
  },
  {
    id: 'hcm-vung-tau-bach-dinh',
    name: 'Di tích Lịch sử – Kiến trúc Bạch Dinh (Villa Blanche)',
    provinceId: 'hcm',
    category: 'architecture',
    address: 'Số 04 Trần Phú, Phường 1, TP. Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu',
    coords: { x: 72, y: 73, lat: 10.3541, lng: 107.0722 },
    era: 'Khởi công 1898 - Hoàn thành 1902 thời Pháp thuộc',
    coverImage: '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
    galleryImages: [
      '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
      '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    ],
    videoUrl: 'https://www.youtube.com/embed/5T2o1k9qM7E',
    videoTitle: 'Bạch Dinh Vũng Tàu - Dấu ấn kiến trúc Pháp trên đỉnh Núi Lớn',
    shortIntro:
      'Dinh thự nghỉ dưỡng kiến trúc châu Âu tráng lệ cuối thế kỷ XIX nép mình trên sườn Núi Lớn, từng là nơi giam lỏng vua Thành Thái và lưu giữ kho cổ vật gốm sứ chìm tàu Hòn Cau.',
    historicalStory:
      'Bạch Dinh được Toàn quyền Đông Dương Paul Doumer cho xây dựng trên nền pháo đài Phước Thắng xưa của nhà Nguyễn. Tòa dinh thự quét vôi trắng nổi bật giữa rừng hoa sứ cổ thụ. Năm 1907, nhà yêu nước - vua Thành Thái bị thực dân Pháp giam lỏng tại đây gần 10 năm vì có tư tưởng chống đối đế quốc.',
    culturalSignificance:
      'Bạch Dinh là một kiệt tác kiến trúc thời kỳ Belle Époque hòa hợp tuyệt mỹ với thiên nhiên biển đảo. Tòa nhà hiện lưu giữ bộ sưu tập hơn 10.000 hiện vật gốm sứ thế kỷ XVII vớt được từ con tàu cổ bị đắm tại vùng biển Hòn Cau.',
    specialHighlights: [
      'Kiến trúc 3 tầng lầu phong cách La Mã cổ điển với các bức tượng chân dung Hy Lạp',
      'Đường hoa sứ Bạch Dinh cổ kính ngát hương thơm mỗi độ hè về',
      'Tầm nhìn panorama 180 độ bao trọn Bãi Trước và biển Đông lộng gió',
      'Trận địa pháo cổ 8 khẩu súng thần công thời Nguyễn trên sườn núi',
    ],
    visitingTips: 'Vào mùa hoa sứ nở rộ (tháng 4 - tháng 8), khuôn viên dinh thự đẹp như tranh vẽ.',
    isFeatured: true,
  },
  {
    id: 'hcm-dia-dao-cu-chi',
    name: 'Khu Di tích Lịch sử Địa đạo Củ Chi',
    provinceId: 'hcm',
    category: 'historical',
    address: 'Ấp Phú Hiệp, Xã Phú Mỹ Hưng, Huyện Củ Chi, TP. Hồ Chí Minh',
    coords: { x: 25, y: 44, lat: 11.1417, lng: 106.4628 },
    era: 'Khởi nguồn 1946 - Hoàn thiện 1968',
    coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    galleryImages: [
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
      '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    ],
    videoUrl: 'https://www.youtube.com/embed/9zPz2e0qN4Q',
    videoTitle: 'Địa đạo Củ Chi - Kỳ quan nghệ thuật quân sự ngầm dưới lòng đất',
    shortIntro:
      'Mạng lưới địa đạo quân sự dài hơn 250km được đào thủ công trong lòng đất đất sét pha ong, biểu tượng sáng ngời cho tinh thần bất khuất của "Đất thép thành đồng".',
    historicalStory:
      'Khởi phát từ thời kỳ kháng chiến chống Pháp tại hai xã Tân Phú Trung và Phước Vĩnh An, hệ thống địa đạo ban đầu chỉ là những hầm bí mật đơn lẻ. Đến thời kỳ kháng chiến chống Mỹ, quân dân Củ Chi đã phát triển thành hệ thống hầm ngầm liên hoàn nhiều tầng sâu tới 12 mét, có đầy đủ bệnh xá, bếp Hoàng Cầm không khói, kho vũ khí và phòng họp.',
    culturalSignificance:
      'Địa đạo Củ Chi là đỉnh cao của nghệ thuật chiến tranh nhân dân Việt Nam, được bầu chọn là một trong những công trình ngầm kỳ thú nhất thế giới.',
    specialHighlights: [
      'Trải nghiệm chui hầm địa đạo ba tầng sâu trong lòng đất mẹ',
      'Thưởng thức khoai mì chấm muối mè dân dã bên bếp Hoàng Cầm',
      'Khu tái hiện vùng giải phóng Củ Chi với nếp nhà tranh xưa',
      'Trưng bày các loại bẫy chông và vũ khí tự chế sáng tạo',
    ],
    visitingTips: 'Nên mặc trang phục gọn gàng, giày thể thao thoải mái khi tham gia trải nghiệm chui hầm.',
  },

  // ================= ĐỒNG NAI (Bình Phước + Đồng Nai) =================
  {
    id: 'dong-nai-gom-bien-hoa',
    name: 'Làng nghề Gốm Biên Hòa (Tân Vạn)',
    provinceId: 'dong-nai',
    category: 'craft',
    address: 'Phường Tân Vạn & Bửu Long, TP. Biên Hòa, Tỉnh Đồng Nai',
    coords: { x: 50, y: 39, lat: 10.9325, lng: 106.8456 },
    era: 'Khởi phát cuối thế kỷ XIX - Trường Mỹ nghệ 1903',
    coverImage: '/src/assets/images/dong_nai_ceramic_craft_1794323909184.jpg',
    galleryImages: [
      '/src/assets/images/dong_nai_ceramic_craft_1794323909184.jpg',
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    videoUrl: 'https://www.youtube.com/embed/kR4W38rZ3zM',
    videoTitle: 'Gốm Biên Hòa - Huyền thoại men xanh đồng trổ bông đất phương Nam',
    shortIntro:
      'Làng nghề gốm hơn 300 năm bên dòng sông Đồng Nai, lừng danh khắp thế giới nhờ sắc men xanh đồng trổ bông (vert de Bien Hoa) và kỹ thuật khắc chìm chấm men độc nhất vô nhị.',
    historicalStory:
      'Bắt nguồn từ những lò gốm Cây Mai của thợ gốm người Hoa di cư về Cù Lao Phố thế kỷ XVII, gốm Biên Hòa thực sự bước vào thời kỳ hoàng kim khi Trường Mỹ nghệ Biên Hòa được thành lập năm 1903. Dưới sự dẫn dắt của nghệ nhân bản địa và chuyên gia Pháp, dòng gốm mỹ thuật này đã chinh phục các triển lãm danh giá tại Paris những năm 1925 - 1934.',
    culturalSignificance:
      'Gốm Biên Hòa là niềm tự hào của mỹ thuật ứng dụng Việt Nam. Sắc men xanh đồng thanh nhã cùng các tác phẩm tượng voi gốm, đôn voi, chóe rượu đã trở thành di sản văn hóa quý báu.',
    specialHighlights: [
      'Kỹ thuật chạm khắc viền nét chìm (cloisonné đất) trước khi chấm men',
      'Màu men bí truyền "xanh đồng trổ bông" lung linh sau lửa nung',
      'Chiêm ngưỡng những chiếc đôn voi gốm Biên Hòa biểu tượng',
      'Tự tay vuốt gốm trên bàn xoay và tô vẽ men màu cùng nghệ nhân già',
    ],
    visitingTips: 'Các lò gốm cổ nằm dọc bờ sông Đồng Nai rất thuận tiện để tham quan và chụp ảnh tư liệu.',
    isFeatured: true,
  },
  {
    id: 'dong-nai-van-mieu-tran-bien',
    name: 'Văn Miếu Trấn Biên',
    provinceId: 'dong-nai',
    category: 'architecture',
    address: 'Khu phố 2, Phường Bửu Long, TP. Biên Hòa, Tỉnh Đồng Nai',
    coords: { x: 48, y: 36, lat: 10.9632, lng: 106.8081 },
    era: 'Khởi dựng năm 1715 dưới thời chúa Nguyễn Phúc Chu',
    coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    galleryImages: [
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
      '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    ],
    videoUrl: 'https://www.youtube.com/embed/zG_Z7Yk5c1Q',
    videoTitle: 'Văn Miếu Trấn Biên - Văn miếu đầu tiên của vùng đất phương Nam',
    shortIntro:
      'Văn miếu đầu tiên được xây dựng tại Đàng Trong vào năm 1715, biểu tượng thiêng liêng của truyền thống tôn sư trọng đạo, hiếu học và trọng dụng hiền tài của người dân Nam Bộ.',
    historicalStory:
      'Năm 1715, để cổ vũ việc học tập và tôn vinh Nho học tại vùng đất mới khai hoang, chúa Nguyễn Phúc Chu đã giao cho quan Trấn thủ Nguyễn Phan Long khởi công xây dựng Văn Miếu Trấn Biên. Văn miếu tái thiết trang nghiêm với kiến trúc mô phỏng Văn Miếu Quốc Tử Giám Hà Nội kết hợp vật liệu đá xanh Bửu Long và gốm Biên Hòa.',
    culturalSignificance:
      'Nơi đây tôn thờ Khổng Tử cùng các danh nhân văn hóa lỗi lạc của đất nước và các danh thần có công khai phá phương Nam như Nguyễn Hữu Cảnh, Trịnh Hoài Đức.',
    specialHighlights: [
      'Cổng Tam quan bề thế với ngói lưu ly xanh ngọc và câu đối chữ Hán',
      'Hồ Tịnh Quang trong vắt in bóng Nhà bia và Đại Thành Điện cổ kính',
      'Khu vực khắc ghi tên tuổi của các bậc tiền hiền khai mở xứ Đàng Trong',
      'Lễ hội Tết Thầy và lễ hội báo công của học sinh sinh viên ưu tú',
    ],
    visitingTips: 'Khuôn viên thanh tịnh với nhiều cây cổ thụ, phù hợp cho việc chiêm bái và tìm hiểu lịch sử.',
    isFeatured: true,
  },
  {
    id: 'dong-nai-cat-tien',
    name: 'Vườn Quốc gia Cát Tiên & Văn hóa Bản địa',
    provinceId: 'dong-nai',
    category: 'nature',
    address: 'Huyện Tân Phú, Tỉnh Đồng Nai (giáp Lâm Đồng & Bình Phước)',
    coords: { x: 68, y: 18, lat: 11.4239, lng: 107.4287 },
    era: 'Khu Dự trữ Sinh quyển Thế giới công nhận năm 2001',
    coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    galleryImages: [
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    shortIntro:
      'Lá phổi xanh nguyên sinh lớn nhất Đông Nam Bộ với Bàu Sấu hoang dã, hệ động thực vật quý hiếm cùng không gian văn hóa cồng chiêng Chơro, Mạ cổ truyền.',
    historicalStory:
      'Vườn Quốc gia Cát Tiên bao trùm diện tích hơn 71.000 ha rừng mưa nhiệt đới đất thấp. Bên cạnh giá trị sinh thái đặc hữu bảo tồn cá sấu Xiêm và chim công, vùng đất này còn lưu giữ di tích khảo cổ thánh địa Cát Tiên thuộc vương quốc Phù Nam cổ đại.',
    culturalSignificance:
      'Cát Tiên là nơi giao hòa giữa thiên nhiên nguyên sơ và đời sống tinh thần của các dân tộc bản địa Mạ, Stiêng, Chơro.',
    specialHighlights: [
      'Tung tăng chèo thuyền ngắm cá sấu Xiêm tự nhiên tại khu Ramsar Bàu Sấu',
      'Tour ngắm thú hoang dã ban đêm độc đáo bậc nhất Việt Nam',
      'Chiêm ngưỡng cây Tung cổ thụ hơn 400 năm tuổi với bộ rễ khổng lồ',
      'Thưởng thức đêm cồng chiêng rộn rã bên ánh lửa bập bùng cùng người Mạ',
    ],
    visitingTips: 'Mùa khô từ tháng 12 đến tháng 5 năm sau là thời điểm đẹp nhất để trekking rừng.',
  },

  // ================= TÂY NINH (Long An + Tây Ninh) =================
  {
    id: 'tay-ninh-nui-ba-den',
    name: 'Quần thể Danh thắng & Núi Bà Đen',
    provinceId: 'tay-ninh',
    category: 'nature',
    address: 'Phường Ninh Sơn, TP. Tây Ninh, Tỉnh Tây Ninh',
    coords: { x: 28, y: 35, lat: 11.3789, lng: 106.1681 },
    era: 'Huyền thoại hình thành từ thế kỷ XVIII',
    coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    galleryImages: [
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    shortIntro:
      'Nóc nhà Nam Bộ với độ cao 986m, trung tâm hành hương tâm linh nổi tiếng gắn liền với truyền thuyết Linh Sơn Thánh Mẫu linh ứng.',
    historicalStory:
      'Gắn liền với huyền thoại về nàng Lý Thị Thiên Hương (Bà Đen) kiên trinh, nhân hậu. Qua nhiều thế kỷ, Núi Bà Đen đã trở thành trung tâm tín ngưỡng sùng bái Thánh Mẫu lớn nhất miền Nam với hệ thống chùa Linh Sơn Tiên Thạch tự cổ kính nép mình bên vách đá.',
    culturalSignificance:
      'Lễ hội Linh Sơn Thánh Mẫu Núi Bà Đen là Di sản văn hóa phi vật thể quốc gia, thu hút hàng triệu lượt Phật tử và du khách hành hương chiêm bái mỗi dịp Xuân về.',
    specialHighlights: [
      'Chinh phục đỉnh núi 986m ngắm biển mây ngút ngàn',
      'Tượng Phật Bà Tây Bổ Đà Sơn bằng đồng cao nhất châu Á trên đỉnh núi',
      'Chiêm bái Chùa Bà cổ kính 300 năm tuổi giữa vách núi kỳ vĩ',
      'Trải nghiệm tuyến cáp treo hiện đại ngắm toàn cảnh đồng bằng Tây Ninh',
    ],
    visitingTips: 'Hội Xuân Núi Bà Đen kéo dài suốt tháng Giêng âm lịch là thời điểm lễ hội lớn nhất.',
    isFeatured: true,
  },
  {
    id: 'tay-ninh-toa-thanh',
    name: 'Tòa Thánh Tây Ninh (Đại Đạo Tam Kỳ Phổ Độ)',
    provinceId: 'tay-ninh',
    category: 'architecture',
    address: 'Phường Hiệp Ninh, TP. Tây Ninh, Tỉnh Tây Ninh',
    coords: { x: 30, y: 38, lat: 11.3092, lng: 106.1264 },
    era: 'Khởi công 1933 - Hoàn thành 1955',
    coverImage: '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    galleryImages: [
      '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    ],
    videoUrl: 'https://www.youtube.com/embed/8w5g67gXwR0',
    videoTitle: 'Tòa Thánh Tây Ninh - Kiệt tác kiến trúc Đạo Cao Đài độc nhất vô nhị',
    shortIntro:
      'Thánh địa trung tâm của Đạo Cao Đài với kiến trúc độc đáo dung hợp phong cách Công giáo, Phật giáo, Nho giáo và Đạo giáo rực rỡ sắc màu.',
    historicalStory:
      'Khởi công từ năm 1933 và hoàn thành năm 1955 hoàn toàn bằng sức lao động thủ công của các tín đồ. Công trình sở hữu nét kiến trúc kết hợp giữa tháp chuông Công giáo, mái chùa Phật giáo và họa tiết rồng phượng phương Đông, thể hiện triết lý "Vạn giáo nhất lý".',
    culturalSignificance:
      'Tòa Thánh Tây Ninh là công trình tôn giáo độc đáo duy nhất trên thế giới, biểu tượng cho sự dung hòa tư tưởng và văn hóa Nam Bộ.',
    specialHighlights: [
      'Biểu tượng Thiên Nhãn (Mắt Trời) kỳ ảo ở chính điện',
      'Nghệ thuật chạm khắc 9 cặp rồng vờn mây trên các cột trụ',
      'Nghi lễ Đại lễ Vía Đức Chí Tôn mùng 9 tháng Giêng nguy nga',
      'Khuôn viên rộng lớn với hàng ngàn cây dầu cổ thụ rợp bóng',
    ],
    visitingTips: 'Nên có mặt lúc 12:00 trưa để dự giờ cúng chính điện và chụp ảnh kiến trúc khi lên đèn.',
    isFeatured: true,
  },
];