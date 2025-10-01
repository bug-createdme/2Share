import React from "react";

const SuccessPage: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ color: "green" }}>Thanh toán thành công!</h1>
      <p>Cảm ơn bạn đã hoàn tất giao dịch.</p>
      <a href="/" style={{ marginTop: 16, color: "#2563eb" }}>Quay về trang chủ</a>
    </div>
  );
};

export default SuccessPage;
