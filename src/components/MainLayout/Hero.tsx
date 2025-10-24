import React from 'react'

const Hero: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-3xl">
          <h1 className="text-[#D48A8A] font-['Unbounded'] text-6xl leading-[80px] mb-8 font-semibold">
            Không còn hỏi<br />
            'Link ở đâu?'<br />
            chỉ cần 2Share!
          </h1>
          
          <p className="text-[#440808] font-spartan text-2xl leading-[30px] mb-12 max-w-2xl">
            Tạo hồ sơ cá nhân siêu tốc, gom mọi liên kết quan trọng về một nơi.<br />
            Chia sẻ profile của bạn qua link, QR hoặc NFC – cực tiện lợi, cực chuyên nghiệp.
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="bg-[#ece6e6] rounded-[10px] py-4 pl-6 pr-2 flex items-center w-[270px]">
              <span className="text-[#A18686] font-['League_Spartan'] font-bold text-xl mr-2 select-none">
                2sha.re/
              </span>
              <input
                type="text"
                placeholder="tên-của-bạn"
                className="bg-transparent outline-none text-[#A18686] font-['League_Spartan'] font-bold text-xl flex-1 min-w-0 placeholder-[#A18686]"
                style={{ paddingLeft: 0 }}
              />
            </div>
            <button className="bg-[#dea2a2] text-black font-['League_Spartan'] font-bold text-xl px-8 py-4 rounded-[20px] hover:bg-[#B88484] transition-colors">
              Nhận tên của bạn
            </button>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-16">
          <div className="relative">
            <img
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/MFrg9GUwY3.png"
              alt="Mobile App Preview"
              className="w-[283px] h-[529px] rounded-[40px] shadow-[0px_4px_80px_rgba(0,0,0,0.55)] border-[16px] border-white/8"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Hero
