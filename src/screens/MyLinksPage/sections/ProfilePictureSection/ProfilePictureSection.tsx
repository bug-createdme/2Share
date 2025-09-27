// ...existing code...
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";


export const ProfilePictureSection = ({ user, bio, socialLinks }: { user: any; bio: string; socialLinks: import("../SocialLinksSection/SocialLinksSection").SocialLink[] }): JSX.Element => {
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


  return (
    <div className="w-[300px] h-[650px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
      <Card className="w-full h-full bg-[#e7a5a5] rounded-[25px] border-none shadow-xl overflow-hidden">
        <CardContent
          className="flex flex-col p-0 h-full custom-scrollbar"
          style={{ maxHeight: 600, overflowY: 'auto' }}
        >
          <div className="flex flex-col items-center mt-[40px]">
            <div className="flex flex-col items-center">
              <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center border border-[#e0e0e0]">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar"
                  src={user.avatar_url || "https://c.animaapp.com/mfwch0g78qp4H9/img/profile-picture-2.png"}
                />
              </div>
              <div className="mt-4 font-bold text-lg text-[#222] tracking-wide text-center">
                @{user.username}
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
            <div className="relative w-[212px] min-h-[60px] flex items-center justify-center">
              <div className="absolute top-0 left-0 w-[210px] min-h-[60px] bg-white rounded-[10px] shadow-[0px_0px_58px_12px_#c76a6a40]" />
              <div
                className="relative w-[180px] [font-family:'Itim',Helvetica] font-normal text-[#e28e8e] text-sm tracking-[1.40px] leading-[normal] transition-all duration-200 px-2 py-1"
                style={{ minHeight: 20, maxHeight: 60, overflowY: 'auto', height: 'auto', wordBreak: 'break-word' }}
              >
                {bio}
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
