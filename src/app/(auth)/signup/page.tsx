"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Users,
  School,
  Loader2,
  ArrowLeft,
  Book,
  Brain,
  Lightbulb,
  Pencil,
  Atom,
} from "lucide-react";
import { AuraBackground } from "@/components/aura-background";
import { AuraButton, AuraCard } from "@/components/aura-ui";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  increment 
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { NIGERIAN_UNIVERSITIES, DEPARTMENTS } from "@/constants/study-data";

import { Suspense } from "react";

function SignupContent() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [uniSearch, setUniSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [roles, setRoles] = useState<string[]>(["student"]);
  const [loading, setLoading] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showUniDropdown, setShowUniDropdown] = useState(false);

  const toggleRole = (role: string) => {
      setRoles(prev => 
        prev.includes(role) 
          ? prev.filter(r => r !== role) 
          : [...prev, role]
      );
  };

  const filteredDepts = DEPARTMENTS.filter((d) =>
    d.toLowerCase().includes(deptSearch.toLowerCase()),
  );

  const filteredUnis = NIGERIAN_UNIVERSITIES.filter((u) =>
    u.toLowerCase().includes(uniSearch.toLowerCase()),
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const isCompletionMode = searchParams.get("mode") === "complete-profile";

  useEffect(() => {
    if (isCompletionMode) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setFullName(user.displayName || "");
          setEmail(user.email || "");
        } else {
          router.push("/login");
        }
      });
      return () => unsubscribe();
    }
  }, [isCompletionMode, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roles.length === 0) {
        toast({
            variant: "destructive",
            title: "Identity Required",
            description: "Please select at least one role to proceed.",
        });
        return;
    }
    if (!university) {
        toast({
            variant: "destructive",
            title: "Registry Gap",
            description: "Please select your institution from the directory.",
        });
        return;
    }
    setLoading(true);
    try {
      let user = auth.currentUser;
      const refCode = searchParams.get("ref");

      if (!isCompletionMode) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        user = userCredential.user;
        await updateProfile(user, { displayName: fullName });
      }

      if (user) {
        const { isAdminEmail } = await import("@/lib/admin-config");
        const finalRoles = isAdminEmail(email) ? [...roles, "admin"] : roles;
        
        const myReferralCode = Math.random()
              .toString(36)
              .substring(2, 8)
              .toUpperCase();

        await setDoc(
          doc(db, "users", user.uid),
          {
            id: user.uid,
            fullName,
            email,
            roles: finalRoles,
            role: finalRoles[0], // Legacy support
            university,
            department,
            subscriptionStatus: "free",
            createdAt: new Date(),
            referralCode: myReferralCode,
            referralEarnings: 0,
            referralCount: 0,
            unlockedParts: [],
            referredBy: refCode ? refCode.toUpperCase() : null, // Tracking the referrer's code
          },
          { merge: true },
        );

        // Handle Referral Reward Logic
        if (refCode && !isCompletionMode) {
          const referrersRef = collection(db, "users");
          const q = query(referrersRef, where("referralCode", "==", refCode.toUpperCase()));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            // Update referrer's statistics
            await updateDoc(doc(db, "users", referrerDoc.id), {
              referralEarnings: increment(50), // Standard signup bonus
              referralCount: increment(1),
            });
            console.log("Referral mapped for:", referrerDoc.id);
          }
        }

        toast({
          title: isCompletionMode ? "Profile Updated" : "Account Created",
          description: "Welcome to your new study home.",
        });

        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 selection:bg-emerald-500/30 selection:text-emerald-400">
      <AuraBackground />

      <div className="w-full max-w-lg relative z-10 mt-10 mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-all mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Back to Home
          </span>
        </Link>

        <AuraCard className="relative overflow-hidden">
          <div className="p-8 space-y-2 text-center border-b border-border bg-emerald-500/[0.02]">
            <h1 className="text-3xl font-bold tracking-tight leading-none text-foreground">
              {isCompletionMode ? "Complete Your Profile" : "Join PassMark"}
            </h1>
            <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
              {isCompletionMode
                ? "Tell us a bit more about you"
                : "Connect with your university study community"}
            </p>
          </div>

          <div className="p-8 space-y-6 pt-8">
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500/40" />
                    <Input
                      id="fullName"
                      placeholder="e.g. John Doe"
                      className="pl-10 bg-muted/50 border-border h-11 rounded-xl focus:ring-emerald-500/20 text-foreground placeholder:text-muted-foreground/50 transition-all"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      className="pl-10 bg-muted/50 border-border h-11 rounded-xl focus:ring-emerald-500/20 text-foreground placeholder:text-muted-foreground/50 transition-all"
                      required
                      disabled={isCompletionMode}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label
                  htmlFor="university"
                  className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                >
                  Your University
                </Label>
                <div className="relative">
                    <School className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500/40" />
                    <Input
                        placeholder="Search University..."
                        value={uniSearch}
                        onChange={(e) => {
                            setUniSearch(e.target.value);
                            setShowUniDropdown(true);
                        }}
                        onFocus={() => setShowUniDropdown(true)}
                        className="pl-10 bg-muted/50 border-border h-11 rounded-xl focus:ring-emerald-500/20 text-foreground placeholder:text-muted-foreground/50 transition-all"
                    />
                    {showUniDropdown && (uniSearch || filteredUnis.length > 0) && (
                        <div className="absolute z-[60] left-0 right-0 mt-2 bg-card border border-border rounded-2xl max-h-60 overflow-y-auto shadow-2xl backdrop-blur-3xl animate-in slide-in-from-top-2">
                            {filteredUnis.map((uni) => (
                                <div
                                    key={uni}
                                    className="px-6 py-4 hover:bg-emerald-500 hover:text-white cursor-pointer text-sm font-bold text-muted-foreground transition-all flex items-center justify-between group"
                                    onClick={() => {
                                        setUniversity(uni);
                                        setUniSearch(uni);
                                        setShowUniDropdown(false);
                                    }}
                                >
                                    {uni}
                                    {university === uni && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                                </div>
                            ))}
                            {filteredUnis.length === 0 && (
                                <div className="px-6 py-8 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-50">
                                    Institution not found in registry
                                </div>
                            )}
                        </div>
                    )}
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label
                  htmlFor="department"
                  className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                >
                  Department
                </Label>
                <div className="relative">
                  <Book className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500/40" />
                  <Input
                    placeholder="Search Department..."
                    value={deptSearch}
                    onChange={(e) => {
                      setDeptSearch(e.target.value);
                      setShowDeptDropdown(true);
                    }}
                    onFocus={() => setShowDeptDropdown(true)}
                    className="pl-10 bg-muted/50 border-border h-11 rounded-xl focus:ring-emerald-500/20 text-foreground placeholder:text-muted-foreground/50 transition-all"
                  />
                  {showDeptDropdown && (deptSearch || filteredDepts.length > 0) && (
                      <div className="absolute z-[60] left-0 right-0 mt-2 bg-card border border-border rounded-2xl max-h-60 overflow-y-auto shadow-2xl backdrop-blur-3xl animate-in slide-in-from-top-2">
                        {filteredDepts.map((dept) => (
                          <div
                            key={dept}
                            className="px-6 py-4 hover:bg-emerald-500 hover:text-white cursor-pointer text-sm font-bold text-muted-foreground transition-all flex items-center justify-between group"
                            onClick={() => {
                              setDepartment(dept);
                              setDeptSearch(dept);
                              setShowDeptDropdown(false);
                            }}
                          >
                            {dept}
                            {department === dept && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                          </div>
                        ))}
                        {filteredDepts.length === 0 && (
                          <div className="px-6 py-8 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-50">
                            Course node not discovered
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>

              {!isCompletionMode && (
                <div className="space-y-4">
                  <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1">
                    Select Your Potential Roles (Combined)
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "student", label: "Scholar", icon: Book, desc: "Access" },
                      { id: "tutor", label: "Tutor", icon: GraduationCap, desc: "Earn" },
                      { id: "campus_rep", label: "Rep", icon: Users, desc: "Grow" },
                    ].map((r) => (
                      <div
                        key={r.id}
                        onClick={() => toggleRole(r.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 gap-2 text-center relative overflow-hidden",
                          roles.includes(r.id)
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-xl shadow-emerald-500/10"
                            : "bg-muted/50 border-border text-muted-foreground hover:border-emerald-500/30"
                        )}
                      >
                        {roles.includes(r.id) && (
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        )}
                        <r.icon className={cn("w-5 h-5", roles.includes(r.id) && "scale-110")} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">{r.label}</p>
                            <p className="text-[7px] font-bold opacity-60 uppercase tracking-tighter mt-1 leading-none">{r.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isCompletionMode && (
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-muted/50 border-border h-11 rounded-xl focus:ring-emerald-500/20 text-foreground placeholder:text-muted-foreground/50 transition-all"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <AuraButton
                type="submit"
                className="w-full mt-6 shadow-2xl"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : isCompletionMode ? (
                  "Finalize Protocol"
                ) : (
                  "Initialize Account"
                )}
              </AuraButton>
            </form>
          </div>
          {!isCompletionMode && (
            <div className="p-8 flex flex-wrap items-center justify-center gap-2 text-xs pb-10 pt-6 border-t border-border bg-emerald-500/[0.01]">
              <span className="text-muted-foreground font-bold uppercase tracking-wider opacity-60">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="text-emerald-500 font-black uppercase tracking-widest hover:text-emerald-400 transition-colors"
              >
                Access Hub
              </Link>
            </div>
          )}
        </AuraCard>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
