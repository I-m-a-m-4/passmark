"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdminEmail } from "@/lib/admin-config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (isAdminEmail(currentUser?.email)) {
        // Ensure the role in Firestore is also 'admin'
        if (currentUser) {
          try {
            const { doc, getDoc, setDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists() || userSnap.data().role !== "admin") {
              await setDoc(userRef, { 
                role: "admin",
                email: currentUser.email,
                fullName: currentUser.displayName || "Admin",
                id: currentUser.uid,
                updatedAt: new Date()
              }, { merge: true });
            }
            // Only set isAdmin to true once we KNOW the DB is updated
            setIsAdmin(true);
          } catch (e) {
            console.error("Admin sync failed:", e);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdminLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Admin login error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="p-6 rounded-[2.5rem] bg-emerald-500/10 border border-dashed border-emerald-500/20 shadow-sm relative group">
            <Lock className="w-12 h-12 text-emerald-500" />
            <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full scale-150 group-hover:bg-emerald-500/10 transition-colors"></div>
        </div>
        
        <div className="text-center space-y-3 max-w-md">
            <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Authentication</h1>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                Access to this section is restricted to authorized personnel. 
                Please sign in with your administrator email to continue.
            </p>
        </div>

        <Button 
            onClick={handleAdminLogin}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-14 px-10 rounded-2xl shadow-sm transition-all hover:-translate-y-1"
        >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3 bg-white p-0.5 rounded-full" alt="G" />
            Continue with Google
        </Button>

        {user && !isAdminEmail(user.email) && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-dashed border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-shake">
                Email ({user.email}) is not authorized for Admin access.
            </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
