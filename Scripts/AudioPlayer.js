document.addEventListener("DOMContentLoaded", async () => {

    const fileName = window.location.pathname.split("/").pop().toLowerCase();

    const poemPaths = {
        "laamiyah-ibn-taymiyyah.html": {
            audio: "Audios/Poem-Recitations/Laamiyah-Ibn-Taimiyyah-Audio.mp3",
            json:  "Scripts/Data/Laamiyah-Ibn-Taimiyyah-Audio-Timing.json"
        },
        "oh-worshippers-of-christ.html": {
            audio: "Audios/Poem-Recitations/Ha'iyyah-Ibn-Al-Qayyim-Audio.mp3",
            json:  "Scripts/Data/Ha'iyyah-Ibn-Al-Qayyim-Audio-Timing.json"
        },
        "ha'iyyah-ibn-abi-dawud.html": {
            audio: "Audios/Poem-Recitations/Ha'iyyah-Ibn-Abi-Dawud-Audio.mp3",
            json:  "Scripts/Data/Ha'iyyah-Ibn-Abi-Dawud-Audio-Timing.json"
        },
        "laamiyah-ibn-al-wardi.html": {
            audio: "Audios/Poem-Recitations/Laamiyah-Ibn-Al-Wardi-Audio.mp3",
            json:  "Scripts/Data/Laamiyah-Ibn-Al-Wardi-Audio-Timing.json"
        },
        "laamiyah-ibn-al-qayyim.html": {
            audio: "Audios/Poem-Recitations/Laamiyah-Ibn-Al-Qayyim-Audio.mp3",
            json:  "Scripts/Data/Laamiyah-Ibn-Al-Qayyim-Audio-Timing.json"
        },

        
    };

    const currentPoem = poemPaths[fileName];

    if (!currentPoem) {
        console.error("Audio/JSON paths not found for this page:", fileName);
        return;
    }

    const audioPath = currentPoem.audio;
    const jsonPath = currentPoem.json;


    const audio = new Audio(audioPath);
    let timingData = [];
    let currentStart = 0;
    let currentEnd = 0;
    let isPlaying = false;
    let raf = null;

    const verses = document.querySelectorAll(".poem-verse");
    const audioBar = document.getElementById("audioPlayerBar");
    const startDropdown = document.getElementById("startVerse");
    const endDropdown = document.getElementById("endVerse");
    const playSelectedBtn = document.getElementById("playSelected");
    const pauseBtn = document.getElementById("pauseAudio");
    const stopBtn = document.getElementById("stopAudio");
    const closeBtn = document.getElementById("closeAudioPlayer");

    // Convert "1:30" or "01:10:25" to seconds
    function parseTimeToSeconds(timeStr) {
        const parts = timeStr.split(":").map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return parts[0];
    }

    // Load and parse JSON timing
    try {
        const res = await fetch(jsonPath);
        const json = await res.json();
        const rawStarts = json.verses.map(parseTimeToSeconds);

        // Convert to [{start, end}] by using the next start as end
        timingData = rawStarts.map((start, i) => {
            const end = rawStarts[i + 1] ?? null;
            return { start, end };
        });
    } catch (err) {
        console.error("Failed to load timing JSON:", err);
        return;
    }

    // Add play buttons + dropdown options
    verses.forEach((verse, i) => {
        const copyWrapper = verse.querySelector('.copy-wrapper');
        const playBtn = document.createElement("button");
        playBtn.className = "play-btn";
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playBtn.setAttribute("data-index", i);
        copyWrapper.appendChild(playBtn);

        playBtn.addEventListener("click", () => {
            const lastIndex = timingData.length - 1;
            setRangeAndShow(i, lastIndex);
        });

        const optionStart = document.createElement("option");
        const optionEnd = document.createElement("option");
        optionStart.value = i;
        optionEnd.value = i;
        optionStart.textContent = `Verse ${i + 1}`;
        optionEnd.textContent = `Verse ${i + 1}`;
        startDropdown.appendChild(optionStart);
        endDropdown.appendChild(optionEnd);
    });

    function setRangeAndShow(startIndex, endIndex) {
        audioBar.classList.add("show");
        currentStart = timingData[startIndex]?.start || 0;
        currentEnd = timingData[endIndex]?.end ?? audio.duration;
        highlightVerse(startIndex);
        startDropdown.value = startIndex;
        endDropdown.value = endIndex;
    }

    function setRangeAndPlay(startIndex, endIndex) {
        audioBar.classList.add("show");
        currentStart = timingData[startIndex]?.start || 0;

        const fallbackEnd = timingData[endIndex]?.end;
        currentEnd = (fallbackEnd != null) ? fallbackEnd : audio.duration;

        highlightVerse(startIndex);
        startDropdown.value = startIndex;
        endDropdown.value = endIndex;

        if (audio.currentTime < currentStart || audio.currentTime > currentEnd) {
            audio.currentTime = currentStart;
        }

        audio.play();
        isPlaying = true;
        monitorAudio(startIndex, endIndex);
    }


    playSelectedBtn.addEventListener("click", () => {
        const startIndex = parseInt(startDropdown.value);
        const endIndex = parseInt(endDropdown.value);
        if (
            isNaN(startIndex) ||
            isNaN(endIndex) ||
            !timingData[startIndex] ||
            !timingData[endIndex]
        ) return;
        setRangeAndPlay(startIndex, endIndex);
    });

    pauseBtn.addEventListener("click", () => {
        audio.pause();
        isPlaying = false;
        cancelAnimationFrame(raf);
    });

    stopBtn.addEventListener("click", () => {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        cancelAnimationFrame(raf);
        removeAllHighlights();
        document.getElementById('progressBar').style.width = '0%';

    });

    closeBtn.addEventListener("click", () => {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        removeAllHighlights();
        audioBar.classList.remove("show");
        document.getElementById('progressBar').style.width = '0%';

    });

    function highlightVerse(index) {
        removeAllHighlights();
        const verse = verses[index];
        if (verse) {
            verse.classList.add("highlight-verse");

            const rect = verse.getBoundingClientRect();
            const audioPlayerHeight = 100; // adjust this if your player is taller

            const isVisible =
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight - audioPlayerHeight);

            if (!isVisible) {
                verse.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }
    }




    function removeAllHighlights() {
        verses.forEach(v => v.classList.remove("highlight-verse"));
    }

    const progressBar = document.getElementById("progressBar");

    function monitorAudio(startIndex, endIndex) {
        const check = () => {
            if (!isPlaying) return;

            const now = audio.currentTime;
            const total = audio.duration;
            const percent = Math.max(0, Math.min(100, (audio.currentTime / total) * 100));

            progressBar.style.width = `${percent}%`;

            for (let i = startIndex; i <= endIndex; i++) {
                const { start, end } = timingData[i];
                if (now >= start && (end == null || now < end)) {
                    highlightVerse(i);
                    break;
                }
            }


            if (now >= currentEnd) {
                audio.pause();
                isPlaying = false;
                removeAllHighlights();
                progressBar.style.width = '0%';
                return;
            }

            raf = requestAnimationFrame(check);
        };

        raf = requestAnimationFrame(check);
    }

    const progressContainer = document.getElementById("progressContainer");

    progressContainer.addEventListener("click", (e) => {
        if (!currentEnd || !timingData.length) return;

        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percent = clickX / width;

        const newTime = percent * audio.duration;
        audio.currentTime = newTime;

        // If audio is not playing, update UI manually
        if (!isPlaying) {
            const now = newTime;
            const total = currentEnd - currentStart;
            const elapsed = now - currentStart;
            const percent = Math.max(0, Math.min(100, (elapsed / total) * 100));
            progressBar.style.width = `${percent}%`;
        }
    });


});
