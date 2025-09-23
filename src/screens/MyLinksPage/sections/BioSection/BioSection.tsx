import { EditIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const BioSection = (): JSX.Element => {
  return (
    <section className="w-full max-w-[608px] mx-auto translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
      <Card className="relative bg-white rounded-[35px] border border-solid border-[#6e6e6e] min-h-[203px]">
        <CardContent className="p-8 relative">
          <button className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <EditIcon className="w-5 h-5 text-gray-600" />
          </button>

          <div className="pr-12 mb-6">
            <p className="[font-family:'Carlito',Helvetica] font-normal text-black text-base tracking-[1.60px] leading-normal">
              Mình là username_123, sinh viên thiết kế đồ họa với niềm yêu thích
              sáng tạo và sự chỉn chu trong từng chi tiết.
              <br />
              Mình tập trung vào thiết kế thương hiệu, UI và minh họa số, với
              mong muốn tạo ra những trải nghiệm có chiều sâu.
              <br />
              Theo dõi mình để cùng khám phá hành trình thiết kế và phát triển
              bản thân mỗi ngày nhé!
            </p>
          </div>

          <div className="absolute bottom-6 right-6">
            <span className="[font-family:'Carlito',Helvetica] font-normal text-[#6e6e6e] text-[15px] tracking-[1.50px] leading-normal">
              310/350
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
