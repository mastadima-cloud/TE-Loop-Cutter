import React, { useRef, useEffect, useState } from "react";

interface WaveformEditorProps {
  buffer: AudioBuffer;
  isPlaying: boolean;
  selection: { start: number; end: number };
  onSelectionChange: (val: { start: number; end: number }) => void;
}

export function WaveformEditor({ buffer, isPlaying, selection, onSelectionChange }: WaveformEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playhead, setPlayhead] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / canvas.width);
    const amp = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, amp);
      
    // Draw background waveform
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.lineTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }
    ctx.stroke();

    // Draw active selection waveform
    const startX = selection.start * canvas.width;
    const endX = selection.end * canvas.width;
      
    ctx.beginPath();
    ctx.strokeStyle = "#f8e71c";
    ctx.lineWidth = 1;
    for (let i = Math.floor(startX); i < endX; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.moveTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }
    ctx.stroke();

  }, [buffer, selection]);

  useEffect(() => {
    if (isPlaying && buffer) {
      // Use a try-catch for context creation as browsers have limits
      let ctx: AudioContext;
      try {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;
      } catch (e) {
        console.error("Failed to create AudioContext", e);
        return;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
        
      // Ensure selection bounds are safe
      const startPos = Math.max(0, Math.min(buffer.duration - 0.001, selection.start * buffer.duration));
      const endPos = Math.max(startPos + 0.001, Math.min(buffer.duration, selection.end * buffer.duration));

      source.loopStart = startPos;
      source.loopEnd = endPos;
      source.connect(ctx.destination);
        
      try {
        source.start(0, startPos);
        sourceNodeRef.current = source;
        startTimeRef.current = ctx.currentTime;
      } catch (e) {
        console.error("Playback failed", e);
        ctx.close();
        return;
      }

      let frame: number;
      const updatePlayhead = () => {
        if (ctx.state === 'closed') return;
        const elapsed = ctx.currentTime - startTimeRef.current;
        const totalLoopTime = source.loopEnd - source.loopStart;
        const currentLoopPos = source.loopStart + (elapsed % totalLoopTime);
        setPlayhead(currentLoopPos / buffer.duration);
        frame = requestAnimationFrame(updatePlayhead);
      };
      frame = requestAnimationFrame(updatePlayhead);

      return () => {
        try {
          if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
          }
          if (ctx.state !== 'closed') {
            ctx.close();
          }
        } catch (e) {
          // Silently handle cleanup errors
        }
        cancelAnimationFrame(frame);
      };
    } else {
      setPlayhead(selection.start);
    }
  }, [isPlaying, buffer, selection.start, selection.end]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
      
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const moveX = (moveEvent.clientX - rect.left) / rect.width;
      onSelectionChange({
        start: Math.min(x, moveX),
        end: Math.max(x, moveX)
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="w-full h-full relative cursor-crosshair select-none bg-black"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-80"
        width={1600}
        height={400}
      />
        
      {/* Playhead */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_8px_red] pointer-events-none z-20"
        style={{ left: `${playhead * 100}%` }}
      />

      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex justify-between">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-[1px] h-full bg-white" />
        ))}
      </div>

      {/* Handles */}
      <div 
        className="absolute top-0 bottom-0 border-l-2 border-[#f8e71c] bg-[#f8e71c22] z-10 pointer-events-none"
        style={{ left: `${selection.start * 100}%`, right: `${(1 - selection.end) * 100}%` }}
      >
        <div className="absolute left-0 top-0 bg-[#f8e71c] text-black text-[8px] font-bold px-1 uppercase">START</div>
        <div className="absolute right-0 bottom-0 bg-[#f8e71c] text-black text-[8px] font-bold px-1 uppercase">END</div>
      </div>
    </div>
  );
}