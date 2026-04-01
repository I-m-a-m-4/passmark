"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { 
  Clock, 
  Calendar, 
  Users, 
  ChevronRight,
  Plus,
  Video,
  MapPin,
  Search
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { AuraBackground } from "@/components/aura-background";
import { Input } from "@/components/ui/input";

export default function SessionManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuraBackground />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                Session <span className="text-sky-500 italic">Manager</span>
            </h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">
                Track and schedule your verified mentorship nodes
            </p>
          </div>
          <button className="h-14 px-8 rounded-2xl bg-sky-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Initialize New Session
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground opacity-50" />
                    <Input 
                        placeholder="Search sessions by student or course code..."
                        className="pl-12 bg-card/40 backdrop-blur-3xl border-border h-12 rounded-2xl text-foreground"
                    />
                </div>

                {/* Session Feed */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-2">Upcoming Sessions (0)</p>
                    <div className="text-center py-32 bg-sky-500/[0.02] border-2 border-dashed border-sky-500/10 rounded-[2.5rem]">
                        <div className="w-16 h-16 bg-sky-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-sky-500 opacity-30" />
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            No active session nodes detected
                        </p>
                        <p className="text-[8px] text-muted-foreground/60 mt-2 italic max-w-xs mx-auto">
                            Once a student hires you from the Marketplace, their session request will materialize here.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar Tools */}
            <div className="space-y-8">
                <AuraCard className="p-8 border-sky-500/20">
                    <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Video className="w-4 h-4 text-sky-500" /> Virtual Node Prep
                    </h2>
                    <div className="space-y-6">
                        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 text-sky-500">Node Availability</p>
                            <p className="text-xs font-bold text-foreground">Monday — Friday</p>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">09:00 AM - 05:00 PM</p>
                        </div>
                        <button className="w-full h-12 rounded-xl border border-sky-500/30 text-sky-500 text-[10px] font-black uppercase tracking-widest hover:bg-sky-500/10 transition-all">
                            Configure Work Hours
                        </button>
                    </div>
                </AuraCard>
            </div>
        </div>
      </div>
    </div>
  );
}
