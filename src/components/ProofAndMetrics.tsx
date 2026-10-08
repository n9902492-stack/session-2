import { Star, ShieldCheck, Check } from 'lucide-react';

export default function ProofAndMetrics() {
  const testimonials = [
    {
      name: 'Marcus Vance',
      role: 'VP of Engineering',
      org: 'HyperScale Cloud Infrastructure',
      content:
        'We migrated 450 remote engineers from Zoom to Solaris Meet. Meeting startup latency vanished, screen sharing text is razor sharp on 4K displays, and we cut dropped audio packets by 94% across our global distributed sprints.',
      metrics: '94% Reduction in Audio Dropouts',
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Product Design',
      org: 'Aura Spatial Systems',
      content:
        'Being able to launch design crit rooms without waiting for desktop updates or plugin downloads saved us hours every week. The integrated collaborative canvas feels as immediate as standing in front of a real whiteboard.',
      metrics: '3.5x Faster Meeting Initiation',
    },
  ];

  return (
    <section id="security" className="py-20 bg-[#160c07]/80 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ffc640]">
            Enterprise Evidence & Impact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Proven reliability under demanding real-time operational workloads.
          </h2>
        </div>

        {/* Quantified Metrics Band */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-[#1f130d] border border-white/10 mb-14">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums">
              &lt;15 ms
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#ffc640]">
              Global Median Latency
            </p>
            <p className="text-xs text-[#fed7aa]/60">Across 42 global edge points of presence</p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums">
              99.999%
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#ffc640]">
              Mesh Availability
            </p>
            <p className="text-xs text-[#fed7aa]/60">Zero downtime architecture</p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums">
              100%
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#ffc640]">
              Browser Native
            </p>
            <p className="text-xs text-[#fed7aa]/60">Zero desktop client installation needed</p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums">
              256-bit
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#ffc640]">
              DTLS / SRTP E2EE
            </p>
            <p className="text-xs text-[#fed7aa]/60">End-to-end encrypted media keys</p>
          </div>
        </div>

        {/* Attributable Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#1f130d] border border-white/10 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#ffc640]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm sm:text-base text-[#fed7aa]/90 leading-relaxed italic">
                  "{t.content}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-[#fed7aa]/60">
                    {t.role} · <span className="text-white/80">{t.org}</span>
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#f97316]/15 border border-[#f97316]/30 text-xs font-semibold text-[#fed7aa]">
                  {t.metrics}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
