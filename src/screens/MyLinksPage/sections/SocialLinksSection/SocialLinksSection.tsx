import {
  BarChart3Icon,
  EditIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { Card } from "../../../../components/ui/card";

import { Switch } from "../../../../components/ui/switch";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const SocialLinksSection = (): JSX.Element => {
  const initialLinks = [
    {
      name: "TikTok",
      url: "URL",
      clicks: "123 Lượt bấm",
      isEnabled: true,
    },
    {
      name: "LinkedIn",
      url: "URL",
      clicks: "123 Lượt bấm",
      isEnabled: true,
    },
    {
      name: "Instagram",
      url: "URL",
      clicks: "123 Lượt bấm",
      isEnabled: true,
    },
    {
      name: "Facebook",
      url: "URL",
      clicks: "123 Lượt bấm",
      isEnabled: true,
    },
    {
      name: "Behance",
      url: "URL",
      clicks: "123 Lượt bấm",
      isEnabled: true,
    },
  ];
  const [socialLinks, setSocialLinks] = useState(initialLinks);
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
              <Draggable key={link.name} draggableId={link.name} index={index}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`w-full bg-white rounded-[25px] border border-[#ececec] shadow-[0_2px_8px_#0001] px-6 py-5 flex gap-3 transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                  >
                    {/* Drag handle - separate div */}
                    <div className="flex items-start cursor-grab pt-1" {...provided.dragHandleProps}>
                      <span className="w-5 h-16 rounded bg-gray-300 flex items-center justify-center">
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                          <circle cx="6" cy="4" r="1" fill="#999"/>
                          <circle cx="10" cy="4" r="1" fill="#999"/>
                          <circle cx="6" cy="8" r="1" fill="#999"/>
                          <circle cx="10" cy="8" r="1" fill="#999"/>
                          <circle cx="6" cy="12" r="1" fill="#999"/>
                          <circle cx="10" cy="12" r="1" fill="#999"/>
                        </svg>
                      </span>
                    </div>
                    {/* Content - separate div */}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="[font-family:'Carlito',Helvetica] font-bold text-black text-lg tracking-[1.80px] leading-[normal]">
                              {link.name}
                            </h3>
                            <button className="hover:opacity-70 transition-opacity">
                              <EditIcon className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <span className="[font-family:'Carlito',Helvetica] text-[#6e6e6e] text-[15px] tracking-[1.50px] leading-[normal] truncate">
                              {link.url}
                            </span>
                            <button className="hover:opacity-70 transition-opacity">
                              <EditIcon className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <Switch
                            defaultChecked={link.isEnabled}
                            className="data-[state=checked]:bg-[#6e6e6e] data-[state=unchecked]:bg-[#e0e0e0]"
                          />
                          <button className="hover:opacity-70 transition-opacity">
                            <Trash2Icon className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <BarChart3Icon className="w-5 h-5 text-gray-400" />
                        <span className="[font-family:'Carlito',Helvetica] text-[#6e6e6e] text-[15px] tracking-[1.50px] leading-[normal]">
                          {link.clicks}
                        </span>
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
};