"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Mail, Lock, User, School, Loader2, ArrowLeft, Book, Brain, Lightbulb, Pencil, Atom } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const NIGERIAN_UNIVERSITIES = [
  "University of Lagos (UNILAG)",
  "University of Ibadan (UI)",
  "University of Nigeria, Nsukka (UNN)",
  "Obafemi Awolowo University (OAU)",
  "Ahmadu Bello University (ABU)",
  "University of Benin (UNIBEN)",
  "University of Ilorin (UNILORIN)",
  "Federal University of Technology, Akure (FUTA)",
  "Federal University of Technology, Minna (FUTMINNA)",
  "Lagos State University (LASU)",
  "Covenant University",
  "Babcock University",
  "Bells University of Technology",
];

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Medicine & Surgery",
  "Law",
  "Accounting",
  "Biochemistry",
  "Business Administration",
  "Political Science",
  "Mass Communication",
];

import { Suspense } from "react";

function SignupContent() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        await updateProfile(user, { displayName: fullName });
      }

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          fullName,
          email,
          role,
          university,
          department,
          subscriptionStatus: "free",
          createdAt: new Date(),
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        }, { merge: true });

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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12 px-4 selection:bg-emerald-500/30 selection:text-emerald-400">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.05] pointer-events-none overflow-hidden">
        <Book className="absolute top-[15%] left-[10%] w-14 h-14 text-emerald-500 rotate-12" />
        <Brain className="absolute bottom-[10%] right-[10%] w-20 h-20 text-emerald-500 -rotate-12" />
        <Lightbulb className="absolute top-[10%] right-[20%] w-12 h-12 text-emerald-500 rotate-45" />
        <Pencil className="absolute bottom-[25%] left-[15%] w-10 h-10 text-emerald-500 -rotate-45" />
        <Atom className="absolute top-[40%] right-[5%] w-16 h-16 text-emerald-500 opacity-20" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-all mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-semibold uppercase tracking-widest">Back to Home</span>
        </Link>

        <Card className="bg-card/50 backdrop-blur-3xl border-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight leading-none">
              {isCompletionMode ? "Complete Your Profile" : "Join PassMark"}
            </CardTitle>
            <CardDescription className="text-emerald-600/60 dark:text-emerald-500/40 text-xs font-medium uppercase tracking-wider">
              {isCompletionMode ? "Tell us a bit more about you" : "Connect with your university study network"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-emerald-500/40" />
                    <Input
                      id="fullName"
                      placeholder="e.g. John Doe"
                      className="pl-10 bg-secondary/50 border-border h-11 rounded-xl focus:ring-emerald-500/20"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-500/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      className="pl-10 bg-secondary/50 border-border h-11 rounded-xl focus:ring-emerald-500/20"
                      required
                      disabled={isCompletionMode}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="university" className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1">Your University</Label>
                <Select onValueChange={setUniversity} required defaultValue={university}>
                  <SelectTrigger className="bg-secondary/50 border-border h-11 rounded-xl focus:ring-emerald-500/20">
                    <SelectValue placeholder="Select University" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {NIGERIAN_UNIVERSITIES.map((uni) => (
                      <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1">Department</Label>
                <Select onValueChange={setDepartment} required>
                  <SelectTrigger className="bg-secondary/50 border-border h-11 rounded-xl focus:ring-emerald-500/20">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!isCompletionMode && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-500/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-secondary/50 border-border h-11 rounded-xl focus:ring-emerald-500/20"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1">What is your role?</Label>
                <RadioGroup defaultValue="student" className="flex gap-4" onValueChange={setRole}>
                  <div className="flex items-center space-x-2 border border-border rounded-xl p-3 flex-1 cursor-pointer hover:bg-secondary transition-all">
                    <RadioGroupItem value="student" id="student" className="border-emerald-500 text-emerald-500" />
                    <Label htmlFor="student" className="cursor-pointer text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border rounded-xl p-3 flex-1 cursor-pointer hover:bg-secondary transition-all">
                    <RadioGroupItem value="tutor" id="tutor" className="border-emerald-500 text-emerald-500" />
                    <Label htmlFor="tutor" className="cursor-pointer text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Tutor</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-bold h-12 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.2)]" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isCompletionMode ? "Finish Setup" : "Create Account"}
              </Button>
            </form>
          </CardContent>
          {!isCompletionMode && (
            <CardFooter className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] pb-8 pt-2">
              <span className="text-muted-foreground font-medium">Already have an account?</span>
              <Link href="/login" className="text-emerald-600 dark:text-emerald-500 font-bold hover:underline">
                Log in here
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}