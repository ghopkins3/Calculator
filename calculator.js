
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

function showTime() {
    const dateDisplay = document.querySelector("#time");

    let time = new Date();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let meridiem = "am";

    if(hour >= 12) {
        if(hour > 12) hour -= 12;
        meridiem = "pm";
    } else if(hour == 0) {
        hour = 12;
        meridiem = "am";
    }

    let currentTime = hour + ":" + minute + " " + meridiem;
    dateDisplay.textContent = currentTime;
}

showTime();
setInterval(showTime, 1000);