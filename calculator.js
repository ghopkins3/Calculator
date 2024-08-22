let x = 0;
let y = 0;
let op = 0;

function add(x, y) {
    return Math.round(x, y);
}

function subtract(x, y) {
    return Math.round(x - y); 
}

function divide(x, y) {
    return Math.round(x / y);
}

function multiply(x, y) { 
    return Math.round(x * y);
}

function operate(x, y, op) {
    if(op === "+") {
        return add(x, y);
    } else if(op === "-") {
        return subtract(x, y);
    } else if(op === "/") {
        return divide(x, y);
    } else if(op === "x") {
        return multiply(x, y);
    }
}