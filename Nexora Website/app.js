/**
 * ===================================================================
 * Nexora - Music Player & Media Studio Engine
 * ===================================================================
 * A clean, beginner-friendly JavaScript application built using standard
 * Web APIs (HTML5 Audio, Canvas 2D, Web Audio API, and MediaRecorder).
 * 
 * Main Modules:
 *   1. Application State & Song Database (Hindi, English, Gujarati, Punjabi)
 *   2. Core Audio Player Engine (Play, Pause, Seek, Volume, Fallback)
 *   3. Dynamic UI Rendering & Real-Time Search Filter
 *   4. Custom Audio & Video File Import (Drag & Drop)
 *   5. Audio Cutter Studio (PCM Waveform Canvas & 16-bit WAV Export)
 *   6. Video Studio (Video Trimmer & Soundtrack Audio Mixer)
 *   7. Client-Side 16-bit PCM WAV Binary Encoder
 *   8. User Authentication & Profile Management
 *   9. Application Startup & Initialization
 * ===================================================================
 */

// ===================================================================
// SECTION 1: APPLICATION STATE & SONG DATABASE
// ===================================================================

// Central reactive state object tracking current playback and studio data
const state = {
  tracks: [],                  // Array of active songs loaded in the app
  currentTrackIndex: 0,        // Index of the currently loaded song
  isPlaying: false,            // True if audio is actively playing
  isShuffled: false,           // True if shuffle mode is on
  isRepeated: false,           // True if repeat mode is on
  currentPlaylistFilter: 'all',// Active language filter ('all', 'hindi', 'english', etc.)
  currentUser: null,           // Logged in user name
  audioContext: null,          // Shared Web Audio API context for editing and mixing

  // Audio Cutter state
  cutter: {
    audioBuffer: null,         // Decoded audio PCM samples for waveform
    sourceNode: null,          // Audio source node used for previewing cuts
    startTime: 0,              // Start trim point in seconds
    endTime: 10,               // End trim point in seconds
    duration: 0,               // Total track duration in seconds
    currentTrack: null,        // Song object being edited
    isPlayingPreview: false    // True if cut preview is playing
  },

  // Video Studio state
  video: {
    file: null,                // Video file reference
    videoUrl: null,            // Browser URL for the video
    duration: 0,               // Total video length in seconds
    startTime: 0,              // Video trim start point in seconds
    endTime: 0,                // Video trim end point in seconds
    selectedAudioTrack: null   // Audio track selected to overlay on video
  }
};

// Curated 16 hit songs catalog across 4 Indian & Global languages
const REAL_SONGS = [
  // --- HINDI SONGS (4 TRACKS) ---
  {
    id: "kesariya",
    title: "Kesariya",
    artist: "Arijit Singh, Pritam",
    language: "Hindi",
    category: "hindi",
    genre: "Hindi Romantic",
    audio: "audio/kesariya.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a",
    cover: "covers/kesariya.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/300x300bb.jpg",
    duration: 30,
    color: "#e65100",
    icon: "HINDI"
  },
  {
    id: "tum_hi_ho",
    title: "Tum Hi Ho",
    artist: "Arijit Singh, Mithoon",
    language: "Hindi",
    category: "hindi",
    genre: "Hindi Soulful Ballad",
    audio: "audio/tum_hi_ho.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3a/8c/9b/3a8c9b0b-2def-750a-f615-1555bf941edf/mzaf_17229496441442805917.plus.aac.p.m4a",
    cover: "covers/tum_hi_ho.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/300x300bb.jpg",
    duration: 30,
    color: "#880e4f",
    icon: "HINDI"
  },
  {
    id: "apna_bana_le",
    title: "Apna Bana Le",
    artist: "Arijit Singh, Sachin-Jigar",
    language: "Hindi",
    category: "hindi",
    genre: "Hindi Soft Melody",
    audio: "audio/apna_bana_le.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/b2/c2/ffb2c28b-2139-4ec4-f61e-271bc06bddad/mzaf_12403837045914372948.plus.aac.p.m4a",
    cover: "covers/apna_bana_le.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/65/6f/5f/656f5fc0-4ce3-e03e-b7da-667a289f9e28/8909024114538.png/300x300bb.jpg",
    duration: 30,
    color: "#bf360c",
    icon: "HINDI"
  },
  {
    id: "raataan_lambiyan",
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal, Tanishk Bagchi",
    language: "Hindi",
    category: "hindi",
    genre: "Hindi Acoustic Chill",
    audio: "audio/raataan_lambiyan.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ff/7a/7a/ff7a7a63-9947-cefa-e269-ad9602fb1ca3/mzaf_14039909875904828823.plus.aac.p.m4a",
    cover: "covers/raataan_lambiyan.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c3/df/e7/c3dfe71e-d532-458e-9c1c-32d40f8d9123/886449472222.jpg/300x300bb.jpg",
    duration: 30,
    color: "#4a148c",
    icon: "HINDI"
  },

  // --- ENGLISH SONGS (4 TRACKS) ---
  {
    id: "blinding_lights",
    title: "Blinding Lights",
    artist: "The Weeknd",
    language: "English",
    category: "english",
    genre: "English Synthpop",
    audio: "audio/blinding_lights.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a",
    cover: "covers/blinding_lights.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/300x300bb.jpg",
    duration: 30,
    color: "#d50000",
    icon: "ENG"
  },
  {
    id: "shape_of_you",
    title: "Shape of You",
    artist: "Ed Sheeran",
    language: "English",
    category: "english",
    genre: "English Pop Groove",
    audio: "audio/shape_of_you.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/c7/4f/44c74f0d-72dc-6143-d4d0-ba14d661ca0d/mzaf_9566898362556366703.plus.aac.p.m4a",
    cover: "covers/shape_of_you.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/300x300bb.jpg",
    duration: 30,
    color: "#00b0ff",
    icon: "ENG"
  },
  {
    id: "starboy",
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    language: "English",
    category: "english",
    genre: "English Electro R&B",
    audio: "audio/starboy.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a",
    cover: "covers/starboy.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/300x300bb.jpg",
    duration: 30,
    color: "#1a237e",
    icon: "ENG"
  },
  {
    id: "levitating",
    title: "Levitating",
    artist: "Dua Lipa",
    language: "English",
    category: "english",
    genre: "English Disco Funk",
    audio: "audio/levitating.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/59/dc/4d/59dc4dda-93ff-8f1c-c536-f005f6ea6af5/mzaf_3066686759813252385.plus.aac.p.m4a",
    cover: "covers/levitating.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6c/11/d6/6c11d681-aa3a-d59e-4c2e-f77e181026ab/190295092665.jpg/300x300bb.jpg",
    duration: 30,
    color: "#c2185b",
    icon: "ENG"
  },

  // --- GUJARATI SONGS (4 TRACKS) ---
  {
    id: "khalasi",
    title: "Khalasi (Gotilo)",
    artist: "Aditya Gadhvi, Achint",
    language: "Gujarati",
    category: "gujarati",
    genre: "Gujarati Folk Fusion",
    audio: "audio/khalasi.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0d/68/bd/0d68bdec-6fee-740f-ca95-02b701c18d48/mzaf_15555358427089070690.plus.aac.p.m4a",
    cover: "covers/khalasi.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/32/df/c7/32dfc7ae-c9ce-842d-478b-23d0a4b97614/24UMGIM59593.rgb.jpg/300x300bb.jpg",
    duration: 30,
    color: "#ff6f00",
    icon: "GUJ"
  },
  {
    id: "dholida",
    title: "Dholida",
    artist: "Jahnvi Shrimankar, Sanjay Leela Bhansali",
    language: "Gujarati",
    category: "gujarati",
    genre: "Gujarati Garba Anthem",
    audio: "audio/dholida.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e3/58/0a/e3580aa3-2a94-f8e3-33af-4ce8d27fd00e/mzaf_17990530228880718560.plus.aac.p.m4a",
    cover: "covers/dholida.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/43/73/e3/4373e314-fc31-7549-25ff-44d34790b7fe/196626455369.jpg/300x300bb.jpg",
    duration: 30,
    color: "#c51162",
    icon: "GUJ"
  },
  {
    id: "vhalam_aavo_ne",
    title: "Vhalam Aavo Ne",
    artist: "Jigardan Gadhavi, Sachin-Jigar",
    language: "Gujarati",
    category: "gujarati",
    genre: "Gujarati Romantic Folk",
    audio: "audio/vhalam_aavo_ne.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e1/38/2c/e1382c28-0867-ca22-1e06-7002182f43e2/mzaf_17531767971940135343.plus.aac.p.m4a",
    cover: "covers/vhalam_aavo_ne.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/24/dc/09/24dc09f9-dc3c-2016-8bbb-e422d96b83e0/cover.jpg/300x300bb.jpg",
    duration: 30,
    color: "#00796b",
    icon: "GUJ"
  },
  {
    id: "chogada",
    title: "Chogada Tara",
    artist: "Darshan Raval, Asees Kaur",
    language: "Gujarati",
    category: "gujarati",
    genre: "Gujarati Dandiya Beats",
    audio: "audio/chogada.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/1f/bb/a1/1fbba135-c2a0-363b-0e44-267b9f1914e2/mzaf_12556899107469621015.plus.aac.p.m4a",
    cover: "covers/chogada.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/af/69/79/af697907-7447-e35b-5446-40d3cb3e1f64/8903431684981_cover.jpg/300x300bb.jpg",
    duration: 30,
    color: "#f57f17",
    icon: "GUJ"
  },

  // --- PUNJABI SONGS (4 TRACKS) ---
  {
    id: "brown_munde",
    title: "Brown Munde",
    artist: "AP Dhillon, Gurinder Gill",
    language: "Punjabi",
    category: "punjabi",
    genre: "Punjabi Trap & Hip-Hop",
    audio: "audio/brown_munde.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/97/74/69/977469be-a9d5-35a7-80ad-ebe12a799ccc/mzaf_804867738726203367.plus.aac.p.m4a",
    cover: "covers/brown_munde.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/300x300bb.jpg",
    duration: 30,
    color: "#212121",
    icon: "PUNJ"
  },
  {
    id: "excuses",
    title: "Excuses",
    artist: "AP Dhillon, Gurinder Gill",
    language: "Punjabi",
    category: "punjabi",
    genre: "Punjabi Melodic Pop",
    audio: "audio/excuses.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e8/84/c8/e884c82f-7136-54d8-6754-6b45c6968f29/mzaf_11726474689882106813.plus.aac.p.m4a",
    cover: "covers/excuses.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/47/47/ac/4747ac85-1658-64ae-bc82-220a4d6213d5/859747478890_cover.jpg/300x300bb.jpg",
    duration: 30,
    color: "#311b92",
    icon: "PUNJ"
  },
  {
    id: "amplifier",
    title: "Amplifier",
    artist: "Imran Khan",
    language: "Punjabi",
    category: "punjabi",
    genre: "Punjabi Urban Desi",
    audio: "audio/amplifier.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c9/07/49/c907498f-72ee-a92d-d35e-b84a294791d4/mzaf_1725919051371720512.plus.aac.p.m4a",
    cover: "covers/amplifier.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a2/e5/d3/a2e5d31f-23bf-d5de-59c6-b1f3744668cf/dj.usvbhaev.jpg/300x300bb.jpg",
    duration: 30,
    color: "#0091ea",
    icon: "PUNJ"
  },
  {
    id: "pasoori",
    title: "Pasoori",
    artist: "Ali Sethi, Shae Gill",
    language: "Punjabi",
    category: "punjabi",
    genre: "Punjabi Folk Fusion",
    audio: "audio/pasoori.m4a",
    fallbackAudio: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/62/33/1e/62331ea8-d1df-027d-fe75-ac16a519323d/mzaf_14381883946572745360.plus.aac.p.m4a",
    cover: "covers/pasoori.jpg",
    fallbackCover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f3/f9/06/f3f906c3-79d5-ac9a-5fdd-262048f955f9/cover.jpg/300x300bb.jpg",
    duration: 30,
    color: "#004d40",
    icon: "PUNJ"
  }
];

