// Danh sách các gói sản phẩm dựa trên bảng thông tin
export const PLANS = [
  {
    name: "Dùng thử",
    price: 19000,
    duration_in_days: 30,
    description: "Dùng thử 7 ngày, sau đó là 19.000đ/tháng",
    features: [
      "2 link profile",
      "0 template",
      "0 domain riêng",
      "1 danh thiếp",
      "Không cấp thẻ",
      "Không có thẻ vật lý"
    ],
    max_storage: 0,
    max_share_links: 2,
    priority_support: false,
  },
  {
    name: "Tiêu chuẩn",
    price: 19000,
    duration_in_days: 30,
    description: "Gói tiêu chuẩn cho cá nhân",
    features: [
      "4 link profile/1 danh thiếp",
      "3 template",
      "0 domain riêng",
      "1 danh thiếp",
      "Không cấp thẻ",
      "Thẻ vật lý: 39.000đ"
    ],
    max_storage: 0,
    max_share_links: 4,
    priority_support: false,
    note: "Dùng được 4 tháng"
  },
  {
    name: "Đặc biệt",
    price: 59000,
    duration_in_days: 30,
    description: "Gói đặc biệt cho cá nhân nâng cao",
    features: [
      "10 link profile/1 thanh thiếp",
      "6 template",
      "Có domain riêng",
      "3 danh thiếp",
      "Không cấp thẻ",
      "Thẻ vật lý: 39.000đ"
    ],
    max_storage: 0,
    max_share_links: 10,
    priority_support: false,
    note: ""
  },
  {
    name: "Thành viên",
    price: 139000,
    duration_in_days: 30,
    description: "Gói thành viên cao cấp",
    features: [
      "7 link profile",
      "12 template",
      "Có domain riêng",
      "5 danh thiếp",
      "Không cấp thẻ",
      "Thẻ vật lý: 39.000đ"
    ],
    max_storage: 0,
    max_share_links: 7,
    priority_support: false,
    note: "Dùng được 4 tháng"
  }
];
