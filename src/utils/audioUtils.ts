export function detectBPM(buffer: AudioBuffer): number {
  const data = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  
  const downsampleFactor = 16;
  const downsampledLength = Math.floor(data.length / downsampleFactor);
  const envelope = new Float32Array(downsampledLength);
  
  for (let i = 0; i < downsampledLength; i++) {
    let sum = 0;
    for (let j = 0; j < downsampleFactor; j++) {
      const val = data[i * downsampleFactor + j];
      sum += val * val;
    }
    envelope[i] = Math.sqrt(sum / downsampleFactor);
  }

  const minBpm = 50;
  const maxBpm = 220;
  const minInterval = Math.floor((60 / maxBpm) * (sampleRate / downsampleFactor));
  const maxInterval = Math.floor((60 / minBpm) * (sampleRate / downsampleFactor));

  let bestInterval = 0;
  let maxCorrelation = 0;

  const analysisSeconds = 15;
  const checkLength = Math.min(envelope.length, Math.floor(analysisSeconds * (sampleRate / downsampleFactor)));

  for (let interval = minInterval; interval < maxInterval; interval++) {
    let correlation = 0;
    let count = 0;
    for (let i = 0; i < checkLength - interval; i += 2) {
      correlation += envelope[i] * envelope[i + interval];
      count++;
    }
    const normalizedCorr = correlation / count;
    if (normalizedCorr > maxCorrelation) {
      maxCorrelation = normalizedCorr;
      bestInterval = interval;
    }
  }

  if (bestInterval === 0) return 120;
  let bpm = 60 / (bestInterval * (downsampleFactor / sampleRate));
  return Math.round(bpm);
}

export function exportTEPatch(loops: { buffer: AudioBuffer }[], device: string, bpm: number): { blob: Blob, extension: string } {
  const TARGET_SAMPLE_RATE = 44100;
  
  // OG OP-1 and OP-Z usually prefer AIFF for metadata patches
  const useAif = device === "OP-1 (OG)" || device === "OP-Z";
  
  if (useAif) {
    return {
      blob: buildTEAif(loops, TARGET_SAMPLE_RATE, device, bpm),
      extension: "aif"
    };
  } else {
    return {
      blob: buildTEWav(loops, TARGET_SAMPLE_RATE, device, bpm),
      extension: "wav"
    };
  }
}

