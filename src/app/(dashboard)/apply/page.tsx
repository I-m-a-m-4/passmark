"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Wallet,
  Globe,
  Loader2
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { AuraBackground } from "@/components/aura-background";
import { useToast } from "@/hooks/use-toast";

export default function ApplyPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

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

  const handleActivateRole = async (role: string) => {
    if (!userData) return;
    setActivating(role);
    try {
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, {
        roles: arrayUnion(role)
      });
      
      toast({
        title: "Role Activated",
        description: `Welcome to the ${role === "tutor" ? "Tutor" : "Campus Rep"} network!`,
      });

      // Update local state
      setUserData((prev: any) => ({
          ...prev,
          roles: [...(prev.roles || []), role]
      }));

      // Redirect to the new hub
      router.push(role === "tutor" ? "/tutors" : "/campus-rep");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Activation Failed",
        description: err.message,
      });
    } finally {
      setActivating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  const userRoles = userData?.roles || [userData?.role || "student"];

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuraBackground />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
            <Briefcase className="w-4 h-4" /> Opportunities Center
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight leading-none">
            Earn & <span className="text-emerald-500 italic">Impact</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest max-w-xl mx-auto">
            Scale your academic journey. Transform from a scholar into a mentor or a community builder.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tutor Card */}
          <AuraCard className={`p-8 group relative overflow-hidden shadow-2xl transition-all ${userRoles.includes("tutor") ? "border-emerald-500/40 bg-emerald-500/[0.03]" : ""}`}>
            {userRoles.includes("tutor") && (
                <div className="absolute top-4 right-4 animate-in zoom-in">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
            )}
            
            <div className="space-y-6 relative z-10">
                <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8 text-emerald-500" />
                </div>
                
                <div>
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Become a Tutor</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Share your mastery of difficult courses. Help other students solve past questions and earn high-yield payouts for your expertise.
                    </p>
                </div>

                <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Wallet className="w-4 h-4 text-emerald-500" /> Professional Earnings
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <TrendingUp className="w-4 h-4 text-emerald-500" /> Influence Meter
                    </div>
                </div>

                <button
                    disabled={userRoles.includes("tutor") || activating === "tutor"}
                    onClick={() => handleActivateRole("tutor")}
                    className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
                        userRoles.includes("tutor")
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                        : "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95"
                    }`}
                >
                    {activating === "tutor" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : userRoles.includes("tutor") ? (
                        "Tutor Hub Active"
                    ) : (
                        <>Activate Hub <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
          </AuraCard>

          {/* Campus Rep Card */}
          <AuraCard className={`p-8 group relative overflow-hidden shadow-2xl transition-all ${userRoles.includes("campus_rep") ? "border-emerald-500/40 bg-emerald-500/[0.03]" : ""}`}>
            {userRoles.includes("campus_rep") && (
                <div className="absolute top-4 right-4 animate-in zoom-in">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
            )}
            
            <div className="space-y-6 relative z-10">
                <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-emerald-500" />
                </div>
                
                <div>
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Campus Rep</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Lead the growth of PassMark on your campus. Earn a permanent 20% commission (₦400) for every student you successfully onboard.
                    </p>
                </div>

                <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Globe className="w-4 h-4 text-emerald-500" /> Network Expansion
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Wallet className="w-4 h-4 text-emerald-500" /> Direct 20% Shares
                    </div>
                </div>

                <button
                    disabled={userRoles.includes("campus_rep") || activating === "campus_rep"}
                    onClick={() => handleActivateRole("campus_rep")}
                    className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
                        userRoles.includes("campus_rep")
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                        : "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95"
                    }`}
                >
                    {activating === "campus_rep" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : userRoles.includes("campus_rep") ? (
                        "Rep Hub Active"
                    ) : (
                        <>Activate Hub <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
          </AuraCard>
        </div>

        {/* Footer Meta */}
        <div className="text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                Verified Career Hub Protocol v2.4 • passmark professional network
            </p>
        </div>
      </div>
    </div>
  );
}
