// get the DOM elements
const NUMBERS_CONTAINERS_DIV = document.querySelector(".numbers_container") as HTMLButtonElement;
const OPERATORS_CONTAINERS_DIV = document.querySelector(".operators_container") as HTMLButtonElement;

// create the global variables
const DARKER_BLUE = "rgb(0, 0, 136)";
const BRIGHTER_BLUE = "rgb(63, 63, 255)";
const DARKER_RED = "rgb(136, 0, 0)";
const BRIGHTER_RED = "rgb(255, 63, 63)";

document.addEventListener("mouseup", () => buttonMouseUp());
let CURRENT_PRESSED_BUTTON: any = undefined;

// make the buttons of the calculator
function addButton(buttonString: string, isNumberButton: boolean) {
    const newButton = document.createElement("div");
    newButton.innerText = buttonString;
    
    if(isNumberButton){
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

for(let i=1; i <= 10; i++) {
    addButton( String(i % 10), true );
}

for(let op of ['+', '-', '*', '/', '=']) {
    addButton(op, false);
}

function darkenButton(event: Event) {
    const button = event.target as HTMLButtonElement;

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

function brightenButton(event: Event) {
    const button = event.target as HTMLButtonElement;

    if (button.className === "number_button"){
        button["style"]["background-color"] = BRIGHTER_BLUE;
    }
    else {
        button["style"]["background-color"] = BRIGHTER_RED;
    }
}

function buttonMouseDown(event: Event) {
    const button = event.target as HTMLButtonElement;

    CURRENT_PRESSED_BUTTON = button;
    
    brightenButton(event);
}

function buttonMouseUp() {
    if (CURRENT_PRESSED_BUTTON)
        turnBackColor(CURRENT_PRESSED_BUTTON);
}

// make the event Listeners
