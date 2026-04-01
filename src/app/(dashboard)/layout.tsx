"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import {
  Loader2,
  Moon,
  Sun,
  ShieldCheck,
  PanelLeft,
  PanelLeftClose,
  GraduationCap,
  Users,
  BookMarked
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { AuraBackground } from "@/components/aura-background";
import { AuraCard } from "@/components/aura-ui";
import { isAdminEmail } from "@/lib/admin-config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isAdminMode = pathname.startsWith("/admin-fad");
  const isTutorMode = pathname.startsWith("/tutors");
  const isRepMode = pathname.startsWith("/campus-rep");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();

          // Check if email is in the admin list
          if (isAdminEmail(currentUser.email) && data.role !== "admin") {
            data.role = "admin";
          }

          setUserData(data);

          // Role-based routing protection
          if (pathname === "/admin") {
            router.push("/");
          } else if (
            data.role === "admin" &&
            !pathname.startsWith("/admin-fad") &&
            !pathname.startsWith("/dashboard")
          ) {
            // Optional: Auto-redirect admins to admin panel
            // router.push("/admin-fad");
          } else if (data.role === "tutor" && pathname === "/dashboard") {
            router.push("/tutors");
          }
        } else {
          // If auth exists but no firestore doc, redirect to completion
          router.push("/signup?mode=complete-profile");
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background overflow-hidden relative">
        {/* Sidebar Skeleton */}
        <div className="hidden md:flex flex-col w-64 border-r border-white/5 p-4 space-y-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex-1 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Header Skeleton */}
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-8">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
          </header>

          {/* Content Skeleton */}
          <main className="flex-1 p-8 space-y-8 overflow-hidden">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background transition-colors duration-500 overflow-hidden relative">
      <AuraBackground />
      <DashboardSidebar
        isAdmin={userData?.role === "admin" || isAdminEmail(user?.email)}
        isCollapsed={isSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <header className="h-16 border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-[#0a0a0a]/60 backdrop-blur-3xl sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-muted-foreground hover:bg-emerald-500 hover:text-white transition-all duration-300"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-3">
              {isAdminMode && (
                <div className="bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">
                    Admin Protocol
                  </span>
                </div>
              )}
              {isTutorMode && (
                <div className="bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20 flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
                  <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest leading-none">
                    Mentor Hub Active
                  </span>
                </div>
              )}
              {isRepMode && (
                <div className="bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">
                    Growth Representative
                  </span>
                </div>
              )}
              {!isAdminMode && !isTutorMode && !isRepMode && (
                <div className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <BookMarked className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">
                    Scholar Mode
                  </span>
                </div>
              )}
              <h2 className="font-bold text-lg font-headline hidden sm:block">
                {userData?.fullName?.split(" ")[0] || "Scholar"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-emerald-500 hover:text-white transition-all duration-300"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-bold text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 tracking-widest">
                {userData?.subscriptionStatus || "Free"} Plan
              </span>
            </div>

            <div className="h-9 w-9 rounded-xl overflow-hidden border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <img
                src="/passmark.jpeg"
                alt="Log"
                className="w-full h-full object-cover shrink-0"
              />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
