// get the DOM elements
const DISPLAY_DIV = document.querySelector(".display") as HTMLDivElement;
const NUMBERS_CONTAINERS_DIV = document.querySelector(".numbers_container") as HTMLButtonElement;
const OPERATORS_CONTAINERS_DIV = document.querySelector(".operators_container") as HTMLButtonElement;

// create the global variables
const DARKER_BLUE = "rgb(0, 0, 136)";
const BRIGHTER_BLUE = "rgb(63, 63, 255)";
const DARKER_RED = "rgb(136, 0, 0)";
const BRIGHTER_RED = "rgb(255, 63, 63)";

let TEST_BUTTON: HTMLButtonElement = undefined;

document.addEventListener("mouseup", () => buttonMouseUp());
let CURRENT_PRESSED_BUTTON: any = undefined;

let OPERATION_STRING = '';

const OPERATORS_LIST = ['+', '-', '*', '/', '='];
const MULTIPLY_DIVIDE = ['*', '/'];

const OPERATORS_TO_FUNCTIONS = {
    '+': (a: number, b: number) => a + b,
    '-': (a: number, b: number) => a - b,
    '*': (a: number, b: number) => a * b,
    '/': (a: number, b: number) => a / b
}

const ARROW_CHAR = "\u2190";

document.addEventListener("keyup", keyboardPressed);
const ALL_KEYS = "1234567890+-*/=Cc.,"


const CHAR_TO_BUTTON = {}

