"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookMarked, ShoppingBag, Folder, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookmarksPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-headline tracking-tight">Immutable Bookmarks</h1>
                <p className="text-muted-foreground">Your curated collection of academic knowledge nodes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { icon: Folder, label: "Physics II", count: 4, color: "text-blue-500" },
                    { icon: Folder, label: "Calculus", count: 12, color: "text-emerald-500" },
                    { icon: Folder, label: "History", count: 2, color: "text-purple-500" },
                    { icon: Folder, label: "New Tech", count: 0, color: "text-zinc-500" },
                ].map((folder, i) => (
                    <Card key={i} className="bg-card/30 backdrop-blur-sm border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={folder.color}>
                                <folder.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="font-bold text-sm tracking-tight">{folder.label}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{folder.count} Items</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="h-20 w-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 shadow-inner">
                    <BookMarked className="h-10 w-10 text-emerald-500/40" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-2">No bookmarks pinned yet</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                        Immutable links to your most studied materials will appear here. Pin a question from the dashboard to start your collection.
                    </p>
                </div>
                <Button className="font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8" asChild>
                    <a href="/dashboard">Explore Materials</a>
                </Button>
            </div>
        </div>
    );
}
