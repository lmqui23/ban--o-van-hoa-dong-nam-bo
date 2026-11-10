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

export const PROVINCES: ProvinceInfo[] = [
  {
    id: 'hcm',
    name: 'TP. Hồ Chí Minh',
    shortName: 'Sài Gòn - TP.HCM',
    vietnameseName: 'Thành phố Hồ Chí Minh',
    tagline: 'Giao lộ hội tụ tinh hoa phương Nam & Đô thị di sản sông nước',
    description:
      'Với hơn 300 năm hình thành và phát triển từ vùng đất Bến Nghé - Sài Gòn, thành phố là trung tâm văn hóa, kinh tế năng động, lưu giữ hàng trăm di tích kiến trúc Pháp - Việt - Hoa độc đáo bên dòng sông Sài Gòn lịch sử.',
    color: '#f59e0b', // Warm Gold
    accentColor: '#fbbf24',
    heroImage: '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    centerCoords: { x: 34, y: 56 },
    viewBox: '120 280 260 220',
    svgPath:
      'M 160 300 C 180 290 220 285 240 310 C 260 330 250 360 270 380 C 285 395 300 400 310 430 C 315 455 300 480 280 495 C 255 510 230 490 210 475 C 190 460 170 470 150 450 C 130 430 140 400 135 370 C 130 340 145 310 160 300 Z',
    facts: [
      { label: 'Niên đại lịch sử', value: 'Từ năm 1698 (Nguyễn Hữu Cảnh kinh lược)' },
      { label: 'Di tích được xếp hạng', value: 'Hơn 185 di tích lịch sử - văn hóa' },
      { label: 'Di sản phi vật thể', value: 'Đờn ca tài tử Nam Bộ, Lễ hội Nghinh Ông Cần Giờ' },
    ],
    culturalHighlights: [
      'Bến Nhà Rồng & Sông Sài Gòn hào hùng',
      'Khu di tích lịch sử Địa đạo Củ Chi đất thép thành đồng',
      'Lăng Tả quân Lê Văn Duyệt (Lăng Ông Bà Chiểu)',
      'Khu phố cổ Chợ Lớn đậm đà phong vị người Hoa',
    ],
  },
  {
    id: 'dong-nai',
    name: 'Đồng Nai',
    shortName: 'Đồng Nai',
    vietnameseName: 'Tỉnh Đồng Nai',
    tagline: 'Cái nôi văn hóa Đông Nam Bộ & Tinh hoa gốm men Trấn Biên',
    description:
      'Đồng Nai lưu giữ dấu tích văn hóa cổ xưa nhất vùng Đông Nam Bộ với nền khảo cổ học thời tiền sử Hàng Gòn, Văn Miếu Trấn Biên 300 năm, làng nghề gốm Biên Hòa men xanh đồng trổ bông cùng rừng nguyên sinh Cát Tiên bạt ngàn.',
    color: '#10b981', // Forest Emerald
    accentColor: '#34d399',
    heroImage: '/src/assets/images/dong_nai_ceramic_craft_1794323909184.jpg',
    centerCoords: { x: 58, y: 36 },
    viewBox: '230 180 320 280',
    svgPath:
      'M 255 210 C 290 190 350 180 400 200 C 450 220 510 240 530 280 C 545 310 520 350 500 380 C 475 410 440 430 400 440 C 360 450 330 430 300 420 C 270 410 250 370 240 330 C 235 285 240 240 255 210 Z',
    facts: [
      { label: 'Di tích khảo cổ', value: 'Mộ Cự thạch Hàng Gòn 2.000 năm tuổi' },
      { label: 'Văn hiến miền Nam', value: 'Văn Miếu Trấn Biên xây dựng năm 1715' },
      { label: 'Làng nghề nổi bật', value: 'Gốm Biên Hòa (thành lập trường mỹ nghệ 1903)' },
    ],
    culturalHighlights: [
      'Gốm mỹ nghệ Biên Hòa men xanh đồng trổ bông',
      'Chiến khu Đ và căn cứ Trung ương Cục Miền Nam',
      'Văn Miếu Trấn Biên - biểu trưng hiếu học phương Nam',
      'Vườn Quốc gia Cát Tiên - Khu Dự trữ Sinh quyển Thế giới',
    ],
  },
  {
    id: 'ba-ria-vung-tau',
    name: 'Bà Rịa - Vũng Tàu',
    shortName: 'Bà Rịa - Vũng Tàu',
    vietnameseName: 'Tỉnh Bà Rịa - Vũng Tàu',
    tagline: 'Xứ sở văn hóa biển đảo, phong cảnh kỳ vĩ & lễ hội tâm linh',
    description:
      'Cửa ngõ vươn ra Biển Đông với truyền thống đánh bắt xa bờ gắn liền Lễ hội Nghinh Ông Thắng Tam di sản phi vật thể quốc gia, kiến trúc Bạch Dinh trên triền núi và hệ thống địa đạo, căn cứ ven biển giàu truyền thống cách mạng.',
    color: '#06b6d4', // Ocean Cyan
    accentColor: '#22d3ee',
    heroImage: '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
    centerCoords: { x: 74, y: 72 },
    viewBox: '360 380 240 230',
    svgPath:
      'M 380 410 C 420 395 480 390 520 410 C 560 430 580 470 575 510 C 570 545 530 570 490 585 C 450 600 420 590 395 565 C 375 540 365 500 365 470 C 365 440 370 420 380 410 Z',
    facts: [
      { label: 'Di sản phi vật thể', value: 'Lễ hội Nghinh Ông Thắng Tam cấp Quốc gia' },
      { label: 'Di tích lịch sử', value: 'Bạch Dinh (Villa Blanche) xây năm 1898' },
      { label: 'Đặc trưng văn hóa', value: 'Tục thờ Cá Ông & Làng nghề bánh tráng, nước mắm' },
    ],
    culturalHighlights: [
      'Lễ hội Nghinh Ông Thắng Tam rực rỡ sắc cờ thuyền hoa',
      'Di tích Bạch Dinh ngắm trọn biển trời Vũng Tàu',
      'Địa đạo Long Phước kiên cường bất khuất',
      'Làng nghề Bánh tráng An Ngãi & Nước mắm Phước Hải',
    ],
  },
];

