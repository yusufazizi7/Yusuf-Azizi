document.addEventListener('DOMContentLoaded', () => {
    const ayahs = document.querySelectorAll('.ayah-block');

    ayahs.forEach((ayah) => {
        const arabic = ayah.querySelector('.arabic-text');
        if (!arabic) return;

        const originalNodes = Array.from(arabic.childNodes);
        arabic.innerHTML = ''; // Clear content

        let currentWordContainer = document.createElement('span');
        currentWordContainer.className = 'word';

        const flushWord = () => {
            if (currentWordContainer.innerHTML.trim()) {
                arabic.appendChild(currentWordContainer);
                arabic.appendChild(document.createTextNode(' '));
                currentWordContainer = document.createElement('span');
                currentWordContainer.className = 'word';
            }
        };

        for (const node of originalNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const chunks = node.textContent.split(/(\s+)/);
                for (const chunk of chunks) {
                    const trimmed = chunk.trim();

                    if (trimmed === '') {
                        flushWord();
                    } else if (/^[\u0660-\u0669\u06F0-\u06F9]+$/.test(trimmed)) {
                        flushWord();
                        arabic.appendChild(document.createTextNode(trimmed + ' '));
                    } else {
                        currentWordContainer.appendChild(document.createTextNode(chunk));
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const text = node.textContent.trim();

                if (/^[\u0660-\u0669\u06F0-\u06F9]+$/.test(text)) {
                    flushWord();
                    arabic.appendChild(document.createTextNode(text + ' '));
                } else if (/\s/.test(text)) {
                    const parts = text.split(/\s+/);
                    parts.forEach((part, i) => {
                        if (!part) return;
                        const spanClone = node.cloneNode(true);
                        spanClone.textContent = part;
                        currentWordContainer.appendChild(spanClone);
                        if (i < parts.length - 1) flushWord();
                    });
                } else {
                    currentWordContainer.appendChild(node.cloneNode(true));
                }
            }
        }

        flushWord(); // flush final
    });

    precheckAllWords();
});

let currentAudio = null;

async function checkAudioExists(wordText) {
    const quranPath = `../../Audios/Quran/${wordText}.MP3`;
    const poemsPath = `../../Audios/Poems/${wordText}.MP3`;

    try {
        const responseQuran = await fetch(quranPath, { method: 'HEAD' });
        if (responseQuran.ok) return quranPath;

        const responsePoem = await fetch(poemsPath, { method: 'HEAD' });
        if (responsePoem.ok) return poemsPath;
    } catch (error) {
        // Ignore
    }

    return null;
}

async function precheckAllWords() {
    const wordSpans = document.querySelectorAll('.word');

    for (const wordSpan of wordSpans) {
        const wordText = wordSpan.textContent.trim();
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

document.addEventListener('click', async function (e) {
    const wordSpan = e.target.closest('.word');
    if (!wordSpan) return;

    const wordText = wordSpan.textContent.trim();
    if (!wordText) return;

    const sanitizedWord = wordText.replace(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '');
    const audioPath = await checkAudioExists(sanitizedWord);

    if (!audioPath) {
        showPopup("Audio not available yet for this word.");
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(audioPath);
    currentAudio.play();
});

function showPopup(message) {
    let popup = document.getElementById('audioPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'audioPopup';
        Object.assign(popup.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--red-color)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontSize: '16px',
            zIndex: '9999',
            display: 'none',
            transition: 'opacity 0.3s ease',
            opacity: '0'
        });
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