"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Users, 
  TrendingUp, 
  Zap, 
  Search, 
  Globe,
  CheckCircle2,
  PieChart,
  UserCheck,
  Calendar,
  Building2,
  ArrowUpRight
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ReferralNetworkPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [repCode, setRepCode] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
            // First find the rep's code
            const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", user.uid)));
            if (!userDoc.empty) {
                const code = userDoc.docs[0].data().referralCode;
                setRepCode(code);
                if (code) fetchReferrals(code);
            }
        }
    });
    return () => unsub();
  }, []);

  async function fetchReferrals(code: string) {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("referredBy", "==", code),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReferrals(data);
    } catch (e) {
      console.error("Referral fetch error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24">
      {/* Network Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-card/40 backdrop-blur-3xl p-10 rounded-2xl border border-border shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                <Globe className="w-4 h-4" /> Global Registry Node
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                Referral <span className="text-emerald-500 italic">Network Discovery</span>
            </h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">
                Tracking <span className="text-foreground">{referrals.length} Influenced Scholars</span> from Node: <span className="text-emerald-500">{repCode || "N/A"}</span>
            </p>
         </div>
         <div className="bg-muted/50 border border-border p-6 rounded-xl text-center">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-2">My Identifier Node</p>
            <div className="flex items-center gap-4 text-xl font-black text-foreground uppercase tracking-wider">
                {repCode || "Initializing..."}
                <Badge className="bg-emerald-500 text-black border-0">ACTIVE</Badge>
            </div>
         </div>
      </div>

       {/* Network High-Fidelity Stats */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Influenced Scholars", val: referrals.length, icon: Users, color: "emerald", desc: "Total network reach" },
          { label: "Active Subscriptions", val: referrals.filter(r => r.subscriptionStatus === 'pro').length, icon: UserCheck, color: "amber", desc: "Conversion velocity: verified" },
          { label: "Network Up-time", val: "100%", icon: Zap, color: "sky", desc: "Registry integrity index" },
          { label: "Institutional Rank", val: "#4", icon: TrendingUp, color: "indigo", desc: "Leaderboard positioning" },
        ].map((s, i) => (
          <AuraCard key={i} className="p-8 relative overflow-hidden group">
            <div className={cn("absolute bottom-0 right-0 p-4 opacity-5 translate-x-4 translate-y-4 transition-transform group-hover:scale-110", `text-${s.color}-500`)}>
                <s.icon className="w-24 h-24" />
            </div>
            <div className="flex flex-col h-full justify-between gap-6 relative z-10">
                <div className={cn("p-2.5 rounded-xl border border-border w-fit", `text-${s.color}-500 bg-${s.color}-500/5`)}>
                    <s.icon className="w-5 h-5 fill-current opacity-50" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{s.label}</p>
                    <h3 className="text-3xl font-black text-foreground mt-2 tracking-tighter uppercase">{s.val}</h3>
                </div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">{s.desc}</p>
            </div>
          </AuraCard>
        ))}
      </div>

      {/* Discovery Hub Table */}
      <AuraCard>
        <div className="p-10 border-b border-dashed border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                    Scholar Registry <span className="text-emerald-500/20 italic">//</span> Influenced Network
                </h2>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Verified students linked to your ID Node</p>
            </div>
            <div className="relative flex-1 md:w-64 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-40" />
                <Input 
                    placeholder="Search Scholars..."
                    className="pl-9 h-10 bg-muted/30 border-border text-[10px] font-black uppercase tracking-widest placeholder:font-bold focus-visible:ring-0"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-muted/10 border-b border-border/50">
                        <th className="px-10 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Scholar Node</th>
                        <th className="px-10 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Institutional Discovery</th>
                        <th className="px-10 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Registry Timestamp</th>
                        <th className="px-10 py-5 text-right text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Node Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                    {loading ? (
                         Array(5).fill(0).map((_, i) => (
                             <tr key={i} className="animate-pulse opacity-20"><td colSpan={4} className="p-10"><div className="h-4 bg-muted rounded-full w-full" /></td></tr>
                         ))
                    ) : referrals.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-32 text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">No scholars discovered in registry under Node: {repCode}</p>
                            </td>
                        </tr>
                    ) : referrals.map((ref) => (
                        <tr key={ref.id} className="group hover:bg-emerald-500/[0.02] transition-colors">
                            <td className="px-10 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-emerald-500 shrink-0 font-black">
                                       {ref.fullName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-foreground uppercase tracking-widest leading-none">{ref.fullName}</p>
                                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">{ref.email.slice(0, 15)}...</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-6">
                                <p className="text-[10px] font-black text-foreground uppercase tracking-widest">{ref.university || "Verification Needed"}</p>
                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tight opacity-60 italic">{ref.department || "General Node"}</p>
                            </td>
                            <td className="px-10 py-6">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase">{format(ref.createdAt?.toDate() || new Date(), "MMM dd, yyyy")}</span>
                                </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                                <Badge variant="outline" className={cn(
                                    "px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border-0",
                                    ref.subscriptionStatus === 'pro' ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"
                                )}>
                                    {ref.subscriptionStatus === 'pro' ? "PREMIUM SCHOLAR" : "BASIC NODE"}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </AuraCard>
    </div>
  );
}
