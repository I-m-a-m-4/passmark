"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  MessageSquare,
  Star,
  Calendar,
  Zap,
  Award,
  Video,
  ChevronRight,
  TrendingUp,
  Mail,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const engagementData = [
  { day: "Mon", sessions: 4, scholars: 12 },
  { day: "Tue", sessions: 7, scholars: 18 },
  { day: "Wed", sessions: 5, scholars: 15 },
  { day: "Thu", sessions: 9, scholars: 24 },
  { day: "Fri", sessions: 12, scholars: 35 },
  { day: "Sat", sessions: 8, scholars: 20 },
  { day: "Sun", sessions: 3, scholars: 8 },
];

export default function TutorDashboard() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    async function fetchTutor() {
      if (auth.currentUser) {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) setUserData(snap.data());
      }
    }
    fetchTutor();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
              Tutor Network Active
            </span>
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            Welcome back, {userData?.fullName?.split(" ")[0] || "Tutor"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Managing academic growth for 124 scholars in the{" "}
            {userData?.department || "General"} sector.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-12 px-6 rounded-xl border-white/10 hover:bg-white/5 font-bold text-xs uppercase tracking-widest"
          >
            <Mail className="mr-2 h-4 w-4" /> Message Scholars
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 rounded-xl shadow-xl shadow-blue-500/20">
            <Calendar className="mr-2 h-4 w-4" />
            Set Availability
          </Button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sessions",
            value: "48",
            trend: "+5 this week",
            icon: Video,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Scholar Rating",
            value: "4.9",
            trend: "Top 5%",
            icon: Star,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
          {
            label: "Next Session",
            value: "2:00 PM",
            trend: "Linear Algebra",
            icon: Clock,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Lattice Credits",
            value: "₦45,200",
            trend: "Withdrawal Ready",
            icon: Award,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-card/50 backdrop-blur-xl border-white/5 hover:border-blue-500/20 transition-all shadow-md group"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/5 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground border-none"
                >
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {stat.label}
              </p>
              <h3 className="text-3xl font-bold mt-2 group-hover:text-blue-500 transition-colors">
                {stat.value}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 bg-card/50 backdrop-blur-xl border-white/5 shadow-lg rounded-[2rem]">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between mb-8">
            <div>
              <CardTitle className="text-xl">Scholar Engagement</CardTitle>
              <CardDescription className="text-xs mt-1">
                Growth patterns across your active session network.
              </CardDescription>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl">
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] font-bold uppercase h-8 px-4 rounded-lg"
              >
                Sessions
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-blue-600 text-white text-[10px] font-bold uppercase h-8 px-4 rounded-lg shadow-lg"
              >
                Scholars
              </Button>
            </div>
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient
                    id="colorScholars"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="scholars"
                  stroke="#3B82F6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorScholars)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-white/5 shadow-lg rounded-[2rem] overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5 p-6">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </div>
              Scholar Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <div className="divide-y divide-white/5">
              {[
                {
                  user: "Blessing Obi",
                  msg: "Confused about the mid-semester CSC101 material...",
                  time: "10m ago",
                  initial: "B",
                },
                {
                  user: "Samuel Ade",
                  msg: "Are you available for a GNS group session tonight?",
                  time: "45m ago",
                  initial: "S",
                },
                {
                  user: "Kalu David",
                  msg: "Shared my chemistry lab report for review.",
                  time: "2h ago",
                  initial: "K",
                },
                {
                  user: "Favour Eniola",
                  msg: "Quick question about linear mapping.",
                  time: "5h ago",
                  initial: "F",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 hover:bg-blue-500/5 transition-all cursor-pointer group relative"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 font-bold border border-white/10 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                      {item.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {item.user}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 italic mt-1 font-light group-hover:text-zinc-300 transition-colors">
                        "{item.msg}"
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-6 border-t border-white/5 mt-auto">
            <Button
              variant="ghost"
              className="w-full text-blue-500 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-blue-500/5 h-12 rounded-xl"
            >
              Open Scholar Lattice
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
