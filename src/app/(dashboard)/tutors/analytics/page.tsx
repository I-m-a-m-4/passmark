"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  Star, 
  Award,
  Zap,
  BarChart3,
  Globe,
  Loader2,
  ArrowUpRight,
  Target
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { AuraBackground } from "@/components/aura-background";

export default function ScholarAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuraBackground />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 font-bold text-[10px] uppercase tracking-widest">
              <Award className="w-4 h-4" /> Professional Expert Analytics
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                Impact <span className="text-sky-500 italic">Scoreboard</span>
            </h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">
                Monitor your academic mentorship reach across the registry
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-card/60 p-4 rounded-3xl border border-border shadow-2xl overflow-hidden backdrop-blur-3xl px-8">
              <div className="text-center">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">Impact Rating</p>
                  <div className="flex items-center gap-1.5 text-sky-500 font-black text-2xl">
                      <Star className="w-5 h-5 fill-sky-500" /> 5.0
                  </div>
              </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Reach", value: "0 Scholars", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Consistency", value: "100%", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Earnings Growth", value: "+0%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Session Speed", value: "A+", icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <AuraCard key={i} className="p-6 group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-30" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-2xl font-black text-foreground mt-1 tracking-tight">{stat.value}</h3>
            </AuraCard>
          ))}
        </div>

        {/* Dynamic Activity Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AuraCard className="lg:col-span-2 p-8 overflow-hidden relative group h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-sky-500" /> Student Success Index
                    </h2>
                </div>

                <div className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-border rounded-[2.5rem] bg-muted/20">
                    <div className="h-16 w-16 bg-muted/40 rounded-3xl flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-muted-foreground opacity-20" />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                        Telemetry nodes initializing...
                    </p>
                </div>
            </AuraCard>

            <AuraCard className="p-8 h-[400px]">
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-8">Expert Growth</h3>
                <div className="space-y-8">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-muted-foreground uppercase">Expert Level</span>
                            <span className="text-[10px] font-black text-sky-500 uppercase">Lv. 1 Scholar</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-sky-500 w-[10%]" />
                        </div>
                        <p className="text-[8px] text-muted-foreground italic">100 more points to reach Master Mentor status</p>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-dashed border-border">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recommendations</p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-[10px] font-bold text-foreground opacity-60">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Host your first Q&A session
                            </li>
                            <li className="flex items-center gap-2 text-[10px] font-bold text-foreground opacity-60">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Verify your institutional degree
                            </li>
                        </ul>
                    </div>
                </div>
            </AuraCard>
        </div>
      </div>
    </div>
  );
}
