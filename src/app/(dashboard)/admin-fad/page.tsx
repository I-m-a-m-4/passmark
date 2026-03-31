"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  FileCheck,
  Search,
  Filter,
  Trash2,
  Download,
  Upload,
  Database,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Cpu,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "pastQuestions"),
        orderBy("createdAt", "desc"),
        limit(100),
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(items);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Could not fetch library data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete ${code}?`)) return;

    try {
      await deleteDoc(doc(db, "pastQuestions", id));
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast({
        title: "Material Purged",
        description: `${code} has been removed from the database.`,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Purge Failed",
        description: "Delete operation could not be completed.",
      });
    }
  };

  const filteredMaterials = materials.filter(
    (m) =>
      (m.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.university?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "All" || m.type === filterType),
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
              Inventory Control
            </span>
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            Material Inventory
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Managing {materials.length} production-ready study materials.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchMaterials}
            className="border-dashed border-zinc-200 dark:border-white/10 h-12 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest"
          >
            <Database className="mr-2 h-4 w-4 text-emerald-500" />
            Refresh Nodes
          </Button>
          <Button
            asChild
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-12 px-8 rounded-2xl shadow-sm"
          >
            <Link href="/admin-fad/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload New
            </Link>
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500/50 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Search by Code, Title, or Institution..."
              className="pl-12 h-12 bg-white/5 border-white/5 rounded-xl focus:ring-emerald-500/20 text-zinc-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-white/5 shrink-0">
            {["All", "Test", "Exam", "CBT"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  "px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all tracking-widest",
                  filterType === t
                    ? "bg-zinc-900 text-white dark:bg-emerald-500 dark:text-black shadow-lg"
                    : "text-zinc-500 hover:text-white",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Material Table/List */}
      <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 overflow-hidden rounded-[2.5rem] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-dashed border-zinc-100 dark:border-white/5 p-8 bg-white/2">
          <div>
            <CardTitle className="text-xl">System Material Ledger</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-widest text-emerald-500/60 mt-1">
              Found {filteredMaterials.length} Entries
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="h-8 border-emerald-500/20 text-emerald-500 font-bold uppercase tracking-widest px-4"
            >
              Production Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                Syncing with Node Server...
              </p>
            </div>
          ) : filteredMaterials.length > 0 ? (
            <div className="divide-y divide-dashed divide-zinc-100 dark:divide-white/5">
              {filteredMaterials.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-white/2 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 font-bold border border-dashed border-zinc-200 dark:border-white/10 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-inner relative overflow-hidden">
                      <FileCheck className="h-8 w-8" />
                      <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-transparent"></div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-xl text-zinc-950 dark:text-white group-hover:text-emerald-500 transition-colors uppercase truncate">
                          {m.courseCode}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-bold tracking-widest uppercase"
                        >
                          {m.type}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-zinc-500 truncate max-w-md">
                        {m.courseTitle}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 dark:bg-white/5 py-0.5 px-2 rounded-md">
                          {m.university}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 dark:bg-white/5 py-0.5 px-2 rounded-md">
                          {m.year}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 dark:bg-white/5 py-0.5 px-2 rounded-md">
                          Lvl {m.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-6 md:mt-0">
                    <div className="hidden lg:flex flex-col items-end mr-6">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
                        Uploaded
                      </span>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">
                        {m.createdAt?.toDate
                          ? m.createdAt.toDate().toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                        onClick={() => window.open(m.fileUrl, "_blank")}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        onClick={() => handleDelete(m.id, m.courseCode)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
              <div className="h-24 w-24 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                <BookOpen className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  No nodes detected
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 italic font-medium leading-relaxed">
                  The library ledger is currently empty. Upload your first study
                  material to initialize the network.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-14 rounded-2xl px-10 shadow-xl shadow-emerald-500/20"
              >
                <Link href="/admin-fad/upload">Upload First Material</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: "Active Links",
            val: filteredMaterials.length,
            icon: FileCheck,
            color: "text-emerald-500",
          },
          {
            label: "Network Health",
            val: "Optimal",
            icon: Cpu,
            color: "text-blue-500",
          },
          {
            label: "Pending Review",
            val: "0",
            icon: AlertCircle,
            color: "text-purple-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-6 bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-[1.5rem] flex items-center gap-6 group hover:border-emerald-500/20 transition-all"
          >
            <div
              className={cn(
                "p-4 rounded-2xl bg-white/5 shrink-0 group-hover:scale-110 transition-transform",
                stat.color,
              )}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1 uppercase">
                {stat.val}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
