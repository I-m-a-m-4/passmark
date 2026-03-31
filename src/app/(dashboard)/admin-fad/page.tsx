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
  });

  useEffect(() => {
    fetchStats();
    fetchMaterials();
  }, []);

  const fetchStats = async () => {
    try {
      const userCount = await getCountFromServer(collection(db, "users"));
      const materialCount = await getCountFromServer(collection(db, "pastQuestions"));
      // Premium check
      const premiumSnap = await getCountFromServer(
        query(collection(db, "users"), where("subscriptionStatus", "in", ["active", "premium"]))
      );

      setStats({
        users: userCount.data().count,
        materials: materialCount.data().count,
        premium: premiumSnap.data().count,
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
      fetchStats(); // Update stats
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Students", val: stats.users, icon: Users, color: "emerald", desc: "Registered accounts" },
          { label: "Library Catalog", val: stats.materials, icon: Layers, color: "indigo", desc: "Material nodes live" },
          { label: "Premium Nodes", val: stats.premium, icon: Crown, color: "amber", desc: "Active subscriptions" },
        ].map((item, i) => (
          <Card key={i} className="bg-zinc-950 border border-white/5 relative overflow-hidden group rounded-[2.5rem]">
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[100px] opacity-20 -mr-8 -mt-8", `bg-${item.color}-500`)}></div>
            <CardContent className="p-10 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10", `text-${item.color}-500`)}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="p-2 rounded-full bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-help">
                  <Info className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em]">{item.label}</p>
                <div className="flex items-end gap-3 pt-1">
                  <h3 className="text-5xl font-black font-headline tracking-tighter text-white">
                    {item.val.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mb-2">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>LIVE</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 font-bold uppercase mt-6 tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 opacity-50" />
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 justify-between bg-zinc-950/50 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl ring-1 ring-white/5">
        <div className="flex items-center gap-4 w-full md:w-[450px] group">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Filter by Course Code or University..."
              className="bg-white/5 border-white/10 h-14 pl-12 rounded-2xl focus:border-emerald-500/50 transition-all font-bold placeholder:text-zinc-600 placeholder:font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
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
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Card className="bg-zinc-950 border border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-dashed border-white/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold font-headline tracking-tight text-white flex items-center gap-4">
                Material Inventory Hub
                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 px-4 py-1 text-[10px] font-black tracking-widest uppercase">
                  {filteredMaterials.length} Nodes Loaded
                </Badge>
              </CardTitle>
              <CardDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                Operational repository for library materials and structural binary tagging
              </CardDescription>
            </div>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl h-14 px-8 shadow-2xl shadow-emerald-500/20 group">
              <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
              ADD NEW NODE
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/2 border-b border-dashed border-white/5">
                  <th className="px-10 py-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Material Identifier</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Institution</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Type</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Level</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-10 py-10">
                        <div className="h-4 bg-white/5 rounded-full w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-zinc-700">
                          <Database className="w-10 h-10" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-zinc-500 uppercase tracking-widest">No matching nodes found</p>
                          <p className="text-[10px] text-zinc-700 font-bold uppercase mt-2 tracking-[0.3em]">Adjust your search parameters</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((m) => (
                    <tr key={m.id} className="group hover:bg-emerald-500/5 transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-emerald-500 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-base font-black text-white tracking-wide uppercase">{m.courseCode}</p>
                            <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1 truncate max-w-[200px] tracking-tight group-hover:text-emerald-500 transition-colors">
                              {m.courseTitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest truncate max-w-[200px]">{m.university}</p>
                        <p className="text-[10px] text-zinc-700 font-medium uppercase mt-1 italic">{m.department}</p>
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
                      <td className="px-10 py-8 text-xs font-black text-zinc-500 tracking-widest uppercase">
                        {m.level}L
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all shadow-xl"
                            onClick={() => window.open(m.fileUrl, "_blank")}
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-xl"
                            onClick={() => deleteMaterial(m.id)}
                          >
                            <Trash2 className="w-5 h-5" />
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

// Fixed missing Plus icon
function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
