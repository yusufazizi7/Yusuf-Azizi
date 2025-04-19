document.addEventListener('DOMContentLoaded', () => {
    const verses = document.querySelectorAll('.poem-verse');
  
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
      });
    });
  });
  


let currentAudio = null;

// Function to check if an audio file exists
async function checkAudioExists(wordText) {
    try {
        const response = await fetch(`Audios/${wordText}.MP3`, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Pre-check all words on page load
document.addEventListener('DOMContentLoaded', () => {
    const wordSpans = document.querySelectorAll('.word');

    wordSpans.forEach(async (wordSpan) => {
        const wordText = wordSpan.childNodes[0]?.nodeValue.trim();
        if (!wordText) return;

        const exists = await checkAudioExists(wordText);
        if (exists) {
            wordSpan.classList.add('audio-found');
        } else {
            wordSpan.classList.add('audio-missing');
        }
    });
});

// Play audio on click
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('word')) {
        const wordText = e.target.childNodes[0]?.nodeValue.trim();
        if (!wordText) return;

        const sanitizedWord = wordText.replace(/[^\p{Letter}\p{Mark}\p{Number}]/gu, '');
        const audioPath = `Audios/${sanitizedWord}.MP3`;

        // Check if the audio file exists first
        try {
            const response = await fetch(audioPath, { method: 'HEAD' });
            if (!response.ok) {
                // Show a popup if audio doesn't exist
                showPopup("Audio not available yet for this word.");
                return;
            }
        } catch (error) {
            showPopup("Audio not available yet for this word.");
            return;
        }

        // Play audio if exists
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentAudio = new Audio(audioPath);
        currentAudio.play();
    }
});

function showPopup(message) {
    // Create popup div if it doesn't exist
    let popup = document.getElementById('audioPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'audioPopup';
        popup.style.position = 'fixed';
        popup.style.bottom = '20px'; /* ⬅️ At the bottom */
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.backgroundColor = 'var(--red-color)'; // Red colour for missing audio
        popup.style.color = 'white';
        popup.style.padding = '10px 20px';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        popup.style.fontSize = '16px';
        popup.style.zIndex = '9999';
        popup.style.display = 'none';
        popup.style.transition = 'opacity 0.3s ease'; /* Smooth fade */
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
        }, 300); // Wait until fade-out finishes
    }, 2500); // Visible for 2 seconds
}
