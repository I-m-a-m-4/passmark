"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Users,
  MapPin,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  ShieldCheck,
  Building2,
  Trash2,
  AlertCircle,
  Zap,
  Ban,
  CheckCircle2,
  BarChart3,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AuraCard } from "@/components/aura-ui";

interface CampusRep {
  id: string;
  fullName: string;
  university: string;
  referralCode: string;
  totalReferrals: number;
  status: "active" | "inactive";
  email: string;
}

export default function CampusRepsPage() {
  const [reps, setReps] = useState<CampusRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRep, setNewRep] = useState({
    fullName: "",
    university: "",
    referralCode: "",
    email: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchReps();
  }, []);

  async function fetchReps() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "campus_rep")
      );
      const querySnapshot = await getDocs(q);
      const repsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CampusRep[];
      setReps(repsData);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync error", description: e.message });
    } finally {
      setLoading(false);
    }
  }

  const handleAddRep = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), {
        ...newRep,
        role: "campus_rep",
        status: "active",
        totalReferrals: 0,
        createdAt: serverTimestamp(),
      });
      setShowAddModal(false);
      setNewRep({ fullName: "", university: "", referralCode: "", email: "" });
      fetchReps();
      toast({ title: "Representative Initialized", description: "Protocol deployed to university node." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Initialization failed", description: err.message });
    }
  };

  const toggleRepStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateDoc(doc(db, "users", id), { status: newStatus });
      setReps(reps.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
      toast({ title: "Status Synchronized", description: `Representative session is now ${newStatus}.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Protocol error", description: e.message });
    }
  };

  const filteredReps = reps.filter(
    (rep) =>
      rep.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueUniversities = Array.from(new Set(reps.map(r => r.university))).length;
  const totalReferrals = reps.reduce((acc, curr) => acc + (curr.totalReferrals || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24">
      {/* Power Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-card/40 backdrop-blur-3xl p-10 rounded-2xl border border-border shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                <Globe className="w-4 h-4" /> Regional Agent Command
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                Campus <span className="text-emerald-500 italic">Representative Hub</span>
            </h1>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">
                Managing <span className="text-foreground">{reps.length} Agents</span> across {uniqueUniversities} National University Nodes
            </p>
         </div>
         <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-black h-16 px-10 rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 group uppercase tracking-widest text-xs"
         >
            <Plus className="mr-3 h-5 w-5 group-hover:rotate-90 transition-transform" />
            Initialize New Agent
         </Button>
      </div>

      {/* Real-Time Telemetery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Nodes", val: uniqueUniversities, icon: Building2, color: "sky", desc: "Institutional coverage" },
          { label: "Network referrals", val: totalReferrals.toLocaleString(), icon: TrendingUp, color: "emerald", desc: "Total conversion velocity" },
          { label: "Success index", val: reps.length > 0 ? (totalReferrals / reps.length).toFixed(1) : "0", icon: Zap, color: "amber", desc: "Avg scholar acquisition per rep" },
          { label: "Protocol status", val: "Operational", icon: ShieldCheck, color: "indigo", desc: "Registry integrity: verified" },
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

      {/* Advanced Filter Node */}
      <div className="relative group">
        <Search className="absolute left-6 top-5 h-6 w-6 text-muted-foreground opacity-40 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder="Filter by Agent Name, Institution, or Referral ID Code..."
          className="pl-16 h-16 bg-card/40 backdrop-blur-3xl border-border rounded-xl focus:border-emerald-500/40 text-[11px] font-black uppercase tracking-widest transition-all placeholder:text-muted-foreground/40"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Representative Discovery Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
            Array(4).fill(0).map((_, i) => <AuraCard key={i} className="h-48 animate-pulse opacity-20"><div className="h-full w-full" /></AuraCard>)
        ) : filteredReps.length > 0 ? (
          filteredReps.map((rep) => (
            <AuraCard
              key={rep.id}
              className={cn(
                "group relative border-border/40 transition-all p-1",
                rep.status === "inactive" && "opacity-60 grayscale"
              )}
            >
              <div className="flex flex-col md:flex-row items-center p-8 gap-8">
                <div className="h-20 w-20 rounded-xl bg-muted border border-border flex items-center justify-center text-emerald-500 text-3xl font-black relative overflow-hidden group-hover:scale-105 transition-transform shrink-0">
                   <div className="absolute inset-0 bg-emerald-500/5 rotate-12 -translate-x-4 -translate-y-4"></div>
                   {rep.fullName?.charAt(0)}
                </div>
                <div className="flex-1 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{rep.fullName}</h3>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">ID Node: {rep.referralCode}</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <Badge 
                            variant="outline" 
                            className={cn(
                                "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border-0",
                                rep.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                            )}
                         >
                            {rep.status}
                        </Badge>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toggleRepStatus(rep.id, rep.status)}
                            className={cn(
                                "h-10 w-10 rounded-xl border border-border hover:bg-red-500 hover:text-white transition-all",
                                rep.status === 'inactive' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-black"
                            )}
                        >
                            {rep.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                     <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                        <Building2 className="w-3.5 h-3.5 text-sky-500" />
                        <span className="text-[9px] font-black text-muted-foreground uppercase">{rep.university}</span>
                     </div>
                     <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-500">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase">{rep.totalReferrals || 0} Discovery Signals</span>
                     </div>
                  </div>
                </div>
              </div>
            </AuraCard>
          ))
        ) : (
          <div className="lg:col-span-2 text-center py-40 border-2 border-dashed border-border rounded-2xl bg-card/10">
            <AlertCircle className="w-16 h-16 text-muted-foreground opacity-20 mx-auto mb-8" />
            <h3 className="text-xl font-black text-muted-foreground uppercase tracking-widest opacity-60">No matching representatives discovered</h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase mt-4 tracking-[0.4em]">Review protocol or initialize new agent node</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
          <AuraCard className="w-full max-w-xl border-border/60">
            <div className="p-10 border-b border-dashed border-border/50">
               <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Initialize Academic Agent</h2>
               <p className="text-[10px] text-emerald-500 font-black uppercase mt-2 tracking-widest">Master representative node creation</p>
            </div>
            <div className="p-10 space-y-8">
              <form onSubmit={handleAddRep} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Agent Name</label>
                        <Input
                            required
                            value={newRep.fullName}
                            onChange={(e) => setNewRep({ ...newRep, fullName: e.target.value })}
                            placeholder="Full Name"
                            className="bg-muted/50 border-border h-14 rounded-xl px-6 focus:border-emerald-500/40 text-[11px] font-black uppercase tracking-widest"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Node</label>
                        <Input
                            required
                            type="email"
                            value={newRep.email}
                            onChange={(e) => setNewRep({ ...newRep, email: e.target.value })}
                            placeholder="agent@passmark.edu"
                            className="bg-muted/50 border-border h-14 rounded-xl px-6 focus:border-emerald-500/40 text-[11px] font-black"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">University Node</label>
                        <Input
                            required
                            value={newRep.university}
                            onChange={(e) => setNewRep({ ...newRep, university: e.target.value })}
                            placeholder="e.g. UNILAG"
                            className="bg-muted/50 border-border h-14 rounded-xl px-6 focus:border-emerald-500/40 text-[11px] font-black uppercase tracking-widest"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Referral Signature Code</label>
                        <Input
                            required
                            value={newRep.referralCode}
                            onChange={(e) => setNewRep({ ...newRep, referralCode: e.target.value.toUpperCase() })}
                            placeholder="e.g. LAG001"
                            className="bg-muted/50 border-border h-14 rounded-xl px-6 focus:border-emerald-500/40 text-[11px] font-black uppercase tracking-widest"
                        />
                    </div>
                </div>
                <div className="flex gap-4 pt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-14 rounded-xl border border-border font-black uppercase text-[10px] tracking-widest text-muted-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black h-14 rounded-xl shadow-xl shadow-emerald-500/10 uppercase text-xs tracking-widest"
                  >
                    Deploy Agent
                  </Button>
                </div>
              </form>
            </div>
          </AuraCard>
        </div>
      )}
    </div>
  );
}
