"use client";

import { useQuery } from "@tanstack/react-query";
import { getBoards } from "@/services/board.service";
import { Card, CardContent } from "@/components/ui/card";

export default function BoardsPage() {
  const { data: boards, isLoading, error } = useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });
  console.log("boards:", boards);


  if (isLoading) return <p className="p-6">Loading boards...</p>;

  if (error) return <p className="p-6">Error loading boards...</p>;

  return (
    <div className="p-8 grid grid-cols-4 gap-6">
      {boards?.map((board: any) => (
        <Card
          key={board._id}
          className="cursor-pointer hover:shadow-lg transition"
        >
          <CardContent className="p-6 font-semibold">{board.title}</CardContent>
        </Card>
      ))}
    </div>
  );
}
