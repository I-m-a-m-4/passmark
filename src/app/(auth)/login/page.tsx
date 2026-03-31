"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Mail,
  Lock,
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
import { FirebaseError } from "firebase/app";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDomain, setCurrentDomain] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.hostname);
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome Back!",
        description: "Ready to start your study session.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        router.push("/signup?mode=complete-profile");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/unauthorized-domain"
      ) {
        toast({
          variant: "destructive",
          title: "Domain Not Authorized",
          description: `Please add "${currentDomain}" to your Firebase Console 'Authorized Domains' list.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Google Sign-in Failed",
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 selection:bg-emerald-500/30 selection:text-emerald-400">
      <AuraBackground />

      <div className="w-full max-w-md relative z-10 mt-20 mb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-all mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Back to Home
          </span>
        </Link>

        <AuraCard className="overflow-hidden relative">
          <div className="p-8 space-y-2 text-center pb-8 border-b border-white/5 relative">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <GraduationCap className="text-white h-6 w-6" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Login to PassMark
            </h2>
            <p className="text-emerald-500/60 text-xs font-medium uppercase tracking-widest leading-relaxed">
              Access your study materials
            </p>
          </div>

          <div className="p-8 space-y-6">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                >
                  Email Address
                </Label>
                <div className="relative group transition-all duration-300 focus-within:scale-[1.02]">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-500/40 group-focus-within:text-emerald-500 group-focus-within:scale-110 transition-all" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@university.edu"
                    className="pl-10 bg-white/[0.03] border-white/10 h-11 focus:ring-emerald-500/20 rounded-xl transition-all text-white placeholder:text-gray-500"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-1"
                  >
                    Password
                  </Label>
                </div>
                <div className="relative group transition-all duration-300 focus-within:scale-[1.02]">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-500/40 group-focus-within:text-emerald-500 group-focus-within:scale-110 transition-all" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white/[0.03] border-white/10 h-11 focus:ring-emerald-500/20 rounded-xl transition-all text-white placeholder:text-gray-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <AuraButton
                type="submit"
                className="w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </AuraButton>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-bold">
                <span className="bg-card px-4 text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full border-border bg-secondary/50 hover:bg-emerald-500 hover:text-white h-12 rounded-xl transition-all flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
          <div className="p-8 flex flex-wrap items-center justify-center gap-1.5 text-[11px] pb-8 bg-white/[0.02] border-t border-white/5">
            <span className="text-muted-foreground font-medium">
              New student?
            </span>
            <Link
              href="/signup"
              className="text-emerald-500 font-bold hover:underline transition-colors decoration-emerald-500/30 underline-offset-4"
            >
              Create an account
            </Link>
          </div>
        </AuraCard>
      </div>
    </div>
  );
}
