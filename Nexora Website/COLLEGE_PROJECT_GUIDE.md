# Nexora - College Project Documentation & Viva Guide

## Project Title
**Nexora - Web-Based Music Streaming & Media Editing Suite**

- **Subject / Domain:** Web Technologies, Multimedia Systems, Full-Stack Development
- **Languages Used:** HTML5, CSS3, JavaScript (ES6+), Java (Standard Edition - Java SE)
- **Zero Framework Overhead:** Built entirely with native web standards and core Java libraries (no Node.js, npm, React, Maven, or Gradle required).

---

## 1. Project Abstract & Objectives

### Abstract
Nexora is an all-in-one web multimedia platform combining a modern streaming music player with client-side audio and video editing studios. The application features a curated multi-language music catalog covering **Hindi, English, Gujarati, and Punjabi** music, an interactive **Audio Cutter** that visualizes raw PCM audio waveforms on an HTML5 Canvas, and a **Video Studio** capable of trimming videos and mixing multi-track soundtracks directly within the client browser. The backend is powered by a lightweight, standalone Java HTTP server that serves static media assets and provides a RESTful health status endpoint.

### Key Objectives
1. Build a high-performance, responsive streaming interface with zero external CSS or JavaScript dependencies.
2. Implement real-time audio manipulation and waveform analysis using the browser's native **Web Audio API**.
3. Enable in-browser audio slicing and 16-bit PCM WAV binary file generation without server-side processing.
4. Composite video streams and layered audio soundtracks using **HTML5 Canvas** and the **MediaStream Recording API**.
5. Develop a standalone **Java HTTP Server** adhering to the standard Java SE runtime (`com.sun.net.httpserver`).

---

## 2. System Architecture & File Structure

```
nexora-media-studio/
|
|-- index.html              # Frontend structure, semantic layouts, and studio views
|-- style.css               # Design system, CSS Grid, animations, and dark theme
|-- app.js                  # Application logic, audio playback, waveform canvas, and editors
|-- Server.java             # Standalone Java HTTP server backend (zero dependencies)
|-- server.ps1              # Native Windows PowerShell HTTP server script
|-- run.bat                 # One-click Windows runner script
|
|-- audio/                  # 16 multi-language audio files (.m4a)
|   |-- kesariya.m4a, tum_hi_ho.m4a, apna_bana_le.m4a, raataan_lambiyan.m4a
|   |-- blinding_lights.m4a, shape_of_you.m4a, starboy.m4a, levitating.m4a
|   |-- khalasi.m4a, dholida.m4a, vhalam_aavo_ne.m4a, chogada.m4a
|   |-- brown_munde.m4a, excuses.m4a, amplifier.m4a, pasoori.m4a
|
|-- covers/                 # 16 matching 300x300 album cover artworks (.jpg)
```

---

## 3. Core Modules & How They Work

### Module 1: User Authentication & Profile (index.html, app.js, style.css)
- **Initial Login Modal:** When a user visits the website for the first time, an overlay (`#login-overlay`) is presented.
- **Session Persistence:** Login state is saved to `localStorage` under the key `"nexora_user"`.
- **Guest Access:** Includes a 1-click **Quick Guest Login** button (`#btn-guest-login`) for instant demo presentation.
- **Password Visibility:** Toggle button switches the password field between `type="password"` and `type="text"`.
- **User Avatar Initials:** Automatically generates initials (e.g., "Producer Alex" -> `PA`).

### Module 2: Multi-Language Music Streaming Engine (app.js, index.html)
- **16 Curated Real Songs:** Categorized into Hindi, English, Gujarati, and Punjabi songs.
- **Local Playback with Online Fallback:** Songs stream locally from the `audio/` directory. If a file cannot be loaded locally, an automated `error` event listener on `mainAudio` seamlessly switches to an online preview stream with zero interruption.
- **Language Filter Pills:** 1-click filter buttons (`All`, `Hindi`, `English`, `Gujarati`, `Punjabi`, `Trimmed Clips`) dynamically filter the catalog.
- **Live Search Engine:** Instant multi-field filtering by song title, artist, language, and genre as the user types into the search box.
- **Transport Controls:** Play, Pause, Next, Previous, Shuffle (random index), Repeat (looping `ended` listener), Scrubber Seek, Volume control, and Mute.

