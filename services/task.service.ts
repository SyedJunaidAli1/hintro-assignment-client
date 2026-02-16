import { api } from "@/lib/api";

export const getTasks = async (listId: string) => {
  const res = await api.get(`/tasks/${listId}`);
  return res.data;
};

export const createTask = async (data: {
  title: string;
  description: string;
  boardId: string;
  listId: string;
}) => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const deleteTask = async (taskId: string) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};

type UpdateTaskPayload = {
  taskId: string;
  data: {
    title?: string;
    description?: string;
    listId?: string; // useful later for drag
    position?: number; // useful later for drag
    assignedTo?: string | null;
  };
};

export const updateTask = async ({ taskId, data }: UpdateTaskPayload) => {
  const res = await api.patch(`/tasks/${taskId}`, data);
  return res.data;
};
