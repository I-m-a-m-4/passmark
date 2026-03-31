"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  BookMarked,
  Sparkles,
  Users,
  CreditCard,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);

  const studentLinks = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Search", href: "/search", icon: Search },
    { name: "AI AI", href: "/ai-assistant", icon: Sparkles },
    { name: "Saved", href: "/bookmarks", icon: BookMarked },
  ];

  const adminLinks = [
    { name: "Overview", href: "/admin-fad", icon: LayoutDashboard },
    { name: "Upload", href: "/admin-fad/upload", icon: Sparkles },
    { name: "Search", href: "/search", icon: Search },
    { name: "Library", href: "/admin-fad", icon: CreditCard },
  ];

  const links = userData?.role === "admin" ? adminLinks : studentLinks;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <nav className="bg-card/80 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] shadow-2xl p-2 flex items-center justify-around">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 flex-1",
                active
                  ? "text-emerald-500 bg-emerald-500/10"
                  : "text-muted-foreground hover:text-emerald-400",
              )}
            >
              <link.icon className={cn("h-5 w-5", active && "scale-110")} />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
