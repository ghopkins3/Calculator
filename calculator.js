
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
                if(event.target.textContent === ".") {
                    appendToDisplayTextContent(event.target.textContent);
                } else if(inputDisplay.textContent === "-0") {
                    setDisplayTextContent("-" + event.target.textContent);
                } else {
                    setDisplayTextContent(event.target.textContent);
                }
            } else if(!inputDisplay.textContent.includes(".") && displayLengthGreaterThanOrEqualsNumber(9)) {
                return;
            } else if(inputDisplay.textContent.includes(".")) {
                if(inputDisplay.textContent.includes("-") && displayLengthGreaterThanOrEqualsNumber(11)) {
                    return;
                } else if(!inputDisplay.textContent.includes("-") && displayLengthGreaterThanOrEqualsNumber(10)) {
                    return;
                } else if(event.target.textContent === ".") {
                    return;
                } else {
                    appendToDisplayTextContent(event.target.textContent);
                }
            } else if(inputDisplay.textContent === "nice try!" || inputDisplay.textContent === "Infinity" 
                    || inputDisplay.textContent === "Overflow") {
                return;
            } else if(parseFloat(inputDisplay.textContent) > 999_999_999) {
                return;
            } else {
                appendToDisplayTextContent(event.target.textContent);
            }

            setSecondOperator(firstOperator);

            if(selectedButton) {
                setDisplayFontSize("95px");
                disableButtonStyle();
                setSelectedButtonNull();
            }
            
            if(!inputDisplay.textContent.includes(".")) {
                if(displayLengthEqualsNumber(7)) {
                    setDisplayFontSize("78px");
                } else if(displayLengthEqualsNumber(8)) {
                    setDisplayFontSize("69px");
                } else if(displayLengthEqualsNumber(9)) {
                    setDisplayFontSize("62px");
                }
            } else if(inputDisplay.textContent.includes(".")) {
                if(displayLengthEqualsNumber(8)) {
                    setDisplayFontSize("78px");
                } else if(displayLengthEqualsNumber(9)) {
                    setDisplayFontSize("72px");
                } else if(displayLengthEqualsNumber(10)) {
                    setDisplayFontSize("62px");
                } else if(displayLengthEqualsNumber(11)) {
                    setDisplayFontSize("60px");
                }
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

    if(selectedButton) {
        inputDisplay.textContent = "-0";
    } else {
        negateNumber(inputDisplay.textContent);
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
    } else if(inputDisplay.textContent === "-0") {
        setDisplayTextContent("0");
    } else if(inputDisplay.textContent.length === 2 && inputDisplay.textContent.includes("-")) {
        setDisplayTextContent(inputDisplay.textContent.slice(1));
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
    } else {
        result = parseFloat(inputDisplay.textContent.replace(/,/g, ""));
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

    num = parseFloat(num.replace(/,/g, ""));
    if(!isNaN(num)) {
        num = num - (num * 2);
    }

    inputDisplay.textContent = formatter.format(num);

    if(!inputDisplay.textContent.includes(".")) {
        if(displayLengthEqualsNumber(7)) {
            setDisplayFontSize("82px");
        } else if(displayLengthEqualsNumber(8)) {
            setDisplayFontSize("69px");
        } else if(displayLengthEqualsNumber(9)) {
            console.log("HERE");
            setDisplayFontSize("62px");
        } else if(displayLengthEqualsNumber(10)) {
            setDisplayFontSize("56px");
        }
    } else if(inputDisplay.textContent.includes(".")) {
        if(displayLengthEqualsNumber(7)) {
            setDisplayFontSize("95px");
        } else if(displayLengthEqualsNumber(8)) {
            setDisplayFontSize("85px");
        } else if(displayLengthEqualsNumber(9)) {
            setDisplayFontSize("75px");
        } else if(displayLengthEqualsNumber(10)) {
            setDisplayFontSize("67px");
        } else if(displayLengthEqualsNumber(11)) {
            setDisplayFontSize("58px");
        }
    }
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
    if(inputDisplay.textContent.replace(/,/g, "").length === num) {
        return true;
    } 
    
    return false;
}   

function displayLengthGreaterThanOrEqualsNumber(num) {
    if(inputDisplay.textContent.replace(/,/g, "").length >= num) {
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

function clickNonOperator(str) {
    document.getElementById(str).click();
}

function clickOperator(str) {
    firstOperator = document.getElementById(str).textContent;
    document.getElementById(str).click();
}

function setDisplayTextContent(str) {
    let num = parseFloat(String(str).replace(/,/g, '')); 
    let parts = num.toString().split(".");
    let integerPart = parts[0];
    
    if (!isNaN(num)) {
        if(num > 999_999_999 || num < -999_999_999) {
            let expo = parseFloat(num).toExponential(5).replace("+", "");
            expo = parseFloat(expo).toExponential().replace("+", "");
            inputDisplay.textContent = expo;
        } else if(num.toString().length > 9 && num.toString().length <= 11 && num.toString().includes(".") 
                    && num < 999_999_999 && num > -999_999_999) {
            inputDisplay.textContent = formatter.format(parseFloat(num).toFixed(9 - integerPart.length));
        } else {
            inputDisplay.textContent = formatter.format(num);
        }
    } else {
        inputDisplay.textContent = str; 
    }

    if(!inputDisplay.textContent.includes(".")) {
        if(displayLengthEqualsNumber(7)) {
            setDisplayFontSize("78px");
        } else if(displayLengthEqualsNumber(8)) {
            setDisplayFontSize("69px");
        } else if(displayLengthEqualsNumber(9)) {
            setDisplayFontSize("62px");
        } else if(displayLengthEqualsNumber(10)) {
            setDisplayFontSize("56px");
        }
    } else if(inputDisplay.textContent.includes(".")) {
        if(displayLengthEqualsNumber(8)) {
            setDisplayFontSize("82px");
        } else if(displayLengthEqualsNumber(9)) {
            setDisplayFontSize("72px");
        } else if(displayLengthEqualsNumber(10)) {
            setDisplayFontSize("66px");
        } else if(displayLengthEqualsNumber(11)) {
            setDisplayFontSize("60px");
        } else if(displayLengthGreaterThanOrEqualsNumber(12)) {
            setDisplayFontSize("53px");
        }
    }
}

function appendToDisplayTextContent(str) {
    let currentText = String(inputDisplay.textContent).replace(/,/g, ''); 
    let newText = currentText + String(str);
    let num = parseFloat(newText);

    if (!isNaN(num)) {
        if (newText.includes(".")) {
            let parts = newText.split(".");
            let integerPart = parts[0];
            let decimalPart;

            if (parts.length > 1) {
                decimalPart = "." + parts[1];
            } else {
                decimalPart = ".";
            }

            inputDisplay.textContent = formatter.format(parseFloat(integerPart)) + decimalPart;
        } else {
            inputDisplay.textContent = formatter.format(num);
        }
    } else {
        inputDisplay.textContent = newText;
    }
}

function handleKeyPress(event) {
    if((event.key >= 0 && event.key <= 9 || event.key === ".")) {
        clickNonOperator(event.key);
    } else if(event.key === "+") {
        clickOperator("add");
    } else if(event.key === "-") {
        clickOperator("subtract");
    } else if(event.key === "*") {
        clickOperator("multiply");
    } else if(event.key === "/") {
        clickOperator("divide");
    } else if(event.key === "Enter") {
        clickNonOperator("equals");
    } else if(event.key === "Escape") {
        clickNonOperator("clear");
    } else if(event.key === "Backspace") {
        clickNonOperator("backspace");
    } else if(event.key === "n") {
        clickNonOperator("sign").click();
    }
}

showTime();
setInterval(showTime, 1000);