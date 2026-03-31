"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileCheck, 
  TrendingUp, 
  Upload, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  Database,
  CreditCard,
  Cpu,
  AlertCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

const revenueData = [
  { name: "Mon", value: 45000 },
  { name: "Tue", value: 52000 },
  { name: "Wed", value: 48000 },
  { name: "Thu", value: 61000 },
  { name: "Fri", value: 55000 },
  { name: "Sat", value: 67000 },
  { name: "Sun", value: 72000 },
];

const universityData = [
  { name: "UNILAG", value: 1200 },
  { name: "UI", value: 950 },
  { name: "OAU", value: 870 },
  { name: "UNN", value: 640 },
  { name: "Others", value: 621 },
];

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#6366F1"];

export default function AdminDashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">System Overview</span>
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-2">Managing 4,281 students and 856 study materials.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-dashed border-zinc-200 dark:border-white/10 h-12 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest">
            <Database className="mr-2 h-4 w-4 text-emerald-500" />
            Sync Database
          </Button>
          <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-12 px-8 rounded-2xl shadow-sm">
            <Link href="/admin-fad/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Material
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Students", value: "4,281", trend: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Nodes", value: "12", trend: "Nigeria", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Verified Data", value: "856", trend: "99% Acc", icon: FileCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Revenue (M)", value: "₦710k", trend: "8% Growth", icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Storage Load", value: "99.9%", trend: "Optimal", icon: Cpu, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-all rounded-2xl shadow-sm group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-inner`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-500 font-bold uppercase transition-all group-hover:scale-105">
                  {stat.trend}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 group-hover:translate-x-1 transition-transform">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Overview */}
        <Card className="lg:col-span-2 p-8 bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-[2.5rem] shadow-sm overflow-hidden relative">
          <CardHeader className="px-0 pt-0 flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Revenue Overview</CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-widest text-emerald-500/60 mt-1">Transaction History</CardDescription>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              <Button variant="ghost" size="sm" className="h-9 px-6 text-[10px] font-bold uppercase rounded-lg">7D</Button>
              <Button variant="secondary" size="sm" className="h-9 px-6 text-[10px] font-bold uppercase bg-emerald-500 text-black rounded-lg shadow-sm">30D</Button>
            </div>
          </CardHeader>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 11, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 11, fontWeight: 700}} tickFormatter={(v) => `₦${v/1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#10B981', fontWeight: 800 }}
                />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Institution Distribution Pie */}
        <Card className="p-8 bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-[2.5rem] shadow-sm">
          <CardHeader className="px-0 pt-0 mb-8">
            <CardTitle className="text-2xl font-bold">University Stats</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-widest text-blue-500/60 mt-1">Student Distribution</CardDescription>
          </CardHeader>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={universityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {universityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: 'none', borderRadius: '16px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-8">
            {universityData.map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/2 hover:bg-white/5 transition-colors border border-dashed border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-xs font-bold text-zinc-500 tracking-wider ">{u.name}</span>
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{u.value} <span className="text-[10px] text-zinc-600 ml-1 uppercase">Students</span></span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 overflow-hidden rounded-[2.5rem] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-dashed border-zinc-100 dark:border-white/5 p-8 bg-white/2">
            <div>
              <CardTitle className="text-xl">Pending Approvals</CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-widest text-purple-500/60 mt-1">Requires review</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-500/5">View Queue</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-dashed divide-zinc-100 dark:divide-white/5">
              {[
                { name: 'Dr. Michael Ade', university: 'UNILAG', courses: 'CSC201, CSC302', date: '2h ago', type: 'Tutor' },
                { name: 'Prof. Sarah Obi', university: 'UI', courses: 'BIO101', date: '5h ago', initial: 'S', type: 'Tutor' },
                { name: 'Engr. David Kalu', university: 'FUTO', courses: 'MTH203', date: '1d ago', initial: 'D', type: 'Rep' },
              ].map((tutor, i) => (
                <div key={i} className="flex items-center justify-between p-8 hover:bg-white/2 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 font-bold border border-dashed border-zinc-200 dark:border-white/10 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-inner text-xl">
                      {tutor.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-lg text-zinc-900 dark:text-white">{tutor.name}</p>
                        <Badge variant="secondary" className="bg-zinc-100 dark:bg-white/5 text-[8px] border-none text-zinc-500">{tutor.type}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{tutor.university} • {tutor.courses}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] text-muted-foreground font-bold">{tutor.date}</span>
                    <Button size="sm" variant="outline" className="h-11 px-6 rounded-xl border border-dashed border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white font-bold text-[10px] uppercase tracking-widest shadow-sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-[2rem] shadow-sm flex flex-col">
          <CardHeader className="border-b border-dashed border-zinc-100 dark:border-white/5 p-8">
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-emerald-500" />
              </div>
              System Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-8 flex-1">
            {[
              { title: "Payment Anomaly", desc: "Paystack ref syncing failure.", type: "error" },
              { title: "File Failure", desc: "Rep ID: 442 uploaded unreadable PDF.", type: "warn" },
              { title: "New Request", desc: "UNIBEN teacher applied for Tutor role.", type: "info" },
              { title: "Traffic Alert", desc: "UNILAG node is seeing high demand.", type: "info" },
            ].map((alert, i) => (
              <div key={i} className={`p-5 rounded-2xl border border-dashed flex gap-4 transition-all hover:translate-x-1 ${alert.type === 'error' ? 'bg-red-500/5 border-red-500/20' : alert.type === 'warn' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${alert.type === 'error' ? 'bg-red-500' : alert.type === 'warn' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${alert.type === 'error' ? 'text-red-600' : alert.type === 'warn' ? 'text-amber-600' : 'text-emerald-600'}`}>{alert.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed font-medium">{alert.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-8 border-t border-dashed border-zinc-100 dark:border-white/5">
            <Button variant="ghost" className="w-full text-zinc-500 font-bold uppercase text-[10px] tracking-widest hover:text-white h-12 rounded-xl border border-dashed border-zinc-200 dark:border-white/5">View All Logs</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}