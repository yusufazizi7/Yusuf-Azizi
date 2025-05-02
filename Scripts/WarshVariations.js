document.addEventListener('DOMContentLoaded', () => {
    try {
        const warshAyahs = document.querySelectorAll('.ayah-block .arabic-text');

        warshAyahs.forEach((warshAyah) => {
            const hafsData = warshAyah.getAttribute('hafs-data');
            if (!hafsData) return;

            const hafsText = normalizeArabic(hafsData.trim());
            const warshText = normalizeArabic(warshAyah.textContent.trim());

            

            warshAyah.innerHTML = '';
            warshAyah.style.direction = 'rtl';

            const hafsSegments = splitArabicWithSpaces(hafsText);
            const warshSegments = splitArabicWithSpaces(warshText);
            const maxLength = Math.max(hafsSegments.length, warshSegments.length);

            let outputHtml = '';
            let diffBuffer = '';

            for (let i = 0; i < maxLength; i++) {
                const hafsSegment = hafsSegments[i] || '';
                const warshSegment = warshSegments[i] || '';
            
                if (warshSegment === ' ') {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += ' ';
                    continue;
                }
            
                const isHafsNumber = /^[\u0660-\u0669]+$/.test(hafsSegment);
                const isWarshNumber = /^[\u0660-\u0669]+$/.test(warshSegment);
            
                if (isHafsNumber && isWarshNumber) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += warshSegment;
                    continue;
                }
            
                // --- Special detection cases (priority order) ---
            
                if (isMadBadal(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += `<span class="mad-badal">${warshSegment}${warshSegments[i + 1]}</span>`;
                    i++; // skip next Alif
                    continue;
                }
            
                if (isRaMuraqqaqah(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += `<span class="ra-muraqqaqah">${warshSegment}</span>`;
                    continue;
                }
            
                if (isLamMulaqhazhah(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += `<span class="lam-mulaghazhah">${warshSegment}</span>`;
                    continue;
                }
            
                const taqlilInfo = isTaqlil(warshSegments, i);
                if (taqlilInfo && taqlilInfo.hasTaqlil) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    if (taqlilInfo.includeNext) {
                        outputHtml += `<span class="taqlil-word">${warshSegment}${warshSegments[i + 1]}</span>`;
                        i++; // skip next (the ىٰ)
                    } else {
                        outputHtml += `<span class="taqlil-word">${warshSegment}</span>`;
                    }
                    continue;
                }
            
                if (isSilahMeem(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += `<span class="silah-meem">${warshSegment}</span>`;
                    continue; // DO NOT increment i
                }
                
            
                if (isTanweenBeforeAlif(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += `<span class="diff-from-hafs">${warshSegment}${warshSegments[i + 1]}</span>`;
                    continue;
                }
            
                if (isHamzahMaddWithoutDiacritics(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += `<span class="diff-from-hafs">${warshSegment}${warshSegments[i + 1]}</span>`;
                    i++; // skip next (Alif Madd)
                    continue;
                }

                if (isSukoonAlifFollowedByHarakahAlif(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += `<span class="diff-from-hafs">${warshSegment}${warshSegments[i + 1]}</span>`;
                    i++; // skip next (Alif Madd)
                    continue;
                }

                if (isMadLin(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += `<span class="mad-lin">${warshSegments[i]}${warshSegments[i + 1]}</span>`;
                    i++; // skip the Hamzah next
                    continue;
                }

                if (isTatweelHamzahMadBadal(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                
                    outputHtml = outputHtml.slice(0, -warshSegments[i - 1].length); // remove already added baa
                
                    outputHtml += `<span class="mad-badal">${warshSegments[i - 1]}${warshSegment}${warshSegments[i + 1]}</span>`;
                    i++; // skip next (Alif)
                    continue;
                }
                
                

                if (isTatweelMadBadal(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += `<span class="mad-badal">${warshSegment}${warshSegments[i + 1]}</span>`;
                    i++; // skip next (Alif/Waw/Ya)
                    continue;
                }
                
                if (isMadBadalLamHamzahMadd(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                
                    // Remove last character from outputHtml (which was lam with kasrah already written)
                    outputHtml = outputHtml.slice(0, -warshSegments[i - 1].length);
                
                    // Now wrap previous + current in mad-badal
                    outputHtml += `<span class="mad-badal">${warshSegments[i - 1]}${warshSegments[i]}</span>`;
                    continue;
                }

                if (isTatweelBeforeAlifMadBadal(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                
                    outputHtml += `<span class="mad-badal">${warshSegment}</span>`;
                    continue;
                }
                
                
                
                if (isIdgham(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                
                    outputHtml += `<span class="idgham">${warshSegments[i]}${warshSegments[i + 1]}</span>`;
                    i++; // skip the next letter (e.g. Taa)
                    continue;
                }

                if (isMadBadalTatweelWithSmallYeh(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                
                    // Only wrap the current Tatweel with small Yeh
                    outputHtml += `<span class="mad-badal">${warshSegment}</span>`;
                    continue;
                }
                
                if (isMadBadalTatweelDaggerAlif(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                
                    outputHtml += `<span class="mad-badal">${warshSegments[i]}</span>`;
                    continue;
                }
                
                
                if (isTatweelHamzahFathahFollowedByTatweelDaggerAlif(warshSegments, i)) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                
                    // Only wrap the current Tatweel with Hamzah in mad-badal
                    outputHtml += `<span class="mad-badal">${warshSegment}</span>`;
                
                    // Let the next segment (Tatweel with Dagger Alif) be processed later
                    continue;
                }
                
                
                
            
                // --- Normal comparison if no special case ---
                if (hafsSegment === warshSegment) {
                    if (diffBuffer.length > 0) {
                        outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
                        diffBuffer = '';
                    }
                    outputHtml += warshSegment;
                } else {
                    diffBuffer += warshSegment;
                }
            }
            
            // After the loop: flush any remaining diffBuffer
            if (diffBuffer.length > 0) {
                outputHtml += `<span class="diff-from-hafs">${diffBuffer}</span>`;
            }
            
            

            warshAyah.innerHTML = outputHtml;
        });

    } catch (error) {
        console.error('Error comparing with Hafs data:', error);
    }
});

// Split Arabic text into graphemes + spaces
function splitArabicWithSpaces(text) {
    const segments = [];
    const regex = /(\s+)|([\p{Script=Arabic}\u0640])([\u064B-\u065F\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\u0670]*)/gu;

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


// Normalize Arabic text
function normalizeArabic(text) {
    return text.normalize('NFC');
}

// Detect if current Ra' should be treated as Muraqqaqah
const raMuraqqaqahExceptions = [
    'إِسۡرَآءِيلَ'
    // Add more as needed
];

function isRaMuraqqaqah(segments, index) {
    const current = segments[index] || '';
    const previous = segments[index - 1] || '';
    const beforePrevious = segments[index - 2] || '';
    const next = segments[index + 1] || '';

    if (!current.startsWith('ر')) return false;

    // 🔒 Exception check using wider window
    const context = segments.slice(index - 5, index + 6).join('').replace(/\s+/g, '');
    for (const word of raMuraqqaqahExceptions) {
        if (context.includes(word)) return false;
    }

    // Ra' must not have Kasrah or Sukoon itself
    if (current.includes('\u0650') || current.includes('\u0652')) return false;

    const harakatRegex = /[\u064B-\u0652\u0653\u0657\u0670\u067E\u065E\u0657]/;
    if (!harakatRegex.test(current)) return false;

    if (next.startsWith('ط')) return false;

    const decomposedPrev = previous.normalize('NFD');
    const decomposedBeforePrev = beforePrevious.normalize('NFD');

    if (previous.includes('\u0650')) return true;
    if (decomposedPrev === 'ي') return true;
    if (decomposedPrev.startsWith('ي') && decomposedPrev.includes('\u06E1')) return true;
    if (decomposedPrev.includes('\u06E1') && decomposedBeforePrev.includes('\u0650')) return true;

    return false;
}





function isSukoonAlifFollowedByHarakahAlif(segments, index) {
    const current = segments[index] || '';
    const next = segments[index + 1] || '';
    const afterNext = segments[index + 2] || '';

    // We expect: [ 'اْ', ' ', 'اَ|اُ|اِ' ]
    if (!current.startsWith('ا')) return false;

    const decomposedCurrent = current.normalize('NFD');
    const isAlifWithSukoon = decomposedCurrent.startsWith('ا') && decomposedCurrent.includes('\u0652'); // Sukoon = ْ
    if (!isAlifWithSukoon) return false;

    if (next !== ' ') return false;

    // Must not start with أ (U+0623) or إ (U+0625)
    if (afterNext.startsWith('أ') || afterNext.startsWith('إ')) return false;

    const decomposedAfterNext = afterNext.normalize('NFD');
    const isHarakahAlif =
        decomposedAfterNext.startsWith('ا') &&
        (
            decomposedAfterNext.includes('\u064E') || // Fathah
            decomposedAfterNext.includes('\u064F') || // Dammah
            decomposedAfterNext.includes('\u0650')    // Kasrah
        );

    return isHarakahAlif;
}

function isMadLin(segments, index) {
    const current = segments[index] || '';
    const next = segments[index + 1] || '';

    const decomposedCurrent = current.normalize('NFD');
    const decomposedNext = next.normalize('NFD');

    // Case 1: Ya with Quranic Sukoon before normal Hamzah
    const isYaWithSukoon = decomposedCurrent.startsWith('ي') && decomposedCurrent.includes('\u06E1');
    const isNextHamzah = decomposedNext.startsWith('ء');

    // Case 2: Ya with Quranic Sukoon before Tatweel + Hamzah Above (ـٔ)
    const isTatweelHamzah = decomposedNext.includes('\u0640') && decomposedNext.includes('\u0654');

    return isYaWithSukoon && (isNextHamzah || isTatweelHamzah);
}






function isLamMulaqhazhah(segments, index) {
    const current = segments[index] || '';
    const previous = segments[index - 1] || '';

    // Check if the current letter is Laam (ل)
    if (!current.startsWith('ل')) return false;

    // ✅ Laam must have only Fathah (◌َ)
    const hasFathahOnly = current.includes('\u064E');
    if (!hasFathahOnly) return false;

    // Check if the previous letter is Ṣād (ص) or Ẓāʾ (ظ) with Fathah
    const validHeavyLetter = (previous.startsWith('ص') || previous.startsWith('ظ')) && previous.includes('\u064E');
    return validHeavyLetter;
}


function isMadBadal(segments, index) {
    const previous = segments[index - 1] || '';
    const current = segments[index] || '';
    const next = segments[index + 1] || '';
    const afterNext = segments[index + 2] || '';

    // --- 1. Original case: ٱ + ل + ا ---
    if (previous.startsWith('ٱ') && current.startsWith('ل') && next.startsWith('ا')) {
        const decomposed = afterNext.normalize('NFD');
        const hasSukoon = decomposed.includes('\u06E1'); // Quranic sukoon ۡ
        return !hasSukoon;
    }

    // --- 2. Other Mad Badal forms: ءَا / ءُو / ءِي ---
    const decomposedCurrent = current.normalize('NFD');
    const decomposedNext = next.normalize('NFD');

    const isHamzahAlif = decomposedCurrent.startsWith('ء') && decomposedCurrent.includes('\u064E') && decomposedNext === 'ا';
    const isHamzahWaw  = decomposedCurrent.startsWith('ء') && decomposedCurrent.includes('\u064F') && decomposedNext.startsWith('و');
    

    return isHamzahAlif || isHamzahWaw;
}


function isTatweelBeforeAlifMadBadal(segments, index) {
    const previous = segments[index - 1] || '';
    const current = segments[index] || '';

    // Check if current is plain Alif
    if (current !== 'ا') return false;

    // Check if previous is just Tatweel (no diacritics)
    const decomposedPrev = previous.normalize('NFD');
    return decomposedPrev === '\u0640'; // Tatweel only
}




function isHamzahMaddWithoutDiacritics(segments, index) {
    const current = segments[index] || '';
    const next = segments[index + 1] || '';
    const afterNext = segments[index + 2] || '';

    if (!current || !next || !afterNext) return false;

    const decomposedCurrent = current.normalize('NFD');
    const decomposedNext = next.normalize('NFD');
    const decomposedAfterNext = afterNext.normalize('NFD');

    // Step 1: Hamzah with Fathah (ءَ)
    const isHamzahWithFathah =
        decomposedCurrent.startsWith('ء') && decomposedCurrent.includes('\u064E');

    // Step 2: Alif with Maddah = ا + Maddah Above (ٓ = \u0653)
    const isAlifMadd = decomposedNext.startsWith('ا') && decomposedNext.includes('\u0653');

    if (!(isHamzahWithFathah && isAlifMadd)) {
        return false;
    }

    // Step 3: Check if the letter after has *no* diacritics
    const hasHarakah = /[\u064B-\u0652\u0653]/.test(decomposedAfterNext);

    return !hasHarakah;
}




function isTanweenBeforeAlif(segments, index) {
    const current = segments[index] || '';
    const next = segments[index + 1] || '';
    const afterNext = segments[index + 2] || '';

    if (!current) return false;

    // Step 1: Check if current (last letter of word1) has Tanween
    const decomposedCurrent = current.normalize('NFD');
    const endsWithFathatan = decomposedCurrent.endsWith('\u064B');
    const endsWithDammatan = decomposedCurrent.endsWith('\u064C');
    const endsWithKasratan = decomposedCurrent.endsWith('\u064D');

    const hasTanween = endsWithFathatan || endsWithDammatan || endsWithKasratan;
    if (!hasTanween) return false;

    // Step 2: Check if next segment is a space
    if (next !== ' ') return false;

    // Step 3: Now check after the space (afterNext) for Alif + Harakah
    const decomposedAfterNext = afterNext.normalize('NFD');

    const startsWithAlifFathah = decomposedAfterNext.startsWith('ا\u064E'); // اَ
    const startsWithAlifDhammah = decomposedAfterNext.startsWith('ا\u064F'); // اُ
    const startsWithAlifKasrah = decomposedAfterNext.startsWith('ا\u0650');  // اِ

    const startsWithAlifHarakah = startsWithAlifFathah || startsWithAlifDhammah || startsWithAlifKasrah;

    return startsWithAlifHarakah;
}





function isTaqlil(segments, index) {
    const current = segments[index] || '';
    const next = segments[index + 1] || '';

    if (!current) return false;

    const decomposedCurrent = current.normalize('NFD');
    const hasTaqlil = decomposedCurrent.includes('\u06EA'); // Taqlil mark

    if (!hasTaqlil) return false;

    const decomposedNext = next.normalize('NFD');

    const isSmallAlifOnYa =
        decomposedNext.startsWith('ى') && decomposedNext.includes('\u0670'); // ىٰ

    const isBareAlif = decomposedNext === 'ا'; // exactly Alif

    const isTatweelWithDaggerAlif =
        decomposedNext.startsWith('\u0640') && decomposedNext.includes('\u0670'); // ـٰ

    return {
        hasTaqlil: true,
        includeNext: isSmallAlifOnYa || isBareAlif || isTatweelWithDaggerAlif
    };
}




function isSilahMeem(segments, index) {
    const current = segments[index] || '';
    const decomposed = current.normalize('NFD');

    // It must contain ALL of these marks
    const requiredMarks = ['\u064F', '\u06E5', '\u0653']; // Dammah, Small Waw, Maddah

    // Step 1: First letter must be Meem
    if (!decomposed.startsWith('م')) return false;

    // Step 2: Ensure all required marks are present
    for (const mark of requiredMarks) {
        if (!decomposed.includes(mark)) return false;
    }

    // Step 3: Ensure no extra base letter sneaks in
    const baseLetters = Array.from(decomposed).filter(char =>
        /\p{Script=Arabic}/u.test(char) && !requiredMarks.includes(char)
    );

    if (baseLetters.length !== 1 || baseLetters[0] !== 'م') return false;

    return true;
}

function isTatweelMadBadal(segments, index) {
    const current = segments[index] || '';
    const next = segments[index + 1] || '';

    const decomposed = current.normalize('NFD');
    const nextChar = next.normalize('NFC');

    // Must contain Tatweel
    if (!decomposed.includes('\u0640')) return false;

    // Must contain Hamzah Above (ٔ)
    if (!decomposed.includes('\u0654')) return false;

    // Match based on vowel and following letter
    const hasFathah = decomposed.includes('\u064E');
    const hasDhammah = decomposed.includes('\u064F');
    const hasKasrah = decomposed.includes('\u0650');

    if (hasFathah && nextChar === 'ا') return true;  // Mad Badal with Alif
    if (hasDhammah && nextChar === 'و') return true; // Mad Badal with Waw
    if (hasKasrah && nextChar === 'ي') return true;  // Mad Badal with Ya

    return false;
}

function isMadBadalLamHamzahMadd(segments, index) {
    const current = segments[index] || '';
    const previous = segments[index - 1] || '';

    const decomposedCurrent = current.normalize('NFD');
    const decomposedPrevious = previous.normalize('NFD');

    // Previous must be Laam with Kasrah
    const isLaamWithKasrah = decomposedPrevious.startsWith('ل') && decomposedPrevious.includes('\u0650');

    // Current must be Alif with Hamzah above and Maddah above
    const isAlifHamzahMadd = decomposedCurrent.startsWith('ا') &&
                              decomposedCurrent.includes('\u0654') && // Hamzah Above
                              decomposedCurrent.includes('\u0653');  // Maddah

    return isLaamWithKasrah && isAlifHamzahMadd;
}


function isTatweelHamzahMadBadal(segments, index) {
    const prev = segments[index - 1] || '';
    const current = segments[index] || '';
    const next = segments[index + 1] || '';

    // Decompose all parts
    const decomposedPrev = prev.normalize('NFD');
    const decomposedCurrent = current.normalize('NFD');

    // Check for Baa with Kasrah
    const isBaaKasrah = decomposedPrev.startsWith('ب') && decomposedPrev.includes('\u0650');

    // Check for Tatweel + Fathah + Hamzah Above
    const isTatweelFathahHamzah =
        decomposedCurrent.startsWith('\u0640') && // Tatweel
        decomposedCurrent.includes('\u064E') &&   // Fathah
        decomposedCurrent.includes('\u0654');     // Hamzah Above

    // Check next is Alif
    const isAlif = next === 'ا';

    return isBaaKasrah && isTatweelFathahHamzah && isAlif;
}



function isIdgham(segments, index) {
    const current = segments[index] || '';       // Thaal
    const next = segments[index + 1] || '';      // Taa with shaddah

    // Must be ذ (Thaal) with no diacritics
    const decomposedCurrent = current.normalize('NFD');
    const isThaalBare = decomposedCurrent.startsWith('ذ') && !/[\u064B-\u0652\u0653\u0654]/.test(decomposedCurrent);

    // Must be ت with Shaddah
    const decomposedNext = next.normalize('NFD');
    const isTaaWithShaddah = decomposedNext.startsWith('ت') && decomposedNext.includes('\u0651');

    return isThaalBare && isTaaWithShaddah;
}


function isMadBadalTatweelWithSmallYeh(segments, index) {
    const current = segments[index] || '';
    const prev = segments[index - 1] || '';

    const decomposedPrev = prev.normalize('NFD');
    const decomposedCurrent = current.normalize('NFD');

    // Case: current is Tatweel with Small Yeh Above (ۧ)
    const isCurrentTatweelSmallYeh =
        decomposedCurrent.startsWith('\u0640') &&
        decomposedCurrent.includes('\u06E7'); // ۧ = U+06E7

    // Previous is Tatweel with Kasrah and Hamzah Above (ـِٔ)
    const isPreviousTatweelKasrahHamzah =
        decomposedPrev.startsWith('\u0640') &&
        decomposedPrev.includes('\u0650') && // Kasrah
        decomposedPrev.includes('\u0654');   // Hamzah Above

    return isPreviousTatweelKasrahHamzah && isCurrentTatweelSmallYeh;
}

function isMadBadalTatweelDaggerAlif(segments, index) {
    const prev1 = segments[index - 1] || '';
    const prev2 = segments[index - 2] || '';
    const current = segments[index] || '';

    const decomposed = current.normalize('NFD');

    const isTatweelDaggerAlif = decomposed.includes('\u0640') && decomposed.includes('\u0670'); // Tatweel + dagger alif

    const isAlifLamFathah = prev2 === 'ٱ' && prev1.normalize('NFD').startsWith('ل') && prev1.includes('\u064E');

    return isAlifLamFathah && isTatweelDaggerAlif;
}


function isTatweelHamzahFathahFollowedByTatweelDaggerAlif(segments, index) {
    const current = segments[index] || '';
    const next = segments[index + 1] || '';

    const decomposedCurrent = current.normalize('NFD');
    const decomposedNext = next.normalize('NFD');

    const isCurrentTatweelWithFathahHamzah =
        decomposedCurrent.startsWith('\u0640') &&
        decomposedCurrent.includes('\u064E') && // Fathah
        decomposedCurrent.includes('\u0654');   // Hamzah Above

    const isNextTatweelWithDaggerAlif =
        decomposedNext.startsWith('\u0640') &&
        decomposedNext.includes('\u0670'); // Dagger Alif

    return isCurrentTatweelWithFathahHamzah && isNextTatweelWithDaggerAlif;
}
