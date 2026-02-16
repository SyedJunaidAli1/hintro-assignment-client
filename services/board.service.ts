import { api } from "@/lib/api";

export const getBoards = async () => {
  const res = await api.get("/boards");
  return res.data;
};

export const createBoard = async (title: string) => {
  const res = await api.post("/boards", { title });
  return res.data;
};
