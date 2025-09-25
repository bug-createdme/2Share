import { ArrowUpIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { BioSection } from "./sections/BioSection/BioSection";
import { NavigationMenuSection } from "./sections/NavigationMenuSection/NavigationMenuSection";
import { ProfilePictureSection } from "./sections/ProfilePictureSection/ProfilePictureSection";
import { SocialLinksSection } from "./sections/SocialLinksSection/SocialLinksSection";
import { getMyProfile } from "../../lib/api";

export const MyLinksPage = (): JSX.Element => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (err: any) {
        setError(err.message || "Lỗi lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải thông tin...</div>;
  }
  if (error || !user) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error || "Không có thông tin người dùng"}</div>;
  }

  return (
    <div className="bg-[#f7f7f7] w-full min-h-screen">
      {/* Left Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-[265px] bg-white z-20 border-r border-[#d9d9d9]">
  <NavigationMenuSection user={user} />
      </div>

      {/* Right Sidebar */}
      <div className="fixed top-0 right-0 h-screen w-[395px] bg-white z-20 border-l border-[#d9d9d9] flex items-center justify-center">
  <ProfilePictureSection user={user} />
      </div>

      {/* Main Content Area */}
      <div className="ml-[265px] mr-[395px] h-screen overflow-y-auto flex flex-col items-center">
        {/* Header */}
        <header className="sticky top-0 z-10 h-[95px] bg-[#f7f7f7] border-b border-[#ebebeb] flex items-center justify-between px-9 w-full max-w-[700px]">
          <h1 className="[font-family:'League_Spartan',Helvetica] font-bold text-black text-[32px] tracking-[0] leading-[normal]">
            2Share của tôi
          </h1>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="h-auto w-[113px] bg-white rounded-[10px] border border-[#6e6e6e] flex items-center gap-2 px-4 py-3"
            >
              <ArrowUpIcon className="w-3.5 h-3.5" />
              <span className="[font-family:'Carlito',Helvetica] font-normal text-black text-base tracking-[1.60px]">
                Chia sẻ
              </span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 bg-white rounded-[10px] border border-[#6e6e6e] p-0 flex items-center justify-center"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
        </header>

        {/* Profile Section */}
        <div className="w-full max-w-[700px] flex flex-col items-center px-9 pt-12">
          <div className="flex flex-col items-center gap-4 mb-8 w-full">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-[77px] h-[77px]">
                <AvatarImage
                  src={user.avatar_url || undefined}
                  alt="Profile picture"
                />
                <AvatarFallback>{user.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-4">
                <h2 className="[font-family:'Carlito',Helvetica] font-normal text-black text-2xl tracking-[2.40px] leading-[normal]">
                  @{user.username}
                </h2>
                {/* <Button variant="ghost" size="sm" className="h-auto p-0">
                  <EditIcon className="w-6 h-6" />
                </Button> */}
              </div>
              {/* Social icons giữ nguyên */}
            </div>
          </div>
          {/* Add Button */}
          <Button className="h-auto w-full max-w-[400px] bg-[#639fff] hover:bg-[#5a8fee] rounded-[35px] py-4 flex items-center justify-center gap-2">
            <PlusIcon className="w-6 h-6 text-white" />
            <span className="[font-family:'Carlito',Helvetica] font-bold text-white text-xl tracking-[2.00px]">
              Thêm
            </span>
          </Button>
        </div>

        {/* Content Sections */}
        <div className="w-full max-w-[700px] flex flex-col items-center px-9 pt-8 mb-8">
          <BioSection />
        </div>

        <div className="w-full max-w-[700px] flex flex-col items-center px-9">
          <SocialLinksSection />
        </div>
      </div>
    </div>
  );
};
