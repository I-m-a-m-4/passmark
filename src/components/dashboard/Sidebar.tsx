"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  BookMarked,
  GraduationCap,
  Users,
  Upload,
  Settings,
  Sparkles,
  CreditCard,
  LogOut,
  FileText,
  UserCheck,
  Zap,
  Clock,
  MapPin,
  Briefcase,
  ChevronDown,
  ShieldCheck,
  Store,
  ChevronRight
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

const studentLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tutor Marketplace", href: "/tutor-marketplace", icon: Store },
  { name: "Library Search", href: "/search", icon: Search },
  { name: "Earn & Impact", href: "/apply", icon: Briefcase },
  { name: "Saved Materials", href: "/bookmarks", icon: BookMarked },
];

const tutorLinks = [
  { name: "Tutor Hub", href: "/tutors", icon: LayoutDashboard },
  { name: "Session Manager", href: "/tutors/sessions", icon: Clock },
  { name: "Student Analytics", href: "/tutors/analytics", icon: Users },
];

const repLinks = [
  { name: "Rep Hub", href: "/campus-rep", icon: LayoutDashboard },
  { name: "Commission Logs", href: "/campus-rep/earnings", icon: CreditCard },
  { name: "Referral Network", href: "/campus-rep/referrals", icon: Users },
];

const adminLinks = [
  { name: "Admin Panel", href: "/admin-fad", icon: Settings },
  { name: "Global Upload", href: "/admin-fad/upload", icon: Upload },
  { name: "Student Registry", href: "/admin-fad/users", icon: Users },
  { name: "Campus Reps", href: "/admin-fad/campus-reps", icon: MapPin },
];

export function DashboardSidebar({
  isAdmin = false,
  isCollapsed = false,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const currentRoles = userData?.roles || [userData?.role || "student"];
  
  // Determine active context based on route
  const isTutorMode = pathname.startsWith("/tutors");
  const isRepMode = pathname.startsWith("/campus-rep");
  const isAdminMode = pathname.startsWith("/admin-fad");
  
  const activeMode = isAdminMode ? "Admin" 
                 : isTutorMode ? "Tutor" 
                 : isRepMode ? "Rep" 
                 : "Scholar";

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const currentLinks = isAdminMode ? adminLinks 
                    : isTutorMode ? tutorLinks 
                    : isRepMode ? repLinks 
                    : studentLinks;

  return (
    <div
      className={cn(
        "hidden md:flex h-full flex-col gap-4 border-r border-black/5 dark:border-white/5 bg-white/70 dark:bg-[#0a0a0a]/60 backdrop-blur-3xl p-4 transition-all duration-300 relative z-50",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-2 pb-6 border-b border-sidebar-border relative",
          isCollapsed && "justify-center px-0",
        )}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] overflow-hidden shrink-0">
          <img
            src="/passmark.jpeg"
            alt="PassMark"
            className="w-full h-full object-cover shrink-0"
          />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-xl font-bold font-headline leading-none text-black dark:text-white tracking-tight">
              PassMark
            </span>
            <button 
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-1.5 group/sw cursor-pointer"
            >
              {activeMode} Mode <ChevronDown className={cn("w-2.5 h-2.5 transition-transform", showRoleSwitcher && "rotate-180")} />
            </button>
          </div>
        )}

        {/* Role Switcher Dropdown */}
        {showRoleSwitcher && !isCollapsed && (
            <>
            {/* Backdrop for easy closing */}
            <div 
                className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]" 
                onClick={() => setShowRoleSwitcher(false)}
            />
            <div className="absolute top-[100%] left-0 right-0 mt-2 bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 rounded-3xl shadow-2xl z-50 p-2 animate-in slide-in-from-top-2 overflow-hidden backdrop-blur-3xl">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-3 py-2 opacity-50">Switch Workspace</p>
                {[
                    { id: "student", label: "Scholar Mode", href: "/dashboard", icon: BookMarked },
                    { id: "tutor", label: "Tutor Hub", href: "/tutors", icon: GraduationCap },
                    { id: "campus_rep", label: "Rep Hub", href: "/campus-rep", icon: Users },
                ].map((role) => (
                    (role.id === "student" || currentRoles.includes(role.id)) && (
                        <button
                            key={role.id}
                            onClick={() => {
                                router.push(role.href);
                                setShowRoleSwitcher(false);
                            }}
                            className={cn(
                                "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group/r text-left mb-1 last:mb-0",
                                activeMode === role.label.split(" ")[0] ? "bg-emerald-500 text-white dark:text-black font-black" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <role.icon className={cn("w-4 h-4", activeMode === role.label.split(" ")[0] ? "text-white dark:text-black" : "text-emerald-500")} />
                                <span className="text-[11px] font-black uppercase tracking-wide">{role.label}</span>
                            </div>
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover/r:opacity-100 transition-opacity" />
                        </button>
                    )
                ))}
                {isAdmin && (
                    <button
                        onClick={() => {
                            router.push("/admin-fad");
                            setShowRoleSwitcher(false);
                        }}
                        className={cn(
                            "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group/r text-left mt-2 border-t border-black/5 dark:border-white/10 pt-4",
                            isAdminMode? "bg-rose-500 text-white font-black" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <ShieldCheck className={cn("w-4 h-4", isAdminMode ? "text-white" : "text-rose-500")} />
                            <span className="text-[11px] font-black uppercase tracking-wide">Admin Protocol</span>
                        </div>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover/r:opacity-100 transition-opacity" />
                    </button>
                )}
            </div>
            </>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
            {!isCollapsed && (
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 mb-4 px-3">
                {activeMode} Menu
            </div>
            )}
            {currentLinks.map((link) => (
            <SidebarLink
                key={link.name}
                link={link}
                active={pathname === link.href}
                isCollapsed={isCollapsed}
            />
            ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border pt-4 px-2">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-600 group",
            isCollapsed && "justify-center px-0",
          )}
        >
          <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span>Terminate Session</span>}
        </button>
      </div>
    </div>
  );
}

function SidebarLink({
  link,
  active,
  isCollapsed,
}: {
  link: any;
  active: boolean;
  isCollapsed?: boolean;
}) {
  return (
    <Link
      href={link.href}
      title={isCollapsed ? link.name : ""}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-500 group relative overflow-hidden",
        active
          ? "bg-emerald-500 text-white dark:text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]"
          : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 hover:translate-x-1",
        isCollapsed && "justify-center px-0",
      )}
    >
      <link.icon
        className={cn(
          "h-4 w-4 transition-colors shrink-0",
          active
            ? "text-white dark:text-black"
            : "text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
        )}
      />
      {!isCollapsed && <span>{link.name}</span>}
    </Link>
  );
}
