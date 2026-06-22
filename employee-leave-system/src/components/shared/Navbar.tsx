"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItemBase =
  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300";

type NavbarProps = {
  showAuthControls?: boolean;
};

export function Navbar({ showAuthControls = true }: NavbarProps = {}) {
  const pathname = usePathname();
  const auth = useAuth();

  const shouldShowAuth = showAuthControls && auth.isAuthenticated;

  const roleDisplay = 
    auth.role === "ADMIN" ? "Administrator" : 
    auth.role === "INPUTTER" ? "Inputter" : 
    auth.role === "APPROVER" ? "Approver" : "User";
  const initials = auth.role ? auth.role.substring(0, 2).toUpperCase() : "US";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="absolute inset-0 -z-10 rounded-b-3xl bg-gradient-to-r from-[#161517] via-[#1f1f21] to-[#161517] shadow-[0_10px_35px_rgba(22,21,23,0.6)]" />
        <div className="absolute inset-x-3 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#ff5b5f] to-transparent" />

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 text-white">
          <span className="relative flex h-9 w-9 items-center justify-center">
            <span className="absolute h-9 w-9 rounded-full border border-white/25" />
            <span className="absolute h-5 w-5 rounded-full bg-gradient-to-br from-[#ff5b5f] to-[#b3000f]" />
          </span>
          <span className="text-[15px] font-semibold uppercase tracking-[0.2em]">
            Employee Leave
          </span>
        </Link>

        {/* Desktop Navigation - Inline */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  navItemBase,
                  isActive
                    ? "bg-gradient-to-r from-[#ff4d57] to-[#b3000f] text-white shadow-[0_12px_32px_rgba(255,77,87,0.35)]"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-white/60")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side - User profile & logout */}
        <div className="flex items-center gap-4 text-white">
          {shouldShowAuth && (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-white/80 md:block">
                {roleDisplay}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-[#ff5b5f] to-[#b3000f] text-xs font-bold text-white shadow-[0_10px_25px_rgba(230,0,18,0.4)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(230,0,18,0.55)]">
                {initials}
              </div>
            </div>
          )}
          {showAuthControls && auth.isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              disabled={auth.isLoading}
              onClick={auth.logout}
              className="text-white hover:bg-white/10 hover:text-white gap-1.5 border border-white/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-72 border border-[#2b2b2d] bg-[#1f1f21] p-0 text-white"
            >
              <SheetHeader className="border-b border-white/10 p-4">
                <SheetTitle className="text-left font-semibold tracking-tight flex items-center gap-2">
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className="absolute h-7 w-7 rounded-full border border-white/30" />
                    <span className="absolute h-4 w-4 rounded-full bg-[#ff4d57]" />
                  </span>
                  <span>Employee Leave</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-3">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        navItemBase,
                        isActive
                          ? "bg-gradient-to-r from-[#ff4d57] to-[#b3000f] text-white shadow-[0_12px_32px_rgba(255,77,87,0.35)]"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-white/60")} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
