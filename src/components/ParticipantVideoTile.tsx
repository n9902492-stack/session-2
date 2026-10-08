import { useEffect, useRef } from 'react';
import { MicOff, Pin, PinOff, Hand } from 'lucide-react';
import { Participant } from '../types/meeting';

interface ParticipantVideoTileProps {
  participant: Participant;
  isPinned?: boolean;
  onTogglePin?: (id: string) => void;
  className?: string;
}

export default function ParticipantVideoTile({
  participant,
  isPinned = false,
  onTogglePin,
  className = '',
}: ParticipantVideoTileProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Bind local real media stream if available
  useEffect(() => {
    if (participant.stream && videoRef.current) {
      videoRef.current.srcObject = participant.stream;
      videoRef.current.play().catch(() => {});
    }
  }, [participant.stream]);

  // Synthetic animated video canvas for simulated remote participants if camera is on
  useEffect(() => {
    if (participant.isSelf || participant.isCameraOff || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    // Pick consistent color gradient based on name
    const seed = participant.name.charCodeAt(0) + participant.name.length;
    const hue = (seed * 47) % 360;

    const render = () => {
      frame++;
      const width = canvas.width;
      const height = canvas.height;

      // Dark atmospheric gradient background
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        10,
        width * 0.5,
        height * 0.5,
        width * 0.7
      );
      bgGrad.addColorStop(0, `hsla(${hue}, 45%, 22%, 1)`);
      bgGrad.addColorStop(0.6, `hsla(${hue + 20}, 40%, 12%, 1)`);
      bgGrad.addColorStop(1, '#140b07');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient warm light halo
      const haloGrad = ctx.createRadialGradient(
        width * (0.5 + Math.sin(frame * 0.02) * 0.08),
        height * 0.2,
        0,
        width * 0.5,
        height * 0.3,
        width * 0.6
      );
      haloGrad.addColorStop(0, 'rgba(249, 115, 22, 0.18)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.fillRect(0, 0, width, height);

      // Natural breathing offset
      const breath = Math.sin(frame * 0.04) * 3;
      const speakingBounce = participant.isSpeaking ? Math.sin(frame * 0.25) * 2 : 0;
      const centerY = height * 0.48 + breath + speakingBounce;
      const centerX = width * 0.5;

      // Draw stylized head & shoulders silhouette with soft lighting
      // Torso
      ctx.beginPath();
      ctx.ellipse(centerX, height * 0.95, width * 0.35, height * 0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 30%, 25%, 0.9)`;
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, width * 0.18, height * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue + 10}, 35%, 45%, 0.95)`;
      ctx.fill();

      // Hair
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - height * 0.07, width * 0.19, height * 0.16, 0, Math.PI, Math.PI * 2);
      ctx.fillStyle = '#23150e';
      ctx.fill();

      // Shoulders rim light
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 182, 144, 0.3)';
      ctx.stroke();

      // If speaking, draw radiating audio waves around head
      if (participant.isSpeaking) {
        ctx.beginPath();
        const waveR = (width * 0.22) + ((frame * 2) % 25);
        ctx.arc(centerX, centerY, waveR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(249, 115, 22, ${Math.max(0, 0.6 - (waveR / (width * 0.35)))})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [participant.isCameraOff, participant.isSelf, participant.name, participant.isSpeaking]);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#1c110c] border transition-all duration-300 ${
        participant.isSpeaking
          ? 'border-[#f97316] shadow-[0_0_25px_rgba(249,115,22,0.35)]'
          : 'border-white/10 hover:border-white/20'
      } ${className}`}
    >
      {/* Video Content */}
      <div className="relative w-full h-full flex items-center justify-center bg-[#150c07]">
        {participant.isSelf && participant.stream && !participant.isCameraOff ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!participant.isScreenSharing ? 'scale-x-[-1]' : ''}`}
          />
        ) : !participant.isCameraOff ? (
          <canvas
            ref={canvasRef}
            width={480}
            height={360}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Camera Off Avatar state */
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-semibold shadow-inner transition-transform duration-300 ${
                participant.isSpeaking ? 'scale-105 ring-4 ring-[#f97316]/50' : ''
              }`}
              style={{ backgroundColor: participant.avatarColor, color: '#ffffff' }}
            >
              {participant.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <span className="mt-3 text-sm font-medium text-[#fed7aa]/80">
              Camera is turned off
            </span>
          </div>
        )}

        {/* Ambient Warm Corner Glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Floating Reaction Bubble */}
        {participant.reaction && (
          <div className="absolute top-4 left-4 z-20 animate-bounce bg-black/60 backdrop-blur-md border border-[#f97316]/40 text-2xl px-3 py-1.5 rounded-full shadow-lg">
            {participant.reaction}
          </div>
        )}

        {/* Hand Raised Badge */}
        {participant.isHandRaised && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f97316] text-[#2b1002] font-semibold text-xs shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse">
            <Hand className="w-3.5 h-3.5" />
            <span>Raised Hand</span>
          </div>
        )}

        {/* Pin Button on Hover */}
        {onTogglePin && (
          <button
            onClick={() => onTogglePin(participant.id)}
            className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white border border-white/10"
            title={isPinned ? 'Unpin' : 'Pin to main view'}
          >
            {isPinned ? <PinOff className="w-4 h-4 text-[#ffc640]" /> : <Pin className="w-4 h-4" />}
          </button>
        )}

        {/* Bottom Identifier Card */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
            {participant.isMuted ? (
              <MicOff className="w-3.5 h-3.5 text-rose-400" />
            ) : participant.isSpeaking ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffc640]" />
              </span>
            ) : null}
            <span className="font-medium text-white truncate max-w-[140px] sm:max-w-[200px]">
              {participant.name} {participant.isSelf ? '(You)' : ''}
            </span>
            {participant.role === 'host' && (
              <span className="text-[10px] uppercase font-semibold text-[#ffc640] tracking-wider">
                Host
              </span>
            )}
          </div>

          {participant.isScreenSharing && (
            <div className="bg-[#f97316]/20 border border-[#f97316]/40 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#fed7aa] backdrop-blur-md">
              Presenting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
