// Keep all fallback quotes
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

const fallbackScriptures = [
  { quote: "For God so loved the world that he gave his one and only Son...", author: "Bible - John 3:16" },
  { quote: "For I know the plans I have for you, declares the Lord...", author: "Bible - Jeremiah 29:11" },
  { quote: "Indeed, with hardship comes ease.", author: "Quran - Ash-Sharh 94:6" },
  { quote: "You have a right to perform your duty, but not to the fruits of action.", author: "Bhagavad Gita - 2:47" },
];

let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];

function stripStrongTags(text) {
  return text.replace(/<S>\d+<\/S>/g, '');
}

function generateRandomQuote() {
  const quoteElement = document.getElementById('quote');
  const authorElement = document.getElementById('author');
  quoteElement.classList.remove('show');

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  let url, fallbackArray, selectedBook;

  if (currentTheme === 'dark') {
    url = 'https://dummyjson.com/quotes/random';
    fallbackArray = fallbackQuotes;
  } else {
    const holyBooks = ['bible', 'quran', 'gita'];
    selectedBook = holyBooks[Math.floor(Math.random() * holyBooks.length)];
    fallbackArray = fallbackScriptures;

    if (selectedBook === 'bible') {
      url = 'https://bolls.life/get-random-verse/KJV/';
    } else if (selectedBook === 'quran') {
      const randomAyah = Math.floor(Math.random() * 6236) + 1;
      url = `https://api.alquran.cloud/v1/ayah/${randomAyah}/en.sahih`;
    } else if (selectedBook === 'gita') {
      const randomCh = Math.floor(Math.random() * 18) + 1;
      const randomVerse = Math.floor(Math.random() * 47) + 1;
      url = `https://bhagavadgita.theaum.org/text/translations/${randomCh}/${randomVerse}`;
    }
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      let quoteText, authorText;
      if (currentTheme === 'dark') {
        quoteText = data.quote;
        authorText = data.author;
      } else if (selectedBook === 'bible') {
        quoteText = stripStrongTags(data.text);
        authorText = `Bible - ${data.bookname} ${data.chapter}:${data.verse}`;
      } else if (selectedBook === 'quran') {
        quoteText = data.data.text;
        authorText = `Quran - ${data.data.surah.englishName} ${data.data.numberInSurah}`;
      } else if (selectedBook === 'gita') {
        const en = data.data.find(t => t.lang === 'en');
        quoteText = en.translation;
        authorText = `Bhagavad Gita - ${data.data[0].chapter}:${data.data[0].verse}`;
      }
      quoteElement.textContent = `"${quoteText}"`;
      authorElement.textContent = `- ${authorText}`;
      setTimeout(() => quoteElement.classList.add('show'), 10);
      window.currentQuote = { text: quoteText, author: authorText };
    })
    .catch(() => {
      const random = fallbackArray[Math.floor(Math.random() * fallbackArray.length)];
      quoteElement.textContent = `"${random.quote}"`;
      authorElement.textContent = `- ${random.author}`;
      setTimeout(() => quoteElement.classList.add('show'), 10);
      window.currentQuote = { text: random.quote, author: random.author };
    });
}

function toggleTheme() {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  document.getElementById('themeToggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
  generateRandomQuote();
}

function saveQuote() {
  if (!window.currentQuote) return alert('No quote to save!');
  savedQuotes.push(window.currentQuote);
  localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
  alert('Quote saved!');
}

function showSavedQuotes() {
  const div = document.getElementById('saved-quotes');
  div.innerHTML = '<h3>Saved Quotes</h3>';
  if (!savedQuotes.length) return (div.innerHTML += '<p>No saved quotes yet.</p>');
  savedQuotes.forEach((q, i) => {
    const p = document.createElement('p');
    p.textContent = `"${q.text}" - ${q.author}`;
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => deleteQuote(i);
    p.appendChild(btn);
    div.appendChild(p);
  });
}

function deleteQuote(i) {
  savedQuotes.splice(i, 1);
  localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
  showSavedQuotes();
}

function shareQuote(platform) {
  if (!window.currentQuote) return alert('No quote to share!');
  const { text, author } = window.currentQuote;
  const shareText = `${text} - ${author}`;
  let url;
  if (platform === 'twitter') url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  if (platform === 'facebook') url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`;
  if (platform === 'whatsapp') url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  document.getElementById('quote-button').addEventListener('click', generateRandomQuote);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('save-button').addEventListener('click', saveQuote);
  document.getElementById('show-saved-button').addEventListener('click', showSavedQuotes);
  document.getElementById('share-twitter').addEventListener('click', () => shareQuote('twitter'));
  document.getElementById('share-facebook').addEventListener('click', () => shareQuote('facebook'));
  document.getElementById('share-whatsapp').addEventListener('click', () => shareQuote('whatsapp'));

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('show');
  });

  generateRandomQuote();
});
