import { useId, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { Location } from "@/app/generated/prisma";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { reorderItinerary } from "@/lib/reorder-itinerary";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
interface SortableItneraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({ item }: { item: Location }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow"
    >
      <div>
        <h4>{item.locationTitle}</h4>
      </div>
      <div className="text-sm text-gray-600"> Day {item.order} </div>
    </div>
  );
}

export default function SortableItinerary({
  locations,
  tripId,
}: SortableItneraryProps) {
  const id = useId();
  const [localLocation, setLocalLcoation] = useState(locations);
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localLocation.findIndex((item) => item.id === active.id);
      const newIndex = localLocation.findIndex((item) => item.id === over!.id);

      const newLocationsOrder = arrayMove(
        localLocation,
        oldIndex,
        newIndex
      ).map((item, index) => ({ ...item, order: index }));
      setLocalLcoation(newLocationsOrder);

      await reorderItinerary(
        tripId,
        newLocationsOrder.map((item) => item.id)
      );
    }
  };
  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localLocation.map((loc) => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {localLocation.map((item, key) => (
            <SortableItem key={key} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
