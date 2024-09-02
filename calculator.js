
const inputDisplay = document.querySelector("#io")
const clearBtn = document.querySelector("#clear");
const signBtn = document.querySelector("#sign");
const numBtns = document.querySelectorAll(".numbers");
const backspaceBtn = document.querySelector("#backspace");
const operatorBtns = document.querySelectorAll(".operators");
const equalsBtn = document.querySelector("#equals");
const numpad = document.querySelector(".inputs");
let inputs = [];

document.addEventListener("keydown", () => {
    handleKeyPress(event);
});


let selectedButton = null;
operatorBtns.forEach((button) => {
    button.addEventListener("click", () => {
        if(event.target.classList.contains("operator")) {
            if(inputs.length !== 1) {
                inputs.push(parseFloat(inputDisplay.textContent));
            }
            if(selectedButton) {
                selectedButton.style.backgroundColor = "orange";
                selectedButton.style.color = "white";
            }

            selectedButton = event.target;
            selectedButton.style.backgroundColor = "white";
            selectedButton.style.color = "orange";
        }
    });
});

equalsBtn.addEventListener("mousedown", () => {
    inputs.push(buttonToPush.textContent);
    inputs.push(parseFloat(inputDisplay.textContent));
    console.log(inputs);
    operate(inputs[0], inputs[1], inputs[2]);
    console.log(inputs);
    clearCache();
    console.log(inputs);
    inputs.push(parseFloat(result));
    console.log(inputs);
    
});

let buttonToPush = null;
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

            if(selectedButton) {
                buttonToPush = selectedButton;
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
    inputs = [];
    
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

function clearCache() {
    inputs = [];
}

// TODO 
// Add keyboard functionality

/*
function handleKeyPress(event) {
    let inputs = inputDisplay.textContent.split(" ");
    if((event.key >= 0 && event.key <= 9) || event.key === ".") {
        if(inputDisplay.textContent === "0" || inputDisplay.textContent === "nice try!" || inputDisplay.textContent === "Overflow") {
            inputDisplay.textContent = event.key;
        } else if(inputDisplay.textContent.length >= 12) {
            return;
        } else {
            inputDisplay.textContent += event.key;
        }
    } else if(event.key === "+" || event.key === "-" || event.key === "/" || event.key === "*") {
        if(inputs.length === 3) {
            getInputs();
            operate(x, op, y);
            inputDisplay.textContent = inputDisplay.textContent + " " + event.key + " ";
        }
        if(event.key === "/") {
            if(inputs.length === 3) {
                getInputs();
                operate(x, op, y);
            }
            inputDisplay.textContent = inputDisplay.textContent + " " + "÷" + " ";
        } else if(event.key === "*") {
            if(inputs.length === 3) {
                getInputs();
                operate(x, op, y);
            }
            inputDisplay.textContent = inputDisplay.textContent + " " + "x" + " ";
        } else if(inputs.length == 3) {
            return;
        } else {
            inputDisplay.textContent = inputDisplay.textContent + " " + event.key + " ";
        }

    } else if(event.key === "Enter") {
        getInputs();
        operate(x, op, y);

    } else if(event.key === "Escape") {
        inputDisplay.textContent = "0";
    }

}
*/

showTime();
setInterval(showTime, 1000);