"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  ArrowRight
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
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
        const q = query(pqRef, where("verified", "==", false), orderBy("createdAt", "desc"));
        
        const querySnapshot = await getDocs(q);
        const fetchedItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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
        verifiedAt: serverTimestamp()
      });
      
      setItems(items.filter(item => item.id !== itemId));
      toast({
        title: "Material Verified",
        description: "The material has been successfully integrated into the scholar lattice.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReject = async (itemId: string) => {
    if (!confirm("Are you sure you want to reject and delete this material?")) return;
    
    try {
      await deleteDoc(doc(db, "pastQuestions", itemId));
      setItems(items.filter(item => item.id !== itemId));
      toast({
        title: "Material Rejected",
        description: "The material has been purged from the global registry.",
        variant: "destructive"
      });
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-purple-500">Security Audit Queue</span>
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Verification Nexus</h1>
          <p className="text-muted-foreground text-sm mt-2">Currently auditing {items.length} incoming academic nodes.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <div className="text-right mr-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Node Status</p>
            <p className="text-xs font-bold text-emerald-500">Optimal Operation</p>
          </div>
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10B981]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-xl border-white/5 rounded-[2rem] p-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-purple-500" /> Average Sync Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">4.2h</div>
            <p className="text-[10px] text-zinc-500 font-bold mt-2 tracking-wider uppercase">Sync efficiency synthesis v2.4</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-white/5 rounded-[2rem] p-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-500" /> Pending Ingestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">{items.length}</div>
            <p className="text-[10px] text-zinc-500 font-bold mt-2 tracking-wider uppercase">Awaiting lattice deployment</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-white/5 rounded-[2rem] p-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white tracking-tight">84.2%</div>
            <p className="text-[10px] text-emerald-500/60 font-bold mt-2 tracking-wider uppercase">Verification accuracy delta</p>
          </CardContent>
        </Card>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="bg-card/50 backdrop-blur-xl border-white/5 hover:border-purple-500/30 transition-all rounded-[2rem] overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center p-8 gap-8">
                  <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-black transition-all shadow-inner text-2xl font-black">
                    PDF
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-2xl tracking-tight leading-none text-white">{item.courseCode}</h3>
                          <Badge variant="outline" className="text-[8px] font-bold border-purple-500/20 text-purple-600 bg-purple-500/5">PENDING SYNC</Badge>
                        </div>
                        <p className="text-lg font-medium text-muted-foreground">{item.courseTitle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Entry Date</p>
                        <p className="text-sm font-bold text-white">{item.createdAt ? format(item.createdAt.toDate(), "MMM dd, yyyy HH:mm") : "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[11px] font-bold text-zinc-300">{item.university}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <Layers className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] font-bold text-zinc-300">{item.department}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[11px] font-bold text-zinc-300">{item.year} • {item.semester} • Level {item.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={() => handleReject(item.id)} variant="ghost" className="h-14 w-14 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                      <XCircle className="h-6 w-6" />
                    </Button>
                    <Button onClick={() => handleApprove(item.id)} className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Verify Node
                    </Button>
                    <Button variant="outline" className="h-14 h-14 w-14 rounded-2xl border border-white/10 text-zinc-400 hover:bg-white/10 group-hover:border-purple-500/30">
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-32 text-center bg-card/20 rounded-[3rem] border-2 border-dashed border-white/5">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-zinc-400">All Nodes Verified</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-sm mx-auto">The verification lattice is currently empty. All data nodes have been successfully deployed to the global scholar registry.</p>
          <Button variant="outline" className="mt-8 border-white/10 rounded-xl px-10 h-12 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5" onClick={() => window.location.reload()}>
            Refresh Sync
          </Button>
        </div>
      )}

      {loading && (
        <div className="p-40 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mt-6">Connecting to global audit registry...</p>
        </div>
      )}
    </div>
  );
}

function Loader2(props: any) {
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
