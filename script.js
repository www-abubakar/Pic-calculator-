/* ============================================
   PIECE SET CALCULATOR — LOGIC
   ============================================ */

// ---- Elements ----
const piecesPerSetInput = document.getElementById('piecesPerSet');
const requiredPiecesInput = document.getElementById('requiredPieces');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const errorMessage = document.getElementById('errorMessage');

const resultCard = document.getElementById('resultCard');
const resultSets = document.getElementById('resultSets');
const resultEquation = document.getElementById('resultEquation');
const resultExplain = document.getElementById('resultExplain');
const resultTotalPieces = document.getElementById('resultTotalPieces');

const themeToggle = document.getElementById('themeToggle');

/* ============================================
   THEME (Light / Dark) — remembered via localStorage
   ============================================ */

const THEME_STORAGE_KEY = 'pieceSetCalculator.theme';

/**
 * Applies a theme by setting a data-theme attribute on <html>
 * and updates the toggle button's accessible state.
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );
}

/**
 * Figures out which theme to start with:
 * 1. A previously saved choice in localStorage, if present.
 * 2. Otherwise, the user's system preference.
 * 3. Otherwise, defaults to light.
 */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {
    // localStorage may be unavailable (e.g. private browsing) — ignore and fall back
  }

  const prefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function initTheme() {
  applyTheme(getInitialTheme());
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch (e) {
    // If storage isn't available, the theme still applies for this session
  }
}

initTheme();
themeToggle.addEventListener('click', toggleTheme);

/* ============================================
   CALCULATION LOGIC
   (unchanged from the original version)
   ============================================ */

/**
 * Checks whether a value is a valid, positive, non-zero number.
 * Returns true only for numbers greater than 0.
 * Rejects empty strings, text, zero, and negative numbers.
 */
function isValidPositiveNumber(value) {
  if (value === null || value === undefined) return false;

  const trimmed = String(value).trim();
  if (trimmed === '') return false;

  const number = Number(trimmed);

  // Number() turns invalid text into NaN, which fails this check
  if (Number.isNaN(number)) return false;

  // Must be strictly greater than zero (no zero, no negatives)
  return number > 0;
}

/**
 * Shows the friendly error message and hides the result card.
 */
function showError() {
  errorMessage.hidden = false;
  resultCard.hidden = true;
}

/**
 * Hides the error message.
 */
function hideError() {
  errorMessage.hidden = true;
}

/**
 * Main calculation handler.
 * Reads both inputs, validates them, then calculates the
 * required number of complete sets using CEILING (round up),
 * never a normal round and never a round down.
 */
function calculate() {
  const piecesPerSetValue = piecesPerSetInput.value;
  const requiredPiecesValue = requiredPiecesInput.value;

  // ---- VALIDATION ----
  // Both fields must contain a valid positive number greater than zero.
  if (
    !isValidPositiveNumber(piecesPerSetValue) ||
    !isValidPositiveNumber(requiredPiecesValue)
  ) {
    showError();
    return;
  }

  hideError();

  const piecesPerSet = Number(piecesPerSetValue);
  const requiredPieces = Number(requiredPiecesValue);

  // ---- CORE CALCULATION (do not change) ----
  // Math.ceil() always rounds UP to the next whole number.
  // This guarantees we never come up short on pieces, which is
  // the entire point of this calculator.
  const exactSets = requiredPieces / piecesPerSet;
  const setsRequired = Math.ceil(exactSets);

  // Total pieces contained in the rounded-up number of sets.
  // This helps the user see how many "extra" pieces they'll have.
  const totalPieces = setsRequired * piecesPerSet;

  // ---- DISPLAY RESULTS ----
  resultSets.textContent = String(setsRequired);

  // Show the division clearly. If the division came out even,
  // show a clean equation. If rounding happened, show the decimal
  // value first so the user understands why we rounded up.
  const isWholeNumber = Number.isInteger(exactSets);

  if (isWholeNumber) {
    resultEquation.textContent = `${requiredPieces} ÷ ${piecesPerSet} = ${exactSets}`;
    resultExplain.textContent = '';
  } else {
    const roundedDecimal = exactSets.toFixed(2);
    resultEquation.textContent = `${requiredPieces} ÷ ${piecesPerSet} = ${roundedDecimal}`;
    resultExplain.textContent =
      `${setsRequired} set${setsRequired === 1 ? '' : 's'} are needed to cover ${requiredPieces} pieces.`;
  }

  resultTotalPieces.textContent = `Total pieces: ${totalPieces}`;

  resultCard.hidden = false;
}

/**
 * Resets the form back to its original empty state.
 */
function resetForm() {
  piecesPerSetInput.value = '';
  requiredPiecesInput.value = '';
  hideError();
  resultCard.hidden = true;
  piecesPerSetInput.focus();
}

// ---- EVENT LISTENERS ----
calculateBtn.addEventListener('click', calculate);
resetBtn.addEventListener('click', resetForm);

// Allow pressing "Enter" on the keyboard to trigger calculation
piecesPerSetInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') calculate();
});
requiredPiecesInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') calculate();
});
