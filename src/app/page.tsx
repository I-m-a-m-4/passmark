"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { GraduationCap, ArrowRight, Sun, Moon, ShieldCheck, Zap, FileText, Database, Share2, Cpu, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState({ three: false, gsap: false, scroll: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scriptsLoaded.three && scriptsLoaded.gsap && scriptsLoaded.scroll && mounted) {
      init3D();
    }
  }, [scriptsLoaded, mounted]);

  const init3D = () => {
    const THREE = (window as any).THREE;
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;

    if (!THREE || !gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
      canvasContainer.style.opacity = "1";
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(theme === 'dark' ? 0x020202 : 0xffffff, 0.0016);
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 16);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const container = document.getElementById("canvas-container");
    if (container && container.children.length === 0) container.appendChild(renderer.domElement);

    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // iPhone Geometry
    const w = 3.2, h = 6.8, d = 0.35, r = 0.6;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2); shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const bodyGeo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelSegments: 6, bevelSize: 0.04, bevelThickness: 0.04 });
    bodyGeo.center();
    const bodyMat = new THREE.MeshStandardMaterial({ color: theme === 'dark' ? 0x0a0a0a : 0xf0f0f0, metalness: 0.98, roughness: 0.1 });
    const phoneBody = new THREE.Mesh(bodyGeo, bodyMat);
    phoneGroup.add(phoneBody);

    // Phone screen content
    const sCanvas = document.createElement("canvas");
    sCanvas.width = 512; sCanvas.height = 1024;
    const sCtx = sCanvas.getContext("2d")!;
    const sGrad = sCtx.createRadialGradient(256, 512, 0, 256, 512, 512);
    sGrad.addColorStop(0, "#10B981"); sGrad.addColorStop(1, "#059669");
    sCtx.fillStyle = sGrad; sCtx.fillRect(0, 0, 512, 1024);

    sCtx.shadowBlur = 40; sCtx.shadowColor = "rgba(255,255,255,0.5)";
    sCtx.font = "bold 72px Inter, sans-serif"; sCtx.fillStyle = "#ffffff"; sCtx.textAlign = "center";
    sCtx.fillText("PassMark", 256, 512);
    sCtx.font = "500 24px Inter, sans-serif"; sCtx.fillStyle = "rgba(255,255,255,0.8)";
    sCtx.fillText("SCHOLAR LATTICE", 256, 560);

    const sTex = new THREE.CanvasTexture(sCanvas);
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w - 0.15, h - 0.15),
      new THREE.MeshStandardMaterial({
        map: sTex,
        emissive: 0xffffff,
        emissiveIntensity: 0.4,
        metalness: 0.1,
        roughness: 0.1
      })
    );
    screenMesh.position.z = d / 2 + 0.01;
    phoneGroup.add(screenMesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dLight = new THREE.DirectionalLight(0xffffff, 1.5); dLight.position.set(4, 6, 10); scene.add(dLight);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      phoneGroup.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    const heroTl = gsap.timeline({ scrollTrigger: { trigger: "body", start: "top top", end: "+=400%", scrub: 1.2 } });
    heroTl.to("#hero-content", { opacity: 0, scale: 0.95, pointerEvents: "none", duration: 1 }, 0);
    heroTl.to(phoneGroup.rotation, { x: 0.15, y: 0.9, z: 0.06, duration: 2.2 }, 0);
    heroTl.to(phoneGroup.position, { x: 1.25, y: 0.0, z: 1.8, duration: 2.2 }, 0);
    heroTl.to("#popover-1", { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 0.9);
    heroTl.to("#popover-1", { opacity: 0, y: -20, duration: 0.7 }, 2.4);
    heroTl.to("#popover-2", { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 2.6);
    heroTl.to("#popover-2", { opacity: 0, y: -20, duration: 0.7 }, 4.1);

    gsap.to("#hero-atmosphere", { opacity: 1, duration: 2 });
  };

  if (!mounted) return null;

  return (
    <div className="antialiased selection:bg-emerald-500/30 selection:text-emerald-400 dark:bg-[#020202] bg-white transition-colors duration-700">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" onLoad={() => setScriptsLoaded(p => ({ ...p, three: true }))} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" onLoad={() => setScriptsLoaded(p => ({ ...p, gsap: true }))} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" onLoad={() => setScriptsLoaded(p => ({ ...p, scroll: true }))} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#020202]/70 backdrop-blur-2xl border-b border-neutral-200 dark:border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md overflow-hidden shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <img src="/icon.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-sm text-neutral-900 dark:text-white">PassMark</span>
          </div>
          <div className="hidden md:flex gap-8 text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
            <a href="#protocol" className="hover:text-emerald-500 transition-colors">Protocol</a>
            <a href="#timeline" className="hover:text-emerald-500 transition-colors">Archive</a>
            <a href="#cta" className="hover:text-emerald-500 transition-colors">Join</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-neutral-400" /> : <Moon className="w-4 h-4 text-neutral-500" />}
            </button>
            <Link href="/login" className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">Log in</Link>
            <Link href="/signup" className="px-5 py-2 text-[13px] font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full shadow-sm hover:scale-[1.02] transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* 3D Atmosphere */}
      <div id="hero-atmosphere" className="fixed inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-1000 overflow-hidden">
        <div className="atmosphere-fog absolute -inset-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_60%)] animate-[spin_20s_linear_infinite]"></div>
      </div>
      <div id="canvas-container" className="fixed inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-1000"></div>

      {/* Story Popovers */}
      <div id="story-popovers" className="fixed inset-0 pointer-events-none z-15">
        <div id="popover-1" className="popover-card opacity-0 translate-y-5 scale-95 absolute left-[15%] top-[35%] bg-white/60 dark:bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-neutral-200 dark:border-white/10 min-w-[200px] shadow-2xl transition-all">
          <div className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mb-1">Academic Integrity</div>
          <div className="font-bold text-sm text-neutral-900 dark:text-white">Verified Protocol</div>
          <div className="text-xs text-neutral-500">Admin-signed exam sharding.</div>
        </div>
        <div id="popover-2" className="popover-card opacity-0 translate-y-5 scale-95 absolute right-[15%] top-[45%] text-right bg-white/60 dark:bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-neutral-200 dark:border-white/10 min-w-[200px] shadow-2xl transition-all">
          <div className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mb-1">Speed</div>
          <div className="font-bold text-sm text-neutral-900 dark:text-white">Neural Search</div>
          <div className="text-xs text-neutral-500">Instant course sharding.</div>
        </div>
      </div>

      {/* Hero Overlay */}
      <div id="hero-content" className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="max-w-3xl mx-auto text-center px-6 mt-[-8vh]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/5 backdrop-blur-sm mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-widest">Protocol Online</span>
          </div>
          <h1 className="text-5xl md:text-[5.5rem] font-semibold tracking-tighter mb-7 leading-none text-neutral-900 dark:text-white">Academic Success.<br /><span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Synthesized.</span></h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-12 font-light">The convergence of verified academic data and intelligent study lattices.</p>
          <div className="flex gap-4 justify-center pointer-events-auto">
            <Link href="/signup" className="h-11 px-8 bg-emerald-500 text-black text-[13px] font-bold rounded-full shadow-lg flex items-center gap-2 hover:bg-emerald-400 transition-all">Start Protocol <ArrowRight className="w-3.5 h-3.5" /></Link>
            <Link href="#timeline" className="h-11 px-8 rounded-full border border-neutral-200 dark:border-white/10 text-sm font-medium flex items-center backdrop-blur-xl hover:bg-black/5 transition-all text-neutral-900 dark:text-white">Review Process</Link>
          </div>
        </div>
      </div>

      <div className="h-[300vh] relative z-1"></div>

      {/* Karaoke Text Section */}
      <section className="relative z-20 py-40 px-6 bg-white dark:bg-[#020202]">
        <div className="max-w-3xl mx-auto">
          <h2 id="karaoke-text" className="text-3xl md:text-5xl font-semibold leading-relaxed text-neutral-900 dark:text-white transition-colors duration-500">
            Stop manually parsing blurry exam photos. PassMark's intelligent protocol extracts intent, rendering complex academic data into seamless execution flows for your study session.
          </h2>
        </div>
      </section>

      {/* Chronometric Timeline Section */}
      <section id="timeline" className="relative z-20 py-40 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <h2 className="text-5xl font-semibold text-neutral-900 dark:text-white tracking-tight">Chronometric<br /><span className="text-neutral-400">Archive Process</span></h2>
            <p className="text-neutral-500 max-w-sm text-sm leading-relaxed border-l border-neutral-300 dark:border-white/10 pl-6">Watch the protocol synthesize past questions into the immutable study ledger in real-time.</p>
          </div>
          <div id="timeline-track" className="relative pl-6 md:pl-0">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-neutral-200 dark:bg-white/5 md:-translate-x-px"></div>
            <div id="timeline-fill" className="absolute left-6 md:left-1/2 top-0 w-px bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] md:-translate-x-px h-0 origin-top z-10">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_2px_rgba(16,185,129,0.9)]"></div>
            </div>
            <div className="space-y-32 py-12">
              {[
                { t: "OCR Ingestion", id: "PROC_01", d: "Raw documents are sharded and processed with high-fidelity models for legibility.", icon: Database },
                { t: "Lattice Hash", id: "PROC_02", d: "Material is verified against official course structures and campus rep signatures.", icon: Share2 },
                { t: "Neural Prop", id: "PROC_03", d: "Predictive topics are synthesized and propagated across the global network.", icon: Cpu }
              ].map((s, idx) => (
                <div key={idx} className="timeline-step opacity-20 blur-[4px] scale-[0.98] transition-all duration-700 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                  <div className={idx % 2 === 0 ? "md:text-right" : "md:order-2"}>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{s.t}</h3>
                    <div className="text-emerald-500 font-mono text-[10px] mt-1 uppercase tracking-widest">{s.id} // 12ms</div>
                    <p className="text-neutral-500 text-sm mt-4 leading-relaxed max-w-sm ml-auto">{s.d}</p>
                  </div>
                  <div className={idx % 2 === 0 ? "" : "md:order-1 flex md:justify-end"}>
                    <div className="h-32 w-72 bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center group hover:border-emerald-500/30 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-[scan_3s_linear_infinite]"></div>
                      <s.icon className="w-8 h-8 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Door Section */}
      <section id="cta" className="relative z-20">
        <div className="cta-scroll-wrapper h-[250vh] relative">
          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-white dark:bg-[#020202]">
            <div id="cta-fog" className="absolute inset-0 z-0 opacity-0 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }}></div>
            <div id="cta-door-left" className="absolute top-0 left-0 w-1/2 h-full z-20 pointer-events-none border-r border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-black/80 backdrop-blur-2xl"></div>
            <div id="cta-door-right" className="absolute top-0 right-0 w-1/2 h-full z-20 pointer-events-none border-l border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-black/80 backdrop-blur-2xl"></div>
            <div id="cta-content" className="relative z-30 opacity-0 translate-y-10 flex flex-col items-center text-center px-6 pointer-events-none transition-all duration-700">
              <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Protocol Initialized</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 dark:text-white mb-6">Ready to synthesize?</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-10 max-w-lg font-light">Initialize your academic protocol and access the global study lattice in seconds.</p>
              <div className="flex gap-4 pointer-events-auto">
                <Link href="/signup" className="h-12 px-8 bg-emerald-500 text-black font-bold rounded-full hover:scale-105 transition-all flex items-center">Join Scholar Lattice</Link>
                <Link href="/login" className="h-12 px-8 border border-neutral-200 dark:border-white/10 text-sm font-medium rounded-full flex items-center hover:bg-black/5 transition-all text-neutral-900 dark:text-white">Authorize Session</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-30 border-t border-neutral-200 dark:border-white/[0.04] py-20 px-6 bg-white dark:bg-[#020202]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 text-sm text-neutral-500">
          <div>
            <div className="flex items-center gap-2 mb-4 text-neutral-900 dark:text-white font-bold">
              <img src="/icon.png" alt="Logo" className="w-5 h-5 rounded-sm" />
              PassMark
            </div>
            <p className="max-w-xs font-light">Synthesizing the future of academic success in Nigeria.</p>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-neutral-900 dark:text-white mb-1 uppercase tracking-widest text-[10px]">Network</h4>
              <a href="#timeline" className="hover:text-emerald-500 transition-colors">Archives</a>
              <Link href="/tutors" className="hover:text-emerald-500 transition-colors">Tutors</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-neutral-900 dark:text-white mb-1 uppercase tracking-widest text-[10px]">Company</h4>
              <a href="#" className="hover:text-emerald-500 transition-colors">About</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Legal</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600">
          <span>&copy; 2024 PassMark Lattice</span>
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> System Latency: 12ms</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Nodes Online: 4,281</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        .timeline-step-active .timeline-point {
          background-color: #10B981;
          box-shadow: 0 0 0 4px #020202, 0 0 30px rgba(16,185,129,0.6);
          transform: scale(1.2);
        }
        .popover-card {
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
        (function() {
          function initTimeline() {
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
            const track = document.getElementById('timeline-track');
            const fill = document.getElementById('timeline-fill');
            const steps = document.querySelectorAll('.timeline-step');
            if(!track || !fill) return;
            gsap.to(fill, {
              height: '100%',
              ease: 'none',
              scrollTrigger: { trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: 0.5 }
            });
            steps.forEach(step => {
              gsap.to(step, {
                opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.6,
                scrollTrigger: {
                  trigger: step, start: 'top 55%', end: 'bottom 55%',
                  toggleActions: 'play reverse play reverse',
                  toggleClass: { targets: step, className: 'timeline-step-active' }
                }
              });
            });
          }

          function initCTA() {
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
            const ctaTl = gsap.timeline({
              scrollTrigger: { trigger: '.cta-scroll-wrapper', start: 'top top', end: 'bottom bottom', scrub: 1.2 }
            });
            ctaTl.to('#cta-fog', { opacity: 1, duration: 0.8 }, 0);
            ctaTl.to('#cta-door-left', { x: '-105%', duration: 1.5 }, 0.8);
            ctaTl.to('#cta-door-right', { x: '105%', duration: 1.5 }, 0.8);
            ctaTl.to('#cta-content', { opacity: 1, y: 0, duration: 1 }, 2.5);
          }

          function initKaraoke() {
            const karaokeText = document.getElementById("karaoke-text");
            if (karaokeText) {
              const words = karaokeText.innerText.split(" ");
              karaokeText.innerHTML = words.map(w => \`<span class="karaoke-word transition-all duration-500 opacity-20">\${w}</span> \`).join("");
              const spans = karaokeText.querySelectorAll("span");
              window.addEventListener("scroll", () => {
                const rect = karaokeText.getBoundingClientRect();
                const prog = Math.max(0, Math.min(1, (window.innerHeight * 0.8 - rect.top) / (window.innerHeight * 0.5)));
                const activeIdx = Math.floor(prog * spans.length);
                spans.forEach((s, i) => { s.style.opacity = i <= activeIdx ? "1" : "0.2"; });
              });
            }
          }

          const checkScripts = setInterval(() => {
            if (window.gsap && window.ScrollTrigger) {
              clearInterval(checkScripts);
              initTimeline();
              initCTA();
              initKaraoke();
            }
          }, 100);
        })();
      `}} />
    </div>
  );
}
