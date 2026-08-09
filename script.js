/* ============================================
   PIECE SET CALCULATOR — LOGIC
   ============================================ */

// Grab all the elements we need to work with
const piecesPerSetInput = document.getElementById('piecesPerSet');
const requiredPiecesInput = document.getElementById('requiredPieces');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const errorMessage = document.getElementById('errorMessage');

const resultCard = document.getElementById('resultCard');
const resultSets = document.getElementById('resultSets');
const resultEquation = document.getElementById('resultEquation');
const resultTotalPieces = document.getElementById('resultTotalPieces');

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

  // ---- CORE CALCULATION ----
  // Math.ceil() always rounds UP to the next whole number.
  // This guarantees we never come up short on pieces, which is
  // the entire point of this calculator.
  const exactSets = requiredPieces / piecesPerSet;
  const setsRequired = Math.ceil(exactSets);

  // Total pieces contained in the rounded-up number of sets.
  // This helps the user see how many "extra" pieces they'll have.
  const totalPieces = setsRequired * piecesPerSet;

  // ---- DISPLAY RESULTS ----
  resultSets.textContent = `${setsRequired} SET${setsRequired === 1 ? '' : 'S'}`;

  // Show the division clearly. If the division came out even,
  // show a clean equation. If rounding happened, show the decimal
  // value first so the user understands why we rounded up.
  const isWholeNumber = Number.isInteger(exactSets);

  if (isWholeNumber) {
    resultEquation.textContent = `${requiredPieces} ÷ ${piecesPerSet} = ${exactSets}`;
  } else {
    const roundedDecimal = exactSets.toFixed(2);
    resultEquation.textContent =
      `${requiredPieces} ÷ ${piecesPerSet} = ${roundedDecimal} → rounded up to ${setsRequired}`;
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
