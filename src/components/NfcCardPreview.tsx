import React from "react";
import { FaSignal } from "react-icons/fa6";
import { IoQrCodeOutline } from "react-icons/io5";

interface MbtiTemplate {
  id: string;
  name: string;
  group: string;
  groupVi: string;
  previewUrl: string;
  isLocked: boolean;
}

interface NFCCardPreviewProps {
  themeClasses: Record<string, string>;
  selectedTheme: string;
  userName: string;
  userCategory: string;
  selectedMbtiTemplate?: MbtiTemplate | null;
  user?: any;
  logoUrl?: string | null; 
}

const NFCCardPreview: React.FC<NFCCardPreviewProps> = ({
  themeClasses,
  selectedTheme,
  userName,
  userCategory,
  selectedMbtiTemplate,
  logoUrl
}) => {
  const isMbtiCard = !!selectedMbtiTemplate;

  return (
    <div className="w-70 py-24 px-14 mx-auto bg-white border-l border-gray-200 fixed top-0 right-0 h-screen overflow-hidden z-40">
      <div className="flex flex-col items-center gap-6">
        {/* FRONT SIDE */}
        <div className="flex flex-col items-center gap-2">
          {isMbtiCard ? (
            /* MBTI CARD - PORTRAIT với chiều cao bằng chiều dài thẻ landscape */
            <div className="flex items-center gap-4">
              <div className="w-44 h-72 rounded-2xl relative shadow-2xl overflow-hidden border-2 border-gray-300">
                <img
                  src={selectedMbtiTemplate.previewUrl}
                  alt={`MBTI ${selectedMbtiTemplate.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback nếu hình ảnh không load được
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='176' height='288' viewBox='0 0 176 288'%3E%3Crect width='176' height='288' fill='%23f0f0f0'/%3E%3Ctext x='88' y='144' text-anchor='middle' fill='%23999' font-family='Arial' font-size='18'%3E" + selectedMbtiTemplate.name + "%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              {/* Chữ "Mặt trước" nằm bên phải hình */}
              <p className="text-gray-500 text-sm whitespace-nowrap">Mặt trước (MBTI)</p>
            </div>
          ) : (
            /* REGULAR CARD - LANDSCAPE (GIỮ NGUYÊN) */
            <>
              <div
                className={`w-72 h-44 rounded-2xl bg-gradient-to-br ${themeClasses[selectedTheme]} relative shadow-lg flex flex-col justify-between p-4 text-white`}
              >
                {/* Logo của bạn - hiển thị nếu có logoUrl */}
                {logoUrl ? (
                  <div className="absolute top-4 left-4 flex items-center justify-center w-14 h-14">
                    <img 
                      src={logoUrl} 
                      alt="Your Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  /* Logo mặc định 2SHARE nếu không có logoUrl */
                  <div className="absolute top-4 left-4 flex items-center justify-center w-14 h-14">
                    <img 
                      src="/images/2share01_logo.PNG" 
                      alt="2SHARE Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="absolute top-4 right-4 text-white/90 text-lg">
                  <FaSignal />
                </div>

                <div className="absolute bottom-6 left-4">
                  <h3 className="text-base font-semibold tracking-wide">{userName}</h3>
                  <p className="text-sm opacity-90">{userCategory}</p>
                </div>

                <div className="absolute bottom-4 right-4 w-14 h-14 bg-white/10 rounded-lg border border-white flex items-center justify-center">
                  <IoQrCodeOutline className="text-xl text-white/80" />
                </div>
              </div>
              <p className="text-gray-500 text-sm">Mặt trước</p>
            </>
          )}
        </div>

        {/* BACK SIDE */}
        <div className="flex flex-col items-center gap-2">
          {isMbtiCard ? (
            /* MBTI BACK SIDE - PORTRAIT với thiết kế đơn giản, màu trắng */
            <div className="flex items-center gap-4">
              <div className="w-44 h-72 rounded-2xl relative shadow-2xl overflow-hidden border-2 border-gray-300 bg-white p-4">
                {/* Nội dung mặt sau thẻ MBTI - đơn giản với các đường kẻ */}
                <div className="h-full flex flex-col justify-between">
                  {/* Tiêu đề */}
                  <div className="text-center mb-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>

                  {/* Các đường kẻ tượng trưng cho thông tin */}
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>

                  {/* Đoạn text block */}
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-300 rounded"></div>
                    <div className="h-2 bg-gray-300 rounded"></div>
                    <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  </div>

                  {/* Thông tin liên hệ */}
                  <div className="text-center text-xs text-gray-500">
                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3 mx-auto"></div>
                  </div>
                </div>
              </div>
              {/* Chữ "Mặt sau" nằm bên phải hình */}
              <p className="text-gray-500 text-sm whitespace-nowrap">Mặt sau (MBTI)</p>
            </div>
          ) : (
            /* REGULAR BACK SIDE - LANDSCAPE (GIỮ NGUYÊN) */
            <>
              <div
                className={`w-72 h-44 rounded-2xl bg-gradient-to-br ${themeClasses[selectedTheme]} relative shadow-lg flex items-center justify-center`}
              >
                
                  <div className="flex items-center justify-center w-20 h-20">
                    <img 
                      src="/images/2share01_logo.PNG" 
                      alt="2SHARE Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
              
              </div>
              <p className="text-gray-500 text-sm">Mặt sau</p>
            </>
          )}
        </div>

        {/* Thông tin template MBTI đang chọn */}
        {isMbtiCard && (
          <div className="bg-gray-50 rounded-2xl p-4 mt-2 border border-gray-200 max-w-72 text-center">
            <h4 className="font-semibold text-gray-800 mb-1">{selectedMbtiTemplate.name}</h4>
            <p className="text-sm text-gray-600">{selectedMbtiTemplate.groupVi}</p>
            <p className="text-xs text-gray-500 mt-1">Thiết kế MBTI độc quyền</p>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default NFCCardPreview;