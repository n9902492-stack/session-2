import { useEffect, useRef, useState } from 'react';
import { X, Eraser, Pen, Trash2, Download } from 'lucide-react';

interface WhiteboardOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
}

export default function WhiteboardOverlay({ isOpen, onClose, roomCode }: WhiteboardOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState('#f97316');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to display size
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    // Dark grid background
    ctx.fillStyle = '#180e09';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid dots
    ctx.fillStyle = 'rgba(255, 182, 144, 0.08)';
    const spacing = 28;
    for (let x = spacing; x < canvas.width; x += spacing) {
      for (let y = spacing; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = mode === 'erase' ? '#180e09' : color;
    ctx.lineWidth = mode === 'erase' ? 24 : strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#180e09';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 182, 144, 0.08)';
    const spacing = 28;
    for (let x = spacing; x < canvas.width; x += spacing) {
      for (let y = spacing; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `solaris-whiteboard-${roomCode}.png`;
    a.click();
  };

  return (
    <div className="absolute inset-4 z-40 rounded-3xl bg-[#140b07]/95 backdrop-blur-2xl border border-white/15 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Top Toolbar */}
      <div className="px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">Solaris Collaborative Canvas</span>
          <span className="text-xs text-[#fed7aa]/50 font-mono">Room: {roomCode}</span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2">
          {/* Pen / Eraser Mode */}
          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            <button
              onClick={() => setMode('draw')}
              className={`p-1.5 rounded-full transition-colors ${
                mode === 'draw' ? 'bg-[#f97316] text-white' : 'text-white/60 hover:text-white'
              }`}
              title="Draw"
            >
              <Pen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMode('erase')}
              className={`p-1.5 rounded-full transition-colors ${
                mode === 'erase' ? 'bg-[#f97316] text-white' : 'text-white/60 hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Color Palettes */}
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
            {['#f97316', '#ffc640', '#ffffff', '#38bdf8', '#4ade80'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setMode('draw');
                }}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  color === c && mode === 'draw' ? 'scale-125 border-white ring-2 ring-white/40' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-rose-400 transition-colors"
            title="Clear board"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Download snapshot"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative w-full h-full overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
}
