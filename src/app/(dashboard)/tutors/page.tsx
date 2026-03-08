"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Star, GraduationCap, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TUTORS: any[] = [];

export default function TutorsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Tutor Marketplace</h1>
        <p className="text-muted-foreground">Book sessions with verified campus scholars and academic veterans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TUTORS.map((tutor, i) => (
          <Card key={i} className="bg-card/30 backdrop-blur-sm border-white/5 hover:border-emerald-500/30 transition-all group overflow-hidden">
            <CardContent className="p-8 text-center space-y-6">
              <div className="relative inline-block">
                <div className="h-24 w-24 bg-emerald-500 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl mx-auto group-hover:rotate-6 transition-transform">
                  {tutor.image}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-zinc-950 p-1.5 rounded-full border border-emerald-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-1">{tutor.name}</h3>
                <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-[0.2em]">{tutor.expertise}</p>
              </div>

              <div className="flex items-center justify-center gap-6 border-y border-white/5 py-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-emerald-500 font-bold mb-1">
                    <Star className="h-3.5 w-3.5 fill-current" /> {tutor.rating}
                  </div>
                  <div className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">{tutor.reviews} Reviews</div>
                </div>
                <div className="w-px h-8 bg-white/5"></div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-blue-500 font-bold mb-1">
                    <MapPin className="h-3.5 w-3.5" /> {tutor.university}
                  </div>
                  <div className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">Institution</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button className="w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 shadow-lg group">
                  <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Schedule Session
                </Button>
                <Button variant="ghost" className="w-full font-bold text-muted-foreground hover:text-white rounded-xl h-12 text-xs uppercase tracking-widest">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-950 border-white/5 rounded-[2rem] p-12 text-center max-w-2xl mx-auto overflow-hidden relative">
        <div className="relative z-10">
          <Users className="h-12 w-12 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Wanna become a Verified Tutor?</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed mb-8">
            Help fellow students excel and earn while you study. Verified tutors get access to exclusive teaching tools.
          </p>
          <Button variant="outline" className="font-bold border-white/10 text-white rounded-xl h-12 px-8 uppercase text-xs tracking-[0.2em] hover:bg-white/5">
            Apply to Lattice →
          </Button>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-3xl rounded-full"></div>
      </Card>
    </div>
  );
}