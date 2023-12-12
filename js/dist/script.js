// get the DOM elements
var DISPLAY_DIV = document.querySelector(".display");
var NUMBERS_CONTAINERS_DIV = document.querySelector(".numbers_container");
var OPERATORS_CONTAINERS_DIV = document.querySelector(".operators_container");
// create the global variables
var DARKER_BLUE = "rgb(0, 0, 136)";
var BRIGHTER_BLUE = "rgb(63, 63, 255)";
var DARKER_RED = "rgb(136, 0, 0)";
var BRIGHTER_RED = "rgb(255, 63, 63)";
var TEST_BUTTON = undefined;
document.addEventListener("mouseup", function () { return buttonMouseUp(); });
var CURRENT_PRESSED_BUTTON = undefined;
var OPERATION_STRING = '';
var OPERATORS_LIST = ['+', '-', '*', '/', '='];
var MULTIPLY_DIVIDE = ['*', '/'];
var OPERATORS_TO_FUNCTIONS = {
    '+': function (a, b) { return a + b; },
    '-': function (a, b) { return a - b; },
    '*': function (a, b) { return a * b; },
    '/': function (a, b) { return a / b; }
};
var ARROW_CHAR = "\u2190";
document.addEventListener("keyup", keyboardPressed);
var ALL_KEYS = "1234567890+-*/=Cc.,";
var CHAR_TO_BUTTON = {};
// make the buttons of the calculator
function addButton(buttonString, isNumberButton) {
    var newButton = document.createElement("button");
    newButton.innerText = buttonString;
    if (isNumberButton) {
        newButton.className = "number_button";
        NUMBERS_CONTAINERS_DIV.appendChild(newButton);
    }
    else {
        newButton.className = "operator_button";
        OPERATORS_CONTAINERS_DIV.appendChild(newButton);
    }
    newButton.addEventListener("mouseover", darkenButtonEvent);
    newButton.addEventListener("mouseleave", turnBackColorEvent);
    newButton.addEventListener("mousedown", buttonMouseDownEvent);
    newButton.addEventListener("mouseup", buttonChosenEvent);
    TEST_BUTTON = newButton;
    CHAR_TO_BUTTON[buttonString] = newButton;
}
for (var i = 1; i <= 10; i++) {
    addButton(String(i % 10), true);
}
for (var _i = 0, OPERATORS_LIST_1 = OPERATORS_LIST; _i < OPERATORS_LIST_1.length; _i++) {
    var op = OPERATORS_LIST_1[_i];
    addButton(op, false);
}
addButton('C', false);
addButton('.', true);
addButton(ARROW_CHAR, false);
function darkenButtonEvent(event) {
    var button = event.target;
    darkenButton(button);
}
function darkenButton(button) {
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
function brightenButtonEvent(event) {
    var button = event.target;
    brightenButton(button);
}
function brightenButton(button) {
    if (button.className === "number_button") {
        button["style"]["background-color"] = BRIGHTER_BLUE;
    }
    else {
        button["style"]["background-color"] = BRIGHTER_RED;
    }
}
function buttonMouseDownEvent(event) {
    var button = event.target;
    CURRENT_PRESSED_BUTTON = button;
    brightenButton(button);
}
function buttonMouseUp() {
    if (CURRENT_PRESSED_BUTTON)
        turnBackColor(CURRENT_PRESSED_BUTTON);
}
function buttonChosenEvent(event) {
    var mouseUpButton = event.target;
    if (mouseUpButton === CURRENT_PRESSED_BUTTON) {
        changeDisplay(mouseUpButton.innerText);
    }
}
function changeDisplay(newChar) {
    /**
     * changes the display based on the passed char
     */
    if (DISPLAY_DIV.innerText === "ERROR") {
        DISPLAY_DIV.innerText = '';
    }
    if (newChar === '=') {
        return calculateExpression();
    }
    if (newChar === 'C' || newChar === 'c') {
        return DISPLAY_DIV.innerText = '';
    }
    if (newChar === '.' || newChar === ',') {
        return addDot();
    }
    if (newChar === ARROW_CHAR) {
        return eraseChar();
    }
    var lastDisplayChar = DISPLAY_DIV.innerText.slice(-1);
    // deal with the cases where the user inputs a operator and the display ends 
    // with an operator or the display is empty(nothing must be added to the 
    // display)
    var emptyOrOperator = OPERATORS_LIST.includes(lastDisplayChar) || !DISPLAY_DIV.innerText;
    if (OPERATORS_LIST.includes(newChar) && emptyOrOperator) {
        return;
    }
    // if the last character in the display is an operator or the current 
    // pressed button is an operator, then add a space to the newChar string
    if (OPERATORS_LIST.includes(lastDisplayChar)) {
        newChar = " " + newChar;
    }
    if (OPERATORS_LIST.includes(newChar)) {
        newChar = " " + newChar;
    }
    DISPLAY_DIV.innerText += newChar;
}
function calculateExpression() {
    // check first if there is a division by 0 in the expression. If there is 
    // then the display is changed to ERROR
    if (DISPLAY_DIV.innerText.includes("/ 0")) {
        DISPLAY_DIV.innerText = "ERROR";
    }
    var operandsAndOperatorsStrings = DISPLAY_DIV.innerText.split(' ');
    var operandsAndOperators = operandsAndOperatorsStrings.map(checkOperationString);
    if (operandsAndOperators.length < 3)
        return;
    var addToResult = '';
    var lastItem = operandsAndOperators[operandsAndOperators.length - 1];
    if (OPERATORS_LIST.includes(lastItem)) {
        addToResult = " " + lastItem;
        operandsAndOperators.pop();
    }
    var result = calculateRecursive(operandsAndOperators[0], operandsAndOperators[1], operandsAndOperators.slice(2));
    result = Math.round(result * 100000) / 100000;
    DISPLAY_DIV.innerText = "" + result + addToResult;
}
function calculateRecursive(num, operator, restOfExpression) {
    var operationFunction = OPERATORS_TO_FUNCTIONS[operator];
    if (restOfExpression.length === 1) {
        return operationFunction(num, restOfExpression[0]);
    }
    if (!MULTIPLY_DIVIDE.includes(operator)) {
        var nextNumber_1 = restOfExpression[0];
        var nextOperator_1 = restOfExpression[1];
        var newRest_1 = restOfExpression.slice(2);
        return operationFunction(num, calculateRecursive(nextNumber_1, nextOperator_1, newRest_1));
    }
    var nextNumber = operationFunction(num, restOfExpression[0]);
    var nextOperator = restOfExpression[1];
    var newRest = restOfExpression.slice(2);
    return calculateRecursive(nextNumber, nextOperator, newRest);
}
function checkOperationString(opString) {
    return OPERATORS_LIST.includes(opString) ? opString : Number(opString);
}
function addDot() {
    /**
     * Adds a dot to the display if the conditions allow it
     */
    var displayItems = DISPLAY_DIV.innerText.split(' ');
    if (displayItems[0] === '') {
        return;
    }
    var lastItem = displayItems[displayItems.length - 1];
    if (OPERATORS_LIST.includes(lastItem) || lastItem.includes('.')) {
        return;
    }
    DISPLAY_DIV.innerText += '.';
}
function eraseChar() {
    /**
     * erases the last char from the display
     */
    var displayText = DISPLAY_DIV.innerText;
    if (!displayText)
        return;
    DISPLAY_DIV.innerText = displayText.slice(0, displayText.length - 1);
}
function keyboardPressed(event) {
    var pressedKey = event.key;
    if (ALL_KEYS.includes(pressedKey)) {
        playPressedAnimation(pressedKey);
        changeDisplay(pressedKey);
    }
    if (pressedKey === "Backspace") {
        playPressedAnimation(ARROW_CHAR);
        changeDisplay(ARROW_CHAR);
    }
}
function playPressedAnimation(pressedKey) {
    var keyButton = CHAR_TO_BUTTON[pressedKey.toUpperCase()];
    brightenButton(keyButton);
    setTimeout(function () { return turnBackColor(keyButton); }, 100);
}
