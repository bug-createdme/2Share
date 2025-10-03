
import { useEffect, useState } from "react";
import PaymentButton from "../components/PaymentButton";
import { ArrowLeft } from 'lucide-react';
import { getPlans } from "../lib/plan/api";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const token = localStorage.getItem("token");
        const apiPlans = await getPlans(token || undefined);
        setPlans(Array.isArray(apiPlans.result) ? apiPlans.result : []);
      } catch {
        setPlans([]);
      }
    }
    fetchPlans();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 relative">
      <button
        onClick={() => window.history.back()}
        className="absolute left-0 top-0 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-700 bg-white rounded-full shadow transition-all border border-gray-200 mt-4 ml-2 z-10"
        style={{ minWidth: 0 }}
        aria-label="Quay lại"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-base hidden sm:inline">Quay lại</span>
      </button>
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight">Các gói sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan: any, idx: number) => (
          <div
            key={plan._id}
            className={
              `flex flex-col items-center rounded-3xl shadow-xl border border-gray-200 bg-white p-8 transition-transform hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden` +
              (idx === 0 ? ' border-2 border-green-400' : '')
            }
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center tracking-wide">{plan.name}</h2>
            <div className="text-3xl font-extrabold text-green-600 mb-1">{plan.price?.toLocaleString?.() ?? plan.price}<span className="text-lg font-medium">đ</span> <span className="text-base font-semibold text-gray-500">/ tháng</span></div>
            <div className="mb-4 text-gray-600 text-center text-base min-h-[48px]">{plan.description}</div>
            {plan.features && Array.isArray(plan.features) && (
              <ul className="mb-4 text-sm text-gray-700 space-y-1 w-full">
                {plan.features.map((f: string) => <li key={f} className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>{f}</li>)}
              </ul>
            )}
            <div className="mt-auto w-full flex justify-center">
              <PaymentButton plan={plan} />
            </div>
            {idx === 0 && (
              <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow">Phổ biến</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
