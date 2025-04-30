document.addEventListener('DOMContentLoaded', () => {
    const ayahs = document.querySelectorAll('.ayah-block');

    ayahs.forEach((ayah) => {
        const arabic = ayah.querySelector('.arabic-text');
        const arabicWords = arabic?.textContent.trim().split(/\s+/) || [];

        arabic.textContent = ''; // Clear original text

        arabicWords.forEach((word) => {
            // Ignore Arabic numbers (٠-٩)
            if (/^[\u0660-\u0669]+$/.test(word)) {
                arabic.appendChild(document.createTextNode(word + ' '));
                return;
            }

            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;

            arabic.appendChild(span);
            arabic.appendChild(document.createTextNode(' '));
        });
    });

    precheckAllWords();
});

let currentAudio = null;

// Function to check if an audio file exists in Quran or Poems folder
async function checkAudioExists(wordText) {
    const quranPath = `../../Audios/Quran/${wordText}.MP3`;
    const poemsPath = `../../Audios/Poems/${wordText}.MP3`;

    try {
        const responseQuran = await fetch(quranPath, { method: 'HEAD' });
        if (responseQuran.ok) {
            return quranPath;
        }

        const responsePoem = await fetch(poemsPath, { method: 'HEAD' });
        if (responsePoem.ok) {
            return poemsPath;
        }
    } catch (error) {
        // Ignore errors silently
    }

    return null; // Not found
}

// Pre-check all words on page load
async function precheckAllWords() {
    const wordSpans = document.querySelectorAll('.word');

    for (const wordSpan of wordSpans) {
        const wordText = wordSpan.childNodes[0]?.nodeValue.trim();
        if (!wordText) continue;

        const sanitizedWord = wordText.replace(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '');
        const audioPath = await checkAudioExists(sanitizedWord);

        if (audioPath) {
            wordSpan.classList.add('audio-found');
        } else {
            wordSpan.classList.add('audio-missing');
        }
    }
}

// Play audio on click
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('word')) {
        const wordText = e.target.childNodes[0]?.nodeValue.trim();
        if (!wordText) return;

        const sanitizedWord = wordText.replace(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '');

        const audioPath = await checkAudioExists(sanitizedWord);

        if (!audioPath) {
            showPopup("Audio not available yet for this word.");
            return;
        }

        // Play audio if found
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentAudio = new Audio(audioPath);
        currentAudio.play();
    }
});

function showPopup(message) {
    let popup = document.getElementById('audioPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'audioPopup';
        popup.style.position = 'fixed';
        popup.style.bottom = '20px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.backgroundColor = 'var(--red-color)';
        popup.style.color = 'white';
        popup.style.padding = '10px 20px';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        popup.style.fontSize = '16px';
        popup.style.zIndex = '9999';
        popup.style.display = 'none';
        popup.style.transition = 'opacity 0.3s ease';
        popup.style.opacity = '0';
        document.body.appendChild(popup);
    }

    popup.textContent = message;
    popup.style.display = 'block';
    popup.style.opacity = '1';

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }, 2500);
}
