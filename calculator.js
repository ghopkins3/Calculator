
const inputDisplay = document.querySelector("#io")
const clearBtn = document.querySelector("#clear");
const signBtn = document.querySelector("#sign");
const numBtns = document.querySelectorAll(".numbers");
const backspaceBtn = document.querySelector("#backspace");
const operatorBtns = document.querySelectorAll(".operators");
const equalsBtn = document.querySelector("#equals");
const numpad = document.querySelector(".inputs");
let firstOperand = null;
let secondOperand = null;
let selectedButton = null;
let firstOperator = null;
let secondOperator = null;

document.addEventListener("keydown", () => {
    handleKeyPress(event);
});

operatorBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
        if(event.target.classList.contains("operator")) {
            
            firstOperator = event.target.textContent;
            
            if(secondOperator === null) {
                firstOperand = parseFloat(inputDisplay.textContent);
            }

            if(firstOperand && firstOperator && secondOperator !== null) {
                secondOperand = parseFloat(inputDisplay.textContent);
            
                operate(firstOperand, secondOperator, secondOperand);

                // Second operator has to be set to null to skip this statement
                // Otherwise user can keep pressing any operator to perform unintended calculations

                clearOperandsandSecondOperator();
                firstOperand = parseFloat(result);

            }

            if(selectedButton) {
                selectedButton.style.backgroundColor = "orange";
                selectedButton.style.color = "white";
            }

            selectedButton = event.target;
            selectedButton.style.backgroundColor = "white";
            selectedButton.style.color = "orange";

            console.log("first operator: " + firstOperator);
            console.log("second operator: " + secondOperator);

        }
    });
});

equalsBtn.addEventListener("click", () => {

    console.log("first operator: " + firstOperator);
    console.log("second operator: " + secondOperator);
    secondOperand = parseFloat(inputDisplay.textContent);
    operate(firstOperand, firstOperator, secondOperand);
    clearAll();
    firstOperand = parseFloat(result);
    
    if(selectedButton) {
        selectedButton.style.backgroundColor = "orange";
        selectedButton.style.color = "white";
    }
    
});


numBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
        if(event.target.classList.contains("number") || event.target.classList.contains("decimal")) {
            if(inputDisplay.textContent === "0" || selectedButton) {
                inputDisplay.textContent = event.target.textContent;
            } else if(inputDisplay.textContent.length === 9) {
                return;
            } else if(inputDisplay.textContent.includes(".") && event.target.textContent === ".") {
                return;
            } else {
                inputDisplay.textContent += event.target.textContent;
            }

            if(inputDisplay.textContent.length === 7) {
                inputDisplay.style.fontSize = "90px";
            } else if(inputDisplay.textContent.length === 8) {
                inputDisplay.style.fontSize = "78px";
            } else if(inputDisplay.textContent.length === 9) {
                inputDisplay.style.fontSize = "68px";
            }

            secondOperator = firstOperator;

            if(selectedButton) {
                inputDisplay.style.fontSize = "95px";
                selectedButton.style.backgroundColor = "orange";
                selectedButton.style.color = "white";
                selectedButton = null;
            }

        }
    });
});

clearBtn.addEventListener("click", () => {
    inputDisplay.textContent = "0";
    inputDisplay.style.fontSize = "95px";
    clearOperandsAndFirstOperator();
    
    if(selectedButton) {
        selectedButton.style.backgroundColor = "orange";
        selectedButton.style.color = "white";
        selectedButton = null;
    }
});

signBtn.addEventListener("click", () => {
    let num = inputDisplay.textContent;
    if(!isNaN(num)) {
        num = num - (num * 2);
    }
    inputDisplay.textContent = num;
});

backspaceBtn.addEventListener("click", () => {
    if(inputDisplay.textContent === "nice try!" || 
        inputDisplay.textContent === "Overflow" || 
        inputDisplay.textContent === "Infinity" ||
        inputDisplay.textContent === "0") {
        return;
    } else if(inputDisplay.textContent === "") {
        inputDisplay.textContent = "0";
    } 

    inputDisplay.textContent = inputDisplay.textContent.slice(0, -1);
});


function add(x, y) {
    if(isNaN(y)) {
        return x + x;
    }
    return x + y;
}

function subtract(x, y) {
    if(isNaN(y)) {
        return x - x;
    }
    return x - y;
}

function divide(x, y) {
    if(y === 0) {
        return "nice try!";
    } else if(isNaN(y)) {
        return x / x;
    }

    return x / y;
}

function multiply(x, y) { 
    if(isNaN(y)) {
        return x * x;
    }
    return x * y;
}

function getInputs() {
    inputs = inputDisplay.textContent.split(" ");
    x = parseFloat(inputs[0]);
    op = inputs[1];
    y = parseFloat(inputs[2]);
}

function splitOnDecimal(decimalNumber) {
    return decimalNumber.toString().split(".");
}

function calculatePrecision(x, y) {
    let xPrecision = 0;
    let yPrecision = 0;
    let xSplit = splitOnDecimal(x);
    let ySplit = splitOnDecimal(y);

    if(xSplit[1] !== undefined) {
        xPrecision = xSplit[1].toString().length;
    } 

    if(ySplit[1] !== undefined) {
        yPrecision = ySplit[1].toString().length;
    } 

    return Math.max(xPrecision, yPrecision);
}

function operate(x, op, y) {
    if(op === "+") {
        result = add(x, y);
    } else if(op === "-") {
        result = subtract(x, y);
    } else if(op === "÷") {
        result = divide(x, y);
        if(result === "nice try!") {
            inputDisplay.textContent = result;
        }
    } else if(op === "x") {
        result = multiply(x, y);
    }
    
    result = result.toFixed(calculatePrecision(x, y));

    if(result.length === 7) {
        inputDisplay.style.fontSize = "90px";
    } else if(result.length === 8) {
        inputDisplay.style.fontSize = "78px";
    } else if(result.length === 9) {
        inputDisplay.style.fontSize = "68px";
    }

    if(result.length > 9) {
        let sciNotation = parseFloat(result).toExponential(5).replace("+", "")
        sciNotation = parseFloat(sciNotation).toExponential().replace("+", "");
        inputDisplay.textContent = sciNotation;
        inputDisplay.style.fontSize = "74px";
    } else if(result.length >= 12) {
        inputDisplay.textContent = "Overflow";
    } else {
        inputDisplay.textContent = result;
    }
}

function showTime() {
    const dateDisplay = document.querySelector("#time");

    let time = new Date();
    let hour = time.getHours();
    let minute = time.getMinutes();

    if(hour >= 12) {
        if(hour > 12) hour -= 12;
    } else if(hour == 0) {
        hour = 12;
    }

    if(minute < 10) {
        minute = "0" + minute;
    }

    let currentTime = hour + ":" + minute + " ";
    dateDisplay.textContent = currentTime;
}

function clearOperandsAndFirstOperator() {
    firstOperand = null;
    secondOperand = null;
    firstOperator = null;
}

function clearOperandsandSecondOperator() {
    firstOperand = null;
    secondOperand = null;
    secondOperator = null;
}

function clearAll() {
    firstOperand = null;
    secondOperand = null;
    firstOperator = null;
    secondOperator = null;
}

function setFirstOperand(num) {
    firstOperand = num;
}

function setSecondOperand(num) {
    secondOperand = num;
}

showTime();
setInterval(showTime, 1000);