"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  MoreVertical,
  ShieldCheck,
  GraduationCap,
  Mail,
  Calendar,
  Filter,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { format } from "date-fns";

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "tutor" | "admin" | "campus_rep";
  university?: string;
  department?: string;
  createdAt?: any;
  subscriptionStatus?: string;
}

export default function StudentRegistryPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        let q = query(usersRef, orderBy("createdAt", "desc"), limit(100));

        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserData[];

        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.university?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-dashed border-blue-500/20 shadow-sm">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
              Student Network
            </span>
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            Student Registry
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Managing {users.length} active students and users.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-2xl shadow-sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: users.length,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Active Tutors",
            value: users.filter((u) => u.role === "tutor").length,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Campus Reps",
            value: users.filter((u) => u.role === "campus_rep").length,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "Premium Members",
            value: users.filter((u) => u.subscriptionStatus === "pro").length,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-2xl shadow-sm"
          >
            <CardContent className="pt-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Search students by name, email or university..."
            className="pl-12 h-12 bg-card/50 border border-dashed border-zinc-200 dark:border-white/5 rounded-2xl focus:border-blue-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["all", "student", "tutor", "campus_rep", "admin"].map((role) => (
            <Button
              key={role}
              variant={roleFilter === role ? "secondary" : "outline"}
              onClick={() => setRoleFilter(role)}
              className={
                roleFilter === role
                  ? "bg-blue-500 text-white font-bold h-12 rounded-xl px-6 min-w-[80px]"
                  : "h-12 border-dashed border-zinc-200 dark:border-white/5 font-bold uppercase text-[9px] tracking-widest rounded-xl px-6 min-w-[80px] dark:text-zinc-400"
              }
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border border-dashed border-zinc-200 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto text-zinc-900 dark:text-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-white/2 border-b border-dashed border-zinc-100 dark:border-white/5">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500">
                    Student Info
                  </th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500">
                    University
                  </th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500">
                    Account Type
                  </th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500">
                    Joined Date
                  </th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-zinc-100 dark:divide-white/5 font-medium">
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td
                            colSpan={5}
                            className="p-10 text-center text-zinc-400"
                          >
                            Loading student data...
                          </td>
                        </tr>
                      ))
                  : filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-zinc-50 dark:hover:bg-white/2 transition-colors group"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-xl font-bold text-zinc-900 dark:text-zinc-400 border border-dashed border-zinc-200 dark:border-white/5 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                              {user.fullName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-zinc-900 dark:text-white">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" /> {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          {user.university ? (
                            <div>
                              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-300">
                                {user.university}
                              </p>
                              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">
                                {user.department}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              Not Provided
                            </span>
                          )}
                        </td>
                        <td className="p-6">
                          <Badge
                            variant="outline"
                            className={`text-[9px] font-bold uppercase tracking-widest border border-dashed px-2.5 py-1 ${
                              user.role === "admin"
                                ? "bg-red-500/5 text-red-500 border-red-500/20"
                                : user.role === "tutor"
                                  ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                                  : user.role === "campus_rep"
                                    ? "bg-purple-500/5 text-purple-500 border-purple-500/20"
                                    : "bg-blue-500/5 text-blue-500 border-blue-500/20"
                            }`}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-4 h-4 text-zinc-400" />
                            {user.createdAt
                              ? format(user.createdAt.toDate(), "MMM dd, yyyy")
                              : "N/A"}
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 border border-dashed border-zinc-200 dark:border-white/5 hover:bg-blue-600 hover:text-white transition-all rounded-xl shadow-sm"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && !loading && (
            <div className="p-20 text-center">
              <p className="text-muted-foreground font-medium">
                No students found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
