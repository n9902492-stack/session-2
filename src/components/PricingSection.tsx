import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onStartFree: () => void;
}

export default function PricingSection({ onStartFree }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'free forever',
      description: 'Ideal for spontaneous meetings, quick pair programming, and peer reviews.',
      features: [
        'Up to 50 participants per room',
        'Unlimited 1-on-1 meetings',
        '1080p 60fps crystal stream',
        'AI Acoustic noise elimination',
        'Zero download web-first join',
        'End-to-end encrypted audio/video',
      ],
      cta: 'Start Free Meeting',
      popular: false,
      onClick: onStartFree,
    },
    {
      name: 'Pro Teams',
      price: billingCycle === 'annual' ? '$12' : '$15',
      period: 'per user / month',
      description: 'Built for high-cadence product teams and design sprints requiring shared canvases.',
      features: [
        'Up to 250 participants per room',
        'Unlimited meeting duration',
        'Spatial 4K screen broadcast',
        'Collaborative whiteboard canvas',
        'Cloud meeting recording & transcript',
        'Custom vanity meeting URLs',
        'Priority relay routing (<12ms)',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: true,
      onClick: onStartFree,
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'annual' ? '$28' : '$35',
      period: 'per user / month',
      description: 'Dedicated infrastructure with enterprise governance, SSO, and compliance audit.',
      features: [
        'Up to 1,000 participants per room',
        'Dedicated edge relay mesh',
        'SAML 2.0 / Okta SSO integration',
        'Custom corporate domain branding',
        'SOC2 Type II & HIPAA compliance',
        '24/7 Dedicated technical SLA',
      ],
      cta: 'Contact Architecture Team',
      popular: false,
      onClick: () => {
        alert('Thank you! Our enterprise solutions team has received your inquiry.');
      },
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ffc640]">
            Transparent Subscriptions
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Simple, predictable pricing for teams of any size.
          </h2>
          <p className="text-sm sm:text-base text-[#fed7aa]/80">
            No unexpected seat charges or hidden add-ons for HD video and noise suppression.
          </p>

          {/* Billing cycle toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-medium cursor-pointer ${
                billingCycle === 'monthly' ? 'text-white font-semibold' : 'text-[#fed7aa]/60'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly billing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
              className="w-12 h-6 rounded-full bg-white/10 p-1 border border-white/20 relative transition-colors focus:outline-none"
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#f97316] transition-transform duration-200 ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs font-medium cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'text-white font-semibold' : 'text-[#fed7aa]/60'
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              <span>Annual billing</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffc640]/20 text-[#ffc640] font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#2a170d] to-[#1a0f0a] border-2 border-[#f97316] shadow-[0_0_35px_rgba(249,115,22,0.25)]'
                  : 'bg-[#1f130d] border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#f97316] text-[#1a0f0a] text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-[#fed7aa]/70 mt-1 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                      {plan.price}
                    </span>
                    <span className="text-xs text-[#fed7aa]/60">/{plan.period}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 space-y-3">
                  <p className="text-xs uppercase font-semibold text-[#fed7aa]/80 tracking-wider">
                    Included Capabilities
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#fed7aa]/80">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#ffc640] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={plan.onClick}
                  className={`w-full py-3 rounded-full text-xs font-bold transition-all ${
                    plan.popular
                      ? 'bg-white hover:bg-[#ffdf9f] text-[#1a0f0a] shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
