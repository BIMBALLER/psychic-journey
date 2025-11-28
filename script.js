const fallbackQuotes = [
  { quote: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Confucius" },
  { quote: "To be, or not to be, that is the question.", author: "William Shakespeare" },
  { quote: "The unexamined life is not worth living.", author: "Plato" },
  { quote: "I think, therefore I am.", author: "René Descartes" },
  { quote: "Happiness is the highest good.", author: "Aristotle" },
  { quote: "Do not be overcome by evil, but overcome evil with good.", author: "Saint Paul" },
  { quote: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { quote: "The universe is not only stranger than we suppose, it is stranger than we can suppose.", author: "Werner Heisenberg" },
  { quote: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.", author: "Pierre Teilhard de Chardin" },
];

const fallbackScriptures = [
  { quote: "For God so loved the world that he gave his one and only Son...", author: "Bible - John 3:16" },
  { quote: "For I know the plans I have for you, declares the Lord...", author: "Bible - Jeremiah 29:11" },
  { quote: "Indeed, with hardship comes ease.", author: "Quran - Ash-Sharh 94:6" },
  { quote: "Indeed, Allah will not change the condition of a people until they change what is in themselves.", author: "Quran 13:11" },
  { quote: "You have a right to perform your duty, but not to the fruits of action.", author: "Bhagavad Gita - 2:47" },
];

let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
let quoteHistory = [];
let historyIndex = -1;
const MAX_HISTORY = 10;

function stripStrongTags(text) {
  return text.replace(/<S>\d+<\/S>/g, '');
}

function displayQuote(quoteObj) {
  const quoteElement = document.getElementById('quote');
  const authorElement = document.getElementById('author');
  window.currentQuote = quoteObj; 
  quoteElement.classList.remove('show');
  
  setTimeout(() => {
    const text = quoteObj.quote || quoteObj.text;
    
    quoteElement.textContent = `"${text}"`;
    authorElement.textContent = `- ${quoteObj.author}`;
    quoteElement.classList.add('show');
  }, 10);
}
function updateHistory(quoteObj) {
  if (historyIndex !== quoteHistory.length - 1) {
    quoteHistory = quoteHistory.slice(0, historyIndex + 1);
  }
  quoteHistory.push(quoteObj);
  if (quoteHistory.length > MAX_HISTORY) {
    quoteHistory.shift();
  }
  historyIndex = quoteHistory.length - 1;
}
function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

async function generateRandomQuote(isQOTDCheck = false) {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const today = getTodayDateString();
  const qotdData = JSON.parse(localStorage.getItem('qotd')) || {};
  if (isQOTDCheck && qotdData.date === today && qotdData.theme === currentTheme) {
      updateHistory(qotdData.quote);
      return displayQuote(qotdData.quote);
  }
  
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

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    
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
      quoteText = en ? en.translation : data.data[0].translation;
      authorText = `Bhagavad Gita - ${data.data[0].chapter}:${data.data[0].verse}`;
    }
    
    const newQuote = { quote: quoteText, author: authorText };
    updateHistory(newQuote);
    displayQuote(newQuote);
    if (isQOTDCheck && qotdData.date !== today) {
        localStorage.setItem('qotd', JSON.stringify({ date: today, theme: currentTheme, quote: newQuote }));
    }

  } catch (error) {
    console.error('API Fetch Failed, falling back:', error);
    const random = fallbackArray[Math.floor(Math.random() * fallbackArray.length)];
    const newQuote = { quote: random.quote, author: random.author };
    updateHistory(newQuote);
    displayQuote(newQuote);
  }
}
function showPreviousQuote() {
  if (historyIndex > 0) {
    historyIndex--;
    displayQuote(quoteHistory[historyIndex]);
  } else {
    const statusSpan = document.getElementById('copy-status');
    statusSpan.textContent = 'History Start!';
    statusSpan.style.opacity = '1';
    setTimeout(() => {
      statusSpan.style.opacity = '0';
    }, 1500);
  }
}
function copyQuote() {
  if (!window.currentQuote) return;
  const text = window.currentQuote.quote || window.currentQuote.text; 
  const author = window.currentQuote.author;
  const quoteString = `"${text}" - ${author}`;
  const statusSpan = document.getElementById('copy-status');
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(quoteString)
      .then(() => {
        statusSpan.textContent = 'Copied!';
        statusSpan.style.opacity = '1';
        setTimeout(() => {
          statusSpan.style.opacity = '0';
        }, 1500);
      })
      .catch(err => {
        statusSpan.textContent = 'Failed to copy.';
        statusSpan.style.opacity = '1';
        console.error('Could not copy text: ', err);
        setTimeout(() => {
          statusSpan.style.opacity = '0';
        }, 1500);
      });
  } else {
    statusSpan.textContent = 'API not supported.';
    statusSpan.style.opacity = '1';
    console.error('Clipboard API not supported.');
    setTimeout(() => {
      statusSpan.style.opacity = '0';
    }, 1500);
  }
}


function toggleTheme() {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  document.getElementById('themeToggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
  generateRandomQuote(false); 
}

function saveQuote() {
  if (!window.currentQuote) return alert('No quote to save!');
  const currentQuoteText = window.currentQuote.quote || window.currentQuote.text;
  const isDuplicate = savedQuotes.some(q => q.quote === currentQuoteText && q.author === window.currentQuote.author);
  if (isDuplicate) return alert('This quote is already saved!');
  
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
    const quoteText = q.quote || q.text; 
    p.textContent = `"${quoteText}" - ${q.author}`; 
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
  const quoteText = window.currentQuote.quote || window.currentQuote.text;
  const { author } = window.currentQuote; 
  const shareText = `"${quoteText}" - ${author}`;
  let url;
  if (platform === 'twitter') url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  if (platform === 'facebook') url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`;
  if (platform === 'whatsapp') url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(url, '_blank');
}

function openModal(id) {
  document.getElementById(id + '-modal').classList.add('active');
}

function closeModal(id) {
  document.getElementById(id + '-modal').classList.remove('active');
}
document.addEventListener('keydown', (e) => {
  if (document.querySelector('.modal.active') || 
      e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }
  if (e.code === 'Space') {
    e.preventDefault(); 
    document.getElementById('quote-button').click();
  }
  else if (e.key === 's' || e.key === 'S') {
    e.preventDefault(); 
    document.getElementById('save-button').click();
  }
  else if (e.key === 'ArrowLeft') {
    e.preventDefault(); 
    showPreviousQuote();
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  document.getElementById('quote-button').addEventListener('click', () => generateRandomQuote(false));
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('save-button').addEventListener('click', saveQuote);
  document.getElementById('show-saved-button').addEventListener('click', showSavedQuotes);
  document.getElementById('share-twitter').addEventListener('click', () => shareQuote('twitter'));
  document.getElementById('share-facebook').addEventListener('click', () => shareQuote('facebook'));
  document.getElementById('share-whatsapp').addEventListener('click', () => shareQuote('whatsapp'));
  document.getElementById('copy-button').addEventListener('click', copyQuote);
  document.getElementById('prev-quote-button').addEventListener('click', showPreviousQuote);
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close')) {
      const modalId = e.target.closest('.modal').id.split('-')[0];
      closeModal(modalId);
    } else if (e.target.classList.contains('modal')) {
      const modalId = e.target.id.split('-')[0];
      closeModal(modalId);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(modal => {
        const modalId = modal.id.split('-')[0];
        closeModal(modalId);
      });
    }
  });
  generateRandomQuote(true); 
});