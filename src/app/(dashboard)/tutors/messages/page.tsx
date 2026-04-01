"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  doc,
  updateDoc
} from "firebase/firestore";
import { 
  MessageSquare, 
  User, 
  Clock, 
  Send, 
  CheckCircle2,
  Inbox,
  Search,
  Loader2
} from "lucide-react";
import { AuraCard } from "@/components/aura-ui";
import { AuraBackground } from "@/components/aura-background";
import { cn } from "@/lib/utils";

export default function ExpertMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "messages"),
      where("tutorId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filteredMessages = messages.filter(m => 
    m.senderName?.toLowerCase().includes(search.toLowerCase()) ||
    m.text?.toLowerCase().includes(search.toLowerCase())
  );

  const markAsRead = async (id: string, currentStatus: string) => {
      if (currentStatus === 'read') return;
      await updateDoc(doc(db, "messages", id), { status: 'read' });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-sky-500" /></div>;

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuraBackground />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 font-bold text-[10px] uppercase tracking-widest">
                <MessageSquare className="w-4 h-4" /> Professional Expert Inbox
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">
                    Scholar <span className="text-sky-500 italic">Signals</span>
                </h1>
                <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] opacity-60">
                    Respond to academic inquiries and scaling mentorship nodes
                </p>
            </div>
        </div>

        {/* Search */}
        <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground opacity-50" />
            <input 
                type="text"
                placeholder="Search inquiries or scholar names..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 h-14 bg-card/40 backdrop-blur-3xl border border-border rounded-2xl text-sm font-medium focus:ring-sky-500/20"
            />
        </div>

        {/* Message Feed */}
        <div className="space-y-4">
            {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
                <AuraCard 
                    key={msg.id} 
                    onClick={() => markAsRead(msg.id, msg.status)}
                    className={cn(
                        "p-8 group hover:scale-[1.01] transition-all cursor-pointer border-sky-500/0 hover:border-sky-500/10",
                        msg.status === 'unread' && "border-sky-500/20 bg-sky-500/[0.02]"
                    )}
                >
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                            <User className="w-6 h-6 text-muted-foreground opacity-40" />
                        </div>
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                                        {msg.senderName || "Unknown Scholar"}
                                        {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase opacity-60">
                                        <Clock className="w-3 h-3" /> {new Date(msg.createdAt?.toDate?.() || Date.now()).toLocaleString()}
                                    </div>
                                </div>
                                <button className="h-10 px-4 rounded-xl border border-sky-500/30 text-sky-500 text-[10px] font-black uppercase tracking-widest hover:bg-sky-500/10 transition-all flex items-center gap-2">
                                   <Send className="w-3 h-3" /> Respond
                                </button>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                                {msg.text}
                            </p>
                        </div>
                    </div>
                </AuraCard>
            )) : (
                <div className="text-center py-32 bg-sky-500/[0.02] border border-dashed border-sky-500/20 rounded-[2.5rem]">
                    <Inbox className="w-16 h-16 text-sky-500 opacity-20 mx-auto mb-6" />
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Your Expert Inbox is Silent</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
