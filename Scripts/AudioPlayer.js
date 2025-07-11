document.addEventListener("DOMContentLoaded", async () => {
    const audioPath = "Audios/Poem-Recitations/Laamiyah-Ibn-Taimiyyah-Audio.mp3";
    const jsonPath = "Scripts/Data/Laamiyah-Ibn-Taimiyyah-Audio-Timing.json";

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
        currentEnd = timingData[endIndex]?.end ?? audio.duration;
        highlightVerse(startIndex);
        startDropdown.value = startIndex;
        endDropdown.value = endIndex;
        audio.currentTime = currentStart;
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
    });

    closeBtn.addEventListener("click", () => {
        audio.pause();
        isPlaying = false;
        removeAllHighlights();
        audioBar.classList.remove("show");
    });

    function highlightVerse(index) {
        removeAllHighlights();
        const verse = verses[index];
        if (verse) verse.classList.add("highlight-verse");
    }

    function removeAllHighlights() {
        verses.forEach(v => v.classList.remove("highlight-verse"));
    }

    function monitorAudio(startIndex, endIndex) {
        const check = () => {
            if (!isPlaying) return;
            const now = audio.currentTime;

            for (let i = startIndex; i <= endIndex; i++) {
                const { start, end } = timingData[i];
                if (now >= start && now < end) {
                    highlightVerse(i);
                    break;
                }
            }

            if (now >= currentEnd) {
                audio.pause();
                isPlaying = false;
                removeAllHighlights();
                return;
            }

            raf = requestAnimationFrame(check);
        };
        raf = requestAnimationFrame(check);
    }
});
