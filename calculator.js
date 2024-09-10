
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

document.addEventListener("keydown", (event) => {
    handleKeyPress(event);
});

operatorBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
        if(event.target.classList.contains("operator")) {
            
            if(inputDisplay.textContent === "nice try!" || 
                inputDisplay.textContent === "Overflow" || 
                inputDisplay.textContent === "Infinity") {
                return;
            }

            setFirstOperator(event.target.textContent);
            
            if(secondOperator === null) {
                setFirstOperand(parseFloat(inputDisplay.textContent));
            }

            if(firstOperand && firstOperator && secondOperator !== null) {
                setSecondOperand(parseFloat(inputDisplay.textContent));
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

    setSecondOperand(parseFloat(inputDisplay.textContent));
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
            if(inputDisplay.textContent === "0" || selectedButton) {
                setDisplayTextContent(event.target.textContent);
            } else if(displayLengthEqualsNumber(9)) {
                return;
            } else if(inputDisplay.textContent.includes(".") && event.target.textContent === ".") {
                return;
            } else {
                appendToDisplayTextContent(event.target.textContent);
            }

            if(displayLengthEqualsNumber(7)) {
                setDisplayFontSize("82px");
            } else if(displayLengthEqualsNumber(8)) {
                setDisplayFontSize("72px");
            } else if(displayLengthEqualsNumber(9)) {
                setDisplayFontSize("65px");
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
    clearTextContent();
    resetFontSize();
    clearAllOperandsAndOperators();
    
    if(selectedButton) {
        disableButtonStyle();
        setSelectedButtonNull();
    }
});

signBtn.addEventListener("click", () => {

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
    if(inputDisplay.textContent === "nice try!" || 
        inputDisplay.textContent === "Overflow" || 
        inputDisplay.textContent === "Infinity" ||
        inputDisplay.textContent === "0") {
        return;
    } else if(inputDisplay.textContent === "") {
        setDisplayTextContent("0");
    } 

    setDisplayTextContent(inputDisplay.textContent.slice(0, -1));
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
        console.log(xPrecision);
    } 

    if(ySplit[1] !== undefined) {
        yPrecision = ySplit[1].toString().length;
        console.log(yPrecision);
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
            setDisplayTextContent(result);
        }
    } else if(op === "x") {
        result = multiply(x, y);
    }

    console.log(result);
    result = result.toFixed(calculatePrecision(x, y));
    console.log(result);

    if(resultLengthEqualsNumber(7)) {
        setDisplayFontSize("82px");
    } else if(resultLengthEqualsNumber(8)) {
        setDisplayFontSize("72px");
    } else if(resultLengthEqualsNumber(9)) {
        setDisplayFontSize("65px");
    }

    if(result.length > 9) {
        let sciNotation = parseFloat(result).toExponential(5).replace("+", "")
        sciNotation = parseFloat(sciNotation).toExponential().replace("+", "");
        setDisplayTextContent(sciNotation);
        setDisplayFontSize("74px");
    } else if(result.length >= 12) {
        inputDisplay.textContent = "Overflow";
    } else {
        inputDisplay.textContent = result;
    }

    console.log(result);
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

function logInputs() {
    console.log("first operand: " + firstOperand);
    console.log("first operator: " + firstOperator);
    console.log("second operand: "  + secondOperand);
    console.log("second operator: "  + secondOperator)
}

function displayLengthEqualsNumber(num) {
    if(inputDisplay.textContent.length === num) {
        return true;
    } 
    
    return false;
}   

function resultLengthEqualsNumber(num) {
    if(result.length === num) {
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
    inputDisplay.textContent = str;
}

function appendToDisplayTextContent(str) {
    inputDisplay.textContent += str;
}

function handleKeyPress() {

}

showTime();
setInterval(showTime, 1000);