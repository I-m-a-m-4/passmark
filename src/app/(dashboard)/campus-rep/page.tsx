"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Sparkles,
  Zap,
  Target,
  DollarSign,
  Wallet,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CampusRepDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
    });

    return () => unsubscribe();
  }, []);

  const referralLink = `https://passmark.vercel.app/signup?ref=${userData?.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "Your high-yield referral link is ready to share.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayoutRequest = () => {
      if ((userData?.referralEarnings || 0) < 5000) {
          toast({
              variant: "destructive",
              title: "Threshold Not Reached",
              description: "Campus Reps require a minimum of ₦5,000 to request a payout.",
          });
          return;
      }
      toast({
          title: "Payout Protocol Initialized",
          description: "Our financial nodes have been notified. Expect a response within 24hrs.",
      });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000 pb-20 md:pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
            <div className="p-5 rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-600/30 text-white border border-indigo-400">
                <Users className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-4xl font-bold font-headline tracking-tighter">Campus Rep Hub</h1>
                <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    Operational Sales Node: Active
                </p>
            </div>
        </div>
        <div className="bg-card/50 dark:bg-zinc-950/50 border border-border dark:border-white/10 px-8 py-4 rounded-[2rem] backdrop-blur-2xl flex items-center gap-6 shadow-xl">
            <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Rank</p>
                <p className="text-lg font-black text-foreground uppercase tracking-tight">Elite Tier</p>
            </div>
            <div className="h-12 w-1 border-r border-border dark:border-white/5 mx-2"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Sparkles className="w-6 h-6 fill-current" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Earnings", val: `₦${(userData?.referralEarnings || 0).toLocaleString()}`, icon: Wallet, color: "emerald", desc: "Available for payout" },
          { label: "Material Sales", val: (userData?.totalRepSales || 0).toLocaleString(), icon: Target, color: "indigo", desc: "Student unlocks" },
          { label: "Network Size", val: (userData?.referralCount || 0).toLocaleString(), icon: Users, color: "rose", desc: "Referred students" },
          { label: "Conversion Rate", val: "24%", icon: TrendingUp, color: "amber", desc: "Sales Efficiency" },
        ].map((item, i) => (
          <Card key={i} className="bg-card dark:bg-zinc-950 border border-border dark:border-white/5 relative overflow-hidden group rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all">
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
                  <h3 className="text-4xl font-black font-headline tracking-tighter text-foreground">
                    {item.val}
                  </h3>
                  {i === 0 && (
                      <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-bold mb-2">
                        <ArrowUpRight className="w-2.5 h-2.5" />
                        <span>RECEIVABLE</span>
                      </div>
                  )}
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase mt-4 tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 opacity-30" />
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <Card className="bg-card dark:bg-zinc-950 border border-border dark:border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-indigo-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="p-0 mb-10">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                    <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                    <CardTitle className="text-2xl font-black font-headline tracking-tight">Viral Invite Protocol</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/60 mt-1">20% High-Yield Sales Node Active</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-10 relative z-10">
            <div className="bg-muted dark:bg-white/5 border border-dashed border-border dark:border-white/10 p-8 rounded-[2rem] flex items-center justify-between group/link hover:border-indigo-500/50 transition-all cursor-pointer" onClick={copyToClipboard}>
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Your Personal High-Yield Link</p>
                <p className="text-sm font-bold text-foreground truncate w-[250px] md:w-auto tracking-tight">{referralLink}</p>
              </div>
              <Button size="icon" variant="ghost" className="h-14 w-14 rounded-2xl bg-card dark:bg-white/5 border border-border dark:border-white/10 group-hover/link:bg-indigo-500 group-hover/link:text-white transition-all shadow-xl">
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Signup Bonus</p>
                    <p className="text-2xl font-black text-foreground">₦50</p>
                    <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest mt-1">Per User Join</p>
                </div>
                <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                    <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Sales Commission</p>
                    <p className="text-2xl font-black text-foreground">₦400</p>
                    <p className="text-[8px] font-bold text-indigo-500/60 uppercase tracking-widest mt-1">Per ₦2,000 Sale</p>
                </div>
            </div>

            <Button className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-600/20 group/btn" onClick={copyToClipboard}>
                COPY COMMAND LINK
                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card dark:bg-zinc-950 border border-border dark:border-white/5 rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32"></div>
            <div>
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-emerald-500 rounded-2xl text-black shadow-xl shadow-emerald-500/20">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black font-headline tracking-tight">Withdrawal Hub</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/60 mt-1">Commission Liquidity Node</p>
                    </div>
                </div>

                <div className="space-y-6 mb-10">
                    <div className="flex items-center justify-between pb-4 border-b border-dashed border-border dark:border-white/5">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Receivable Balance</span>
                        <span className="text-xl font-black text-foreground">₦{(userData?.referralEarnings || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-dashed border-border dark:border-white/5">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Protocol Threshold</span>
                        <span className="text-sm font-black text-zinc-400">₦5,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Transfer Status</span>
                        <Badge variant="outline" className="bg-muted dark:bg-white/5 text-zinc-500 border-border dark:border-white/10 px-4 py-1 text-[9px] font-black tracking-widest uppercase">No Active Protocol</Badge>
                    </div>
                </div>
            </div>

            <Button 
                className="w-full h-20 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest group/pay relative overflow-hidden"
                disabled={(userData?.referralEarnings || 0) < 5000}
                onClick={handlePayoutRequest}
            >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/20 blur-xl translate-y-full group-hover/pay:translate-y-0 transition-transform duration-700 opacity-0 group-hover/pay:opacity-100"></div>
                <div className="relative z-10 flex items-center justify-center gap-4">
                    INITIALIZE PAYOUT DISPATCH
                    <ArrowUpRight className="w-5 h-5 group-hover/pay:-translate-y-1 group-hover/pay:translate-x-1 transition-transform" />
                </div>
            </Button>
            
            <p className="text-[9px] text-center mt-6 font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-center gap-3">
                <Target className="w-3.5 h-3.5 text-zinc-700" />
                Verify institution metadata before dispatch
            </p>
        </Card>
      </div>

      <Card className="bg-card dark:bg-zinc-950 border border-border dark:border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-dashed border-border dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold font-headline tracking-tight text-foreground flex items-center gap-4">
                Recent Commission Ledger
                <Badge variant="outline" className="bg-indigo-500/5 text-indigo-500 border-indigo-500/20 px-4 py-1 text-[10px] font-black tracking-widest uppercase">
                  Sales Tracking
                </Badge>
              </CardTitle>
              <CardDescription className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
                Immutable binary log of high-yield referral rewards and student unlocks
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-20 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-[2.5rem] bg-muted dark:bg-white/5 flex items-center justify-center text-zinc-800">
                <Info className="w-10 h-10" />
            </div>
            <div>
                <p className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Detailed Transaction Node Pending</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 tracking-[0.3em]">Individual logs will populate here upon sales node activation</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
