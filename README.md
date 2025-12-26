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

### 🎛️ Supported Devices
✅ OP-XY (ENVY) - WAV format with metadata

✅ OP-1 (OG) - AIFF format with TE metadata

✅ OP-Z - AIFF format

✅ EP-133 KO II - WAV format

✅ OP-1 FIELD - WAV format with metadata

🎨 Tech Stack
Frontend: React 18 + TypeScript

Styling: Tailwind CSS

Build Tool: Vite

Audio Processing: Web Audio API

Desktop: Electron

Icons: Lucide React




## 🚀 How to Run Locally (Any OS: Windows/macOS/Linux)

### Option 1: In Browser (Easiest)
1. **Install Node.js** (version 18 or higher):
   - Windows/macOS: Download from [nodejs.org](https://nodejs.org/)
   - Linux: `sudo apt install nodejs npm` (Ubuntu/Debian)

2. **Download the project**:
```bash
# Option A: Via Git
git clone https://github.com/your-username/loop-cutter.git
cd loop-cutter

# Option B: Download ZIP from GitHub
# 1. Click "Code" → "Download ZIP"
# 2. Extract the archive
# 3. Open terminal in the project folder
```

3. **Install dependencies**:
```bash
npm install
```

4. **Start the local server**:
```bash
npm run dev
```

5. **Open in browser**: `http://localhost:5173`

### Option 2: As Desktop App (macOS only for now)

#### For macOS:
1. **Download** `Loop Cutter.dmg` from [Releases](https://github.com/your-username/loop-cutter/releases)
2. **Open the DMG file**
3. **Drag** the app to Applications folder
4. **Launch** from Launchpad or Finder

**⚠️ Note for Windows/Linux users**:  
Desktop version for your OS is currently in development. Use Option 1 (browser) - all features are identical!

## 🎯 How to Use

1. **Load Audio**:
   - Drag & drop audio file (WAV, MP3, AIFF) into the center area
   - Or click "Load Source Audio"
   
2. **Select Loops**:
   - Click and drag on the waveform
   - Use 1B, 2B, 4B, 8B buttons for automatic bar-based selection
   
3. **Adjust Settings**:
   - **TARGET DEVICE**: Choose your device (OP-1, OP-XY, etc.)
   - **BPM**: Tempo (auto-detected or manual)
   - **LOOP LENGTH**: Duration of selected region
   
4. **Save & Export**:
   - Click yellow save button to add to collection
   - Use "BATCH EXPORT" for all loops
   - Use "EXPORT AS SAMPLE CHAIN" for TE-compatible patches

## 🔧 For Developers

```bash
# Development
npm run dev            # Start web server
npm run electron:dev   # Start Electron app (desktop)

# Build
npm run build          # Build web version
npm run electron:build # Build desktop apps
```

## 📦 Project Status

- ✅ **Web version**: Fully functional (all browsers)
- ✅ **macOS app**: Available (see Releases)
- 🔄 **Windows app**: In development
- 🔄 **Linux app**: Planned

## 🤝 Contributing

Want Windows/Linux builds? Help us set up GitHub Actions! PRs welcome.

## 📄 License

MIT - Free to use and modify
```

## Additional notes to add to your project:

### Update package.json with better scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "electron:dev": "concurrently -k \"vite\" \"wait-on tcp:5173 && cross-env NODE_ENV=development electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:build:mac": "npm run build && electron-builder --mac",
    "electron:build:win": "echo 'Windows build requires GitHub Actions setup'",
    "help": "echo 'Run npm run dev for web version or npm run electron:dev for desktop (macOS)'"
  }
}
```

### Create a simple setup script for new users:
```bash
cat > setup.sh << 'EOF'
#!/bin/bash
echo "🚀 Loop Cutter Setup"
echo "===================="

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup complete!"
echo ""
echo "To start the app:"
echo "  Web version:    npm run dev"
echo "  Desktop (macOS): npm run electron:dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
EOF

chmod +x setup.sh
```

