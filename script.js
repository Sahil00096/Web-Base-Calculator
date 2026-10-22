var currentValue = "0";
var previousValue = "";
var operator = "";
var justCalculated = false;

var displayEl = document.getElementById("display");
var historyEl = document.getElementById("history");

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error";
  }
  return a / b;
}

function modulus(a, b) {
  if (b === 0) {
    return "Error";
  }
  return a % b;
}

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  var result;

  if (op === "+") {
    result = add(a, b);
  } else if (op === "-") {
    result = subtract(a, b);
  } else if (op === "*") {
    result = multiply(a, b);
  } else if (op === "/") {
    result = divide(a, b);
  } else if (op === "%") {
    result = modulus(a, b);
  } else {
    return b;
  }

  if (result === "Error") {
    return result;
  }
  return Math.round(result * 100000000) / 100000000;
}

function updateDisplay() {
  displayEl.textContent = currentValue;
  if (operator !== "") {
    historyEl.textContent = previousValue + " " + symbolOf(operator);
  } else {
    historyEl.textContent = "";
  }
}

function symbolOf(op) {
  if (op === "*") return "×";
  if (op === "/") return "÷";
  if (op === "-") return "−";
  return op;
}

function inputNumber(num) {
  if (currentValue === "Error") {
    currentValue = "0";
  }
  if (currentValue === "0" || justCalculated) {
    currentValue = num;
    justCalculated = false;
  } else {
    currentValue = currentValue + num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (justCalculated) {
    currentValue = "0";
    justCalculated = false;
  }
  if (currentValue.indexOf(".") === -1) {
    currentValue = currentValue + ".";
  }
  updateDisplay();
}

function inputOperator(op) {
  if (currentValue === "Error") {
    return;
  }
  if (operator !== "" && !justCalculated) {
    currentValue = String(calculate(previousValue, currentValue, operator));
  }
  previousValue = currentValue;
  operator = op;
  justCalculated = false;
  updateDisplay();
  currentValue = "0";
}

function pressEquals() {
  if (operator === "") {
    return;
  }
  var result = calculate(previousValue, currentValue, operator);
  historyEl.textContent = previousValue + " " + symbolOf(operator) + " " + currentValue + " =";
  currentValue = String(result);
  displayEl.textContent = currentValue;
  previousValue = "";
  operator = "";
  justCalculated = true;
}

function clearAll() {
  currentValue = "0";
  previousValue = "";
  operator = "";
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  if (justCalculated || currentValue === "Error") {
    clearAll();
    return;
  }
  currentValue = currentValue.slice(0, -1);
  if (currentValue === "" || currentValue === "-") {
    currentValue = "0";
  }
  updateDisplay();
}

function handleClick(event) {
  var btn = event.target.closest("button");
  if (!btn) {
    return;
  }
  var action = btn.dataset.action;
  var value = btn.dataset.value;

  if (action === "number") inputNumber(value);
  else if (action === "decimal") inputDecimal();
  else if (action === "operator") inputOperator(value);
  else if (action === "equals") pressEquals();
  else if (action === "clear") clearAll();
  else if (action === "delete") deleteLast();
}

function handleKey(event) {
  var key = event.key;
  if (key >= "0" && key <= "9") inputNumber(key);
  else if (key === ".") inputDecimal();
  else if (key === "+" || key === "-" || key === "*" || key === "/" || key === "%") inputOperator(key);
  else if (key === "Enter" || key === "=") {
    event.preventDefault();
    pressEquals();
  }
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
}

document.querySelector(".buttons").addEventListener("click", handleClick);
document.addEventListener("keydown", handleKey);
