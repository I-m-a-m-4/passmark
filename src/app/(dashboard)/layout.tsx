"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { Loader2, Menu, Moon, Sun, ShieldCheck, PanelLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { AuraBackground } from "@/components/aura-background";
import { AuraCard } from "@/components/aura-ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();

          // Hardcode bimex4@gmail.com as admin
          if (currentUser.email === "bimex4@gmail.com" && data.role !== "admin") {
            data.role = "admin";
          }

          setUserData(data);

          // Role-based routing protection
          if (data.role === "admin" && !pathname.startsWith("/admin")) {
            // Optional: Auto-redirect admins to admin panel if they hit root dashboard
            // router.push("/admin");
          } else if (data.role === "tutor" && pathname === "/dashboard") {
            router.push("/tutor-dashboard");
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
        isAdmin={userData?.role === "admin" || user?.email === "bimex4@gmail.com"}
        isTutor={userData?.role === "tutor"}
        isCollapsed={isSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/60 backdrop-blur-3xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 transition-colors duration-500 shrink-0">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-zinc-950 border-white/10">
                <DashboardSidebar isAdmin={userData?.role === "admin"} isTutor={userData?.role === "tutor"} />
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-muted-foreground hover:bg-emerald-500 hover:text-white transition-all duration-300"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-3">
              {(userData?.role === "admin" || user?.email === "bimex4@gmail.com") && (
                <div className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Admin Nexus</span>
                </div>
              )}
              <h2 className="font-bold text-lg font-headline hidden sm:block">
                {userData?.fullName?.split(" ")[0] || "Scholar"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-bold text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 tracking-widest">
                {userData?.subscriptionStatus || "Free"} Protocol
              </span>
            </div>

            <div className="h-9 w-9 rounded-xl overflow-hidden border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <img src="/icon.png" alt="U" className="w-full h-full object-cover" />
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
