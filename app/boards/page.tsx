"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBoards, createBoard } from "@/services/board.service";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BoardsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");

  /* ---------------- FETCH ---------------- */

  const {
    data: boards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });

  /* ---------------- CREATE ---------------- */

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
      setTitle("");
    },
  });

  const handleCreate = () => {
    if (!title.trim()) return;

    createBoardMutation.mutate(title);
  };

  /* ---------------- STATES ---------------- */

  if (isLoading) return <p className="p-6">Loading boards...</p>;
  if (error) return <p className="p-6">Error loading boards...</p>;

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex gap-3 max-w-md">
        <Input
          placeholder="Create new board..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
        />

        <Button onClick={handleCreate} disabled={createBoardMutation.isPending}>
          Create
        </Button>
      </div>

      {/* EMPTY STATE */}
      {!boards?.length && (
        <div className="text-muted-foreground">
          No boards yet. Create one to get started 🚀
        </div>
      )}

      {/* BOARD GRID */}
      <div className="grid grid-cols-4 gap-6">
        {boards?.map((board: any) => (
          <Card
            key={board._id}
            onClick={() => router.push(`/boards/${board._id}`)}
            className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition"
          >
            <CardContent className="p-6 font-semibold">
              {board.title}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
