import { Video, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#120905] py-14 text-xs text-[#fed7aa]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-white">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Solaris <span className="text-[#ffb690]">Meet</span>
              </span>
            </div>
            <p className="text-xs text-[#fed7aa]/70 max-w-sm leading-relaxed">
              Ultra-clarity video conferencing platform powered by ambient intelligence and low-latency WebRTC mesh architecture.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#ffc640]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational · WebRTC Mesh Global</span>
            </div>
          </div>

          {/* Nav column 1 */}
          <div className="space-y-3">
            <p className="font-semibold text-white uppercase text-[11px] tracking-wider">Product</p>
            <ul className="space-y-2">
              <li><a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a></li>
              <li><a href="#experience" className="hover:text-white transition-colors">Hardware Tester</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security Architecture</a></li>
            </ul>
          </div>

          {/* Nav column 2 */}
          <div className="space-y-3">
            <p className="font-semibold text-white uppercase text-[11px] tracking-wider">Features</p>
            <ul className="space-y-2">
              <li><span className="text-white/80">4K Screen Share</span></li>
              <li><span className="text-white/80">Spatial Noise Removal</span></li>
              <li><span className="text-white/80">Live Whiteboard</span></li>
              <li><span className="text-white/80">Multi-Peer Chat</span></li>
            </ul>
          </div>

          {/* Nav column 3 */}
          <div className="space-y-3">
            <p className="font-semibold text-white uppercase text-[11px] tracking-wider">Compliance</p>
            <ul className="space-y-2">
              <li><span className="text-white/80">SOC2 Type II</span></li>
              <li><span className="text-white/80">GDPR Compliant</span></li>
              <li><span className="text-white/80">HIPAA BAA Ready</span></li>
              <li><span className="text-white/80">256-bit SRTP E2EE</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Solaris Meet Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
