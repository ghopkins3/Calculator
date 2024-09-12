
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
var iphoneTypeSound = new Audio("sounds/iphone_typing.wav")
var iphoneDeleteSound = new Audio("sounds/iphone_delete.wav")

var formatter = new Intl.NumberFormat("en-US", { 
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
});

document.addEventListener("keydown", (event) => {
    handleKeyPress(event);
});

operatorBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
        if(event.target.classList.contains("operator")) {
            iphoneTypeSound.play();
            if(inputDisplay.textContent === "nice try!" || 
                inputDisplay.textContent === "Overflow" || 
                inputDisplay.textContent === "Infinity") {
                return;
            }

            setFirstOperator(event.target.textContent);
            
            if(secondOperator === null) {
                setFirstOperand(parseFloat(inputDisplay.textContent.replace(/,/g, "")));
            }

            if(firstOperand && firstOperator && secondOperator !== null) {
                setSecondOperand(parseFloat(inputDisplay.textContent.replace(/,/g, "")));
                operate(firstOperand, secondOperator, secondOperand);

                // Second operator has to be set to null to skip this statement
                // Otherwise user can keep pressing any operator to perform unintended calculations
                clearOperandsAndSecondOperator();
                setFirstOperand(parseFloat(result));

            }

            if(selectedButton) {
                disableButtonStyle();
            }

            selectedButton = event.target;
            enableButtonStyle();
        }
    });
});

equalsBtn.addEventListener("click", () => {
    iphoneTypeSound.play();
    setSecondOperand(parseFloat(inputDisplay.textContent.replace(/,/g, "")));
    operate(firstOperand, firstOperator, secondOperand);
    clearAllOperandsAndOperators();
    setFirstOperand(parseFloat(result));
    
    if(selectedButton) {
        disableButtonStyle();
    }
    
});

numBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
        if(event.target.classList.contains("number") || event.target.classList.contains("decimal")) {
            iphoneTypeSound.play();
            if(inputDisplay.textContent === "0" || selectedButton) {
                setDisplayTextContent(event.target.textContent);
            } else if(displayLengthGreaterThanOrEqualsNumber(11)) {
                return;
            } else if(inputDisplay.textContent.includes(".") && event.target.textContent === ".") {
                return;
            } else {
                appendToDisplayTextContent(event.target.textContent);
            }

            console.log("length: "  + inputDisplay.textContent.length);

            setSecondOperator(firstOperator);

            if(selectedButton) {
                setDisplayFontSize("95px");
                disableButtonStyle();
                setSelectedButtonNull();
            }

                        
        }
    });
});

clearBtn.addEventListener("click", () => {
    iphoneDeleteSound.play();
    clearTextContent();
    resetFontSize();
    clearAllOperandsAndOperators();
    
    if(selectedButton) {
        disableButtonStyle();
        setSelectedButtonNull();
    }
});

signBtn.addEventListener("click", () => {
    iphoneTypeSound.play();
    if(inputDisplay.textContent === "nice try!" || 
        inputDisplay.textContent === "Overflow" || 
        inputDisplay.textContent === "Infinity") {
        return;
    }

    negateNumber(inputDisplay.textContent);

    if(displayLengthEqualsNumber(7)) {
        setDisplayFontSize("84px");
    } else if(displayLengthEqualsNumber(8)) {
        setDisplayFontSize("74px");
    } else if(displayLengthEqualsNumber(9)) {
        setDisplayFontSize("64px");
    } else if(displayLengthEqualsNumber(10)) {
        setDisplayFontSize("58px");
    }
});

backspaceBtn.addEventListener("click", () => {
    iphoneDeleteSound.play();
    if(inputDisplay.textContent === "nice try!" || 
        inputDisplay.textContent === "Overflow" || 
        inputDisplay.textContent === "Infinity" ||
        inputDisplay.textContent === "0") {
        return;
    } else if(inputDisplay.textContent.length === 1) {
        clearTextContent();
    } else {
        setDisplayTextContent(inputDisplay.textContent.slice(0, -1));
    }
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

function splitOnDecimal(num) {
    return num.toString().split(".");
}

function roundToMaxDigits(num) {
    let split = splitOnDecimal(num);
    let wholeNumber = split[0];
    
    return parseFloat(num.toFixed(9 - wholeNumber.length));
}

function operate(x, op, y) {
    
    if(op === "+") {
        result = add(x, y);
    } else if(op === "-") {
        result = subtract(x, y);
    } else if(op === "÷") {
        result = divide(x, y);
        if(result === "nice try!") {
            setDisplayTextContent(result);
        }
    } else if(op === "x") {
        result = multiply(x, y);
    }

    setDisplayTextContent(result);

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

function clearOperandsAndSecondOperator() {
    firstOperand = null;
    secondOperand = null;
    secondOperator = null;
}

function clearAllOperandsAndOperators() {
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

function setFirstOperator(op) {
    firstOperator = op;
}

function setSecondOperator(op) {
    secondOperator = op;
}

function negateNumber(num) {
    if(!isNaN(num)) {
        num = num - (num * 2);
    }

    inputDisplay.textContent = num;
}

function enableButtonStyle() {
    selectedButton.style.backgroundColor = "white";
    selectedButton.style.color = "orange";
}

function disableButtonStyle() {
    selectedButton.style.backgroundColor = "orange";
    selectedButton.style.color = "white";
}

function resetFontSize() {
    inputDisplay.style.fontSize = "95px";
}

function clearTextContent() {
    inputDisplay.textContent = "0";
}

function displayLengthEqualsNumber(num) {
    if(inputDisplay.textContent.length === num) {
        return true;
    } 
    
    return false;
}   

function displayLengthGreaterThanOrEqualsNumber(num) {
    if(inputDisplay.textContent.length >= num) {
        return true;
    }

    return false;
}

function setDisplayFontSize(str) {
    inputDisplay.style.fontSize = str;
}

function setSelectedButtonNull() {
    selectedButton = null;
}

function setDisplayTextContent(str) {
    let num = parseFloat(String(str).replace(/,/g, '')); // Convert to string and remove commas
    if (!isNaN(num)) {
        inputDisplay.textContent = formatter.format(num);
    } else {
        inputDisplay.textContent = str; // If not a number, just set the string directly
    }
}


function appendToDisplayTextContent(str) {
    let currentText = String(inputDisplay.textContent).replace(/,/g, ''); // Remove commas
    let newText = currentText + String(str); // Concatenate the new input
    let num = parseFloat(newText);

    if (!isNaN(num)) {
        if (newText.includes(".")) {
            // Split the number at the decimal point
            let parts = newText.split(".");
            let integerPart = parts[0];
            let decimalPart;

            if (parts.length > 1) {
                // If there are digits after the decimal point, include them
                decimalPart = "." + parts[1];
            } else {
                // If there are no digits after the decimal point, just keep the decimal
                decimalPart = ".";
            }

            // Format the integer part and reattach the decimal part
            inputDisplay.textContent = formatter.format(parseFloat(integerPart)) + decimalPart;
        } else {
            // If no decimal, simply format the number
            inputDisplay.textContent = formatter.format(num);
        }
    } else {
        // If the input is not a valid number, display the new text as-is
        inputDisplay.textContent = newText;
    }
}

function handleKeyPress() {

}

showTime();
setInterval(showTime, 1000);