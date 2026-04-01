"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { 
  GraduationCap, 
  Search, 
  Star, 
  BookOpen, 
  MessageSquare, 
  Globe, 
  BadgeCheck,
  Filter,
  Users
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { AuraBackground } from "@/components/aura-background";
import { Input } from "@/components/ui/input";

export default function TutorMarketplace() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const tutorsRef = collection(db, "users");
        const q = query(tutorsRef, where("roles", "array-contains", "tutor"));
        const snapshot = await getDocs(q);
        const tutorList = snapshot.docs.map(doc => doc.data());
        setTutors(tutorList);
      } catch (err) {
        console.error("Failed to fetch tutors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter(t => 
    t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    t.department?.toLowerCase().includes(search.toLowerCase()) ||
    t.university?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuraBackground />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs uppercase tracking-[0.2em] animate-in slide-in-from-top-4">
            <BadgeCheck className="w-4 h-4" /> Verified Academic Mentors
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight leading-none">
            Expert <span className="text-emerald-500 italic">Marketplace</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest max-w-2xl mx-auto">
            Connect with top-tier scholars for personalized mentorship in difficult courses. Scale your grades with expert guidance.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-card/40 backdrop-blur-3xl p-4 rounded-3xl border border-border shadow-2xl">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground opacity-50" />
                <Input 
                    placeholder="Search by name, department, or university..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 bg-muted/50 border-border h-12 rounded-2xl text-foreground focus:ring-emerald-500/20"
                />
            </div>
            <button className="h-12 px-6 rounded-2xl bg-muted border border-border flex items-center gap-3 text-xs font-black uppercase tracking-widest text-foreground hover:bg-muted/80 transition-all">
                <Filter className="w-4 h-4" /> Filters
            </button>
        </div>

        {/* Tutor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
                <AuraCard key={i} className="h-80 animate-pulse bg-muted/20"><div /></AuraCard>
            ))
          ) : filteredTutors.length > 0 ? (
            filteredTutors.map((tutor, i) => (
            <AuraCard key={i} className="group hover:scale-[1.02] transition-all duration-500 h-full flex flex-col">
              <div className="p-8 space-y-6 flex-1">
                <div className="flex items-start justify-between">
                    <div className="h-20 w-20 rounded-3xl border-2 border-emerald-500/20 overflow-hidden bg-muted p-1">
                        <img 
                            src={tutor.profileImage || "/passmark.jpeg"} 
                            alt={tutor.fullName}
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-emerald-500">
                           <Star className="w-3.5 h-3.5 fill-emerald-500" />
                           <span className="text-xs font-black">5.0</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest bg-muted px-2 py-1 rounded border border-border">
                            Verified Mentor
                        </span>
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight truncate">
                        {tutor.fullName}
                    </h3>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="w-3 h-3" /> {tutor.university}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                        {tutor.department}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-muted border border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        Mentorship Level 1
                    </span>
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto border-t border-border mt-6">
                <button className="w-full h-12 rounded-2xl bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                    <MessageSquare className="w-4 h-4" /> Message Mentor
                </button>
              </div>
            </AuraCard>
            ))
          ) : (
            <div className="col-span-full text-center py-32 bg-muted/20 border-2 border-dashed border-border rounded-[2.5rem]">
                <Users className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-4" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No mentors found for this registry query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
