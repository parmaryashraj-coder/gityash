# Nexora - Music Player & Media Studio
### Academic Web & Multimedia College Project

A lightweight, high-performance multimedia web application built using **HTML5, CSS3, JavaScript (ES6+), and Java (Java SE)**. It combines a modern music streaming player featuring **Hindi, English, Gujarati, and Punjabi songs libraries** with client-side media tools: an **Audio Cutter / Trimmer** and a **Video Studio (Cut Video & Add Audio)**.

---

## Key Highlights for College Project Reviews

- **Zero Heavy Frameworks:** Pure web standards and native Java SE standard library. No `node_modules`, `npm`, `React`, `Maven`, or `Gradle` required.
- **Client-Side Media Processing:** Waveform drawing, audio slicing, 16-bit PCM WAV binary generation, and video soundtrack mixing run directly in browser memory using the **Web Audio API** and **HTML5 Canvas**.
- **100% Fully Commented Code:** Every section and function in `index.html`, `style.css`, `app.js`, and `Server.java` is documented with clean English line-by-line comments.
- **Detailed Viva Guide:** Includes a complete project defense guide with top 15 viva questions and answers in [`COLLEGE_PROJECT_GUIDE.md`](./COLLEGE_PROJECT_GUIDE.md).

---

## Core Modules Overview

### 1. Music Player & Multi-Language Libraries
- **16 Curated Real Songs:**
  - **Hindi:** *Kesariya*, *Tum Hi Ho*, *Apna Bana Le*, *Raataan Lambiyan*
  - **English:** *Blinding Lights*, *Shape of You*, *Starboy*, *Levitating*
  - **Gujarati:** *Khalasi (Gotilo)*, *Dholida*, *Vhalam Aavo Ne*, *Chogada Tara*
  - **Punjabi:** *Brown Munde*, *Excuses*, *Amplifier*, *Pasoori*
- **Instant Language Filters:** Filter pills for `All`, `Hindi`, `English`, `Gujarati`, `Punjabi`, and `My Trimmed Clips`.
- **Playback Reliability:** Local `.m4a` audio with automated fallback to verified online audio streams if local files cannot be read.
- **User Authentication:** Login overlay screen on first visit, 1-click **Quick Guest Login** for immediate demonstration, password show/hide toggle, and profile avatar with initials saved in `localStorage`.
- **Full Player Transport:** Play, Pause, Previous, Next, Shuffle, Repeat, clickable Seek bar, Volume slider, and animated mini audio visualizer.
- **Live Search Engine:** Real-time filtering by song title, artist, language, and genre.

### 2. Audio Cutter & Trimmer Studio
- **Raw PCM Waveform Canvas:** Visualizes audio amplitude peaks on an interactive HTML5 Canvas.
- **Precision Trimming:** Adjust start and end cut points via canvas click or numeric inputs (0.1s precision).
- **Preview Slicing:** Auditions the selected segment using a Web Audio `AudioBufferSourceNode`.
- **Client-Side WAV Encoder:** Directly builds a standard 44-byte RIFF/WAVE header and 16-bit PCM binary Blob without needing any backend server or third-party library.
- **Add Cut to Library:** Adds the trimmed audio clip directly back into the session playlist under category `"trimmed"`.

### 3. Video Studio (Cut Video & Add Audio)
- **Video Trimming:** Dual range sliders to set video Trim-In and Trim-Out boundaries.
- **Demo Video Generator:** Built-in animated canvas video generator to test video trimming without needing a video file.
- **Multi-Track Soundtrack Mixer:** Select any song from the library or upload a custom audio file, with independent volume sliders for original video audio and background music.
- **Video Export:** Combines canvas video frames and mixed audio tracks into a downloadable `.webm` video file using the browser's `MediaRecorder` API.

### 4. Standalone Java Server (`Server.java`)
- **Native Java HTTP Server:** Built using `com.sun.net.httpserver.HttpServer` from Java SE.
- **MIME Type Mapping:** Maps extensions (`.html`, `.css`, `.js`, `.m4a`, `.aac`, `.mp4`, `.jpg`, `.wav`) to valid HTTP headers.
- **Security:** Canonical path verification prevents directory traversal attacks (`../../`).
- **Status Endpoint:** Exposes `/api/status` for server health verification.

---

## Quick Start (How to Run)

### Option 1: One-Click Runner (Windows)
Double-click **`run.bat`** in the project folder. It detects Java, compiles `Server.java`, launches the server, and automatically opens your browser at:
```
http://localhost:8080/
```

### Option 2: Run with Java
1. Open Command Prompt or PowerShell in this directory:
   ```cmd
   javac Server.java
   java Server
   ```
2. Open your browser and navigate to `http://localhost:8080/`.

### Option 3: Run with PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

### Option 4: Direct Browser Open (Offline Mode)
Double-click **`index.html`** to open directly in Google Chrome, Microsoft Edge, or Mozilla Firefox.

---

## Project Documentation
For viva preparation, architecture diagrams, module breakdowns, and top 15 oral examination questions and answers, open:
- [**COLLEGE_PROJECT_GUIDE.md**](./COLLEGE_PROJECT_GUIDE.md)
