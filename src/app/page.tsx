"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, GraduationCap, Database, Cpu, Share2, ShieldCheck, Zap, BarChart3, Clock, Lock, Layers } from "lucide-react";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const phases = [
    {
      title: "Ingestion",
      id: "PROC_01",
      desc: "Raw exam papers are sharded and processed with high-fidelity OCR for absolute legibility.",
      icon: Database,
      bg: "bg-[#f3f4f6]",
      textCol: "text-black",
      descCol: "text-gray-700"
    },
    {
      title: "Curation",
      id: "PROC_02",
      desc: "Material is verified against official course structures and campus representative signatures.",
      icon: ShieldCheck,
      bg: "bg-[#0a0a0a]",
      groupHover: "hover:bg-white/[0.04]"
    },
    {
      title: "Synthesis",
      id: "PROC_03",
      desc: "Topics are mapped onto a neural study lattice, identifying high-yield predictive patterns.",
      icon: Cpu,
      bg: "bg-[#0a0a0a]",
      groupHover: "hover:bg-white/[0.04]"
    },
    {
      title: "Verification",
      id: "PROC_04",
      desc: "Automated stress algorithms ensure zero-fault matrices before final propagation.",
      icon: Lock,
      bg: "bg-[#0a0a0a]",
      groupHover: "hover:bg-white/[0.04]"
    },
    {
      title: "Telemetry",
      id: "PROC_05",
      desc: "Live study channels stream continuous feedback loops back to the synthesis engine.",
      icon: BarChart3,
      bg: "bg-[#0a0a0a]",
      groupHover: "hover:bg-white/[0.04]"
    }
  ];

  return (
    <div className="selection:bg-emerald-500/30 selection:text-white antialiased overflow-x-hidden text-white font-sans bg-[#030303] min-h-screen" style={{ backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '48px 48px' }}>
      <Script src="https://cdn.jsdelivr.net/npm/iconify-icon@2.1.0/dist/iconify-icon.min.js" />
      
      {/* Background Grid Lines */}
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl border-x border-white/10 pointer-events-none z-0 flex justify-evenly">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-px h-full bg-white/[0.03] relative overflow-hidden">
            <div className="beam-line" style={{ animationDuration: `${3 + i * 1.5}s`, animationDelay: `${i * 0.7}s` }}></div>
            <div className="beam-line" style={{ animationDuration: `${3 + i * 1.5}s`, animationDelay: `${i * 0.7}s` }}></div>
          </div>
        ))}

        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#030303]" style={{ border: '1px solid rgba(255,255,255,0.2)' }}></div>
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#030303]" style={{ border: '1px solid rgba(255,255,255,0.2)' }}></div>
        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-[#030303]" style={{ border: '1px solid rgba(255,255,255,0.2)' }}></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-[#030303]" style={{ border: '1px solid rgba(255,255,255,0.2)' }}></div>
      </div>

      {/* Top NavBar */}
      <nav className="fixed z-50 flex w-[calc(100%-2rem)] -translate-x-1/2 max-w-4xl rounded-full p-2 top-8 left-1/2 shadow-2xl backdrop-blur-xl items-center justify-between" style={{ background: 'linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.8)) padding-box, linear-gradient(90deg, rgba(255,255,255,0.05), rgba(16,185,129,0.3), rgba(6,182,212,0.3), rgba(255,255,255,0.05)) border-box', border: '1px solid transparent' }}>
        <a href="/" className="flex items-center gap-2 pl-4 pr-2 text-white">
          <div className="w-6 h-6 rounded-md overflow-hidden bg-emerald-500 flex items-center justify-center">
             <img src="/icon.png" alt="PassMark" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-sm font-bold tracking-wide">PassMark</span>
        </a>

        <ul className="hidden md:flex items-center gap-1 text-sm text-gray-400">
          {['Lattice', 'Archives', 'Docs'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="block rounded-full px-4 py-1.5 transition-colors duration-300 hover:text-white hover:bg-white/5">{item}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 pr-1">
          <Link href="/login" className="hidden sm:block rounded-full px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white">Log in</Link>
          <Link href="/signup" className="block rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">Get Started</Link>
        </div>
      </nav>

      <main className="z-10 flex flex-col w-full relative items-center">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col w-full max-w-7xl border-white/10 border-t border-b mr-auto ml-auto pt-40 pb-12 relative items-center justify-center">
          <div className="absolute inset-0 z-0 flex w-full h-full overflow-hidden opacity-90 pointer-events-none" style={{ maskImage: 'linear-gradient(transparent 10%, black 50%, black 90%, transparent 100%)' }}></div>

          <div className="relative z-20 flex w-full max-w-4xl flex-col items-center mx-auto mt-12 py-12 px-6">
            <div className="pointer-events-none absolute top-0 left-0 h-6 w-6 border-l border-t border-white/20"></div>
            <div className="pointer-events-none absolute top-0 right-0 h-6 w-6 border-r border-t border-white/20"></div>
            <div className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b border-l border-white/20"></div>
            <div className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-r border-white/20"></div>

            <h1 className="mb-6 text-center text-5xl font-light leading-[1.1] tracking-tighter drop-shadow-2xl md:text-7xl lg:text-8xl">
              <span className="inline-block overflow-hidden pb-2">
                <span className="reveal-word font-medium text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">Academic</span>
              </span>
              <br className="hidden sm:block" />
              <span className="inline-block overflow-hidden pb-2">
                <span className="reveal-word text-white" style={{ animationDelay: '0.1s' }}>Intelligence</span>
              </span>
              <br className="hidden sm:block" />
              <span className="inline-block overflow-hidden pb-2">
                <span className="reveal-word text-white" style={{ animationDelay: '0.2s' }}>that Propels.</span>
              </span>
            </h1>

            <p className="mb-10 max-w-2xl text-center text-base leading-relaxed text-gray-400 md:text-xl text-balance">
              Verified legacy data synthesized into high-yield study lattices. Naturally grasp exam intent and elevate academic performance dynamically.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <button 
                className="relative group px-8 py-3.5 rounded-full overflow-hidden transition-all duration-500 hover:scale-105"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--x', `${x}%`);
                  e.currentTarget.style.setProperty('--y', `${y}%`);
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
                  backdropFilter: 'blur(20px)'
                } as any}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle at var(--x) var(--y), rgba(16, 185, 129, 0.4) 0%, transparent 60%)' }}></div>
                <span className="relative z-10 flex items-center gap-2 font-bold text-white">
                  Initialize Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="px-8 py-3.5 text-gray-400 font-medium flex items-center gap-2 group hover:text-white transition-colors relative overflow-hidden rounded-full border border-white/5 hover:bg-white/5">
                <div className="w-4 h-4 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                Review Process
              </button>
            </div>
          </div>
        </section>

        {/* Karaoke Text Section */}
        <section className="relative z-10 py-64 px-6 bg-[#030303] border-y border-white/5">
          <div className="max-w-4xl mx-auto">
             <h2 className="text-4xl md:text-6xl font-medium leading-[1.2] text-neutral-800 tracking-tight">
                { "Stop manually parsing blurry exam photos. PassMark's intelligent protocol extracts intent, rendering complex academic data into seamless execution flows for your study session.".split(" ").map((word, i) => (
                  <span key={i} className="transition-all duration-700 hover:text-white inline-block mr-3">
                    {word}
                  </span>
                ))}
             </h2>
          </div>
        </section>

        {/* Feature Section with Massive Typography */}
        <section className="z-10 bg-[#030303]/80 w-full max-w-7xl border-white/10 border-x py-32 px-8 relative backdrop-blur-sm">
          <div className="flex-1 flex flex-col z-10 bg-[#0a0a0a]/50 border-white/10 border relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-white/20 z-20"></div>
            <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-white/20 z-20"></div>
            <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-white/20 z-20"></div>
            <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-white/20 z-20"></div>

            <div className="flex-1 flex flex-col">
              <div className="md:p-16 lg:p-20 flex flex-col border-white/10 border-b p-8 relative justify-center min-h-[400px]">
                <div className="relative z-10 max-w-5xl">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,1)]"></span>
                    <span className="text-[10px] font-medium text-gray-400 tracking-[0.2em] uppercase">PassMark Architecture // Grid.01</span>
                    <div className="h-px w-12 bg-white/10"></div>
                  </div>

                  <h2 className="text-5xl md:text-7xl lg:text-[6rem] text-white leading-[0.85] mb-8 font-light tracking-tight split-text-down">
                    {"P A S S M A R K".split(" ").map((char, i) => (
                      <span key={i} className="char-wrap inline-block overflow-hidden align-bottom">
                         <span className="char-inner inline-block" style={{ animationDelay: `${i * 0.05}s` }}>{char === "" ? "\u00A0" : char}</span>
                      </span>
                    ))}
                    <br />
                    <span className="text-gray-500 font-light">
                      {"L A T T I C E".split(" ").map((char, i) => (
                        <span key={i} className="char-wrap inline-block overflow-hidden align-bottom">
                           <span className="char-inner inline-block" style={{ animationDelay: `${(i + 10) * 0.05}s` }}>{char === "" ? "\u00A0" : char}</span>
                        </span>
                      ))}
                    </span>
                  </h2>

                  <p className="text-gray-400 max-w-xl leading-relaxed text-lg italic">
                    Our architecture utilizes deterministic logic gates to bypass conventional study latency. Every vector is calibrated for absolute structural integrity and optimal throughput within the academic void.
                  </p>
                </div>
              </div>

              {/* Stats and Panels */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative min-h-[500px]">
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-8 md:p-16 flex flex-col justify-center gap-10 bg-[#030303]">
                  {/* Stats Cards */}
                  <div className="p-8 bg-gradient-to-b from-emerald-500 to-emerald-600 border border-emerald-400 shadow-2xl rounded-sm relative group overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                     <div className="relative z-10 flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-emerald-950/70 font-semibold">Synthesis Speed</span>
                        <h3 className="text-5xl font-medium text-emerald-950 tracking-tight mt-1">0.02<span className="text-2xl ml-1">ms</span></h3>
                        <p className="text-xs text-emerald-900 mt-3 font-medium opacity-70">Zero-point optimization achieved through strict hardwired routing protocols.</p>
                     </div>
                  </div>

                  <div className="p-8 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 shadow-2xl rounded-sm group overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                     <div className="relative z-10 flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Data Coherence</span>
                        <h3 className="text-5xl font-medium text-white tracking-tight mt-1">99.9<span className="text-2xl ml-1">%</span></h3>
                        <p className="text-xs text-gray-400 mt-3 font-normal opacity-70">Structural primitives maintain absolute stability under peak synthetic loads.</p>
                     </div>
                  </div>
                </div>

                {/* Vertical Accordion */}
                <div className="lg:col-span-8 flex flex-col lg:flex-row w-full overflow-hidden bg-[#0a0a0a]">
                  {phases.map((phase, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActivePanel(idx)}
                      className={`relative min-h-[100px] lg:min-h-0 lg:h-auto transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer border-l border-white/10 
                      ${activePanel === idx ? 'flex-[4] bg-white text-black' : 'flex-1 bg-[#0a0a0a] hover:bg-white/[0.04]'}`}
                    >
                      {activePanel !== idx ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-medium tracking-[0.3em] text-gray-500 uppercase lg:[writing-mode:vertical-rl] lg:rotate-180">
                            Phase {idx + 1} // {phase.title}
                          </span>
                        </div>
                      ) : (
                        <div className="p-8 md:p-12 h-full flex flex-col justify-between animate-in fade-in duration-700">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500">Sequence 0{idx + 1}</span>
                            <phase.icon className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h4 className="text-4xl md:text-6xl font-medium tracking-tighter mb-4 leading-none">{phase.title}</h4>
                            <p className="text-sm md:text-base text-gray-700 font-normal max-w-md leading-relaxed">{phase.desc}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-40 px-6 w-full max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Protocol Initialized</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 animate-on-scroll">Ready to synthesize?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto font-light animate-on-scroll">Access the global study lattice. Secure your academic legacy with verified intelligence.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-all shadow-xl">Join the Lattice</Link>
            <Link href="/login" className="px-10 py-4 border border-white/10 text-white font-medium rounded-full hover:bg-white/5 transition-all">Authorize Session</Link>
          </div>
        </section>
      </main>

      <footer className="z-10 bg-[#030303] border-t border-white/10 py-20 px-8 w-full">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
            <div>
              <div className="flex items-center gap-3 text-white font-bold text-xl mb-6">
                 <img src="/icon.png" alt="PassMark" className="w-6 h-6" />
                 PassMark
              </div>
              <p className="text-gray-500 max-w-xs text-sm leading-relaxed">Synthesizing the future of academic success through verified study intelligence and neural lattices.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
               <div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Network</h4>
                  <ul className="text-sm text-gray-500 space-y-4">
                     <li><a href="#" className="hover:text-emerald-500 transition-colors">Archives</a></li>
                     <li><a href="#" className="hover:text-emerald-500 transition-colors">Lattices</a></li>
                     <li><a href="#" className="hover:text-emerald-500 transition-colors">Tutors</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Company</h4>
                  <ul className="text-sm text-gray-500 space-y-4">
                     <li><a href="#" className="hover:text-emerald-500 transition-colors">About</a></li>
                     <li><a href="#" className="hover:text-emerald-500 transition-colors">Safety</a></li>
                     <li><a href="#" className="hover:text-emerald-500 transition-colors">Legal</a></li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600">
            <span>&copy; 2024 PassMark Neural Lattice</span>
            <div className="flex gap-8">
               <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500"></div> System Latency: 12ms</span>
               <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500"></div> Nodes active: 4,281</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
