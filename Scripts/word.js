let currentAudio = null;

// Pre-check if an audio file exists
async function checkAudioExists(wordText) {
    try {
        const response = await fetch(`Audios/${wordText}.MP3`, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Cache to store whether audio exists or not
const audioStatusCache = {};

// Combined page load
document.addEventListener('DOMContentLoaded', async () => {
    const verses = document.querySelectorAll('.poem-verse');
    const wordElements = [];

    // First, split the Arabic text into words
    verses.forEach((verse) => {
        const arabic = verse.querySelector('.arabic-text');
        const arabicWords = arabic?.textContent.trim().split(/\s+/) || [];

        arabic.textContent = ''; // Clear original text

        arabicWords.forEach((word) => {
            if (word === '*') {
                arabic.appendChild(document.createTextNode(' * '));
                return;
            }

            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;

            arabic.appendChild(span);
            arabic.appendChild(document.createTextNode(' '));

            wordElements.push(span);
        });
    });

    // Then, check audio existence for each word
    for (const wordSpan of wordElements) {
        const wordText = wordSpan.childNodes[0]?.nodeValue.trim();
        if (!wordText) continue;

        const sanitizedWord = wordText.replace(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '');
        const exists = await checkAudioExists(sanitizedWord);

        audioStatusCache[sanitizedWord] = exists ? 'found' : 'missing';

        if (exists) {
            wordSpan.classList.add('audio-found');
        } else {
            wordSpan.classList.add('audio-missing');
        }
    }
});

// Play audio on click
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('word')) {
        const wordText = e.target.childNodes[0]?.nodeValue.trim();
        if (!wordText) return;

        const sanitizedWord = wordText.replace(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '');
        const audioPath = `Audios/${sanitizedWord}.MP3`;
        const silentAudioPath = `Audios/silent.mp3`;

        const status = audioStatusCache[sanitizedWord];

        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        if (status === 'found') {
            currentAudio = new Audio(audioPath);
        } else {
            currentAudio = new Audio(silentAudioPath);
        }

        currentAudio.play().catch(err => {
            console.log('Unexpected audio play error:', err);
        });
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
