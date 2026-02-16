"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getLists } from "@/services/list.service";
import ListColumn from "@/app/components/ListColumn";

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
        <ListColumn key={list._id} list={list} />
      ))}
    </div>
  );
}
