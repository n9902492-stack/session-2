import { useState } from 'react';
import { X, Calendar, Clock, Copy, Check, Video, Share2 } from 'lucide-react';
import { generateMeetingCode } from '../utils/mediaEngine';

interface MeetingSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinMeeting: (code: string) => void;
}

export default function MeetingSchedulerModal({
  isOpen,
  onClose,
  onJoinMeeting,
}: MeetingSchedulerModalProps) {
  const [title, setTitle] = useState('Design Sprint & Architecture Sync');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('14:00');
  const [duration, setDuration] = useState('30');
  const [generatedCode] = useState(() => generateMeetingCode());
  const [isCopied, setIsCopied] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  if (!isOpen) return null;

  const meetingUrl = `${window.location.origin}?room=${generatedCode}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(meetingUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduled(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#1c110c] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#f97316]/20 border border-[#f97316]/40 flex items-center justify-center text-[#f97316]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Schedule Video Conference</h3>
              <p className="text-xs text-[#fed7aa]/60">Generate calendar invite & persistent room link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isScheduled ? (
          /* Success confirmation */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Meeting Scheduled!</h4>
              <p className="text-xs text-[#fed7aa]/70 mt-1">
                {title} · {date} at {time} ({duration} mins)
              </p>
            </div>

            {/* Room Link Box */}
            <div className="p-4 rounded-2xl bg-[#120905] border border-white/10 flex items-center justify-between text-xs">
              <div className="truncate mr-3 text-left">
                <span className="text-[10px] uppercase text-[#ffc640] block font-semibold">Meeting URL</span>
                <span className="font-mono text-white truncate block">{meetingUrl}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-full bg-white text-[#1a0f0a] font-semibold flex items-center gap-1.5 shrink-0 hover:bg-[#ffdf9f] transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onJoinMeeting(generatedCode)}
                className="flex-1 py-3 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]"
              >
                <Video className="w-4 h-4" />
                <span>Start Room Now</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-white mb-1.5">Meeting Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly Product Strategy"
                className="w-full h-11 px-4 rounded-xl bg-[#120905] border border-white/15 text-white focus:outline-none focus:border-[#f97316] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-white mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#120905] border border-white/15 text-white focus:outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="block font-medium text-white mb-1.5">Start Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#120905] border border-white/15 text-white focus:outline-none focus:border-[#f97316]"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-white mb-1.5">Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {['15', '30', '45', '60'].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2 rounded-xl border text-center transition-all ${
                      duration === mins
                        ? 'border-[#f97316] bg-[#f97316]/20 text-white font-semibold'
                        : 'border-white/10 bg-white/5 text-[#fed7aa]/70 hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#140a05] border border-white/10 space-y-1">
              <span className="text-[11px] text-[#ffc640] font-semibold block">Generated Meeting Code</span>
              <span className="text-sm font-mono text-white font-bold">{generatedCode}</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-white hover:bg-[#ffdf9f] text-[#1a0f0a] font-bold shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all"
              >
                Create Invitation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
