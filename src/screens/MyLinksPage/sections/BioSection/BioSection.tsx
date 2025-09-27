import { EditIcon } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import React from "react";
import { updateMyProfile, updatePortfolio } from "../../../../lib/api";

export const BioSection = ({ bio, setBio, user, setUser }: { bio: string; setBio: React.Dispatch<React.SetStateAction<string>>; user: any; setUser: React.Dispatch<React.SetStateAction<any>> }): JSX.Element => {
  const [showModal, setShowModal] = React.useState(false);
  const [tmpUsername, setTmpUsername] = React.useState(user?.username || "");
  const [tmpBio, setTmpBio] = React.useState(bio || "");
  const [saving, setSaving] = React.useState(false);
  const maxLen = 350;
  const currentLen = Math.min(bio?.length || 0, maxLen);

  async function handleSave() {
    try {
      setSaving(true);
      // Update user profile username/bio
      await updateMyProfile({ username: tmpUsername, bio: tmpBio });
      setUser((u: any) => ({ ...u, username: tmpUsername }));
      setBio(tmpBio);
      // Optionally push bio to portfolio blocks
      const blocks = [{ type: "text", content: tmpBio || "", order: 1 }];
      try { await updatePortfolio({ blocks }); } catch {}
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="w-full max-w-[608px] mx-auto translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
      <Card className="relative bg-white rounded-[35px] border border-solid border-[#6e6e6e] min-h-[203px]">
        <CardContent className="p-8 relative">
          <button
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Chỉnh sửa title và bio"
            onClick={() => { setTmpUsername(user?.username || ""); setTmpBio(bio || ""); setShowModal(true); }}
          >
            <EditIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className="pr-12 mb-6">
            <textarea
              className="[font-family:'Carlito',Helvetica] font-normal text-black text-base tracking-[1.60px] leading-normal w-full bg-transparent resize-none outline-none"
              value={bio}
              onChange={e => {
                const v = e.target.value.slice(0, maxLen);
                setBio(v);
              }}
              rows={5}
              maxLength={maxLen}
            />
          </div>
          <div className="absolute bottom-6 right-6">
            <span className="[font-family:'Carlito',Helvetica] font-normal text-[#6e6e6e] text-[15px] tracking-[1.50px] leading-normal">
              {currentLen}/{maxLen}
            </span>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] p-6">
            <h3 className="text-lg font-bold mb-4 text-center">Title and bio</h3>
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-1">Title</div>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={tmpUsername}
                onChange={e => setTmpUsername(e.target.value)}
                maxLength={30}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{tmpUsername.length} / 30</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Bio</div>
              <textarea
                className="w-full border rounded-md px-3 py-2"
                rows={4}
                value={tmpBio}
                onChange={e => setTmpBio(e.target.value.slice(0, 160))}
                maxLength={160}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{tmpBio.length} / 160</div>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
