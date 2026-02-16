import { api } from "@/lib/api";

export const getLists = async (boardId: string) => {
  const res = await api.get(`/lists/${boardId}`);
  return res.data;
};

export const createList = async (data: {
  title: string;
  boardId: string;
}) => {
  const res = await api.post("/lists", data);
  return res.data;
};