export const INITIAL_CULTURAL_POINTS: CulturalPoint[] = [
  // ================= TP. HỒ CHÍ MINH =================
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
      'Bến Nhà Rồng vừa là một chứng tích lịch sử tiêu biểu của phong trào giải phóng dân tộc, vừa là biểu tượng di sản văn hóa sông nước của Sài Gòn - TP.HCM. Tòa nhà lưu giữ hơn 20.000 tư liệu, hiện vật quý giá về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh cùng sự phát triển của thương cảng Sài Gòn qua các thời kỳ.',
    specialHighlights: [
      'Kiến trúc mái ngói Lưỡng Long Triều Nguyệt độc đáo thời Pháp thuộc',
      'Phòng trưng bày chuyên đề hành trình 30 năm bôn ba cứu nước',
      'Không gian ngắm bình minh và hoàng hôn lộng gió trên ngã ba sông Sài Gòn',
      'Khu vườn tượng và bảo tàng lưu niệm với hàng ngàn hiện vật gốc',
    ],
    visitingTips: 'Mở cửa từ 7:30 đến 17:00 các ngày trong tuần. Thời điểm lý tưởng để tham quan là buổi chiều tà khi ánh hoàng hôn chiếu rọi lên dòng sông.',
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
      'Khởi phát từ thời kỳ kháng chiến chống Pháp tại hai xã Tân Phú Trung và Phước Vĩnh An, hệ thống địa đạo ban đầu chỉ là những hầm bí mật đơn lẻ. Đến thời kỳ kháng chiến chống Mỹ, quân dân Củ Chi đã phát triển thành hệ thống hầm ngầm liên hoàn nhiều tầng sâu tới 12 mét, có đầy đủ bệnh xá, bếp Hoàng Cầm không khói, kho vũ khí, phòng họp và giếng nước, chịu được các đợt ném bom rải thảm ác liệt nhất.',
    culturalSignificance:
      'Địa đạo Củ Chi là đỉnh cao của nghệ thuật chiến tranh nhân dân Việt Nam, được bầu chọn là một trong những công trình ngầm kỳ thú nhất thế giới. Nơi đây giáo dục truyền thống kiên cường và thể hiện trí tuệ, lòng quả cảm vô song của người dân Nam Bộ.',
    specialHighlights: [
      'Trải nghiệm chui hầm địa đạo ba tầng sâu trong lòng đất mẹ',
      'Thưởng thức khoai mì chấm muối mè dân dã bên bếp Hoàng Cầm',
      'Khu tái hiện vùng giải phóng Củ Chi với nếp nhà tranh xưa',
      'Trưng bày các loại bẫy chông và vũ khí tự chế sáng tạo',
    ],
    visitingTips: 'Nên mặc trang phục gọn gàng, giày thể thao thoải mái khi tham gia trải nghiệm chui hầm.',
    isFeatured: true,
  },
  {
    id: 'hcm-lang-ong-ba-chieu',
    name: 'Lăng Tả quân Lê Văn Duyệt (Lăng Ông Bà Chiểu)',
    provinceId: 'hcm',
    category: 'festival',
    address: 'Số 01 Vũ Tùng, Phường 1, Quận Bình Thạnh, TP. Hồ Chí Minh',
    coords: { x: 33, y: 52, lat: 10.8003, lng: 106.6961 },
    era: 'Xây dựng năm 1848 thời vua Tự Đức',
    coverImage: '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    galleryImages: [
      '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    ],
    shortIntro:
      'Trung tâm tín ngưỡng dân gian lâu đời bậc nhất Sài Gòn, nơi thờ Tả quân Tổng trấn thành Gia Định, với lối kiến trúc cung đình triều Nguyễn lộng lẫy và lễ giỗ Ông vào mùng 1-3 tháng 8 âm lịch.',
    historicalStory:
      'Lê Văn Duyệt (1764-1832) là vị đại công thần thời Nguyễn, người có công mở mang, phát triển vùng đất phương Nam trù phú, bảo vệ bình yên cho các sắc dân Kinh, Hoa, Chăm, Khmer cùng sinh sống hòa hợp. Năm 1848, sau khi được giải oan, người dân Gia Định đã cùng nhau xây dựng khu lăng mộ và đền thờ khang trang để muôn đời tưởng nhớ vị Tổng trấn đức độ.',
    culturalSignificance:
      'Lăng Ông Bà Chiểu không chỉ là công trình kiến trúc nghệ thuật cấp quốc gia mà còn là trung tâm tín ngưỡng gắn liền với tâm thức người dân Nam Bộ. Lễ giỗ Đức Thượng công Tả quân Lê Văn Duyệt đã được công nhận là Di sản văn hóa phi vật thể quốc gia.',
    specialHighlights: [
      'Nghệ thuật khảm sành sứ và chạm khắc gỗ tinh xảo phong cách cung đình Huế',
      'Mộ phần song táng của Tả quân và phu nhân theo hình mai rùa độc đáo',
      'Nghi thức tế lễ cổ truyền Nam Bộ với nhạc lễ tài tử và hát bội',
      'Cây đa cổ thụ trăm năm tỏa bóng râm mát giữa lòng đô thị',
    ],
    visitingTips: 'Dịp lễ giỗ vào đầu tháng 8 âm lịch thu hút hàng vạn khách thập phương hành hương chiêm bái và xem hát bội.',
  },
  {
    id: 'hcm-cho-lon-heritage',
    name: 'Không gian Di sản Đô thị & Phố cổ Chợ Lớn',
    provinceId: 'hcm',
    category: 'architecture',
    address: 'Khu vực Quận 5 và Quận 6, TP. Hồ Chí Minh',
    coords: { x: 31, y: 58, lat: 10.7538, lng: 106.6611 },
    era: 'Thành lập từ năm 1778',
    coverImage: '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    galleryImages: [
      '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    ],
    shortIntro:
      'Khu đô thị thương mại truyền thống của cộng đồng người Hoa với các hội quán cổ kính (Nghĩa An, Tuệ Thành, Ôn Lăng), kiến trúc nhà phố thương mại và nghệ thuật ẩm thực trứ danh.',
    historicalStory:
      'Hình thành từ cuối thế kỷ XVIII khi cộng đồng người Hoa từ Cù Lao Phố (Biên Hòa) chuyển về vùng đất ven rạch Bến Nghé khai hoang lập nghiệp. Chợ Lớn nhanh chóng trở thành trung tâm thương mại sầm uất bậc nhất phương Nam với mạng lưới kênh rạch thuận lợi cho ghe thuyền buôn bán lúa gạo, tơ lụa và trà thảo mộc.',
    culturalSignificance:
      'Chợ Lớn là bức tranh sinh động về sự giao lưu và hội nhập văn hóa Việt - Hoa. Nơi đây tập trung quần thể di tích kiến trúc hội quán với nghệ thuật gốm sứ Cây Mai, nghệ thuật điêu khắc gỗ thếp vàng và những phong tục lễ hội đặc sắc như Tết Nguyên Tiêu.',
    specialHighlights: [
      'Chùa Bà Thiên Hậu (Hội quán Tuệ Thành) với giàn nhang vòng kỳ ảo',
      'Chợ Bình Tây kiến trúc bát quái Á - Âu do thương gia Quách Đàm hưng công',
      'Đại lễ diễu hành Tết Nguyên Tiêu - Di sản văn hóa phi vật thể quốc gia',
      'Văn hóa ẩm thực hủ tiếu, dimsum, chè tàu và phố đông y Hải Thượng Lãn Ông',
    ],
    visitingTips: 'Nên dành thời gian đi bộ qua các con hẻm cổ và thưởng thức ẩm thực vào buổi chiều tối.',
  },
  {
    id: 'hcm-lang-duc-dong-an-hoi',
    name: 'Làng Đúc đồng Truyền thống An Hội',
    provinceId: 'hcm',
    category: 'craft',
    address: 'Đường Nguyễn Oanh & Phan Huy Ích, Quận Gò Vấp, TP. Hồ Chí Minh',
    coords: { x: 33, y: 49, lat: 10.8354, lng: 106.6725 },
    era: 'Hơn 150 năm tuổi (từ giữa thế kỷ XIX)',
    coverImage: '/src/assets/images/dong_nai_ceramic_craft_1794323909184.jpg',
    galleryImages: [
      '/src/assets/images/dong_nai_ceramic_craft_1794323909184.jpg',
    ],
    shortIntro:
      'Làng nghề đúc đồng lư hương truyền thống nức tiếng đất Gia Định, nơi những nghệ nhân tài hoa gìn giữ ngọn lửa nghề thổi hồn vào những bộ đồ thờ bằng đồng sáng bóng.',
    historicalStory:
      'Theo lời kể của các bậc cao niên, nghề đúc đồng do các nghệ nhân từ Quảng Nam và Thừa Thiên theo đoàn người mở cõi mang vào đất Gò Vấp từ hơn một thế kỷ rưỡi trước. Trải qua bao thăng trầm, những lò đúc đồng An Hội vẫn đỏ lửa ngày đêm để tạo ra những bộ lư vuông, lư tròn mang đậm dấu ấn mỹ thuật Nam Bộ phục vụ việc thờ cúng tổ tiên.',
    culturalSignificance:
      'Làng đúc đồng An Hội là một trong những làng nghề thủ công hiếm hoi còn tồn tại ngay giữa lòng đô thị TP.HCM. Sản phẩm không chỉ có giá trị sử dụng mà còn là hiện thân của đạo lý "uống nước nhớ nguồn" và sự trường tồn của nghề thủ công dân tộc.',
    specialHighlights: [
      'Quy trình làm khuôn đất sét pha trấu và sáp ong thủ công tỉ mỉ',
      'Kỹ thuật nấu đồng đỏ rực và rót đồng nóng chảy vào khuôn',
      'Nghệ thuật chạm khắc họa tiết hoa mai, rồng phượng trên thân lư',
      'Tìm hiểu triết lý thờ cúng gia tiên trong ngôi nhà truyền thống Nam Bộ',
    ],
    visitingTips: 'Các lò đúc hoạt động rộn ràng nhất vào những tháng giáp Tết Nguyên Đán khi nhu cầu mua sắm lư đồng tăng cao.',
  },
  {
    id: 'hcm-am-thuc-nam-bo',
    name: 'Không gian Văn hóa Ẩm thực Khẩn Hoang Nam Bộ',
    provinceId: 'hcm',
    category: 'cuisine',
    address: 'Khu Bình Quới – Thanh Đa, Quận Bình Thạnh, TP. Hồ Chí Minh',
    coords: { x: 36, y: 51, lat: 10.8242, lng: 106.7289 },
    era: 'Định hình từ thế kỷ XVIII - XIX',
    coverImage: '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    galleryImages: [
      '/src/assets/images/saigon_cultural_heritage_1794323909832.jpg',
    ],
    shortIntro:
      'Không gian tái hiện sinh động văn hóa ẩm thực khẩn hoang sông nước phương Nam với bánh xèo bông điên điển, cá lóc nướng trui cuốn lá sen non và những điệu đờn ca tài tử réo rắt.',
    historicalStory:
      'Trong quá trình người Việt, người Chăm, người Hoa và Khmer cùng nhau khai phá đồng bằng Nam Bộ, thiên nhiên trù phú của sông rạch và rừng ngập mặn đã hình thành nên tính cách hào sảng, phóng khoáng trong ẩm thực: tận dụng sản vật tự nhiên mùa nào thức nấy, chế biến mộc mạc nhưng đậm đà hương vị.',
    culturalSignificance:
      'Ẩm thực Nam Bộ tại Sài Gòn phản ánh nét đẹp hòa hiếu, cởi mở và tính thích nghi cao của người dân phương Nam. Bữa ăn không đơn thuần là dinh dưỡng mà là không gian gắn kết tình làng nghĩa xóm, sẻ chia niềm vui thu hoạch.',
    specialHighlights: [
      'Trải nghiệm cá lóc nướng trui rơm rạ theo phong cách khẩn hoang',
      'Hơn 30 loại rau rừng Nam Bộ như đọt cóc, lá cách, rau nhái, đọt xoài',
      'Thưởng thức bánh xèo giòn rụm bên bờ sông râm mát rặng dừa nước',
      'Giao lưu đờn ca tài tử với các nghệ nhân đàn kìm, đàn tranh',
    ],
    visitingTips: 'Rất thích hợp cho các buổi trải nghiệm văn hóa gia đình vào dịp cuối tuần.',
  },

  // ================= ĐỒNG NAI =================
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
      'Bắt nguồn từ những lò gốm Cây Mai của thợ gốm người Hoa di cư về Cù Lao Phố thế kỷ XVII, gốm Biên Hòa thực sự bước vào thời kỳ hoàng kim khi Trường Mỹ nghệ Biên Hòa được thành lập năm 1903 (nay là Trường CĐ Mỹ thuật Trang trí Đồng Nai). Dưới sự dẫn dắt của nghệ nhân bản địa và chuyên gia Pháp, một dòng gốm mỹ thuật kết hợp giữa chất đất đỏ bazan Đồng Nai, men tro tự nhiên và oxit đồng đã chinh phục các triển lãm danh giá tại Paris những năm 1925 - 1934.',
    culturalSignificance:
      'Gốm Biên Hòa là niềm tự hào của mỹ thuật ứng dụng Việt Nam. Sắc men xanh đồng thanh nhã cùng các tác phẩm tượng voi gốm, đôn voi, chóe rượu và phù điêu trang trí đã trở thành di sản văn hóa phi vật thể quý báu của vùng đất Trấn Biên.',
    specialHighlights: [
      'Kỹ thuật chạm khắc viền nét chìm (cloisonné đất) trước khi chấm men',
      'Màu men bí truyền "xanh đồng trổ bông" lung linh sau lửa nung',
      'Chiêm ngưỡng những chiếc đôn voi gốm Biên Hòa biểu tượng',
      'Tự tay vuốt gốm trên bàn xoay và tô vẽ men màu cùng nghệ nhân già',
    ],
    visitingTips: 'Các lò gốm cổ nằm dọc bờ sông Đồng Nai ở Tân Vạn rất thuận tiện để đi thuyền tham quan và chụp ảnh tư liệu.',
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
      'Năm 1715, để cổ vũ việc học tập và tôn vinh Nho học tại vùng đất mới khai hoang, chúa Nguyễn Phúc Chu đã giao cho quan Trấn thủ Nguyễn Phan Long và Ký lục Phạm Khánh Đức khởi công xây dựng Văn Miếu Trấn Biên tại thôn Bình Thành (nay là Bửu Long). Trải qua bao binh hỏa, Văn miếu đã được tái thiết trang nghiêm với kiến trúc mô phỏng Văn Miếu Quốc Tử Giám Hà Nội kết hợp vật liệu đá xanh Bửu Long và gốm Biên Hòa.',
    culturalSignificance:
      'Nơi đây tôn thờ Khổng Tử cùng các danh nhân văn hóa lỗi lạc của đất nước như Chu Văn An, Nguyễn Trãi, Lê Quý Đôn và các danh thần có công khai phá phương Nam như Nguyễn Hữu Cảnh, Trịnh Hoài Đức. Văn Miếu Trấn Biên là di tích lịch sử - văn hóa cấp Quốc gia.',
    specialHighlights: [
      'Cổng Tam quan bề thế với ngói lưu ly xanh ngọc và câu đối chữ Hán sâu sắc',
      'Hồ Tịnh Quang trong vắt in bóng Nhà bia và Đại Thành Điện cổ kính',
      'Khu vực khắc ghi tên tuổi của các bậc tiền hiền khai mở xứ Đàng Trong',
      'Lễ hội Tết Thầy và lễ hội báo công của các thế hệ học sinh sinh viên ưu tú',
    ],
    visitingTips: 'Khuôn viên thanh tịnh với nhiều cây cổ thụ, phù hợp cho việc chiêm bái và tìm hiểu lịch sử khai hoang Nam Bộ.',
    isFeatured: true,
  },
  {
    id: 'dong-nai-chien-khu-d',
    name: 'Khu Di tích Lịch sử Căn cứ Chiến khu Đ',
    provinceId: 'dong-nai',
    category: 'historical',
    address: 'Rừng nguyên sinh Mã Đà, Xã Trị An, Huyện Vĩnh Cửu, Tỉnh Đồng Nai',
    coords: { x: 57, y: 28, lat: 11.2389, lng: 107.0214 },
    era: 'Thành lập từ tháng 2 năm 1946',
    coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    galleryImages: [
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    shortIntro:
      'Địa bàn căn cứ cách mạng huyền thoại "Đi không dấu, nấu không khói, nói không tiếng" của miền Đông Nam Bộ, nơi chở che các cơ quan đầu não kháng chiến suốt hai cuộc trường chinh.',
    historicalStory:
      'Chiến khu Đ ra đời năm 1946 tại vùng rừng hiểm trở tiếp giáp Đồng Nai, Bình Dương và Bình Phước. Dựa vào địa hình rừng đại ngàn nguyên sinh Mã Đà và lòng dân kiên trung, nơi đây trở thành cái nôi của lực lượng vũ trang giải phóng, từng là nơi đặt Đài Tiếng nói Nam Bộ kháng chiến và Căn cứ Trung ương Cục Miền Nam giai đoạn 1961 - 1962.',
    culturalSignificance:
      'Chiến khu Đ là biểu tượng sáng ngời của chủ nghĩa anh hùng cách mạng, của tinh thần đoàn kết quân dân giữa rừng già miền Đông. Di tích là địa chỉ đỏ giáo dục lòng yêu nước và ý chí bất khuất cho các thế hệ tương lai.',
    specialHighlights: [
      'Khu hầm trú ẩn Trung ương Cục Miền Nam còn nguyên vẹn dưới tán rừng già',
      'Nghĩa trang Liệt sĩ Mã Đà thiêng liêng giữa đại ngàn bạt ngàn',
      'Hệ sinh thái rừng mưa nhiệt đới với các loài đại thụ dầu, sao trăm năm tuổi',
      'Trải nghiệm văn hóa đồng bào Chơro bản địa với món cá lăng hồ Trị An',
    ],
    visitingTips: 'Nên kết hợp tham quan di tích lịch sử với trekking khám phá rừng Mã Đà và chèo thuyền trên hồ Trị An.',
  },
  {
    id: 'dong-nai-cu-thach-hang-gon',
    name: 'Di tích Khảo cổ học Mộ Cự thạch Hàng Gòn',
    provinceId: 'dong-nai',
    category: 'historical',
    address: 'Xã Hàng Gòn, TP. Long Khánh, Tỉnh Đồng Nai',
    coords: { x: 65, y: 41, lat: 10.9238, lng: 107.2415 },
    era: 'Niên đại khoảng 150 TCN – 240 SCN (hơn 2.000 năm trước)',
    coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    galleryImages: [
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    shortIntro:
      'Công trình kiến trúc mộ đá cự thạch (Dolmen) độc nhất vô nhị ở Đông Nam Á, di tích Quốc gia đặc biệt minh chứng cho nền văn minh cổ xưa rực rỡ cách đây hơn hai thiên niên kỷ.',
    historicalStory:
      'Được kỹ sư cầu đường người Pháp Jean Bouchot phát hiện vào năm 1927 khi mở đường giao thông. Ngôi mộ táng hình hộp chữ nhật được ghép từ 6 tấm đá hoa cương khổng lồ nặng hàng chục tấn, liên kết với nhau bằng mộng ngàm tinh xảo đến kinh ngạc. Các nhà khảo cổ học nhận định công trình này thuộc về một thủ lĩnh bộ lạc quyền lực thời kỳ kim khí.',
    culturalSignificance:
      'Mộ Cự thạch Hàng Gòn là di chỉ khảo cổ học vô giá, minh chứng cho trình độ kỹ thuật vận chuyển đá nặng, gia công cơ khí và cấu trúc xã hội phân hóa cao của cư dân tiền sử vùng đất đỏ miền Đông Nam Bộ.',
    specialHighlights: [
      'Phiến đá nắp mộ nặng tới 10 tấn được đẽo gọt phẳng phiu và khớp mộng kỳ tài',
      'Phòng trưng bày hiện vật khảo cổ học đồ gốm, rìu đồng, đồ trang sức đá ngọc',
      'Cảnh quan thiên nhiên bình yên của vùng đất bazan màu mỡ Long Khánh',
      'Tìm hiểu các giả thuyết khảo cổ quốc tế về con đường di chuyển cự thạch cổ đại',
    ],
    visitingTips: 'Di tích mở cửa các ngày trong tuần. Có bảng thuyết minh song ngữ chi tiết về sơ đồ khảo cổ.',
  },
  {
    id: 'dong-nai-cat-tien',
    name: 'Vườn Quốc gia Cát Tiên & Văn hóa Bản địa',
    provinceId: 'dong-nai',
    category: 'nature',
    address: 'Huyện Tân Phú, Tỉnh Đồng Nai (giáp Lâm Đồng & Bình Phước)',
    coords: { x: 68, y: 18, lat: 11.4239, lng: 107.4287 },
    era: 'Khu Dự trữ Sinh quyển Thế giới được UNESCO công nhận năm 2001',
    coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    galleryImages: [
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    shortIntro:
      'Lá phổi xanh nguyên sinh lớn nhất Đông Nam Bộ với Bàu Sấu hoang dã, hệ động thực vật quý hiếm cùng không gian văn hóa cồng chiêng Chơro, Mạ cổ truyền.',
    historicalStory:
      'Vườn Quốc gia Cát Tiên bao trùm diện tích hơn 71.000 ha rừng mưa nhiệt đới đất thấp. Bên cạnh giá trị sinh thái đặc hữu bảo tồn bò tót, tê giác (trước đây), cá sấu Xiêm và chim công, vùng đất này còn lưu giữ di tích khảo cổ thánh địa Cát Tiên thuộc vương quốc Phù Nam cổ đại bên dòng sông Đạ Đờng.',
    culturalSignificance:
      'Cát Tiên là nơi giao hòa giữa thiên nhiên nguyên sơ và đời sống tinh thần của các dân tộc bản địa Mạ, Stiêng, Chơro. Những câu chuyện thần thoại về núi rừng, sông suối và lễ hội tạ ơn thần lúa đã nuôi dưỡng tâm hồn cư dân nơi đây qua bao thế hệ.',
    specialHighlights: [
      'Tung tăng chèo thuyền ngắm cá sấu Xiêm tự nhiên tại khu Ramsar Bàu Sấu',
      'Tour ngắm thú hoang dã ban đêm độc đáo bậc nhất Việt Nam',
      'Chiêm ngưỡng cây Tung cổ thụ hơn 400 năm tuổi với bộ rễ khổng lồ',
      'Thưởng thức đêm cồng chiêng rộn rã bên ánh lửa bập bùng cùng người Mạ',
    ],
    visitingTips: 'Mùa khô từ tháng 12 đến tháng 5 năm sau là thời điểm đẹp nhất để trekking rừng.',
  },
  {
    id: 'dong-nai-sayangva-choro',
    name: 'Lễ hội Sayangva của Người Chơro',
    provinceId: 'dong-nai',
    category: 'festival',
    address: 'Xã Phú Lý, Huyện Vĩnh Cửu, Tỉnh Đồng Nai',
    coords: { x: 55, y: 32, lat: 11.1892, lng: 107.0874 },
    era: 'Tín ngưỡng nông nghiệp truyền đời của cư dân bản địa',
    coverImage: '/src/assets/images/dong_nai_ceramic_craft_1794323909184.jpg',
    galleryImages: [
      '/src/assets/images/dong_nai_ceramic_craft_1794323909184.jpg',
    ],
    shortIntro:
      'Lễ cúng Thần Lúa (Sayangva) – ngày hội tạ ơn trời đất thiêng liêng nhất trong năm của đồng bào Chơro Đồng Nai với tiếng chiêng ngũ âm và men rượu cần ngây ngất.',
    historicalStory:
      'Người Chơro là một trong những cư dân bản địa lâu đời nhất tại Đông Nam Bộ. Hàng năm vào khoảng tháng 3 âm lịch, khi mùa màng đã thu hoạch xong và lúa đã đầy bồ, già làng sẽ chọn ngày lành để làm lễ Sayangva nhằm tạ ơn Yang (trời đất) đã ban mưa thuận gió hòa và cầu mong cho mùa rẫy tiếp theo no ấm.',
    culturalSignificance:
      'Sayangva phản ánh vũ trụ quan và nhân sinh quan gắn bó máu thịt với rừng của đồng bào Chơro. Lễ hội là bảo tàng sống về âm nhạc dân gian, cồng chiêng, đàn tre chimes và các điệu múa rộn ràng mang đậm phong vị đại ngàn.',
    specialHighlights: [
      'Nghi thức rước hồn lúa từ rẫy về kho lúa do thầy cúng chủ trì',
      'Hòa tấu cồng chiêng ngũ âm và đàn goong độc đáo',
      'Uống rượu cần nếp nương và thưởng thức cơm lam thịt nướng ống tre',
      'Các trò chơi dân gian thi bắn nỏ, đẩy gậy rộn rã tiếng cười',
    ],
    visitingTips: 'Du khách được chào đón nhiệt thành để hòa cùng vòng xòe cồng chiêng bên nhà văn hóa dân tộc.',
  },

  // ================= BÀ RỊA - VŨNG TÀU =================
  {
    id: 'vung-tau-nghinh-ong',
    name: 'Lễ hội Nghinh Ông Thắng Tam Vũng Tàu',
    provinceId: 'ba-ria-vung-tau',
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
      'Lễ hội Nghinh Ông là sinh hoạt văn hóa tinh thần cốt lõi của cộng đồng ngư dân Bà Rịa - Vũng Tàu. Đây không chỉ là dịp cầu cho quốc thái dân an, mưa thuận gió hòa, trời êm biển lặng mà còn là ngày hội thắt chặt tình nghĩa giữa những người đi biển.',
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
    id: 'vung-tau-bach-dinh',
    name: 'Di tích Lịch sử – Kiến trúc Bạch Dinh (Villa Blanche)',
    provinceId: 'ba-ria-vung-tau',
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
      'Bạch Dinh (tiếng Pháp: Villa Blanche) được Toàn quyền Đông Dương Paul Doumer cho xây dựng trên nền pháo đài Phước Thắng xưa của nhà Nguyễn. Tòa dinh thự quét vôi trắng nổi bật giữa rừng hoa sứ cổ thụ. Năm 1907, nhà yêu nước - vua Thành Thái bị thực dân Pháp giam lỏng tại đây gần 10 năm vì có tư tưởng chống đối đế quốc.',
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
    id: 'vung-tau-dia-dao-long-phuoc',
    name: 'Khu Di tích Lịch sử Địa đạo Long Phước',
    provinceId: 'ba-ria-vung-tau',
    category: 'historical',
    address: 'Xã Long Phước, TP. Bà Rịa, Tỉnh Bà Rịa - Vũng Tàu',
    coords: { x: 73, y: 64, lat: 10.5189, lng: 107.2181 },
    era: 'Khởi công năm 1948 - Củng cố 1963',
    coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    galleryImages: [
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    shortIntro:
      'Địa đạo kiên trung trên địa bàn Bà Rịa, biểu tượng của ý chí quật cường bám trụ đánh giặc ngay trong lòng ấp chiến lược, bảo vệ an toàn cho căn cứ Tỉnh ủy.',
    historicalStory:
      'Xã Long Phước có vị trí chiến lược trọng yếu trên trục giao thông huyết mạch từ Bà Rịa ra biển và lên miền Đông. Từ năm 1948, nhân dân Long Phước đã đào những mét hầm đầu tiên. Đến năm 1963, hệ thống đã phát triển thành địa đạo liên hoàn dài hàng ngàn mét kết nối 5 ấp, bẻ gãy hàng trăm trận càn quét khốc liệt của địch.',
    culturalSignificance:
      'Địa đạo Long Phước là minh chứng cho sức mạnh toàn dân kháng chiến và truyền thống cách mạng vẻ vang của quân dân Bà Rịa. Di tích được xếp hạng Di tích Lịch sử Quốc gia năm 1990.',
    specialHighlights: [
      'Hệ thống hào chiến đấu, hầm chữ Y và lỗ châu mai bắn tỉa bí mật',
      'Nhà truyền thống trưng bày vũ khí, trang thiết bị y tế thời chiến đấu gian khổ',
      'Khu rừng cây tái sinh thanh bình bên những hố bom xưa',
      'Lắng nghe câu chuyện cảm động về những người mẹ Long Phước kiên trung',
    ],
    visitingTips: 'Nên kết hợp cùng chuyến tham quan thành phố Bà Rịa và làng nghề bánh tráng lân cận.',
  },
  {
    id: 'vung-tau-lang-nghe-banh-trang-an-ngai',
    name: 'Làng nghề Bánh tráng Truyền thống An Ngãi',
    provinceId: 'ba-ria-vung-tau',
    category: 'craft',
    address: 'Xã An Ngãi, Huyện Long Điền, Tỉnh Bà Rịa - Vũng Tàu',
    coords: { x: 76, y: 67, lat: 10.4682, lng: 107.2419 },
    era: 'Trải qua hơn một thế kỷ gia truyền',
    coverImage: '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
    galleryImages: [
      '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
    ],
    shortIntro:
      'Làng nghề tráng bánh thủ công truyền thống trăm năm của huyện Long Điền, nổi tiếng với những vỉ bánh tráng gạo thơm nồng phơi mình dưới nắng biển trong lành.',
    historicalStory:
      'Nghề làm bánh tráng ở An Ngãi xuất hiện từ cuối thế kỷ XIX theo chân những cư dân miền Trung di cư vào Nam lập nghiệp. Nhờ nguồn gạo thơm địa phương cùng nắng gió biển đặc thù, bánh tráng An Ngãi có độ dẻo dai tự nhiên, khi nướng giòn rụm hoặc dùng cuốn chả giò, thịt luộc thì không cần nhúng nước mà vẫn mềm ngon.',
    culturalSignificance:
      'Làng nghề gìn giữ nét văn hóa ẩm thực bình dị mà thảo thơm của cư dân vùng ven biển. Sản phẩm bánh tráng gạo, bánh tráng ngọt mè đường đã theo chân kiều bào và du khách khắp mọi miền đất nước.',
    specialHighlights: [
      'Hình ảnh những giàn bánh tráng trải dài ngút ngầm dưới nắng sớm tinh mơ',
      'Đôi tay thoăn thoắt múc bột, láng bánh mỏng tang và dùng nẹp tre vớt bánh tài tình',
      'Thưởng thức bánh tráng nướng mè giòn tan ngay tại lò còn ấm nóng',
      'Mua đặc sản bánh tráng cuốn gỏi cá mai và chả giò trứ danh Long Điền',
    ],
    visitingTips: 'Thời điểm chụp ảnh đẹp nhất là từ 8:00 đến 11:00 sáng khi người dân đem các liếp bánh ra phơi nắng.',
  },
  {
    id: 'vung-tau-thich-ca-phat-dai',
    name: 'Quần thể Kiến trúc Phật giáo Thích Ca Phật Đài',
    provinceId: 'ba-ria-vung-tau',
    category: 'architecture',
    address: 'Số 608 Trần Phú, Phường 5, TP. Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu',
    coords: { x: 71, y: 72, lat: 10.3705, lng: 107.0674 },
    era: 'Khởi công năm 1961 - Hoàn thành 1963',
    coverImage: '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
    galleryImages: [
      '/src/assets/images/vung_tau_coastal_heritage_1794323910537.jpg',
    ],
    shortIntro:
      'Di tích danh thắng tâm linh độc đáo trên sườn Núi Lớn, tái hiện cuộc đời Đức Phật Thích Ca qua quần thể tượng điêu khắc đồ sộ hòa mình giữa thiên nhiên thanh tịnh.',
    historicalStory:
      'Được khởi công xây dựng từ năm 1961 do sự phát tâm của Giáo hội Tăng già Nguyên thủy Việt Nam và đông đảo Phật tử khắp phương Nam. Quần thể rộng gần 6 ha được kiến tạo công phu theo triền núi thoai thoải, tạo nên một hành trình chiêm nghiệm từ lúc Phật Đản sinh, Xuất gia, Thành đạo cho đến khi nhập Niết bàn.',
    culturalSignificance:
      'Thích Ca Phật Đài là sự kết hợp hài hòa tuyệt đối giữa nghệ thuật kiến trúc tôn giáo và cảnh quan thiên nhiên sơn thủy hữu tình. Tượng Phật Thích Ca tọa thiền cao hơn 10m trên tòa sen nhìn ra vịnh Gành Rái là điểm tựa tâm linh vững chắc cho người dân miền biển.',
    specialHighlights: [
      'Tượng Phật Thích Ca Mâu Ni tọa thiền uy nghi đúc bằng bê tông cốt thép',
      'Tháp xá lợi Phật hình bát giác cao 17m chứa 13 viên ngọc xá lợi linh thiêng',
      'Cây Bồ Đề sum suê chiết từ cây Bồ Đề thiêng ở Bồ Đề Đạo Tràng (Ấn Độ)',
      'Không gian tĩnh lặng ngắm biển chiều gió mát rì rào giữa rừng thông',
    ],
    visitingTips: 'Trang phục lịch sự kín đáo khi tham quan các khu vực thờ phụng tâm linh.',
  },
  {
    id: 'vung-tau-binh-chau-nature',
    name: 'Khu Bảo tồn Thiên nhiên & Suối khoáng nóng Bình Châu',
    provinceId: 'ba-ria-vung-tau',
    category: 'nature',
    address: 'Xã Bình Châu, Huyện Xuyên Mộc, Tỉnh Bà Rịa - Vũng Tàu',
    coords: { x: 86, y: 62, lat: 10.5312, lng: 107.5381 },
    era: 'Khu bảo tồn thiên nhiên thành lập năm 1984',
    coverImage: '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    galleryImages: [
      '/src/assets/images/dong_nam_bo_landscape_1794323908424.jpg',
    ],
    shortIntro:
      'Rừng nguyên sinh ven biển Bình Châu - Phước Bửu kết hợp với nguồn khoáng nóng thiên nhiên 70 dòng lộ thiên kỳ thú, tạo nên quần thể sinh thái nghỉ dưỡng trứ danh.',
    historicalStory:
      'Năm 1928, nhà bác học người Pháp Albert Sallet đã khảo sát và phát hiện ra mạch nước khoáng nóng giàu bùn khoáng và khoáng chất quý tại vùng rừng tràm Bình Châu. Đến nay, hơn 70 điểm suối khoáng lộ thiên với nhiệt độ từ 37°C đến 82°C vẫn tuôn trào không ngừng giữa thảm rừng tràm nguyên sinh ven biển duy nhất của Đông Nam Bộ.',
    culturalSignificance:
      'Bình Châu là món quà quý giá của địa chất phương Nam, kết nối lối sống nghỉ dưỡng chữa lành với thiên nhiên. Nơi đây là môi trường sinh sống của nhiều loài chim thú quý hiếm ghi tên trong Sách Đỏ Việt Nam.',
    specialHighlights: [
      'Trải nghiệm luộc trứng gà trong dòng giếng khoáng nóng tự nhiên 82°C',
      'Ngâm mình thư giãn trong bồn khoáng bùn trầm tích ngàn năm',
      'Đi bộ dưới tán rừng tràm cổ thụ ngắm hồ Suối Nhum thanh bình',
      'Tìm hiểu văn hóa đánh bắt hải sản ven biển của ngư dân làng chài Bình Châu',
    ],
    visitingTips: 'Rất thích hợp cho các chuyến đi phục hồi sức khỏe, chăm sóc thể chất và tinh thần.',
  },
];
