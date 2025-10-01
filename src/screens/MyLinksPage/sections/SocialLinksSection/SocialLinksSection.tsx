import { useEffect } from "react";
import { BarChart3Icon, EditIcon, Trash2Icon } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Switch } from "../../../../components/ui/switch";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export type SocialLink = {
  name: string;
  url: string;
  clicks: number;
  isEnabled: boolean;
  color: string;
  icon: string;
};

export const SocialLinksSection = ({ socialLinks, setSocialLinks }: { socialLinks: SocialLink[]; setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>> }): JSX.Element => {

  // Lắng nghe sự kiện từ modal
  useEffect(() => {
    function handleAddSocialLink(e: any) {
      const { name, color, icon } = e.detail;
      setSocialLinks(links => [
        ...links,
        {
          name,
          url: "",
          clicks: 0,
          isEnabled: true,
          color,
          icon,
        },
      ]);
    }
    window.addEventListener("add-social-link", handleAddSocialLink);
    return () => window.removeEventListener("add-social-link", handleAddSocialLink);
  }, [setSocialLinks]);

  function handleOnDragEnd(result: any) {
    if (!result.destination) return;
    const items = Array.from(socialLinks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSocialLinks(items);
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="socialLinks">
        {(provided) => (
          <section
            className="w-full max-w-[700px] flex flex-col gap-6"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {socialLinks.map((link, index) => (
              <Draggable key={link.name + index} draggableId={link.name + index} index={index}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    className={`w-full bg-white rounded-[25px] border border-[#ececec] shadow-[0_2px_8px_#0001] flex flex-row transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                  >
                    {/* Drag handle as button full height, no margin */}
                    <button
                      type="button"
                      className="flex items-center justify-center self-stretch w-8 rounded-l-[25px] rounded-r-none bg-white border-r border-[#d7dce1] cursor-grab active:cursor-grabbing"
                      style={{ padding: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}
                      {...provided.dragHandleProps}
                      tabIndex={0}
                      aria-label="Kéo để di chuyển"
                    >
                      <svg width="16" height="32" fill="none" viewBox="0 0 16 32">
                        <circle cx="6" cy="6" r="1" fill="#999"/>
                        <circle cx="10" cy="6" r="1" fill="#999"/>
                        <circle cx="6" cy="12" r="1" fill="#999"/>
                        <circle cx="10" cy="12" r="1" fill="#999"/>
                        <circle cx="6" cy="18" r="1" fill="#999"/>
                        <circle cx="10" cy="18" r="1" fill="#999"/>
                        <circle cx="6" cy="24" r="1" fill="#999"/>
                        <circle cx="10" cy="24" r="1" fill="#999"/>
                      </svg>
                    </button>
                    {/* Content full width except drag handle */}
                    <div className="flex-1 flex flex-col gap-2 justify-between px-6 py-5 h-full">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="[font-family:'Carlito',Helvetica] font-bold text-black text-lg tracking-[1.80px] leading-[normal] flex items-center gap-2">
                              <span style={{ color: link.color, fontSize: 22 }}>{link.icon}</span>
                              <span>{link.name}</span>
                            </h3>
                            <button className="hover:opacity-70 transition-opacity">
                              <EditIcon className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <input
                              className="border-b border-dashed border-[#ccc] bg-transparent px-1 py-0 text-[15px] w-full"
                              placeholder="URL"
                              value={link.url}
                              onChange={e => {
                                const newLinks = [...socialLinks];
                                newLinks[index].url = e.target.value;
                                setSocialLinks(newLinks);
                              }}
                            />
                            <button className="hover:opacity-70 transition-opacity">
                              <EditIcon className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <Switch
                            checked={link.isEnabled}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-400 data-[state=checked]:to-green-600 data-[state=unchecked]:bg-gray-200 hover:data-[state=checked]:from-green-500 hover:data-[state=checked]:to-green-700 hover:data-[state=unchecked]:bg-gray-300 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg h-6 w-11 border-0"
                            onCheckedChange={checked => {
                              const newLinks = [...socialLinks];
                              newLinks[index].isEnabled = checked;
                              setSocialLinks(newLinks);
                            }}
                          />
                          <button className="hover:opacity-70 transition-opacity" onClick={() => {
                            setSocialLinks(links => links.filter((_, i) => i !== index));
                          }}>
                            <Trash2Icon className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <BarChart3Icon className="w-5 h-5 text-gray-400" />
                        <span className="[font-family:'Carlito',Helvetica] text-[#6e6e6e] text-[15px] tracking-[1.50px] leading-[normal]">
                          {link.clicks} clicks
                        </span>
                      </div>
                      <div className="bg-[#fff7d6] rounded-b-xl px-4 py-2 mt-2 text-[#a67c00] text-sm border-t border-[#ffe7a0]">
                        Enter your {link.name} URL, then set up your link.
                      </div>
                    </div>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </section>
        )}
      </Droppable>
    </DragDropContext>
  );
}