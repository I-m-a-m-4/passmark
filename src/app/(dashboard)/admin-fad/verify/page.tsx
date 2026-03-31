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
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface VerificationItem {
  id: string;
  university: string;
  department: string;
  courseCode: string;
  courseTitle: string;
  level: string;
  semester: string;
  year: string;
  fileName: string;
  verified: boolean;
  createdAt?: any;
  uploadedBy?: string;
}

export default function VerificationQueuePage() {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPendingItems() {
      setLoading(true);
      try {
        const pqRef = collection(db, "pastQuestions");
        const q = query(
          pqRef,
          where("verified", "==", false),
          orderBy("createdAt", "desc"),
        );

        const querySnapshot = await getDocs(q);
        const fetchedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as VerificationItem[];

        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching verification items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPendingItems();
  }, []);

  const handleApprove = async (itemId: string) => {
    try {
      const itemRef = doc(db, "pastQuestions", itemId);
      await updateDoc(itemRef, {
        verified: true,
        verifiedAt: serverTimestamp(),
      });

      setItems(items.filter((item) => item.id !== itemId));
      toast({
        title: "Material Approved",
        description: "The material has been added to the library.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      await deleteDoc(doc(db, "pastQuestions", itemId));
      setItems(items.filter((item) => item.id !== itemId));
      toast({
        title: "Material Deleted",
        description: "The material has been removed from the queue.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-dashed border-purple-500/20 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">
              Approvals Queue
            </span>
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            Verification Queue
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Review and approve {items.length} new study materials.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-dashed border-zinc-200 dark:border-white/5">
          <div className="text-right mr-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              System Status
            </p>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
              Active
            </p>
          </div>
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-2xl p-4 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-purple-500" /> Avg Sync Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
              4.2h
            </div>
            <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase">
              Updates every hour
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-2xl p-4 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-500" /> Pending Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {items.length}
            </div>
            <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase">
              Waiting for review
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-2xl p-4 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Approval
              Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
              84%
            </div>
            <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase">
              Monthly average
            </p>
          </CardContent>
        </Card>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4 font-medium">
          {items.map((item) => (
            <Card
              key={item.id}
              className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 hover:border-purple-500/30 transition-all rounded-[2rem] overflow-hidden group shadow-sm"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center p-8 gap-8">
                  <div className="h-20 w-20 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-dashed border-zinc-200 dark:border-white/10 flex items-center justify-center text-purple-600 dark:text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner text-xl font-black">
                    PDF
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-2xl tracking-tight leading-none text-zinc-900 dark:text-white">
                            {item.courseCode}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-[8px] font-bold border-dashed border-purple-500/30 text-purple-600 bg-purple-500/5"
                          >
                            PENDING
                          </Badge>
                        </div>
                        <p className="text-lg font-bold text-muted-foreground">
                          {item.courseTitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          Added
                        </p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">
                          {item.createdAt
                            ? format(item.createdAt.toDate(), "MMM dd, yyyy")
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-dashed border-zinc-100 dark:border-white/5">
                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                          {item.university}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-dashed border-zinc-100 dark:border-white/5">
                        <Layers className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                          {item.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-dashed border-zinc-100 dark:border-white/5">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                          {item.year} • {item.semester} • Lv {item.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleReject(item.id)}
                      variant="ghost"
                      className="h-14 w-14 rounded-2xl border border-dashed border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <XCircle className="h-6 w-6" />
                    </Button>
                    <Button
                      onClick={() => handleApprove(item.id)}
                      className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-sm transition-all hover:-translate-y-1"
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Approve File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-32 text-center bg-zinc-50/50 dark:bg-card/20 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-white/5">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-400">
            Queue is Empty
          </h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-sm mx-auto">
            All study materials have been reviewed and approved. Great work!
          </p>
          <Button
            variant="outline"
            className="mt-8 border-dashed border-zinc-300 dark:border-white/10 rounded-xl px-10 h-12 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 text-zinc-900 dark:text-white"
            onClick={() => window.location.reload()}
          >
            Refresh Sync
          </Button>
        </div>
      )}

      {loading && (
        <div className="p-40 text-center">
          <span className="loader block h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mr-3"></span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-6">
            Loading queue...
          </p>
        </div>
      )}
    </div>
  );
}
