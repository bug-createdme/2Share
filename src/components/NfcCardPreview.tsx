import React from "react";
import { FaSignal } from "react-icons/fa6";
import { IoQrCodeOutline } from "react-icons/io5";

interface NFCCardPreviewProps {
  themeClasses: Record<string, string>;
  selectedTheme: string;
  userName: string;
  userCategory: string;
  user?: any;
}

const NFCCardPreview: React.FC<NFCCardPreviewProps> = ({
  themeClasses,
  selectedTheme,
  userName,
  userCategory,
}) => {
  return (
    <div className="w-70 py-24 px-14 mx-auto bg-white border-l border-gray-200 fixed top-0 right-0 h-screen overflow-hidden z-40">
      <div className="flex flex-col items-center gap-6">
        {/* FRONT SIDE */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-72 h-44 rounded-2xl bg-gradient-to-br ${themeClasses[selectedTheme]} relative shadow-lg flex flex-col justify-between p-4 text-white`}
          >
            {/* Logo top-left - Using your custom logo */}
            <div className="absolute top-4 left-4 flex items-center justify-center w-14 h-14">
              <img 
                src="/images/2share01_logo.PNG" 
                alt="2SHARE Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* NFC Wave icon top-right */}
            <div className="absolute top-4 right-4 text-white/90 text-lg">
              <FaSignal />
            </div>

            {/* User info */}
              <div className="absolute bottom-6 left-4">
                <h3 className="text-base font-semibold tracking-wide">{userName}</h3>
                <p className="text-sm opacity-90">{userCategory}</p>
              </div>


            {/* QR placeholder bottom-right */}
            <div className="absolute bottom-4 right-4 w-14 h-14 bg-white/10 rounded-lg border border-white flex items-center justify-center">
              <IoQrCodeOutline className="text-xl text-white/80" />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Mặt trước</p>
        </div>

        {/* BACK SIDE */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-72 h-44 rounded-2xl bg-gradient-to-br ${themeClasses[selectedTheme]} relative shadow-lg flex items-center justify-center`}
          >
            {/* Logo in the center for back side */}
            <div className="flex items-center justify-center w-20 h-20">
              <img 
                src="/images/2share01_logo.PNG" 
                alt="2SHARE Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <p className="text-gray-500 text-sm">Mặt sau</p>
        </div>
      </div>
    </div>
  );
};

export default NFCCardPreview;
