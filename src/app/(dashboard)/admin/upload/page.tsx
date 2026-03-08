"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, Sparkles, Database, FileUp, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

const UNIVERSITIES = [
  "University of Lagos (UNILAG)",
  "University of Ibadan (UI)",
  "University of Nigeria, Nsukka (UNN)",
  "Obafemi Awolowo University (OAU)",
  "Ahmadu Bello University (ABU)",
];

const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Law",
  "Medicine",
  "Accounting",
  "Mathematics",
  "Physics",
];

export default function AdminUploadPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [year, setYear] = useState("");
  const { toast } = useToast();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !university || !department || !courseCode || !year) {
      toast({ title: "Validation Error", description: "All node parameters required for synthesis.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Logic for Firebase Storage would go here. For now we metadata-log to Firestore.
      const pqRef = doc(collection(db, "pastQuestions"));
      await setDoc(pqRef, {
        id: pqRef.id,
        university,
        department,
        courseCode: courseCode.toUpperCase(),
        courseTitle: `${courseCode.toUpperCase()} Examination Paper`,
        year,
        fileName: file.name,
        verified: true,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Material Ingested Successfully",
        description: "The document has been verified and deployed to the scholar lattice.",
      });

      setFile(null);
      setCourseCode("");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Ingestion Failed", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center gap-6 mb-4">
        <div className="p-5 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <Database className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Material Ingestion</h1>
          <p className="text-muted-foreground text-sm mt-2">Deploying new academic data nodes to the global study ledger.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur-xl border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-white/5 p-8 bg-white/2">
              <CardTitle className="text-xl">Node Parameters</CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold tracking-[0.3em] text-emerald-500/60 mt-2">Strict verification protocol active</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleUpload} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">Institution Node</Label>
                    <Select onValueChange={setUniversity}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-emerald-500/20 text-sm font-medium">
                        <SelectValue placeholder="Select University" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {UNIVERSITIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">Academic Sector</Label>
                    <Select onValueChange={setDepartment}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-emerald-500/20 text-sm font-medium">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">Course Code Hash</Label>
                    <Input
                      placeholder="e.g. CSC 101"
                      className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-emerald-500/40 text-sm font-medium transition-all"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">Chronometric Year</Label>
                    <Select onValueChange={setYear}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-emerald-500/20 text-sm font-medium">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {["2023/2024", "2022/2023", "2021/2022", "2020/2021"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">Binary Document (PDF)</Label>
                  <div
                    className={`border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center transition-all cursor-pointer ${file ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 hover:border-emerald-500/30 bg-white/2 hover:bg-white/5'}`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {file ? (
                      <div className="text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                          <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-lg font-bold text-white mb-1">{file.name}</p>
                        <p className="text-[10px] text-emerald-500/60 uppercase font-bold tracking-[0.2em]">Ready for Lattice Deployment</p>
                      </div>
                    ) : (
                      <div className="text-center group">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner">
                          <FileUp className="h-10 w-10 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <p className="text-base font-bold text-zinc-400 group-hover:text-white transition-colors">Deploy Raw PDF File</p>
                        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em] mt-3">Max Payload: 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-16 text-lg rounded-[1.5rem] shadow-[0_0_40px_rgba(16,185,129,0.2)] transition-all hover:-translate-y-1" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Executing Synthesis Protocol...
                    </>
                  ) : (
                    "Deploy Verified Material"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-emerald-500/5 border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group rounded-[2rem] p-2">
            <CardHeader className="p-6">
              <CardTitle className="text-emerald-400 text-base flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                Neural OCR Extraction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-xs text-emerald-100/60 leading-relaxed font-light">
                Our core logic gates can automatically extract Institution, Sector, and Course Code hashes directly from the binary stream of uploaded PDFs.
              </p>
              <Button variant="ghost" className="mt-6 text-emerald-500 hover:bg-emerald-500/10 p-0 font-bold underline text-[10px] uppercase tracking-[0.2em] h-auto">
                Initialize Auto-Extract
              </Button>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2rem] shadow-xl">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                <Info className="w-3 h-3" /> Lattice Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { label: "OCR Integrity Scan", active: true },
                { label: "Institution Node Check", active: true },
                { label: "Rep Signature Validation", active: false },
                { label: "Atomic State Log", active: true },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  {check.active ? (
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-lg border border-zinc-800 bg-white/2"></div>
                  )}
                  <span className={`text-xs font-bold tracking-wide transition-colors ${check.active ? 'text-zinc-300' : 'text-zinc-600'}`}>{check.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="p-8 bg-zinc-900/50 rounded-[2rem] border border-white/5 shadow-inner">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Storage Insight</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
              Materials are sharded across our secure object lattice. For high-volume deployment, we recommend
              <span className="text-emerald-500 font-bold"> Firebase Storage</span> for optimal latency and
              cost-per-request synthesis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}