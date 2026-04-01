"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Clock, 
  Star, 
  Wallet,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Calendar,
  Loader2
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { AuraBackground } from "@/components/aura-background";
import Link from "next/link";

export default function TutorHub() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/40 backdrop-blur-3xl p-8 rounded-2xl border border-border shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
            
            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 font-bold text-[10px] uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Professional Expert Node
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                    Mentor <span className="text-sky-500 italic">Command Center</span>
                </h1>
                <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">
                    Scaling expertise across <span className="text-foreground">{userData?.university || "National Registry"}</span>
                </p>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Reputation Score</p>
                    <div className="flex items-center justify-center gap-1.5 text-sky-500 font-black text-xl">
                        <Star className="w-5 h-5 fill-sky-500" /> {userData?.avgRating || "5.0"}
                    </div>
                </div>
            </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AuraCard className="p-6 border-sky-500/10 group hover:scale-[1.02] transition-all">
                <div className="bg-sky-500/10 p-3 rounded-xl text-sky-500 w-fit mb-4">
                    <Wallet className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Expert Earnings</p>
                <h2 className="text-2xl font-black text-foreground mt-1">₦{userData?.tutorEarnings || 0}</h2>
                <div className="flex items-center gap-2 text-sky-500 text-[9px] font-black mt-2 uppercase tracking-widest cursor-pointer">
                    Withdraw Funds <ChevronRight className="w-3 h-3" />
                </div>
            </AuraCard>

            <AuraCard className="p-6 border-emerald-500/10 group hover:scale-[1.02] transition-all">
                <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 w-fit mb-4">
                    <Users className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Scholar Reach</p>
                <h2 className="text-2xl font-black text-foreground mt-1">{userData?.reviewCount || 0} Mentees</h2>
                <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-black mt-2 uppercase tracking-widest">
                    Verified Feedback <ChevronRight className="w-3 h-3" />
                </div>
            </AuraCard>

            <AuraCard className="p-6 border-blue-500/10 group hover:scale-[1.02] transition-all">
                <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500 w-fit mb-4">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Growth Velocity</p>
                <h2 className="text-2xl font-black text-foreground mt-1">Stable</h2>
                <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mt-2">Activity Score: 100%</p>
            </AuraCard>

            <AuraCard className="p-6 border-purple-500/10 group hover:scale-[1.02] transition-all">
                <div className="bg-purple-500/10 p-3 rounded-xl text-purple-500 w-fit mb-4">
                    <Zap className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Expert Level</p>
                <h2 className="text-2xl font-black text-foreground mt-1 italic">Lv. 1 Scholar</h2>
                <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mt-2">Next Tier: 100 Points</p>
            </AuraCard>
        </div>

        {/* Expert Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Link href="/tutors/sessions" className="group">
                <AuraCard className="p-10 flex flex-col md:flex-row gap-8 items-center border-sky-500/20 group-hover:bg-sky-500/[0.02] transition-all">
                    <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center shrink-0 border border-sky-500/20 group-hover:scale-110 transition-transform">
                        <Calendar className="w-10 h-10 text-sky-500" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Active Sessions</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Initialize and manage your academic mentorship nodes. Coordinate with scholars to solve complex blocks.
                        </p>
                        <div className="pt-4 flex items-center gap-2 text-sky-500 text-[10px] font-black uppercase tracking-widest">
                            Access Node Manager <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </AuraCard>
            </Link>

            <Link href="/tutors/analytics" className="group">
                <AuraCard className="p-10 flex flex-col md:flex-row gap-8 items-center border-emerald-500/20 group-hover:bg-emerald-500/[0.02] transition-all">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Impact Scoreboard</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Monitor your mentorship success metrics and scholar reach across the national university registry.
                        </p>
                        <div className="pt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            Analyze Telemetry <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </AuraCard>
            </Link>
        </div>
      </div>
    </div>
  );
}