// make the buttons of the calculator
function addButton(buttonString: string, isNumberButton: boolean) {
    const newButton = document.createElement("button");
    newButton.innerText = buttonString;
    
    if(isNumberButton){
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

for(let i=1; i <= 10; i++) {
    addButton( String(i % 10), true );
}

for(let op of OPERATORS_LIST) {
    addButton(op, false);
}

addButton('C', false);

addButton('.', true);

addButton(ARROW_CHAR, false);

function darkenButtonEvent(event: Event) {
    const button = event.target as HTMLButtonElement;

    darkenButton(button);
}

function darkenButton(button: HTMLButtonElement) {
    if (button.className === "number_button"){
        button["style"]["background-color"] = DARKER_BLUE;
    }
    else {
        button["style"]["background-color"] = DARKER_RED;
    }
}

function turnBackColorEvent(event: Event) {
    const button = event.target as HTMLButtonElement;

    turnBackColor(button);
}

function turnBackColor(button: HTMLButtonElement) {
    if (button.className === "number_button"){
        button["style"]["background-color"] = "blue";
    }
    else if (button.className === "operator_button"){
        button["style"]["background-color"] = "red";
    }
}

function brightenButtonEvent(event: Event) {
    const button = event.target as HTMLButtonElement;

    brightenButton(button);
}

function brightenButton(button: HTMLButtonElement) {
    if (button.className === "number_button"){
        button["style"]["background-color"] = BRIGHTER_BLUE;
    }
    else {
        button["style"]["background-color"] = BRIGHTER_RED;
    }
}

function buttonMouseDownEvent(event: Event) {
    const button = event.target as HTMLButtonElement;

    CURRENT_PRESSED_BUTTON = button;
    
    brightenButton(button);
}

function buttonMouseUp() {
    if (CURRENT_PRESSED_BUTTON)
        turnBackColor(CURRENT_PRESSED_BUTTON);
}

function buttonChosenEvent(event: Event) {
    const mouseUpButton = event.target as HTMLButtonElement;

    if (mouseUpButton === CURRENT_PRESSED_BUTTON) {
        changeDisplay(mouseUpButton.innerText);
    }
}

function changeDisplay(newChar: string) {
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

    const lastDisplayChar = DISPLAY_DIV.innerText.slice(-1);

    // deal with the cases where the user inputs a operator and the display ends 
    // with an operator or the display is empty(nothing must be added to the 
    // display)
    const emptyOrOperator = OPERATORS_LIST.includes(lastDisplayChar) || ! DISPLAY_DIV.innerText;
    if ( OPERATORS_LIST.includes(newChar) && emptyOrOperator ) {
        return;
    }

    // if the last character in the display is an operator or the current 
    // pressed button is an operator, then add a space to the newChar string
    if ( OPERATORS_LIST.includes(lastDisplayChar) ) {
        newChar = ` ${newChar}`;
    }

    if (OPERATORS_LIST.includes(newChar)) {
        newChar = ` ${newChar}`;
    }

    DISPLAY_DIV.innerText += newChar;
}

function calculateExpression() {
    // check first if there is a division by 0 in the expression. If there is 
    // then the display is changed to ERROR

    if (DISPLAY_DIV.innerText.includes("/ 0")) {
        DISPLAY_DIV.innerText = "ERROR";
    }

    const operandsAndOperatorsStrings = DISPLAY_DIV.innerText.split(' ');
    const operandsAndOperators = operandsAndOperatorsStrings.map(checkOperationString);

    if (operandsAndOperators.length < 3) return;

    let addToResult = '';
    let lastItem = operandsAndOperators[operandsAndOperators.length - 1];
    if ( OPERATORS_LIST.includes(lastItem) ) {
        addToResult = ` ${lastItem}`;
        operandsAndOperators.pop();
    }

    let result = calculateRecursive(operandsAndOperators[0], operandsAndOperators[1], operandsAndOperators.slice(2));

    result = Math.round(result * 100000) / 100000;

    DISPLAY_DIV.innerText = `${result}` + addToResult;
}

function calculateRecursive(num: number | string, operator: string | number, restOfExpression: Array<any>) {
    const operationFunction = OPERATORS_TO_FUNCTIONS[operator];

    if (restOfExpression.length === 1) {
        return operationFunction(num, restOfExpression[0]);
    }

    if ( ! MULTIPLY_DIVIDE.includes(operator) ){
        const nextNumber = restOfExpression[0];
        const nextOperator = restOfExpression[1];
        const newRest = restOfExpression.slice(2);
        return operationFunction(num, calculateRecursive(nextNumber, nextOperator, newRest));
    }

    const nextNumber = operationFunction(num, restOfExpression[0]);
    const nextOperator = restOfExpression[1];
    const newRest = restOfExpression.slice(2);
    return calculateRecursive(nextNumber, nextOperator, newRest);
}

function checkOperationString(opString: string) {
    return OPERATORS_LIST.includes(opString) ? opString : Number(opString)
}

function addDot() {
    /**
     * Adds a dot to the display if the conditions allow it
     */
    const displayItems = DISPLAY_DIV.innerText.split(' ');

    if (displayItems[0] === '') {
        return;
    }

    const lastItem = displayItems[displayItems.length - 1];

    if ( OPERATORS_LIST.includes(lastItem) || lastItem.includes('.') ) {
        return;
    }

    DISPLAY_DIV.innerText += '.';
}

function eraseChar() {
    /**
     * erases the last char from the display
     */
    const displayText = DISPLAY_DIV.innerText;

    if (! displayText) return;

    DISPLAY_DIV.innerText = displayText.slice(0, displayText.length - 1);
}

function keyboardPressed(event: KeyboardEvent) {
    const pressedKey = event.key;
    
    if ( ALL_KEYS.includes(pressedKey) ) {
        playPressedAnimation(pressedKey);

        changeDisplay(pressedKey);
    }
    
    if (pressedKey === "Backspace") {
        playPressedAnimation(ARROW_CHAR);

        changeDisplay(ARROW_CHAR);
    }
}

function playPressedAnimation(pressedKey: string) {
    const keyButton = CHAR_TO_BUTTON[pressedKey.toUpperCase()];
    brightenButton(keyButton);
    setTimeout(()=>turnBackColor(keyButton), 100);
}
