// ==============================
// QUOTES
// ==============================
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

// ==============================
// ORACLE FALLBACK RESPONSES
// ==============================
const oracleResponses = [
  "The answer hides in the pause between thoughts.",
  "What you seek already moves toward you.",
  "Silence will reveal more than action.",
  "Patience and effort must walk together.",
  "Trust yourself, but remain open to change.",
  "The path becomes clear once you commit.",
  "Meaning is not found, it is created through awareness.",
  "Your question reflects a deeper truth about your becoming.",
  "The self you are becoming is asking for discipline, not certainty.",
  "Every step forward reveals what was hidden before.",
  "The mind sees what the heart allows it to see.",
  "Change is the only constant; embrace it fully.",
  "Even in darkness, a single spark can guide you.",
  "Listen to the silence; it carries the deepest truths.",
  "The journey itself holds the answers you seek.",
  "Let go of what you cannot control, and clarity will emerge.",
  "Wisdom often arrives disguised as confusion.",
  "The future unfolds from the choices you make today.",
  "When doubt clouds the mind, action clears the way.",
  "Your intuition knows more than your logic realizes.",
  "Sometimes the question itself is the answer.",
  "Observe first, act second.",
  "The universe whispers; are you listening?",
  "Seek not answers, but understanding.",
  "Every ending is the start of something new."
];

// ==============================
// STATE
// ==============================
const state = {
  currentQuote: null,
  savedQuotes: JSON.parse(localStorage.getItem("savedQuotes")) || []
};

// ==============================
// DOM ELEMENTS
// ==============================
const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const statusEl = document.getElementById("copy-status");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

// ==============================
// DISPLAY QUOTE
// ==============================
function displayQuote(qObj) {
  state.currentQuote = qObj;
  quoteEl.textContent = `"${qObj.quote}"`;
  authorEl.textContent = `- ${qObj.author}`;
  quoteEl.classList.add("show");
}

// ==============================
// GENERATE RANDOM QUOTE BASED ON THEME
// ==============================
function generateRandomQuote() {
  const theme = document.documentElement.getAttribute("data-theme");
  const allQuotes = theme === "dark" ? fallbackQuotes : fallbackScriptures;
  const qObj = allQuotes[Math.floor(Math.random() * allQuotes.length)];
  displayQuote(qObj);
}

// ==============================
// SAVE QUOTE
// ==============================
function saveQuote() {
  if (!state.currentQuote) return alert("No quote to save!");
  const duplicate = state.savedQuotes.some(q => q.quote === state.currentQuote.quote);
  if (duplicate) return alert("Already saved!");
  state.savedQuotes.push(state.currentQuote);
  localStorage.setItem("savedQuotes", JSON.stringify(state.savedQuotes));
  alert("Quote saved!");
}

// ==============================
// SHOW SAVED QUOTES
// ==============================
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

// ==============================
// COPY QUOTE
// ==============================
function copyQuote() {
  if (!state.currentQuote) return;
  navigator.clipboard.writeText(`"${state.currentQuote.quote}" - ${state.currentQuote.author}`);
  statusEl.textContent = "Copied!";
  statusEl.style.opacity = 1;
  setTimeout(() => statusEl.style.opacity = 0, 1500);
}

// ==============================
// TOGGLE THEME
// ==============================
function toggleTheme() {
  const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  generateRandomQuote();
}

// ==============================
// MODAL FUNCTION
// ==============================
function openModal(id) {
  const modal = document.getElementById(id + "-modal");
  if (!modal) return;
  modal.classList.add("active");
  modal.querySelector(".close").onclick = () => modal.classList.remove("active");
  window.onclick = (e) => { if (e.target === modal) modal.classList.remove("active"); };
}

// ==============================
// ORACLE MODAL (FRONTEND ONLY)
// ==============================
const oracleBtn = document.getElementById("ask-oracle-btn");
const oracleModal = document.getElementById("oracle-modal");
const oracleInput = document.getElementById("oracle-input");
const oracleSend = document.getElementById("oracle-send");
const oracleResponse = document.getElementById("oracle-response");
const oracleClose = document.getElementById("close-oracle");

oracleBtn.onclick = () => {
  oracleModal.style.display = "flex";
  oracleInput.focus();
};

oracleClose.onclick = () => oracleModal.style.display = "none";

oracleSend.onclick = () => {
  const question = oracleInput.value.trim();
  if (!question) return;

  // Show "thinking" message
  oracleResponse.textContent = "⏳ Oracle is thinking...";
  oracleSend.disabled = true;

  setTimeout(() => {
    // Pick a random oracle response
    const answer = oracleResponses[Math.floor(Math.random() * oracleResponses.length)];
    oracleResponse.textContent = answer;
    oracleSend.disabled = false;
    oracleInput.value = "";
  }, 800);
};

// ==============================
// SHARE FUNCTION
// ==============================
function shareText() {
  return document.getElementById("quote").textContent;
}

document.getElementById("share-twitter").onclick = () =>
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}`);

document.getElementById("share-facebook").onclick = () =>
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${location.href}`);

document.getElementById("share-whatsapp").onclick = () =>
  window.open(`https://wa.me/?text=${encodeURIComponent(shareText() + " " + location.href)}`);

// ==============================
// HAMBURGER TOGGLE
// ==============================
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("show");
});

// ==============================
// KEYBOARD SHORTCUTS
// ==============================
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); generateRandomQuote(); }
  if (e.code === "ArrowLeft") showSavedQuotes();
  if (e.key.toLowerCase() === "s") saveQuote();
});

// ==============================
// INITIALIZE ON DOM CONTENT LOADED
// ==============================
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
