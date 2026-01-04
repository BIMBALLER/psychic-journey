// ────────────────────────────────
// QUOTES & SCRIPTURES
// ────────────────────────────────
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
  { quote: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.", author: "Pierre Teilhard de Chardin" }
];

const fallbackScriptures = [
  { quote: "For God so loved the world that he gave his one and only Son...", author: "Bible - John 3:16" },
  { quote: "For I know the plans I have for you, declares the Lord...", author: "Bible - Jeremiah 29:11" },
  { quote: "Indeed, with hardship comes ease.", author: "Quran - Ash-Sharh 94:6" },
  { quote: "Indeed, Allah will not change the condition of a people until they change what is in themselves.", author: "Quran 13:11" },
  { quote: "You have a right to perform your duty, but not to the fruits of action.", author: "Bhagavad Gita - 2:47" }
];

// ────────────────────────────────
// STATE
// ────────────────────────────────
const state = {
  currentQuote: null,
  savedQuotes: JSON.parse(localStorage.getItem("savedQuotes")) || []
};

// ────────────────────────────────
// ELEMENTS
// ────────────────────────────────
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const statusEl = document.getElementById("copy-status");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const oracleResponse = document.getElementById("oracle-response");
const oracleInput = document.getElementById("oracle-input");
const oracleSend = document.getElementById("oracle-send");
const oracleBtn = document.getElementById("ask-oracle-btn");
const oracleModal = document.getElementById("oracle-modal");
const oracleClose = document.getElementById("close-oracle");

// ────────────────────────────────
// DISPLAY QUOTE
// ────────────────────────────────
function displayQuote(qObj) {
  state.currentQuote = qObj;
  quoteEl.textContent = `"${qObj.quote}"`;
  authorEl.textContent = `- ${qObj.author}`;
  quoteEl.classList.add("show");
}

// ────────────────────────────────
// GENERATE RANDOM QUOTE BASED ON THEME
// ────────────────────────────────
function generateRandomQuote() {
  const theme = document.documentElement.getAttribute("data-theme");
  const pool = theme === "dark" ? fallbackQuotes : fallbackScriptures;
  const qObj = pool[Math.floor(Math.random() * pool.length)];
  displayQuote(qObj);
}

// ────────────────────────────────
// SAVE QUOTE
// ────────────────────────────────
function saveQuote() {
  if (!state.currentQuote) return alert("No quote to save!");
  const duplicate = state.savedQuotes.some(q => q.quote === state.currentQuote.quote);
  if (duplicate) return alert("Already saved!");
  state.savedQuotes.push(state.currentQuote);
  localStorage.setItem("savedQuotes", JSON.stringify(state.savedQuotes));
  alert("Quote saved!");
}

// ────────────────────────────────
// SHOW / REMOVE SAVED QUOTES
// ────────────────────────────────
function showSavedQuotes() {
  const section = document.getElementById("saved-section");
  const div = document.getElementById("saved-quotes");
  if (section.classList.contains("hidden")) {
    div.innerHTML = "<h3>Saved Readings</h3>";
    if (!state.savedQuotes.length) div.innerHTML += "<p>No saved readings yet.</p>";
    else state.savedQuotes.forEach((q, i) => {
      const p = document.createElement("p");
      p.innerHTML = `"${q.quote}"<br><em>- ${q.author}</em>`;
      const btn = document.createElement("button");
      btn.textContent = "×";
      btn.onclick = () => {
        state.savedQuotes.splice(i, 1);
        localStorage.setItem("savedQuotes", JSON.stringify(state.savedQuotes));
        showSavedQuotes();
      };
      p.appendChild(btn);
      div.appendChild(p);
    });
    section.classList.remove("hidden");
  } else section.classList.add("hidden");
}

// ────────────────────────────────
// COPY QUOTE
// ────────────────────────────────
function copyQuote() {
  if (!state.currentQuote) return;
  navigator.clipboard.writeText(`"${state.currentQuote.quote}" - ${state.currentQuote.author}`);
  statusEl.textContent = "Copied!";
  statusEl.style.opacity = 1;
  setTimeout(() => statusEl.style.opacity = 0, 1500);
}

// ────────────────────────────────
// THEME TOGGLE
// ────────────────────────────────
function toggleTheme() {
  const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  generateRandomQuote();
}

// ────────────────────────────────
// HAMBURGER MENU
// ────────────────────────────────
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("show");
});

// ────────────────────────────────
// GOOGLE AI STUDIO ORACLE
// ────────────────────────────────
async function askOracle(question) {
  if (!question.trim()) return;

  oracleResponse.textContent = "⏳ Consulting the Oracle…";

  try {
    const res = await fetch("/api/oracle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    oracleResponse.textContent = data.answer || "The Oracle remains silent…";
  } catch (err) {
    oracleResponse.textContent = "❌ Oracle could not respond.";
    console.error(err);
  }
}

// ────────────────────────────────
// ORACLE MODAL LOGIC
// ────────────────────────────────
oracleBtn.onclick = () => {
  oracleModal.style.display = "flex";
  oracleInput.focus();
};

oracleClose.onclick = () => {
  oracleModal.style.display = "none";
};

// Close modal when clicking outside the modal content
window.addEventListener("click", (e) => {
  if (e.target === oracleModal) oracleModal.style.display = "none";
});

// Oracle submit
oracleSend.onclick = () => {
  const q = oracleInput.value.trim();
  if (!q) return;
  askOracle(q);
  oracleInput.value = "";
};

// ────────────────────────────────
// SHARE QUOTE
// ────────────────────────────────
function shareText() { return document.getElementById("quote").textContent; }

document.getElementById("share-twitter").onclick = () =>
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}`);

document.getElementById("share-facebook").onclick = () =>
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${location.href}`);

document.getElementById("share-whatsapp").onclick = () =>
  window.open(`https://wa.me/?text=${encodeURIComponent(shareText() + " " + location.href)}`);

// ────────────────────────────────
// KEYBOARD SHORTCUTS
// ────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); generateRandomQuote(); }
  if (e.code === "ArrowLeft") showSavedQuotes();
  if (e.key.toLowerCase() === "s") saveQuote();
});

// ────────────────────────────────
// INITIALIZATION
// ────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  generateRandomQuote();

  document.getElementById("quote-button").onclick = generateRandomQuote;
  document.getElementById("prev-quote-button").onclick = showSavedQuotes;
  document.getElementById("save-button").onclick = saveQuote;
  document.getElementById("show-saved-button").onclick = showSavedQuotes;
  document.getElementById("copy-button").onclick = copyQuote;
  document.getElementById("themeToggle").onclick = toggleTheme;
});
