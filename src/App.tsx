import React, { useState, useRef, useEffect } from "react";
import { Upload, Play, Square, Download, Scissors, ListMusic, Plus, Trash2, Save, WifiOff, CheckCircle2 } from "lucide-react";
import { TeenageUI } from "./components/TeenageUI";
import { WaveformEditor } from "./components/WaveformEditor";
import { detectBPM, exportTEPatch } from "./utils/audioUtils";

interface SavedLoop {
  id: string;
  name: string;
  buffer: AudioBuffer;
  duration: number;
}

export default function Component() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selection, setSelection] = useState({ start: 0.2, end: 0.8 });
  const [savedLoops, setSavedLoops] = useState<SavedLoop[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [detectedBpm, setDetectedBpm] = useState<number>(120);
  const [targetDevice, setTargetDevice] = useState("OP-XY (ENVY)");
  const [selectedBars, setSelectedBars] = useState<number>(4);

  const applyBarSelection = (numBars: number) => {
    if (!audioBuffer) return;
    const secondsPerBar = (60 / detectedBpm) * 4;
    const selectionLengthSeconds = secondsPerBar * numBars;
    const normalizedLength = selectionLengthSeconds / audioBuffer.duration;
    
    setSelection({
      start: selection.start,
      end: Math.min(1.0, selection.start + normalizedLength)
    });
    setSelectedBars(numBars);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsPlaying(false);
    
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new AudioContext();
    try {
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      setAudioBuffer(decodedBuffer);
      const bpm = detectBPM(decodedBuffer);
      setDetectedBpm(bpm);
    } catch (err) {
      console.error("Decoding failed", err);
    } finally {
      audioCtx.close();
    }
  };

  const collectLoop = () => {
    if (!audioBuffer) return;
    
    // Create a new buffer for the slice
    const startSample = Math.floor(selection.start * audioBuffer.length);
    const endSample = Math.floor(selection.end * audioBuffer.length);
    const sliceLength = endSample - startSample;
    
    const audioCtx = new AudioContext();
    const sliceBuffer = audioCtx.createBuffer(
      audioBuffer.numberOfChannels,
      sliceLength,
      audioBuffer.sampleRate
    );
    
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      const channelData = audioBuffer.getChannelData(i);
      const sliceData = sliceBuffer.getChannelData(i);
      sliceData.set(channelData.subarray(startSample, endSample));
    }

    const newLoop: SavedLoop = {
      id: Math.random().toString(36).substr(2, 9),
      name: `LOOP_${savedLoops.length + 1}`,
      buffer: sliceBuffer,
      duration: sliceBuffer.duration
    };
    
    setSavedLoops([...savedLoops, newLoop]);
  };

  const [isExporting, setIsExporting] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        setIsOfflineReady(true);
      });
    }
  }, []);

  const exportLoop = (loop: SavedLoop) => {
    const wavBlob = audioBufferToWav(loop.buffer);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${loop.name}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const batchExport = async () => {
    setIsExporting(true);
    for (let i = 0; i < savedLoops.length; i++) {
      exportLoop(savedLoops[i]);
      // Small delay to prevent browser download blocking
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsExporting(false);
  };

  const exportAsSampleChain = () => {
    if (savedLoops.length === 0) return;
    
    const { blob, extension } = exportTEPatch(savedLoops, targetDevice, detectedBpm);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    const prefix = targetDevice.includes("ENVY") ? "ENVY" : "TE";
    a.download = `${prefix}_PATCH_${new Date().getTime()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f0f0] flex items-center justify-center p-8 font-mono">
      <TeenageUI title="LOOP CUTTER" subtitle="ENVY ENGINE COMPATIBLE">
        {/* Offline Indicator */}
        <div className="absolute -top-6 right-4 flex items-center gap-2">
          {isOfflineReady ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100 border border-green-200 rounded-full">
              <CheckCircle2 size={10} className="text-green-600" />
              <span className="text-[8px] font-black text-green-700 uppercase tracking-wider">Offline Ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full opacity-50">
              <WifiOff size={10} className="text-gray-400" />
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Connecting...</span>
            </div>
          )}
        </div>

        <div className="flex gap-8 h-[600px]">
          {/* Main Editor Section */}
          <div className="flex-grow flex flex-col gap-6 h-full">
            <div 
              className="flex-grow bg-[#111] rounded-2xl overflow-hidden relative border-8 border-[#2a2a2a] shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] group"
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  const arrayBuffer = await file.arrayBuffer();
                  const audioCtx = new AudioContext();
                  const buffer = await audioCtx.decodeAudioData(arrayBuffer);
                  setAudioBuffer(buffer);
                }
              }}
            >
              {audioBuffer ? (
                <WaveformEditor 
                  buffer={audioBuffer} 
                  isPlaying={isPlaying} 
                  selection={selection}
                  onSelectionChange={setSelection}
                />
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col items-center justify-center text-[#333] gap-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                >
                  <Plus size={48} strokeWidth={3} />
                  <p className="text-[12px] tracking-[0.3em] font-black uppercase">Load Source Audio</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="audio/*" />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center px-4 py-2 bg-[#dcdcdc] rounded-xl border-b-4 border-[#c0c0c0] shadow-inner">
               <div className="flex gap-6">
                 <div className="flex flex-col">
                 <span className="text-[8px] font-black text-[#888] mb-1">TARGET DEVICE</span>
                 <select 
                   value={targetDevice}
                   onChange={(e) => setTargetDevice(e.target.value)}
                   className="bg-[#ccc] px-2 py-1 rounded text-[10px] font-black outline-none border-b-2 border-[#bbb]"
                 >
                   <option>OP-XY (ENVY)</option>
                   <option>OP-1 (OG)</option>
                   <option>OP-Z</option>
                   <option>EP-133 KO II</option>
                   <option>OP-1 FIELD</option>
                 </select>
               </div>
               <div className="flex flex-col">
                 <span className="text-[8px] font-black text-[#888] mb-1">LOOP LENGTH</span>
                 <span className="text-[12px] font-black text-[#444] leading-tight">
                   {audioBuffer ? `${(audioBuffer.duration * (selection.end - selection.start)).toFixed(2)}s` : "0.00s"}
                 </span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[8px] font-black text-[#888] mb-1">BPM (MANUAL)</span>
                 <input 
                   type="number"
                   value={detectedBpm}
                   onChange={(e) => setDetectedBpm(Number(e.target.value))}
                   className="bg-[#ccc] px-2 py-0.5 rounded text-[12px] font-black outline-none border-b-2 border-[#bbb] w-16"
                 />
               </div>
               <div className="flex flex-col">
                 <span className="text-[8px] font-black text-[#888] mb-1">AUTO-BARS</span>
                 <div className="flex gap-1">
                   {[1, 2, 4, 8].map(b => (
                     <button 
                       key={b}
                       onClick={() => applyBarSelection(b)}
                       className={`px-2 py-1 rounded text-[8px] font-black transition-colors ${selectedBars === b ? 'bg-[#333] text-white' : 'bg-[#bbb] text-[#333]'}`}
                     >
                       {b}B
                     </button>
                   ))}
                 </div>
               </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-full bg-[#ff4a4a] border-b-4 border-[#992222] flex items-center justify-center text-white cursor-pointer active:translate-y-1 active:border-b-0 shadow-lg" onClick={() => setIsPlaying(!isPlaying)}>
                   {isPlaying ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                 </div>
                 <div className="w-12 h-12 rounded-full bg-[#f8e71c] border-b-4 border-[#b8a70c] flex items-center justify-center text-black cursor-pointer active:translate-y-1 active:border-b-0 shadow-lg" onClick={collectLoop}>
                   <Save size={20} />
                 </div>
               </div>
            </div>
          </div>

          {/* Collection Sidebar */}
          <div className="w-64 flex flex-col gap-4 bg-[#e5e5e5] p-4 rounded-3xl border-4 border-[#d0d0d0] shadow-inner">
            <div className="flex justify-between items-center pb-2 border-b-2 border-[#d0d0d0]">
              <span className="text-[10px] font-black text-[#666] tracking-widest">COLLECTION</span>
              <span className="bg-[#444] text-[10px] text-white px-2 rounded-full">{savedLoops.length}</span>
            </div>
              
            <div className="flex-grow overflow-y-auto pr-2 flex flex-col gap-2 scrollbar-hide">
              {savedLoops.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-[10px] text-center px-4">
                  Slices will appear here for batch export
                </div>
              ) : (
                savedLoops.map(loop => (
                  <div key={loop.id} className="bg-white p-3 rounded-xl border-b-2 border-[#ccc] flex flex-col gap-2 group">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black truncate max-w-[100px]">{loop.name}</span>
                      <span className="text-[8px] font-bold text-[#888]">{loop.duration.toFixed(1)}s</span>
                    </div>
                    <div className="flex gap-1 h-8">
                      <button 
                        onClick={() => exportLoop(loop)}
                        className="flex-grow bg-[#50e3c2] rounded-md text-[10px] font-black flex items-center justify-center hover:brightness-105 active:scale-95 transition-all"
                      >
                        <Download size={14} />
                      </button>
                      <button 
                        onClick={() => setSavedLoops(savedLoops.filter(l => l.id !== loop.id))}
                        className="w-8 bg-[#ff4a4a]/20 text-[#ff4a4a] rounded-md flex items-center justify-center hover:bg-[#ff4a4a] hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
              
            <div className="flex flex-col gap-2">
              <button 
                className="w-full h-12 bg-[#333] text-white rounded-xl text-[10px] font-black tracking-widest shadow-xl active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={savedLoops.length === 0 || isExporting}
                onClick={batchExport}
              >
                {isExporting ? "EXPORTING..." : "BATCH EXPORT"}
              </button>
                
              <button 
                className="w-full h-10 bg-[#bbb] text-[#333] rounded-xl text-[9px] font-black tracking-widest shadow-lg active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                disabled={savedLoops.length === 0}
                onClick={exportAsSampleChain}
              >
                EXPORT AS SAMPLE CHAIN
              </button>
              <p className="text-[7px] text-[#888] text-center uppercase font-bold px-2">
                Sample Chain combines all loops into one file (ideal for OP-1 Drum Mode)
              </p>
            </div>
          </div>
        </div>
      </TeenageUI>
    </div>
  );
}

// Utility to convert AudioBuffer to WAV blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const length = buffer.length * buffer.numberOfChannels * 2 + 44;
  const view = new DataView(new ArrayBuffer(length));
  const sampleRate = buffer.sampleRate;
  
  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, length - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, buffer.numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * buffer.numberOfChannels * 2, true);
  view.setUint16(32, buffer.numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length - 44, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      let sample = buffer.getChannelData(channel)[i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}