import { Cpu, ShieldCheck, Zap, MonitorUp, Radio, Users2 } from 'lucide-react';

export default function CapabilitiesBento() {
  return (
    <section id="capabilities" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ffc640]">
            Core Platform Architecture
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight text-balance">
            Engineered for high-velocity teams who demand optical clarity.
          </h2>
          <p className="text-base text-[#fed7aa]/80 leading-relaxed">
            Eliminating meeting friction at the protocol level. No desktop client installations,
            no delayed invites, and zero stutter during high-density presentations.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 4K Spatial Mesh (Spans 2 cols) */}
          <div className="md:col-span-2 rounded-3xl p-8 bg-[#1f130d] border border-white/10 hover:border-[#f97316]/40 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center text-[#f97316]">
                <Radio className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-semibold text-[#ffc640] tracking-wider uppercase">
                  01. Distributed Protocol
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Sub-15ms Spatial Video & AV1 Neural Encoding
                </h3>
                <p className="text-sm text-[#fed7aa]/75 mt-2 leading-relaxed max-w-xl">
                  Dynamic bitrate adaptation with intelligent mesh routing selects the optimal edge node in real time. AV1 codec compression delivers crisp 1080p and 4K visual fidelity using 40% less bandwidth than legacy platforms.
                </p>
              </div>

              {/* Visual Telemetry Metric Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-2xl font-bold text-white font-mono tabular-nums">99.999%</span>
                  <p className="text-xs text-[#fed7aa]/60 mt-0.5">SLA Global Reliability</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-[#ffc640] font-mono tabular-nums">&lt;14 ms</span>
                  <p className="text-xs text-[#fed7aa]/60 mt-0.5">Edge P2P Latency</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white font-mono tabular-nums">60 FPS</span>
                  <p className="text-xs text-[#fed7aa]/60 mt-0.5">Fluid Screen Transmission</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Acoustic Isolation */}
          <div className="rounded-3xl p-8 bg-[#1f130d] border border-white/10 hover:border-[#f97316]/40 transition-all duration-300 relative overflow-hidden">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#ffc640]/15 border border-[#ffc640]/30 flex items-center justify-center text-[#ffc640]">
                <Cpu className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-semibold text-[#ffc640] tracking-wider uppercase">
                  02. Acoustic Intelligence
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Deep Neural Noise Cancellation
                </h3>
                <p className="text-sm text-[#fed7aa]/75 mt-2 leading-relaxed">
                  Real-time spectral filtering strips dog barking, mechanical keyboards, coffee shop clatter, and ambient room reverberation while keeping human vocal timbre warm and resonant.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs text-[#fed7aa]/80">
                  <span>Background Isolation</span>
                  <span className="text-[#ffc640] font-mono font-bold">-48 dB</span>
                </div>
                <div className="h-2 rounded-full bg-black/80 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ea580c] to-[#ffc640] w-[92%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Instant Zero-Friction WebRTC */}
          <div className="rounded-3xl p-8 bg-[#1f130d] border border-white/10 hover:border-[#f97316]/40 transition-all duration-300 relative overflow-hidden">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#ea580c]/15 border border-[#ea580c]/30 flex items-center justify-center text-[#ea580c]">
                <Zap className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-semibold text-[#ffc640] tracking-wider uppercase">
                  03. Frictionless Access
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  1-Click Direct Browser Entrance
                </h3>
                <p className="text-sm text-[#fed7aa]/75 mt-2 leading-relaxed">
                  Guests join instantly with zero software installations, zero extension downloads, and no account barriers. Share a link, click, and join directly in Chrome, Safari, Firefox, or Edge.
                </p>
              </div>

              <div className="pt-2 text-xs text-[#fed7aa]/60 space-y-1">
                <p>· Native WebRTC 1.0 specification</p>
                <p>· Mobile Safari & Chrome parity</p>
                <p>· Zero privilege escalation prompts</p>
              </div>
            </div>
          </div>

          {/* Card 4: Collaborative Workspace Canvas (Spans 2 cols) */}
          <div className="md:col-span-2 rounded-3xl p-8 bg-[#1f130d] border border-white/10 hover:border-[#f97316]/40 transition-all duration-300 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center text-[#f97316]">
                <MonitorUp className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-semibold text-[#ffc640] tracking-wider uppercase">
                  04. Synchronous Co-Presence
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Integrated Whiteboard & Low-Latency Screen Share
                </h3>
                <p className="text-sm text-[#fed7aa]/75 mt-2 leading-relaxed max-w-xl">
                  Share single application windows or complete 4K desktop displays with crystal text legibility. Draw synchronously on an in-meeting canvas with your team while preserving simultaneous video streams.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 text-xs">
                <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#fed7aa]">
                  60 FPS Screen Casting
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#fed7aa]">
                  Multi-cursor Collaborative Scratchpad
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#fed7aa]">
                  Live Stream Emoji Reactions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
