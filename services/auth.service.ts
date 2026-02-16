import { api } from "@/lib/api";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
