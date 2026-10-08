import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Hand,
  Smile,
  MessageSquare,
  Users,
  PenTool,
  Settings,
  PhoneOff,
  Copy,
  Check,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Circle,
  Share2,
  Send,
  X,
  Volume2,
} from 'lucide-react';
import { Participant, ChatMessage, VirtualBackground } from '../types/meeting';
import ParticipantVideoTile from './ParticipantVideoTile';
import WhiteboardOverlay from './WhiteboardOverlay';
import { getScreenShareStream, AudioMeter } from '../utils/mediaEngine';

interface MeetingRoomProps {
  roomCode: string;
  userName: string;
  initialMuted: boolean;
  initialCameraOff: boolean;
  initialStream: MediaStream | null;
  virtualBackground: VirtualBackground;
  onLeaveMeeting: () => void;
}

export default function MeetingRoom({
  roomCode,
  userName,
  initialMuted,
  initialCameraOff,
  initialStream,
  onLeaveMeeting,
}: MeetingRoomProps) {
  // Local user stream & state
  const [localStream, setLocalStream] = useState<MediaStream | null>(initialStream);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isCameraOff, setIsCameraOff] = useState(initialCameraOff);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);

  // Meeting controls & toggles
  const [isRecording, setIsRecording] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(42);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [activeSideDrawer, setActiveSideDrawer] = useState<'chat' | 'participants' | null>(null);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'spotlight'>('grid');

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderId: 'sarah-1',
      senderName: 'Sarah Chen',
      senderRole: 'Host',
      text: 'Welcome to Solaris Meet! Sound and video are looking crystal clear.',
      timestamp: '10:02 AM',
      isSelf: false,
    },
    {
      id: 'msg-2',
      senderId: 'david-2',
      senderName: 'David Miller',
      senderRole: 'Guest',
      text: 'Thanks Sarah, latency is under 12ms from Frankfurt. Ready for the review!',
      timestamp: '10:03 AM',
      isSelf: false,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Participants list (local user + realistic remote peers)
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'user-self',
      name: userName || 'You',
      role: 'guest',
      avatarColor: '#ea580c',
      isMuted: initialMuted,
      isCameraOff: initialCameraOff,
      isSpeaking: false,
      isHandRaised: false,
      isScreenSharing: false,
      isSelf: true,
      stream: initialStream,
    },
    {
      id: 'sarah-1',
      name: 'Sarah Chen',
      role: 'host',
      avatarColor: '#f97316',
      isMuted: false,
      isCameraOff: false,
      isSpeaking: true,
      isHandRaised: false,
      isScreenSharing: false,
      isSelf: false,
    },
    {
      id: 'david-2',
      name: 'David Miller',
      role: 'guest',
      avatarColor: '#ffc640',
      isMuted: false,
      isCameraOff: false,
      isSpeaking: false,
      isHandRaised: false,
      isScreenSharing: false,
      isSelf: false,
    },
    {
      id: 'elena-3',
      name: 'Elena Vance',
      role: 'guest',
      avatarColor: '#38bdf8',
      isMuted: true,
      isCameraOff: true,
      isSpeaking: false,
      isHandRaised: false,
      isScreenSharing: false,
      isSelf: false,
    },
  ]);

  const audioMeterRef = useRef<AudioMeter | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Meeting timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format elapsed seconds e.g. "00:14:28"
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // BroadcastChannel for cross-tab communication
  useEffect(() => {
    try {
      const channel = new BroadcastChannel(`solaris-meeting-${roomCode}`);
      broadcastChannelRef.current = channel;

      // Announce arrival to other tabs
      channel.postMessage({
        type: 'peer-joined',
        name: userName,
      });

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'peer-joined') {
          // Add peer if not present
          setParticipants((prev) => {
            if (prev.some((p) => p.name === data.name)) return prev;
            return [
              ...prev,
              {
                id: `tab-peer-${Date.now()}`,
                name: data.name || 'Remote Peer',
                role: 'guest',
                avatarColor: '#10b981',
                isMuted: false,
                isCameraOff: false,
                isSpeaking: false,
                isHandRaised: false,
                isScreenSharing: false,
                isSelf: false,
              },
            ];
          });
        } else if (data.type === 'chat-message') {
          setChatMessages((prev) => [...prev, data.message]);
          if (activeSideDrawer !== 'chat') {
            setUnreadChatCount((c) => c + 1);
          }
        } else if (data.type === 'reaction') {
          showPeerReaction(data.participantId, data.emoji);
        }
      };
    } catch {
      // BroadcastChannel fallback if not supported
    }

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, [roomCode, userName, activeSideDrawer]);

  // Dynamic speaking simulator for remote participants to make room feel alive
  useEffect(() => {
    const speakTimer = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.isSelf || p.isMuted) return { ...p, isSpeaking: false };
          // Randomly trigger speaking state for Sarah or David
          const willSpeak = Math.random() > 0.6;
          return { ...p, isSpeaking: willSpeak };
        })
      );
    }, 4500);

    return () => clearInterval(speakTimer);
  }, []);

  // Monitor local audio stream for active speaking halo
  useEffect(() => {
    if (!localStream || isMuted) {
      if (audioMeterRef.current) audioMeterRef.current.stop();
      setParticipants((prev) =>
        prev.map((p) => (p.isSelf ? { ...p, isSpeaking: false } : p))
      );
      return;
    }

    audioMeterRef.current = new AudioMeter((volume) => {
      const isSpeaking = volume > 18;
      setParticipants((prev) =>
        prev.map((p) => (p.isSelf ? { ...p, isSpeaking } : p))
      );
    });
    audioMeterRef.current.attachStream(localStream);

    return () => {
      audioMeterRef.current?.stop();
    };
  }, [localStream, isMuted]);

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
      screenStream?.getTracks().forEach((t) => t.stop());
    };
  }, [localStream, screenStream]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleMic = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => (t.enabled = !nextState));
    }
    setParticipants((prev) =>
      prev.map((p) => (p.isSelf ? { ...p, isMuted: nextState } : p))
    );
  };

  const toggleCamera = () => {
    const nextState = !isCameraOff;
    setIsCameraOff(nextState);
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => (t.enabled = !nextState));
    }
    setParticipants((prev) =>
      prev.map((p) => (p.isSelf ? { ...p, isCameraOff: nextState } : p))
    );
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach((t) => t.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);
      setParticipants((prev) =>
        prev.map((p) => (p.isSelf ? { ...p, isScreenSharing: false, stream: localStream } : p))
      );
      return;
    }

    const stream = await getScreenShareStream();
    if (stream) {
      setScreenStream(stream);
      setIsScreenSharing(true);

      // Listen for when user stops screen share from native browser bar
      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        setScreenStream(null);
        setParticipants((prev) =>
          prev.map((p) => (p.isSelf ? { ...p, isScreenSharing: false, stream: localStream } : p))
        );
      };

      setParticipants((prev) =>
        prev.map((p) => (p.isSelf ? { ...p, isScreenSharing: true, stream } : p))
      );
    }
  };

  const toggleHandRaise = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    setParticipants((prev) =>
      prev.map((p) => (p.isSelf ? { ...p, isHandRaised: nextState } : p))
    );
  };

  const showPeerReaction = (participantId: string, emoji: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, reaction: emoji } : p))
    );
    setTimeout(() => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === participantId ? { ...p, reaction: null } : p))
      );
    }, 2800);
  };

  const handleSendReaction = (emoji: string) => {
    setShowReactionPicker(false);
    showPeerReaction('user-self', emoji);

    // Broadcast reaction
    broadcastChannelRef.current?.postMessage({
      type: 'reaction',
      participantId: 'user-self',
      emoji,
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-self',
      senderName: userName || 'You',
      senderRole: 'Guest',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Broadcast to other tabs
    broadcastChannelRef.current?.postMessage({
      type: 'chat-message',
      message: newMsg,
    });

    // Simulated responsive reply if user asks something
    if (chatInput.toLowerCase().includes('hello') || chatInput.toLowerCase().includes('hi')) {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `reply-${Date.now()}`,
          senderId: 'sarah-1',
          senderName: 'Sarah Chen',
          senderRole: 'Host',
          text: `Hi ${userName}! Great to have you on the call.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSelf: false,
        };
        setChatMessages((prev) => [...prev, reply]);
      }, 1200);
    }
  };

  const handleCopyInvite = () => {
    const url = window.location.origin ? `${window.location.origin}?room=${roomCode}` : roomCode;
    navigator.clipboard?.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTogglePin = (id: string) => {
    if (pinnedParticipantId === id) {
      setPinnedParticipantId(null);
    } else {
      setPinnedParticipantId(id);
      setViewMode('spotlight');
    }
  };

  // Find pinned participant or default
  const pinnedParticipant = participants.find((p) => p.id === pinnedParticipantId);

  return (
    <div className="relative w-screen h-screen bg-[#100704] text-[#f5ded5] flex flex-col overflow-hidden select-none">
      {/* Top Meeting Control Bar */}
      <header className="h-16 px-4 sm:px-6 bg-[#160c07]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between z-30 shrink-0">
        {/* Left: Meeting Info & Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>{roomCode}</span>
            </h2>
          </div>

          <button
            onClick={handleCopyInvite}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#fed7aa] transition-colors"
            title="Copy invite link"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Link Copied' : 'Copy Link'}</span>
          </button>

          {/* Recording Badge */}
          {isRecording && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[11px] font-semibold text-rose-300">
              <Circle className="w-2 h-2 fill-rose-500 text-rose-500 animate-pulse" />
              <span>REC</span>
            </div>
          )}

          {/* Timer */}
          <div className="text-xs font-mono text-[#fed7aa]/60 tabular-nums">
            {formatTime(elapsedSeconds)}
          </div>
        </div>

        {/* Right: Layout Switcher & Fast Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'spotlight' : 'grid')}
            className={`p-2 rounded-full border transition-colors ${
              viewMode === 'grid'
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-transparent border-white/10 text-white/60 hover:text-white'
            }`}
            title={viewMode === 'grid' ? 'Switch to Spotlight View' : 'Switch to Grid View'}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)]"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </header>

      {/* Main Conference Viewport (Video Area + Drawer) */}
      <div className="flex-1 relative flex overflow-hidden p-3 sm:p-4 gap-4">
        {/* Video Canvas Area */}
        <div className="flex-1 relative flex flex-col justify-center items-center min-w-0">
          {viewMode === 'spotlight' && pinnedParticipant ? (
            /* Spotlight Mode: 1 Major Tile + Bottom Strip */
            <div className="w-full h-full flex flex-col gap-3">
              <div className="flex-1 relative w-full rounded-2xl overflow-hidden shadow-2xl">
                <ParticipantVideoTile
                  participant={pinnedParticipant}
                  isPinned={true}
                  onTogglePin={handleTogglePin}
                  className="w-full h-full"
                />
              </div>

              {/* Horizontal Participant Carousel Strip */}
              <div className="h-32 sm:h-36 flex items-center gap-3 overflow-x-auto pb-1">
                {participants
                  .filter((p) => p.id !== pinnedParticipant.id)
                  .map((p) => (
                    <div key={p.id} className="w-48 sm:w-56 h-full shrink-0">
                      <ParticipantVideoTile
                        participant={p}
                        isPinned={false}
                        onTogglePin={handleTogglePin}
                        className="w-full h-full"
                      />
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            /* Grid Mode: Balanced responsive video grid */
            <div
              className={`w-full h-full grid gap-3 sm:gap-4 max-w-6xl mx-auto ${
                participants.length === 1
                  ? 'grid-cols-1 max-w-3xl'
                  : participants.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
              }`}
            >
              {participants.map((p) => (
                <ParticipantVideoTile
                  key={p.id}
                  participant={p}
                  isPinned={pinnedParticipantId === p.id}
                  onTogglePin={handleTogglePin}
                  className="w-full h-full min-h-[200px]"
                />
              ))}
            </div>
          )}

          {/* Whiteboard Canvas Overlay if open */}
          <WhiteboardOverlay
            isOpen={showWhiteboard}
            onClose={() => setShowWhiteboard(false)}
            roomCode={roomCode}
          />
        </div>

        {/* Side Drawer: Chat or Participants */}
        {activeSideDrawer && (
          <aside className="w-full sm:w-80 md:w-96 rounded-2xl bg-[#1c110c] border border-white/15 flex flex-col shadow-2xl overflow-hidden z-20 animate-in slide-in-from-right duration-200 shrink-0">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/30">
              <div className="flex items-center gap-2">
                {activeSideDrawer === 'chat' ? (
                  <>
                    <MessageSquare className="w-4 h-4 text-[#f97316]" />
                    <span className="font-bold text-white text-sm">Meeting Chat</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 text-[#ffc640]" />
                    <span className="font-bold text-white text-sm">
                      Participants ({participants.length})
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => setActiveSideDrawer(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            {activeSideDrawer === 'chat' ? (
              <div className="flex-1 flex flex-col min-h-0 bg-[#160c07]/80">
                {/* Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-[#fed7aa]/50 mb-0.5">
                        <span className="font-semibold text-white/80">{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          msg.isSelf
                            ? 'bg-[#f97316] text-[#240e02] font-medium rounded-tr-none'
                            : 'bg-[#291d17] border border-white/10 text-white rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-white/10 bg-[#1f130d] flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Send a message to room..."
                    className="flex-1 h-10 px-3.5 rounded-full bg-[#120905] border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#f97316]"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white flex items-center justify-center transition-transform active:scale-90 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Participants List */
              <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white truncate max-w-[120px]">
                            {p.name}
                          </span>
                          {p.isSelf && <span className="text-[#fed7aa]/50">(You)</span>}
                        </div>
                        <span className="text-[10px] text-[#fed7aa]/60 capitalize">{p.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-white/60">
                      {p.isMuted ? (
                        <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {p.isCameraOff ? (
                        <VideoOff className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Video className="w-3.5 h-3.5 text-[#ffc640]" />
                      )}
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleCopyInvite}
                    className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Room Invitation</span>
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Floating Bottom Control Dock (Solaris Glow Obsidian-Pill) */}
      <footer className="h-20 px-4 flex items-center justify-center z-30 shrink-0">
        <div className="relative flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-[#1e120c]/90 backdrop-blur-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          {/* Mic Button */}
          <button
            onClick={toggleMic}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isMuted ? 'Unmute microphone (Space)' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Camera Button */}
          <button
            onClick={toggleCamera}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
              isCameraOff
                ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isCameraOff ? 'Start video' : 'Stop video'}
          >
            {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-[#ffc640]" />}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={toggleScreenShare}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
              isScreenSharing
                ? 'bg-[#f97316] text-[#1a0f0a] font-bold shadow-[0_0_20px_rgba(249,115,22,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isScreenSharing ? 'Stop presenting' : 'Share screen'}
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          {/* Hand Raise Button */}
          <button
            onClick={toggleHandRaise}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
              isHandRaised
                ? 'bg-[#ffc640] text-[#1a0f0a] shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isHandRaised ? 'Lower hand' : 'Raise hand'}
          >
            <Hand className="w-5 h-5" />
          </button>

          {/* Emoji Reaction Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="React with emoji"
            >
              <Smile className="w-5 h-5 text-[#ffb599]" />
            </button>

            {/* Reaction Popover */}
            {showReactionPicker && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 p-2 rounded-2xl bg-[#1c110c] border border-white/20 shadow-2xl flex items-center gap-1.5 animate-in slide-in-from-bottom duration-150 z-50">
                {['👍', '👏', '❤️', '🔥', '🎉', '💡', '🚀'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSendReaction(emoji)}
                    className="w-9 h-9 rounded-xl hover:bg-white/15 flex items-center justify-center text-xl transition-transform hover:scale-125"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Whiteboard Canvas Button */}
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
              showWhiteboard
                ? 'bg-[#f97316] text-[#1a0f0a]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Toggle shared whiteboard"
          >
            <PenTool className="w-5 h-5" />
          </button>

          {/* Chat Drawer Button */}
          <button
            onClick={() => {
              setActiveSideDrawer(activeSideDrawer === 'chat' ? null : 'chat');
              setUnreadChatCount(0);
            }}
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
              activeSideDrawer === 'chat'
                ? 'bg-white text-[#1a0f0a]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Meeting chat"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f97316] text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#1c110c]">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Participants Drawer Button */}
          <button
            onClick={() =>
              setActiveSideDrawer(activeSideDrawer === 'participants' ? null : 'participants')
            }
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
              activeSideDrawer === 'participants'
                ? 'bg-white text-[#1a0f0a]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Participant roster"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Red End Call Action */}
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(225,29,72,0.4)] ml-1"
            title="Leave conference"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Leave Confirmation Dialog */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#1c110c] border border-white/20 p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Leave this meeting?</h3>
            <p className="text-xs text-[#fed7aa]/70 leading-relaxed">
              You can rejoin this conference anytime using room code{' '}
              <span className="font-mono text-white">{roomCode}</span>.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
              >
                Stay in Room
              </button>
              <button
                onClick={onLeaveMeeting}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-lg"
              >
                Leave Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
