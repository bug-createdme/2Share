import { useEffect } from "react";
import { BarChart3Icon, EditIcon, Trash2Icon } from "lucide-react";
import { Card } from "../../../../components/ui/card";
import { Switch } from "../../../../components/ui/switch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type SocialLink = {
  id: string;
  name: string;
  url: string;
  clicks: number;
  isEnabled: boolean;
  color: string;
  icon: string;
};

// Sortable Item Component
interface SortableItemProps {
  link: SocialLink;
  index: number;
  onUrlChange: (index: number, url: string) => void;
  onToggle: (index: number, checked: boolean) => void;
  onDelete: (index: number) => void;
}

const SortableItem = ({ link, index, onUrlChange, onToggle, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`w-full bg-white rounded-[25px] border border-[#ececec] shadow-[0_2px_8px_#0001] flex flex-row transition-shadow ${isDragging ? 'shadow-lg' : ''}`}
    >
      {/* Drag handle as button full height, no margin */}
      <button
        type="button"
        className="flex items-center justify-center self-stretch w-8 rounded-l-[25px] rounded-r-none bg-white border-r border-[#d7dce1] cursor-grab active:cursor-grabbing"
        style={{ padding: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}
        {...attributes}
        {...listeners}
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
                onChange={e => onUrlChange(index, e.target.value)}
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
              onCheckedChange={checked => onToggle(index, checked)}
            />
            <button className="hover:opacity-70 transition-opacity" onClick={() => onDelete(index)}>
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
  );
};

export const SocialLinksSection = ({ socialLinks, setSocialLinks }: { socialLinks: SocialLink[]; setSocialLinks: React.Dispatch<React.SetStateAction<SocialLink[]>> }): JSX.Element => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Lắng nghe sự kiện từ modal
  useEffect(() => {
    function handleAddSocialLink(e: any) {
      const { name, color, icon } = e.detail;
      const newId = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setSocialLinks(links => [
        ...links,
        {
          id: newId,
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSocialLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleUrlChange = (index: number, url: string) => {
    const newLinks = [...socialLinks];
    newLinks[index].url = url;
    setSocialLinks(newLinks);
  };

  const handleToggle = (index: number, checked: boolean) => {
    const newLinks = [...socialLinks];
    newLinks[index].isEnabled = checked;
    setSocialLinks(newLinks);
  };

  const handleDelete = (index: number) => {
    setSocialLinks(links => links.filter((_, i) => i !== index));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={socialLinks.map(link => link.id)}
        strategy={verticalListSortingStrategy}
      >
        <section className="w-full max-w-[700px] flex flex-col gap-6">
          {socialLinks.map((link, index) => (
            <SortableItem
              key={link.id}
              link={link}
              index={index}
              onUrlChange={handleUrlChange}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </section>
      </SortableContext>
    </DndContext>
  );
}
