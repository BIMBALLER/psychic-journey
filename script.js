// Expanded fallback quotes from various scholars (for API failures)
const fallbackQuotes = [
  { quote: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Confucius" },
  { quote: "To be, or not to be, that is the question.", author: "William Shakespeare" },
  { quote: "The unexamined life is not worth living.", author: "Plato" },
  { quote: "I think, therefore I am.", author: "René Descartes" },
  { quote: "Happiness is the highest good.", author: "Aristotle" },
  { quote: "Do not be overcome by evil, but overcome evil with good.", author: "Saint Paul" },
  { quote: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
];

// Expanded fallback scriptures for light mode (Bible, Quran, Bhagavad Gita) - tag-free
const fallbackScriptures = [
  // Bible
  { quote: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", author: "Bible - John 3:16" },
  { quote: "For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.", author: "Bible - Jeremiah 29:11" },
  { quote: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", author: "Bible - Romans 8:28" },
  { quote: "I can do all this through him who gives me strength.", author: "Bible - Philippians 4:13" },
  // Quran
  { quote: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", author: "Quran - Al-Fatiha 1" },
  { quote: "Indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.", author: "Quran - Ash-Sharh 6" },
  { quote: "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.", author: "Quran - At-Talaq 3" },
  // Bhagavad Gita
  { quote: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results...", author: "Bhagavad Gita - 2:47" },
  { quote: "Whenever and wherever there is a decline in religious practice... and a predominant rise of irreligion—at that time I descend Myself.", author: "Bhagavad Gita - 4:7" },
  { quote: "The soul is neither born, and nor does it die.", author: "Bhagavad Gita - 2:20" },
];

// Bible book names in order (1-based index for API mapping)
const bookNames = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah",
  "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];

// Helper to strip Strong's tags from Bible text
function stripStrongTags(text) {
  return text.replace(/<S>\d+<\/S>/g, '');
}

function generateRandomQuote() {
  console.log('Generating quote based on current theme...');
  const quoteElement = document.getElementById('quote');
  const authorElement = document.getElementById('author');
  if (!quoteElement || !authorElement) {
    console.error('DOM elements #quote or #author not found');
    return;
  }

  quoteElement.classList.remove('show');

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  let url, fallbackArray, selectedBook;

  if (currentTheme === 'dark') {
    url = 'https://dummyjson.com/quotes/random';
    fallbackArray = fallbackQuotes;
  } else {
    // Light mode: Randomly select holy book
    const holyBooks = ['bible', 'quran', 'gita'];
    selectedBook = holyBooks[Math.floor(Math.random() * holyBooks.length)];
    fallbackArray = fallbackScriptures;

    if (selectedBook === 'bible') {
      url = 'https://bolls.life/get-random-verse/KJV/';
    } else if (selectedBook === 'quran') {
      const randomAyah = Math.floor(Math.random() * 6236) + 1;
      url = `http://api.alquran.cloud/v1/ayah/${randomAyah}/en.sahihinternational`;
    } else if (selectedBook === 'gita') {
      const randomCh = Math.floor(Math.random() * 18) + 1;
      const randomVerse = Math.floor(Math.random() * 47) + 1;
      url = `https://bhagavadgita.theaum.org/text/translations/${randomCh}/${randomVerse}`;
    }
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      let quoteText, authorText;
      if (currentTheme === 'dark') {
        if (!data.quote || !data.author) {
          throw new Error('Invalid API response');
        }
        quoteText = data.quote;
        authorText = data.author;
      } else if (selectedBook === 'bible') {
        if (!data.text) {
          throw new Error('Invalid API response');
        }
        quoteText = stripStrongTags(data.text); // Zap those Strong's tags!
        const bookName = bookNames[data.book - 1];
        authorText = `Bible - ${bookName} ${data.chapter}:${data.verse}`;
      } else if (selectedBook === 'quran') {
        if (!data.data || !data.data.ayah || !data.data.surah) {
          throw new Error('Invalid API response');
        }
        quoteText = data.data.ayah.text;
        authorText = `Quran - ${data.data.surah.englishName} ${data.data.ayah.numberInSurah}`;
      } else if (selectedBook === 'gita') {
        if (!data.data || data.data.length === 0) {
          throw new Error('Invalid API response');
        }
        // Pick first English translation
        const enTranslation = data.data.find(t => t.lang === 'en');
        if (!enTranslation) {
          throw new Error('No English translation found');
        }
        quoteText = enTranslation.translation;
        authorText = `Bhagavad Gita - Chapter ${data.data[0].chapter}:${data.data[0].verse}`;
      }
      console.log(`Quote fetched from ${selectedBook || 'scholars'}:`, { quote: quoteText, author: authorText });
      quoteElement.textContent = `"${quoteText}"`;
      authorElement.textContent = `- ${authorText}`;
      setTimeout(() => {
        quoteElement.classList.add('show');
      }, 10);
      window.currentQuote = { text: quoteText, author: authorText };
    })
    .catch(error => {
      console.error('Error fetching quote:', error.message);
      const randomIndex = Math.floor(Math.random() * fallbackArray.length);
      const quoteObj = fallbackArray[randomIndex];
      console.log('Using fallback quote:', quoteObj);
      quoteElement.textContent = `"${quoteObj.quote}"`;
      authorElement.textContent = `- ${quoteObj.author}`;
      setTimeout(() => {
        quoteElement.classList.add('show');
      }, 10);
      window.currentQuote = { text: quoteObj.quote, author: quoteObj.author };
    });
}

// Theme toggle function
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.getElementById('themeToggle').textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', currentTheme);
  console.log('Theme toggled to:', currentTheme);
  // Auto-refresh quote to match new theme
  generateRandomQuote();
}

function saveQuote() {
  if (window.currentQuote) {
    savedQuotes.push(window.currentQuote);
    localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
    alert('Quote saved!');
    console.log('Saved quote:', window.currentQuote);
  } else {
    alert('No quote to save!');
    console.error('No current quote to save');
  }
}

// Show saved quotes
function showSavedQuotes() {
  const savedQuotesDiv = document.getElementById('saved-quotes');
  savedQuotesDiv.innerHTML = '<h3>Saved Quotes</h3>';
  if (savedQuotes.length === 0) {
    savedQuotesDiv.innerHTML += '<p>No saved quotes yet.</p>';
    console.log('No saved quotes to display');
    return;
  }
  savedQuotes.forEach((quote, index) => {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = `"${quote.text}" - ${quote.author}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteQuote(index);
    quoteElement.appendChild(deleteButton);
    savedQuotesDiv.appendChild(quoteElement);
  });
  console.log('Displayed saved quotes:', savedQuotes);
}

function deleteQuote(index) {
  savedQuotes.splice(index, 1);
  localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
  showSavedQuotes();
  console.log('Deleted quote at index:', index);
}

function shareQuote(platform) {
  if (!window.currentQuote) {
    alert('No quote to share!');
    console.error('No current quote to share');
    return;
  }
  const { text, author } = window.currentQuote;
  const shareText = `${text} - ${author}`;
  let shareUrl;

  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
      break;
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      break;
    default:
      console.error('Unknown share platform:', platform);
      return;
  }
  console.log(`Sharing on ${platform}:`, shareText);
  window.open(shareUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  // Load persisted theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  document.getElementById('quote-button').addEventListener('click', () => {
    console.log('Get New Quote button clicked');
    generateRandomQuote();
  });
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('save-button').addEventListener('click', saveQuote);
  document.getElementById('show-saved-button').addEventListener('click', showSavedQuotes);
  document.getElementById('share-twitter').addEventListener('click', () => shareQuote('twitter'));
  document.getElementById('share-facebook').addEventListener('click', () => shareQuote('facebook'));
  document.getElementById('share-whatsapp').addEventListener('click', () => shareQuote('whatsapp'));

  generateRandomQuote();
});

const change=document.getElementById("quote-button");
change.onclick=function(){
    document.body.style.backgroundColor=`#${Math.floor(Math.random()*16777215).toString(16)}`
};