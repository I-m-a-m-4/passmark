"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  getCountFromServer,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Search,
  FileText,
  ExternalLink,
  Database,
  Loader2,
  Users,
  Layers,
  Crown,
  ArrowUpRight,
  Sparkles,
  Info,
  TrendingUp,
  BarChart3,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AuraCard } from "@/components/aura-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  // Analytics State
  const [stats, setStats] = useState({
    users: 0,
    materials: 0,
    premium: 0,
    revenue: 0,
    tutors: 0
  });

  useEffect(() => {
    fetchStats();
    fetchMaterials();
  }, []);

  const fetchStats = async () => {
    try {
      const userCount = await getCountFromServer(collection(db, "users"));
      const materialCount = await getCountFromServer(collection(db, "pastQuestions"));
      const premiumSnap = await getCountFromServer(
        query(collection(db, "users"), where("subscriptionStatus", "in", ["active", "premium"]))
      );
      const tutorSnap = await getCountFromServer(
        query(collection(db, "users"), where("roles", "array-contains", "tutor"))
      );

      // Audit Revenue (Summing unlocked materials)
      const userDocs = await getDocs(collection(db, "users"));
      let totalRevenue = 0;
      userDocs.forEach((userDoc) => {
          const u = userDoc.data();
          const unlockedCount = (u.unlockedParts || []).length;
          totalRevenue += (unlockedCount * 2000);
      });

      setStats({
        users: userCount.data().count,
        materials: materialCount.data().count,
        premium: premiumSnap.data().count,
        tutors: tutorSnap.data().count,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "pastQuestions"), orderBy("createdAt", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      setMaterials(querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })));
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync error", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    if (!window.confirm("Confirm permanent deletion of this material node?")) return;
    try {
      await deleteDoc(doc(db, "pastQuestions", id));
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      fetchStats(); 
      toast({ title: "Material Removed", description: "Node successfully purged from registry." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Operation failed", description: e.message });
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
      m.university?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "all" || m.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Simple Chart Visualization Data
  const growthData = [
    { day: "Mon", val: 40 },
    { day: "Tue", val: 65 },
    { day: "Wed", val: 45 },
    { day: "Thu", val: 90 },
    { day: "Fri", val: 75 },
    { day: "Sat", val: 85 },
    { day: "Sun", val: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24">
      {/* Header Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/40 backdrop-blur-3xl p-10 rounded-2xl border border-border shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Global Admin Protocol
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                Network <span className="text-emerald-500 italic">Command Center</span>
            </h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">
                Overseeing <span className="text-foreground">{stats.users} Scholars</span> across the National University Node
            </p>
         </div>
         <div className="flex items-center gap-8">
            <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Revenue Velocity</p>
                <div className="text-2xl font-black text-foreground mt-1">₦{stats.revenue.toLocaleString()}</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">Network Up-time</p>
                <div className="text-2xl font-black text-emerald-500 mt-1 uppercase flex items-center gap-2">
                    <Zap className="w-5 h-5 fill-emerald-500" /> 100%
                </div>
            </div>
         </div>
      </div>

      {/* Analytics Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <AuraCard className="lg:col-span-2 p-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest leading-none">Scholar Growth Velocity</h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2 opacity-60">Live acquisition telemetry</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-black uppercase text-muted-foreground">New Scholars</span>
                    </div>
                </div>
            </div>
            
            {/* High-Fidelity CSS Chart */}
            <div className="h-64 flex items-end justify-between gap-2 pt-8">
                {growthData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                        <div 
                            className="w-full bg-emerald-500/10 rounded-xl relative overflow-hidden group-hover:bg-emerald-500/20 transition-all border border-emerald-500/5"
                            style={{ height: `${d.val}%` }}
                        >
                            <div className="absolute bottom-0 left-0 w-full bg-emerald-500/40 h-2 group-hover:h-full transition-all duration-700" />
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-black text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                {d.val}
                            </div>
                        </div>
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{d.day}</span>
                    </div>
                ))}
            </div>
        </AuraCard>

        {/* Breakdown Stats */}
        <div className="space-y-6">
            {[
                { label: "Premium Nodes", val: stats.premium, icon: Crown, color: "text-amber-500", border: "border-amber-500/20", trend: "+12%" },
                { label: "Material Nodes", val: stats.materials, icon: Layers, color: "text-emerald-500", border: "border-emerald-500/20", trend: "+24%" },
                { label: "Academic Experts", val: stats.tutors, icon: Users, color: "text-sky-500", border: "border-sky-500/20", trend: "+5%" },
            ].map((s, i) => (
                <AuraCard key={i} className={cn("p-6 border-l-4", s.border)}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn("p-2.5 rounded-xl bg-muted/50 border border-border", s.color)}>
                                <s.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</p>
                                <h4 className="text-xl font-black text-foreground mt-0.5">{s.val}</h4>
                            </div>
                        </div>
                        <div className="text-emerald-500 text-[9px] font-black">{s.trend}</div>
                    </div>
                </AuraCard>
            ))}
        </div>
      </div>

      {/* Main Inventory Hub */}
      <AuraCard className="overflow-hidden border-border/40">
        <div className="p-10 border-b border-dashed border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                    Library Catalog <span className="text-emerald-500/20 italic">//</span> Integrity Hub
                </h2>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Verified academic material binary tagging</p>
            </div>
            
            <div className="flex items-center gap-4 bg-muted/30 p-1.5 rounded-xl border border-border w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-40" />
                    <Input 
                        placeholder="Course Code / University..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 bg-transparent border-none text-xs font-black uppercase tracking-widest placeholder:font-bold focus-visible:ring-0"
                    />
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="flex gap-1 overflow-x-auto px-2">
                    {["all", "Test", "Exam"].map(t => (
                        <button 
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                filterType === t ? "bg-emerald-500 text-black shadow-md" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-muted/10 border-b border-border/50">
                        <th className="px-10 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Material Node</th>
                        <th className="px-10 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Institution</th>
                        <th className="px-10 py-5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tagging</th>
                        <th className="px-10 py-5 text-right text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Control</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <tr key={i} className="animate-pulse"><td colSpan={4} className="p-10"><div className="h-4 bg-muted rounded-full w-full opacity-20" /></td></tr>
                        ))
                    ) : filteredMaterials.map((m) => (
                        <tr key={m.id} className="group hover:bg-emerald-500/[0.02] transition-all">
                            <td className="px-10 py-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-emerald-500 shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-black text-foreground uppercase tracking-wider">{m.courseCode}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase truncate max-w-[200px] opacity-60 italic">{m.courseTitle}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-6">
                                <p className="text-[10px] font-black text-foreground uppercase tracking-widest">{m.university}</p>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight opacity-60">{m.department}</p>
                            </td>
                            <td className="px-10 py-6">
                                <div className="flex items-center gap-2">
                                     <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                        m.type === 'Exam' ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                     )}>
                                        {m.type}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border text-[8px] font-black uppercase tracking-widest">
                                        {m.level}L
                                    </span>
                                </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-10 w-10 rounded-xl bg-muted/50 border border-border hover:bg-emerald-500 hover:text-black transition-all"
                                        onClick={() => window.open(m.fileUrl, "_blank")}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-10 w-10 rounded-xl bg-muted/50 border border-border hover:bg-red-500 hover:text-white transition-all"
                                        onClick={() => deleteMaterial(m.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
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
