document.addEventListener('DOMContentLoaded', function() {
        var checkbox = document.getElementById('LineNumbers');
        var poemList = document.querySelector('.poems');

    // Function to update the list style
        function updateListStyle() {
            if (checkbox.checked) {
                poemList.style.listStyleType = 'arabic-indic';

                
                } else {
                poemList.style.listStyleType = 'none';
                }
    }

    // Load the saved preference from localStorage
    var savedPreference = localStorage.getItem('showLineNumbers');
    if (savedPreference !== null) {
        checkbox.checked = JSON.parse(savedPreference);
    }

    // Initial update based on checkbox state
    updateListStyle();

    // Event listener for checkbox changes
    checkbox.addEventListener('change', function() {
        updateListStyle();
        // Save the current preference to localStorage
        localStorage.setItem('showLineNumbers', checkbox.checked);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var graphicToggle = document.getElementById('graphicToggle');
    var graphics = document.querySelectorAll('.poems object, .poems img, .poems div'); // Use querySelectorAll to select all elements with the class 'graphics'

    // Function to update the graphics display
    function updateGraphics() {
        graphics.forEach(function(graphic) { // Loop through all selected elements
            if (graphicToggle.checked) {
                graphic.style.display = '';
            } else {
                graphic.style.display = 'none';
            }
        });
    }

    // Load the saved preference from localStorage
    var graphicTogglePref = localStorage.getItem('showgraphics');
    if (graphicTogglePref !== null) {
        graphicToggle.checked = JSON.parse(graphicTogglePref);
    }

    // Initial update based on checkbox state
    updateGraphics();

    // Event listener for checkbox changes
    graphicToggle.addEventListener('change', function() {
        updateGraphics();
        // Save the current preference to localStorage
        localStorage.setItem('showgraphics', graphicToggle.checked);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var engTransToggle = document.getElementById('engTransToggle');
    var engTranslation = document.querySelectorAll('.engTranslation'); // Use querySelectorAll to select all elements with the class 'graphics'

    // Function to update the graphics display
    function toggleEngTranslation() {
        engTranslation.forEach(function(translationLine) { // Loop through all selected elements
            if (engTransToggle.checked) {
                translationLine.style.display = '';
            } else {
                translationLine.style.display = 'none';
            }
        });
    }

    // Load the saved preference from localStorage
    var engTransTogglePref = localStorage.getItem('showEngTranslation');
    if (engTransTogglePref !== null) {
        engTransToggle.checked = JSON.parse(engTransTogglePref);
    }

    // Initial update based on checkbox state
    toggleEngTranslation();

    // Event listener for checkbox changes
    engTransToggle.addEventListener('change', function() {
        toggleEngTranslation();
        // Save the current preference to localStorage
        localStorage.setItem('showEngTranslation', engTransToggle.checked);
    });
});





document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('.nooniyah li');

    // Example translations array for each word, this should be updated with the actual translations
    const translations = [
        ['Oh', 'Revealer', 'the Verses', 'and the Criterion', 'Between me', 'and between You', 'the sanctity', 'the Quran'],
        ['Open', 'with it', 'my chest', 'for knowledge', 'of guidance', 'and protect', 'with it', 'my heart', 'from', 'Satan'],
        ['Ease', 'with it', 'my affair', 'and settle', 'my needs', 'and save', 'with it', 'my body', 'from', 'the fires'],
        ['And lighten', 'with it', 'my load', 'and purify', 'intention', 'and increase', 'with it', 'my strength', 'and rectify', 'my state'],
        ['And remove', 'with it', 'my harm', 'and confirm', 'my repentance', 'and cause to profit', 'with it', 'my pledge', 'without', '[any] loss'],
        ['Cleanse', 'with it', 'my heart', 'and purify', 'my mind', 'Beautify', 'with it', 'my reputation', 'and raise', 'my position'],
        ['And cut off', 'with it', 'my greed', 'and honour', 'my ambition', 'Increase', 'with it', 'my piety', 'and give life', 'my heart'],
        ['Pass', 'with it', 'my night', 'and make thirsty', 'my limbs', 'Soak', 'with the flowing', 'its tears', 'my eyelids'],
        ['Mix it', 'oh', 'my Lord', 'with my flesh', 'with', 'my blood', 'and wash', 'with it', 'my heart', 'from', 'grudges'],
        ['You', 'the one who', 'fashioned me', 'and created me', 'and guided me', 'to the laws', 'faith'],
        ['You', 'the one who', 'taught me', 'had mercy on me', 'and made', 'my chest', 'consious', 'the Quran'],
        ['You', 'the one who', 'fed me', 'and give me drink', 'from', 'without', 'earning', 'hand', 'and not', 'trade'],
        
        ['and you restored me', 'covered me', 'aided me', 'and envoloped me', 'in grace', 'goodness'],

        ['You', 'the one who', 'gave me refuge', 'and awarded me', 'and guided me', 'from', 'confusion', 'disappointment'],
        
        ['And you planted', 'for me', 'between', 'the hearts', 'love', 'and the grace', 'from you', 'with mercy', 'and affection'],
        ['And you spread', 'for me', 'in', 'the worlds', 'virtues', 'and you covered', 'from', 'their eyes', 'my disobedience'],
        ['And you made', 'my reputation', 'among', 'the people', 'widespread', 'until', 'you made', 'all of them', 'my brothers'],
        ['By God', 'if', 'they knew', 'ugliness', 'my inner self', 'he would refuse', 'the Salaam', 'upon me', 'whoever', 'meets me'],

        ['and they would turn away', 'from me', 'and be fed up', 'my friendship', 'and I would draw on myself', 'after', 'honour', 'with disgrace'],
        ['But', 'you covered', 'my faults', 'and my flaws', 'and you bore', 'from', 'my error', 'and from', 'my transgression'],
        ['So for you', 'the praises', 'and the thanks', 'all of them', 'with my thoughts', 'and my limbs', 'and my tongue'],

        ['And certainly', 'you have bestowed', 'upon me', 'my Lord', 'with blessings', 'not', 'for me', 'for thanking', 'the least of them', 'two hands'],
        ['So by the truth', 'your wisdom', 'which', 'you have given me', 'until', 'you strengthened', 'with its light', 'my argument'],
        ['if', 'selected me', 'from', 'your pleasure', 'aid', 'until', 'strengthens', 'its power', 'my faith'],
        ['I will glorify you', 'morning', 'and evening', 'and will serve you', 'in', 'darkness', 'my pillars'],
        ['And I will remember you', 'standing', 'or', 'sitting', 'and I will thank you', 'other', 'times'],
        ['And I will hide', 'from', 'the people', 'my dire needs', 'and I will complain', 'to you', 'difficulty', 'my time'],
        ['And I will seek you', 'in', 'all', 'my needs', 'from', 'without', 'seeking', 'so-so [female]', 'so-so [male]'],
        ['And I will sever', 'from', 'the people', 'my hopes', 'with the severance', 'despair', 'did not', 'mix with it', 'my fingers'],
        ['And I will make', 'your pleasure', 'biggest', 'my goal', 'and I will strike', 'from', 'the desires', 'my devil'],
        ['And I will clothe', 'faults', 'my soul', 'with piety', 'and I will hold', 'from', 'wickedness', 'my reins'],
        ['And I will prevent', 'the soul', 'from', 'its desires', 'and I will make', 'asceticism', 'from', 'my helpers'],
        ['And I will recite', 'letters', 'your revelation', 'in', 'darkness', 'and I will burn', 'with its light', 'my devil'],
        ['You', 'the one who', 'Oh', 'my Lord', 'you said', 'its letters', 'and you described it', 'with admonition', 'and clarification'],

        ['And you constructed it', 'with eloquence', 'eternal', 'its howness', 'is hidden', 'upon', 'the minds'],
        ['And you wrote', 'in', 'the tablet', 'preserved', 'its letters', 'from', 'before', 'creation', 'the creation', 'in', 'times'],
        ['So Allah', 'my Lord', 'did not', 'cease', 'speaker', 'truly', 'when', 'what', 'he willed', 'owner', 'goodness'],
        ['He called out', 'with a voice', 'when', 'he spoke', 'his servant', 'Moses', 'then he made him hear', 'without', 'obscurity'],
        ['And likewise', 'will call out', 'in', 'day of resurrection', 'our Lord', 'loudly', 'so will hear', 'his voice', 'the two weighty beings'],
        ['That', 'oh', 'my servants', 'be silent', 'for me', 'and hear', 'word', 'the God', 'the Owner', 'and the Judge'],
        ['This', 'speech', 'our prophet', 'about', 'his Lord', 'truthfully', 'without', 'lie', 'and not', 'falsehood'],
        ['We are not', 'liken', 'his voice', 'with our speech', 'since', 'is not', 'comprehended', 'his description', 'with sight'],
        ['Not', 'encompass', 'the imaginations', 'extent', 'his essence', 'never', 'and not', 'contain him', 'diameter', 'place'],
        ['And he', 'the encompassing', 'with every', 'thing', 'his knowledge', 'from', 'without', 'heedlessness', 'and not', 'forgetfulness'],
        ['Who', 'this', 'describe', 'his essence', 'and his attributes', 'and he', 'the Pre-eternal', 'the creator', 'existences'],
        ['Glory be to him', 'a King', 'upon', 'the Throne', 'he rose', 'and he compassed', 'all', 'the kingdom', 'and the authority'],
        ['And his speech', 'the Quran', 'he sent down', 'its verses', 'as a revelation', 'upon', 'the one sent', 'from', 'Adnan'],
        ['Send blessings', 'upon him', 'Allah', 'best', 'his blessings', 'as long as', 'remain', 'in', 'their orbits', 'the two moons'],
        ['He', 'came', 'with the Quran', 'from', 'presence of', 'the one who', 'not', 'affect him', 'misfortunes', 'the time'],
        ['Revelation', 'Lord', 'the worlds', 'and his inspiration', 'with the testimony', 'the rabbis', 'and priests'],
        ['And the speech', 'my Lord', 'not', 'come', 'with its similar', 'anyone', 'even if', 'are gathered', 'for it', 'the two weighty beings'],
        ['And it', 'protected', 'from', 'the falsehoods', 'all of them', 'and from', 'addition', 'in it', 'and subtraction'],
        ['Who', 'is', 'he claims', 'that', 'he challenges', 'its construction', 'and he sees it', 'like', 'poetry', 'and senseless words'],
        ['Then let him bring', 'from him', 'with a chapter', 'or', 'a verse', 'then when', 'he sees', 'the constructions', 'be similar'],
        ['Then let him single himself out', 'with the name', 'the divinity', 'and let him be', 'Lord', 'the people', 'and let him say', 'Glory be to me'],
        ['then when', 'contradicts', 'his construction', 'then let him wear', 'garment', 'the failure', 'belittled', 'with humiliation'],
        ['Or', 'let him admit', 'that it', 'revelation', 'the one who', 'named it', 'in', 'text', 'the book', 'Mathani'],
        ['Not', 'doubt', 'in it', 'that it', 'his revelation', 'and beginning', 'the revelation', 'in', 'Ramadan'],
        ['Allah', 'explained it in detail', 'and perfected', 'its verses', 'and recited it', 'as a revelation', 'without', 'mistakes'],
        ['It', 'his word', 'and his speech', 'and his addressing', 'with articulacy', 'and eloquence', 'and clarity'],
        ['It', 'his judgement', 'it', 'his knowledge', 'it', 'his light', 'and his path', 'the guide', 'to', 'the pleasure'],
        ['He gathered', 'the sciences', 'its subtle', 'and its great', 'hence into it', 'delves', 'the scholar', 'righteous'],
        ['Stories', 'upon', 'best', 'the people', 'he narrated', 'my Lord', 'and he did good', 'what a', 'goodness'],
        ['And he clarified', 'in it', 'his lawful', 'and his unlawful', 'and he forbade', 'from', 'the sins', 'and the disobedience'],
        ['Who', 'says', 'indeed', 'Allah', 'creator', 'his word', 'then indeed', 'made lawful', 'worshiping', 'idols'],
        ['Who', 'says', 'about it', 'expression', 'and narration', 'then tomorrow', 'he will be forced to drink', 'from', 'boiling', 'water'],
        ['Who', 'says', 'indeed', 'its letters', 'created', 'then curse him', 'then', 'leave him', 'all', 'times'],
        ['not', 'meet', 'innovator', 'and not', 'heretic', 'except', 'with the frown', 'Maalik', 'the angry one'],
        ['And waqf', 'about', 'the Quran', 'wickedness', 'false', 'and deception', 'every', 'skeptic', 'confused'],
        ['Say', 'not', 'created', 'speech', 'our God', 'and hasten', 'and not', 'be', 'in', 'answering', 'slack'],
        ['People', 'the Shariah', 'gained certainty', 'with its revelation', 'and the those who say', 'of its creation', 'two forms'],
        ['And stay away from', 'both terms', 'indeed', 'both of them', 'and saying', 'Jahmites', 'to us', 'same'],
        ['Oh', 'the one', 'the Sunni', 'take', 'my advice', 'and dedicate', 'with this', 'a group', 'the brothers'],
        ['And accept', 'advice', 'kind-hearted one', 'compassionate one', 'and listen', 'with understanding', 'present', 'awake'],
        ['Be', 'in', 'your affairs', 'all of them', 'moderate', 'just', 'without', 'shortage', 'and not', 'bias'],
        ['And know', 'that', 'Allah', 'Lord', 'one', 'transcendant', 'from', 'third', 'or', 'second'],
        ['The First one', 'the Originator', 'without', 'a beginning', 'and the Last one', 'the Annihilator', 'and is not', 'perish'],
        ['And his speech', 'attribute', 'to him', 'and his glory', 'from him', 'without', 'duration', 'and not', 'beginning'],
        ['A pillar', 'the religion', 'that', 'you believe', 'in Qadha', 'not', 'good', 'in', 'a house', 'without', 'pillars'],
        ['Allah', 'already', 'knows', 'the happiness', 'and the misery', 'and they both', 'and their positions', 'opposites'],
        ['Not', 'possess', 'the servant', 'the weak', 'for his soul', 'guidance', 'and not', 'able', 'upon', 'disappointment'],
        ['Glory', 'the one who', 'manages', 'the affairs', 'with wisdom', 'in', 'the creation', 'with provision', 'and deprivation'],

        ['Was executed', 'his will', 'with the precedence', 'his knowledge', 'in', 'his creation', 'justly', 'without', 'oppression'],
        ['And all', 'in', 'mother', 'the book', 'written', 'from', 'without', 'heedlessness', 'and not',  'shortage'],
        ['So be moderate', 'may you be guided', 'and not', 'be', 'excessive', 'indeed', 'the pots', 'overflow', 'with boiling'],
        ['Adhere', 'to the Shariah', 'and the book', 'both of them', 'for both of them', 'to the religion', 'intermediaries'],
        ['And likewise', 'the Shariah', 'and the book', 'both of them', 'with everything', 'what', 'it brings', 'guardians'],
        ['And for every', 'servant', 'two guardians', 'for everything', 'that', 'falls upon', 'the reward', 'upon him', 'created'],
        ['They are commanded', 'with writing', 'his speech', 'his actions', 'and they both', 'to the command', 'Allah', 'obedient'],
        ['And Allah', 'true', 'his promise', 'and his threat', 'from what', 'see', 'his essence', 'the two eyes'],
        ['And Allah', 'bigger', 'that', 'are limited', 'his attributes', 'or', 'that', 'he is compared', 'to a group', 'created things'],
        ['And our life', 'in', 'the grave', 'after', 'our death', 'true', 'and will ask us', 'about it', 'the two angels'],
        ['And the grave', 'it is true', 'its pleasure', 'and its punishment', 'and both of them', 'for people', 'reserved'],
        ['And resurrection', 'after', 'death', 'promise', 'true', 'with the restoration', 'the souls', 'in', 'the bodies'],
        ['And our path', 'true', 'and the lake', 'our prophet', 'true', 'for it', 'the number', 'stars', 'vessels'],
        ['Will be given to drink', 'with it', 'the Sunni', 'the sweetest', 'drink', 'and will be driven away', 'every opposing', 'mischief-maker'],
        ['And likewise', 'the deeds', 'on that day', 'will be seen', 'placed', 'in', 'palm', 'scale'],
        ['And the records', 'on that day', 'will be scattered', 'among', 'the people', 'in the left', 'hands', 'and in the right'],
        ['And Allah', 'on that day', 'will come', 'for our judgement', 'although', 'that he', 'in', 'every', 'time', 'nearby'],
        ['And the Ashari', 'says', 'comes', 'his order', 'and finds it wrong', 'description', 'Allah', 'with coming'],
        ['And Allah', 'in the Quran', 'informed', 'that he', 'comes', 'without', 'transportation', 'and approaching'],
        ['And upon him', 'presentation', 'the creation', 'day', 'their return', 'for judgement', 'so that', 'are examined', 'the two adversaries'],
        
        ['And Allah', 'on that day', 'we will see', 'as', 'we see', 'a moon', 'appear', 'for six', 'after', 'eight'],
        ['Day', 'Judgement', 'if', 'you knew', 'its enormity', 'you would flee', 'from', 'family', 'and from', 'homelands'],
        ['A day', 'split apart', 'the sky', 'for its enormity', 'and turn grey', 'in it', 'heads', 'the children'],
        ['A day', 'severe', 'great', 'its evil', 'in', 'the creation', 'scattered', 'magnificent', 'grandeur'],
        ['And the Garden', 'lofty', 'and fire', 'hell', 'two homes', 'for the two adversaries', 'eternal'],
        ['A day', 'will come', 'the righteous', 'to their Lord', 'in delegations', 'upon', 'pure fragments', 'from', 'gold'],
        ['And will come', 'in it', 'the criminals', 'to', 'the scorching fire', 'they will smack their lips', 'the smacking', 'the thirsty'],
        ['And entering', 'some', 'Muslims', 'Hell-fire', 'for major', 'sins', 'and tyranny'],
        ['And Allah', 'will have mercy on them', 'for correctness', 'their beliefs', 'and they will be exchanged', 'from', 'fear', 'with assurance'],
        ['And their intercessor', 'when', 'exiting', 'Mohammad', 'and their purification', 'in', 'river', 'Al-Hayawan'],
        ['Until', 'when', 'they are purified', 'there', 'they will be entered', 'Gardens', 'Eden', 'and they', 'best', 'gardens'],
        ['So Allah', 'gather us', 'and them', 'in it', 'from', 'without', 'punishment', 'and disgrace'],
        ['And when', 'you are called', 'to', 'perform', 'obligation', 'then be vigorous', 'and not', 'be', 'in', 'answering', 'slack'],
        ['Perform', 'the prayers', 'five', 'and know', 'their worth', 'for for them', 'in the sight of Allah', 'the greatest', 'significance'],
        ['Not', 'withhold', 'Zakah', 'your wealth', 'wrongfully', 'for our prayer', 'and our Zakah', 'two sisters'],
        ['And Witr', 'after', 'Fard', 'the most emphasized', 'Sunnah', 'and Jummah', 'luminous', 'and the two Eids'],
        ['With', 'every', 'righteous one', 'pray it', 'or', 'wicked one', 'as long as', 'not', 'be', 'in', 'his religion', 'faulty'],
        ['And our fasting', 'Ramadan', 'obligation', 'compulsory', 'and our Qiyam', 'the Sunnah', 'in', 'Ramadan'],
        ['He prayed', 'the prophet', 'it', 'three', 'eagerly', 'and narrated', 'an assembly', 'that it', 'two'],
        ['Indeed', 'Taraweeh', 'a comfort', 'in', 'his night', 'and a revitalization', 'every', 'sluggish one', 'lazy one'],
        ['By Allah', 'not', 'he made', 'Taraweeh', 'Munkar', 'except', 'the Magians', 'and the group', 'crucifixes'],
        ['And Hajj', 'obligatory', 'upon you', 'and its condition', 'safety', 'the way', 'and health', 'the bodies'],
        ['Say Takbir', 'may you be guided', 'over', 'the Jinazah', 'four times', 'and ask', 'for it', 'with pardon', 'and forgiveness'],
        ['Indeed', 'the prayer', 'upon', 'the Jinazah', 'for us', 'fard', 'Al-Kifayah', 'not', 'upon', 'everyone'],
        ['Indeed', 'the crescents', 'for the people', 'measurements', 'and by them', 'establish', 'the accounting', 'every', 'period'],
        ['Not', 'break your fast', 'and not', 'fast', 'until', 'see', 'the exact', 'crescent', 'from', 'the people', 'two'],
        ['Two confident ones', 'upon', 'what', 'they see it', 'two free people', 'in their transmission', 'trustworthy'],
        ['Not', 'aim', 'for a day', 'doubtful', 'deliberately', 'lest you fast it', 'and say', 'from', 'Ramadan'],
        ['Not', 'believe', 'religion', 'the Rawafidh', 'indeed they are', 'the people', 'illogicality', 'and group', 'Satan'],
        ['They made', 'the months', 'upon', 'measuring', 'their calculation', 'and perhaps', 'completed', 'for us', 'two months'],
        ['And perhaps', 'fall short', 'which', 'it', 'for them', 'sufficient', 'and exceeded', 'the one', 'deficiency'],
        ['Indeed', 'the Rawafidh', 'the worst', 'who', 'step', 'on the', 'the pebbles', 'from', 'every', 'human', 'speaking', 'or', 'jinn'],
        ['They praised', 'the prophet', 'and regarded as traitors', 'his companions', 'and they accused them', 'of wrong-doing', 'and aggression'],
        ['They loved', 'his kin', 'and cursed', 'his companions', 'two arguments', 'in the sight', 'Allah', 'contradictory'],
        ['For it is as if', 'family', 'the prophet', 'his companions', 'a spirit', 'envelop', 'all of it', 'two bodies'],
        
        ['Two parties', 'their covenant', 'Shariah', 'Ahmad', 'with my father', 'and my mother', 'these two', 'parties'],
        ['Two parties', 'adherers', 'in', 'paths', 'the guidance', 'and they both', 'with religion', 'Allah', 'standing'],
        ['Say', 'Indeed', 'the best', 'the prophets', 'Mohammad', 'and the greatest', 'who', 'walk', 'upon', 'the dunes'],
        ['And the greatest', 'companions', 'the messengers', 'companions', 'Mohammad', 'and likewise', 'the best', 'his companions', 'the two Umars'],
        ['Two men', 'indeed', 'were created', 'for assistance', 'Mohammad', 'with my blood', 'and my soul', 'these two', 'men'],
        ['For they both', 'the ones who', 'supported', 'our prophet', 'in', 'his victory', 'and they both', 'to him', 'father-in-laws'],
        ['Their daughters', 'highest', 'wives', 'our prophet', 'and they both', 'to him', 'in revelation', 'companions'],
        ['Their fathers', 'the highest', 'companions', 'Ahmad', 'oh', 'what great', 'the two fathers', 'and the two daughters'],
        ['And they both', 'his ministers', 'the ones who', 'they', 'they', 'to the best', 'deeds', 'racing'],
        ['And they both', 'for Ahmad', 'his eyes', 'and his ears', 'and for their closeness', 'in', 'the grave', 'lying down'],
        ['They were', 'upon', 'Islam', 'most caring', 'its people', 'and they', 'for the religion', 'Mohammad', 'two Mountains'],
        

        ['The purest of them', 'the firmest of them', 'the most god-fearing of them', 'the most pious of them', 'in', 'secrecy', 'and in public'],
        ['The grandest of them', 'the purest of them', 'the highest of them', 'the most fulfilling of them', 'in', 'weight', 'and in excellence'],
        ['Seddiq', 'Ahmad', 'companion', 'the cave', 'the one who', 'he', 'in', 'the cave', 'and the prophet', 'the second'],
        ['I mean', 'Abu', 'Bakr', 'the one who', 'did not', 'differ', 'from', 'our Shariah', 'in', 'his virtue', 'two men'],
        ['He', 'elder', 'companions', 'the prophet', 'and the best of them', 'and their Imam', 'truly', 'without', 'falsehood'],
        ['And father', 'the pure one', 'the one who', 'her exoneration', 'indeed', 'came to us', 'in', 'Al-Noor', 'and the Furqan'],
        ['Honour', 'Aishah', 'the approved one', 'from', 'free ones', 'a virgin', 'pure', 'garmented', 'the chaste one'],
        ['She', 'wife', 'the best', 'the prophets', 'and his virgin', 'and his bride', 'from', 'a group', 'the women'],
        ['She', 'his spouse', 'she', 'his companion', 'she', 'his confidant', 'she', 'his love', 'truly', 'without', 'blemish'],
        ['Did he not', 'her father', 'devoted', 'her husband', 'and they both', 'with the spirit', 'Allah', 'coalescent'],
        ['When', 'fulfilled', 'Seddiq', 'Ahmad', 'his vow', 'he gave', 'the caliphate', 'to the Imam', 'second'],
        ['I mean', 'with it', 'Al-Farooq', 'he distinguished', 'valorously', 'with the sword', 'between', 'disbelief', 'and faith'],
        ['He', 'made evident', 'Islam', 'after', 'its concealment', 'and he erased', 'the darkness', 'and uncovered', 'the concealment'],
        ['And he passed', 'and left', 'the matter', 'consultation', 'among them', 'in', 'the matter', 'so they gathered', 'upon', 'Uthman'],
        ['Who', 'used to', 'spend', 'his night', 'in', 'a rakaah', 'witr', 'and he would finish', 'a completion', 'the Quran'],

        ['And held', 'the caliphate', 'the son-in-law', 'Ahmad', 'after him', 'I mean', 'Ali', 'the scholar', 'the righteous'],
        ['The husband', 'the pure one', 'the brother', 'the Messenger', 'and his pillar', 'the lion', 'wars', 'the dueler', 'of peers'],
        ['Glory be', 'the one who', 'made', 'the caliphate', 'a rank', 'and established', 'the imamate', 'what an', 'establishment'],
        ['And appointed', 'the companions', 'so that', 'not', 'claim', 'from', 'after', 'Ahmad', 'in prophecy', 'a second'],
        ['Honor', 'Fatimah', 'the pure', 'and her husband', 'and who', 'they both', 'to Mohammad', 'two grandsons'],

        ['Two branches', 'their roots', 'in garden', 'Ahmad', 'for Allah', 'springing out', 'the root', 'and the two branches'],
        ['Honour', 'Talha', 'and Zubair', 'and their Sa’d', 'and their Sa’eed', 'and Aabed', 'Arrahman'],
        ['And Abu', 'Ubaidah', 'owner', 'religiosity', 'and piety', 'and praise', 'assembly', 'pledge', 'Al-ridhwan'],
        ['Say', 'best', 'word', 'about', 'companions', 'Ahmad', 'and praise', 'all', 'the family', 'and the wives'],
        ['Leave', 'what', 'went on', 'between', 'the companions', 'in', 'conflict', 'with their swords', 'day', 'met', 'the two groups'],
        ['For their slain', 'from them', 'and their killer', 'for them', 'and both of them', 'in', 'day of gathering', 'be given mercy'],
        ['And Allah', 'day', 'gathering', 'remove', 'all', 'what', 'contain', 'their chests', 'from', 'grudges'],
        ['And woe', 'to the assembly', 'those who', 'hastened', 'to', 'Uthman', 'and gathered', 'upon', 'disobedience'],
        ['Woe', 'to the one who', 'killed', 'Husain', 'for he', 'indeed', 'drew upon himself', 'from', 'his master', 'loss'],
        ['We are not to', 'takfir', 'a Muslim', 'for a major sin', 'for Allah', 'owner', 'pardon', 'and owner', 'forgiveness'],
        ['Not', 'accept', 'from', 'the histories', 'all', 'what', 'gathered', 'the narrators', 'and wrote', 'every', 'finger'],
        ['Narrate', 'the hadith', 'chosen', 'from', 'its people', 'especially', 'those of', 'high status', 'and age'],
        ['Like Ibn', 'Al-Musayyib', 'and Al-Ala', 'and Maalik', 'and Layth', 'and Zuhri', 'or', 'Sufyan'],
        ['And memorise', 'narration', 'Jafar', 'Ibn', 'Mohammad', 'for his position', 'in it', 'the highest', 'position'],
        ['And keep', 'for Ahl', 'Al-Bait', 'due', 'their right', 'and recognise', 'Ali', 'what a', 'recognition'],
        ['Not', 'diminish him', 'and not', 'increase', 'in', 'his status', 'for over him', 'burn', 'the fire', 'two parties'],
        ['One of them', 'not', 'pleased with him', 'as a caliph', 'and declare him', 'the other one', 'god', 'second'],
        ['And curse', 'heretics', 'the ignorance', 'indeed they', 'their necks', 'shackled', 'to', 'the necks'],
        ['They rejected', 'the laws', 'and the prophethood', 'and they followed', 'the corruption', 'religion', 'owner', 'the Ewaan'],
        ['Not', 'lean', 'to', 'the Rawafidh', 'indeed they', 'cursed', 'the companions', 'without', 'proof'],
        ['They cursed', 'as', 'they hated', 'companions', 'Ahmad', 'and their love', 'obligation', 'upon', 'the human'],
        ['Love', 'the companions', 'and the kin', 'sunnah', 'casted', 'it', 'my Lord', 'when', 'he gave me life'],
        ['Beware', 'punishment', 'Allah', 'and hope', 'his reward', 'until', 'you are', 'like the one', 'for him', 'two hearts'],
        ['Our faith', 'in Allah', 'between', 'three', 'action', 'and words', 'and belief', 'the heart'],
        ['And it increases', 'with piety', 'and decreases', 'with wrong-doing', 'and both of them', 'in', 'the heart', 'wrestle'],
        ['And when', 'you are alone', 'with a temptation', 'in', 'darkness', 'and the soul', 'caller', 'to', 'transgression'],

        ['Then', 'be ashamed', 'from', 'gaze', 'the God', 'and say', 'to it', 'indeed', 'the one who', 'created', 'the darkness', 'sees me'],
        ['Be', 'a seeker', 'for knowledge', 'and do', 'good', 'for they are both', 'to', 'paths', 'the guidance', 'two causes'],
        ['Not', 'follow', 'science', 'the stars', 'for it is', 'related', 'to motifs', 'the soothsayers'],
        ['Science', 'the stars', 'and science', 'Shariah', 'Mohammad', 'in', 'heart', 'a servant', 'do not', 'come together'],
        ['If', 'it was', 'science', 'for stars', 'or', 'Qadha', 'did not', 'descend', 'Mars', 'in', 'Cancer'],
        ['And the sun', 'in', 'Aries', 'luminous', 'fast', 'and its descent', 'in', 'the star', 'Libra'],
        ['And the sun', 'burning', 'for six', 'stars', 'but it', 'and the moon', 'eclipse'],
        ['And perhaps', 'they both darkened', 'and disappeared', 'their light', 'and both of them', 'for fear', 'Allah', 'tremble'],
        ['Respond', 'upon', 'who', 'finds comfort', 'to them', 'and thinks', 'that', 'they both', 'two lords'],
        ['Oh', 'the one who', 'loves', 'Jupiter', 'and Mercury', 'and thinks', 'that they both', 'to him', 'sources of luck'],
        ['Why', 'they both descend', 'and ascend', 'honourably', 'and with blazing', 'heat', 'the sun', 'they burn'],
        ['Do you fear', 'from', 'Saturn', 'and have hope', 'Jupiter', 'and both of them', 'two servants', 'owned'],
        ['By Allah', 'if', 'they possessed', 'life', 'or', 'death', 'I would prostrate', 'towards them', 'so they do so'],
        ['And so they expand', 'in', 'my duration', 'and increase', 'my provision', 'and with goodness', 'they envelope me'],
        ['Rather', 'all', 'this', 'in', 'hand', 'Allah', 'the one who', 'humble', 'for the honour', 'his face', 'the two weighty beings'],

        ['For indeed', 'ascended', 'Saturn', 'and star', 'Jupiter', 'and the head', 'and the tail', 'the great', 'grandeur'],
        ['And Venus', 'radiant', 'with', 'its Mars', 'and Mercury blazing', 'with', 'Saturn'],
        ['If they meet', 'and form a square', 'and form a triangle', 'and form hexagon', 'and follow each other', 'in close proximity'],
        ['Is for it', 'indication', 'happiness', 'or', 'misery', 'no', 'by the one who', 'created', 'the people', 'and created me'],
        ['Who', 'says', 'with Al-Tathir', 'then he', 'rejecter', 'for the Shariah', 'follower', 'for a word', 'second'],
        ['Indeed', 'the stars', 'upon', 'three', 'types', 'then hear', 'the discourse', 'the critical', 'chief'],
        ['Some', 'the stars', 'created', 'adornment', 'for the sky', 'like pearls', 'above', 'the necklaces', 'the women'],
        ['And stars', 'guide', 'the traveller', 'in', 'darkness', 'and shooting stars', 'every', 'persistent', 'devil'],
        ['Not', 'knows', 'the human', 'what', 'is destined', 'tomorrow', 'when', 'every', 'day', 'our Lord', 'in', 'a matter'],
        ['And Allah', 'showers us', 'the rain', 'with his grace', 'not', 'star', 'Al-Awa', 'and not', 'Al-Dabaran'],
        ['Who', 'says', 'indeed', 'the rain', 'came', 'with Alhena', 'or', 'Sarfah', 'or', 'star', 'the Libra'],
        ['Then indeed', 'fabricated', 'a sin', 'and falsehood', 'and did not', 'send down', 'with it', 'the merciful', 'any', 'authority'],
        ['And likewise', 'naturalism', 'for Shariah', 'its opposite', 'and seldom', 'come together', 'two opposites'],
        ['And when', 'you seek', 'naturalist', 'humble', 'then seek', 'flames', 'the fire', 'in', 'ponds'],
        ['Science', 'the philosophers', 'the wicked', 'naturalism', 'and resurrection', 'the souls', 'without', 'bodies'],
        ['If not', 'the nature', 'according to them', 'and its actions', 'did not', 'walk', 'above', 'the earth', 'any', 'animal'],
        ['And the sea', 'source', 'all', 'water', 'according to them', 'and the sun', 'the first', 'source', 'fires'],
        ['And the rain', 'vapours', 'rise', 'whenever', 'continues', 'rain', 'heaving', 'pouring'],
        ['And the thunder', 'according', 'the philosopher', 'with his claim', 'sound', 'collision', 'the clouds', 'in', 'the sky'],
        ['And the lightning', 'according to them', 'flames', 'outside', 'between', 'the clouds', 'illuminate', 'in', 'times'],
        ['Lied', 'their Aristotle', 'in', 'his word', 'this', 'and exceeded', 'what a', 'delusion'],
        ['The rain', 'is poured', 'in', 'the clouds', 'from', 'the heaven', 'and weighs it', 'Michael', 'with the scale'],
        ['Not', 'a drop', 'except', 'and descends', 'towards it', 'an angel', 'to', 'the highlands', 'and the flood'],
        ['And the thunder', 'shriek', 'Maalik', 'and it', 'his name', 'he stirs', 'the clouds', 'like driver', 'camels'],
        ['And the lightning', 'flame', 'the fire', 'he drives away', 'with it', 'driving away', 'the drivers', 'the camels', 'with sticks'],
        ['So did', 'know', 'this', 'their Aristotle', 'arrangement', 'what', 'single out', 'with it', 'the two directions'],
        ['Or', 'disappear', 'under', 'the earth', 'or', 'ascended', 'the sky', 'then he saw', 'in it', 'the kingdom', 'seeing', 'eyes'],
        ['Or', 'he was', 'manage', 'it night', 'or its day', 'or', 'he was', 'know', 'how', 'they differ'],
        ['Or', 'traverse', 'Ptolemy', 'between', 'its stars', 'until', 'he saw', 'the moving', 'and the stationary'],
       
        ['Or', 'did', 'he cause to rise', 'its sun', 'and its moon', 'or', 'did', 'he see', 'how', 'they alternate'],
        ['Or did', 'he send', 'its wind', 'and its clouds', 'with rain', 'pouring down', 'what a', 'pouring down'],
        ['Rather', 'was', 'that', 'wisdom', 'Allah', 'the one who', 'by his decree', 'managed', 'the times'],
        ['Not', 'listen', 'word', 'strikers', 'with pebbles', 'and scolders', 'birds', 'by flying'],
        ['For the two factions', 'liars', 'upon', 'Qadha', 'and with knowledge', 'unseen', 'Allah', 'ignorant'],
        ['Lied', 'the engineer', 'and the astrologer', 'like him', 'for they both', 'for knowledge', 'Allah', 'claimants'],
        ['The earth', 'according', 'them both', 'round', 'and they both', 'with this', 'word', 'adherents'],
        ['And the earth', 'according', 'those', 'intelligence', 'flat', 'with proof', 'true', 'clear', 'Quran'],
        ['And Allah', 'made it', 'bed', 'for the creatures', 'and constructed', 'the sky', 'with the best', 'construction'],
        ['And Allah', 'informed', 'that it', 'flat', 'and clarified', 'this', 'what a', 'clarification'],
        ['Has it surrounded', 'with the earth', 'encompassing', 'their knowledge', 'or', 'with the mountains', 'lofty', 'sheltering'],
        ['Or', 'they inform', 'with its length', 'and its width', 'or', 'are', 'they', 'in magnitude', 'equal'],
        ['Or', 'they burst forth', 'its rivers', 'and springs', 'water', 'with it', 'quenched', 'extreme thirst', 'the thirsty'],
        ['Or', 'they brought out', 'its fruits', 'and its vegetation', 'and date-palms', 'containing', 'clusters', 'spathes'],
        ['Or', 'is', 'for them', 'knowledge', 'of quantity', 'its fruits', 'or', 'of the diversity', 'the taste', 'and the colours'],
        ['Allah', 'perfected', 'creation', 'that', 'all of it', 'as artistry', 'and perfected', 'what a', 'perfection'],
        ['Say', 'to the physician', 'the philosopher', 'with his claim', 'indeed', 'the nature', 'its science', 'my evidence'],
        ['Where', 'the nature', 'when', 'your being', 'a sperm', 'in', 'the womb', 'when', 'mixed', 'with it', 'the two waters'],
        ['Where', 'the nature', 'when', 'you turned', 'a clinging clot', 'in', 'forty', 'and forty', 'followed'],
        ['Where', 'the nature', 'when', 'your being', 'a lump of flesh', 'in forty', 'and already', 'passed', 'the two time frames'],
        ['Do you think', 'the nature', 'fashioned you', 'as a fashioned one', 'with ears', 'and eyes', 'and fingers'],
        ['Do you think', 'the nature', 'brought you out', 'upside down', 'from', 'womb', 'your mother', 'frail', 'body parts'],
        ['Or', 'it burst forth', 'for you', 'with milk', 'her breasts', 'so you drank her milk', 'until', 'passed', 'two years'],
        ['Or', 'it placed', 'in', 'your parents', 'love', 'so they both', 'with what', 'pleases you', 'delighted'],
        ['Oh', 'philosopher', 'indeed', 'you are preoccupied', 'from', 'guidance', 'with logic', 'Roman', 'and greek'],
        ['And law', 'Islam', 'the best', 'law', 'religion', 'the prophet', 'the truthful', 'Adnani'],
        ['It', 'religion', 'Lord', 'the worlds', 'and his law', 'and it', 'the ancient', 'and master', 'the religions'],    
     
        ['It', 'religion', 'Adam', 'and the angels', 'before him', 'it', 'religion', 'Noah', 'companion', 'Flood'],
        ['And to it', 'called', 'Hud', 'and Saleh', 'and they both', 'for religion', 'Allah', 'believers'],
        ['And with it', 'came', 'Lot', 'and companion', 'Midian', 'for they both', 'in', 'the religion', 'diligent'],
        ['It', 'religion', 'Abraham', 'and his two sons', 'together', 'and with it', 'he got saved', 'from', 'blow', 'fires'],
        ['And with it', 'protected', 'Allah', 'the sacrifice', 'from affliction', 'when', 'he offered him', 'with the biggest', 'sacrifice'],
        ['It', 'religion', 'Jacob', 'the prophet', 'and Jonah', 'and they both', 'in', 'Allah', 'tested'],
        ['It', 'religion', 'David', 'the caliph', 'and his son', 'and with it', 'he humbled', 'for him', 'kings', 'the Jinn'],
        ['It', 'religion', 'Yahya', 'with', 'his father', 'and his mother', 'good', 'the child', 'and excellent', 'the two elders'],
        ['And to it', 'called', 'Jesus', 'son', 'Mary', 'his people', 'did not', 'call them', 'to worship', 'crosses'],
        ['And Allah', 'made him speak', 'as a child', 'with guidance', 'in', 'the cradle', 'then', 'he raised', 'above', 'the children'],
        ['And completion', 'religion', 'Allah', 'Shariah', 'Mohammad', 'send blessings', 'upon him', 'the Revealer', 'the Quran'],
        ['The pure one', 'the righteous one', 'the one who', 'did not', 'gather', 'a day', 'upon', 'lapse', 'for him', 'parents'],
        ['Pure', 'wives', 'and children', 'the one who', 'from', 'his back', 'Al-Zahra', 'and the two Hasans'],
        ['And those', 'prophethood', 'and guidance', 'not', 'from them', 'anyone', 'Jewish', 'and not', 'Christian'],
        ['Rather', 'Muslims', 'and believers', 'in their Lord', 'inclined to truth', 'in', 'secrecy', 'and public'],
        ['And for religion', 'Islam', 'five', 'creeds', 'and Allah', 'made me speak', 'with them', 'and guided me'],
        ['Not', 'disobey', 'your Lord', 'speaking', 'or', 'doing', 'for they both', 'in', 'the sheets', 'written'],
        ['Beautify', 'your time', 'with silence', 'for it', 'ornament', 'the forbearing', 'and shield', 'the confused'],
        ['Be', 'next', 'your house', 'if', 'you hear', 'of an affliction', 'and stay away', 'every', 'hypocrite', 'afflictive'],
        ['Perform', 'the obligations', 'not', 'be', 'lazy', 'lest you be', 'in the sight', 'Allah', 'worst', 'disgraced one'],
        ['Maintain', 'the toothstick', 'with', 'ablution', 'for it', 'pleasing', 'the God', 'and purifying', 'the teeth'],
        ['Say name', 'the God', 'during', 'ablution', 'with intention', 'then', 'seek refuge', 'from affliction', 'Al-Walahan'],
        ['For the foundation', 'actions', 'the people', 'their intentions', 'and upon', 'the foundation', 'the pillars', 'the structure'],
        
        ['Perfect', 'your ablution', 'not', 'miss', 'its parts', 'for continuity', 'and thoroughness', 'obligatory'],
        ['So when', 'you sniff water', 'then not', 'overdo', 'too much', 'but it', 'a sniff', 'without', 'excessiveness'],
        ['And upon you', 'obligatory', 'washing', 'your face', 'all of it', 'and the water', 'followed', 'with it', 'the eyelids'],
        ['And wash', 'your hands', 'up to', 'the elbows', 'thoroughly', 'for they both', 'in', 'washing', 'included'],
        ['And wipe', 'your head', 'all of it', 'thoroughly', 'and the water', 'wiped', 'with it', 'the two ears'],
        ['And likewise', 'rinsing mouth', 'in', 'your ablution', 'Sunnah', 'with water', 'then', 'spit it out', 'the two lips'],
        ['And the face', 'and the palms', 'washing', 'them both', 'obligatory and include', 'in them', 'the two bones'],
        ['Washing', 'the two hands', 'before', 'the ablution', 'cleanliness', 'commanded', 'the prophet', 'with it', 'upon', 'excellency'],
        ['Especially', 'when', 'what', 'you get up', 'in', 'darkness', 'the night', 'and wake up', 'from', 'your sleep', 'the two eyes'],
        ['And likewise', 'the two feet', 'washing them both', 'together', 'obligatory', 'and include', 'in them', 'the two ankles'],
        ['Not', 'listen', 'word', 'the Rawafidh', 'indeed they', 'from', 'their opinion', 'that', 'are wipes', 'the two feet'],
        ['They interpret', 'a Qira’ah', 'abrogated', 'with a Qira’ah', 'and they both', 'sent down'],
        ['One of them', 'came down', 'to abrogate', 'its sister', 'but', 'they both', 'in', 'the sheets', 'recorded'],
        ['Washed', 'the prophet', 'and his companions', 'their feet', 'did not', 'differ', 'in', 'their washing', 'two men'],
        ['And the Sunnah', 'white', 'according', 'those of', 'intelligence', 'in', 'the judgement', 'decisive', 'upon the Quran'],
        ['So when', 'settle', 'your feet', 'in', 'their', 'leather socks', 'and they both', 'from', 'impurities', 'clean'],
        ['And you wanted', 'renewing', 'the purification', 'being impure', 'then its completion', 'that', 'are wiped', 'the leather socks'],
        ['And when', 'you wanted', 'purification', 'for Janabah', 'then they should be taken off', 'and should be washed', 'the two feet'],
        ['Ghusl', 'Janabah', 'in', 'the necks', 'a trust', 'so performing it', 'from', 'the most complete', 'the faith'],    
     
        ['So when', 'you are afflicted', 'then hasten', 'its washing', 'not', 'good', 'in', 'sluggish', 'lazy one'],
        ['And when', 'you perform Ghusl', 'then be', 'for your body', 'rubbing', 'until', 'encompass', 'all of it', 'the two palms'],
        ['And when', 'you don’t find', 'the water', 'be', 'one who does Tayammum', 'from', 'pure', 'soil', 'the earth', 'and the walls'],
        ['One who does Tayammum', 'you pray', 'or', 'one who does Wudhu', 'then both of them', 'in', 'the Shariah', 'sufficient'],
        ['And Ghusl', 'obligatory', 'and rubbing', 'Sunnah', 'and they both', 'in the Madhhab', 'Maalik', 'obligatory'],
        ['And the water', 'as long as', 'did not', 'change', 'its characteristics', 'with impurity', 'or', 'other', 'pollutants'],
        ['So when', 'it is pure', 'in', 'its colour', 'or', 'its taste', 'with', 'its smell', 'from', 'a group', 'impurities'],
        ['Then there', 'it is named', 'pure', 'and purifying', 'these two', 'most accurate', 'it description', 'these two'],
        ['So when', 'it is pure', 'in', 'its colour', 'or', 'its taste', 'from', 'mud', 'wells', 'and ground'],
        ['It is permitted', 'the Wudhu', 'for us', 'with it', 'and our purification', 'so listen', 'with a heart', 'present', 'awake'],

        ['And when', 'dies', 'in', 'the water', 'a soul', 'did not', 'permitted', 'from it', 'purification', 'for the reason', 'bleeding'],
        ['Except', 'when', 'was', 'the pond', 'running', 'abundant', 'without', 'measure', 'or not', 'scale'],
        ['Or', 'was', 'the dead', 'from what', 'did not', 'bleed', 'and the water', 'little', 'suitable', 'for washing'],
        ['And the sea', 'all of it', 'pure', 'its water', 'and it is permitted', 'its dead', 'from', 'fishes'],
        ['Beware', 'yourself', 'and the enemy', 'and his plot', 'for they both', 'for your harm', 'vigorous'],
        ['And beware', 'your ablution', 'excessiveness', 'and carelessness', 'for they both', 'in', 'the knowledge', 'cautioned against'],
        ['For little', 'your water', 'in', 'your ablution', 'deceit', 'so that it returns', 'its validity', 'to', 'invalidity'],
        ['And its washed parts', 'wiped', 'so beware', 'deception', 'the stubborn one', 'the treacherous one'],
        ['And much', 'your water', 'in', 'your ablution', 'innovation', 'it leads', 'to', 'whisperings', 'and negligence'],
        ['Not', 'increase too much', 'nor reduce', 'and be moderate', 'for moderation', 'and Tawfiq', 'companions'],
        ['And when', 'you perform Istijmar', 'then in', 'the hadith', 'three', 'did not', 'suffice us', 'a stone', 'and not', 'two stones'],
        ['From', 'reason', 'that', 'for every', 'exit', 'excretion', 'a passage', 'surrounds', 'upon it', 'two sides'],
        ['And when', 'the impurity', 'already', 'exceeded', 'area', 'usual', 'did not', 'suffice us', 'except', 'the water', 'with excessiveness'],
        ['The invalidation', 'the ablution', 'with a kiss', 'or', 'a touch', 'or long', 'sleep', 'or', 'with touch', 'the private part'],
        ['Or', 'urination', 'or', 'defecation', 'or sleep', 'or', 'passing wind', 'in', 'secret', 'or', 'public'],
        ['And from', 'Mathi', 'or', 'Wadi', 'both of them', 'from', 'where exits', 'the urine', 'they come out'],
        ['And perhaps', 'blowed', 'the wicked one', 'with his plot', 'until', 'joined together', 'for his blowing', 'the two thighs'],
        ['And clarification', 'that', 'its sound', 'or', 'its smell', 'these two', 'clarifications', 'true'],
        ['And Ghusl', 'obligatory', 'from', 'three', 'ways', 'ejaculation', 'semen', 'and menstruation', 'women'],
        ['Its ejaculation', 'in', 'sleep', 'or', 'wakefulness', 'two conditions', 'for purification', 'obligators'],
        ['And purification', 'the two spouses', 'obligation', 'mandatory', 'during', 'intercourse', 'when', 'meet', 'the two private parts'],
        ['So they both', 'if', 'they ejaculate', 'or withhold', 'then they', 'with the judgement', 'the Shariah', 'perform Ghusl'],
        ['And wash', 'when', 'you discharge Mathi', 'your private part', 'all of it', 'and the testicles', 'then are not', 'mandatory'],
        ['And menstruation', 'and lochia', 'root', 'same', 'when', 'stopping', 'the blood', 'they perform Ghusl'],
        ['And when', 'she returns', 'after', 'two months', 'the blood', 'that', 'irregular bleeding', 'after', 'those', 'two months'],
        ['So let her perform Ghusl', 'for her prayer', 'and her fasting', 'and the woman with irregular bleeding', 'her time', 'two halves'],
        ['So half', 'she leaves', 'her fasting', 'and praying', 'and blood', 'menstruation', 'and other than it', 'two colours'],
        ['And when clears', 'from her', 'and brightens', 'its colour', 'then her prayer', 'and fasting', 'obligatory'],
        ['She makes up', 'the fasting', 'and not', 'redo', 'her prayer', 'indeed', 'the prayer', 'returns', 'every', 'time'],
        ['For the Shariah', 'and the Quran', 'indeed', 'judged', 'with it', 'among', 'women', 'so they are not', 'dismissed'],
        ['And when', 'she sees', 'the woman with lochia', 'purity', 'she performs Ghusl', 'or', 'not', 'then maximum', 'her purity', 'two months'],
        ['Touching', 'women', 'upon', 'men', 'forbidden', 'cultivation', 'bad soil', 'loss', 'two cultivations'],
        ['Not', 'meet', 'your Lord', 'a thief', 'or', 'a traitor', 'or', 'a drinker', 'or', 'wrong-doer', 'or', 'a fornicator'],
        ['Say', 'indeed', 'stoning', 'the two adulterers', 'both of them', 'obligatory', 'when', 'they commit adultery', 'upon', 'Ihsan'],
        ['And stoning', 'in', 'the Quran', 'obligation', 'necessary', 'for the married', 'and are whipped', 'the unmarried'],



        ['And the wine', 'forbidden', 'its sale', 'and its purchase', 'same', 'that', 'to us', 'same'],
        ['In', 'the Shariah', 'and the Quran', 'was forbidden', 'its drinking', 'and both of them', 'not', 'doubt', 'followed'],
        ['Be certain', 'of the conditions', 'the day of Judgement', 'all of it', 'and listen', 'may you be guided', 'my advice', 'and clarification'],
        ['As the sun', 'rises', 'from', 'place', 'its setting', 'and emergence', 'the Dajjal', 'and rising', 'the smoke'],
        ['And emergence', 'Gog', 'and Magog', 'together', 'from', 'every', 'region', 'distant', 'and place'],
        ['And the descent', 'Jesus', 'as a killer', 'their Dajjal', 'he will rule', 'with judgement', 'justice', 'and excellence'],
        ['And mention', 'emergence', 'baby camel', 'she-camel', 'Saleh', 'It marks', 'the people', 'with disbelief', 'and faith'],
        ['And the revelation', 'is lifted', 'and the prayer', 'from the people', 'and they both', 'for the covenant', 'the religion', 'two intermediaries'],
        ['Pray', 'the prayer', 'five', 'first', 'their time', 'when', 'every', 'one', 'for it', 'two times'],
        ['Shortening', 'the prayer', 'upon', 'the traveller', 'obligatory', 'and the least', 'limit', 'the shortening', 'two stages'],
        ['Both of them', 'in', 'the principle', 'madhhab', 'Maalik', 'fifty', 'miles', 'its minus', 'two miles'],
        ['And when', 'the traveller', 'is away', 'from', 'his homes', 'then shortening', 'and breaking the fast', 'done'],
        ['And prayer', 'setting', 'our sun', 'and our morning', 'in', 'presence', 'and travels', 'complete'],
        ['And the sun', 'when', 'it disappears', 'from', 'the liver', 'the sky', 'then Dhuhr', 'then', 'Asr', 'obligatory'],
        ['And Dhuhr', 'last', 'its time', 'related', 'with Asr', 'and the two times', 'overlapped'],
        ['Not', 'look back', 'as long as', 'keep', 'in it', 'standing', 'and humble', 'with a heart', 'fearing', 'and alarmed'],
        ['And likewise', 'the prayer', 'setting', 'sun', 'our day', 'and our Isha', 'two times', 'connected'],
        ['And the morning', 'singular', 'with a time', 'single', 'but', 'for it', 'two times', 'singled'],
        ['Dawn', 'and daylight', 'and between', 'both of them', 'a time', 'for every', 'prolonger', 'sluggish'],
        ['And observe', 'rise', 'dawn', 'and be certain', 'with it', 'for dawn', 'according', 'our elders', 'two dawns'],
        ['Dawn', 'lying', 'then', 'a dawn', 'true', 'and perhaps', 'in', 'the eye', 'appear similar'],
       
        ['And the shadow', 'in', 'the times', 'different', 'as', 'time', 'winter', 'and summer', 'different'],
        ['Then recite', 'when', 'recites', 'the Imam', 'quietly', 'and be silent', 'when', 'what', 'was', 'of', 'loudness'],
        ['And for every', 'forgetfulness', 'two prostrations', 'then perform them', 'before', 'the Salam', 'and after it', 'two sayings'],
        ['Sunnahs', 'the prayer', 'clear', 'and its obligations', 'so ask', 'the elders', 'jurisprudence', 'and excellence'],
        ['Obligation', 'the prayer', 'its bowing', 'and its prostration', 'not', 'if', 'differ', 'in them', 'two men'],
        ['Its Tahrim', 'its Takbir', 'and it Tahlil', 'its taslim', 'and they both', 'obligatory'],
        ['And Al-Hamd', 'obligatory', 'in', 'the prayer', 'its recitation', 'its verses', 'seven', 'and they', 'Mathani'],
        ['In', 'every', 'Rak’ah', 'the prayer', 'repeated', 'in it', 'with the Basmalah', 'so take', 'my clarification'],
        ['And when', 'you forgot', 'its recitation', 'in', 'a Rak’ah', 'then make up', 'its Rak’ah', 'without', 'hesitation'],
        ['Follow', 'your Imam', 'lowering', 'or', 'raising', 'for they both', 'two actions', 'praised'],
        ['Not', 'raise', 'before', 'the Imam', 'and not', 'lower', 'for they both', 'two matters', 'blameworthy'],
        ['Indeed', 'the Shariah', 'Sunnah', 'and obligations', 'and they both', 'for religion', 'Mohammad', 'two ropes'],
        ['But', 'the Athaan', 'the morning', 'according', 'our elders', 'from', 'before', 'that', 'become distinct', 'the two fawns'],
        ['It', 'a concession', 'in', 'the morning', 'not', 'in', 'other than it', 'from', 'cause', 'awakening', 'heedless', 'drowsy'],
        ['Perfect', 'your prayer', 'bowing', 'or', 'prostrating', 'with calmness', 'gentleness', 'and humility'],
        ['Not', 'enter', 'to', 'your prayer', 'holding', 'for holding', 'disrupts', 'the pillars'],
        ['Pass', 'from', 'the night', 'the fasting', 'with an intention', 'from', 'before', 'that', 'become distinct', 'the two threads'],
        ['Suffices you', 'in', 'Ramadan', 'intention', 'a night', 'since', 'is not', 'mixed', 'with a period', 'second'],
        ['Ramadan', 'month', 'complete', 'in', 'our covenant', 'not', 'solves it', 'a day', 'and not', 'two days'],
        ['Except', 'the traveller', 'and the sick', 'for indeed', 'came', 'the delay', 'their fast', 'for a time', 'second'],
        ['And likewise', 'pregnancy', 'and breastfeeding', 'they both', 'in', 'breaking its fast', 'for our women', 'two excuses'],
        ['Hasten', 'with breaking the fast', 'and pre-dawn meal', 'delayed', 'for they both', 'two matters', 'desirable'],
        ['Protect', 'your fast', 'with silence', 'from', 'obscene speech', 'pull down', 'upon', 'your eyes', 'with the eyelids'],
        ['Not', 'walk', 'of', 'two faces', 'from', 'between', 'the people', 'the worst', 'the people', 'the one', 'for him', 'two faces'],
        ['Not', 'envy', 'anyone', 'over', 'their blessings', 'indeed', 'the envious', 'for the decree', 'your Lord', 'opposer'],
        ['Not', 'strive', 'between', 'two friends', 'gossip', 'for because of it', 'come to hate', 'two close friends'],
        ['And the eye', 'true', 'not', 'precedent', 'for what', 'is decreed', 'from', 'provisions', 'and deprivation'],
        ['And magic', 'disbelief', 'its action', 'not', 'its knowledge', 'from', 'here', 'differ', 'the two rulings'],
        ['And killing', 'punishment', 'the magicians', 'when', 'they', 'do', 'with it', 'for disbelief', 'and tyranny'],
        ['And seek', 'goodness', 'the parents', 'for indeed it', 'obligatory', 'upon you', 'and obedience', 'the authority'],
        ['Not', 'go out', 'against', 'the Imam', 'war-seeker', 'and if', 'that he', 'a man', 'from', 'Abyssinia'],
        ['And when', 'you are ordered', 'with an innovation', 'or', 'an error', 'then flee', 'with your religion', 'other', 'lands'],
        ['Religion', 'head', 'the wealth', 'so hold firmly', 'with it', 'for its loss', 'from', 'the greatest', 'losses'],
        ['Not', 'be alone', 'with a woman', 'with suspicion', 'if', 'you were', 'in', 'devoutness', 'like', 'Banaan'],
        ['Indeed', 'the men', 'the gazers', 'at', 'women', 'like', 'dogs', 'circle around', 'meats'],
        ['If', 'did not', 'protect', 'these', 'meat', 'its lions', 'it will be eaten', 'without', 'compensation', 'and not', 'payment'],
        ['Not', 'accept', 'from', 'the women', 'affection', 'for their hearts', 'quick', 'inclination'],
        ['Not', 'leave', 'anyone', 'with your family', 'alone', 'for over', 'women', 'fought', 'two brothers'],
        ['And lower', 'your eyelids', 'from', 'observance', 'women', 'and beauties', 'young men', 'and boys'],
        ['Not', 'make', 'divorce', 'your wife', 'your goal', 'indeed', 'divorce', 'the most detestable', 'the oaths'],
        ['Indeed', 'divorce', 'with', 'manumission', 'they both', 'two oaths', 'in the sight', 'Allah', 'detested'],
        ['And dig', 'for your secret', 'in', 'your heart', 'a grave', 'and bury it', 'in', 'the depths', 'what', 'a burial'],
        ['Indeed', 'the friend', 'with', 'the enemy', 'they both', 'in', 'secrecy', 'according', 'those of', 'intelligence', 'two types'],
        ['Not', 'appear', 'from you', 'to', 'your friend', 'a fault', 'and make', 'your heart', 'the most trustworthy', 'the two close friends'],
        ['Not', 'underestimate', 'from', 'the sins', 'their minors', 'for the drop', 'from it', 'bursting', 'bays'],
        ['And when', 'you make a vow', 'then be', 'with your vow', 'fulfiller', 'for the vow', 'like', 'the covenant', 'questioned'],
        ['Not', 'be occupied', 'with fault', 'other than you', 'heedless', 'from', 'fault', 'yourself', 'indeed it', 'two faults'],
        ['Not', 'waste', 'your life', 'in', 'argumentation', 'disputing', 'indeed', 'argumentation', 'disrupts', 'religions'],
        ['And beware', 'argumentation', 'men', 'for indeed it', 'leads', 'to', 'enmity', 'and resentment'],
        ['And when', 'you are compelled', 'to', 'argumentation', 'and did not', 'find', 'for you', 'a place to flee', 'and meet each other', 'the two sides'],
        ['Then make', 'book', 'Allah', 'a shield', 'ample', 'and the Shariah', 'your sword', 'and appear', 'in', 'the field'],
        ['And the Sunnah', 'white', 'before you', 'armour', 'and ride', 'steed', 'determination', 'in', 'the arena'],
        ['And stand firm', 'with your patience', 'under', 'banners', 'guidance', 'for patience', 'the most reliable', 'tool', 'the human'],
        ['And pierce', 'with the spear', 'the truth', 'every', 'stubborn one', 'for Allah', 'the emergence', 'the knight', 'the piercer'],
        ['And attack', 'with the sword', 'the truthfulness', 'attack', 'sincere', 'singly', 'for Allah', 'not', 'coward'],
        ['And beware', 'with your effort', 'cunning', 'your opponent', 'indeed he', 'like fox', 'wild', 'in', 'trickery'],
        ['The root', 'argumentation', 'from', 'questioning', 'and its branch', 'good', 'response', 'with the best', 'clarification'],
        ['Not', 'look back', 'during', 'the question', 'and not', 'repeat', 'the wording', 'the question', 'they both', 'two faults'],

    
        ['And when', 'defeat', 'the opponent', 'not', 'mock', 'with him', 'for boastfulness', 'extinguishes', 'ember', 'goodness'],
        ['For perhaps', 'was defeated', 'the warrior', 'deliberately', 'then', 'he turns aside', 'and attacks', 'the knights'],
        ['And be silent', 'when', 'fall', 'the opponents', 'and make noise', 'for perhaps', 'they casted you', 'in', 'whirlpool'],
        ['And perhaps', 'laughed', 'the opponents', 'for astonishment', 'then stand firm', 'and not', 'retreat', 'from', 'the evidence'],
        ['Then when', 'prolong', 'in', 'the speech', 'then say', 'to them', 'indeed', 'eloquence', 'was bridled', 'with clarity'],
        ['Not', 'get angry', 'when', 'you are questioned', 'and not', 'shout', 'for they both', 'traits', 'dispraised'],
        ['And beware', 'debate', 'in an assembly', 'fear', 'until', 'is replaced', 'fear', 'with tranquility'],
        ['Debate', 'an intellectual', 'fair', 'to you', 'intelligent', 'and be fair to him', 'you', 'according', 'what', 'you both see'],
        ['And be', 'between you', 'a wise one', 'as a judge', 'just', 'when', 'you came to him', 'seeking judgement'],
        ['Be', 'length', 'your time', 'silent', 'humble', 'for they both', 'for every', 'virtue', 'two doors'],
        ['And cast off', 'cloak', 'the arrogance', 'from you', 'for indeed it', 'not', 'bear', 'with carrying it', 'the shoulders'],
        ['Be doer', 'for good', 'and speaker', 'for it', 'for word', 'like', 'action', 'connected'],
        ['From', 'relief', 'a distressed one', 'and feeding', 'a hungry one', 'and clothing', 'a naked one', 'and ransom', 'a captive'],
        ['Then when', 'you do', 'the good', 'not', 'boast', 'with it', 'not', 'good', 'in', 'a boastful one', 'and one who reminds others of his favours'],
        ['Be grateful', 'upon', 'blessings', 'and be patient', 'for affliction', 'for they both', 'traits', 'praiseworthy'],
        ['Not', 'complain', 'with an ailment', 'or', 'scarcity', 'for they both', 'for honour', 'the person', 'dishonorable'],
        ['Preserve', 'nobility', 'your face', 'with contentment', 'only', 'preservation', 'the faces', 'manhood', 'young men'],
        ['In Allah', 'trust', 'and to him', 'return', 'and through him', 'seek help', 'so when', 'you do', 'then you', 'best', 'assisted'],
        ['And when', 'you disobey', 'then repent', 'to your Lord', 'swiftly', 'fear', 'the death', 'and not', 'say', 'no', 'did not', 'come the time'],
        ['And when', 'you are afflicted', 'with hardship', 'then be patient', 'for it', 'for hardship', 'singular', 'after', 'two eases'],
        ['Not', 'stuff', 'your stomach', 'with food', 'becoming fat', 'for bodies', 'people', 'the knowledge', 'not', 'fat'],
        ['Not', 'follow', 'your desires', 'your soul', 'excessively', 'for Allah', 'hates', 'a worshiper', 'lustful'],
        ['Reduce', 'your food', 'as much as', 'you can', 'for indeed it', 'benefit', 'the bodies', 'and health', 'the bodies'],
        ['And control', 'your desires', 'with tuning', 'your stomach', 'indeed it', 'the worst', 'the men', 'the weak', 'the one driven by his stomach'],
        ['And who', 'degrades himself', 'for his private part', 'and his stomach', 'then they both', 'for him', 'with', 'those', 'desires', 'two stomachs'],
        ['Preservation', 'healing', 'the hunger', 'and the thirst', 'and they both', 'for restraining', 'our souls', 'two chains'],
        ['Thirst', 'your day', 'you are quenched', 'in', 'the home', 'high', 'a day', 'last long', 'the yearning', 'the thirsty'],
        ['Good', 'nutrition', 'serves as substitute', 'from', 'drinking', 'medicine', 'especially', 'with', 'moderation', 'and consistency'],
        ['Beware', 'and the anger', 'intense', 'upon', 'medicine', 'for perhaps', 'lead', 'to', 'disappointment'],
        ['Take', 'your medicine', 'before', 'your drinking', 'and let it be', 'well-balanced', 'the components', 'and quantities'],
        ['And treat', 'with honey', 'pure', 'and do cupping', 'for they both', 'for your ailment', 'two cures'],
        ['Not', 'enter', 'the bathroom', 'full', 'stomach', 'not', 'good', 'in', 'bathing', 'for the full one'],
        ['And sleep', 'above', 'the rooftop', 'from', 'under', 'the sky', 'exhausts', 'and diminishes', 'vitality', 'the bodies'],
        ['Not', 'waste', 'your life', 'in', 'intercourse', 'for indeed it', 'covers', 'the faces', 'with covering', 'the pallor'],
        ['I warn you', 'from', 'breath', 'the old woman', 'and her private part', 'for they both', 'for body', 'her bedmate', 'two sicknesses'],
        ['Embrace', 'from', 'the women', 'every', 'young woman', 'Her breaths', 'like the fragrance', 'the basil'],
        ['Not', 'good', 'in', 'forms', 'musical instruments', 'all of it', 'and dancing', 'and playing rhythms', 'in', 'the rods'],
        ['Indeed', 'the pious one', 'for his Lord', 'abstaining', 'from', 'sound', 'strings', 'and listening', 'songs'],
        ['And recitation', 'the Quran', 'from', 'people', 'piety', 'especially', 'with good', 'passion', 'and good', 'articulation'],
        ['More delightful', 'and fulfilling', 'for the souls', 'in sweetness', 'from', 'sound', 'a flute', 'and tapping', 'drums'],
        ['And its melodious sound', 'in the night', 'the most pleasant', 'thing to hear', 'from', 'melody', 'flutes', 'and lutes'],
        ['Turn away', 'from', 'this world', 'low', 'as an ascetic', 'for asceticism', 'according', 'those of', 'intelligence', 'two asceticisms'],
        ['Asceticism', 'from', 'the world', 'and asceticism', 'in commendation', 'Blessed', 'for the one who', 'came', 'for him', 'the two asceticisms'],
        ['Not', 'seize', 'wealth', 'the orphans', 'wrongfully', 'and leave', 'usury', 'for they both', 'disobedience'],
        ['And keep', 'for your neighbour', 'his right', 'and honour', 'and for every', 'neighbour', 'Muslim', 'two rights'],
        ['And laugh', 'for your guest', 'when', 'comes down', 'his beast', 'indeed', 'the generous one', 'is delighted', 'with guests'],
        ['Keep connection', 'those of', 'kinship', 'from you', 'even if', 'they are harsh', 'for keeping connection with them', 'better', 'than', 'abandonment'],
        ['And be truthful', 'and not', 'swear', 'by your Lord', 'lying', 'and strive', 'in', 'atonement', 'the oaths'],
        ['And stay away', 'oaths', 'false', 'for indeed they', 'leave', 'the homes', 'desolate', 'the walls'],
       

        ['Limit', 'the marriage', 'from', 'free women', 'four', 'so seek', 'those of', 'the religion', 'and the chastity'],
        ['Not', 'marry', 'the women in mourning', 'in', 'waiting period', 'for her marriage', 'and her adultery', 'similar'],
        ['Waiting periods', 'the women', 'for it', 'obligations', 'four', 'but', 'connect', 'all of it', 'two principles'],
        ['Divorce', 'a husband', 'inside', 'or', 'his death', 'before', 'consummation', 'and after it', 'same'],
        ['And their limits', 'upon', 'three', 'menstrual cycles', 'or', 'months', 'and they both', 'two bridges'],
        ['And likewise', 'waiting period', 'the one who', 'died', 'her husband', 'seventy', 'days', 'after it', 'two months'],
        ['Waiting periods', 'the pregnant ones', 'from', 'divorce', 'or', 'death', 'delivery', 'the fetuses', 'screaming', 'or', 'dead'], /////
        ['And likewise', 'ruling', 'the miscarriage', 'in', 'his miscarriage', 'ruling', 'the complete one', 'they both', 'deliveries'],
        ['Who', 'did not', 'menstruate', 'or', 'who', 'stopped', 'her menstruation', 'indeed', 'applies', 'in', 'them both', 'the two waiting periods'],
        ['Both of them', 'remain', 'three', 'months', 'their rulings', 'in', 'the text', 'equal'],
        ['Waiting period', 'slave women', 'from', 'divorce', 'with one menstrual cycle', 'and from', 'death', 'five', 'and two months'],
        ['So with two divorces', 'she separates', 'from', 'husband', 'for her', 'not', 'return', 'except', 'after', 'husband', 'second'],
        ['And likewise', 'the free women', 'then three', 'separate her', 'so it permits', 'her', 'and this', 'spouses'],
        ['So let them marry', 'their husbands', 'from', 'contentment', 'and satisfaction', 'without', 'deceit', 'and not', 'disobedience'],
        ['Until', 'when', 'mixes', 'the marriage', 'with deceit', 'then they both', 'with', 'the two husbands', 'adulterers'],
        ['Beware', 'the goat', 'the Muhallil', 'indeed he', 'and the Mustahill', 'for her return', 'two goats'],
        ['Cursed', 'the prophet', 'the one who performs tahlil', 'and the one whom it is performed for', 'for they both', 'in', 'the Shariah', 'cursed'],
        ['Not', 'strike', 'a female slave', 'and not', 'a male slave', 'committed an offense', 'for they both', 'in your hands', 'captives'],
        ['Turn away', 'from', 'the women', 'all your effort', 'and dedicate yourself', 'for embracement', 'the good ones', 'their', 'beautiful ones'],
        ['In', 'a garden', 'it is good', 'and good is', 'it bliss', 'from', 'every', 'fruit', 'in it', 'two pairs'],
        ['Its rivers', 'flow', 'for them', 'from', 'beneath them', 'surrounded', 'with date-palms', 'and pomegranates'],
        ['Its chambers', 'from', 'pearl', 'and emerald', 'and its palaces', 'from', 'pure', 'gold'],
        ['Reserved', 'in it', 'for the pious ones', 'full-breasted ones', 'they are likened', 'with rubies', 'and coral'],
        ['White', 'the faces', 'their hair', 'dark', 'red', 'the cheeks', 'large', 'eyes'],
        ['Spaced', 'the teeth', 'when', 'they smile', 'laughingly', 'slender', 'the waists', 'soft', 'the bodies'],
        ['Green', 'the garments', 'their breasts', 'full', 'adorned', 'the jewellery', 'fragrant', 'the sleeves'],
        ['Blessed', 'for the people', 'they', 'spouses', 'for them', 'in', 'home', 'eternity', 'in', 'place', 'safety'],
        ['They are given to drink', 'from', 'a wine', 'delicious', 'its drinking', 'with fingers', 'servants', 'and youthful boys'],
        ['If', 'look', 'the maiden', 'next to', 'her companion', 'and they both', 'above', 'the couches', 'reclining'],
        ['They pass to each other', 'the cup', 'in', 'their hands', 'and they both', 'with the pleasure', 'its drinking', 'joyful'],
        ['And perhaps', 'she gives him to drink', 'a cup', 'second', 'and they both', 'with pleasure', 'in it', 'content'],
        ['They speak', 'upon', 'the couches', 'in seclusion', 'and they both', 'with garment', 'connection', 'enveloped'],
        ['Honour', 'the gardens', 'the bliss', 'and its people', 'brothers', 'truth', 'what', 'brothers'],
        ['Neighbours', 'Lord', 'the worlds', 'and his party', 'honour', 'them', 'in', 'the choicest', 'the neighbours'],
        ['They', 'hear', 'his speech', 'and they see him', 'and the two eyeballs', 'at him', 'gazing'],
        ['And upon them', "in it", 'garments', 'silk', 'and upon', 'the heads', 'finest', 'crowns'],
        ['Their crowns', 'from', 'pearl', 'and emeralds', 'or', 'silver', 'from', 'pure', 'gold'],
        ['And rings', 'from', 'gold', 'and bracelets', 'from', 'silver', 'worn', 'with it', 'the two wrists'],
        ['And their food', 'from', 'meat', 'bird', 'tender', 'like finest young camels', 'they are fed', 'other', 'the colours'],
        ['And their dishes', 'gold', 'and pearls', 'exquisite', 'seventy', 'thousand', 'above', 'thousand', 'tables'],
        ['If', 'you are', 'longing', 'for it', 'yearning', 'with it', 'longing', 'the stranger', 'for seeing', 'the homelands'],
        ['Be', 'good-doer', 'in what', 'you can', 'for perhaps', 'you are rewarded', 'from', 'goodness', 'with goodness'],
        ['And work', 'for gardens', 'the bliss', 'and their delights', 'for its bliss', 'remains', 'and is not', 'perish'],
        ['Persist', 'the fasting', 'with', 'the Qiyam', 'as worship', 'for they both', 'two actions', 'accepted'],
        ['Rise', 'in', 'the dark', 'and recite', 'the book', 'and not', 'sleep', 'except', 'like sleep', 'bewildered', 'longing'],
        ['For perhaps', 'comes', 'the death', 'suddenly', 'then you are dragged', 'from', 'the beds', 'to', 'the shrouds'],
        ['Oh', 'how beautiful', 'two eyes', 'in', 'darkness', 'the night', 'from', 'fear', 'the merciful', 'crying'],
        ['Not', 'slander', 'the chaste ones', 'and not', 'say', 'what', 'not', 'you know', 'from', 'falsehood'],
        ['Not', 'enter', 'houses', 'people', 'present', 'except', 'with a cough', 'or', 'seeking permission'],
        ['Not', 'be impatient', 'when', 'befalls you', 'a calamity', 'indeed', 'the patient', 'his reward', 'doubled'],
        ['So when', 'you are afflicted', 'with a calamity', 'then be patient', 'for it', 'Allah', 'enough for me', 'alone', 'and suffices me'],
        ['And upon you', 'the Fiqh', 'the clarifier', 'our Shariah', 'and obligations', 'inheritance', 'and the Quran'],
        ['The science', 'Mathematics', 'and Science', 'Shariah', 'Mohammad', 'two sciences', 'sought', 'and followed'],
        ['Were it not', 'the obligations', 'lost', 'inheritance', 'the people', 'and persisted', 'dispute', 'the boys', 'and the elders'],
        ['Were it not', 'the mathematics', 'its multiplication', 'and fractions', 'did not', 'divided', 'a share', 'and not', 'two shares'],
        ['Not', 'seek', 'science', 'Kalaam', 'for indeed it', 'leads', 'to', 'negation', 'and confusion'],

        ["Not", "accompany", "the innovator", "except", "like him", "under", "smoke", "blazing", "fires"],
        ["Science", "Kalaam", "and science", "Shariah", "Mohammad", "they differ", "and are not", "similar"],
        ["They took", "Kalaam", "from", "the philosophers", "the first", "they denied", "the laws", "headlessly", "and assuredly"],
        ["They carried", "the matters", "upon", "measurement", "their intellects", "so they became confused", "like the confusion", "the bewildered"],
        ["Their Murji'ah", "discredit", "upon", "their Qadariyyah", "and the two groups", "to me", "disbelievers"],
        ["And insult", "their Mukhtariyyah", "their Dawriyah", "and the Qarmatiyyah", "curses", "the Rafidhies"],
        ["And criticises", "their Karramiyyah", "their Wahbiyyah", "and they both", "narrate", "from", "Ibn", "Aban"],
        ["Their arguments", "vagueness", "is assumed", "and allure", "like", "the mirage", "appears", "to the thirsty"],
        ["Leave", "their Ash’aris", "and their Mu’tazilis", "caw at each other", "like the cawing", "the crows"],
        ["Each", "measures", "with his intellect", "paths", "guidance", "and wanders", "like wandering", "the bewildered", "the confused"],
        ["So Allah", "recompense them", "with what", "they", "its people", "and to him", "praise", "from", "their word", "absolved me"],
        ["Who", "measures", "Shariah", "Mohammad", "in", "his intellect", "cast", "with him", "the desires", "in", "ponds"],
        ["Not", "think", "in", "essence", "your Lord", "and reflect", "in what", "with it", "alternate", "the day and night"],
        ["And Allah", "my Lord", "not", "comprehended", "his essence", "with thoughts", "imaginations", "and the minds"],
        ["Pass", "the hadiths", "the attributes", "as", "they came", "from", "without", "interpretation", "and not", "senseless words"],
        ["It", "doctrine", "Al-Zuhri", "and agreed", "Maalik", "and they both", "in", "our Shariah", "two scholars"],
        ["For Allah", "a face", "not", "is limited", "with a form", "and for our Lord", "two eyes", "looking"],
        ["And for him", "two hands", "as", "says", "our God", "and his right hand", "exalted", "from", "the right hands"],
        ["Both", "hands", "my Lord", "right", "its description", "and they both", "upon", "the two weighty beings", "bestowers"],
        ["His Kursi", "encompasses", "the heavens", "high", "and the earth", "and it", "encompasses it", "the two feet"],
        ["And Allah", "laughs", "not", "like laughing", "his servants", "and ‘How’", "is forbidden", "upon", "the Most Merciful"],
        ["And Allah", "descends", "every", "last", "night", "to his heaven", "lowest", "without", "secrecy"],
        ["So he says", "is", "any", "asker", "so I answer him", "for I am", "the near", "I answer", "the one who", "calls me"],
        ["Far be it", "the God", "that", "is described in howness", "his essence", "for “how”", "and comparison", "negated"],
        ["And the principle", "that", "Allah", "is not", "like him", "a thing", "Exalted", "the Lord", "the one of", "goodness"],
        ["And his speech", "the Quran", "and it", "his words", "sound", "and letter", "not", "separate"],
        ["We are not", "liken", "our Lord", "with his servants", "Lord", "and servant", "how", "they are similar"],
        ["For the sound", "is not", "necessitant", "his anthropomorphisation", "since", "are", "the two attributes", "differ"],
        ["Movements", "our tongues", "and sound", "our throats", "created", "and all", "that", "perish"],
        ["And as", "says", "Allah", "my Lord", "did not", "cease", "living", "and is not", "like other", "living ones"],
        ["And life", "my Lord", "did not", "cease", "an attribute", "to him", "glory to him", "from", "perfect", "owner", "majesty"],
        ["And likewise", "voice", "our God", "and his call", "truly", "it came", "in", "clear", "the Quran"],
        ["And our life", "with heat", "and cold", "and Allah", "not", "attributed", "to him", "these two"],
        ["And its sustenance", "with moisture", "and dryness", "opposites", "pairs", "they both", "two opposites"],
        ["Glory be to", "my Lord", "from", "attributes", "his servants", "or", "that", "he be", "composed", "two bodies"],
        ["Indeed I", "speak", "so listen", "to my discourse", "oh", "assembly", "associates", "and brothers"],
        ["Indeed", "what", "it", "in", "the MusHafs", "recorded", "with fingers", "elders", "and the young ones"],
        ["It", "word", "my Lord", "its verses", "and its letters", "and our ink", "and the parchment", "created"],
        ["Who", "says", "about", "the Quran", "opposite", "my statement", "then curse him", "every", "Iqamah", "and Adhan"],
        ["It", "in", "the MusHafs", "and the chests", "truly", "be certain", "with that", "what a", "certainty"],
        ["And likewise", "the letters", "the fixed", "its number", "twenty", "letters", "after them", "eight"],
        ["They", "from", "speech", "Allah", "glorious", "his glory", "truly", "and they", "foundations", "every", "speech"],
        ["Ha", "and Meem", "word", "my Lord", "alone", "from", "without", "supporters", "and not", "and helpers"],
        ["Who", "says", "about", "the Quran", "what", "already", "said it", "Abd", "Al-Jaleel", "and group", "the Lihyan"],
        ["Then indeed", "he fabricated", "a lie", "and sin", "and followed", "with dogs", "god", "Ma’arra", "Al-Nu’man"],
        ["I mixed with them", "a time", "so if", "I encounter them", "I would strike them", "with my swords", "and my tongue"],
        ["Wretched", "the blind man", "Abu", "Al-’Ala’", "for indeed he", "indeed", "he was", "combined", "for him", "two blindnesses"],
        ["And indeed", "I composed", "two poems", "rebuking him", "verses", "each", "poem", "two hundred verses"],
        ["And now", "I rebuke", "Al-Ash’ari", "and his party", "and I expose", "what", "they hid", "from", "the falsehoods"],
        ["Oh", "assembly", "Kalamists", "you transgressed", "transgression", "people", "the Sabbath", "in", "the fish"],
        ["You takfired", "people", "the Shariah", "and the guidance", "and you attacked", "with wrongdoing", "an aggression"],
        ["So I will support", "the truth", "until", "that I", "rise above", "upon", "your masters", "with my rebuking"],
        ["Allah", "turned me", "staff", "Moses", "for you", "until", "devours", "your falsehood", "my serpent"],
        ["With proofs", "the Quran", "I nullify", "your magic", "and with it", "I shake", "every", "who", "meets me"],
        ["It", "my refuge", "it", "my shield", "it", "my saviour", "from", "plot", "every", "hypocrite", "treacherous"],

        ["If", "settles", "your Madhhab", "in a land", "it becomes dry", "or", "becomes", "a wasteland", "without", "prosperity"],
        ["And Allah", "turned me", "upon you", "an indignation", "and for exposing", "cover", "all of you", "he kept me alive"],
        ["I", "in", "throats", "all of them", "stick", "the side", "baffled", "your doctors", "vagueness", "my location"],
        ["I", "serpent", "the valley", "I", "lion", "mountain", "I", "soft", "sharp", "sword", "Yemeni"],
        ["Between", "Ibn", "Hanbal", "and Ibn", "your Ismail", "a wrath", "make you taste", "the boiling", "water"],
        ["You embraced", "science", "Kalaam", "with hostility", "and Fiqh", "not", "for you", "upon it", "two hands"],
        ["Fiqh", "requires", "for five", "pillars", "did not", "gather", "from it", "to you", "two"],
        ["Forbearance", "and following", "for Sunnah", "Ahmad", "and piety", "and refraining", "harm", "and understanding", "meanings"],
        ["You preferred", "this world", "over", "your religions", "not", "good", "in", "this world", "without", "religions"],
        ["And you opened", "your mouths", "and your stomaches", "so you devoured", "the world", "without", "hesitation"],
        ["You contradicted", "your words", "with your actions", "and you carried", "the world", "upon", "the religions"],
        ["Your reciters", "indeed", "became like", "your jurists", "two groups", "to the Most Merciful", "disobedient ones"],
        ["They rush", "upon", "the Haram", "and its people", "action", "the dogs", "in carcasses", "meat"],
        ["Oh", "Ash’aris", "did", "you realise", "that I", "inflammation", "the eyes", "and itch", "eyelids"],
        ["I", "in", "livers", "the Ash’aris", "an ulcer", "I grow", "then I kill", "every", "who", "detests me"],
        ["And indeed", "I came out", "to", "senior", "elders", "then I drove away", "from them", "every", "who", "opposed me"],
        ["And I turned over", "the ground", "their arguments", "and scattered them", "so I found them", "a statement", "without", "proof"],
        ["And Allah", "supported me", "and strengthened", "my argument", "and Allah", "from", "their doubts", "saved me"],
        ["And praise", "for Allah", "the Protector", "always", "praise", "nourishes", "my intellect", "and my heart"],
        ["Did you think", "oh", "Ash’aris", "that I", "from one who", "rattled", "behind him", "with threats"],
        ["So is covered", "the sun", "luminous", "with a tiny star", "or", "is", "compared", "the sea", "with ponds"],
        ["My life", "indeed", "I examined you", "and found you", "donkeys", "without", "reins", "and not", "and bridles"],
        ["I brought you", "and gathered you", "and addressed you", "and I broke you", "a breaking", "without", "mending"],
        ["Did you claim", "that", "the Quran", "an expression", "they they both", "as", "you say", "two Qurans"],
        ["The faith", "Gabriel", "and faith", "the one who", "rode", "the sins", "according to you", "same"],
        ["This", "Jawhar", "and the Ard", "with your claim", "are they both", "for understanding", "guidance", "two principles"],
        ["Who", "lived", "in", "the world", "and did not", "know them", "and attested", "with Islam", "and the Furqan"],
        ["Is muslim", "he", "according to you", "or", "disbeliever", "or", "intelligent", "or", "ignorant", "or", "neglectful"],
        ["You negated", "the seven", "heavens", "high", "and the Throne", "you emptied", "from", "the Most Merciful"],
        ["And you claimed", "that", "conveyance", "for Ahmad", "in", "verse", "from", "entire", "the Quran"],
        ["These", "outbursts", "and falsehoods", "and desires", "and the Madhhab", "newly invented", "satanic"],
        ["You named", "the science", "Usul", "misguidance", "like name", "‘nabidh", "for wine", "casks"],
        ["And", "mourned", "your Mahrams", "upon", "your likes", "and Allah", "from it", "protected me", "and safeguarded me"],
        ["Indeed I", "held firm", "with rope", "Shariah", "Mohammad", "and I bit it", "with molar", "teeth"],
        ["Did you realise", "oh", "Ash’aris", "that I", "flood", "sea", "what a", "flood"],
        ["I", "your worry", "I", "sorrow", "I", "your sickness", "I", "poison", "in", "the secret", "and public"],
        ["Did you take away", "light", "the Quran", "and its beauty", "from", "every", "heart", "longing", "sorrowful"],
        ["So by the truth", "Almighty", "upon", "the Throne", "he rose", "from", "without", "likening", "as word", "the opposer"],
        ["And by the truth", "the one who", "concluded", "the message", "and the guidance", "with Mohammad", "so he honoured", "with it", "the two holy sites"],
        ["I will sever", "with my pickaxe", "your reputations", "as long as", "persist", "accompany", "my soul", "my body"],
        ["And I will rebuke", "and revile", "your party", "until", "conceals", "my body", "my shrouds"],
        ["And I will expose", "with my words", "your veils", "until", "I convey", "the far", "or", "the near"],
        ["And I will satirise", "your young", "and your old", "in spite", "for the one who", "already", "insulted", "and satirised me"],
        ["And I will send down", "to you", "painful", "thunderclaps", "and will burn", "your livers", "my fires"],
        ["And I will cut down", "with sword", "my truth", "your falsehood", "and will extinguish", "your flames", "my flood"],
        ["And I will address", "Allah", "in", "your forsaking", "and will prevent", "all of you", "my forsaking"],
        ["And I will attack", "upon", "insolent", "your tyrants", "attack", "lions", "upon", "flock", "sheep"],
        ["And I will throw", "with stones", "my catapults", "until", "destroys", "your insolence", "my power"],
        ["And I will write", "to", "the lands", "insulting you", "so it will travel", "travelling", "swift camels", "with riders"],
        ["I will refute", "with my argument", "your doubts", "until", "covers", "your ignorance", "my knowledge"],
        ["And I will be angry", "for word", "my Lord", "about you", "anger", "tigers", "and a group", "eagles"],
        ["And I will strike", "with sharp", "my words", "a strike", "shakes", "the souls", "the brave"],
        ["And I will fill", "from", "disdain", "your noses", "a snuff", "makes sneeze", "from it", "every", "coward"],
        ["Indeed I", "with thanks", "Allah", "during", "fighting you", "resolute", "in", "war", "steadfast", "heart"],
        ["And when", "I strike", "then not", "miss", "my strikes", "and when", "I thrust", "then not", "deviate", "my thrust"],
        ["And when", "I charge", "upon", "the battalion", "from you", "I tear it apart", "with lights", "evidence"],
        ["The Shariah", "and the Quran", "the biggest", "my tools", "for they", "for cutting", "your arguments", "two swords"],
        ["They have weighed", "upon", "your bodies", "and your heads", "for they", "for breaking", "your heads", "two stones"],
        ["If", "you", "make peace", "your will granted peace", "and you are safe", "from", "confusion", "disappointment"],
        ["And if", "you refuse", "and transgress", "in", "desires", "then striving against you", "in", "my responsibility", "and guarantee"],
        ["Oh", "Ah’aris", "oh", "lowest", "the people", "oh", "blind", "oh", "deaf", "without", "ears"],
        ["Indeed I", "hate you", "and I hate", "your party", "a hatred", "the least", "its least", "two grudges"],
        ["If", "I were", "blind", "the two eyeballs", "it would make me happy", "so that not", "see", "your human", "my human"],
        ["Boil", "your hearts", "against me", "with their heat", "rage", "and fury", "what a", "boiling"],
        ["Die", "with your rage", "and die", "in regret", "and grief", "upon me", "and gnaw", "every", "finger"],
        ["Indeed", "I lived", "joyfully", "and I died", "in safety", "and I met", "my Lord", "please me", "and cared for me"],
        ["And he granted me", "gardens", "eden", "in peace", "and from", "the hell-fire", "with his grace", "he saved me"],
        ["And I met", "Ahmad", "in", "the gardens", "and his companions", "and all", "when", "their meeting", "drew me close"],
        ["Did not", "I store", "an action", "for my Lord", "righteous", "but", "with provoking anger", "to you", "he pleased me"],
        ["I", "a date", "the loved ones", "and colocynth", "enemies", "I", "thorn", "in", "throat", "who", "oppose me"],
        ["And I", "the lover", "for people", "Sunnah", "Ahmad", "and I", "the intellectual", "the poet", "Al-Qahtani"],
        ["Ask", "about", "sons", "Qahtan", "how", "their actions", "day", "the uproar", "when", "met", "the armies"],
        ["Ask", "how", "composition", "speech", "and their construction", "and they both", "for them", "two swords", "unsheathed"],
        ["They supported", "with tongues", "sharp", "piercing", "like", "spears", "prepared", "for striking"],
        ["Ask", "about them", "when", "the debate", "when", "met", "from them", "and from", "their enemies", "two opponents"],
        ["We", "the kings", "sons", "the kings", "by inheritance", "lions", "the wars", "and not", "the women", "adulteresses"],
        ["Oh", "Ash’aris", "oh", "all", "who", "claim", "innovations", "and desires", "without", "proof"],
        ["Came to you", "a Sunni", "trustworthy", "from", "a poet", "sharp", "tongue", "assisted"],
        ["He strung", "the rhymes", "with praise", "and satire", "so it is as", "its sentences", "to me", "familiar"],
        ["Flows", "eloquent", "word", "from", "his mouth", "like rocks", "descend", "from", "peaks", "Kahlan"],
        ["Indeed I", "addressed", "all of you", "with a poem", "exposed", "your covers", "upon", "the lands"],
        ["It", "for the Rawafidh", "whip", "Umari", "left", "their heads", "without", "ears"],
        ["It", "for the astrologer", "and physician", "demise", "for they both", "cast down", "different"],
        ["It", "in", "heads", "deviators", "headache", "struck", "for intensity", "its headache", "the temples"],
        ["It", "in", "the hearts", "the Ash’aris", "all of them", "Saab", "and in", "the bodies", "thorns"],
        ["But", "for people", "truth", "honey", "pure", "or", "date", "Yathrib", "that", "the Saihani"],
        ["And I", "the one who", "composed it", "and made it", "arranged", "like necklaces", "coral"],
        ["And I supported", "people", "the truth", "the extent", "my ability", "and I slapped", "every", "opposer", "two slapps"],
        ["Although", "that it", "gathered", "scienes", "abundant", "from what", "be too narrow", "for its explaining", "my book"],
        ["Its verses", "like", "gardens", "harvested", "by hearing", "and not", "tires of them", "the harvester"],
        ["And as that", "drawing", "its lines", "in", "it parchment", "embroidery", "embellish it", "palms", "beautiful women"],
        ["And Allah", "I ask him", "accepting", "my poem", "from me", "and I thank him", "for what", "he bestowed upon me"],
        ["Send blessings", "the God", "upon", "the prophet", "Mohammad", "as long as", "coos", "a turtledove", "upon", "the branches"],
        ["And upon", "all", "his daughters", "and his wives", "and upon", "all", "the companions", "and the brothers"],
        ["By Allah", "say", "whenever", "you recite", "have mercy", "the God", "your soul", "oh", "Qahtani"]
    ];

    listItems.forEach((item, lineIndex) => {
        // Split the text into words
        const words = item.textContent.split(' ');

        // Wrap each word in a span with class "qword" and tooltip functionality, skipping "*"
        let translationIndex = 0; // Keeps track of the translation word index
        const wrappedWords = words.map(word => {
            if (word === '*') {
                return '*'; // Keep the "*" symbol as it is without wrapping
            }

            // Create the tooltip span with translation only if it's not "*"
            const tooltipSpan = `<span class="tooltip qword">${word}<span class="tooltiptext">${translations[lineIndex][translationIndex] }</span></span>`;
            translationIndex++; // Increment the translation index only if the word is not "*"
            return tooltipSpan;

        }).join(' ');

        // Wrap the entire text (now with wrapped words) in a span with class "list"
        const wrappedText = `<span class="list">${wrappedWords}</span>`;

        // Update the list item content
        item.innerHTML = wrappedText;
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const listItems = document.querySelectorAll('.nooniyah li');

    // Replace with your actual audio files for each word
    const audioFiles = [
        ['Audios/Ya.MP3', 'Audios/Munzila.MP3', 'Audios/AlAyate.MP3', 'Audios/WalFurqane.MP3', 'Audios/Bayni.MP3', 'Audios/WaBaynaka.MP3', 'Audios/Hurmatu.MP3', 'Audios/AlQurane.MP3'] 
        
        // More lines as needed
    ];

    // Create a single Audio object to control playback
    let currentAudio = new Audio();
    currentAudio.volume = 0.35;

    listItems.forEach((item, index) => {
        const words = item.querySelectorAll('.qword');
        words.forEach((word, wordIndex) => {
            word.addEventListener('click', () => {
                // Stop current audio if it's playing
                if (!currentAudio.paused) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                // Assign a new source to the current audio and play it
                currentAudio.src = audioFiles[index][wordIndex];
                currentAudio.play();
            });
        });
    });
});


