import { Calculator } from "./scripts/Calculator.js";
//Enables keyboard to be used with the calculator
document.addEventListener('keydown', (e) => {
    if (document.getElementsByClassName(`${e.key}`).length != 0) {
        document.getElementsByClassName(`${e.key}`)[0].click();
    }
    if (e.key == "Enter") {
        document.getElementsByClassName('=')[0].click();
    }
    if (e.key == "*") {
        document.getElementsByClassName('x')[0].click();
    }
     if (e.key == "Backspace" || e.key == "Delete") {
        document.getElementsByClassName('d')[0].click();
    }
})

let resultWindow = document.querySelector(".calc-output");
let calculator = new Calculator(resultWindow);
//use the class names of the buttons as input
Array.from(document.querySelector(".calc-inputs").children).forEach(element => {
    element.addEventListener('click', (e) => {
        let token = e.target.className;
        calculator.calc(token);
    })
});
