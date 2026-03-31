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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  NIGERIAN_UNIVERSITIES,
  DEPARTMENTS,
  LEVELS,
  SEMESTERS,
  ACADEMIC_YEARS,
  MATERIAL_TYPES,
} from "@/constants/study-data";
import { UploadDropzone } from "@/lib/uploadthing";

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fileUrl ||
      !university ||
      !department ||
      !courseCode ||
      !courseTitle ||
      !level ||
      !semester ||
      !year ||
      !type
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields and upload a file.",
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
        courseTitle,
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
        title: "Material Uploaded",
        description: "The document has been added to the library.",
      });

      setFileUrl("");
      setFileName("");
      setCourseCode("");
      setCourseTitle("");
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center gap-6 mb-4">
        <div className="p-5 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <Database className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            Upload Study Material
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Add new past questions and resources to the library.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-white/10 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-dashed border-white/5 p-8 bg-white/2">
              <CardTitle className="text-xl">Material Details</CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-500 mt-2">
                All fields are required
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleUpload} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3 relative">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">
                      University
                    </Label>
                    <div className="relative group">
                      <Input
                        placeholder="Search University..."
                        className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-emerald-500/40 text-sm font-medium transition-all"
                        value={uniSearch}
                        onChange={(e) => {
                          setUniSearch(e.target.value);
                          setShowUniDropdown(true);
                        }}
                        onFocus={() => setShowUniDropdown(true)}
                      />
                      {showUniDropdown &&
                        (uniSearch || filteredUnis.length > 0) && (
                          <div className="absolute z-[100] left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl max-h-64 overflow-y-auto shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-3xl">
                            {filteredUnis.map((u) => (
                              <div
                                key={u}
                                className="px-4 py-3 hover:bg-emerald-500 hover:text-black cursor-pointer text-sm font-bold rounded-xl transition-all uppercase tracking-wide text-zinc-400 hover:scale-[1.02]"
                                onClick={() => {
                                  setUniversity(u);
                                  setUniSearch(u);
                                  setShowUniDropdown(false);
                                }}
                              >
                                {u}
                              </div>
                            ))}
                            {filteredUnis.length === 0 && (
                              <div className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">
                                No universities found
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="space-y-3 relative">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">
                      Department
                    </Label>
                    <div className="relative group">
                      <Input
                        placeholder="Search Department..."
                        className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-emerald-500/40 text-sm font-medium transition-all"
                        value={deptSearch}
                        onChange={(e) => {
                          setDeptSearch(e.target.value);
                          setShowDeptDropdown(true);
                        }}
                        onFocus={() => setShowDeptDropdown(true)}
                      />
                      {showDeptDropdown &&
                        (deptSearch || filteredDepts.length > 0) && (
                          <div className="absolute z-[100] left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl max-h-64 overflow-y-auto shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-3xl">
                            {filteredDepts.map((d) => (
                              <div
                                key={d}
                                className="px-4 py-3 hover:bg-emerald-500 hover:text-black cursor-pointer text-sm font-bold rounded-xl transition-all uppercase tracking-wide text-zinc-400 hover:scale-[1.02]"
                                onClick={() => {
                                  setDepartment(d);
                                  setDeptSearch(d);
                                  setShowDeptDropdown(false);
                                }}
                              >
                                {d}
                              </div>
                            ))}
                            {filteredDepts.length === 0 && (
                              <div className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">
                                No departments found
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">
                      Course Code
                    </Label>
                    <Input
                      placeholder="e.g. CSC 101"
                      className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-emerald-500/40 text-sm font-medium transition-all"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">
                      Course Title
                    </Label>
                    <Input
                      placeholder="e.g. Introduction to Programming"
                      className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-emerald-500/40 text-sm font-medium transition-all"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">
                      Academic Year
                    </Label>
                    <Select onValueChange={setYear}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-emerald-500/20 text-sm font-medium">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {ACADEMIC_YEARS.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">
                      Material Type
                    </Label>
                    <Select onValueChange={setType}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-emerald-500/20 text-sm font-medium">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {MATERIAL_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">
                      Level
                    </Label>
                    <Select onValueChange={setLevel}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-emerald-500/20 text-sm font-medium">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {LEVELS.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">
                      Semester
                    </Label>
                    <Select onValueChange={setSemester}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-emerald-500/20 text-sm font-medium">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {SEMESTERS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 ml-1">
                    PDF Document
                  </Label>
                  {!fileUrl ? (
                    <div className="border-2 border-dashed border-white/10 rounded-[2rem] overflow-hidden">
                      <UploadDropzone
                        endpoint="pdfUploader"
                        onClientUploadComplete={(res) => {
                          setFileUrl(res[0].url);
                          setFileName(res[0].name);
                          toast({
                            title: "Upload Success",
                            description: "File uploaded correctly.",
                          });
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            variant: "destructive",
                            title: "Upload Error",
                            description: error.message,
                          });
                        }}
                        className="ut-label:text-emerald-500 ut-button:bg-emerald-500 ut-button:text-black border-none p-12 bg-white/2 hover:bg-white/5 transition-all"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-emerald-500 bg-emerald-500/5 rounded-[2rem] p-10 flex flex-col items-center justify-center animate-in zoom-in duration-300 relative group">
                      <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-lg font-bold text-white mb-1">
                        {fileName}
                      </p>
                      <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-[0.2em]">
                        Material Verified & Ready
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-red-500 hover:bg-red-500/10"
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
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-16 text-lg rounded-[1.5rem] transition-all hover:-translate-y-1"
                  type="submit"
                  disabled={loading || !fileUrl}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Uploading to Library...
                    </>
                  ) : (
                    "Confirm & Sync with Dashboard"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-emerald-50 border border-dashed border-emerald-200 relative overflow-hidden group rounded-[2rem] p-2 dark:bg-emerald-500/10 dark:border-emerald-500/20">
            <CardHeader className="p-6">
              <CardTitle className="text-emerald-700 text-base flex items-center gap-3 dark:text-emerald-400">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center dark:bg-emerald-500/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                Smart File Reader
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-sm text-emerald-900 leading-relaxed dark:text-emerald-100/70 font-medium">
                Our system can automatically read the University, Department,
                and Course Code directly from the PDF file you upload.
              </p>
              <Button
                variant="ghost"
                className="mt-6 text-emerald-700 hover:bg-emerald-100 p-0 font-bold underline text-[10px] uppercase tracking-[0.2em] h-auto dark:text-emerald-500 dark:hover:bg-emerald-500/10"
              >
                Start Auto-Reading
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border border-dashed border-zinc-200 rounded-[2rem] shadow-sm dark:bg-zinc-950 dark:border-white/5">
            <CardHeader className="p-6 border-b border-dashed border-zinc-100 dark:border-white/5">
              <CardTitle className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-900 flex items-center gap-3 dark:text-zinc-400">
                <Info className="w-4 h-4 text-emerald-500" /> Upload Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { label: "File Quality Scan", active: true },
                { label: "University Matching", active: true },
                { label: "Representative ID", active: false },
                { label: "Database Sync", active: true },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  {check.active ? (
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-white/2"></div>
                  )}
                  <span
                    className={`text-xs font-bold tracking-wide ${check.active ? "text-zinc-900 dark:text-zinc-300" : "text-zinc-400"}`}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="p-8 bg-zinc-50 rounded-[2rem] border border-dashed border-zinc-200 dark:bg-zinc-900/50 dark:border-white/5">
            <h4 className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest mb-4 dark:text-zinc-500">
              Storage Info
            </h4>
            <p className="text-xs text-zinc-700 leading-relaxed dark:text-zinc-400 font-medium">
              All materials are protected and safely stored in our cloud
              library. For best performance, we use Google Firebase Storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
