"use client";

import { Input } from "@/components/ui/input";
import {
  Search as SearchIcon,
  Filter,
  Sparkles,
  BookOpen,
  GraduationCap,
  Download,
  Bookmark,
  FileText,
  Lock,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AuraCard, AuraButton } from "@/components/aura-ui";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [queryStr, setQueryStr] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUser() {
      if (auth.currentUser) {
        const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userSnap.exists()) setUserData(userSnap.data());
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (queryStr.length > 2) {
        performSearch(queryStr);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [queryStr]);

  const performSearch = async (s: string) => {
    setLoading(true);
    try {
      // Simplified search: in a real app you might use Algolia or a partial match index.
      // Here we'll search by exact Course Code (uppercase) or verify in-memory for simple app.
      const q = query(
        collection(db, "pastQuestions"),
        where("verified", "==", true),
        limit(50),
      );
      const querySnapshot = await getDocs(q);
      const allItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      const filtered = allItems.filter(
        (item) =>
          item.courseCode?.toLowerCase().includes(s.toLowerCase()) ||
          item.courseTitle?.toLowerCase().includes(s.toLowerCase()) ||
          item.department?.toLowerCase().includes(s.toLowerCase()),
      );
      setResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (item: any) => {
    if (!auth.currentUser || !userData) return;
    const isBookmarked = (userData.bookmarkedMaterials || []).includes(item.id);
    const newBookmarks = isBookmarked
      ? userData.bookmarkedMaterials.filter((id: string) => id !== item.id)
      : [...(userData.bookmarkedMaterials || []), item.id];

    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        bookmarkedMaterials: newBookmarks,
      });
      setUserData({ ...userData, bookmarkedMaterials: newBookmarks });
      toast({
        title: isBookmarked ? "Removed" : "Saved",
        description: item.courseCode + " updated.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update bookmark.",
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-zinc-900 dark:text-white">
          Library Search
        </h1>
        <p className="text-zinc-500 dark:text-gray-500">
          Find any study material across our global university network.
        </p>
      </div>

      <div className="relative group max-w-2xl">
        <SearchIcon className="absolute left-4 top-4 h-5 w-5 text-emerald-500/50 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder="Search courses, codes, or departments (e.g. CSC 101)..."
          className="pl-12 h-14 bg-white/80 dark:bg-zinc-950/30 border-black/5 dark:border-white/10 shadow-xl rounded-2xl focus:ring-emerald-500/20 text-zinc-900 dark:text-white placeholder:text-gray-500"
          value={queryStr}
          onChange={(e) => setQueryStr(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Clock className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {results.map((item) => {
              const isBookmarked = (
                userData?.bookmarkedMaterials || []
              ).includes(item.id);
              const isUnlocked =
                (userData?.unlockedParts || []).includes(
                  `${item.university}_${item.department}_${item.level}`,
                ) || userData?.role === "admin";

              return (
                <AuraCard
                  key={item.id}
                  className="group hover:scale-[1.002] transition-transform"
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-lg uppercase tracking-tight text-zinc-950 dark:text-white truncate">
                          {item.courseCode}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-500">
                          {item.year}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-gray-400 font-medium truncate">
                        {item.courseTitle}
                      </p>
                      <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mt-1">
                        {item.university}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-10 w-10 rounded-full",
                          isBookmarked
                            ? "text-emerald-500 bg-emerald-500/10"
                            : "text-zinc-400",
                        )}
                        onClick={() => toggleBookmark(item)}
                      >
                        <Bookmark
                          className={cn(
                            "h-4 w-4",
                            isBookmarked && "fill-current",
                          )}
                        />
                      </Button>
                      <AuraButton
                        disabled={!isUnlocked}
                        onClick={() =>
                          item.fileUrl && window.open(item.fileUrl, "_blank")
                        }
                        className={cn(
                          "h-10",
                          !isUnlocked &&
                            "opacity-30 grayscale cursor-not-allowed",
                        )}
                      >
                        {!isUnlocked && <Lock className="w-3 h-3 mr-2" />}
                        Download
                      </AuraButton>
                    </div>
                  </div>
                </AuraCard>
              );
            })}
          </div>
        ) : queryStr.length > 2 ? (
          <div className="text-center py-20 bg-black/[0.02] dark:bg-white/[0.02] rounded-[3rem] border border-dashed border-black/10 dark:border-white/10">
            <BookOpen className="h-12 w-12 text-zinc-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2 text-zinc-400 dark:text-gray-400 italic">
              No matching results...
            </h3>
            <p className="text-zinc-500 dark:text-gray-500 text-sm">
              Try searching by a different course code or university name.
            </p>
          </div>
        ) : (
          <div className="text-center py-24 bg-black/[0.02] dark:bg-white/[0.02] rounded-[3rem] border border-dashed border-black/10 dark:border-white/10">
            <SearchIcon className="h-12 w-12 text-zinc-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2 text-zinc-400 dark:text-gray-400 italic">
              Awaiting search signal...
            </h3>
            <p className="text-zinc-500 dark:text-gray-500 text-sm">
              Enter a course code or topic above to explore the network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
