"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Search,
  Filter,
  FileText,
  Trash2,
  ExternalLink,
  ChevronRight,
  Database,
  Loader2,
  Users,
  Layers,
  Crown,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  Info,
  Database as DatabaseIcon,
  Search as SearchIcon,
  Trash2 as TrashIcon,
  Plus as PlusIcon,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

      // Audit Revenue (Summing unlocked materials across users)
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
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "pastQuestions"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(data);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error fetching materials",
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this material?")) return;

    try {
      await deleteDoc(doc(db, "pastQuestions", id));
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      fetchStats(); 
      toast({ title: "Material Removed", description: "Successfully purged node from library." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Deletion Failed", description: e.message });
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
      m.university?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "all" || m.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Analytics Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", val: stats.users.toLocaleString(), icon: Users, color: "emerald", desc: "Registered accounts" },
          { label: "Library Catalog", val: stats.materials.toLocaleString(), icon: Layers, color: "indigo", desc: "Material nodes live" },
          { label: "Gross Revenue", val: `₦${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "rose", desc: "Material Sale Revenue" },
          { label: "Premium Nodes", val: stats.premium.toLocaleString(), icon: Crown, color: "amber", desc: "Active subscriptions" },
        ].map((item, i) => (
          <Card key={i} className="bg-card dark:bg-zinc-950 border border-border dark:border-white/5 relative overflow-hidden group rounded-[2.5rem] shadow-sm">
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-10 -mr-8 -mt-8", `bg-${item.color}-500`)}></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className={cn("p-3 rounded-2xl bg-muted dark:bg-white/5 border border-border dark:border-white/10", `text-${item.color}-500`)}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="p-2 rounded-full bg-muted dark:bg-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-help">
                  <Info className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{item.label}</p>
                <div className="flex items-end gap-2 pt-1">
                  <h3 className="text-3xl font-black font-headline tracking-tighter text-foreground">
                    {item.val}
                  </h3>
                  <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-bold mb-1.5">
                    <ArrowUpRight className="w-2.5 h-2.5" />
                    <span>LIVE</span>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase mt-4 tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3 opacity-30" />
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 justify-between bg-card/50 dark:bg-zinc-950/50 p-6 rounded-[2.5rem] border border-border dark:border-white/5 backdrop-blur-3xl ring-1 ring-border dark:ring-white/5 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-[450px] group">
          <div className="relative w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Filter by Course Code or University..."
              className="bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 h-14 pl-12 rounded-2xl focus:border-emerald-500/50 transition-all font-bold placeholder:text-muted-foreground placeholder:font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-muted/50 dark:bg-white/5 p-1 rounded-2xl border border-border dark:border-white/10">
            {["all", "Test", "Exam", "CBT"].map((t) => (
              <Button
                key={t}
                variant="ghost"
                size="sm"
                onClick={() => setFilterType(t)}
                className={cn(
                  "px-6 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  filterType === t 
                    ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:text-black" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5"
                )}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Card className="bg-card dark:bg-zinc-950 border border-border dark:border-white/5 shadow-xl rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-dashed border-border dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold font-headline tracking-tight text-foreground flex items-center gap-4">
                Material Inventory Hub
                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 px-4 py-1 text-[10px] font-black tracking-widest uppercase">
                  {filteredMaterials.length} Nodes Loaded
                </Badge>
              </CardTitle>
              <CardDescription className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
                Operational repository for library materials and structural binary tagging
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 dark:bg-white/2 border-b border-dashed border-border dark:border-white/5">
                  <th className="px-10 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Material Identifier</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Institution</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Type</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Level</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-border dark:divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-10 py-10">
                        <div className="h-4 bg-muted dark:bg-white/5 rounded-full w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-muted dark:bg-white/5 flex items-center justify-center text-muted-foreground">
                          <DatabaseIcon className="w-10 h-10" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-muted-foreground uppercase tracking-widest">No matching nodes found</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase mt-2 tracking-[0.3em]">Adjust your search parameters</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((m) => (
                    <tr key={m.id} className="group hover:bg-emerald-500/5 transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="p-4 rounded-2xl bg-muted dark:bg-white/5 border border-border dark:border-white/10 text-emerald-500 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-base font-black text-foreground tracking-wide uppercase">{m.courseCode}</p>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase mt-1 truncate max-w-[200px] tracking-tight group-hover:text-emerald-500 transition-colors">
                              {m.courseTitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[200px]">{m.university}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-700 font-medium uppercase mt-1 italic">{m.department}</p>
                      </td>
                      <td className="px-10 py-8">
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-4 py-1 text-[9px] font-black tracking-widest uppercase border-0 rounded-lg",
                            m.type === "Exam" 
                              ? "bg-red-500/10 text-red-500" 
                              : m.type === "Test" 
                                ? "bg-amber-500/10 text-amber-500" 
                                : "bg-emerald-500/10 text-emerald-500"
                          )}
                        >
                          {m.type}
                        </Badge>
                      </td>
                      <td className="px-10 py-8 text-xs font-black text-muted-foreground tracking-widest uppercase">
                        {m.level}L
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl bg-card dark:bg-white/5 border border-border dark:border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all shadow-xl"
                            onClick={() => window.open(m.fileUrl, "_blank")}
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl bg-card dark:bg-white/5 border border-border dark:border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-xl"
                            onClick={() => deleteMaterial(m.id)}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