### Module 3: Audio Cutter & Waveform Trimmer (app.js, index.html)
- **Waveform Canvas Visualization:** Uses `AudioContext.decodeAudioData()` to extract raw PCM audio samples into a floating-point array (`Float32Array`). Samples are sampled across canvas width and drawn using HTML5 Canvas 2D context (`ctx.fillRect`).
- **Precision Trimming:** Users can set Start and End timestamps either by clicking on the waveform canvas or by entering precise values down to 0.1s.
- **Preview Slice:** Uses an `AudioBufferSourceNode` connected to `audioContext.destination` to audition only the sliced range (`startTime` to `endTime`).
- **Client-Side WAV Encoder:** `createSlicedAudioBlob()` renders the sliced segment into an `OfflineAudioContext`, which is then passed to `audioBufferToWavBlob()`. This function writes the 44-byte standard RIFF/WAVE header and 16-bit PCM samples into an `ArrayBuffer` without any server processing.
- **Add Cut to Library:** Adds the trimmed audio clip directly back into the session playlist under category `"trimmed"`, making it playable instantly.

### Module 4: Video Studio with Soundtrack Overlay (app.js, index.html)
- **Video Loading & Trimming:** Loads video files (`<video id="studio-video">`) and allows setting Trim-In and Trim-Out points via dual range sliders.
- **Built-in Demo Generator:** If the user has no video file handy, `generateDemoVideoClip()` uses an animated HTML5 Canvas and `MediaRecorder` to generate an interactive 10-second demo clip on the fly.
- **Soundtrack Overlay & Mixer:** Users can choose any song from the library or upload a custom audio track. Dual volume sliders control the original video volume vs. the added background music volume.
- **Export Compositing:** Captures canvas video frames at 30fps (`canvas.captureStream(30)`), mixes audio through a Web Audio `MediaStreamDestination`, and records the combined stream into a downloadable `.webm` video file via `MediaRecorder`.

### Module 5: Standalone Java Backend Server (Server.java)
- **Core Technology:** Built using `com.sun.net.httpserver.HttpServer` from Java Standard Edition (Java SE).
- **Zero Third-Party Dependencies:** No Apache Tomcat, Spring, or Jetty required.
- **MIME Type Mapping:** Maps extensions (`.html`, `.css`, `.js`, `.m4a`, `.aac`, `.mp4`, `.jpg`, `.wav`) to valid HTTP `Content-Type` headers.
- **Directory Traversal Protection:** Normalizes paths and verifies that `requestedFile.startsWith(ROOT_DIR)` to prevent unauthorized access to parent directories (`../../`).
- **Health Endpoint:** Exposes `/api/status` responding with JSON status: `{"status":"online","server":"Nexora Java Server","port":8080}`.

---

## 4. Top 15 College Viva / Oral Exam Questions & Answers

### Q1: What is the main objective of the Nexora project?
> **Answer:** Nexora is a full-stack multimedia web platform that combines a multi-language music streaming player (supporting Hindi, English, Gujarati, and Punjabi songs) with client-side editing tools: an Audio Cutter that visualizes audio waveforms and exports WAV files, and a Video Studio that trims video and mixes layered soundtracks. It is backed by a standalone Java HTTP server.

### Q2: Why did you build the project without heavy frameworks like React, Angular, or Spring Boot?
> **Answer:** Building with pure HTML5, CSS3, ES6+ JavaScript, and core Java demonstrates a fundamental mastery of the underlying web standards, DOM manipulation, Web Audio API, Canvas 2D API, and socket-level HTTP streaming. It also keeps the project lightweight, portable, and runs on any standard computer with zero build tool setup (`npm install` or `mvn compile`).

