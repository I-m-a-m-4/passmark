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
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { NIGERIAN_UNIVERSITIES, DEPARTMENTS } from "@/constants/study-data";

import { Suspense } from "react";

function SignupContent() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  const filteredDepts = DEPARTMENTS.filter((d) =>
    d.toLowerCase().includes(deptSearch.toLowerCase()),
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
    setLoading(true);
    try {
      let user = auth.currentUser;

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
        const userRole = isAdminEmail(email) ? "admin" : role;

        await setDoc(
          doc(db, "users", user.uid),
          {
            id: user.uid,
            fullName,
            email,
            role: userRole,
            university,
            department,
            subscriptionStatus: "free",
            createdAt: new Date(),
            referralCode: Math.random()
              .toString(36)
              .substring(2, 8)
              .toUpperCase(),
          },
          { merge: true },
        );

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
          <div className="p-8 space-y-2 text-center border-b border-white/5 bg-white/[0.01]">
            <h1 className="text-3xl font-bold tracking-tight leading-none text-white">
              {isCompletionMode ? "Complete Your Profile" : "Join PassMark"}
            </h1>
            <p className="text-emerald-500/60 text-xs font-medium uppercase tracking-wider leading-relaxed">
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
                    <User className="absolute left-3 top-3 h-4 w-4 text-emerald-500/40" />
                    <Input
                      id="fullName"
                      placeholder="e.g. John Doe"
                      className="pl-10 bg-white/[0.03] border-white/10 h-11 rounded-xl focus:ring-emerald-500/20 text-white placeholder:text-gray-500"
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
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-500/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      className="pl-10 bg-white/[0.03] border-white/10 h-11 rounded-xl focus:ring-emerald-500/20 text-white placeholder:text-gray-500"
                      required
                      disabled={isCompletionMode}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="university"
                  className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                >
                  Your University
                </Label>
                <Select
                  onValueChange={setUniversity}
                  required
                  defaultValue={university}
                >
                  <SelectTrigger className="bg-white/[0.03] border-white/10 h-11 rounded-xl focus:ring-emerald-500/20 text-white">
                    <SelectValue placeholder="Select University" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {NIGERIAN_UNIVERSITIES.map((uni) => (
                      <SelectItem key={uni} value={uni}>
                        {uni}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 relative">
                <Label
                  htmlFor="department"
                  className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                >
                  Department
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Search Department..."
                    value={deptSearch}
                    onChange={(e) => {
                      setDeptSearch(e.target.value);
                      setShowDeptDropdown(true);
                    }}
                    onFocus={() => setShowDeptDropdown(true)}
                    className="bg-white/[0.03] border-white/10 h-11 rounded-xl focus:ring-emerald-500/20 text-white placeholder:text-gray-500"
                  />
                  {showDeptDropdown &&
                    (deptSearch || filteredDepts.length > 0) && (
                      <div className="absolute z-50 left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl max-h-60 overflow-y-auto shadow-2xl">
                        {filteredDepts.map((dept) => (
                          <div
                            key={dept}
                            className="px-4 py-3 hover:bg-emerald-500 hover:text-white cursor-pointer text-sm text-gray-300 transition-colors"
                            onClick={() => {
                              setDepartment(dept);
                              setDeptSearch(dept);
                              setShowDeptDropdown(false);
                            }}
                          >
                            {dept}
                          </div>
                        ))}
                        {filteredDepts.length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No departments found
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>

              {!isCompletionMode && (
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-500/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-white/[0.03] border-white/10 h-11 rounded-xl focus:ring-emerald-500/20 text-white placeholder:text-gray-500"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <AuraButton
                type="submit"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isCompletionMode ? (
                  "Finish Setup"
                ) : (
                  "Create Account"
                )}
              </AuraButton>
            </form>
          </div>
          {!isCompletionMode && (
            <div className="p-8 flex flex-wrap items-center justify-center gap-1.5 text-[11px] pb-8 pt-6 border-t border-white/5 bg-white/[0.01]">
              <span className="text-muted-foreground font-medium">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="text-emerald-500 font-bold hover:underline"
              >
                Log in here
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