// Load catalog songs into application state
function loadLibraryTracks() {
  state.tracks = REAL_SONGS.map(song => ({
    id: "track-" + song.id,
    title: song.title,
    artist: song.artist,
    language: song.language,
    category: song.category,
    genre: song.genre,
    duration: song.duration,
    durationFormatted: formatTime(song.duration),
    url: song.audio,
    fallbackUrl: song.fallbackAudio,
    cover: song.cover,
    fallbackCover: song.fallbackCover,
    icon: song.icon,
    color: song.color,
    isLiked: false
  }));

  renderTracksUI();
  updateCutterTrackSelect();
  updateVideoAudioSelect();
}

// ===================================================================
// SECTION 2: CORE AUDIO PLAYER ENGINE
// ===================================================================

// Cache player HTML DOM elements
const mainAudio = document.getElementById("main-audio");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerArt = document.getElementById("player-art");
const playerCurrentTime = document.getElementById("player-current-time");
const playerDuration = document.getElementById("player-duration");
const playerProgressFill = document.getElementById("player-progress-fill");
const playerProgressHandle = document.getElementById("player-progress-handle");
const seekContainer = document.getElementById("seek-container");
const miniVisualizer = document.getElementById("mini-visualizer");
const volumeSlider = document.getElementById("volume-slider");
const btnVolumeIcon = document.getElementById("btn-volume-icon");
const volHighIcon = document.getElementById("vol-high-icon");
const volMuteIcon = document.getElementById("vol-mute-icon");

// Load a specific song into the player bar
function loadTrack(index) {
  if (index < 0 || index >= state.tracks.length) return;
  state.currentTrackIndex = index;
  const track = state.tracks[index];

  // Set audio source and text info
  mainAudio.src = track.url;
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.language ? `${track.artist} - ${track.language}` : track.artist;

  // Set cover artwork with image error fallback
  if (track.cover) {
    playerArt.innerHTML = `<img src="${track.cover}" alt="${track.title}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;" onerror="if(this.src!=='${track.fallbackCover || ''}')this.src='${track.fallbackCover || ''}'">`;
  } else {
    playerArt.innerHTML = track.icon ? `<span style="font-size:0.85rem; font-weight:800; color:#fff;">${track.icon}</span>` : '<svg viewBox="0 0 24 24" width="24" height="24" fill="#1DB954"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>';
  }
  playerArt.style.backgroundColor = track.color || "#282828";

  // Update like heart icon
  const likeBtn = document.getElementById("btn-like");
  likeBtn.classList.toggle("liked", !!track.isLiked);

  highlightActiveTrackRow(index);
}

// Fallback to online stream if local audio file fails to load
mainAudio.addEventListener("error", () => {
  const current = state.tracks[state.currentTrackIndex];
  if (current && current.fallbackUrl && mainAudio.src !== current.fallbackUrl) {
    console.log("Playing online fallback stream for:", current.title);
    mainAudio.src = current.fallbackUrl;
    if (state.isPlaying) {
      mainAudio.play().catch(() => {});
    }
  }
});

