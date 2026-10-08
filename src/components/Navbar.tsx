import { useState } from 'react';
import { Video, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onStartInstantMeeting: () => void;
  onOpenJoinModal: () => void;
  onOpenScheduleModal: () => void;
}

export default function Navbar({
  onStartInstantMeeting,
  onOpenJoinModal,
  onOpenScheduleModal,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#140b07]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <a
          href="#"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] rounded-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
            Solaris <span className="text-[#ffb690]">Meet</span>
          </span>
        </a>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#e0c0b1]">
          <a
            href="#capabilities"
            className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#f97316]"
          >
            Capabilities
          </a>
          <a
            href="#experience"
            className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#f97316]"
          >
            Live Demo
          </a>
          <a
            href="#security"
            className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#f97316]"
          >
            Security
          </a>
          <a
            href="#pricing"
            className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#f97316]"
          >
            Plans
          </a>
          <button
            onClick={onOpenScheduleModal}
            className="text-left hover:text-white transition-colors py-1 flex items-center gap-1"
          >
            Schedule
            <ArrowUpRight className="w-3.5 h-3.5 text-[#ffc640]" />
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenJoinModal}
            className="px-4 py-2 text-sm font-medium text-[#f5ded5] hover:text-white glass-pill hover:bg-white/10 rounded-full transition-all"
          >
            Join with Code
          </button>
          <button
            onClick={onStartInstantMeeting}
            className="px-5 py-2 text-sm font-semibold text-[#1a0f0a] bg-white hover:bg-[#ffdf9f] rounded-full transition-all shadow-[0_0_24px_rgba(251,191,36,0.35)] hover:shadow-[0_0_28px_rgba(251,191,36,0.6)] whitespace-nowrap active:scale-95"
          >
            Start Instant Meeting
          </button>
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onStartInstantMeeting}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#1a0f0a] bg-white rounded-full"
          >
            Meet Now
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#fed7aa] hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#160c07]/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 text-base font-medium text-[#e0c0b1]">
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Capabilities
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Live Demo
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Security
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white"
            >
              Plans
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenScheduleModal();
              }}
              className="text-left py-1 text-[#ffc640] flex items-center justify-between"
            >
              Schedule Meeting
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinModal();
              }}
              className="w-full py-2.5 text-sm font-medium text-center text-white glass-pill rounded-full"
            >
              Join with Code
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartInstantMeeting();
              }}
              className="w-full py-2.5 text-sm font-semibold text-center text-[#1a0f0a] bg-white rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            >
              Start Instant Meeting
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
