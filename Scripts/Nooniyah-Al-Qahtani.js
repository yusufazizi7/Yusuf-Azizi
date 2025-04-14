fetch('Scripts/Data/translations.json')
  .then(response => response.json())
  .then(allTranslations => {
    const verses = document.querySelectorAll('.poem-verse');

    verses.forEach((verse, verseIndex) => {
      const arabic = verse.querySelector('.arabic-text');
      const arabicWords = arabic?.textContent.trim().split(/\s+/) || [];
      const translationWords = allTranslations[verseIndex] || [];

      arabic.textContent = ''; // Clear original content

      let translationIndex = 0;

      arabicWords.forEach((word) => {
        if (word === '*') {
          // Just output the * symbol as-is
          arabic.appendChild(document.createTextNode(' * '));
          return;
        }

        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = translationWords[translationIndex] || '';

        translationIndex++;

        span.appendChild(tooltip);
        arabic.appendChild(span);
        arabic.appendChild(document.createTextNode(' '));
      });
    });
  })
  .catch(error => {
    console.error('Error loading translations.json:', error);
});