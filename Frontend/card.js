/* ========= ELEMENT HOOKS ========= */
const cardNumberInput = document.getElementById("cardNumber");
const cardNameInput   = document.getElementById("cardName");
const expiryInput     = document.getElementById("expiryDate");
const cvvInput        = document.getElementById("cvv");

const cardNoDisplay   = document.getElementById("card_no");
const nameDisplay     = document.getElementById("name_display");
const expiryDisplay   = document.getElementById("expiry_display");

const cardList        = document.getElementById("cardList");

const cardNumberError = document.getElementById("cardNumberError");
const cardNameError   = document.getElementById("cardNameError");
const expiryError     = document.getElementById("expiryError");
const cvvError        = document.getElementById("cvvError");

/* ========= HELPERS ========= */
function maskCardNumber(num) {
  if (num.length < 8) return num;
  return num.slice(0, 4) + "********" + num.slice(-4);
}

function isValidExpiry(val) {
  const re = /^(0[1-9]|1[0-2])\/(\d{2})$/;
  if (!re.test(val)) return false;
  const [m, y] = val.split("/").map(Number);
  const now = new Date();
  const fullY = 2000 + y;
  // the card is valid until the end of the expiry month
  return new Date(fullY, m) >= new Date(now.getFullYear(), now.getMonth() + 1);
}

function validateForm() {
  let ok = true;
  // reset errors
  [cardNumberError, cardNameError, expiryError, cvvError].forEach(el => el.textContent = "");

  const num  = cardNumberInput.value.trim().replace(/\s+/g, "");
  const name = cardNameInput.value.trim();
  const exp  = expiryInput.value.trim();
  const cvv  = cvvInput.value.trim();

  if (!/^\d{13,16}$/.test(num)) {
    cardNumberError.textContent = "Card number 13–16 digits.";
    ok = false;
  }
  if (!name) {
    cardNameError.textContent = "Name required.";
    ok = false;
  }
  if (!isValidExpiry(exp)) {
    expiryError.textContent = "Expiry MM/YY & future.";
    ok = false;
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    cvvError.textContent = "CVV 3–4 digits.";
    ok = false;
  }
  return ok;
}

function clearForm() {
  cardNumberInput.value = "";
  cardNameInput.value   = "";
  expiryInput.value     = "";
  cvvInput.value        = "";

  cardNoDisplay.textContent = "#### #### #### ####";
  nameDisplay.textContent   = "CARDHOLDER NAME";
  expiryDisplay.textContent = "MM/YY";

  [cardNumberError, cardNameError, expiryError, cvvError].forEach(el => el.textContent = "");
}

/* ========= LIVE PREVIEW ========= */
cardNumberInput.addEventListener("input", () => {
  cardNoDisplay.textContent =
    cardNumberInput.value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
});
cardNameInput.addEventListener("input", () => {
  nameDisplay.textContent = cardNameInput.value.toUpperCase() || "CARDHOLDER NAME";
});
expiryInput.addEventListener("input", () => {
  expiryDisplay.textContent = expiryInput.value || "MM/YY";
});

/* ========= BACKEND CONFIG ========= */
const API_BASE = "http://localhost:8080/api/cards";

/* ========= INITIAL RENDER ========= */
window.addEventListener("DOMContentLoaded", fetchAndRenderCards);

function fetchAndRenderCards() {
  fetch(API_BASE)
    .then(res => res.json())
    .then(cards => {
      cardList.innerHTML = "";   // clear existing
      cards.forEach(c => {
        addCardToDOM(c);
      });
    })
    .catch(() => {
      alert("Could not load cards from backend.");
    });
}

function addCardToDOM(card) {
  const li = document.createElement("li");
  li.textContent =
    `#${card.id} - ${card.cardNumberMasked} | ${card.cardholderName} | ${card.expiryMonth}/${card.expiryYear}`;
  cardList.appendChild(li);
}

/* ========= ADD CARD HANDLER ========= */
document.getElementById("addCard").addEventListener("click", () => {
  if (!validateForm()) return;

  const num  = cardNumberInput.value.trim().replace(/\s+/g, "");
  const name = cardNameInput.value.trim();
  const exp  = expiryInput.value.trim();
  const cvv  = cvvInput.value.trim();
  const [m, y] = exp.split("/");
  const payload = {
    cardNumber: num,
    cardholderName : name,
    expiryMonth    : parseInt(m, 10),
    expiryYear     : 2000 + parseInt(y, 10),
    cvv      : cvv
  };

  fetch(API_BASE, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) {
        return res.text().then(t => { throw new Error(t || "Error"); });
      }
      return res.json();
    })
    .then(saved => {
      alert("✅ Card saved to backend!");
      addCardToDOM(saved);
      clearForm();
    })
    .catch(err => {
      alert("❌ Backend error: " + err.message);
    });
});

/* ========= CANCEL ========= */
document.getElementById("cancelBtn").addEventListener("click", clearForm);
