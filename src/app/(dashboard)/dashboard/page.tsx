"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Clock,
  FileText,
  ArrowRight,
  Bookmark,
  Sparkles,
  School,
  BookOpen,
  Filter,
  CheckCircle2,
  Brain,
  GraduationCap,
  Share2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  limit,
  getDocs,
  where,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuraCard, AuraButton } from "@/components/aura-ui";
import { useToast } from "@/hooks/use-toast";
import { DEPARTMENTS, LEVELS, SEMESTERS } from "@/constants/study-data";

import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

export default function StudentDashboard() {
  const [recentQuestions, setRecentQuestions] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("100");
  const [selectedSemester, setSelectedSemester] = useState("Harmattan");
  const [unlockedParts, setUnlockedParts] = useState<string[]>([]);
  const { toast } = useToast();

  const fwConfig = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
    tx_ref: Date.now().toString(),
    amount: 2000,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: auth.currentUser?.email || "",
      phone_number: "",
      name: userData?.fullName || "Scholar",
    },
    customizations: {
      title: "PassMark Material Unlock",
      description: `Payment for ${selectedLevel}L ${selectedDept} Materials`,
      logo: "https://passmark.vercel.app/passmark.jpeg",
    },
  };

  const handleFlutterPayment = useFlutterwave(fwConfig);

  const handleUnlock = () => {
    handleFlutterPayment({
      callback: (response) => {
        if (response.status === "successful") {
            const partKey = `${userData?.university}_${selectedDept}_${selectedLevel}`;
            updateDoc(doc(db, "users", auth.currentUser!.uid), {
                unlockedParts: [...unlockedParts, partKey],
            });
            setUnlockedParts([...unlockedParts, partKey]);
            toast({
                title: "Access Granted!",
                description: `${selectedLevel}L Materials have been added to your library.`,
            });
        }
        closePaymentModal();
      },
      onClose: () => {},
    });
  };

  const handleUnlockWithCredits = async () => {
    if (!userData || userData.referralEarnings < 2000) {
      toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: "Invite more friends to earn ₦2,000 and unlock for free!",
      });
      return;
    }

    try {
      const partKey = `${userData?.university}_${selectedDept}_${selectedLevel}`;
      await updateDoc(doc(db, "users", auth.currentUser!.uid), {
        referralEarnings: increment(-2000),
        unlockedParts: [...unlockedParts, partKey],
      });
      
      setUnlockedParts([...unlockedParts, partKey]);
      setUserData({ ...userData, referralEarnings: userData.referralEarnings - 2000 });
      
      toast({
        title: "Credit Redemption Successful!",
        description: `₦2,000 deduced. ${selectedLevel}L materials are now available.`,
      });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Redemption Failed", description: e.message });
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!auth.currentUser) return;

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      let q;
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);

        // Only set selectedDept if not already set or first fetch
        if (!selectedDept && data.department) {
          setSelectedDept(data.department);
        }
        setUnlockedParts(data.unlockedParts || []);

        q = query(
          collection(db, "pastQuestions"),
          where("verified", "==", true),
          where(
            "university",
            "==",
            data.university || "University of Lagos (UNILAG)",
          ),
          where("department", "==", selectedDept || data.department || ""),
          where("level", "==", selectedLevel),
          where("semester", "==", selectedSemester),
          limit(20),
        );
      } else {
        q = query(
          collection(db, "pastQuestions"),
          where("verified", "==", true),
          limit(20),
        );
      }

      const querySnapshot = await getDocs(q);
      const questions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentQuestions(questions);
    }
    fetchData();
  }, [selectedLevel, selectedSemester, selectedDept]);

  const handleDeptChange = async (dept: string) => {
    setSelectedDept(dept);
    if (auth.currentUser) {
      updateDoc(doc(db, "users", auth.currentUser.uid), { department: dept });
    }
  };

  const filteredQuestions = recentQuestions.filter(
    (q) =>
      q.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.type || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header with Search */}
      <section className="bg-emerald-600 dark:bg-emerald-900/40 p-8 md:p-12 rounded-[2rem] text-white shadow-2xl overflow-hidden relative border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
              <Sparkles className="w-3 h-3 text-emerald-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                Welcome Back, Scholar
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-8 leading-tight">
            Find your next <br />
            <span className="text-emerald-200">Study Material.</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group focus-within:scale-[1.01] transition-all duration-300">
              <Search className="absolute left-4 top-4 h-5 w-5 text-emerald-800/50 dark:text-emerald-200/50 group-focus-within:text-emerald-400 group-focus-within:scale-110 transition-all" />
              <Input
                placeholder="Search Course Code or Title..."
                className="pl-12 h-14 bg-white/95 dark:bg-zinc-900/90 text-zinc-900 dark:text-white border-none shadow-xl focus:ring-4 focus:ring-white/10 rounded-2xl transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-72">
              <Select value={selectedDept} onValueChange={handleDeptChange}>
                <SelectTrigger className="h-14 bg-white/95 dark:bg-zinc-900/90 text-zinc-900 dark:text-white border-none shadow-xl rounded-2xl px-6">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-72">
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full -mr-40 -mt-40 blur-[120px] animate-pulse"></div>
        <Brain className="absolute bottom-[-20px] right-10 w-64 h-64 text-white/5 -rotate-12" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Level & Semester Selectors */}
          <AuraCard className="p-6">
            <div className="flex flex-wrap gap-6 items-end justify-between">
              <div className="space-y-4 flex-1 min-w-[200px]">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-1">
                  Current Part / Level
                </Label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={cn(
                        "h-10 rounded-lg text-xs font-bold transition-all border",
                        selectedLevel === lvl
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                          : "bg-black/5 dark:bg-white/5 text-gray-500 border-white/5 hover:border-emerald-500/30",
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 w-full md:w-auto">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 ml-1">
                  Semester Session
                </Label>
                <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-white/5">
                  {SEMESTERS.map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSelectedSemester(sem)}
                      className={cn(
                        "px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                        selectedSemester === sem
                          ? "bg-emerald-500 text-white shadow-xl"
                          : "text-gray-500 hover:text-white",
                      )}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AuraCard>

          {/* Access Banner */}
          {!unlockedParts.includes(
            `${userData?.university}_${selectedDept}_${selectedLevel}`,
          ) && (
            <AuraCard className="bg-emerald-500/10 border-emerald-500/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  ₦
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-1">
                    Unlock {selectedLevel} Level Materials
                  </h3>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium opacity-80">
                    Gain full access via card payment or referral credit.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <AuraButton
                  className="bg-emerald-500 text-black shadow-2xl"
                  onClick={handleUnlock}
                >
                  Unlock for ₦2,000
                </AuraButton>
                {userData?.referralEarnings >= 2000 && (
                  <AuraButton
                    className="bg-white/5 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black shadow-2xl shadow-emerald-500/20"
                    onClick={handleUnlockWithCredits}
                  >
                    Pay with Rewards
                  </AuraButton>
                )}
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
            </AuraCard>
          )}

          {/* Past Questions Feed */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between px-2 gap-4">
              <h2 className="text-2xl font-bold font-headline flex items-center gap-3 text-zinc-900 dark:text-white">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-emerald-500" />
                </div>
                Past Questions for {selectedDept || "All Departments"}
              </h2>
              <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-dashed border-zinc-200 dark:border-white/10">
                {["All", "Test", "Exam"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      if (t === "All") {
                        setSearchTerm("");
                      } else {
                        setSearchTerm(t);
                      }
                    }}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all tracking-widest",
                      (t === "All" && searchTerm === "") || searchTerm === t
                        ? "bg-zinc-900 text-white dark:bg-emerald-500 dark:text-black shadow-lg"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-white",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q) => {
                  const isUnlocked =
                    unlockedParts.includes(
                      `${userData?.university}_${selectedDept}_${selectedLevel}`,
                    ) || userData?.role === "admin";
                  const isBookmarked = (
                    userData?.bookmarkedMaterials || []
                  ).includes(q.id);

                  return (
                    <AuraCard key={q.id} className="group hover:scale-[1.005]">
                      <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner relative">
                          <FileText className="h-8 w-8" />
                          <div className="absolute -top-1 -right-1 bg-zinc-900 border border-white/10 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-emerald-500">
                            {q.type || "PDF"}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-bold text-xl text-zinc-950 dark:text-white group-hover:text-emerald-500 transition-colors uppercase">
                                {q.courseCode}
                              </h4>
                              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded">
                                {q.year}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-8 w-8 rounded-full",
                                  isBookmarked
                                    ? "text-emerald-500 bg-emerald-500/10"
                                    : "text-zinc-400",
                                )}
                                onClick={async () => {
                                  if (!auth.currentUser) return;
                                  const userRef = doc(
                                    db,
                                    "users",
                                    auth.currentUser.uid,
                                  );
                                  const newBookmarks = isBookmarked
                                    ? userData.bookmarkedMaterials.filter(
                                        (id: string) => id !== q.id,
                                      )
                                    : [
                                        ...(userData?.bookmarkedMaterials ||
                                          []),
                                        q.id,
                                      ];

                                  await updateDoc(userRef, {
                                    bookmarkedMaterials: newBookmarks,
                                  });
                                  setUserData({
                                    ...userData,
                                    bookmarkedMaterials: newBookmarks,
                                  });
                                  toast({
                                    title: isBookmarked
                                      ? "Removed from Saved"
                                      : "Added to Saved",
                                    description:
                                      q.courseCode + " has been updated.",
                                  });
                                }}
                              >
                                <Bookmark
                                  className={cn(
                                    "h-4 w-4",
                                    isBookmarked && "fill-current",
                                  )}
                                />
                              </Button>
                              {!isUnlocked && (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold uppercase tracking-widest">
                                  <Lock className="w-3 h-3" /> Locked
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-base text-muted-foreground font-medium mb-3">
                            {q.courseTitle}
                          </p>
                        </div>
                        <AuraButton
                          disabled={!isUnlocked}
                          onClick={() =>
                            q.fileUrl && window.open(q.fileUrl, "_blank")
                          }
                          className={cn(
                            "md:w-auto w-full transition-all",
                            !isUnlocked
                              ? "opacity-30 grayscale cursor-not-allowed"
                              : "md:opacity-0 md:group-hover:opacity-100 transform md:translate-x-4 md:group-hover:translate-x-0",
                          )}
                        >
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </AuraButton>
                      </div>
                    </AuraCard>
                  );
                })
              ) : (
                <div className="text-center py-24 bg-black/5 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                  <BookOpen className="w-12 h-12 text-zinc-400 dark:text-gray-500/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-zinc-600 dark:text-gray-400">
                    No courses uploaded yet
                  </h3>
                  <p className="text-zinc-500 dark:text-gray-600 text-sm italic">
                    Admin is currently indexing the curriculum for this session.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-8">
          <AuraCard className="overflow-hidden shadow-lg border-emerald-500/10">
            <div className="p-6 border-b border-black/5 dark:border-white/5 bg-emerald-500/[0.02]">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-emerald-500">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <School className="w-4 h-4 text-emerald-500" />
                </div>
                My Institution
              </h3>
            </div>
            <div className="p-8 text-center bg-white/10 dark:bg-transparent">
              <div className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                {userData?.university || "UNILAG"}
              </div>
              <div className="text-sm font-medium text-emerald-500 mb-4">
                {userData?.department || "General"}
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-gray-500 font-bold uppercase tracking-widest mb-6">
                Status: Verified Enrollment
              </div>
              <button
                disabled
                className="w-full h-12 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest bg-white/[0.02] text-gray-500 cursor-not-allowed opacity-50"
              >
                Sync with Campus Rep
              </button>
            </div>
          </AuraCard>

          <AuraCard className="bg-[#030303] group">
            <div className="p-8 text-center space-y-4 relative z-10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-black font-bold text-2xl mb-2 group-hover:rotate-12 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                ₦
              </div>
              <div className="flex flex-col items-center gap-1">
                <h3 className="font-bold text-white text-lg">
                  Scholar Rewards
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-emerald-300 font-bold uppercase tracking-widest">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                  Community Growth Rewards
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
                    Invited Friends
                  </div>
                  <div className="text-xl font-bold text-white">
                    {userData?.referralCount || "0"}
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
                    Total Earnings
                  </div>
                  <div className="text-xl font-bold text-emerald-400">
                    ₦{userData?.referralEarnings || "0"}
                  </div>
                </div>
              </div>

              <div className="w-full space-y-2 pt-2">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest text-left ml-1">
                  Your Invite Code
                </div>
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/signup?ref=${userData?.referralCode}`;
                    navigator.clipboard.writeText(link);
                    alert("Invite link copied to clipboard!");
                  }}
                  className="w-full bg-emerald-500/10 p-4 rounded-2xl text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center justify-between group/btn overflow-hidden"
                >
                  <span className="truncate mr-2">
                    {userData?.referralCode || "FETCHING..."}
                  </span>
                  <Share2 className="w-4 h-4 shrink-0 group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium pt-2">
                Earn ₦50 for every verified student you invite.
              </p>
            </div>
          </AuraCard>
        </div>
      </div>
    </div>
  );
}
