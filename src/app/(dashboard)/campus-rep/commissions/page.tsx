"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  CreditCard, 
  TrendingUp, 
  Zap, 
  Calendar, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Award,
  Wallet,
  Clock,
  CheckCircle2
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function CommissionLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingPayout: 0,
    conversions: 0
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
        if (user) fetchCommissions(user.uid);
    });
    return () => unsub();
  }, []);

  async function fetchCommissions(uid: string) {
    setLoading(true);
    try {
      // In a real system, we'd fetch from a 'commissions' collection
      // For now, we simulate with existing user data or a placeholder
      // Let's assume we have a 'commissions' collection keyed by repId
      const q = query(
        collection(db, "commissions"),
        where("repId", "==", uid),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(data);

      // Simulating stats
      const total = data.reduce((acc, curr: any) => acc + (curr.amount || 0), 0);
      setStats({
        totalEarned: total,
        pendingPayout: total * 0.2, // Simulate pending
        conversions: data.length
      });

    } catch (e) {
      console.error("Commission fetch error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 animate-on-scroll">
      {/* Header telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-card/40 backdrop-blur-3xl p-10 rounded-2xl border border-border show-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                <Wallet className="w-4 h-4" /> Financial Telemetry Hub
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                Commission <span className="text-emerald-500 italic">Discovery Node</span>
            </h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">
                Tracking <span className="text-foreground">{stats.conversions} Discovery Signals</span> across your University footprint
            </p>
         </div>
         <div className="flex items-center gap-8">
            <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Total Earnings</p>
                <div className="text-2xl font-black text-foreground mt-1">₦{stats.totalEarned.toLocaleString()}</div>
            </div>
            <div className="h-12 w-px bg-border whitespace-nowrap" />
            <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Payout Status</p>
                <div className="text-2xl font-black text-emerald-500 mt-1 uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Active
                </div>
            </div>
         </div>
      </div>

      {/* Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Gross Revenue Share", val: `₦${stats.totalEarned.toLocaleString()}`, icon: TrendingUp, color: "emerald", desc: "Total rewards accumulated" },
          { label: "Pending Verification", val: `₦${stats.pendingPayout.toLocaleString()}`, icon: Clock, color: "amber", desc: "Awaiting node audit" },
          { label: "Successful Referrals", val: stats.conversions, icon: Award, color: "sky", desc: "Verified scholar discovery" },
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

      {/* Logs Hub */}
      <AuraCard>
        <div className="p-10 border-b border-dashed border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                    Transaction History <span className="text-emerald-500/20 italic">//</span> Financial Protocol
                </h2>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Verified successful referral signals</p>
            </div>
            <div className="relative flex-1 md:w-64 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-40" />
                <Input 
                    placeholder="Search Logs..."
                    className="pl-9 h-10 bg-muted/30 border-border text-[10px] font-black uppercase tracking-widest placeholder:font-bold focus-visible:ring-0"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-muted/10 border-b border-border/50">
                        <th className="px-10 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Transaction node</th>
                        <th className="px-10 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Institution</th>
                        <th className="px-10 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tagging</th>
                        <th className="px-10 py-5 text-right text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Profit</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <tr key={i} className="animate-pulse opacity-20"><td colSpan={4} className="p-10"><div className="h-4 bg-muted rounded-full w-full" /></td></tr>
                        ))
                    ) : logs.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-32 text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">No confirmed commission signals discovered in registry</p>
                            </td>
                        </tr>
                    ) : logs.map((log) => (
                        <tr key={log.id} className="group hover:bg-emerald-500/[0.02] transition-colors">
                            <td className="px-10 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-emerald-500 shrink-0">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-foreground uppercase tracking-widest leading-none">Scholar Discovery</p>
                                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">ID: {log.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-6">
                                <p className="text-[10px] font-black text-foreground uppercase tracking-widest">{log.institution || "UNILAG"}</p>
                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tight opacity-60 italic">{format(log.createdAt?.toDate() || new Date(), "MMM dd, yyyy")}</p>
                            </td>
                            <td className="px-10 py-6">
                                <Badge variant="outline" className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-0">Verified Signal</Badge>
                            </td>
                            <td className="px-10 py-6 text-right">
                                <p className="text-sm font-black text-emerald-500 uppercase tracking-widest">+₦{log.amount?.toLocaleString()}</p>
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
