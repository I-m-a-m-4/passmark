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
  MapPin
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const studentLinks = [
  { name: "Scholar Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Neural Search", href: "/search", icon: Search },
  { name: "Immutable Bookmarks", href: "/bookmarks", icon: BookMarked },
  { name: "Tutor Marketplace", href: "/tutors", icon: Users },
  { name: "Lattice Credits", href: "/billing", icon: CreditCard },
];

const tutorLinks = [
  { name: "Tutor Dashboard", href: "/tutor-dashboard", icon: LayoutDashboard },
  { name: "Session Manager", href: "/tutor/sessions", icon: Clock },
  { name: "Course Ingestion", href: "/tutor/upload", icon: Zap },
  { name: "Scholar Analytics", href: "/tutor/analytics", icon: Users },
];

const adminLinks = [
  { name: "Nexus Panel", href: "/admin", icon: Settings },
  { name: "Data Ingestion", href: "/admin/upload", icon: Upload },
  { name: "Scholar Registry", href: "/admin/users", icon: Users },
  { name: "Campus Reps", href: "/admin/campus-reps", icon: MapPin },
  { name: "Verification Queue", href: "/admin/verify", icon: UserCheck },
];

export function DashboardSidebar({ isAdmin = false, isTutor = false, isCollapsed = false }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className={cn(
      "hidden md:flex h-full flex-col gap-4 border-r border-sidebar-border bg-sidebar p-4 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn("flex items-center gap-3 px-2 pb-6 border-b border-sidebar-border", isCollapsed && "justify-center px-0")}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] overflow-hidden shrink-0">
          <img src="/icon.png" alt="PassMark" className="w-full h-full object-cover" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-xl font-bold font-headline leading-none">PassMark</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500/60 uppercase tracking-[0.2em] mt-1">Scholar Lattice</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {isAdmin && (
            <div className="mb-6">
              {!isCollapsed && (
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500/40 mb-3 px-3">
                  Nexus Override
                </div>
              )}
              {adminLinks.map((link) => (
                <SidebarLink key={link.name} link={link} active={pathname === link.href} isCollapsed={isCollapsed} />
              ))}
            </div>
          )}

          {isTutor && (
            <div className="mb-6">
              {!isCollapsed && (
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500/40 mb-3 px-3">
                  Tutor Lattice
                </div>
              )}
              {tutorLinks.map((link) => (
                <SidebarLink key={link.name} link={link} active={pathname === link.href} isCollapsed={isCollapsed} />
              ))}
            </div>
          )}

          <div>
            {!isCollapsed && (
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 px-3">
                Standard Protocol
              </div>
            )}
            {studentLinks.map((link) => (
              <SidebarLink key={link.name} link={link} active={pathname === link.href} isCollapsed={isCollapsed} />
            ))}
          </div>
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border pt-4 px-2">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-600 group",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span>Terminate Session</span>}
        </button>
      </div>
    </div>
  );
}

function SidebarLink({ link, active, isCollapsed }: { link: any, active: boolean, isCollapsed?: boolean }) {
  return (
    <Link
      href={link.href}
      title={isCollapsed ? link.name : ""}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group",
        active
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 shadow-sm"
          : "text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-500/5",
        isCollapsed && "justify-center px-0"
      )}
    >
      <link.icon className={cn("h-4 w-4 transition-colors shrink-0", active ? "text-emerald-600 dark:text-emerald-500" : "text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400")} />
      {!isCollapsed && <span>{link.name}</span>}
    </Link>
  );
}