### Q3: What is the difference between the HTML5 `<audio>` element and the `AudioContext` (Web Audio API)?
> **Answer:** 
> - The standard `<audio>` element is designed for basic playback (play, pause, seek, volume) of streaming audio files.
> - The `AudioContext` (Web Audio API) provides low-level digital signal processing. It allows decoding compressed audio files into raw PCM floating-point sample buffers, analyzing waveforms, routing audio through custom gain nodes for mixing, and rendering offline slices into new audio files.

### Q4: How is the audio waveform drawn on the screen?
> **Answer:** In `drawWaveform(buffer)` in `app.js`:
> 1. We decode the audio file into an `AudioBuffer` using `audioContext.decodeAudioData()`.
> 2. We extract the raw PCM data of Channel 0 using `buffer.getChannelData(0)`.
> 3. We divide the total samples by the canvas width to calculate step size.
> 4. For each pixel column, we determine the minimum and maximum amplitude and draw a vertical bar on the HTML5 Canvas (`ctx.fillRect`) proportional to the volume height.

### Q5: How does the Audio Cutter export a `.wav` file entirely in the browser without a backend server?
> **Answer:** The function `audioBufferToWavBlob()` constructs a binary RIFF/WAVE file from scratch:
> 1. It allocates an `ArrayBuffer` of size `44 + (samples * channels * 2)`.
> 2. It writes the standard 44-byte WAVE header (RIFF descriptor, format sub-chunk with sample rate and bit depth of 16-bit, and data sub-chunk header).
> 3. It loops through the sliced PCM floating-point audio samples (-1.0 to +1.0), clamps them, converts them to signed 16-bit integers (-32768 to 32767), and writes them using a JavaScript `DataView`.
> 4. The `ArrayBuffer` is wrapped into a `Blob` of MIME type `audio/wav`, and an automatic download link is triggered.

### Q6: How does the Video Studio combine a video with a new soundtrack?
> **Answer:** In `btnExportVideo` in `app.js`:
> 1. An HTML5 Canvas captures video frames continuously using `ctx.drawImage(studioVideo, 0, 0, width, height)`.
> 2. A 30fps video stream is extracted using `canvas.captureStream(30)`.
> 3. The original video audio and the chosen soundtrack audio are piped through separate `GainNode` volume controllers into a Web Audio `MediaStreamDestination`.
> 4. The video tracks from the canvas stream and the audio tracks from the destination stream are merged into a single `MediaStream`.
> 5. A `MediaRecorder` encodes the combined stream into a `.webm` video file in real-time.

### Q7: What happens if an audio file is missing or fails to load from disk?
> **Answer:** In `app.js`, `mainAudio` has an automated `error` event listener. If a local `.m4a` file fails to load, the player detects this and automatically switches `mainAudio.src` to the verified online fallback stream (`fallbackUrl`). If the player was in the playing state, it automatically resumes playback without crashing.

### Q8: How does user authentication work, and how is the session maintained?
> **Answer:** When a user logs in (or clicks "Quick Guest Login"), `applyLoggedInUser()` saves their username in the browser's `localStorage` (`localStorage.setItem("nexora_user", username)`). On every page load, `checkUserLogin()` checks `localStorage`. If a user is found, the login modal is automatically hidden and their profile initials and greeting are updated.

### Q9: How does the Java server handle static file serving and MIME types?
> **Answer:** In `Server.java`:
> 1. It creates an `HttpServer` bound to port `8080`.
> 2. A `StaticFileHandler` captures all incoming GET requests and maps the URL path to a local file in the project folder.
> 3. A `MIME_TYPES` `HashMap` determines the correct HTTP `Content-Type` header (e.g., `.m4a` -> `audio/mp4`, `.js` -> `application/javascript`, `.html` -> `text/html`).
> 4. It sets HTTP status `200 OK` and streams the file's raw bytes directly to the browser response body via an `OutputStream`.

### Q10: What security measures are implemented in `Server.java`?
> **Answer:** Directory traversal prevention: An attacker could request `/../../Windows/System32/file`. In `Server.java`, the server normalizes the requested path using `targetFile.getCanonicalPath()` and verifies that `targetFile.startsWith(ROOT_DIR.getCanonicalPath())`. If someone tries to access parent directories outside the root folder, the server returns an HTTP `403 Forbidden` error.

