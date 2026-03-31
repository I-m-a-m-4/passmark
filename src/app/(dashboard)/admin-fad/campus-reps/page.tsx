"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

interface CampusRep {
  id: string;
  fullName: string;
  university: string;
  referralCode: string;
  totalReferrals: number;
  status: "active" | "inactive";
}

export default function CampusRepsPage() {
  const [reps, setReps] = useState<CampusRep[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRep, setNewRep] = useState({
    fullName: "",
    university: "",
    referralCode: "",
  });

  useEffect(() => {
    async function fetchReps() {
      const q = query(
        collection(db, "users"),
        where("role", "==", "campus_rep"),
      );
      const querySnapshot = await getDocs(q);
      const repsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CampusRep[];
      setReps(repsData);
    }
    fetchReps();
  }, []);

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
      setNewRep({ fullName: "", university: "", referralCode: "" });
    } catch (err) {
      console.error("Error adding rep:", err);
    }
  };

  const filteredReps = reps.filter(
    (rep) =>
      rep.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.referralCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-dashed border-emerald-500/20 shadow-sm">
              <MapPin className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
              Representative Network
            </span>
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            Campus Reps
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Managing {reps.length} representatives across active universities.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-12 px-8 rounded-2xl shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Rep
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-4 shadow-sm group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Active Reps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tighter">
              {reps.length}
            </div>
            <p className="text-[10px] text-emerald-600 font-bold mt-2 tracking-wider uppercase">
              Active in 12 Institutions
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-4 shadow-sm group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tighter text-emerald-600">
              {reps.reduce((acc, curr) => acc + (curr.totalReferrals || 0), 0)}
            </div>
            <p className="text-[10px] text-zinc-500 font-bold mt-2 tracking-wider uppercase">
              Conversions this month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-4 shadow-sm group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Top University
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-500" />
              UNILAG
            </div>
            <p className="text-[10px] text-zinc-500 font-bold mt-2 tracking-wider uppercase">
              44% of total uploads
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder="Search representatives by name, university or referral code..."
          className="pl-14 h-14 bg-card/50 border border-dashed border-zinc-200 dark:border-white/10 rounded-[1.5rem] focus:ring-emerald-500/20 text-sm font-medium transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReps.length > 0 ? (
          filteredReps.map((rep) => (
            <Card
              key={rep.id}
              className="group hover:border-emerald-500/30 transition-all bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 overflow-hidden rounded-[2.5rem] shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center p-8 gap-8">
                <div className="h-20 w-20 rounded-3xl bg-zinc-50 dark:bg-white/5 flex items-center justify-center text-emerald-600 dark:text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all border border-dashed border-zinc-200 dark:border-white/10 shadow-inner text-2xl font-black">
                  {rep.fullName.charAt(0)}
                </div>
                <div className="flex-1 space-y-4 font-bold">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl tracking-tight leading-none text-zinc-900 dark:text-white">
                      {rep.fullName}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest border-dashed ${
                          rep.status === "active"
                            ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                            : "bg-red-500/5 text-red-500 border-red-500/20"
                        }`}
                      >
                        {rep.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 border border-dashed border-zinc-200 dark:border-white/5 rounded-xl"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-zinc-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-dashed border-zinc-100 dark:border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[11px] text-zinc-700 dark:text-zinc-300 uppercase">
                        {rep.university}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-dashed border-zinc-100 dark:border-white/5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        ID:{" "}
                        <b className="text-zinc-900 dark:text-white ml-2">
                          {rep.referralCode}
                        </b>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-dashed border-emerald-500/10">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
                        {rep.totalReferrals || 0} Referrals
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="lg:col-span-2 text-center py-32 bg-zinc-50 dark:bg-card/20 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-white/5">
            <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-zinc-400">
              No representatives found.
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm leading-relaxed font-medium">
              Please add a new rep to begin institution management.
            </p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-lg bg-white dark:bg-zinc-950 border-dashed border-zinc-200 dark:border-white/10 shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Add New Representative
              </CardTitle>
              <CardDescription className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest mt-2">
                Create a new local campus agent
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <form onSubmit={handleAddRep} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    Full Name
                  </label>
                  <Input
                    required
                    value={newRep.fullName}
                    onChange={(e) =>
                      setNewRep({ ...newRep, fullName: e.target.value })
                    }
                    placeholder="Full Name"
                    className="bg-zinc-50 dark:bg-white/5 border-dashed border-zinc-200 dark:border-white/10 h-14 rounded-2xl px-6 focus:border-emerald-500/40 transition-all font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    University
                  </label>
                  <Input
                    required
                    value={newRep.university}
                    onChange={(e) =>
                      setNewRep({ ...newRep, university: e.target.value })
                    }
                    placeholder="e.g. UNILAG"
                    className="bg-zinc-50 dark:bg-white/5 border-dashed border-zinc-200 dark:border-white/10 h-14 rounded-2xl px-6 focus:border-emerald-500/40 transition-all font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                    Referral Code
                  </label>
                  <Input
                    required
                    value={newRep.referralCode}
                    onChange={(e) =>
                      setNewRep({ ...newRep, referralCode: e.target.value })
                    }
                    placeholder="e.g. LAG001"
                    className="bg-zinc-50 dark:bg-white/5 border-dashed border-zinc-200 dark:border-white/10 h-14 rounded-2xl px-6 focus:border-emerald-500/40 transition-all font-bold"
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-14 rounded-2xl border-dashed border-zinc-200 dark:border-white/5 font-bold uppercase text-[10px] tracking-widest text-zinc-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-14 rounded-2xl shadow-sm transition-all hover:-translate-y-1"
                  >
                    Create Rep
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
