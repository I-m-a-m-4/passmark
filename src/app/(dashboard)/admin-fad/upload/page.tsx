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
            <div className="p-5 rounded-[2.5rem] bg-emerald-500 shadow-2xl shadow-emerald-500/20 text-black border border-emerald-400">
            <CloudUpload className="w-8 h-8" />
            </div>
            <div>
            <h1 className="text-4xl font-bold font-headline tracking-tighter">Production Upload</h1>
            <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Material Node: Operational
            </p>
            </div>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active System</p>
                <p className="text-xs font-bold text-white uppercase tracking-wider">PassMark Network V1.2</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <Zap className="w-5 h-5 fill-current" />
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="bg-card/50 backdrop-blur-3xl border border-dashed border-zinc-200 dark:border-white/5 shadow-2xl rounded-[3rem] overflow-hidden relative">
            <CardHeader className="border-b border-dashed border-zinc-100 dark:border-white/5 p-10 bg-white/2">
              <CardTitle className="text-2xl font-bold font-headline">Material Metadata</CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-widest text-emerald-500/60 mt-2">Initialize document structural nodes</CardDescription>
            </CardHeader>
            <CardContent className="p-12">
              <form onSubmit={handleUpload} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4 relative">
                    <Label className="text-[11px] uppercase font-bold tracking-[0.3em] text-zinc-500 ml-1">University Location</Label>
                    <div className="relative group">
                      <Input
                        placeholder="Search Institution..."
                        className="bg-white/5 border-white/10 h-16 rounded-2xl px-6 focus:border-emerald-500/40 text-sm font-bold transition-all placeholder:text-zinc-600 dark:text-white"
                        value={uniSearch}
                        onChange={(e) => {
                          setUniSearch(e.target.value);
                          setShowUniDropdown(true);
                        }}
                        onFocus={() => setShowUniDropdown(true)}
                      />
                      {showUniDropdown && (uniSearch || filteredUnis.length > 0) && (
                        <div className="absolute z-[100] left-0 right-0 mt-3 bg-zinc-950/95 border border-white/10 rounded-2xl max-h-72 overflow-y-auto shadow-[0_32px_64px_rgba(0,0,0,0.5)] p-2 space-y-1 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl ring-1 ring-white/10">
                          {filteredUnis.map((u) => (
                            <div 
                              key={u} 
                              className="px-6 py-4 hover:bg-emerald-500 hover:text-black cursor-pointer text-[11px] font-bold rounded-xl transition-all uppercase tracking-[0.1em] text-zinc-400 hover:scale-[1.01]"
                              onClick={() => {
                                setUniversity(u);
                                setUniSearch(u);
                                setShowUniDropdown(false);
                              }}
                            >
                              {u}
                            </div>
                          ))}
                          {filteredUnis.length === 0 && <div className="p-6 text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] text-center italic">Node not matching</div>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 relative">
                    <Label className="text-[11px] uppercase font-bold tracking-[0.3em] text-zinc-500 ml-1">Department Node</Label>
                    <div className="relative group">
                      <Input
                        placeholder="Search Department..."
                        className="bg-white/5 border-white/10 h-16 rounded-2xl px-6 focus:border-emerald-500/40 text-sm font-bold transition-all placeholder:text-zinc-600 dark:text-white"
                        value={deptSearch}
                        onChange={(e) => {
                          setDeptSearch(e.target.value);
                          setShowDeptDropdown(true);
                        }}
                        onFocus={() => setShowDeptDropdown(true)}
                      />
                      {showDeptDropdown && (deptSearch || filteredDepts.length > 0) && (
                        <div className="absolute z-[100] left-0 right-0 mt-3 bg-zinc-950/95 border border-white/10 rounded-2xl max-h-72 overflow-y-auto shadow-[0_32px_64px_rgba(0,0,0,0.5)] p-2 space-y-1 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl ring-1 ring-white/10">
                          {filteredDepts.map((d) => (
                            <div 
                              key={d} 
                              className="px-6 py-4 hover:bg-emerald-500 hover:text-black cursor-pointer text-[11px] font-bold rounded-xl transition-all uppercase tracking-[0.1em] text-zinc-400 hover:scale-[1.01]"
                              onClick={() => {
                                setDepartment(d);
                                setDeptSearch(d);
                                setShowDeptDropdown(false);
                              }}
                            >
                              {d}
                            </div>
                          ))}
                          {filteredDepts.length === 0 && <div className="p-6 text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] text-center italic">Direct input detected</div>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-[11px] uppercase font-bold tracking-[0.3em] text-zinc-500 ml-1">System Course Code</Label>
                    <Input
                      placeholder="e.g. CSC101"
                      className="bg-white/5 border-white/10 h-16 rounded-2xl px-6 focus:border-emerald-500/40 text-sm font-bold transition-all dark:text-white uppercase tracking-widest px-8"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[11px] uppercase font-bold tracking-[0.3em] text-zinc-500 ml-1 leading-relaxed">System Course Title <span className="text-zinc-600 ml-2 font-medium tracking-normal opacity-50">(Optional)</span></Label>
                    <Input
                      placeholder="e.g. Introduction to Physics"
                      className="bg-white/5 border-white/10 h-16 rounded-2xl px-6 focus:border-emerald-500/40 text-sm font-medium transition-all"
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
                      <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600 ml-1">{field.label}</Label>
                      <Select onValueChange={field.set}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-xl px-4 focus:ring-emerald-500/20 text-xs font-bold uppercase tracking-widest text-zinc-400">
                          <SelectValue placeholder="---" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white font-bold uppercase text-[9px] tracking-widest">
                          {field.data.map(d => <SelectItem key={d} value={d} className="focus:bg-emerald-500 focus:text-black">{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 pt-6">
                  <Label className="text-[11px] uppercase font-bold tracking-[0.3em] text-zinc-500 ml-2">Secure PDF Transmission</Label>
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
                                "border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-[2.5rem] bg-white/2 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all min-h-[280px] flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden",
                                isUploadingFile && "pointer-events-none border-emerald-500/40 bg-emerald-500/5"
                            )}
                        >
                            {isUploadingFile ? (
                                <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <p className="text-xl font-bold text-emerald-500">{uploadProgress}%</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white uppercase tracking-widest mb-1">Broadcasting Node...</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Encrypting structural binary</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-24 h-24 rounded-3xl bg-zinc-950 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-2xl relative z-10">
                                        <FileUp className="w-10 h-10" />
                                    </div>
                                    <div className="text-center relative z-10 px-10">
                                        <p className="text-xl font-bold dark:text-white uppercase tracking-[0.1em] mb-2">Initialize Selection</p>
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-sm mx-auto">
                                            Auto-upload starts immediately after selection. <br/>Supports verified PDF nodes up to 32MB.
                                        </p>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 py-4 bg-zinc-100 dark:bg-white/2 text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-500 border-t border-dashed border-white/5">
                                        Secure Transfer Active
                                    </div>
                                </>
                            )}
                        </label>
                    </div>
                  ) : (
                    <div className="border-2 border-emerald-500/50 bg-emerald-500/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center animate-in zoom-in duration-500 relative group overflow-hidden">
                      <div className="absolute inset-0 bg-emerald-500/5 blur-3xl opacity-50"></div>
                      <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.4)] relative z-10">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                      </div>
                      <div className="text-center relative z-10">
                        <p className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                            {fileName}
                        </p>
                        <p className="text-[11px] text-emerald-500 uppercase font-black tracking-[0.4em] mb-6">
                            Verified Protocol Ready
                        </p>
                        <div className="flex items-center gap-3 bg-black/40 px-6 py-2 rounded-full border border-white/10">
                            <Zap className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Node Sync Complete</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-6 right-6 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 h-12 w-12 rounded-2xl"
                        onClick={() => {
                          setFileUrl("");
                          setFileName("");
                        }}
                      >
                        <Trash2 className="h-6 w-6" />
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black h-20 text-xl rounded-3xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-10 shadow-2xl shadow-emerald-500/20 group"
                  type="submit"
                  disabled={loading || !fileUrl}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-4 h-8 w-8 animate-spin" />
                      STAGING NODE...
                    </>
                  ) : (
                    <span className="flex items-center gap-4">
                        CONFIRM DISPATCH & SYNC LIBRARY
                        <Zap className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Protocol Stats</h4>
                        <p className="text-[9px] text-zinc-500 uppercase font-medium">Network Telemetry</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {[
                        { label: "File Compression", val: "Optimal", color: "text-emerald-500" },
                        { label: "Network Bandwidth", val: "220Mb/s", color: "text-emerald-500" },
                        { label: "Packet Verification", val: "Passed", color: "text-emerald-500" }
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center justify-between py-1 rounded-lg">
                            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{stat.label}</span>
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", stat.color)}>{stat.val}</span>
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-0 right-0 p-4 opacity-10">
                    <CloudUpload className="w-24 h-24 rotate-12" />
                </div>
            </div>

          <Card className="bg-white border border-dashed border-zinc-200 rounded-[2.5rem] shadow-sm dark:bg-zinc-950 dark:border-white/5 overflow-hidden">
            <CardHeader className="p-8 border-b border-dashed border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/2">
              <CardTitle className="text-[11px] uppercase font-black tracking-widest text-zinc-900 flex items-center gap-3 dark:text-zinc-400">
                <Info className="w-4 h-4 text-emerald-500" /> Validation Node
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              {[
                { label: "Cloud Binary Verification", active: true },
                { label: "Structural Integrity", active: true },
                { label: "Rep ID Checksum", active: false },
                { label: "System Sync Ready", active: true },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
                  {check.active ? (
                    <div className="w-6 h-6 rounded-xl bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-black" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-white/2"></div>
                  )}
                  <span
                    className={`text-[10px] uppercase font-black tracking-widest ${check.active ? "text-zinc-900 dark:text-zinc-300" : "text-zinc-500"}`}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-white/5 relative group overflow-hidden">
            <div className="relative z-10">
                <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">
                Transmission Node
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-bold tracking-tight mb-4 group-hover:text-zinc-400 transition-colors uppercase">
                All transmissions are encrypted. Binary streams are dispatched to the nearest available data node.
                </p>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">End-to-End Secure</span>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] -mr-8 -mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
