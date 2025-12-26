{\rtf1\ansi\ansicpg1251\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Italic;\f1\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red143\green144\blue150;\red13\green14\blue17;\red147\green0\blue147;
\red42\green44\blue51;\red50\green94\blue238;\red66\green147\blue62;\red167\green87\blue5;}
{\*\expandedcolortbl;;\cssrgb\c62745\c63137\c65490;\cssrgb\c5882\c6667\c8235;\cssrgb\c65098\c14902\c64314;
\cssrgb\c21961\c22745\c25882;\cssrgb\c25098\c47059\c94902;\cssrgb\c31373\c63137\c30980;\cssrgb\c71765\c41961\c392;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\i\fs26 \cf2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # Loop Cutter \uc0\u55356 \u57269 \u9986 \u65039 
\f1\i0 \cf3 \strokec3 \
\
Offline Loop Cutter \cf4 \strokec4 for\cf3 \strokec3  Teenage Engineering Devices \cf5 \strokec5 (\cf3 \strokec3 OP-1, OP-XY, OP-Z, EP-133 KO II\cf5 \strokec5 )\cf3 \strokec3 \
\
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 !\cf5 \strokec5 [\cf3 \strokec3 Loop Cutter Screenshot\cf5 \strokec5 ](\cf3 \strokec3 public/assets/screenshot.png\cf5 \strokec5 )\cf3 \strokec3 \
\
\pard\pardeftab720\partightenfactor0

\f0\i \cf2 \strokec2 ## \uc0\u10024  Features
\f1\i0 \cf3 \strokec3 \
\
- \uc0\u55356 \u57263  **Waveform Visualization** - Visual audio editing with precise selection\
- \uc0\u55356 \u57242 \u65039  **TE Device Compatibility** - Export \cf4 \strokec4 for\cf3 \strokec3  OP-1, OP-XY, OP-Z, EP-133 KO II\
- \uc0\u55357 \u56580  **Auto BPM Detection** - Automatically detect BPM of uploaded audio\
- \uc0\u9986 \u65039  **Precision Slicing** - Create perfect loops from any audio \cf7 \strokec7 source\cf3 \strokec3 \
- \uc0\u55357 \u56550  **Batch Export** - Export multiple loops at once\
- \uc0\u55356 \u57269  **Sample Chain Creation** - Combine loops into TE-compatible patches\
- \uc0\u55356 \u57104  **Offline Ready** - PWA that works without internet connection\
\

\f0\i \cf2 \strokec2 ## \uc0\u55357 \u56960  Quick Start
\f1\i0 \cf3 \strokec3 \
\

\f0\i \cf2 \strokec2 ### Web Version
\f1\i0 \cf3 \strokec3 \
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 1\cf3 \strokec3 . Visit \cf5 \strokec5 [\cf3 \strokec3 loop-cutter.app\cf5 \strokec5 ](\cf3 \strokec3 https://your-username.github.io/loop-cutter\cf5 \strokec5 )\cf3 \strokec3  \cf5 \strokec5 (\cf3 \strokec3 when deployed\cf5 \strokec5 )\cf3 \strokec3 \
\cf8 \strokec8 2\cf3 \strokec3 . Upload an audio \cf6 \strokec6 file\cf3 \strokec3  \cf5 \strokec5 (\cf3 \strokec3 WAV, MP3, etc.\cf5 \strokec5 )\cf3 \strokec3 \
\cf8 \strokec8 3\cf3 \strokec3 . Select your loop region\
\cf8 \strokec8 4\cf3 \strokec3 . Save slices and \cf7 \strokec7 export\cf3 \strokec3 \
\
\pard\pardeftab720\partightenfactor0

\f0\i \cf2 \strokec2 ### Desktop App (macOS)
\f1\i0 \cf3 \strokec3 \
\pard\pardeftab720\partightenfactor0
\cf8 \strokec8 1\cf3 \strokec3 . Download \cf6 \strokec6 `Loop Cutter.dmg`\cf3 \strokec3  from Releases\
\cf8 \strokec8 2\cf3 \strokec3 . Drag to Applications folder\
\cf8 \strokec8 3\cf3 \strokec3 . Run the app\
\
\pard\pardeftab720\partightenfactor0

\f0\i \cf2 \strokec2 ## \uc0\u55357 \u56615  Development
\f1\i0 \cf3 \strokec3 \
\
```bash\

\f0\i \cf2 \strokec2 # Clone repository
\f1\i0 \cf3 \strokec3 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 git\cf3 \strokec3  clone https://github.com/your-username/loop-cutter.git\
\pard\pardeftab720\partightenfactor0
\cf7 \strokec7 cd\cf3 \strokec3  loop-cutter\
\
\pard\pardeftab720\partightenfactor0

\f0\i \cf2 \strokec2 # Install dependencies
\f1\i0 \cf3 \strokec3 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 npm\cf3 \strokec3  \cf6 \strokec6 install\cf3 \strokec3 \
\
\pard\pardeftab720\partightenfactor0

\f0\i \cf2 \strokec2 # Run development server
\f1\i0 \cf3 \strokec3 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 npm\cf3 \strokec3  run dev\
\
\pard\pardeftab720\partightenfactor0

\f0\i \cf2 \strokec2 # Build for production
\f1\i0 \cf3 \strokec3 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 npm\cf3 \strokec3  run build\
\
\pard\pardeftab720\partightenfactor0

\f0\i \cf2 \strokec2 # Run Electron app (desktop)
\f1\i0 \cf3 \strokec3 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 npm\cf3 \strokec3  run electron:dev\
\
\pard\pardeftab720\partightenfactor0

\f0\i \cf2 \strokec2 # Build macOS app
\f1\i0 \cf3 \strokec3 \
\pard\pardeftab720\partightenfactor0
\cf6 \strokec6 npm\cf3 \strokec3  run electron:build:mac\
}