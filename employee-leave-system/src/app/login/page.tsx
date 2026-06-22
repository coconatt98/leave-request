"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = await login(data.username, data.password);

    if (success) {
      toast.success("Login successful");
      router.push("/dashboard");
    } else {
      toast.error("Invalid username or password");
      setIsSubmitting(false);
    }
  };

  if (authLoading || isAuthenticated) {
    return null; // or a full page loader
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef2fb] via-white to-[#d7e8ff] p-4">
      <Card className="w-full max-w-[420px] rounded-3xl border border-white/70 bg-white/90 shadow-[0_30px_60px_rgba(15,98,254,0.15)]">
        <CardHeader className="pb-4 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <CalendarDays className="h-7 w-7 text-[#0f62fe]" />
            <span className="text-xl font-semibold tracking-tight text-[#0f1c2f]">
              Employee Leave System
            </span>
          </div>
          <CardDescription className="text-xs text-[#5a6270]">
            Log in to manage your team&apos;s leave requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-semibold text-[#5a6270]">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-[#5a6270]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="mt-6 h-11 w-full text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
