"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLists, createList } from "@/services/list.service";
import ListColumn from "@/app/components/ListColumn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

export default function BoardPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;
  
    const socket = getSocket();
    if (!socket) return;
  
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });
  
    socket.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });
  
    socket.connect();
    socket.emit("joinBoard", id);
  
    return () => {
      socket.disconnect();
    };
  }, [id]);


  const [title, setTitle] = useState("");

  /* ---------------- FETCH LISTS ---------------- */

  const { data: lists, isLoading } = useQuery({
    queryKey: ["lists", id],
    queryFn: () => getLists(id as string),
  });

  /* ---------------- CREATE LIST ---------------- */

  const createListMutation = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lists", id],
      });
      setTitle("");
    },
  });

  const handleCreate = () => {
    if (!title.trim()) return;

    createListMutation.mutate({
      title,
      boardId: id as string,
    });
  };

  if (isLoading) return <p className="p-6">Loading lists...</p>;

  return (
    <div className="flex gap-6 overflow-x-auto p-6">
      {/* EXISTING LISTS */}
      {lists?.map((list: any) => (
        <ListColumn key={list._id} list={list} />
      ))}

      {/* CREATE LIST COLUMN */}
      <div className="min-w-[280px] h-fit bg-muted/40 border rounded-xl p-4">
        <div className="space-y-2">
          <Input
            placeholder="New list..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />

          <Button
            className="w-full"
            onClick={handleCreate}
            disabled={createListMutation.isPending}
          >
            Add List
          </Button>
        </div>
      </div>
    </div>
  );
}
