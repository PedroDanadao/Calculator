// get the DOM elements
var NUMBERS_CONTAINERS_DIV = document.querySelector(".numbers_container");
var OPERATORS_CONTAINERS_DIV = document.querySelector(".operators_container");
// create the global variables
var DARKER_BLUE = "rgb(0, 0, 136)";
var BRIGHTER_BLUE = "rgb(63, 63, 255)";
var DARKER_RED = "rgb(136, 0, 0)";
var BRIGHTER_RED = "rgb(255, 63, 63)";
document.addEventListener("mouseup", function () { return buttonMouseUp(); });
var CURRENT_PRESSED_BUTTON = undefined;
// make the buttons of the calculator
function addButton(buttonString, isNumberButton) {
    var newButton = document.createElement("div");
    newButton.innerText = buttonString;
    if (isNumberButton) {
        newButton.className = "number_button";
        NUMBERS_CONTAINERS_DIV.appendChild(newButton);
    }
    else {
        newButton.className = "operator_button";
        OPERATORS_CONTAINERS_DIV.appendChild(newButton);
    }
    newButton.addEventListener("mouseover", darkenButton);
    newButton.addEventListener("mouseleave", turnBackColorEvent);
    newButton.addEventListener("mousedown", buttonMouseDown);
}
for (var i = 1; i <= 10; i++) {
    addButton(String(i % 10), true);
}
for (var _i = 0, _a = ['+', '-', '*', '/', '=']; _i < _a.length; _i++) {
    var op = _a[_i];
    addButton(op, false);
}
function darkenButton(event) {
    var button = event.target;
    if (button.className === "number_button") {
        button["style"]["background-color"] = DARKER_BLUE;
    }
    else {
        button["style"]["background-color"] = DARKER_RED;
    }
}
function turnBackColorEvent(event) {
    var button = event.target;
    turnBackColor(button);
}
function turnBackColor(button) {
    if (button.className === "number_button") {
        button["style"]["background-color"] = "blue";
    }
    else if (button.className === "operator_button") {
        button["style"]["background-color"] = "red";
    }
}
function brightenButton(event) {
    var button = event.target;
    if (button.className === "number_button") {
        button["style"]["background-color"] = BRIGHTER_BLUE;
    }
    else {
        button["style"]["background-color"] = BRIGHTER_RED;
    }
}
function buttonMouseDown(event) {
    var button = event.target;
    CURRENT_PRESSED_BUTTON = button;
    brightenButton(event);
}
function buttonMouseUp() {
    if (CURRENT_PRESSED_BUTTON)
        turnBackColor(CURRENT_PRESSED_BUTTON);
}
// make the event Listeners
