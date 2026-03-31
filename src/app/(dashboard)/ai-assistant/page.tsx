"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Sparkles,
  Brain,
  Cpu,
  MessageSquare,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIAssistantPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          AI Predictor
        </h1>
        <p className="text-muted-foreground">
          Predictive examination analysis and neural study assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-gradient-to-br from-emerald-900/20 to-zinc-900 border-emerald-500/20 rounded-[2rem] overflow-hidden relative border">
            <div className="absolute top-0 right-0 p-8">
              <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-400/20">
                Protocol Active
              </div>
            </div>
            <CardContent className="p-10 space-y-6">
              <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
                <Cpu className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-3xl font-bold">Lattice-Neural Engine</h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl">
                Ask questions about any course material. Our AI will analyze
                past patterns to predict potential examination topics with up to
                85% accuracy.
              </p>
              <div className="flex flex-col gap-4 max-w-lg pt-4">
                <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5 text-sm text-zinc-400 font-medium">
                  "Analyze the frequency of 1st-year Physics optics questions
                  from 2018-2023 at OAU."
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5 text-sm text-zinc-400 font-medium">
                  "Summarize the key themes in CSC 201 Data Structures and
                  Algorithms."
                </div>
              </div>
              <Button className="font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-14 px-10 shadow-lg mt-4 group">
                <MessageSquare className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />{" "}
                Start New Session
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-950 border-white/5 rounded-[2rem] overflow-hidden p-8">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6">
              Real-time Insights
            </h3>
            <div className="space-y-6">
              {[
                {
                  icon: Zap,
                  label: "Real-time Synthesis",
                  status: "Enabled",
                  color: "text-emerald-500",
                },
                {
                  icon: ShieldCheck,
                  label: "Verification Ledger",
                  status: "Active",
                  color: "text-blue-500",
                },
                {
                  icon: Brain,
                  label: "Cognitive Load",
                  status: "Normal",
                  color: "text-purple-500",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-xs font-bold text-zinc-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-emerald-500/10 border-emerald-500/20 rounded-[2rem] p-8 space-y-4">
            <div className="bg-emerald-500 p-3 w-fit rounded-xl mb-2">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <h4 className="font-bold text-lg">Pro Access Required</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Predictive topic analysis requires a Scholar Gold subscription to
              access advanced neural weights.
            </p>
            <Button
              variant="link"
              className="p-0 text-emerald-500 font-bold uppercase text-[10px] tracking-widest hover:text-emerald-400 transition-colors h-auto"
            >
              Upgrade Subscription →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
