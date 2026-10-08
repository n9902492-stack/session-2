import { useState } from 'react';
import { X, ArrowRight, Video, Sparkles } from 'lucide-react';

interface JoinMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
}

export default function JoinMeetingModal({ isOpen, onClose, onJoin }: JoinMeetingModalProps) {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = roomCode.trim();
    if (!clean) {
      setError('Please enter a valid room code or link');
      return;
    }
    setError('');
    onJoin(clean);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#1c110c] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#f97316]/20 border border-[#f97316]/40 flex items-center justify-center text-[#f97316]">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Join Video Conference</h3>
              <p className="text-xs text-[#fed7aa]/60">Enter meeting code or shared link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Room Identifier
            </label>
            <input
              type="text"
              autoFocus
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. solar-orbit-302 or full link"
              className="w-full h-12 px-4 rounded-xl bg-[#120905] border border-white/15 text-white text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/30"
            />
            {error && <p className="text-xs text-[#ffb4ab] mt-1.5">{error}</p>}
          </div>

          {/* Quick sample chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-[#fed7aa]/60">Suggested rooms:</span>
            <div className="flex flex-wrap gap-2">
              {['solar-flow-901', 'ember-orbit-420', 'aurora-zenith-110'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setRoomCode(code)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-[#fed7aa] transition-colors"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-medium text-white/70 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-white hover:bg-[#ffdf9f] text-[#1a0f0a] font-bold text-xs shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all flex items-center gap-2"
            >
              <span>Join Meeting</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
