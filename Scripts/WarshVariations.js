// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const response = await fetch('Al-Baqarah.html'); // Adjust this path
//         const hafsHtml = await response.text();

//         const parser = new DOMParser();
//         const hafsDoc = parser.parseFromString(hafsHtml, 'text/html');

//         const hafsAyahs = hafsDoc.querySelectorAll('.ayah-block .arabic-text');
//         const warshAyahs = document.querySelectorAll('.ayah-block .arabic-text');

//         warshAyahs.forEach((warshAyah, index) => {
//             const hafsAyah = hafsAyahs[index];
//             if (!hafsAyah) return;

//             const hafsLetters = [...hafsAyah.textContent.trim()];
//             const warshLetters = [...warshAyah.textContent.trim()];

//             warshAyah.textContent = ''; // Clear the Warsh ayah

//             const minLength = Math.min(hafsLetters.length, warshLetters.length);

//             for (let i = 0; i < minLength; i++) {
//                 const hafsLetter = hafsLetters[i];
//                 const warshLetter = warshLetters[i];

//                 if (hafsLetter === warshLetter) {
//                     // SAME: add plain text
//                     if (warshAyah.lastChild && warshAyah.lastChild.nodeType === Node.TEXT_NODE) {
//                         warshAyah.lastChild.textContent += warshLetter;
//                     } else {
//                         warshAyah.appendChild(document.createTextNode(warshLetter));
//                     }
//                 } else {
//                     // DIFFERENT: wrap only this letter in a span
//                     const diffSpan = document.createElement('span');
//                     diffSpan.className = 'diff-from-hafs';
//                     diffSpan.textContent = warshLetter;
//                     warshAyah.appendChild(diffSpan);
//                 }
//             }

//             // If Warsh text is longer
//             for (let i = minLength; i < warshLetters.length; i++) {
//                 const diffSpan = document.createElement('span');
//                 diffSpan.className = 'diff-from-hafs';
//                 diffSpan.textContent = warshLetters[i];
//                 warshAyah.appendChild(diffSpan);
//             }
//         });

//     } catch (error) {
//         console.error('Failed to fetch Hafs page:', error);
//     }
// });
