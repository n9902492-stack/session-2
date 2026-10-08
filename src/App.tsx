/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveDeviceTester from './components/LiveDeviceTester';
import CapabilitiesBento from './components/CapabilitiesBento';
import ProofAndMetrics from './components/ProofAndMetrics';
import PricingSection from './components/PricingSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import MeetingSchedulerModal from './components/MeetingSchedulerModal';
import JoinMeetingModal from './components/JoinMeetingModal';
import PreJoinModal from './components/PreJoinModal';
import MeetingRoom from './components/MeetingRoom';
import { generateMeetingCode } from './utils/mediaEngine';
import { VirtualBackground } from './types/meeting';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'pre-join' | 'room'>('landing');
  const [currentRoomCode, setCurrentRoomCode] = useState<string>('');

  // Modals state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Pre-join options
  const [userName, setUserName] = useState('Alex Morgan');
  const [initialMuted, setInitialMuted] = useState(false);
  const [initialCameraOff, setInitialCameraOff] = useState(false);
  const [initialStream, setInitialStream] = useState<MediaStream | null>(null);
  const [virtualBackground, setVirtualBackground] = useState<VirtualBackground>('warm-glow');

  // Check URL params on initial load e.g. ?room=ember-orbit-420
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('room');
    if (roomFromUrl) {
      setCurrentRoomCode(roomFromUrl);
      setActiveView('pre-join');
    }
  }, []);

  const handleStartInstantMeeting = () => {
    const code = generateMeetingCode();
    setCurrentRoomCode(code);
    setActiveView('pre-join');
  };

  const handleJoinMeeting = (rawCode: string) => {
    // If it's a URL, extract ?room= or code
    let code = rawCode.trim();
    if (code.includes('?room=')) {
      const match = code.split('?room=')[1];
      if (match) code = match.split('&')[0];
    }
    setCurrentRoomCode(code);
    setIsJoinModalOpen(false);
    setIsScheduleModalOpen(false);
    setActiveView('pre-join');
  };

  const handlePreJoinConfirm = (options: {
    displayName: string;
    isMuted: boolean;
    isCameraOff: boolean;
    stream: MediaStream | null;
    virtualBackground: VirtualBackground;
  }) => {
    setUserName(options.displayName);
    setInitialMuted(options.isMuted);
    setInitialCameraOff(options.isCameraOff);
    setInitialStream(options.stream);
    setVirtualBackground(options.virtualBackground);
    setActiveView('room');
  };

  const handleLeaveMeeting = () => {
    setActiveView('landing');
    setCurrentRoomCode('');
    setInitialStream(null);
    // Remove query param without reload
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    window.history.replaceState({}, '', url.toString());
  };

  if (activeView === 'room') {
    return (
      <MeetingRoom
        roomCode={currentRoomCode}
        userName={userName}
        initialMuted={initialMuted}
        initialCameraOff={initialCameraOff}
        initialStream={initialStream}
        virtualBackground={virtualBackground}
        onLeaveMeeting={handleLeaveMeeting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#120905] text-[#f5ded5] solar-halo-bg">
      {/* Top Navbar */}
      <Navbar
        onStartInstantMeeting={handleStartInstantMeeting}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
      />

      {/* Main Landing Sections */}
      <main>
        {/* Hero with Direct Join & Interactive Live Video Stage */}
        <Hero
          onJoinMeeting={handleJoinMeeting}
          onStartInstantMeeting={handleStartInstantMeeting}
          onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        />

        {/* Live Hardware Pre-flight Tester */}
        <LiveDeviceTester />

        {/* Core Capabilities Bento */}
        <CapabilitiesBento />

        {/* Impact Evidence & Attributable Proof */}
        <ProofAndMetrics />

        {/* Pricing Subscriptions */}
        <PricingSection onStartFree={handleStartInstantMeeting} />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Quiet Footer */}
      <Footer />

      {/* Modals & Green Room */}
      <JoinMeetingModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinMeeting}
      />

      <MeetingSchedulerModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onJoinMeeting={handleJoinMeeting}
      />

      {activeView === 'pre-join' && (
        <PreJoinModal
          roomCode={currentRoomCode}
          onJoin={handlePreJoinConfirm}
          onCancel={() => {
            setActiveView('landing');
            setCurrentRoomCode('');
          }}
        />
      )}
    </div>
  );
}
