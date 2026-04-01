"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  MapPin, 
  Award,
  Link as LinkIcon,
  Copy,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { AuraBackground } from "@/components/aura-background";
import { useToast } from "@/hooks/use-toast";

export default function CampusRepHub() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const copyReferralLink = () => {
    const link = `https://passmark.vercel.app/signup?ref=${userData?.referralCode || ""}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Discovery Link Copied",
      description: "Send this to students on your campus to earn commissions.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuraBackground />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/40 backdrop-blur-3xl p-8 rounded-2xl border border-border shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
            
            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-[10px] uppercase tracking-widest">
                    <Award className="w-4 h-4" /> Growth Representative
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                   Representative <span className="text-amber-500 italic">Hub</span>
                </h1>
                <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">
                   Active on: <span className="text-foreground">{userData?.university || "Verified University Registry"}</span>
                </p>
            </div>

            <div className="flex items-center gap-4">
                 <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Referral Code</p>
                    <p className="text-xl font-black text-amber-500 tracking-widest select-all">{userData?.referralCode || "N/A"}</p>
                 </div>
            </div>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AuraCard className="p-8 border-amber-500/20 group hover:scale-[1.02] transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Earnings</p>
                <h2 className="text-2xl font-black text-foreground mt-1">₦{userData?.referralEarnings || 0}</h2>
                <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold mt-2 uppercase">
                    Available for Withdrawal <ChevronRight className="w-3 h-3" />
                </div>
            </AuraCard>

            <AuraCard className="p-8 group hover:scale-[1.02] transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Successful Referrals</p>
                <h2 className="text-2xl font-black text-foreground mt-1">{userData?.referralCount || 0} Scholars</h2>
                <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mt-2">Verified Registrations Only</p>
            </AuraCard>

            <AuraCard className="p-8 group hover:scale-[1.02] transition-all bg-amber-500/[0.02]">
                <div className="flex items-center justify-between mb-6">
                    <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-500">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Conversion Rate</p>
                <h2 className="text-2xl font-black text-foreground mt-1">0%</h2>
                <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mt-2">Active Link Impressions</p>
            </AuraCard>
        </div>

        {/* Referral Asset */}
        <AuraCard className="p-12 overflow-hidden relative group">
             <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                 <div className="space-y-6">
                     <h2 className="text-2xl font-black text-foreground tracking-tight leading-none uppercase">
                         Your Growth <span className="text-amber-500 italic">Node</span>
                     </h2>
                     <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                         Share your unique discovery link with scholars on your campus. Every verified registration using your code earns you a permanent 20% commission (₦400).
                     </p>
                     
                     <div className="space-y-3 pt-6">
                         <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Professional 20% Share
                         </div>
                         <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Recognition
                         </div>
                     </div>
                 </div>

                 <div className="bg-muted/40 p-10 rounded-[3rem] border border-border relative group/link text-center">
                    <div className="bg-amber-500/10 text-amber-500 p-4 rounded-3xl w-14 h-14 flex items-center justify-center mx-auto mb-6 group-hover/link:scale-110 transition-transform overflow-hidden">
                        <LinkIcon className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] items-center justify-center mx-auto mb-6 group-hover/link:scale-110 transition-transform overflow-hidden bg-amber-500/20 text-amber-500 px-3 py-1 font-black rounded-full w-fit">
                        Public Discovery Link
                    </p>
                    <p className="text-xs font-bold text-muted-foreground truncate mb-8 opacity-60">
                        https://passmark.vercel.app/signup?ref={userData?.referralCode || "XXXXX"}
                    </p>
                    <button 
                        onClick={copyReferralLink}
                        className="w-full h-16 rounded-2xl bg-amber-500 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Copy className="w-5 h-5" /> Copy Link & Broadcast
                    </button>
                 </div>
             </div>
        </AuraCard>
      </div>
    </div>
  );
}
