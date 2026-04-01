"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Star,
  Award,
  Wallet,
  Clock,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { AuraBackground } from "@/components/aura-background";

export default function TutorDashboard() {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuraBackground />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-border shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
              <Award className="w-3 h-3" /> Professional Tutor Hub
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              Tutor <span className="text-emerald-500">Center</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
              Logged in as: <span className="text-foreground font-black">{userData?.fullName || "Verified Expert"}</span>
            </p>
          </div>

          <div className="flex gap-3">
              <div className="bg-muted/50 p-4 rounded-3xl border border-border text-center min-w-[120px]">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Expert Rating</p>
                  <div className="flex items-center justify-center gap-1 text-emerald-500">
                      <Star className="w-4 h-4 fill-emerald-500" />
                      <span className="text-xl font-black">5.0</span>
                  </div>
              </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Students", value: "0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Sessions Held", value: "0", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Wallet Balance", value: "₦0", icon: Wallet, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Impact Score", value: "100%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <AuraCard key={i} className="p-6 group hover:scale-[1.02] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-30" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-2xl font-black text-foreground mt-1">{stat.value}</h3>
            </AuraCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed Content */}
          <div className="lg:col-span-2 space-y-8">
            <AuraCard className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                        <Clock className="w-5 h-5 text-emerald-500" /> Recent Activity
                    </h2>
                    <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
                        View Entire Logs
                    </button>
                </div>
                
                <div className="text-center py-24 bg-muted/20 border-2 border-dashed border-border rounded-[2.5rem]">
                    <div className="w-16 h-16 bg-muted/40 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-muted-foreground opacity-30" />
                    </div>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                        Initialize your first tutoring session node
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2 italic px-12">
                        Start making an impact by offering specialized mentorship for difficult past questions.
                    </p>
                </div>
            </AuraCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <AuraCard className="p-8 border-emerald-500/20 bg-emerald-500/[0.02]">
                <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-500" /> Tutor Profile
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Expertise Level</p>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[25%]" />
                        </div>
                        <p className="text-[9px] text-emerald-500 font-bold mt-2 uppercase">Level 1: Novice Mentor</p>
                    </div>

                    <div className="pt-6 border-t border-dashed border-border">
                        <button className="w-full h-14 rounded-2xl bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                            Verify Qualifications
                        </button>
                    </div>
                </div>
            </AuraCard>
          </div>
        </div>
      </div>
    </div>
  );
}
