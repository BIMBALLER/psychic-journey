// ==========================
// ORIGINAL FALLBACK DATA
// ==========================
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

// ==========================
// APP STATE
// ==========================
const state = {
  currentQuote: null,
  history: [],
  historyIndex: -1,
  savedQuotes: JSON.parse(localStorage.getItem("savedQuotes")) || []
};

// ==========================
// DOM ELEMENTS
// ==========================
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const statusEl = document.getElementById("copy-status");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

// ==========================
// UTILITIES
// ==========================
function animateQuote() {
  quoteEl.classList.remove("show");
  setTimeout(() => quoteEl.classList.add("show"), 10);
}

function displayQuote(quoteObj) {
  state.currentQuote = quoteObj;
  quoteEl.textContent = `"${quoteObj.quote || quoteObj.text}"`;
  authorEl.textContent = `- ${quoteObj.author}`;
  animateQuote();
}

function updateHistory(quoteObj) {
  if (state.historyIndex !== state.history.length - 1) {
    state.history = state.history.slice(0, state.historyIndex + 1);
  }
  state.history.push(quoteObj);
  if (state.history.length > 10) state.history.shift();
  state.historyIndex = state.history.length - 1;
}

// ==========================
// FETCH LOGIC
// ==========================
async function fetchDarkQuote() {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    const data = await res.json();
    return { quote: data.quote, author: data.author };
  } catch {
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}

async function fetchLightQuote() {
  const holyBooks = ["bible", "quran", "gita"];
  const selectedBook = holyBooks[Math.floor(Math.random() * holyBooks.length)];

  try {
    if (selectedBook === "bible") {
      const res = await fetch("https://bolls.life/get-random-verse/KJV/");
      const data = await res.json();
      return { quote: data.text.replace(/<S>\d+<\/S>/g, ""), author: `Bible - ${data.bookname} ${data.chapter}:${data.verse}` };
    } else if (selectedBook === "quran") {
      const randomAyah = Math.floor(Math.random() * 6236) + 1;
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}/en.sahih`);
      const data = await res.json();
      return { quote: data.data.text, author: `Quran - ${data.data.surah.englishName} ${data.data.numberInSurah}` };
    } else if (selectedBook === "gita") {
      const randomCh = Math.floor(Math.random() * 18) + 1;
      const randomVerse = Math.floor(Math.random() * 47) + 1;
      const res = await fetch(`https://bhagavadgita.theaum.org/text/translations/${randomCh}/${randomVerse}`);
      const data = await res.json();
      const en = data.data.find(t => t.lang === "en");
      return { quote: en ? en.translation : data.data[0].translation, author: `Bhagavad Gita - ${data.data[0].chapter}:${data.data[0].verse}` };
    }
  } catch {
    return fallbackScriptures[Math.floor(Math.random() * fallbackScriptures.length)];
  }
}

// ==========================
// MAIN DRAW FUNCTION
// ==========================
async function generateRandomQuote() {
  const theme = document.documentElement.getAttribute("data-theme") || "light";
  const quoteObj = theme === "dark" ? await fetchDarkQuote() : await fetchLightQuote();
  updateHistory(quoteObj);
  displayQuote(quoteObj);
}

// ==========================
// HISTORY, SAVE & COPY
// ==========================
function showPreviousQuote() {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    displayQuote(state.history[state.historyIndex]);
  }
}

function saveQuote() {
  if (!state.currentQuote) return alert("No quote to save!");
  const isDuplicate = state.savedQuotes.some(q => q.quote === state.currentQuote.quote && q.author === state.currentQuote.author);
  if (isDuplicate) return alert("This quote is already saved!");
  state.savedQuotes.push(state.currentQuote);
  localStorage.setItem("savedQuotes", JSON.stringify(state.savedQuotes));
  alert("Quote saved!");
}

function showSavedQuotes() {
  const div = document.getElementById("saved-quotes");
  div.innerHTML = "<h3>Saved Readings</h3>";
  if (!state.savedQuotes.length) return div.innerHTML += "<p>No saved readings yet.</p>";
  state.savedQuotes.forEach((q, i) => {
    const p = document.createElement("p");
    p.textContent = `"${q.quote}" - ${q.author}`;
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.onclick = () => deleteQuote(i);
    p.appendChild(btn);
    div.appendChild(p);
  });
}

function deleteQuote(i) {
  state.savedQuotes.splice(i, 1);
  localStorage.setItem("savedQuotes", JSON.stringify(state.savedQuotes));
  showSavedQuotes();
}

function copyQuote() {
  if (!state.currentQuote) return;
  const text = `"${state.currentQuote.quote}" - ${state.currentQuote.author}`;
  navigator.clipboard.writeText(text).then(() => {
    statusEl.textContent = "Copied!";
    statusEl.style.opacity = 1;
    setTimeout(() => statusEl.style.opacity = 0, 1500);
  });
}

// ==========================
// THEME TOGGLE
// ==========================
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  generateRandomQuote();
}

// ==========================
// MODAL LOGIC
// ==========================
function openModal(id) {
  const modal = document.getElementById(`${id}-modal`);
  if (!modal) return;
  modal.classList.add("active");

  const closeBtn = modal.querySelector(".close");
  closeBtn.onclick = () => modal.classList.remove("active");

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.classList.remove("active");
    }
  };
}

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  document.getElementById("quote-button").onclick = generateRandomQuote;
  document.getElementById("prev-quote-button").onclick = showPreviousQuote;
  document.getElementById("save-button").onclick = saveQuote;
  document.getElementById("show-saved-button").onclick = showSavedQuotes;
  document.getElementById("copy-button").onclick = copyQuote;
  document.getElementById("themeToggle").onclick = toggleTheme;

  // Hamburger menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("show");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (e) => {
      const isHome = link.getAttribute("href") === "/" || link.textContent.trim().toLowerCase() === "home";
      const isAlreadyHome = window.location.pathname === "/" || window.location.pathname.endsWith("index.html");

      // Always close menu
      hamburger.classList.remove("active");
      navLinks.classList.remove("show");

      // Prevent Home → Home reload
      if (isHome && isAlreadyHome) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  generateRandomQuote();
});
