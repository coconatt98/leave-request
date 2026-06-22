import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import "../globals.css";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(255,77,87,0.25),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(179,0,15,0.2),_transparent_40%)]" />
      <Navbar showAuthControls={false} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-20 md:px-8">
        {children}
      </main>
    </div>
  );
}
