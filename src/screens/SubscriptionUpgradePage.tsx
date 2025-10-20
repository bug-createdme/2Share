"use client";

import React, { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";

const SubscriptionUpgradePage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const monthlyPrice = 59000;
  const yearlyPrice = monthlyPrice * 12 * 0.9; // 10% discount

  return (
    <div className="min-h-screen bg-white font-spartan text-gray-800 px-8 py-10">
      {/* Back Link */}
     
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col items-start">
            {/* Logo */}
            <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8 object-contain mb-12"
            />

            {/* Back button */}
            <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#8A2EA9] hover:text-[#6f2488] transition-colors"
            >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-medium">Trở lại</span>
            </button>
        </div>
        </div>



      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
        {/* LEFT SECTION */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Nâng cấp gói đăng ký</h1>

          <div className="space-y-2 ml-6 mb-12">
            <div className="flex items-center gap-2 ">
              <Check className="w-5 h-5 text-green-600" />
              <span>Tự thiết kế trang Portfolio</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Check className="w-5 h-5 text-green-600" />
              <span>Tự thiết kế thẻ NFC</span>
            </div>
          </div>

          {/* PAYMENT FORM */}
          <h2 className="mt-10 text-2xl font-semibold mb-6">Thanh toán</h2>

          <div className="space-y-6">
            {/* Card number */}
            <div>
              <label className="block text-sm font-semibold mb-2">Số thẻ ngân hàng</label>
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none"
              />
            </div>

            {/* Expiry + CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Ngày hết hạn</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Mã xác minh thẻ</label>
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            {/* Billing Info */}
            <h3 className="text-2xl font-semibold mt-10">Chi tiết thanh toán</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-gray-100 px-4 py-3 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="mt-20 rounded-3xl border border-black">
          {/* Subscription Box */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Gói đăng ký của bạn</h2>

            <div>
              <label className="block text-sm font-semibold mb-3">Chu kỳ thanh toán</label>
              <div className="space-y-4">
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    billingCycle === "monthly" ? "border-black" : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    checked={billingCycle === "monthly"}
                    onChange={() => setBillingCycle("monthly")}
                    className="accent-black"
                  />
                  <span className="font-medium">Mỗi tháng</span>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                    billingCycle === "yearly" ? "border-black" : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    checked={billingCycle === "yearly"}
                    onChange={() => setBillingCycle("yearly")}
                    className="accent-black"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Mỗi năm</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                      Tiết kiệm 10%
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="flex pt-8 px-8 border-gray-200 gap-1">
            <div className="text-sm text-gray-500 mb-1">Hết hạn vào </div>
            <div className="text-sm font-semibold text-gray-800"> 02/08/2025</div>
          </div>

          {/* Price */}
          <div className="px-8 pb-8 pt-4 border-b border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Thanh toán</div>
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                {billingCycle === "monthly"
                    ? `${monthlyPrice.toLocaleString("vi-VN")} vnd`
                    : `${yearlyPrice.toLocaleString("vi-VN")} vnd`}
                </div>
                {billingCycle === "yearly" && (
                <div className="text-sm text-green-600">
                    Tiết kiệm {(monthlyPrice * 12 * 0.1).toLocaleString("vi-VN")} vnd
                </div>
                )}
            </div>
          </div>

          {/* Button */}
          <div className="pt-8 px-8 py-4">
            <button className="w-full bg-green-400 text-white py-4 rounded-xl font-semibold hover:bg-green-500 transition-all">
              Thanh toán
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Thanh toán được bảo mật và mã hóa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgradePage;
