import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  X,
  Volume2,
} from 'lucide-react';
import { getLocalMediaStream, AudioMeter } from '../utils/mediaEngine';
import { VirtualBackground } from '../types/meeting';

interface PreJoinModalProps {
  roomCode: string;
  onJoin: (options: {
    displayName: string;
    isMuted: boolean;
    isCameraOff: boolean;
    stream: MediaStream | null;
    virtualBackground: VirtualBackground;
  }) => void;
  onCancel: () => void;
}

export default function PreJoinModal({ roomCode, onJoin, onCancel }: PreJoinModalProps) {
  const [displayName, setDisplayName] = useState(() => {
    return localStorage.getItem('solaris_user_name') || 'Guest Participant';
  });
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [virtualBg, setVirtualBg] = useState<VirtualBackground>('warm-glow');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioMeterRef = useRef<AudioMeter | null>(null);

  // Initialize camera and mic for pre-join green room
  useEffect(() => {
    let active = true;

    async function initMedia() {
      try {
        const mediaStream = await getLocalMediaStream({ video: true, audio: true });
        if (!active) {
          mediaStream?.getTracks().forEach((t) => t.stop());
          return;
        }
        if (mediaStream) {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(() => {});
          }

          audioMeterRef.current = new AudioMeter((level) => {
            if (active) setAudioLevel(level);
          });
          audioMeterRef.current.attachStream(mediaStream);
        }
      } catch (err) {
        console.warn('PreJoin media error', err);
      }
    }

    initMedia();

    return () => {
      active = false;
      if (audioMeterRef.current) {
        audioMeterRef.current.stop();
      }
    };
  }, []);

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isCameraOff;
      }
    }
    setIsCameraOff(!isCameraOff);
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
      }
    }
    setIsMuted(!isMuted);
  };

  const handleJoinClick = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = displayName.trim() || 'Participant';
    localStorage.setItem('solaris_user_name', finalName);

    onJoin({
      displayName: finalName,
      isMuted,
      isCameraOff,
      stream,
      virtualBackground: virtualBg,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#1c110c] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to join?</h3>
            <p className="text-xs text-[#fed7aa]/70 mt-0.5">
              Room: <span className="font-mono text-white font-semibold">{roomCode}</span>
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview & Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Video Preview Box */}
          <div className="sm:col-span-7 relative aspect-video rounded-2xl overflow-hidden bg-[#120905] border border-white/15 flex items-center justify-center">
            {stream && !isCameraOff ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover scale-x-[-1] ${
                  virtualBg === 'blur' ? 'filter blur-[1px]' : ''
                }`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#fed7aa]/40">
                  <VideoOff className="w-8 h-8" />
                </div>
                <p className="text-xs font-semibold text-white">Camera is off</p>
              </div>
            )}

            {/* Bottom Floating Cam/Mic Toggles */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <button
                type="button"
                onClick={toggleMic}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isMuted
                    ? 'bg-rose-500/80 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isCameraOff
                    ? 'bg-rose-500/80 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
              >
                {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>
            </div>

            {/* Audio Indicator */}
            {!isMuted && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white">
                <span
                  className="w-1.5 h-3 bg-[#f97316] rounded-full transition-all"
                  style={{ height: `${Math.max(4, audioLevel * 0.3)}px` }}
                />
                <span>Mic live</span>
              </div>
            )}
          </div>

          {/* Form and Join Action */}
          <div className="sm:col-span-5 space-y-4">
            <form onSubmit={handleJoinClick} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Your Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-11 px-4 rounded-xl bg-[#120905] border border-white/15 text-white text-sm focus:outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Ambience Filter
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setVirtualBg('warm-glow')}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      virtualBg === 'warm-glow'
                        ? 'border-[#f97316] bg-[#f97316]/20 text-white font-medium'
                        : 'border-white/10 text-[#fed7aa]/70 hover:text-white'
                    }`}
                  >
                    Solar Halo
                  </button>
                  <button
                    type="button"
                    onClick={() => setVirtualBg('none')}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      virtualBg === 'none'
                        ? 'border-[#f97316] bg-[#f97316]/20 text-white font-medium'
                        : 'border-white/10 text-[#fed7aa]/70 hover:text-white'
                    }`}
                  >
                    Standard
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-white hover:bg-[#ffdf9f] text-[#1a0f0a] font-bold text-sm transition-all shadow-[0_0_24px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2"
                >
                  <span>Join Meeting Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
