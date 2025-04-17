fetch('Scripts/Data/translations.json')
  .then(response => response.json())
  .then(allTranslations => {
    const verses = document.querySelectorAll('.poem-verse');

    verses.forEach((verse, verseIndex) => {
      const wordSpans = verse.querySelectorAll('.arabic-text .word');
      const translationWords = allTranslations[verseIndex] || [];

      wordSpans.forEach((span, wordIndex) => {
        const translation = translationWords[wordIndex];
        if (translation) {
          const tooltip = document.createElement('span');
          tooltip.className = 'tooltip';
          tooltip.textContent = translation;
          span.appendChild(tooltip);
        }
      });
    });
  })
  .catch(error => {
    console.error('Error loading translations.json:', error);
  });
