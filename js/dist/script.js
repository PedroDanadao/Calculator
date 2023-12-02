// get the DOM elements
var numbersContainersDiv = document.querySelector(".numbers_container");
var operatorsContainerDiv = document.querySelector(".operators_container");
// make the buttons of the calculator
function addButton(buttonString, isNumberButton) {
    var newButton = document.createElement("div");
    newButton.innerText = buttonString;
    if (isNumberButton) {
        newButton.className = "number_button";
        numbersContainersDiv.appendChild(newButton);
    }
    else {
        newButton.className = "operator_button";
        operatorsContainerDiv.appendChild(newButton);
    }
    newButton.addEventListener("click", function () { return console.log("pressed"); });
}
for (var i = 1; i <= 10; i++) {
    addButton(String(i % 10), true);
}
for (var _i = 0, _a = ['+', '-', '*', '/', '=']; _i < _a.length; _i++) {
    var op = _a[_i];
    addButton(op, false);
}
// make the event Listeners
