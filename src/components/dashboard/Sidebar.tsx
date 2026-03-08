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
  Clock
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const studentLinks = [
  { name: "Scholar Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Neural Search", href: "/search", icon: Search },
  { name: "Immutable Bookmarks", href: "/bookmarks", icon: BookMarked },
  { name: "AI Predictor", href: "/ai-assistant", icon: Sparkles },
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
  { name: "Verification Queue", href: "/admin/verify", icon: UserCheck },
];

export function DashboardSidebar({ isAdmin = false, isTutor = false }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col gap-4 border-r border-sidebar-border bg-sidebar p-4 w-64 md:flex">
      <div className="flex items-center gap-3 px-2 pb-6 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] overflow-hidden">
          <img src="/icon.png" alt="PassMark" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold font-headline leading-none">PassMark</span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500/60 uppercase tracking-[0.2em] mt-1">Scholar Lattice</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {isAdmin && (
            <div className="mb-6">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500/40 mb-3 px-3">
                Nexus Override
              </div>
              {adminLinks.map((link) => (
                <SidebarLink key={link.name} link={link} active={pathname === link.href} />
              ))}
            </div>
          )}

          {isTutor && (
            <div className="mb-6">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500/40 mb-3 px-3">
                Tutor Lattice
              </div>
              {tutorLinks.map((link) => (
                <SidebarLink key={link.name} link={link} active={pathname === link.href} />
              ))}
            </div>
          )}

          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 px-3">
              Standard Protocol
            </div>
            {studentLinks.map((link) => (
              <SidebarLink key={link.name} link={link} active={pathname === link.href} />
            ))}
          </div>
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border pt-4 px-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-600 group"
        >
          <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}

function SidebarLink({ link, active }: { link: any, active: boolean }) {
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
        active
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
      )}
    >
      <link.icon className={cn("h-4 w-4", active ? "text-emerald-600 dark:text-emerald-500" : "text-muted-foreground")} />
      {link.name}
    </Link>
  );
}
