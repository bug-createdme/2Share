import React from "react";

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
  userName,
  userCategory,
  selectedMbtiTemplate,
}) => {
  const isMbtiCard = !!selectedMbtiTemplate;

  return (
    <div className="w-96 py-8 px-8 mx-auto bg-white border-l border-gray-200 fixed top-0 right-0 h-screen overflow-y-auto">
      <div className="flex flex-col items-start gap-8 pt-20">
        {/* FRONT SIDE - CHỈ HIỂN THỊ MBTI */}
        <div className="flex items-start gap-6 w-full">
          {isMbtiCard ? (
            <>
              <div className="relative group flex-shrink-0">
                <div className="w-52 h-80 rounded-2xl relative shadow-2xl overflow-hidden border-2 border-gray-300 transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={selectedMbtiTemplate.previewUrl}
                    alt={`MBTI ${selectedMbtiTemplate.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='208' height='320' viewBox='0 0 208 320'%3E%3Crect width='208' height='320' fill='%23f0f0f0'/%3E%3Ctext x='104' y='160' text-anchor='middle' fill='%23999' font-family='Arial' font-size='18'%3E" + selectedMbtiTemplate.name + "%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h4 className="text-white font-bold text-lg">{userName}</h4>
                    <p className="text-white/80 text-sm">{userCategory}</p>
                  </div>
                </div>
                {/* MBTI Badge */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {selectedMbtiTemplate.name}
                </div>
              </div>
              <div className="flex flex-col justify-center h-80">
                <p className="text-gray-500 text-sm font-medium">Mặt trước (MBTI)</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6 w-full">
              <div className="w-52 h-80 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 flex-shrink-0">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-xl">?</span>
                  </div>
                  <p className="text-gray-500 text-sm">Chọn MBTI</p>
                </div>
              </div>
              <div className="flex flex-col justify-center h-80">
                <p className="text-gray-500 text-sm font-medium">Mặt trước</p>
                <p className="text-gray-400 text-sm mt-2">Vui lòng chọn một tính cách MBTI</p>
              </div>
            </div>
          )}
        </div>

        {/* BACK SIDE - CHỈ HIỂN THỊ MBTI */}
        <div className="flex items-start gap-6 w-full">
          {isMbtiCard ? (
            <>
              <div className="w-52 h-80 rounded-2xl relative shadow-2xl overflow-hidden border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white p-6 flex-shrink-0">
                <div className="h-full flex flex-col justify-between">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="w-20 h-7 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xs font-bold">
                      {selectedMbtiTemplate.name}
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-2">{selectedMbtiTemplate.groupVi}</h4>
                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="font-semibold text-gray-800 text-lg">{userName}</h4>
                      <p className="text-gray-600 text-sm mt-1">{userCategory}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Quét NFC để kết nối</p>
                    <p className="text-xs text-gray-400">Thiết kế MBTI độc quyền</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center h-80">
                <p className="text-gray-500 text-sm font-medium">Mặt sau (Thông tin)</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6 w-full">
              <div className="w-52 h-80 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                <p className="text-gray-400 text-sm text-center">Mặt sau sẽ hiển thị<br />sau khi chọn MBTI</p>
              </div>
              <div className="flex flex-col justify-center h-80">
                <p className="text-gray-500 text-sm font-medium">Mặt sau</p>
              </div>
            </div>
          )}
        </div>

        {/* Selected Template Info */}
        {isMbtiCard && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg w-full">
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 text-lg mb-2">{selectedMbtiTemplate.name}</h4>
              <p className="text-gray-600 mb-3">{selectedMbtiTemplate.groupVi}</p>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto"></div>
              <p className="text-xs text-gray-500 mt-3">Thiết kế MBTI độc quyền</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFCCardPreview;