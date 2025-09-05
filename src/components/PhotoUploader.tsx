import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type Props = {
  maxFiles?: number;
  value: (File | string)[];
  onChange: (files: (File | string)[]) => void;
};

function PhotoUploader({ maxFiles = 5, value, onChange }: Props) {
  const photos = value;

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const updated = [...photos, ...newFiles].slice(0, maxFiles);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(photos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onChange(reordered);
  };

  // robimy tablicę długości maxFiles
  const slots = Array.from({ length: maxFiles }, (_, i) => photos[i] || null);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleAdd}
        disabled={photos.length >= maxFiles}
        className="border border-primary rounded-md p-2"
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="photos" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-4 flex-wrap justify-center mt-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {slots.map((file, index) => {
                if (file) {
                  const preview =
                    typeof file === "string" ? file : URL.createObjectURL(file);

                  return (
                    <Draggable
                      key={`photo-${index}`}
                      draggableId={`photo-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="relative w-32 h-32 border border-secondary rounded-md overflow-hidden"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <img
                            src={preview}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-1 right-1 bg-black bg-opacity-35 px-2 py-1 rounded text-sm"
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </Draggable>
                  );
                } else {
                  // placeholder slot
                  return (
                    <div
                      key={`empty-${index}`}
                      className="w-32 h-32 border-2 border-dashed border-secondary rounded-md flex items-center justify-center select-none text-secondary/50"
                    >
                      +
                    </div>
                  );
                }
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default PhotoUploader;
