import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallbackHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (code) {
      // ...existing code...
    } else if (accessToken && refreshToken) {
      // Lưu token và chuyển hướng
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      navigate('/my-links');
    } else {
      // Xử lý trường hợp không có 'code' hoặc 'access_token' trong URL
      const errorDescription = searchParams.get('error');
      setError(errorDescription || 'Không tìm thấy mã ủy quyền hoặc access token trong URL.');
      setTimeout(() => navigate('/login'), 5000);
    }
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Đăng nhập thất bại</h1>
            <p className="text-gray-700">{error}</p>
            <p className="mt-4 text-sm text-gray-500">
              Bạn sẽ được chuyển hướng về trang đăng nhập sau giây lát...
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Đang xử lý đăng nhập...</h1>
            <p className="text-gray-600">Vui lòng đợi trong khi chúng tôi xác thực thông tin của bạn.</p>
            {/* Optional: Add a spinner */}
            <div className="mt-6">
              <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallbackHandler;
