import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteTask, updateTask } from "@/services/task.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({ task, listId }: any) {
  const queryClient = useQueryClient();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", listId],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", listId],
      });
    },
  });

  const handleSave = () => {
    setIsEditing(false);

    if (title !== task.title || description !== (task.description || "")) {
      updateTaskMutation.mutate({
        taskId: task._id,
        data: { title, description },
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background border rounded-lg p-3 shadow-sm hover:shadow-md transition"
    >
      {/* ✅ DRAG HANDLE */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-xs text-muted-foreground mb-2"
      >
        ⠿ Drag
      </div>

      {isEditing ? (
        <div
          className="space-y-2"
          tabIndex={0}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              handleSave();
            }
          }}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <textarea
            className="w-full border rounded-md p-2 text-sm"
            placeholder="Description"
            value={description}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-pointer"
        >
          <p className="font-medium">{task.title}</p>

          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      )}

      <Button
        variant="destructive"
        size="sm"
        className="mt-2"
        onClick={(e) => {
          e.stopPropagation(); // ⭐ VERY IMPORTANT
          deleteTaskMutation.mutate(task._id);
        }}
      >
        Delete
      </Button>
    </div>
  );
}

export default TaskCard;
