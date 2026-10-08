import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do meeting participants need to install software or register an account?',
      a: 'No. Solaris Meet operates purely on standard modern WebRTC. Guests simply click an invite link or enter a room code on any desktop or mobile browser (Chrome, Safari, Firefox, Edge) to join with full video and microphone support in under two seconds.',
    },
    {
      q: 'How does the ambient AI noise suppression work?',
      a: 'Our neural acoustic model runs directly in the WebAssembly audio pipeline on your device. It analyzes audio frequencies in 10-millisecond windows, separating human vocal cords from stationary and transient noise like keyboard typing, barking, street traffic, and air conditioning.',
    },
    {
      q: 'Can multiple people join the same room code simultaneously?',
      a: 'Yes. Every room code functions as a persistent or on-demand meeting room. You can share your link or room code with colleagues across different tabs, devices, or remote locations to join the same conference.',
    },
    {
      q: 'Is screen sharing supported on both desktop and mobile devices?',
      a: 'Desktop users can share individual browser tabs, specific desktop application windows, or entire multi-monitor setups at up to 60fps. Mobile users can view presentations with pinch-to-zoom fidelity, and mobile devices that support display capture can broadcast their screen as well.',
    },
    {
      q: 'How is audio and video data secured?',
      a: 'All audio, video, and screen sharing streams are encrypted end-to-end using DTLS and SRTP with AES-256 cipher suites. Media travels directly peer-to-peer or via ephemeral encrypted relays without being recorded or stored unless the host explicitly turns on meeting recording.',
    },
  ];

  return (
    <section className="py-20 bg-[#160c07]/60 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ffc640]">
            Frequently Asked Questions
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Everything you need to know about Solaris Meet
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#1f130d] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:text-[#ffc640] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#fed7aa]/60 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-[#f97316]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#fed7aa]/75 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
