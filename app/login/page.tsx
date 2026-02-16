"use client";

import { useState } from "react";
import { login } from "@/services/auth.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(form);

      // cookie set by backend
      router.push("/boards");
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" onChange={handleChange} />
          </div>

          <div>
            <Label>Password</Label>
            <Input name="password" type="password" onChange={handleChange} />
          </div>

          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
