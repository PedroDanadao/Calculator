// get the DOM elements
const numbersContainersDiv = document.querySelector(".numbers_container") as HTMLDivElement;
const operatorsContainerDiv = document.querySelector(".operators_container") as HTMLDivElement;

// make the buttons of the calculator
function addButton(buttonString: string, isNumberButton: boolean) {
    const newButton = document.createElement("div");
    newButton.innerText = buttonString;
    
    if(isNumberButton){
        newButton.className = "number_button";
        numbersContainersDiv.appendChild(newButton);
    }
    else {
        newButton.className = "operator_button";
        operatorsContainerDiv.appendChild(newButton);
    }
}

for(let i=1; i <= 10; i++) {
    addButton( String(i % 10), true );
}

for(let op of ['+', '-', '*', '/', '=']) {
    addButton(op, false);
}

// make the event Listeners
