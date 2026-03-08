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
    CreditCard
} from "lucide-react";

const links = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Search", href: "/search", icon: Search },
    { name: "Bookmarks", href: "/bookmarks", icon: BookMarked },
    { name: "AI", href: "/ai-assistant", icon: Sparkles },
    { name: "Tutors", href: "/tutors", icon: Users },
    { name: "Billing", href: "/billing", icon: CreditCard },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <nav className="bg-card/80 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl p-2 flex items-center justify-around">
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
                                    : "text-muted-foreground hover:text-emerald-400"
                            )}
                        >
                            <link.icon className={cn("h-5 w-5", active && "scale-110")} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
