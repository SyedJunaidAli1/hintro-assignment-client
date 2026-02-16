import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteTask, updateTask } from "@/services/task.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function TaskCard({ task, listId }: any) {
  const queryClient = useQueryClient();

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
    <div className="bg-background border rounded-lg p-3 shadow-sm hover:shadow-md transition">
      {isEditing ? (
        <div
          className="space-y-2"
          tabIndex={0}
          onBlur={(e) => {
            // if focus leaves the container
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

          {/* textarea is MUCH better UX for description */}
          <textarea
            className="w-full border rounded-md p-2 text-sm"
            placeholder="Description"
            value={description}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
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
        className="mt-2 "
        onClick={() => deleteTaskMutation.mutate(task._id)}
      >
        Delete
      </Button>
    </div>
  );
}

export default TaskCard;