// Start playing current song
function playTrack() {
  if (!mainAudio.src && state.tracks.length > 0) {
    loadTrack(state.currentTrackIndex);
  }
  mainAudio.play().then(() => {
    state.isPlaying = true;
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
    miniVisualizer.classList.add("playing");
  }).catch(err => {
    console.warn("Autoplay note:", err);
  });
}

// Pause active song
function pauseTrack() {
  mainAudio.pause();
  state.isPlaying = false;
  playIcon.style.display = "block";
  pauseIcon.style.display = "none";
  miniVisualizer.classList.remove("playing");
}

// Toggle between play and pause
function togglePlayPause() {
  if (state.isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

// Play next song (handles shuffle mode)
function nextTrack() {
  if (state.isShuffled) {
    state.currentTrackIndex = Math.floor(Math.random() * state.tracks.length);
  } else {
    state.currentTrackIndex = (state.currentTrackIndex + 1) % state.tracks.length;
  }
  loadTrack(state.currentTrackIndex);
  playTrack();
}

// Play previous song (restarts if past 3 seconds)
function prevTrack() {
  if (mainAudio.currentTime > 3) {
    mainAudio.currentTime = 0;
  } else {
    state.currentTrackIndex = (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length;
    loadTrack(state.currentTrackIndex);
    playTrack();
  }
}

// Update scrubber bar and time display during playback
mainAudio.addEventListener("timeupdate", () => {
  const current = mainAudio.currentTime;
  const total = mainAudio.duration || 0;
  playerCurrentTime.textContent = formatTime(current);

  if (total > 0) {
    playerDuration.textContent = formatTime(total);
    const progress = (current / total) * 100;
    playerProgressFill.style.width = progress + "%";
    playerProgressHandle.style.left = progress + "%";
  }
});

// Handle song completion (loop if repeat on, else play next)
mainAudio.addEventListener("ended", () => {
  if (state.isRepeated) {
    mainAudio.currentTime = 0;
    playTrack();
  } else {
    nextTrack();
  }
});

// Click seek bar to jump to new time
seekContainer.addEventListener("click", (e) => {
  if (!mainAudio.duration) return;
  const rect = seekContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(1, clickX / rect.width));
  mainAudio.currentTime = percent * mainAudio.duration;
});

// Volume slider adjustment
volumeSlider.addEventListener("input", (e) => {
  const val = parseFloat(e.target.value);
  mainAudio.volume = val;
  updateVolumeIcons(val);
});

// Mute / Unmute toggle
btnVolumeIcon.addEventListener("click", () => {
  if (mainAudio.volume > 0) {
    mainAudio.dataset.prevVol = mainAudio.volume;
    mainAudio.volume = 0;
    volumeSlider.value = 0;
    updateVolumeIcons(0);
  } else {
    const prev = parseFloat(mainAudio.dataset.prevVol || 0.8);
    mainAudio.volume = prev;
    volumeSlider.value = prev;
    updateVolumeIcons(prev);
  }
});

function updateVolumeIcons(vol) {
  volHighIcon.style.display = vol === 0 ? "none" : "block";
  volMuteIcon.style.display = vol === 0 ? "block" : "none";
}

// ===================================================================
// SECTION 3: DYNAMIC UI RENDERING & SEARCH ENGINE
// ===================================================================

// Render Quick Picks cards and Songs Table matching language filter & search query
function renderTracksUI(searchQuery = "") {
  const tbody = document.getElementById("tracks-table-body");
  const quickGrid = document.getElementById("quick-picks-container");
  const badge = document.getElementById("track-count-badge");

  tbody.innerHTML = "";
  quickGrid.innerHTML = "";

  // Filter songs by active playlist and search keyword
  const filtered = state.tracks.filter(track => {
    // 1. Language filter
    if (state.currentPlaylistFilter && state.currentPlaylistFilter !== 'all') {
      const filter = state.currentPlaylistFilter.toLowerCase();
      if (filter === 'trimmed') {
        const isTrimmed = track.category === 'trimmed' || (track.title || '').toLowerCase().includes('cut');
        if (!isTrimmed) return false;
      } else {
        const lang = (track.language || '').toLowerCase();
        const cat = (track.category || '').toLowerCase();
        if (lang !== filter && cat !== filter) return false;
      }
    }

    // 2. Search keyword filter
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      (track.language && track.language.toLowerCase().includes(q)) ||
      (track.genre && track.genre.toLowerCase().includes(q))
    );
  });

  badge.textContent = `${filtered.length} track${filtered.length === 1 ? '' : 's'}`;

  // If viewing trimmed clips and none exist, show helpful message
  if (state.currentPlaylistFilter === 'trimmed' && filtered.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="5" style="text-align: center; padding: 3rem 1rem;">
        <h3 style="color: #fff; margin-bottom: 0.4rem;">No trimmed clips yet!</h3>
        <p style="color: #888; font-size: 0.88rem; margin-bottom: 1.2rem;">
          Open the Audio Cutter studio to trim any song and add it here.
        </p>
        <button class="btn btn-primary" onclick="switchView('view-cutter')">Open Audio Cutter</button>
      </td>
    `;
    tbody.appendChild(emptyRow);
  }

  // Populate Quick Picks top 6 cards
  filtered.slice(0, 6).forEach(track => {
    const card = document.createElement("div");
    card.className = "quick-card";
    const art = track.cover
      ? `<img src="${track.cover}" alt="${track.title}" style="width:100%; height:100%; object-fit:cover;" onerror="if(this.src!=='${track.fallbackCover || ''}')this.src='${track.fallbackCover || ''}'">`
      : `<span style="font-size:0.75rem; font-weight:800; color:#fff;">${track.icon || 'MUSIC'}</span>`;

    card.innerHTML = `
      <div class="quick-card-art" style="background:${track.color || '#333'}; overflow:hidden;">${art}</div>
      <div class="quick-card-title">${track.title}</div>
      <button class="quick-play-btn" title="Play">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </button>
    `;

    card.addEventListener("click", () => {
      const idx = state.tracks.findIndex(t => t.id === track.id);
      loadTrack(idx);
      playTrack();
    });

    quickGrid.appendChild(card);
  });

  // Populate Songs Table rows
  filtered.forEach((track, index) => {
    const actualIdx = state.tracks.findIndex(t => t.id === track.id);
    const tr = document.createElement("tr");
    tr.id = `track-row-${actualIdx}`;
    if (actualIdx === state.currentTrackIndex && state.isPlaying) {
      tr.classList.add("active-playing");
    }

    const langTagClass = (track.category || 'hindi').toLowerCase();
    const langLabel = track.language || 'Music';
    const thumb = track.cover
      ? `<img src="${track.cover}" alt="${track.title}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;" onerror="if(this.src!=='${track.fallbackCover || ''}')this.src='${track.fallbackCover || ''}'">`
      : `<span style="font-size:0.75rem; font-weight:800; color:#fff;">${track.icon || 'NX'}</span>`;

    tr.innerHTML = `
      <td class="track-num-cell">${index + 1}</td>
      <td>
        <div class="track-main-cell">
          <div class="track-thumb" style="background:${track.color || '#242424'}; overflow:hidden;">${thumb}</div>
          <div>
            <div class="track-title-cell">${track.title}</div>
            <div style="font-size:0.75rem; color:#888;">
              ${track.artist}
              <span class="lang-tag tag-${langTagClass}">${langLabel}</span>
            </div>
          </div>
        </div>
      </td>
      <td>${track.genre || "Music"}</td>
      <td>${track.durationFormatted || formatTime(track.duration)}</td>
      <td>
        <div class="track-actions-cell">
          <button class="icon-action-btn" title="Cut Track in Studio" onclick="openTrackInCutter('${track.id}')">Cut</button>
          <button class="icon-action-btn" title="Play Track" onclick="playSpecificTrack(${actualIdx})">Play</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Highlight the row of the playing song in green
function highlightActiveTrackRow(index) {
  document.querySelectorAll(".tracks-table tbody tr").forEach(r => r.classList.remove("active-playing"));
  const row = document.getElementById(`track-row-${index}`);
  if (row) row.classList.add("active-playing");
}

// Play specific track by index
function playSpecificTrack(idx) {
  loadTrack(idx);
  playTrack();
}

// Real-time search input listener
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", (e) => {
  renderTracksUI(e.target.value.trim());
});

// Update dynamic greeting based on system clock
function updateGreeting() {
  const greetingEl = document.getElementById("greeting-text");
  const hour = new Date().getHours();
  if (hour < 12) greetingEl.textContent = "Good morning";
  else if (hour < 18) greetingEl.textContent = "Good afternoon";
  else greetingEl.textContent = "Good evening";
}

// ===================================================================
// SECTION 4: CUSTOM MEDIA FILE UPLOADS (Drag & Drop)
// ===================================================================

const globalFileInput = document.getElementById("global-file-input");
const btnUploadMedia = document.getElementById("btn-upload-media");
const audioDropZone = document.getElementById("audio-drop-zone");

btnUploadMedia.addEventListener("click", () => globalFileInput.click());

globalFileInput.addEventListener("change", (e) => {
  handleFilesUpload(e.target.files);
});

// Drag and drop events
audioDropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  audioDropZone.classList.add("drag-over");
});

