import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Sparkles,
  ArrowRight,
  Calendar,
  Share2,
  Smile,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { getLocalMediaStream, AudioMeter } from '../utils/mediaEngine';

interface HeroProps {
  onJoinMeeting: (code: string) => void;
  onStartInstantMeeting: () => void;
  onOpenScheduleModal: () => void;
}

export default function Hero({
  onJoinMeeting,
  onStartInstantMeeting,
  onOpenScheduleModal,
}: HeroProps) {
  const [meetingInput, setMeetingInput] = useState('');
  const [inputError, setInputError] = useState('');

  // Hero interactive video preview states
  const [isHeroCamActive, setIsHeroCamActive] = useState(false);
  const [isHeroMicActive, setIsHeroMicActive] = useState(false);
  const [heroAudioLevel, setHeroAudioLevel] = useState(0);
  const [heroStream, setHeroStream] = useState<MediaStream | null>(null);
  const [heroReaction, setHeroReaction] = useState<string | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioMeterRef = useRef<AudioMeter | null>(null);

  // Active simulated speaker toggle for visual dynamism
  const [activeSpeaker, setActiveSpeaker] = useState<'sarah' | 'david' | 'you'>('sarah');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSpeaker((prev) => {
        if (prev === 'sarah') return 'david';
        if (prev === 'david') return isHeroCamActive ? 'you' : 'sarah';
        return 'sarah';
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isHeroCamActive]);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (heroStream) {
        heroStream.getTracks().forEach((t) => t.stop());
      }
      if (audioMeterRef.current) {
        audioMeterRef.current.stop();
      }
    };
  }, [heroStream]);

  const toggleHeroCamera = async () => {
    if (isHeroCamActive) {
      if (heroStream) {
        heroStream.getVideoTracks().forEach((t) => t.stop());
      }
      setIsHeroCamActive(false);
      return;
    }

    try {
      const stream = await getLocalMediaStream({ video: true, audio: isHeroMicActive });
      if (stream) {
        setHeroStream(stream);
        setIsHeroCamActive(true);
        if (heroVideoRef.current) {
          heroVideoRef.current.srcObject = stream;
          heroVideoRef.current.play().catch(() => {});
        }
      }
    } catch {
      setIsHeroCamActive(false);
    }
  };

  const toggleHeroMic = async () => {
    if (isHeroMicActive) {
      if (audioMeterRef.current) {
        audioMeterRef.current.stop();
      }
      if (heroStream) {
        heroStream.getAudioTracks().forEach((t) => t.stop());
      }
      setIsHeroMicActive(false);
      setHeroAudioLevel(0);
      return;
    }

    try {
      const stream = await getLocalMediaStream({ video: isHeroCamActive, audio: true });
      if (stream) {
        setHeroStream(stream);
        setIsHeroMicActive(true);
        audioMeterRef.current = new AudioMeter((vol) => setHeroAudioLevel(vol));
        audioMeterRef.current.attachStream(stream);
      }
    } catch {
      setIsHeroMicActive(false);
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = meetingInput.trim();
    if (!clean) {
      setInputError('Please enter a room code or invite link');
      return;
    }
    setInputError('');
    onJoinMeeting(clean);
  };

  const triggerReaction = (emoji: string) => {
    setHeroReaction(emoji);
    setTimeout(() => setHeroReaction(null), 2500);
  };

  return (
    <section className="relative pt-8 pb-20 md:pt-16 md:pb-32 overflow-hidden">
      {/* Background Solar Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[550px] bg-gradient-to-tr from-[#ea580c]/20 via-[#f97316]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#ffc640]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Direct Join Action Deck */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            {/* Ambient Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#fed7aa] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
              <span>Solaris Engine 4.0 · Sub-15ms Global Mesh</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] text-balance">
              Ultra-clarity video meetings illuminated by{' '}
              <span className="solar-gradient-text">ambient intelligence</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#fed7aa]/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Instant browser-based meetings with zero downloads. Experience spatial 4K video,
              ambient acoustic noise elimination, and real-time collaborative workspace.
            </p>

            {/* Action Console: Join & Create */}
            <div className="space-y-4 pt-2 max-w-md mx-auto lg:mx-0">
              <form onSubmit={handleJoinSubmit} className="relative flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={meetingInput}
                    onChange={(e) => {
                      setMeetingInput(e.target.value);
                      if (inputError) setInputError('');
                    }}
                    placeholder="Enter meeting code or link"
                    className="w-full h-12 pl-4 pr-10 text-sm rounded-full bg-[#20130d] border border-white/15 text-white placeholder-[#fed7aa]/40 focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/30 transition-all shadow-inner"
                  />
                  {meetingInput && (
                    <button
                      type="button"
                      onClick={() => setMeetingInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="h-12 px-6 rounded-full bg-white hover:bg-[#ffdf9f] text-[#1a0f0a] font-semibold text-sm transition-all shadow-[0_0_24px_rgba(251,191,36,0.35)] hover:shadow-[0_0_28px_rgba(251,191,36,0.6)] flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  <span>Join</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {inputError && (
                <p className="text-xs text-[#ffb4ab] text-left pl-3">{inputError}</p>
              )}

              {/* Quick actions: Start New & Schedule */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={onStartInstantMeeting}
                  className="h-11 px-5 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white font-medium text-sm transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center gap-2 active:scale-95"
                >
                  <Video className="w-4 h-4" />
                  <span>New Meeting</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenScheduleModal}
                  className="h-11 px-5 rounded-full glass-pill hover:bg-white/10 text-[#f5ded5] hover:text-white font-medium text-sm transition-all flex items-center gap-2 active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-[#ffc640]" />
                  <span>Schedule</span>
                </button>
              </div>

              {/* Instant suggested codes */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-[#fed7aa]/60 pt-1">
                <span>Try quick demo:</span>
                <button
                  type="button"
                  onClick={() => onJoinMeeting('solar-flow-901')}
                  className="underline hover:text-white transition-colors"
                >
                  solar-flow-901
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => onJoinMeeting('ember-orbit-420')}
                  className="underline hover:text-white transition-colors"
                >
                  ember-orbit-420
                </button>
              </div>
            </div>

            {/* Trust signals */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-[#fed7aa]/70 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#ffc640]" />
                Zero downloads
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#f97316]" />
                256-bit E2E Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ffc640]" />
                AI Noise Suppression
              </span>
            </div>
          </div>

          {/* Right Column: Live Interactive Video Stage Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-[#f97316]/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {/* Inner Stage Card */}
              <div className="rounded-[22px] bg-[#1a0f0a] border border-white/10 overflow-hidden relative">
                {/* Stage Header */}
                <div className="px-5 py-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#f97316] animate-pulse" />
                    <span className="text-xs font-semibold text-white tracking-wide">
                      ROOM: SOLARIS-PREVIEW
                    </span>
                    <span className="hidden sm:inline-block text-[11px] text-[#fed7aa]/50 font-mono">
                      1080p 60fps
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert('Meeting link copied to clipboard!');
                      }}
                      className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] text-[#fed7aa] font-medium flex items-center gap-1 transition-colors"
                      title="Copy meeting link"
                    >
                      <Share2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f97316]/20 text-[#fed7aa] font-medium">
                      3 Active
                    </span>
                  </div>
                </div>

                {/* Stage Video Grid Preview */}
                <div className="p-4 sm:p-5 grid grid-cols-2 gap-3 min-h-[320px] sm:min-h-[380px] bg-[#120905]">
                  {/* Participant 1: Sarah Chen */}
                  <div
                    className={`relative rounded-2xl overflow-hidden bg-[#20140e] border transition-all duration-300 ${
                      activeSpeaker === 'sarah'
                        ? 'border-[#f97316] shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#ffc640] flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg">
                        SC
                      </div>
                      <div className="absolute inset-0 bg-radial from-transparent via-[#1c110c]/40 to-[#120905]/80 pointer-events-none" />

                      {/* Active speaker wave ring */}
                      {activeSpeaker === 'sarah' && (
                        <div className="absolute inset-x-4 bottom-10 flex items-center justify-center gap-1">
                          <span className="w-1 h-3 bg-[#f97316] rounded-full animate-bounce" />
                          <span className="w-1 h-5 bg-[#ffc640] rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="w-1 h-4 bg-[#f97316] rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1 h-2 bg-[#ffc640] rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                        <span className="truncate">Sarah Chen</span>
                        <span className="text-[#ffc640] text-[9px] uppercase font-bold">Host</span>
                      </div>
                    </div>
                  </div>

                  {/* Participant 2: David Miller */}
                  <div
                    className={`relative rounded-2xl overflow-hidden bg-[#20140e] border transition-all duration-300 ${
                      activeSpeaker === 'david'
                        ? 'border-[#f97316] shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#3b2d27] to-[#804221] flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg">
                        DM
                      </div>
                      <div className="absolute inset-0 bg-radial from-transparent via-[#1c110c]/40 to-[#120905]/80 pointer-events-none" />

                      {activeSpeaker === 'david' && (
                        <div className="absolute inset-x-4 bottom-10 flex items-center justify-center gap-1">
                          <span className="w-1 h-4 bg-[#f97316] rounded-full animate-bounce" />
                          <span className="w-1 h-2 bg-[#ffc640] rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="w-1 h-5 bg-[#f97316] rounded-full animate-bounce [animation-delay:0.2s]" />
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                        <span className="truncate">David Miller</span>
                        <span className="text-white/60">Audio ON</span>
                      </div>
                    </div>
                  </div>

                  {/* Participant 3: YOU (Local Camera interactive test) */}
                  <div className="col-span-2 relative rounded-2xl overflow-hidden bg-[#180e09] border border-[#f97316]/40 min-h-[150px] sm:min-h-[170px] flex items-center justify-center">
                    {isHeroCamActive ? (
                      <video
                        ref={heroVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                    ) : (
                      <div className="text-center p-4 space-y-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#f97316]">
                          <Video className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-medium text-white">Your Camera is Off</p>
                        <p className="text-[11px] text-[#fed7aa]/60 max-w-xs mx-auto">
                          Click below to test your real camera & mic right on this landing page!
                        </p>
                      </div>
                    )}

                    {/* Floating Reaction Overlay */}
                    {heroReaction && (
                      <div className="absolute top-4 left-4 text-3xl animate-bounce z-20 bg-black/60 px-3 py-1 rounded-full border border-[#f97316]">
                        {heroReaction}
                      </div>
                    )}

                    {/* You Tag */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[11px] text-white bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <span>You (Guest Preview)</span>
                      {isHeroMicActive && (
                        <div className="flex items-center gap-0.5">
                          <span
                            className="w-1 bg-[#f97316] rounded-full transition-all"
                            style={{ height: `${Math.max(4, heroAudioLevel * 0.2)}px` }}
                          />
                          <span
                            className="w-1 bg-[#ffc640] rounded-full transition-all"
                            style={{ height: `${Math.max(4, heroAudioLevel * 0.3)}px` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Controls Bar for Landing Page Hero Stage */}
                <div className="px-5 py-3.5 bg-black/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Camera Toggle */}
                    <button
                      onClick={toggleHeroCamera}
                      className={`h-9 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                        isHeroCamActive
                          ? 'bg-[#f97316] text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                          : 'bg-white/10 hover:bg-white/15 text-white'
                      }`}
                    >
                      {isHeroCamActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                      <span>{isHeroCamActive ? 'Cam On' : 'Test Cam'}</span>
                    </button>

                    {/* Mic Toggle */}
                    <button
                      onClick={toggleHeroMic}
                      className={`h-9 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                        isHeroMicActive
                          ? 'bg-[#ffc640] text-[#1a0f0a] shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                          : 'bg-white/10 hover:bg-white/15 text-white'
                      }`}
                    >
                      {isHeroMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                      <span>{isHeroMicActive ? 'Mic Live' : 'Test Mic'}</span>
                    </button>

                    {/* Quick Reactions */}
                    <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
                      <button
                        onClick={() => triggerReaction('👏')}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-xs"
                      >
                        👏
                      </button>
                      <button
                        onClick={() => triggerReaction('🔥')}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-xs"
                      >
                        🔥
                      </button>
                      <button
                        onClick={() => triggerReaction('❤️')}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-xs"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>

                  {/* Launch Room Button */}
                  <button
                    onClick={onStartInstantMeeting}
                    className="h-9 px-4 rounded-full bg-white hover:bg-[#ffdf9f] text-[#1a0f0a] font-semibold text-xs transition-all shadow-[0_0_18px_rgba(251,191,36,0.4)] flex items-center gap-1.5 ml-auto"
                  >
                    <span>Enter Live Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
