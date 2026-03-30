"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Filter, Sparkles, BookOpen, GraduationCap } from "lucide-react";
import { useState } from "react";
import { AuraCard } from "@/components/aura-ui";

export default function SearchPage() {
    const [query, setQuery] = useState("");

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-headline tracking-tight text-white">Library Search</h1>
                <p className="text-gray-500">Find any study material across our global university network.</p>
            </div>

            <div className="relative group max-w-2xl">
                <SearchIcon className="absolute left-4 top-4 h-5 w-5 text-emerald-500/50 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                    placeholder="Search courses, topics, or departments..."
                    className="pl-12 h-14 bg-white/[0.03] border-white/10 shadow-xl rounded-2xl focus:ring-emerald-500/20 text-white placeholder:text-gray-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 text-center py-24 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
                    <SearchIcon className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                    <h3 className="font-bold text-xl mb-2 text-gray-400 italic font-headline">Awaiting search signal...</h3>
                    <p className="text-gray-500 text-sm">Enter a course code or topic above to explore the network.</p>
                </div>
            </div>

            <AuraCard className="bg-[#030303] p-12 text-center max-w-3xl mx-auto shadow-2xl">
                <Sparkles className="h-12 w-12 text-emerald-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-2xl font-bold mb-4 text-white font-headline">Smart indexing in progress...</h2>
                <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed italic">
                    Our university material database is currently being updated with new papers from across the network. Full search capabilities will be available shortly.
                </p>
            </AuraCard>
        </div>
    );
}
