"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask } from "@/services/task.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TaskCard from "./TaskCard";

export default function ListColumn({ list }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", list._id],
    queryFn: () => getTasks(list._id),
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", list._id],
      });
    },
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

  return (
    <div className="min-w-[280px] bg-muted/40 border rounded-xl p-4">
      {/* List Title */}
      <h3 className="font-semibold mb-4 text-lg">{list.title}</h3>

      {/* Tasks */}
      <div className="space-y-3">
        {isLoading && <p className="text-sm">Loading...</p>}

        {tasks?.map((task: any) => (
          <TaskCard key={task._id} task={task} listId={list._id} />
        ))}
      </div>

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
