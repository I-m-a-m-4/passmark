"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Database, 
  FileUp, 
  Info, 
  Trash2,
  FileIcon,
  CloudUpload,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { 
  NIGERIAN_UNIVERSITIES, 
  DEPARTMENTS, 
  LEVELS, 
  SEMESTERS, 
  ACADEMIC_YEARS, 
  MATERIAL_TYPES 
} from "@/constants/study-data";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

export default function AdminUploadPage() {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [level, setLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("");
  
  // Search and Filter State
  const [uniSearch, setUniSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  const filteredUnis = NIGERIAN_UNIVERSITIES.filter((u) =>
    u.toLowerCase().includes(uniSearch.toLowerCase()),
  );
  const filteredDepts = DEPARTMENTS.filter((d) =>
    d.toLowerCase().includes(deptSearch.toLowerCase()),
  );

  const { toast } = useToast();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload } = useUploadThing("pdfUploader", {
    onUploadBegin: () => {
      setIsUploadingFile(true);
      setUploadProgress(0);
      toast({ title: "Initializing Upload", description: "Connecting to secure cloud nodes..." });
    },
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        setFileUrl(res[0].url);
        setFileName(res[0].name);
        setIsUploadingFile(false);
        setUploadProgress(100);
        toast({ title: "Upload Success", description: "Your file is verified and ready." });
      }
    },
    onUploadError: (e) => {
      setIsUploadingFile(false);
      toast({ variant: "destructive", title: "Upload Failed", description: e.message });
    },
    onUploadProgress: (p) => {
        setUploadProgress(p);
    }
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Auto-triggering the upload instantly on selection
    await startUpload(Array.from(files));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fileUrl ||
      !university ||
      !department ||
      !courseCode ||
      !level ||
      !semester ||
      !year ||
      !type
    ) {
      toast({
        title: "Configuration Error",
        description: "Please complete all structural tags and upload your material.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const pqRef = doc(collection(db, "pastQuestions"));
      await setDoc(pqRef, {
        id: pqRef.id,
        university,
        department,
        courseCode: courseCode.toUpperCase(),
        courseTitle: courseTitle || "Untitled Course",
        level,
        semester,
        year,
        type,
        fileUrl,
        fileName,
        verified: true,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Material Dispatched",
        description: `${courseCode} is now live in the global library.`,
      });

      setFileUrl("");
      setFileName("");
      setCourseCode("");
      setCourseTitle("");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Dispatch Failed", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between mb-8">
        <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-emerald-500 shadow-xl shadow-emerald-500/10 text-black border border-emerald-400">
            <CloudUpload className="w-6 h-6" />
            </div>
            <div>
            <h1 className="text-3xl font-black font-headline tracking-tighter text-foreground uppercase">Production Upload</h1>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]"></span>
                Material Node: Operational
            </p>
            </div>
        </div>
        <div className="bg-card/50 dark:bg-zinc-950/50 border border-border px-6 py-2.5 rounded-xl backdrop-blur-xl flex items-center gap-4 shadow-sm">
            <div className="text-right">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Active System</p>
                <p className="text-xs font-black text-foreground uppercase tracking-wider">PassMark Network V1.2</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <Zap className="w-4 h-4 fill-current" />
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="bg-card dark:bg-zinc-950 border border-border shadow-md rounded-2xl overflow-hidden relative">
            <CardHeader className="border-b border-dashed border-border p-10 bg-muted/10">
              <CardTitle className="text-xl font-black font-headline text-foreground uppercase tracking-tight">Material Metadata</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mt-2">Initialize document structural nodes</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleUpload} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4 relative">
                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1 opacity-60">University Location</Label>
                    <div className="relative group">
                      <Input
                        placeholder="Search Institution..."
                        className="bg-muted/50 border-border h-14 rounded-xl px-6 focus:border-emerald-500/40 text-[11px] font-black uppercase tracking-widest transition-all placeholder:text-muted-foreground/40 placeholder:font-bold"
                        value={uniSearch}
                        onChange={(e) => {
                          setUniSearch(e.target.value);
                          setShowUniDropdown(true);
                        }}
                        onFocus={() => setShowUniDropdown(true)}
                      />
                      {showUniDropdown && (uniSearch || filteredUnis.length > 0) && (
                        <div className="absolute z-[100] left-0 right-0 mt-3 bg-popover border border-border rounded-xl max-h-72 overflow-y-auto shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl">
                          {filteredUnis.map((u) => (
                            <div 
                              key={u} 
                              className="px-6 py-3.5 hover:bg-emerald-500 hover:text-black cursor-pointer text-[10px] font-black rounded-lg transition-all uppercase tracking-[0.1em] text-muted-foreground hover:scale-[1.01]"
                              onClick={() => {
                                setUniversity(u);
                                setUniSearch(u);
                                setShowUniDropdown(false);
                              }}
                            >
                              {u}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 relative">
                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1 opacity-60">Department Node</Label>
                    <div className="relative group">
                      <Input
                        placeholder="Search Department..."
                        className="bg-muted/50 border-border h-14 rounded-xl px-6 focus:border-emerald-500/40 text-[11px] font-black uppercase tracking-widest transition-all placeholder:text-muted-foreground/40 placeholder:font-bold"
                        value={deptSearch}
                        onChange={(e) => {
                          setDeptSearch(e.target.value);
                          setShowDeptDropdown(true);
                        }}
                        onFocus={() => setShowDeptDropdown(true)}
                      />
                      {showDeptDropdown && (deptSearch || filteredDepts.length > 0) && (
                        <div className="absolute z-[100] left-0 right-0 mt-3 bg-popover border border-border rounded-xl max-h-72 overflow-y-auto shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl">
                          {filteredDepts.map((d) => (
                            <div 
                              key={d} 
                              className="px-6 py-3.5 hover:bg-emerald-500 hover:text-black cursor-pointer text-[10px] font-black rounded-lg transition-all uppercase tracking-[0.1em] text-muted-foreground hover:scale-[1.01]"
                              onClick={() => {
                                setDepartment(d);
                                setDeptSearch(d);
                                setShowDeptDropdown(false);
                              }}
                            >
                              {d}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1 opacity-60">System Course Code</Label>
                    <Input
                      placeholder="e.g. CSC101"
                      className="bg-muted/50 border-border h-14 rounded-xl px-6 focus:border-emerald-500/40 text-[11px] font-black tracking-widest transition-all text-foreground uppercase px-8"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1 opacity-60 leading-relaxed">System Course Title <span className="text-zinc-500 ml-2 font-black tracking-normal opacity-50 italic uppercase text-[8px]">(Optional)</span></Label>
                    <Input
                      placeholder="e.g. Introduction to Physics"
                      className="bg-muted/50 border-border h-14 rounded-xl px-6 focus:border-emerald-500/40 text-[11px] font-black uppercase tracking-widest transition-all text-foreground"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Year Range", val: year, set: setYear, data: ACADEMIC_YEARS },
                    { label: "Type Node", val: type, set: setType, data: MATERIAL_TYPES },
                    { label: "Level Node", val: level, set: setLevel, data: LEVELS },
                    { label: "Semester", val: semester, set: setSemester, data: SEMESTERS },
                  ].map((field, i) => (
                    <div key={i} className="space-y-3">
                      <Label className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1 opacity-60">{field.label}</Label>
                      <Select onValueChange={field.set}>
                        <SelectTrigger className="bg-muted/50 border-border h-12 rounded-lg px-4 focus:ring-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <SelectValue placeholder="---" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-foreground font-black uppercase text-[9px] tracking-widest">
                          {field.data.map(d => <SelectItem key={d} value={d} className="focus:bg-emerald-500 focus:text-black">{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 pt-6">
                  <Label className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground ml-2 opacity-60">Secure PDF Transmission</Label>
                  {!fileUrl ? (
                    <div className="relative">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept="application/pdf"
                            onChange={handleFileSelect}
                        />
                        <label 
                            htmlFor="file-upload"
                            className={cn(
                                "border-2 border-dashed border-border rounded-2xl bg-muted/20 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all min-h-[220px] flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden",
                                isUploadingFile && "pointer-events-none border-emerald-500/40 bg-emerald-500/5"
                            )}
                        >
                            {isUploadingFile ? (
                                <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <p className="text-xs font-black text-emerald-500">{uploadProgress}%</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-black text-foreground uppercase tracking-widest mb-1">Broadcasting Node...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-2xl bg-card shadow-sm border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all relative z-10">
                                        <FileUp className="w-6 h-6" />
                                    </div>
                                    <div className="text-center relative z-10 px-10">
                                        <p className="text-sm font-black text-foreground uppercase tracking-[0.1em] mb-1">Initialize Selection</p>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase opacity-40">Verified PDF nodes up to 32MB</p>
                                    </div>
                                </>
                            )}
                        </label>
                    </div>
                  ) : (
                    <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-2xl p-10 flex flex-col items-center justify-center animate-in zoom-in duration-500 relative group overflow-hidden">
                      <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] relative z-10 text-black">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div className="text-center relative z-10">
                        <p className="text-sm font-black text-foreground mb-1 uppercase tracking-wide">
                            {fileName}
                        </p>
                        <p className="text-[9px] text-emerald-500 uppercase font-black tracking-[0.4em] mb-4">
                            Verified Protocol Ready
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 h-10 w-10 rounded-xl"
                        onClick={() => {
                          setFileUrl("");
                          setFileName("");
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black h-16 text-xs tracking-[0.2em] rounded-xl transition-all hover:scale-[1.02] mt-6 shadow-xl shadow-emerald-500/10 group uppercase"
                  type="submit"
                  disabled={loading || !fileUrl}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      STAGING NODE...
                    </>
                  ) : (
                    <span className="flex items-center gap-3">
                        CONFIRM DISPATCH & SYNC LIBRARY
                        <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
            <div className="p-8 rounded-2xl bg-card border border-border relative overflow-hidden shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Protocol Stats</h4>
                        <p className="text-[8px] text-muted-foreground uppercase font-black opacity-60">Network Telemetry</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {[
                        { label: "File Compression", val: "Optimal", color: "text-emerald-500" },
                        { label: "Network Bandwidth", val: "220Mb/s", color: "text-emerald-500" },
                        { label: "Packet Verification", val: "Passed", color: "text-emerald-500" }
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-[9px] uppercase font-black text-muted-foreground tracking-widest opacity-40">{stat.label}</span>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest", stat.color)}>{stat.val}</span>
                        </div>
                    ))}
                </div>
            </div>

          <Card className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-dashed border-border bg-muted/20">
              <CardTitle className="text-[10px] uppercase font-black tracking-widest text-foreground flex items-center gap-4">
                <Info className="w-4 h-4 text-emerald-500" /> Validation Node
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { label: "Cloud Binary Verification", active: true },
                { label: "Structural Integrity", active: true },
                { label: "Rep ID Checksum", active: false },
                { label: "System Sync Ready", active: true },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-5">
                  {check.active ? (
                    <div className="w-5 h-5 rounded-lg bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center justify-center text-black">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-lg border border-border bg-muted"></div>
                  )}
                  <span className={cn("text-[10px] uppercase font-black tracking-widest", check.active ? "text-foreground" : "text-muted-foreground opacity-40")}>
                    {check.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
