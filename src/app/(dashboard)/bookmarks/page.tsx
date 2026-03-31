"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookMarked, Folder, Trash2, Download, ExternalLink, FileText, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, documentId } from "firebase/firestore";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuraCard, AuraButton } from "@/components/aura-ui";
import { useToast } from "@/hooks/use-toast";

export default function BookmarksPage() {
    const [savedMaterials, setSavedMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchBookmarks() {
            if (!auth.currentUser) return;

            try {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUserData(data);
                    const bookmarkIds = data.bookmarkedMaterials || [];

                    if (bookmarkIds.length > 0) {
                        // Firestore 'in' query has a limit of 10 IDs. 
                        // For a simple implementation, we'll fetch them.
                        const q = query(
                            collection(db, "pastQuestions"),
                            where(documentId(), "in", bookmarkIds.slice(0, 10))
                        );
                        const querySnapshot = await getDocs(q);
                        const materials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setSavedMaterials(materials);
                    }
                }
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBookmarks();
    }, []);

    const removeBookmark = async (id: string) => {
        if (!auth.currentUser || !userData) return;
        const newBookmarks = userData.bookmarkedMaterials.filter((bid: string) => bid !== id);
        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                bookmarkedMaterials: newBookmarks
            });
            setSavedMaterials(prev => prev.filter(m => m.id !== id));
            setUserData({ ...userData, bookmarkedMaterials: newBookmarks });
            toast({ title: "Bookmark Removed", description: "The material has been removed from your collection." });
        } catch (e) {
            toast({ variant: "destructive", title: "Error", description: "Failed to remove bookmark." });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-headline tracking-tight text-zinc-900 dark:text-white">Saved Materials</h1>
                <p className="text-zinc-500 dark:text-gray-500">Your curated collection of academic knowledge nodes.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Clock className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            ) : savedMaterials.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {savedMaterials.map((q) => {
                        const isUnlocked = (userData?.unlockedParts || []).includes(`${q.university}_${q.department}_${q.level}`) || userData?.role === "admin";
                        return (
                            <AuraCard key={q.id} className="group overflow-hidden">
                                <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-lg uppercase tracking-tight text-zinc-950 dark:text-white">{q.courseCode}</h4>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-500">{q.year}</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">{q.type}</span>
                                        </div>
                                        <p className="text-sm text-zinc-500 dark:text-gray-400 font-medium">{q.courseTitle}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                            onClick={() => removeBookmark(q.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <AuraButton 
                                            disabled={!isUnlocked}
                                            onClick={() => q.fileUrl && window.open(q.fileUrl, '_blank')}
                                            className={cn("h-10", !isUnlocked && "opacity-30 grayscale cursor-not-allowed")}
                                        >
                                            <Download className="h-4 w-4 mr-2" /> Download
                                        </AuraButton>
                                    </div>
                                </div>
                            </AuraCard>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-black/[0.02] dark:bg-white/[0.02] rounded-[3rem] border border-dashed border-black/10 dark:border-white/10">
                    <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                        <BookMarked className="h-12 w-12 text-emerald-500/40" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">No materials saved yet</h2>
                        <p className="text-zinc-500 dark:text-gray-500 max-w-xs mx-auto text-sm leading-relaxed italic">
                            Immutable links to your most studied materials will appear here. Pin a question from the dashboard to start your collection.
                        </p>
                    </div>
                    <Button className="font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-10 h-12 shadow-xl shadow-emerald-500/20" asChild>
                        <Link href="/dashboard">Explore Library</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
