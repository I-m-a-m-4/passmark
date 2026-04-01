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
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const studentLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Library Search", href: "/search", icon: Search },
  { name: "Earn & Impact", href: "/apply", icon: Briefcase },
  { name: "Saved Materials", href: "/bookmarks", icon: BookMarked },
];

const tutorLinks = [
  { name: "Tutor Hub", href: "/tutors", icon: LayoutDashboard },
  { name: "Session Manager", href: "/tutor/sessions", icon: Clock },
  { name: "Student Analytics", href: "/tutor/analytics", icon: Users },
];

const adminLinks = [
  { name: "Admin Panel", href: "/admin-fad", icon: Settings },
  { name: "Global Upload", href: "/admin-fad/upload", icon: Upload },
  { name: "Student Registry", href: "/admin-fad/users", icon: Users },
  { name: "Campus Reps", href: "/admin-fad/campus-reps", icon: MapPin },
  { name: "Verification Queue", href: "/admin-fad/verify", icon: UserCheck },
];

export function DashboardSidebar({
  isAdmin = false,
  isTutor = false,
  isCollapsed = false,
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPath = pathname.startsWith("/admin-fad");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div
      className={cn(
        "hidden md:flex h-full flex-col gap-4 border-r border-black/5 dark:border-white/5 bg-white/70 dark:bg-[#0a0a0a]/60 backdrop-blur-3xl p-4 transition-all duration-300 relative z-20",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-2 pb-6 border-b border-sidebar-border",
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
          <div className="flex flex-col">
            <span className="text-xl font-bold font-headline leading-none text-black dark:text-white tracking-tight">
              PassMark
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] mt-1.5">
              Study Archive
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {isAdmin && isAdminPath && (
            <div className="mb-6">
              {!isCollapsed && (
                <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-500/60 mb-4 px-3">
                  Admin Menu
                </div>
              )}
              {adminLinks.map((link) => (
                <SidebarLink
                  key={link.name}
                  link={link}
                  active={pathname === link.href}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          )}

          {!isAdminPath && (
            <div>
              {!isCollapsed && (
                <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 mb-4 px-3">
                  Main Menu
                </div>
              )}
              {studentLinks.map((link) => (
                <SidebarLink
                  key={link.name}
                  link={link}
                  active={pathname === link.href}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          )}
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
