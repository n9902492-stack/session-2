import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Video,
  Volume2,
  Shield,
  Activity,
  Check,
  Play,
  RotateCw,
} from 'lucide-react';
import { getLocalMediaStream, AudioMeter, playTestChime } from '../utils/mediaEngine';
import { VirtualBackground } from '../types/meeting';

export default function LiveDeviceTester() {
  const [isCamActive, setIsCamActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedBg, setSelectedBg] = useState<VirtualBackground>('warm-glow');
  const [isPlayingChime, setIsPlayingChime] = useState(false);
  const [testStream, setTestStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioMeterRef = useRef<AudioMeter | null>(null);

  useEffect(() => {
    return () => {
      if (testStream) {
        testStream.getTracks().forEach((t) => t.stop());
      }
      if (audioMeterRef.current) {
        audioMeterRef.current.stop();
      }
    };
  }, [testStream]);

  const handleToggleCam = async () => {
    if (isCamActive) {
      if (testStream) {
        testStream.getVideoTracks().forEach((t) => t.stop());
      }
      setIsCamActive(false);
      return;
    }

    try {
      const stream = await getLocalMediaStream({ video: true, audio: isMicActive });
      if (stream) {
        setTestStream(stream);
        setIsCamActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }
    } catch {
      setIsCamActive(false);
    }
  };

  const handleToggleMic = async () => {
    if (isMicActive) {
      if (audioMeterRef.current) {
        audioMeterRef.current.stop();
      }
      if (testStream) {
        testStream.getAudioTracks().forEach((t) => t.stop());
      }
      setIsMicActive(false);
      setAudioLevel(0);
      return;
    }

    try {
      const stream = await getLocalMediaStream({ video: isCamActive, audio: true });
      if (stream) {
        setTestStream(stream);
        setIsMicActive(true);
        audioMeterRef.current = new AudioMeter((lvl) => setAudioLevel(lvl));
        audioMeterRef.current.attachStream(stream);
      }
    } catch {
      setIsMicActive(false);
    }
  };

  const handleTestSpeaker = async () => {
    if (isPlayingChime) return;
    setIsPlayingChime(true);
    await playTestChime();
    setIsPlayingChime(false);
  };

  return (
    <section id="experience" className="py-20 bg-[#160c07]/60 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ffc640]">
            Interactive Pre-flight Studio
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
            Test your hardware before joining any room.
          </h2>
          <p className="text-sm sm:text-base text-[#fed7aa]/70">
            Verify microphone frequency response, camera auto-framing, and acoustic speaker output directly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Camera Stage */}
          <div className="lg:col-span-7 rounded-3xl p-6 bg-[#1f130d] border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#f97316]" />
                <span className="font-semibold text-white text-sm">Video Feed Preview</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#fed7aa]/70 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>WebRTC Native Ready</span>
              </div>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#120905] border border-white/10 flex items-center justify-center">
              {isCamActive ? (
                <div className="w-full h-full relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover scale-x-[-1] ${
                      selectedBg === 'blur' ? 'filter blur-[1px]' : ''
                    }`}
                  />
                  {selectedBg === 'warm-glow' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#ea580c]/20 via-transparent to-[#ffc640]/10 pointer-events-none" />
                  )}
                  {selectedBg === 'studio-dark' && (
                    <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                  )}
                </div>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#fed7aa]/50">
                    <Video className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-white">Camera is disconnected</p>
                  <button
                    onClick={handleToggleCam}
                    className="px-5 py-2 rounded-full bg-white text-[#1a0f0a] text-xs font-semibold hover:bg-[#ffdf9f] transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  >
                    Enable Camera
                  </button>
                </div>
              )}

              {/* Status Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white font-medium flex items-center gap-2 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
                  <span>{isCamActive ? '1080p · 60 FPS · AV1' : 'Standby Mode'}</span>
                </div>

                {isCamActive && (
                  <button
                    onClick={handleToggleCam}
                    className="pointer-events-auto px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white font-medium border border-white/10 transition-colors"
                  >
                    Turn Off
                  </button>
                )}
              </div>
            </div>

            {/* Virtual Background Options */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium text-[#fed7aa]/80">Solar Virtual Ambience</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'Standard' },
                  { id: 'warm-glow', label: 'Solar Amber' },
                  { id: 'blur', label: 'Studio Blur' },
                  { id: 'studio-dark', label: 'Obsidian' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg.id as VirtualBackground)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      selectedBg === bg.id
                        ? 'border-[#f97316] bg-[#f97316]/15 text-white shadow-sm'
                        : 'border-white/10 bg-white/5 text-[#fed7aa]/70 hover:text-white'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio & Telemetry Console */}
          <div className="lg:col-span-5 space-y-6">
            {/* Microphone Meter Card */}
            <div className="rounded-3xl p-6 bg-[#1f130d] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-[#ffc640]" />
                  <span className="font-semibold text-white text-sm">Microphone Input Level</span>
                </div>
                <button
                  onClick={handleToggleMic}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    isMicActive
                      ? 'bg-[#ffc640] text-[#1a0f0a]'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isMicActive ? 'Mic Active' : 'Start Mic Test'}
                </button>
              </div>

              {/* Dynamic dB Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#fed7aa]/70">
                  <span>Input Gain: {isMicActive ? `${audioLevel}%` : 'Muted'}</span>
                  <span>{isMicActive && audioLevel > 15 ? 'Speaking Detected' : 'Quiet'}</span>
                </div>

                <div className="h-4 rounded-full bg-black/50 p-1 border border-white/10 flex items-center overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#ffc640] to-[#f97316] transition-all duration-75"
                    style={{ width: `${isMicActive ? Math.min(100, audioLevel * 1.5) : 0}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-white/30 font-mono">
                  <span>-40 dB</span>
                  <span>-20 dB</span>
                  <span>-6 dB</span>
                  <span>0 dB</span>
                </div>
              </div>
            </div>

            {/* Speaker Sound Output Test */}
            <div className="rounded-3xl p-6 bg-[#1f130d] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-[#ea580c]" />
                  <span className="font-semibold text-white text-sm">Speaker Harmonic Output</span>
                </div>
                <button
                  onClick={handleTestSpeaker}
                  disabled={isPlayingChime}
                  className="px-4 py-1.5 rounded-full bg-white hover:bg-[#ffdf9f] text-[#1a0f0a] text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isPlayingChime ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{isPlayingChime ? 'Playing...' : 'Play Test Chime'}</span>
                </button>
              </div>
              <p className="text-xs text-[#fed7aa]/70 leading-relaxed">
                Plays an acoustic harmonic test triad to ensure clarity across your headphones or stereo monitors.
              </p>
            </div>

            {/* Connection Diagnostics Card */}
            <div className="rounded-3xl p-6 bg-[#1f130d] border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#ffc640]" />
                <span className="font-semibold text-white text-sm">Real-time Connection Quality</span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[10px] text-[#fed7aa]/60 block uppercase">Latency</span>
                  <span className="text-lg font-bold text-white font-mono tabular-nums">11 ms</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[10px] text-[#fed7aa]/60 block uppercase">Packet Loss</span>
                  <span className="text-lg font-bold text-white font-mono tabular-nums">0.0 %</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[10px] text-[#fed7aa]/60 block uppercase">Encryption</span>
                  <span className="text-sm font-bold text-[#ffc640] block mt-1">E2EE DTLS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
