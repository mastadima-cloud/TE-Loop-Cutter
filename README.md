# Loop Cutter 🎵✂️

Offline Loop Cutter for Teenage Engineering Devices (OP-1, OP-XY, OP-Z, EP-133 KO II)
<img width="1661" height="938" alt="Снимок экрана 2025-12-26 в 14 59 51" src="https://github.com/user-attachments/assets/1a9a3690-ff0f-44c0-a902-11d9c9a1addc" />



## ✨ Features

- 🎯 **Waveform Visualization** - Visual audio editing with precise selection
- 🎚️ **TE Device Compatibility** - Export for OP-1, OP-XY, OP-Z, EP-133 KO II
- 🔄 **Auto BPM Detection** - Automatically detect BPM of uploaded audio
- ✂️ **Precision Slicing** - Create perfect loops from any audio source
- 📦 **Batch Export** - Export multiple loops at once
- 🎵 **Sample Chain Creation** - Combine loops into TE-compatible patches
- 🌐 **Offline Ready** - PWA that works without internet connection

## 🚀 Quick Start

### Web Version
1. Visit [loop-cutter.app](https://your-username.github.io/loop-cutter) (when deployed)
2. Upload an audio file (WAV, MP3, etc.)
3. Select your loop region
4. Save slices and export

### Desktop App (macOS)
1. Download `Loop Cutter.dmg` from Releases
2. Drag to Applications folder
3. Run the app

## 🔧 Development

```bash
# Clone repository
git clone https://github.com/your-username/loop-cutter.git
cd loop-cutter

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run Electron app (desktop)
npm run electron:dev

# Build macOS app
npm run electron:build:mac
