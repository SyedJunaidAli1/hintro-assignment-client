"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, moveTask } from "@/services/task.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

export default function ListColumn({ list }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", list._id],
    queryFn: () => getTasks(list._id),
  });

  useEffect(() => {
    if (tasks) {
      setItems(tasks);
    }
  }, [tasks]);

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", list._id],
      });
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: moveTask,
  });

  const handleCreate = () => {
    if (!title) return;

    createTaskMutation.mutate({
      title,
      description,
      listId: list._id,
      boardId: list.boardId,
    });

    setTitle("");
    setDescription("");
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item._id === active.id);
    const newIndex = items.findIndex((item) => item._id === over.id);

    console.log("OLD:", oldIndex, "NEW:", newIndex);

    // 🔥 update UI first
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // 🔥 THEN persist
    moveTaskMutation.mutate({
      taskId: active.id,
      position: newIndex,
      listId: list._id,
    });
  };

  return (
    <div className="min-w-70 bg-muted/40 border rounded-xl p-4">
      {/* List Title */}
      <h3 className="font-semibold mb-4 text-lg">{list.title}</h3>

      {/* Tasks */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((task) => (
              <TaskCard key={task._id} task={task} listId={list._id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Create Task */}
      <div className="mt-4 space-y-2">
        <Input
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button className="w-full" onClick={handleCreate}>
          Add Task
        </Button>
      </div>
    </div>
  );
}