function buildTEAif(loops: { buffer: AudioBuffer }[], sampleRate: number, device: string, bpm: number): Blob {
  const metadata = {
    type: "drum",
    dev: device,
    bpm: Math.round(bpm * 100),
    start: loops.map((_, i) => {
      let offset = 0;
      for (let j = 0; j < i; j++) offset += loops[j].buffer.length;
      return Math.floor((offset / sampleRate) * 44100 * 4096);
    }),
    end: loops.map((_, i) => {
      let offset = 0;
      for (let j = 0; j <= i; j++) offset += loops[j].buffer.length;
      return Math.floor((offset / sampleRate) * 44100 * 4096);
    })
  };

  const metadataString = JSON.stringify(metadata);
  const metadataBytes = new TextEncoder().encode(metadataString);
  const totalAudioSamples = loops.reduce((acc, l) => acc + l.buffer.length, 0);
  
  // AIFF is Big Endian
  // FORM (12) + COMM (26) + SSND (8 + total) + APPL (12 + meta)
  const commSize = 18;
  const ssndHeaderSize = 8;
  const applHeaderSize = 12;
  const dataSize = totalAudioSamples * 2 * 2;
  const totalSize = 12 + (8 + commSize) + (8 + ssndHeaderSize + dataSize) + (8 + applHeaderSize + metadataBytes.length);

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // FORM
  writeString(view, 0, 'FORM');
  view.setUint32(4, totalSize - 8, false);
  writeString(view, 8, 'AIFF');

  // COMM
  let offset = 12;
  writeString(view, offset, 'COMM');
  view.setUint32(offset + 4, commSize, false);
  view.setUint16(offset + 8, 2, false); // Channels
  view.setUint32(offset + 10, totalAudioSamples, false); // Frames
  view.setUint16(offset + 14, 16, false); // Bit depth
  // Sample rate in 80-bit float (10 bytes) - simplified for 44100
  const srBuf = new Uint8Array([0x40, 0x0E, 0xAC, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  for(let i=0; i<10; i++) view.setUint8(offset + 16 + i, srBuf[i]);

  // SSND
  offset += 8 + commSize;
  writeString(view, offset, 'SSND');
  view.setUint32(offset + 4, ssndHeaderSize + dataSize, false);
  view.setUint32(offset + 8, 0, false); // Offset
  view.setUint32(offset + 12, 0, false); // Block size

  offset += 16;
  loops.forEach(loop => {
    const left = loop.buffer.getChannelData(0);
    const right = loop.buffer.numberOfChannels > 1 ? loop.buffer.getChannelData(1) : left;
    for (let i = 0; i < loop.buffer.length; i++) {
      view.setInt16(offset, Math.max(-1, Math.min(1, left[i])) * 0x7FFF, false);
      view.setInt16(offset + 2, Math.max(-1, Math.min(1, right[i])) * 0x7FFF, false);
      offset += 4;
    }
  });

  // APPL
  writeString(view, offset, 'APPL');
  view.setUint32(offset + 4, 4 + metadataBytes.length, false);
  writeString(view, offset + 8, 'op-1');
  for (let i = 0; i < metadataBytes.length; i++) {
    view.setUint8(offset + 12 + i, metadataBytes[i]);
  }

  return new Blob([buffer], { type: 'audio/x-aiff' });
}

function buildTEWav(loops: { buffer: AudioBuffer }[], sampleRate: number, device: string, bpm: number): Blob {
  // Metadata format for OP-1 Field / OP-XY Envy Engine
  const metadata = {
    type: "drum",
    dev: device,
    bpm: Math.round(bpm * 100),
    kit: "envy",
    // Start and End points in samples * 4096 (TE internal units)
    start: loops.map((_, i) => {
      let offset = 0;
      for (let j = 0; j < i; j++) offset += loops[j].buffer.length;
      return Math.floor((offset / sampleRate) * 44100 * 4096);
    }),
    end: loops.map((_, i) => {
      let offset = 0;
      for (let j = 0; j <= i; j++) offset += loops[j].buffer.length;
      return Math.floor((offset / sampleRate) * 44100 * 4096);
    })
  };

  const metadataString = JSON.stringify(metadata);
  const metadataBytes = new TextEncoder().encode(metadataString);
  
  const totalAudioSamples = loops.reduce((acc, l) => acc + l.buffer.length, 0);
  const headerSize = 44;
  // 'appl' + size + 'op-1' + metadata
  const metaChunkSize = 4 + 4 + 4 + metadataBytes.length;
  // Padding for 2-byte alignment if needed
  const padding = metadataBytes.length % 2 === 0 ? 0 : 1;
  
  const dataSize = totalAudioSamples * 2 * 2; // 16-bit Stereo
  const fileSize = headerSize + dataSize + metaChunkSize + padding;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // RIFF
  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 2, true); // Stereo
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);

  // data
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  loops.forEach(loop => {
    // Basic normalization/clipping protection
    const left = loop.buffer.getChannelData(0);
    const right = loop.buffer.numberOfChannels > 1 ? loop.buffer.getChannelData(1) : left;
      
    // Find peak for normalization
    let peak = 0;
    for (let i = 0; i < left.length; i++) {
      peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
    }
    const scalar = peak > 0 ? (0.95 / peak) : 1;

    for (let i = 0; i < loop.buffer.length; i++) {
      view.setInt16(offset, Math.max(-1, Math.min(1, left[i] * scalar)) * 0x7FFF, true);
      view.setInt16(offset + 2, Math.max(-1, Math.min(1, right[i] * scalar)) * 0x7FFF, true);
      offset += 4;
    }
  });

  // 'appl' chunk (standard for OP-1 / OP-XY metadata)
  writeString(view, offset, 'appl');
  view.setUint32(offset + 4, 4 + metadataBytes.length, true); // size of 'op-1' + json
  writeString(view, offset + 8, 'op-1');
  for (let i = 0; i < metadataBytes.length; i++) {
    view.setUint8(offset + 12 + i, metadataBytes[i]);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}