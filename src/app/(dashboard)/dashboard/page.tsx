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
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { collection, query, limit, getDocs, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentDashboard() {
  const [recentQuestions, setRecentQuestions] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!auth.currentUser) return;

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setSelectedDept(data.department || "");
      }

      const q = query(collection(db, "pastQuestions"), where("verified", "==", true), limit(6));
      const querySnapshot = await getDocs(q);
      const questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (questions.length === 0) {
        setRecentQuestions([
          { id: '1', courseCode: 'CSC 101', courseTitle: 'Introduction to Computer Science', year: '2023', university: 'UNILAG', department: 'Computer Science' },
          { id: '2', courseCode: 'MTH 201', courseTitle: 'Linear Algebra I', year: '2022', university: 'UNILAG', department: 'Mathematics' },
          { id: '3', courseCode: 'GNS 101', courseTitle: 'Use of English', year: '2023', university: 'OAU', department: 'General Studies' },
          { id: '4', courseCode: 'PHY 101', courseTitle: 'General Physics I', year: '2023', university: 'UI', department: 'Physics' },
        ]);
      } else {
        setRecentQuestions(questions);
      }
    }
    fetchData();
  }, []);

  const handleDeptChange = async (dept: string) => {
    setSelectedDept(dept);
    if (auth.currentUser) {
      updateDoc(doc(db, "users", auth.currentUser.uid), { department: dept });
    }
  };

  const filteredQuestions = recentQuestions.filter(q =>
    q.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header with Search */}
      <section className="bg-emerald-600 dark:bg-emerald-900/40 p-8 md:p-12 rounded-[2rem] text-white shadow-2xl overflow-hidden relative border border-white/10">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
              <Sparkles className="w-3 h-3 text-emerald-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Welcome Back, Scholar</span>
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
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  {["Computer Science", "Engineering", "Medicine", "Law", "Arts", "Science"].map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
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
          {/* Dashboard Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Download, label: "Library Access", value: "24", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Bookmark, label: "Bookmarks", value: "8", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { icon: GraduationCap, label: "Courses", value: "6", color: "text-purple-500", bg: "bg-purple-500/10" },
            ].map((stat, i) => (
              <Card key={i} className="border-white/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-card/50 backdrop-blur-sm group">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-2">{stat.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Past Questions Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-emerald-500" />
                </div>
                Past Questions for {selectedDept || "All Departments"}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">Showing {filteredQuestions.length} items</p>
            </div>

            <div className="grid gap-4">
              {filteredQuestions.length > 0 ? filteredQuestions.map((q) => (
                <Card key={q.id} className="group hover:border-emerald-500/40 transition-all cursor-pointer bg-card/50 backdrop-blur-sm overflow-hidden border-white/5 shadow-md hover:shadow-emerald-500/5">
                  <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h4 className="font-bold text-xl group-hover:text-emerald-500 transition-colors">{q.courseCode}</h4>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold px-3 py-1 bg-zinc-100 dark:bg-white/10 rounded-full uppercase tracking-widest">
                            {q.year}
                          </span>
                          <span className="text-[10px] font-bold px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center gap-1.5 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        </div>
                      </div>
                      <p className="text-base text-muted-foreground font-medium mb-3">{q.courseTitle}</p>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-[11px] text-emerald-500/70 uppercase font-bold tracking-wider flex items-center gap-2">
                          <School className="w-3.5 h-3.5" /> {q.university}
                        </span>
                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5" /> {q.department}
                        </span>
                      </div>
                    </div>
                    <Button className="md:w-auto w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-12 px-6 rounded-xl shadow-lg opacity-0 md:group-hover:opacity-100 transition-all transform md:translate-x-4 md:group-hover:translate-x-0">
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-20 bg-card/20 rounded-[2rem] border-2 border-dashed border-white/5">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No materials found</h3>
                  <p className="text-muted-foreground">Try searching for a different course code or department.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-none shadow-2xl overflow-hidden relative rounded-[2rem]">
            <CardContent className="p-8 space-y-6 text-center relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center mx-auto mb-2 shadow-2xl border border-white/10">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-2xl font-headline mb-2">Study Assistant Pro</h3>
                <p className="text-sm text-emerald-50/80 leading-relaxed font-light">
                  Get instant summaries, practice questions, and predictive topic analysis for your exams.
                </p>
              </div>
              <Button variant="secondary" className="w-full h-14 font-bold bg-white text-emerald-700 hover:bg-white/90 rounded-2xl shadow-xl" asChild>
                <Link href="/ai-assistant">Activate Assistant</Link>
              </Button>
            </CardContent>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[80px]"></div>
            <div className="absolute top-[-20%] left-[-20%] w-48 h-48 bg-emerald-400/20 rounded-full blur-[60px]"></div>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-white/5 rounded-[2rem] overflow-hidden shadow-lg">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <School className="w-4 h-4 text-emerald-500" />
                </div>
                My Institution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="text-xl font-bold text-emerald-500 mb-2">{userData?.university || "UNILAG"}</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-6">Status: Verified Enrollment</div>
              <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5" disabled>
                Sync with Campus Rep
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-emerald-500/20 shadow-2xl rounded-[2rem] overflow-hidden relative group">
            <CardContent className="p-8 text-center space-y-4 relative z-10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-black font-bold text-2xl mb-2 group-hover:rotate-12 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                ₦
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Scholar Rewards</h3>
                <p className="text-[10px] text-emerald-500/60 uppercase font-bold tracking-widest mt-1">Lattice Expansion Protocol</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-sm font-mono mt-4 font-bold select-all text-emerald-400 border border-white/5 group-hover:border-emerald-500/30 transition-all shadow-inner">
                {userData?.referralCode || "FETCHING..."}
              </div>
              <p className="text-[10px] text-zinc-500 font-medium">Earn credit for every student you onboard.</p>
            </CardContent>
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Card>
        </div>
      </div>
    </div>
  );
}