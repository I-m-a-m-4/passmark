"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Filter, Sparkles, BookOpen, GraduationCap } from "lucide-react";
import { useState } from "react";

export default function SearchPage() {
    const [query, setQuery] = useState("");

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-headline tracking-tight">Neural Search</h1>
                <p className="text-muted-foreground">Find any material across the global university lattice.</p>
            </div>

            <div className="relative group max-w-2xl">
                <SearchIcon className="absolute left-4 top-4 h-5 w-5 text-emerald-500/50 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                    placeholder="Search courses, topics, or departments..."
                    className="pl-12 h-14 bg-card/50 backdrop-blur-sm border-white/5 shadow-xl rounded-2xl focus:ring-emerald-500/20"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 text-center py-20 bg-emerald-500/5 rounded-[2rem] border border-dashed border-emerald-500/20">
                    <SearchIcon className="h-12 w-12 text-emerald-500/20 mx-auto mb-4" />
                    <h3 className="font-bold text-xl mb-2 italic">Waiting for search signal...</h3>
                    <p className="text-muted-foreground text-sm">Enter a course code or topic above to start searching the lattice.</p>
                </div>
            </div>

            <Card className="bg-emerald-500/5 border-emerald-500/20 border-dashed rounded-[2rem] p-12 text-center max-w-3xl mx-auto">
                <Sparkles className="h-12 w-12 text-emerald-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-2xl font-bold mb-4">Neural indexing in progress...</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                    Our global university indexing protocol is currently sharding data across the decentralized scholar lattice. Full search capabilities will be online shortly.
                </p>
            </Card>
        </div>
    );
}
