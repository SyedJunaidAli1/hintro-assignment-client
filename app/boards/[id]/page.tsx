"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getLists } from "@/services/list.service";

export default function BoardPage() {
  const { id } = useParams();

  const { data: lists, isLoading } = useQuery({
    queryKey: ["lists", id],
    queryFn: () => getLists(id as string),
  });

  if (isLoading) return <p className="p-6">Loading lists...</p>;

  console.log(lists);

  return (
    <div className="flex gap-6 overflow-x-auto p-6">
      {lists?.map((list: any) => (
        <div key={list._id} className="min-w-[280px] bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-3">{list.title}</h3>
        </div>
      ))}
    </div>
  );
}