### Q11: How does the live search filter work?
> **Answer:** In `renderTracksUI(filterQuery)`:
> As the user types in `#search-input`, the `input` event triggers. It filters the array of songs using JavaScript's `.filter()` method, checking whether the search string matches `title`, `artist`, `language`, or `genre` (using `.toLowerCase().includes(query)`). The table and quick pick cards re-render instantly without reloading the page.

### Q12: Why are all CSS variables declared inside `:root`?
> **Answer:** Declaring design tokens inside `:root` in `style.css` makes them globally accessible to all elements. It allows centralized management of the color palette (`--primary`, `--bg-base`, `--text-main`), component dimensions (`--sidebar-width`, `--player-height`), and border radii. If we want to re-theme the entire application, we only need to update the `:root` variables.

### Q13: What is the purpose of `run.bat`?
> **Answer:** `run.bat` is a one-click launcher for Windows. It checks if the Java compiler (`javac`) is installed. If available, it compiles `Server.java`, starts the server, and automatically launches the default browser to `http://localhost:8080/`. If Java is not installed, it falls back to the native PowerShell server (`server.ps1`).

### Q14: How does the shuffle and repeat feature work?
> **Answer:** 
> - **Shuffle:** When enabled (`state.isShuffled = true`), `nextTrack()` picks a random integer index between 0 and `state.tracks.length - 1` using `Math.floor(Math.random() * length)`.
> - **Repeat:** When enabled (`state.isRepeated = true`), the `ended` event listener on `mainAudio` resets `mainAudio.currentTime = 0` and calls `playTrack()` instead of moving to the next song.

### Q15: What is the benefit of keeping all comments and text in clean ASCII?
> **Answer:** Non-ASCII multi-byte characters and 4-byte unicode emojis frequently cause character encoding corruption (Mojibake, such as corrupted byte symbols) when moving projects across different text editors, PowerShell terminals, and Windows command prompts. Using pure ASCII text and vector SVGs guarantees 100% stable, cross-platform presentation.

---

## 5. 5-Minute Live Presentation Script for College Viva

When presenting to your professors, follow this smooth 5-minute walkthrough:

1. **Introduction (30 seconds):**
   > "Good morning professors. My project is Nexora, a web-based music streaming and media editing studio. It is developed using clean HTML5, CSS3, modern JavaScript, and a native Java HTTP server without external dependencies."

2. **Login & Interface Overview (1 minute):**
   > "When the site opens, we see a clean authentication screen. I can click 'Quick Guest Login' to authenticate immediately. The application greets the user dynamically based on the current time and restores session state from local storage."

3. **Music Player & Multi-Language Library (1 minute):**
   > "Here on the Home view, we have our multi-language music catalog with Hindi, English, Gujarati, and Punjabi songs. Clicking any language filter pill like 'Gujarati' immediately filters the list and starts playing the first song. We have complete player controls, real-time seek bar, volume control, and an active audio visualizer."

4. **Audio Cutter Tool (1.5 minutes):**
   > "Next, I'll switch to the Audio Cutter studio. Any song can be loaded into this tool. Notice how the raw PCM waveform is drawn directly onto the HTML5 Canvas. I can set the start and end cut points by clicking on the waveform or typing timestamps. Clicking 'Preview Cut' auditions only the slice using the Web Audio API. I can click 'Download Cut Audio' to export a pure 16-bit WAV file generated on-the-fly in browser memory, or click 'Add Cut to Library' to add it directly to my session playlist."

5. **Video Studio & Backend Summary (1 minute):**
   > "Finally, in the Video Studio, we can trim video clips and overlay background music from our song catalog or uploaded audio with independent volume controls. The composited video is recorded via MediaRecorder into a downloadable WebM file. On the backend, Server.java runs on port 8080, handles MIME types, protects against directory traversal, and provides a health check endpoint."

---

*This guide contains everything required to explain, demonstrate, and defend the project in any academic review or viva voce examination.*
