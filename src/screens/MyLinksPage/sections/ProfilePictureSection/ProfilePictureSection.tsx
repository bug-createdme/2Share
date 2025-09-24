import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const ProfilePictureSection = (): JSX.Element => {
  const socialIcons = [
    {
      src: "https://c.animaapp.com/mfwch0g78qp4H9/img/social-icons-2.svg",
      alt: "Social icons",
    },
    {
      src: "https://c.animaapp.com/mfwch0g78qp4H9/img/social-icons-9.svg",
      alt: "Social icons",
    },
    {
      src: "https://c.animaapp.com/mfwch0g78qp4H9/img/social-icons.svg",
      alt: "Social icons",
    },
    {
      src: "https://c.animaapp.com/mfwch0g78qp4H9/img/social-icons-7.svg",
      alt: "Social icons",
    },
    {
      src: "https://c.animaapp.com/mfwch0g78qp4H9/img/behance.svg",
      alt: "Behance",
    },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: "https://c.animaapp.com/mfwch0g78qp4H9/img/social-icons-3.svg",
    },
    {
      name: "Behance",
      icon: "https://c.animaapp.com/mfwch0g78qp4H9/img/behance.svg",
    },
    {
      name: "Instagram",
      icon: "https://c.animaapp.com/mfwch0g78qp4H9/img/social-icons-1.svg",
    },
  ];

  return (
    <div className="w-[300px] h-[650px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
      <Card className="w-full h-full bg-[#e7a5a5] rounded-[25px] border-[3px] border-solid border-[#6e6e6e] overflow-hidden">
        <CardContent className="flex flex-col p-0 h-full">
          <div className="flex flex-col items-center mt-[45px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <div className="relative w-[149px] h-[130px]">
              <img
                className="absolute top-[-45px] left-[-7px] w-[207px] h-[198px]"
                alt="Profile picture"
                src="https://c.animaapp.com/mfwch0g78qp4H9/img/profile-picture-2.png"
              />
              <div className="absolute top-[106px] left-[calc(50.00%_-_74px)] [font-family:'Itim',Helvetica] text-white text-xl tracking-[2.00px] whitespace-nowrap font-normal leading-[normal]">
                username_123
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-2 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            <div className="flex gap-5">
              {socialIcons.map((icon, index) => (
                <img
                  key={index}
                  className={
                    index === 4
                      ? "w-[23.37px] h-[23.37px]"
                      : "mt-[1.7px] w-[20.03px] h-[20.03px]"
                  }
                  alt={icon.alt}
                  src={icon.src}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-[20.6px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
            <div className="relative w-[212px] h-[268px]">
              <div className="absolute top-0 left-0 w-[210px] h-[268px] bg-white rounded-[10px] shadow-[0px_0px_58px_12px_#c76a6a40]" />
              <div className="absolute top-[calc(50.00%_-_119px)] left-[calc(50.00%_-_91px)] w-[180px] [font-family:'Itim',Helvetica] font-normal text-[#e28e8e] text-sm tracking-[1.40px] leading-[normal]">
                Mình là username_123, sinh viên thiết kế đồ họa với niềm yêu
                thích sáng tạo và sự chỉn chu trong từng chi tiết.
                <br />
                Mình tập trung vào thiết kế thương hiệu, UI và minh họa số, với
                mong muốn tạo ra những trải nghiệm có chiều sâu.
                <br />
                Theo dõi mình để cùng khám phá hành trình thiết kế và phát triển
                bản thân mỗi ngày nhé!
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-6 gap-[4.9px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
            {socialLinks.map((link, index) => (
              <div key={index} className="w-[212px] h-[39.09px] relative">
                <Button
                  variant="outline"
                  className="w-[210px] h-[39px] rounded-[10px] border-2 border-solid border-white bg-transparent hover:bg-white/10 transition-colors h-auto"
                >
                  <img
                    className="absolute top-[11px] left-[11px] w-[18px] h-[18px]"
                    alt={link.name}
                    src={link.icon}
                  />
                  <span className="[font-family:'Itim',Helvetica] font-normal text-white text-sm tracking-[1.40px] leading-[normal]">
                    {link.name}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
