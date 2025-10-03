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

let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];

function generateRandomQuote() {
  console.log('Attempting to fetch quote from DummyJSON...');
  const quoteElement = document.getElementById('quote');
  const authorElement = document.getElementById('author');
  if (!quoteElement || !authorElement) {
    console.error('DOM elements #quote or #author not found');
    return;
  }

  quoteElement.classList.remove('show');

  const url = 'https://dummyjson.com/quotes/random';

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.quote || !data.author) {
        throw new Error('Invalid API response');
      }
      console.log('Quote fetched successfully:', data);
      quoteElement.textContent = `"${data.quote}"`;
      authorElement.textContent = `- ${data.author}`;
      setTimeout(() => quoteElement.classList.add('show'), 10);
      window.currentQuote = { text: data.quote, author: data.author };
    })
    .catch(error => {
      console.error('Error fetching quote:', error.message);
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      const quoteObj = fallbackQuotes[randomIndex];
      console.log('Using fallback quote:', quoteObj);
      quoteElement.textContent = `"${quoteObj.quote}"`;
      authorElement.textContent = `- ${quoteObj.author}`;
      setTimeout(() => quoteElement.classList.add('show'), 10);
      window.currentQuote = { text: quoteObj.quote, author: quoteObj.author };
    });
}

// Theme toggle function
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.getElementById('themeToggle').textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  console.log('Theme toggled to:', currentTheme);
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
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
  document.getElementById('themeToggle').textContent = initialTheme === 'dark' ? '☀️' : '🌙';
});