"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return null; // could be replaced with a loader if desired
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,77,87,0.25),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(179,0,15,0.2),_transparent_40%)]" />
      <Navbar />
      <main className="mx-auto max-w-7xl overflow-y-auto px-4 pb-10 pt-20 md:px-8">
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}
