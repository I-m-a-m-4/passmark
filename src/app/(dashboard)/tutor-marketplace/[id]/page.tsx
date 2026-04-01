"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  updateDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  GraduationCap, 
  Star, 
  MessageSquare, 
  Globe, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Send,
  User,
  Quote
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { AuraBackground } from "@/components/aura-background";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function TutorProfile() {
  const { id } = useParams();
  const [tutor, setTutor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    
    // Fetch Tutor Data
    const fetchTutor = async () => {
      const docRef = doc(db, "users", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setTutor(snap.data());
      }
      setLoading(false);
    };

    // Listen for Reviews
    const revRef = collection(db, "reviews");
    const q = query(revRef, where("tutorId", "==", id), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
        setReviews(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    fetchTutor();
    return () => unsub();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!auth.currentUser) return;
    if (!reviewText.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        tutorId: id,
        studentId: auth.currentUser.uid,
        studentName: auth.currentUser.displayName || "Verified Scholar",
        rating,
        text: reviewText,
        createdAt: serverTimestamp()
      });

      // Simple rating update logic (Average)
      const allRatings = reviews.map(r => r.rating);
      const newAvg = (([...allRatings, rating].reduce((a, b) => a + b, 0)) / (allRatings.length + 1)).toFixed(1);
      
      await updateDoc(doc(db, "users", id as string), {
        avgRating: parseFloat(newAvg),
        reviewCount: reviews.length + 1
      });

      setReviewText("");
      toast({ title: "Review Published", description: "Your feedback has been immortalized." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!auth.currentUser) return;
    if (!messageText.trim()) return;
    setSubmitting(true);
    try {
        await addDoc(collection(db, "messages"), {
            tutorId: id,
            senderId: auth.currentUser.uid,
            senderName: auth.currentUser.displayName,
            text: messageText,
            createdAt: serverTimestamp(),
            status: 'unread'
        });
        setMessageText("");
        toast({ title: "Signal Dispatched", description: "The mentor has been notified of your inquiry." });
    } catch (err: any) {
        toast({ variant: "destructive", title: "Dispatch Failed", description: err.message });
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-emerald-500" /></div>;
  if (!tutor) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="text-muted-foreground uppercase font-black tracking-widest leading-none">Mentor node not found</p><button onClick={() => router.back()} className="text-emerald-500 font-bold uppercase text-xs">Return to Marketplace</button></div>;

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuraBackground />
      
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all">
            <ArrowLeft className="w-4 h-4" /> Market Discovery
        </button>

        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-card/40 backdrop-blur-3xl p-10 rounded-[2rem] border border-border flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>
                    
                    <div className="h-32 w-32 rounded-[2rem] border-4 border-emerald-500/20 overflow-hidden shrink-0 relative">
                        <img 
                            src={tutor.profileImage || "/passmark.jpeg"} 
                            alt={tutor.fullName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[9px] uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" /> Verified mentor Hub
                            </div>
                            <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                                {tutor.fullName}
                            </h1>
                            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Globe className="w-4 h-4" /> {tutor.university}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter opacity-60">Success Rating</p>
                                <div className="flex items-center gap-1 text-emerald-500 font-black text-lg leading-none mt-1">
                                    <Star className="w-4 h-4 fill-emerald-500" /> {tutor.avgRating || "5.0"}
                                </div>
                            </div>
                            <div className="w-px h-8 bg-border self-center" />
                            <div className="text-center">
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter opacity-60">Verified Mentees</p>
                                <div className="text-foreground font-black text-lg leading-none mt-1">{tutor.reviewCount || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expertise Node */}
                <AuraCard className="p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] leading-none mb-4">Academic Expertises</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 rounded-xl bg-muted border border-border text-[10px] font-black text-foreground uppercase tracking-widest">
                           {tutor.department}
                        </span>
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                           Scholar Level 1
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">
                        "Professional mentorship focused on solving difficult past questions within the {tutor.department} node."
                    </p>
                </AuraCard>

                {/* Reviews Node */}
                <div className="space-y-6 pt-12">
                     <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Verified Feedbacks</h2>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{reviews.length} Reviews</span>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {reviews.length > 0 ? reviews.map((rev) => (
                            <AuraCard key={rev.id} className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-foreground uppercase tracking-widest">{rev.studentName}</p>
                                            <p className="text-[8px] text-muted-foreground font-bold">{new Date(rev.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-3 h-3", s <= rev.rating ? "fill-emerald-500 text-emerald-500" : "text-muted-foreground opacity-20")} />)}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-4">
                                    <Quote className="w-4 h-4 text-emerald-500 shrink-0 opacity-20" />
                                    {rev.text}
                                </p>
                            </AuraCard>
                        )) : (
                            <div className="text-center py-24 bg-muted/20 border-2 border-dashed border-border rounded-[2rem]">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 leading-none">No verified mentorship results yet</p>
                            </div>
                        )}
                     </div>
                </div>
            </div>

            {/* Sidebar Action Nodes */}
            <div className="space-y-8">
                <AuraCard className="p-8 space-y-8 border-emerald-500/30 bg-emerald-500/[0.02] sticky top-24">
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">Message Expert</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none opacity-60">Professional Inquiry Hub</p>
                        <Textarea 
                            placeholder="Describe your academic block or course code..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="bg-muted/50 border-border rounded-xl text-xs resize-none h-32 focus:ring-emerald-500/20"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={submitting || !messageText.trim()}
                            className="w-full h-14 rounded-2xl bg-emerald-500 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Signal Mentor</>}
                        </button>
                    </div>

                    <div className="pt-8 border-t border-dashed border-border space-y-6">
                        <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">Publish Feedback</h3>
                        <div className="flex items-center gap-2 mb-4">
                            {[1,2,3,4,5].map(s => (
                                <Star 
                                    key={s} 
                                    onClick={() => setRating(s)}
                                    className={cn("w-6 h-6 cursor-pointer transition-all", s <= rating ? "fill-emerald-500 text-emerald-500 scale-110" : "text-muted-foreground opacity-20 hover:opacity-100")} 
                                />
                            ))}
                        </div>
                        <Input 
                            placeholder="Describe your mentorship results..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="bg-muted/50 border-border rounded-xl text-xs h-12 focus:ring-emerald-500/20"
                        />
                         <button 
                            onClick={handleSubmitReview}
                            disabled={submitting || !reviewText.trim()}
                            className="w-full h-12 rounded-xl border border-emerald-500/30 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish verified Review"}
                        </button>
                    </div>
                </AuraCard>
            </div>
        </div>
      </div>
    </div>
  );
}
