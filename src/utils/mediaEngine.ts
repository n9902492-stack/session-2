// Media handling, audio analysis, and multi-tab mesh signaling

export async function getLocalMediaStream(constraints: {
  video: boolean | MediaTrackConstraints;
  audio: boolean | MediaTrackConstraints;
}): Promise<MediaStream | null> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('getUserMedia not supported in this environment');
      return null;
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (err: unknown) {
    console.warn('Could not acquire real media stream:', err);
    return null;
  }
}

export async function getScreenShareStream(): Promise<MediaStream | null> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      return null;
    }
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    return stream;
  } catch (err: unknown) {
    console.warn('Screen share cancelled or not allowed:', err);
    return null;
  }
}

// Audio level monitor for mic activity
export class AudioMeter {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;
  private onVolumeChange: (volume: number) => void;

  constructor(onVolumeChange: (volume: number) => void) {
    this.onVolumeChange = onVolumeChange;
  }

  public attachStream(stream: MediaStream) {
    try {
      const audioTracks = stream.getAudioTracks();
      if (!audioTracks.length) return;

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.4;

      this.source = this.audioCtx.createMediaStreamSource(stream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const tick = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        this.onVolumeChange(normalized);

        this.animFrameId = requestAnimationFrame(tick);
      };

      this.animFrameId = requestAnimationFrame(tick);
    } catch (e) {
      console.warn('AudioMeter initialization failed', e);
    }
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.onVolumeChange(0);
  }
}

// Speaker Test Tone Generator
export function playTestChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        resolve();
        return;
      }
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.55);

      setTimeout(() => {
        ctx.close().catch(() => {});
        resolve();
      }, 600);
    } catch {
      resolve();
    }
  });
}

// Generate friendly random meeting code e.g. "sol-ember-891"
export function generateMeetingCode(): string {
  const adjectives = ['solar', 'amber', 'aurora', 'ember', 'radiant', 'zenith', 'stellar', 'lumina'];
  const nouns = ['nexus', 'orbit', 'pulse', 'spark', 'beacon', 'flow', 'wave', 'grove'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${adj}-${noun}-${num}`;
}
