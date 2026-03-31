"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    MapPin,
    TrendingUp,
    Plus,
    Search,
    MoreVertical,
    ShieldCheck,
    Building2,
    Trash2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";

interface CampusRep {
    id: string;
    fullName: string;
    university: string;
    referralCode: string;
    totalReferrals: number;
    status: 'active' | 'inactive';
}

export default function CampusRepsPage() {
    const [reps, setReps] = useState<CampusRep[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRep, setNewRep] = useState({ fullName: "", university: "", referralCode: "" });

    useEffect(() => {
        async function fetchReps() {
            const q = query(collection(db, "users"), where("role", "==", "campus_rep"));
            const querySnapshot = await getDocs(q);
            const repsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CampusRep[];
            setReps(repsData);
        }
        fetchReps();
    }, []);

    const handleAddRep = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "users"), {
                ...newRep,
                role: "campus_rep",
                status: "active",
                totalReferrals: 0,
                createdAt: serverTimestamp(),
            });
            setShowAddModal(false);
            setNewRep({ fullName: "", university: "", referralCode: "" });
            // Refresh list
        } catch (err) {
            console.error("Error adding rep:", err);
        }
    };

    const filteredReps = reps.filter(rep =>
        rep.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Campus Reps Management</h1>
                    <p className="text-muted-foreground">Monitor and manage the "door-to-door" protocol agents.</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 px-6">
                    <Plus className="mr-2 h-4 w-4" /> Recruit New Rep
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Reps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{reps.length}</div>
                        <p className="text-[10px] text-emerald-500 font-bold mt-1 tracking-wider uppercase">Protocol Active</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">On-Field Referrals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-500">
                            {reps.reduce((acc, curr) => acc + (curr.totalReferrals || 0), 0)}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1 tracking-wider uppercase">Conversion Synthesis</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Institution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-500" />
                            UNILAG
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1 tracking-wider uppercase">High Ingestion Zone</p>
                    </CardContent>
                </Card>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search by name, university or referral code..."
                    className="pl-12 h-12 bg-card/50 border-white/10 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {filteredReps.length > 0 ? filteredReps.map((rep) => (
                    <Card key={rep.id} className="group hover:border-emerald-500/30 transition-all bg-card/50 backdrop-blur-sm border-white/5 overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                            <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <Users className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-lg">{rep.fullName}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                                            {rep.status}
                                        </span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {rep.university}</span>
                                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Code: <b className="text-foreground">{rep.referralCode}</b></span>
                                    <span className="flex items-center gap-1.5 text-emerald-500"><TrendingUp className="w-3.5 h-3.5" /> {rep.totalReferrals || 0} Referrals</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                )) : (
                    <div className="text-center py-20 bg-card/20 rounded-[2rem] border-2 border-dashed border-white/5">
                        <p className="text-muted-foreground">No campus reps found in the registry.</p>
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <Card className="w-full max-w-md bg-zinc-950 border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle>Recruit Protocol Agent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddRep} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                                    <Input
                                        required
                                        value={newRep.fullName}
                                        onChange={(e) => setNewRep({ ...newRep, fullName: e.target.value })}
                                        placeholder="Enter full name"
                                        className="bg-zinc-900 border-white/5 h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">University</label>
                                    <Input
                                        required
                                        value={newRep.university}
                                        onChange={(e) => setNewRep({ ...newRep, university: e.target.value })}
                                        placeholder="e.g. UNILAG"
                                        className="bg-zinc-900 border-white/5 h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Referral Code</label>
                                    <Input
                                        required
                                        value={newRep.referralCode}
                                        onChange={(e) => setNewRep({ ...newRep, referralCode: e.target.value })}
                                        placeholder="REP001"
                                        className="bg-zinc-900 border-white/5 h-12"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
                                    <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">Initialize Rep</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
