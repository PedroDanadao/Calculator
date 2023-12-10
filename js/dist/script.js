// get the DOM elements
var DISPLAY_DIV = document.querySelector(".display");
var NUMBERS_CONTAINERS_DIV = document.querySelector(".numbers_container");
var OPERATORS_CONTAINERS_DIV = document.querySelector(".operators_container");
// create the global variables
var DARKER_BLUE = "rgb(0, 0, 136)";
var BRIGHTER_BLUE = "rgb(63, 63, 255)";
var DARKER_RED = "rgb(136, 0, 0)";
var BRIGHTER_RED = "rgb(255, 63, 63)";
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
    newButton.addEventListener("mouseup", buttonChosen);
}
for (var i = 1; i <= 10; i++) {
    addButton(String(i % 10), true);
}
for (var _i = 0, OPERATORS_LIST_1 = OPERATORS_LIST; _i < OPERATORS_LIST_1.length; _i++) {
    var op = OPERATORS_LIST_1[_i];
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
function buttonChosen(event) {
    var mouseUpButton = event.target;
    if (mouseUpButton === CURRENT_PRESSED_BUTTON) {
        changeDisplay(mouseUpButton.innerText);
    }
}
function changeDisplay(newChar) {
    /**
     * changes the display based on the passed char
     */
    if (newChar === '=') {
        return calculateExpression();
    }
    if (OPERATORS_LIST.includes(DISPLAY_DIV.innerText.slice(-1))) {
        newChar = " " + newChar;
    }
    if (OPERATORS_LIST.includes(newChar)) {
        newChar = " " + newChar;
    }
    DISPLAY_DIV.innerText += newChar;
}
function calculateExpression() {
    var operandsAndOperatorsStrings = DISPLAY_DIV.innerText.split(' ');
    var operandsAndOperators = operandsAndOperatorsStrings.map(checkOperationString);
    var result = calculateRecursive(operandsAndOperators[0], operandsAndOperators[1], operandsAndOperators.slice(2));
    console.log(result);
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