audioDropZone.addEventListener("dragleave", () => {
  audioDropZone.classList.remove("drag-over");
});

audioDropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  audioDropZone.classList.remove("drag-over");
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    handleFilesUpload(e.dataTransfer.files);
  }
});

// Process uploaded audio or video files
function handleFilesUpload(files) {
  Array.from(files).forEach(file => {
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");

    if (!isAudio && !isVideo) {
      alert(`File "${file.name}" is not supported. Please choose an audio or video file.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, "");

    if (isAudio) {
      // Read audio duration and insert at top of playlist
      const temp = new Audio(objectUrl);
      temp.addEventListener("loadedmetadata", () => {
        const dur = temp.duration || 0;
        const newTrack = {
          id: "track-user-" + Date.now(),
          title: cleanName,
          artist: "User Upload",
          genre: "Custom Audio",
          duration: dur,
          durationFormatted: formatTime(dur),
          url: objectUrl,
          file: file,
          icon: "USER",
          color: "#4a148c",
          isLiked: false
        };

        state.tracks.unshift(newTrack);
        renderTracksUI();
        updateCutterTrackSelect();
        updateVideoAudioSelect();
        loadTrack(0);
        playTrack();
      });
    } else if (isVideo) {
      // Load video directly into Video Studio
      loadVideoFile(file);
      switchView("view-video");
    }
  });
}

// ===================================================================
// SECTION 5: AUDIO CUTTER STUDIO (Waveform Canvas & Trimming)
// ===================================================================

const cutterTrackSelect = document.getElementById("cutter-track-select");
const cutterFileInput = document.getElementById("cutter-file-input");
const waveformCanvas = document.getElementById("waveform-canvas");
const waveformPlayhead = document.getElementById("waveform-playhead");
const waveformSelection = document.getElementById("waveform-selection");
const cutterStartTimeInput = document.getElementById("cutter-start-time");
const cutterEndTimeInput = document.getElementById("cutter-end-time");
const cutterSelectedDuration = document.getElementById("cutter-selected-duration");
const cutterRangeLabel = document.getElementById("cutter-range-label");
const cutterTrackName = document.getElementById("cutter-current-track-name");
const cutterTotalTime = document.getElementById("cutter-track-total-time");
const btnPreviewCut = document.getElementById("btn-preview-cut");
const btnStopCutPreview = document.getElementById("btn-stop-cut-preview");
const btnDownloadCut = document.getElementById("btn-download-cut");
const btnAddCutToLibrary = document.getElementById("btn-add-cut-to-library");
const cutterStatusMsg = document.getElementById("cutter-status-msg");

// Synchronize cutter song selection dropdown
function updateCutterTrackSelect() {
  cutterTrackSelect.innerHTML = `<option value="">-- Choose from Nexora Library (Hindi, English, Gujarati, Punjabi) --</option>`;
  state.tracks.forEach(track => {
    const opt = document.createElement("option");
    opt.value = track.id;
    const lang = track.language ? ` [${track.language}]` : "";
    opt.textContent = `${track.title} - ${track.artist}${lang} (${track.durationFormatted})`;
    cutterTrackSelect.appendChild(opt);
  });
}

cutterTrackSelect.addEventListener("change", (e) => {
  const trackId = e.target.value;
  if (!trackId) return;
  const track = state.tracks.find(t => t.id === trackId);
  if (track) loadTrackIntoCutter(track);
});

cutterFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) loadAudioFileIntoCutter(file);
});

// Shortcut from table 'Cut' button into Audio Cutter view
function openTrackInCutter(trackId) {
  const track = state.tracks.find(t => t.id === trackId);
  if (track) {
    switchView("view-cutter");
    cutterTrackSelect.value = track.id;
    loadTrackIntoCutter(track);
  }
}

// Fetch audio, decode PCM buffer via Web Audio API, and render waveform
async function loadTrackIntoCutter(track) {
  showCutterStatus(`Loading "${track.title}" waveform...`, "info");
  cutterTrackName.textContent = `${track.title} - ${track.artist}`;
  state.cutter.currentTrack = track;

  try {
    if (track.buffer) {
      setupCutterWithBuffer(track.buffer);
    } else {
      let arrayBuffer;
      try {
        const resp = await fetch(track.url);
        if (!resp.ok && track.fallbackUrl) {
          const fb = await fetch(track.fallbackUrl);
          arrayBuffer = await fb.arrayBuffer();
        } else {
          arrayBuffer = await resp.arrayBuffer();
        }
      } catch (err) {
        if (track.fallbackUrl) {
          const fb = await fetch(track.fallbackUrl);
          arrayBuffer = await fb.arrayBuffer();
        } else {
          throw err;
        }
      }

      const audioCtx = getAudioContext();
      const decoded = await audioCtx.decodeAudioData(arrayBuffer);
      track.buffer = decoded;
      setupCutterWithBuffer(decoded);
    }
    showCutterStatus(`"${track.title}" ready to trim!`, "success");
  } catch (err) {
    showCutterStatus("Notice: Track ready for player. You can also upload any MP3/WAV file directly.", "info");
  }
}

// Load a local audio file directly into the cutter
async function loadAudioFileIntoCutter(file) {
  showCutterStatus(`Loading "${file.name}"...`, "info");
  cutterTrackName.textContent = file.name;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = getAudioContext();
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    
    state.cutter.currentTrack = {
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Edit"
    };

    setupCutterWithBuffer(decoded);
  } catch (err) {
    showCutterStatus("Error loading audio file: " + err.message, "error");
  }
}

// Setup initial slice boundaries and draw the waveform
function setupCutterWithBuffer(buffer) {
  state.cutter.audioBuffer = buffer;
  const dur = buffer.duration;
  state.cutter.duration = dur;

  // Default slice: first 10 seconds (or full track if shorter)
  state.cutter.startTime = 0;
  state.cutter.endTime = Math.min(10, dur);

  cutterStartTimeInput.max = dur;
  cutterEndTimeInput.max = dur;
  cutterStartTimeInput.value = state.cutter.startTime.toFixed(1);
  cutterEndTimeInput.value = state.cutter.endTime.toFixed(1);
  cutterTotalTime.textContent = formatTime(dur);

  updateCutterDurationDisplay();
  drawWaveform(buffer);
  updateWaveformOverlay();
}

function updateCutterDurationDisplay() {
  const diff = Math.max(0, state.cutter.endTime - state.cutter.startTime);
  cutterSelectedDuration.textContent = diff.toFixed(2) + "s";
  cutterRangeLabel.textContent = `${state.cutter.startTime.toFixed(1)}s - ${state.cutter.endTime.toFixed(1)}s`;
}

// Draw raw PCM audio samples on HTML5 Canvas
function drawWaveform(buffer) {
  const canvas = waveformCanvas;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Background subtle grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < width; x += 40) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  ctx.stroke();

  // Extract PCM channel 0 data
  const data = buffer.getChannelData(0);
  const step = Math.ceil(data.length / width);
  const amp = height / 2;

  ctx.fillStyle = "#1DB954";
  ctx.beginPath();

  for (let i = 0; i < width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = data[(i * step) + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }

    const y1 = (1 + min) * amp;
    const y2 = Math.max(1, (max - min) * amp);
    ctx.fillRect(i, y1, 1, y2);
  }

  // Center line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.beginPath();
  ctx.moveTo(0, amp);
  ctx.lineTo(width, amp);
  ctx.stroke();
}

// Update the green selection highlight box over the waveform
function updateWaveformOverlay() {
  if (!state.cutter.duration) return;
  const startPct = (state.cutter.startTime / state.cutter.duration) * 100;
  const endPct = (state.cutter.endTime / state.cutter.duration) * 100;

  waveformSelection.style.left = startPct + "%";
  waveformSelection.style.width = (endPct - startPct) + "%";
}

// Click on canvas to adjust Start or End cut position
waveformCanvas.addEventListener("click", (e) => {
  if (!state.cutter.duration) return;
  const rect = waveformCanvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickedTime = (clickX / rect.width) * state.cutter.duration;

  const distToStart = Math.abs(clickedTime - state.cutter.startTime);
  const distToEnd = Math.abs(clickedTime - state.cutter.endTime);

  if (distToStart < distToEnd) {
    state.cutter.startTime = Math.min(clickedTime, state.cutter.endTime - 0.2);
    cutterStartTimeInput.value = state.cutter.startTime.toFixed(1);
  } else {
    state.cutter.endTime = Math.max(clickedTime, state.cutter.startTime + 0.2);
    cutterEndTimeInput.value = state.cutter.endTime.toFixed(1);
  }

  updateCutterDurationDisplay();
  updateWaveformOverlay();
});

// Numeric input listeners
cutterStartTimeInput.addEventListener("input", (e) => {
  let val = parseFloat(e.target.value) || 0;
  if (val < 0) val = 0;
  if (val >= state.cutter.endTime) val = Math.max(0, state.cutter.endTime - 0.1);
  state.cutter.startTime = val;
  updateCutterDurationDisplay();
  updateWaveformOverlay();
});

cutterEndTimeInput.addEventListener("input", (e) => {
  let val = parseFloat(e.target.value) || 0;
  if (val > state.cutter.duration) val = state.cutter.duration;
  if (val <= state.cutter.startTime) val = state.cutter.startTime + 0.1;
  state.cutter.endTime = val;
  updateCutterDurationDisplay();
  updateWaveformOverlay();
});

// Snap cut points to current player position
document.getElementById("btn-set-start-curr").addEventListener("click", () => {
  if (mainAudio.duration) {
    state.cutter.startTime = Math.min(mainAudio.currentTime, state.cutter.endTime - 0.1);
    cutterStartTimeInput.value = state.cutter.startTime.toFixed(1);
    updateCutterDurationDisplay();
    updateWaveformOverlay();
  }
});

document.getElementById("btn-set-end-curr").addEventListener("click", () => {
  if (mainAudio.duration) {
    state.cutter.endTime = Math.max(mainAudio.currentTime, state.cutter.startTime + 0.1);
    cutterEndTimeInput.value = state.cutter.endTime.toFixed(1);
    updateCutterDurationDisplay();
    updateWaveformOverlay();
  }
});

// Audition the cut slice using Web Audio API AudioBufferSourceNode
btnPreviewCut.addEventListener("click", () => {
  if (!state.cutter.audioBuffer) {
    showCutterStatus("Please select or upload an audio track first.", "error");
    return;
  }

  stopCutterPreview();

  const audioCtx = getAudioContext();
  const source = audioCtx.createBufferSource();
  source.buffer = state.cutter.audioBuffer;
  source.connect(audioCtx.destination);

  const start = state.cutter.startTime;
  const duration = state.cutter.endTime - start;

  source.start(0, start, duration);
  state.cutter.sourceNode = source;
  state.cutter.isPlayingPreview = true;

  showCutterStatus(`Playing preview (${start.toFixed(1)}s to ${state.cutter.endTime.toFixed(1)}s)...`, "info");
  source.onended = () => { state.cutter.isPlayingPreview = false; };
});

btnStopCutPreview.addEventListener("click", stopCutterPreview);

function stopCutterPreview() {
  if (state.cutter.sourceNode) {
    try { state.cutter.sourceNode.stop(); } catch (e) {}
    state.cutter.sourceNode = null;
  }
  state.cutter.isPlayingPreview = false;
}

// Download cut audio slice as 16-bit WAV file
btnDownloadCut.addEventListener("click", async () => {
  if (!state.cutter.audioBuffer) {
    showCutterStatus("Please select or upload an audio file first.", "error");
    return;
  }

  showCutterStatus("Generating 16-bit WAV file...", "info");
  const slicedBlob = await createSlicedAudioBlob();

  const trackTitle = (state.cutter.currentTrack ? state.cutter.currentTrack.title : "audio") + "-trimmed";
  const link = document.createElement("a");
  link.href = URL.createObjectURL(slicedBlob);
  link.download = `${trackTitle}.wav`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showCutterStatus(`Downloaded "${trackTitle}.wav" successfully!`, "success");
});

// Add cut track directly into the Nexora library
btnAddCutToLibrary.addEventListener("click", async () => {
  if (!state.cutter.audioBuffer) {
    showCutterStatus("Please select or upload an audio track first.", "error");
    return;
  }

  showCutterStatus("Adding trimmed clip to library...", "info");
  const slicedBlob = await createSlicedAudioBlob();
  const slicedUrl = URL.createObjectURL(slicedBlob);
  const slicedDuration = state.cutter.endTime - state.cutter.startTime;
  const baseTitle = state.cutter.currentTrack ? state.cutter.currentTrack.title : "Audio Clip";

  const newTrack = {
    id: "track-cut-" + Date.now(),
    title: `${baseTitle} (Trimmed Cut)`,
    artist: "Studio Edit",
    language: "Trimmed",
    category: "trimmed",
    genre: "Custom Trim",
    duration: slicedDuration,
    durationFormatted: formatTime(slicedDuration),
    url: slicedUrl,
    icon: "CUT",
    color: "#2e7d32",
    isLiked: true
  };

  state.tracks.unshift(newTrack);
  renderTracksUI();
  updateCutterTrackSelect();
  updateVideoAudioSelect();
  showCutterStatus(`"${newTrack.title}" added to your library!`, "success");
  
  loadTrack(0);
  playTrack();
});

// Render the exact audio slice into a new WAV Blob using OfflineAudioContext
async function createSlicedAudioBlob() {
  const orig = state.cutter.audioBuffer;
  const start = state.cutter.startTime;
  const duration = Math.max(0.1, state.cutter.endTime - start);
  const sampleRate = orig.sampleRate;
  const channels = orig.numberOfChannels;

  const offline = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
    channels,
    Math.ceil(duration * sampleRate),
    sampleRate
  );

  const source = offline.createBufferSource();
  source.buffer = orig;
  source.connect(offline.destination);
  source.start(0, start, duration);

  const rendered = await offline.startRendering();
  return audioBufferToWavBlob(rendered);
}

function showCutterStatus(msg, type) {
  cutterStatusMsg.textContent = msg;
  cutterStatusMsg.className = `status-message show ${type}`;
  setTimeout(() => {
    if (type !== "error") cutterStatusMsg.classList.remove("show");
  }, 4000);
}

// ===================================================================
// SECTION 6: VIDEO STUDIO (Video Trimmer & Soundtrack Mixer)
// ===================================================================

const studioVideo = document.getElementById("studio-video");
const videoPlaceholder = document.getElementById("video-placeholder");
const videoFileInput = document.getElementById("video-file-input");
const btnLoadDemoVideo = document.getElementById("btn-load-demo-video");
const videoStartRange = document.getElementById("video-start-range");
const videoEndRange = document.getElementById("video-end-range");
const videoTrimStartLabel = document.getElementById("video-trim-start-label");
const videoTrimEndLabel = document.getElementById("video-trim-end-label");
const btnVideoSetStart = document.getElementById("btn-video-set-start");
const btnVideoSetEnd = document.getElementById("btn-video-set-end");
const btnVideoPreviewTrim = document.getElementById("btn-video-preview-trim");
const videoAudioSelect = document.getElementById("video-audio-select");
const videoCustomAudioInput = document.getElementById("video-custom-audio-input");
const videoOrigVolume = document.getElementById("video-orig-volume");
const videoAddedVolume = document.getElementById("video-added-volume");
const origVolVal = document.getElementById("orig-vol-val");
const addedVolVal = document.getElementById("added-vol-val");
const btnExportVideo = document.getElementById("btn-export-video");
const videoExportProgress = document.getElementById("video-export-progress");
const exportBarFill = document.getElementById("export-bar-fill");
const exportStatusText = document.getElementById("export-status-text");
const videoStatusMsg = document.getElementById("video-status-msg");

// Populate soundtrack dropdown in Video Studio
function updateVideoAudioSelect() {
  const current = videoAudioSelect.value;
  videoAudioSelect.innerHTML = `<option value="none">-- Keep Original Video Sound Only --</option>`;
  state.tracks.forEach(track => {
    const opt = document.createElement("option");
    opt.value = track.id;
    const lang = track.language ? ` [${track.language}]` : "";
    opt.textContent = `${track.title} - ${track.artist}${lang} (${track.durationFormatted})`;
    videoAudioSelect.appendChild(opt);
  });
  videoAudioSelect.value = current;
}

videoFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) loadVideoFile(file);
});

btnLoadDemoVideo.addEventListener("click", () => {
  generateDemoVideoClip();
});

// Load video file and initialize trim range sliders
function loadVideoFile(file) {
  state.video.file = file;
  state.video.videoUrl = URL.createObjectURL(file);
  studioVideo.src = state.video.videoUrl;
  videoPlaceholder.style.display = "none";

  studioVideo.addEventListener("loadedmetadata", () => {
    const dur = studioVideo.duration || 10;
    state.video.duration = dur;
    state.video.startTime = 0;
    state.video.endTime = dur;

    videoStartRange.max = dur;
    videoEndRange.max = dur;
    videoStartRange.value = 0;
    videoEndRange.value = dur;

    videoTrimStartLabel.textContent = "0.0s";
    videoTrimEndLabel.textContent = dur.toFixed(1) + "s";

    showVideoStatus(`Video "${file.name}" loaded (${dur.toFixed(1)}s)`, "success");
  }, { once: true });
}

// Generate animated HTML5 canvas clip if user has no MP4 on hand
function generateDemoVideoClip() {
  showVideoStatus("Generating interactive demo video...", "info");
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  const chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const file = new File([blob], "nexora-demo-video.webm", { type: "video/webm" });
    loadVideoFile(file);
  };

  recorder.start();

  let frame = 0;
  const totalFrames = 30 * 10; // 10 seconds

  function renderFrame() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic gradient circle
    const hue = (frame * 2) % 360;
    ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
    ctx.beginPath();
    const x = canvas.width / 2 + Math.sin(frame * 0.05) * 150;
    const y = canvas.height / 2 + Math.cos(frame * 0.05) * 60;
    ctx.arc(x, y, 45, 0, Math.PI * 2);
    ctx.fill();

    // Waveform bars
    ctx.fillStyle = "#1DB954";
    for (let i = 0; i < 20; i++) {
      const barH = 20 + Math.abs(Math.sin((frame + i * 5) * 0.1)) * 100;
      ctx.fillRect(100 + i * 22, 300 - barH, 14, barH);
    }

    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Nexora Video Studio", 160, 80);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.fillText(`Frame ${frame} / ${totalFrames} (Demo Clip)`, 240, 115);

    frame++;
    if (frame < totalFrames) {
      requestAnimationFrame(renderFrame);
    } else {
      recorder.stop();
    }
  }

  renderFrame();
}

// Video trim slider controls
videoStartRange.addEventListener("input", (e) => {
  let val = parseFloat(e.target.value);
  if (val >= state.video.endTime) val = Math.max(0, state.video.endTime - 0.2);
  state.video.startTime = val;
  videoTrimStartLabel.textContent = val.toFixed(1) + "s";
  studioVideo.currentTime = val;
});

videoEndRange.addEventListener("input", (e) => {
  let val = parseFloat(e.target.value);
  if (val <= state.video.startTime) val = state.video.startTime + 0.2;
  state.video.endTime = val;
  videoTrimEndLabel.textContent = val.toFixed(1) + "s";
  studioVideo.currentTime = val;
});

btnVideoSetStart.addEventListener("click", () => {
  const cur = studioVideo.currentTime;
  state.video.startTime = Math.min(cur, state.video.endTime - 0.2);
  videoStartRange.value = state.video.startTime;
  videoTrimStartLabel.textContent = state.video.startTime.toFixed(1) + "s";
});

btnVideoSetEnd.addEventListener("click", () => {
  const cur = studioVideo.currentTime;
  state.video.endTime = Math.max(cur, state.video.startTime + 0.2);
  videoEndRange.value = state.video.endTime;
  videoTrimEndLabel.textContent = state.video.endTime.toFixed(1) + "s";
});

// Preview trimmed video segment and overlay music concurrently
btnVideoPreviewTrim.addEventListener("click", () => {
  if (!studioVideo.src) return;
  studioVideo.currentTime = state.video.startTime;
  studioVideo.play();

  // If soundtrack selected, play alongside
  const audioId = videoAudioSelect.value;
  if (audioId !== "none") {
    const track = state.tracks.find(t => t.id === audioId);
    if (track) {
      mainAudio.src = track.url;
      mainAudio.currentTime = 0;
      mainAudio.volume = parseFloat(videoAddedVolume.value);
      mainAudio.play();
    }
  }

  const checkEnd = () => {
    if (studioVideo.currentTime >= state.video.endTime) {
      studioVideo.pause();
      mainAudio.pause();
      studioVideo.removeEventListener("timeupdate", checkEnd);
    }
  };
  studioVideo.addEventListener("timeupdate", checkEnd);
});

// Volume slider percentages
videoOrigVolume.addEventListener("input", (e) => {
  origVolVal.textContent = Math.round(e.target.value * 100) + "%";
  studioVideo.volume = parseFloat(e.target.value);
});

videoAddedVolume.addEventListener("input", (e) => {
  addedVolVal.textContent = Math.round(e.target.value * 100) + "%";
});

// Custom audio file for video
videoCustomAudioInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const trackName = file.name.replace(/\.[^/.]+$/, "");

  const newAudioTrack = {
    id: "video-custom-audio-" + Date.now(),
    title: trackName,
    artist: "Uploaded Soundtrack",
    duration: 30,
    durationFormatted: "--",
    url: url
  };

  state.tracks.push(newAudioTrack);
  updateVideoAudioSelect();
  videoAudioSelect.value = newAudioTrack.id;
  showVideoStatus(`Soundtrack "${trackName}" loaded for video!`, "success");
});

// Export combined trimmed video with mixed soundtracks
btnExportVideo.addEventListener("click", async () => {
  if (!studioVideo.src) {
    showVideoStatus("Please upload or load a video first.", "error");
    return;
  }

  showVideoStatus("Rendering trimmed video & mixing audio...", "info");
  videoExportProgress.style.display = "flex";
  exportBarFill.style.width = "10%";
  exportStatusText.textContent = "Preparing streams...";

  try {
    const trimStart = state.video.startTime;
    const trimEnd = state.video.endTime;
    const duration = Math.max(0.5, trimEnd - trimStart);

    // Canvas to capture video frames
    const canvas = document.createElement("canvas");
    canvas.width = studioVideo.videoWidth || 640;
    canvas.height = studioVideo.videoHeight || 360;
    const ctx = canvas.getContext("2d");

    // Audio mixing via Web Audio API
    const audioCtx = getAudioContext();
    const dest = audioCtx.createMediaStreamDestination();

    // 1. Original video audio (if enabled)
    const origVol = parseFloat(videoOrigVolume.value);
    if (origVol > 0) {
      try {
        const videoSource = audioCtx.createMediaElementSource(studioVideo);
        const origGain = audioCtx.createGain();
        origGain.gain.value = origVol;
        videoSource.connect(origGain);
        origGain.connect(dest);
        origGain.connect(audioCtx.destination);
      } catch (err) {
        console.warn("Audio element source note:", err);
      }
    }

    // 2. Added audio soundtrack (if selected)
    const audioTrackId = videoAudioSelect.value;
    let addedAudio = null;
    if (audioTrackId !== "none") {
      const selected = state.tracks.find(t => t.id === audioTrackId);
      if (selected) {
        addedAudio = new Audio(selected.url);
        addedAudio.crossOrigin = "anonymous";
        const addedSource = audioCtx.createMediaElementSource(addedAudio);
        const addedGain = audioCtx.createGain();
        addedGain.gain.value = parseFloat(videoAddedVolume.value);
        addedSource.connect(addedGain);
        addedGain.connect(dest);
      }
    }

    // Combine canvas video stream + mixed audio stream
    const canvasStream = canvas.captureStream(30);
    const mixedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks()
    ]);

    let options = { mimeType: "video/webm;codecs=vp8,opus" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "video/webm" };
    }

    const recorder = new MediaRecorder(mixedStream, options);
    const recordedChunks = [];

    recorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    recorder.onstop = () => {
      exportBarFill.style.width = "100%";
      exportStatusText.textContent = "Done!";

      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const dl = document.createElement("a");
      dl.href = URL.createObjectURL(blob);
      dl.download = `nexora-video-${Date.now()}.webm`;
      document.body.appendChild(dl);
      dl.click();
      document.body.removeChild(dl);

      showVideoStatus("Video rendered and downloaded successfully!", "success");
      setTimeout(() => { videoExportProgress.style.display = "none"; }, 3000);
    };

    // Seek to trim start and start recording
    studioVideo.currentTime = trimStart;
    studioVideo.pause();

    await new Promise(r => setTimeout(r, 200));

    recorder.start();
    await studioVideo.play();
    if (addedAudio) {
      addedAudio.currentTime = 0;
      await addedAudio.play();
    }

    // Capture frames loop
    let isRecording = true;
    function drawFrame() {
      if (!isRecording) return;
      ctx.drawImage(studioVideo, 0, 0, canvas.width, canvas.height);

      const elapsed = studioVideo.currentTime - trimStart;
      const progress = Math.min(95, Math.max(10, (elapsed / duration) * 100));
      exportBarFill.style.width = `${progress}%`;
      exportStatusText.textContent = `Rendering: ${Math.round(progress)}%`;

      if (studioVideo.currentTime >= trimEnd || studioVideo.ended) {
        isRecording = false;
        studioVideo.pause();
        if (addedAudio) addedAudio.pause();
        recorder.stop();
      } else {
        requestAnimationFrame(drawFrame);
      }
    }

    drawFrame();

  } catch (err) {
    showVideoStatus("Export failed: " + err.message, "error");
    videoExportProgress.style.display = "none";
  }
});

function showVideoStatus(msg, type) {
  videoStatusMsg.textContent = msg;
  videoStatusMsg.className = `status-message show ${type}`;
  setTimeout(() => {
    if (type !== "error") videoStatusMsg.classList.remove("show");
  }, 4500);
}

// ===================================================================
// SECTION 7: CLIENT-SIDE 16-BIT PCM WAV BINARY ENCODER
// ===================================================================

// Encodes an AudioBuffer into a binary WAV Blob without external libraries
function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = buffer.length * blockAlign;
  const bufferArray = new ArrayBuffer(44 + length);
  const view = new DataView(bufferArray);

  // RIFF Chunk Descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');

  // fmt Sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data Sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  // Interleave and write 16-bit PCM samples
  const channels = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      sample = Math.max(-1, Math.min(1, sample));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// ===================================================================
// SECTION 8: NAVIGATION & HELPER UTILITIES
// ===================================================================

// Format seconds into "m:ss"
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Initialize shared Web Audio Context
function getAudioContext() {
  if (!state.audioContext) {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.audioContext.state === "suspended") {
    state.audioContext.resume();
  }
  return state.audioContext;
}

// Switch between visible views ('view-home', 'view-cutter', 'view-video')
function switchView(viewId) {
  document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");

  const matchingNav = document.querySelector(`.nav-item[data-view="${viewId}"]`);
  if (matchingNav) matchingNav.classList.add("active");
}

// Sidebar view switching buttons
document.querySelectorAll(".nav-item[data-view]").forEach(btn => {
  btn.addEventListener("click", () => {
    switchView(btn.dataset.view);
  });
});

document.getElementById("sidebar-add-media-btn").addEventListener("click", () => {
  globalFileInput.click();
});

document.getElementById("search-nav-trigger").addEventListener("click", () => {
  switchView("view-home");
  searchInput.focus();
});

document.getElementById("library-nav-trigger").addEventListener("click", () => {
  switchView("view-home");
});

// Player bar controls
document.getElementById("btn-play-pause").addEventListener("click", togglePlayPause);
document.getElementById("btn-next").addEventListener("click", nextTrack);
document.getElementById("btn-prev").addEventListener("click", prevTrack);

// Shuffle & Repeat buttons
const btnShuffle = document.getElementById("btn-shuffle");
btnShuffle.addEventListener("click", () => {
  state.isShuffled = !state.isShuffled;
  btnShuffle.classList.toggle("active-state", state.isShuffled);
});

const btnRepeat = document.getElementById("btn-repeat");
btnRepeat.addEventListener("click", () => {
  state.isRepeated = !state.isRepeated;
  btnRepeat.classList.toggle("active-state", state.isRepeated);
});

// Like heart button
const btnLike = document.getElementById("btn-like");
btnLike.addEventListener("click", () => {
  const current = state.tracks[state.currentTrackIndex];
  if (current) {
    current.isLiked = !current.isLiked;
    btnLike.classList.toggle("liked", current.isLiked);
  }
});

// Shortcut to open playing song in Cutter
document.getElementById("btn-cut-current").addEventListener("click", () => {
  const current = state.tracks[state.currentTrackIndex];
  if (current) openTrackInCutter(current.id);
});

// Play all songs
document.getElementById("hero-play-btn").addEventListener("click", () => {
  if (state.tracks.length > 0) {
    loadTrack(0);
    playTrack();
  }
});

// Check if Java backend is online
async function checkJavaBackend() {
  try {
    const res = await fetch("/api/status");
    if (res.ok) console.log("Java Backend Connected:", await res.json());
  } catch (e) {}
}

// Filter tracks by language playlist (Hindi, English, Gujarati, Punjabi, etc.)
function selectPlaylist(plType, clickedEl) {
  state.currentPlaylistFilter = plType;

  // Update active sidebar playlist item
  document.querySelectorAll(".playlist-item").forEach(el => el.classList.remove("active-playlist"));
  if (clickedEl && clickedEl.classList.contains("playlist-item")) {
    clickedEl.classList.add("active-playlist");
  } else {
    const match = document.querySelector(`.playlist-item[data-playlist="${plType}"]`);
    if (match) match.classList.add("active-playlist");
  }

  // Update active language filter pill
  document.querySelectorAll(".lang-pill").forEach(el => el.classList.remove("active-pill"));
  const matchPill = document.querySelector(`.lang-pill[data-lang="${plType}"]`);
  if (matchPill) matchPill.classList.add("active-pill");

  switchView("view-home");

  // Update section heading
  const title = document.querySelector(".section-header-row .section-title");
  if (title) {
    if (plType === "all") title.textContent = "All Songs (Hindi, English, Gujarati, Punjabi)";
    else if (plType === "hindi") title.textContent = "Hindi Songs Library";
    else if (plType === "english") title.textContent = "English Songs Library";
    else if (plType === "gujarati") title.textContent = "Gujarati Songs Library";
    else if (plType === "punjabi") title.textContent = "Punjabi Songs Library";
    else if (plType === "trimmed") title.textContent = "My Trimmed Clips";
  }

  renderTracksUI();

  // Auto-play first matching song
  if (plType !== "trimmed") {
    const matchIdx = state.tracks.findIndex(t => {
      if (plType === "all") return true;
      const lang = (t.language || '').toLowerCase();
      const cat = (t.category || '').toLowerCase();
      return lang === plType || cat === plType;
    });

    if (matchIdx !== -1) {
      loadTrack(matchIdx);
      playTrack();
    }
  }
}

// Bind playlist list items and language pills
document.querySelectorAll(".playlist-item").forEach(item => {
  item.addEventListener("click", () => {
    selectPlaylist(item.dataset.playlist || "all", item);
  });
});

document.querySelectorAll(".lang-pill").forEach(pill => {
  pill.addEventListener("click", () => {
    selectPlaylist(pill.dataset.lang || "all");
  });
});

// ===================================================================
// SECTION 9: USER AUTHENTICATION & INITIALIZATION
// ===================================================================

const loginOverlay = document.getElementById("login-overlay");
const loginForm = document.getElementById("login-form");
const loginUsernameInput = document.getElementById("login-username");
const loginPasswordInput = document.getElementById("login-password");
const btnGuestLogin = document.getElementById("btn-guest-login");
const btnGoogleLogin = document.getElementById("btn-google-login");
const btnPwdToggle = document.getElementById("btn-pwd-toggle");
const btnForgotPwd = document.getElementById("btn-forgot-pwd");
const btnSignupLink = document.getElementById("btn-signup-link");
const userAvatarBtn = document.getElementById("user-avatar-btn");
const userDropdownPanel = document.getElementById("user-dropdown-panel");
const userDisplayName = document.getElementById("user-display-name");
const userAvatarInitials = document.getElementById("user-avatar-initials");
const btnLogout = document.getElementById("btn-logout");

// Check saved user session in localStorage
function checkUserLogin() {
  const savedUser = localStorage.getItem("nexora_user");
  if (savedUser) {
    applyLoggedInUser(savedUser);
    if (loginOverlay) loginOverlay.classList.add("hidden");
  } else {
    if (loginOverlay) loginOverlay.classList.remove("hidden");
  }
}

// Apply username to avatar initials and greeting
function applyLoggedInUser(username) {
  state.currentUser = username;
  localStorage.setItem("nexora_user", username);
  if (userDisplayName) userDisplayName.textContent = username;

  // Calculate initials (e.g., "Producer Alex" -> "PA")
  const parts = username.trim().split(" ");
  let initials = parts[0] ? parts[0][0].toUpperCase() : "U";
  if (parts.length > 1 && parts[1]) initials += parts[1][0].toUpperCase();
  if (userAvatarInitials) userAvatarInitials.textContent = initials;

  const greetingEl = document.getElementById("greeting-text");
  if (greetingEl) {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    greetingEl.textContent = `${timeOfDay}, ${username}`;
  }
}

function completeLogin(username) {
  applyLoggedInUser(username);
  if (loginOverlay) loginOverlay.classList.add("hidden");
  getAudioContext();
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    completeLogin(loginUsernameInput.value.trim() || "Producer");
  });
}

if (btnGuestLogin) {
  btnGuestLogin.addEventListener("click", () => {
    completeLogin("Producer Alex");
  });
}

if (btnGoogleLogin) {
  btnGoogleLogin.addEventListener("click", () => {
    completeLogin("Google Producer");
  });
}

if (btnPwdToggle && loginPasswordInput) {
  btnPwdToggle.addEventListener("click", () => {
    const isPwd = loginPasswordInput.type === "password";
    loginPasswordInput.type = isPwd ? "text" : "password";
    const pwdText = document.getElementById("pwd-toggle-text");
    if (pwdText) pwdText.textContent = isPwd ? "HIDE" : "SHOW";
  });
}

if (btnForgotPwd) {
  btnForgotPwd.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Demo Mode: Enter any password or click 'Quick Guest Login'!");
  });
}

if (btnSignupLink) {
  btnSignupLink.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Notice: Enter any username and password to log in right now!");
  });
}

// Toggle user profile dropdown
if (userAvatarBtn && userDropdownPanel) {
  userAvatarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = userDropdownPanel.style.display === "block";
    userDropdownPanel.style.display = isOpen ? "none" : "block";
  });
}

document.addEventListener("click", (e) => {
  if (userDropdownPanel && !e.target.closest(".user-profile-menu")) {
    userDropdownPanel.style.display = "none";
  }
});

// Logout handler
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("nexora_user");
    if (userDropdownPanel) userDropdownPanel.style.display = "none";
    if (loginOverlay) loginOverlay.classList.remove("hidden");
    pauseTrack();
  });
}

// Application startup when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  checkUserLogin();
  updateGreeting();
  loadLibraryTracks();
  if (state.tracks.length > 0) {
    loadTrack(0);
  }
  checkJavaBackend();
});
