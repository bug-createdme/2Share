import React from "react";

const CancelPage: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ color: "red" }}>Thanh toán đã bị hủy</h1>
      <p>Giao dịch của bạn đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
      <a href="/" style={{ marginTop: 16, color: "#2563eb" }}>Quay về trang chủ</a>
    </div>
  );
};

export default CancelPage;
