"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "vi";

interface Translations {
  [key: string]: {
    en: string;
    vi: string;
  };
}

const translations: Translations = {
  dashboard: { en: "Dashboard", vi: "Bảng điều khiển" },
  staffs: { en: "Staffs", vi: "Nhân viên" },
  customers: { en: "Customers", vi: "Khách hàng" },
  products: { en: "Products", vi: "Sản phẩm" },
  orders: { en: "Orders", vi: "Đơn hàng" },
  brands: { en: "Brands", vi: "Thương hiệu" },
  analytics: { en: "Analytics", vi: "Phân tích" },
  settings: { en: "Settings", vi: "Cài đặt" },
  reviews: { en: "Reviews", vi: "Đánh giá" },
  adminControl: { en: "Admin Control", vi: "Quản trị viên" },
  searchAnything: { en: "Search anything...", vi: "Tìm kiếm..." },
  logout: { en: "Log Out Account", vi: "Đăng xuất" },
  signedIn: { en: "Signed in", vi: "Đã đăng nhập" },
  brandManagement: { en: "Brand Management", vi: "Quản lý thương hiệu" },
  searchBrands: { en: "Search brands...", vi: "Tìm kiếm thương hiệu..." },
  addBrand: { en: "Add Brand", vi: "Thêm thương hiệu" },
  name: { en: "Name", vi: "Tên" },
  slug: { en: "Slug", vi: "Đường dẫn" },
  status: { en: "Status", vi: "Trạng thái" },
  actions: { en: "Actions", vi: "Thao tác" },
  active: { en: "Active", vi: "Hoạt động" },
  inactive: { en: "Inactive", vi: "Vô hiệu" },
  
  // Product Management
  productManagement: { en: "Product Management", vi: "Quản lý sản phẩm" },
  manageTechDevices: { en: "Manage tech devices, configurations, and pricing variants.", vi: "Quản lý thiết bị, cấu hình và các phiên bản giá bán." },
  addProduct: { en: "Add Product", vi: "Thêm sản phẩm" },
  searchProduct: { en: "Search product name, brand or SKU...", vi: "Tìm tên sản phẩm, thương hiệu hoặc mã SKU..." },
  edit: { en: "Edit", vi: "Chỉnh sửa" },
  delete: { en: "Delete", vi: "Xóa" },
  brand: { en: "Brand", vi: "Thương hiệu" },
  category: { en: "Category", vi: "Danh mục" },
  basePrice: { en: "Base Price", vi: "Giá cơ bản" },
  description: { en: "Description", vi: "Mô tả" },
  configurationsAndPricing: { en: "Configurations & Pricing", vi: "Cấu hình & Giá bán" },
  addVariant: { en: "+ Add Variant", vi: "+ Thêm cấu hình" },
  variantTitle: { en: "Variant", vi: "Cấu hình" },
  ram: { en: "RAM", vi: "RAM" },
  storage: { en: "Storage", vi: "Bộ nhớ" },
  color: { en: "Color", vi: "Màu sắc" },
  sku: { en: "SKU / Code", vi: "Mã SKU" },
  price: { en: "Price (VND)", vi: "Giá bán (VND)" },
  stock: { en: "Stock Qty", vi: "Tồn kho" },
  generatedDisplayName: { en: "Generated Display Name", vi: "Tên hiển thị tự động" },
  saveChanges: { en: "Save Changes", vi: "Lưu thay đổi" },
  createProduct: { en: "Create Product", vi: "Tạo sản phẩm" },
  selectBrand: { en: "Select Brand", vi: "Chọn thương hiệu" },
  selectCategory: { en: "Select Category", vi: "Chọn danh mục" },
  newProduct: { en: "New Product", vi: "Sản phẩm mới" },
  editProduct: { en: "Edit Product", vi: "Sửa sản phẩm" },
  autoWriteAI: { en: "AI Auto-Write", vi: "AI Viết hộ" },
  technicalSpecs: { en: "Technical Specs", vi: "Thông số kỹ thuật" },
  noSpecsAdded: { en: "No Technical specs added yet", vi: "Chưa có thông số kỹ thuật nào" },
  specName: { en: "Spec Name (e.g. CPU)", vi: "Tên thông số (VD: CPU)" },
  specValue: { en: "Spec Value (e.g. M3 Max)", vi: "Giá trị (VD: M3 Max)" },
  detailsReview: { en: "Detailed Review", vi: "Đánh giá chi tiết" },
  addSpec: { en: "Add Spec", vi: "Thêm thông số" },
  colorImage: { en: "Color Image", vi: "Ảnh theo màu" },
  uploadImage: { en: "Upload Image", vi: "Tải ảnh lên" },
  originalPrice: { en: "Original Price", vi: "Giá gốc" },
  
  // Categories
  SMARTPHONE: { en: "Smartphone", vi: "Điện thoại" },
  LAPTOP: { en: "Laptop", vi: "Máy tính xách tay" },
  TABLET: { en: "Tablet", vi: "Máy tính bảng" },
  SMARTWATCH: { en: "Watch", vi: "Đồng hồ thông minh" },
  AUDIO: { en: "Audio", vi: "Thiết bị âm thanh" },
  ACCESSORIES: { en: "Accessories", vi: "Phụ kiện" },
  COMPONENT: { en: "Component", vi: "Linh kiện" },
  OTHER: { en: "Other", vi: "Khác" },

  // Dashboard & Staff translations
  allSystemsNominal: { en: "All systems nominal.", vi: "Toàn bộ hệ thống ổn định." },
  commandCenterConnected: { en: "Your command center is connected. Live data streaming in real-time.", vi: "Trung tâm điều khiển đã kết nối. Luồng dữ liệu hoạt động theo thời gian thực." },
  initiateSequence: { en: "Initiate Sequence", vi: "Bắt đầu chuỗi lệnh" },
  liveMap: { en: "Live Map", vi: "Bản đồ thực" },
  serverLoad: { en: "Server Load", vi: "Tải máy chủ" },
  activeUsers: { en: "Active Users", vi: "Người dùng HĐ" },
  totalRevenue: { en: "Total Revenue", vi: "Tổng doanh thu" },
  totalUsers: { en: "Total Users", vi: "Tổng người dùng" },
  activeOrders: { en: "Active Orders", vi: "Đơn hàng HĐ" },
  conversionRate: { en: "Conversion Rate", vi: "Tỷ lệ chuyển đổi" },
  liveTransactions: { en: "Live Transactions", vi: "Giao dịch trực tiếp" },
  realTimeStream: { en: "Real-time financial stream from all access points.", vi: "Luồng dữ liệu tài chính từ mọi điểm truy cập." },
  viewLedger: { en: "View Ledger", vi: "Xem sổ kế toán" },
  transactionId: { en: "Transaction ID", vi: "Mã giao dịch" },
  userProfile: { en: "User Profile", vi: "Hồ sơ" },
  volume: { en: "Volume", vi: "Khối lượng" },
  action: { en: "Action", vi: "Hành động" },
  networkLiquidity: { en: "Network Liquidity", vi: "Thanh khoản mạng" },
  netPositive: { en: "Net positive variance", vi: "Biến động tích cực" },
  systemLogs: { en: "System Logs", vi: "Nhật ký hệ thống" },
  exportAudit: { en: "Export Audit Trail", vi: "Xuất dữ liệu Logs" },
  
  staffMembers: { en: "Staff Members", vi: "Cộng sự" },
  addNew: { en: "ADD NEW", vi: "THÊM MỚI" },
  searchUsers: { en: "Search name, email...", vi: "Tìm tên, email hoặc SĐT..." },
  roleText: { en: "Role", vi: "Quyền hạn" },
  statusText: { en: "Status", vi: "Trạng thái" },
  memberCol: { en: "Member", vi: "Thành viên" },
  credentialCol: { en: "Credential", vi: "Chứng chỉ" },
  createdCol: { en: "Created", vi: "Ngày tạo" },
  noRecords: { en: "No records tracked", vi: "Không có dữ liệu" },
  dataVolume: { en: "Data volume", vi: "Dung lượng dữ liệu" },
  editAccess: { en: "EDIT ACCESS", vi: "SỬA QUYỀN TRUY CẬP" },
  newAccess: { en: "NEW ACCESS", vi: "CẤP QUYỀN TRUY CẬP MỚI" },
  adminPrivilege: { en: "Administrative Privilege Manager", vi: "Quản lý quyền quản trị" },
  accountCoreData: { en: "ACCOUNT CORE DATA", vi: "DỮ LIỆU TÀI KHOẢN" },
  identityName: { en: "Identity Name", vi: "Tên định danh" },
  emailEndpoint: { en: "Email Endpoint", vi: "Email" },
  masterPassword: { en: "Master Password", vi: "Mật khẩu chủ" },
  assignPrivilege: { en: "ASSIGN PRIVILEGE", vi: "GÁN QUYỀN HẠN" },
  extendedMetadata: { en: "EXTENDED METADATA", vi: "DỮ LIỆU MỞ RỘNG" },
  phone: { en: "Phone", vi: "SĐT" },
  workingAddress: { en: "Working Address", vi: "Địa chỉ làm việc" },
  commenceUpdate: { en: "COMMENCE UPDATE", vi: "TIẾN HÀNH CẬP NHẬT" },
  permanentlyDelete: { en: "Permanently Delete?", vi: "Xóa vĩnh viễn?" },
  deleteWarning: { en: "You are about to delete", vi: "Bạn đang chuẩn bị xóa định danh" },
  undoneWarning: { en: "This action cannot be undone.", vi: "Hành động này không thể hoàn tác." },
  confirmDelete: { en: "CONFIRM DELETE", vi: "XÁC NHẬN XÓA BỎ" },
  goBack: { en: "GO BACK", vi: "QUAY LẠI" },

  // Storefront Translations
  shopNow: { en: "Shop Now", vi: "Mua Sắm Ngay" },
  viewVideo: { en: "Watch Video", vi: "Xem Video" },
  newArrivals: { en: "New Arrivals", vi: "Sản phẩm mới" },
  featuredCollection: { en: "Featured Collection", vi: "Bộ sưu tập tiêu điểm" },
  exploreCategories: { en: "Explore Categories", vi: "Khám phá danh mục" },
  elevateLife: { en: "Elevate Your Digital Life", vi: "Nâng tầm cuộc sống kỹ thuật số" },
  heroSubtitle: { en: "FlashTech brings the most advanced devices, carefully selected to maximize your work and lifestyle.", vi: "FlashTech mang đến những thiết bị tối tân nhất, được tuyển chọn kỹ lưỡng để hỗ trợ tối đa cho công việc và phong cách sống của bạn." },
  customersActive: { en: "Active Customers", vi: "Khách hàng" },
  satisfactionRate: { en: "Satisfaction Rate", vi: "Hài lòng" },
  fastDelivery: { en: "Fast Delivery", vi: "Giao hàng nhanh" },
  home: { en: "Home", vi: "Trang chủ" },
  viewDetails: { en: "View Details", vi: "Xem chi tiết" },
  subscribeNewsletter: { en: "Ready for a tech leap?", vi: "Sẵn sàng cho bước nhảy vọt về công nghệ?" },
  subscribeSubtitle: { en: "Subscribe to our newsletter to never miss exclusive deals and limited product announcements.", vi: "Đăng ký nhận bản tin để không bỏ lỡ những đợt giảm giá độc quyền và thông báo về các sản phẩm giới hạn." },
  enterEmail: { en: "Your email address", vi: "Địa chỉ email của bạn" },
  subscribeBtn: { en: "Subscribe Now", vi: "Đăng Ký Ngay" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("flashtech-language") as Language;
    if (saved && (saved === "en" || saved === "vi")) {
      setLanguage(saved);
    }
    setIsInitialized(true);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("flashtech-language", lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  if (!isInitialized) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
