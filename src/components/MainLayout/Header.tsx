import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <nav className="bg-[#f3b4c3] rounded-[35px] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-14">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-09-09/Ut2E6nUPhe.png" 
              alt="2Share Logo" 
              className="h-8 w-auto ml-4"
            />
            
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              className="bg-[#f2e4e4] text-black font-bold text-xl font-spartan px-4 py-2 rounded-[10px] hover:bg-gray-300 transition-colors"
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </button>
            <button
              className="bg-[#161515] text-[#FCF1F1] font-bold text-xl font-spartan px-6 py-2 rounded-[30px] hover:bg-gray-800 transition-colors"
              onClick={() => navigate('/register')}
            >
              Đăng ký miễn phí
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
