document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch Hafs page
        const response = await fetch('Al-Baqarah.html'); // Adjust if needed
        const hafsHtml = await response.text();
        const parser = new DOMParser();
        const hafsDoc = parser.parseFromString(hafsHtml, 'text/html');

        // Get all Hafs and Warsh ayahs
        const hafsAyahs = hafsDoc.querySelectorAll('.ayah-block .arabic-text');
        const warshAyahs = document.querySelectorAll('.ayah-block .arabic-text');

        warshAyahs.forEach((warshAyah, index) => {
            const hafsAyah = hafsAyahs[index];
            if (!hafsAyah) return;

            // Normalize text
            const hafsText = normalizeArabic(hafsAyah.textContent.trim());
            const warshText = normalizeArabic(warshAyah.textContent.trim());

            warshAyah.innerHTML = '';
            warshAyah.style.direction = 'rtl';

            // Split into graphemes and spaces
            const hafsSegments = splitArabicWithSpaces(hafsText);
            const warshSegments = splitArabicWithSpaces(warshText);

            const maxLength = Math.max(hafsSegments.length, warshSegments.length);

            let outputHtml = '';
            let diffBuffer = '';

            for (let i = 0; i < maxLength; i++) {
                const hafsSegment = hafsSegments[i] || '';
                const warshSegment = warshSegments[i] || '';

                if (warshSegment === ' ') {
                    // Flush diffBuffer if exists
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += ' ';
                    continue;
                }

                if (hafsSegment === warshSegment) {
                    // Flush diffBuffer if exists
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }

                    // Handle Ra' Muraqqaqah
                    if (isRaMuraqqaqah(hafsSegments, i)) {
                        outputHtml += `<span class="ra-muraqqaqah">${warshSegment}</span>`;
                    } else {
                        outputHtml += warshSegment;
                    }
                } else {
                    diffBuffer += warshSegment;
                }
            }

            // Flush any remaining diffBuffer
            if (diffBuffer.length > 0) {
                outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
            }

            warshAyah.innerHTML = outputHtml;
        });

    } catch (error) {
        console.error('Error loading or parsing Hafs page:', error);
    }
});

// Split Arabic text into graphemes + spaces
function splitArabicWithSpaces(text) {
    const segments = [];
    const regex = /(\s+)|(\p{Script=Arabic})([\u064B-\u065F\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\u0670]*)/gu;
    // ⬆️ Includes dagger Alif (ٰ)

    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match[1]) {
            segments.push(' ');
        } else if (match[2]) {
            segments.push(match[2] + (match[3] || ''));
        }
    }
    return segments;
}

// Normalize Arabic text (to NFC form)
function normalizeArabic(text) {
    return text.normalize('NFC');
}

// Detect if current Ra' should be treated as Muraqqaqah
function isRaMuraqqaqah(segments, index) {
    const current = segments[index] || '';
    const previous = segments[index - 1] || '';

    // Only if current is Ra'
    if (!current.startsWith('ر')) return false;

    // If Ra' has Kasrah (ِ) → ignore
    if (current.includes('\u0650')) {
        return false;
    }

    // If Ra' has Sukoon (ْ) → ignore
    if (current.includes('\u0652')) {
        return false;
    }

    // If Ra' has no harakat at all (bare letter) → treat as heavy (don't wrap)
    const harakatRegex = /[\u064B-\u0652\u0670]/; // All normal harakat + dagger Alif
    if (!harakatRegex.test(current)) {
        return false;
    }

    // Now check previous letter

    // Case 1: Previous letter has Kasrah
    if (previous.includes('\u0650')) {
        return true;
    }

    // Case 2: Previous is Ya' with Sukoon
    if (previous.startsWith('ي') && previous.includes('\u0652')) {
        return true;
    }

    return false;
}


