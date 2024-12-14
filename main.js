let resultWindow = document.querySelector(".calc-output");

document.addEventListener('keydown',(e)=>{
    if(document.getElementsByClassName(`${e.key}`).length!=0){
        document.getElementsByClassName(`${e.key}`)[0].click();
    }
    if(e.key=="Enter"){
        document.getElementsByClassName('=')[0].click();
    }
    if(e.key=="*"){
        document.getElementsByClassName('x')[0].click();
    }
})
class Calc {
    buffer = '';
    numArray = [];
    operatorArray = [];
    resultWindow;
    multiDivideCount = 0;
    equalsIsLocked = true;
    lastCharWasOperator = false;
    resultIsDisplayed = false;
    constructor(resultWindow) {
        this.resultWindow = resultWindow;
    }

    reset() {
        this.buffer = '';
        this.numArray = [];
        this.operatorArray = [];
        this.multiDivideCount = 0;
        this.equalsIsLocked = true;
        this.lastCharWasOperator = false;
        this.resultWindow.innerText = "";
        this.resultIsDisplayed = false;

    }
    addMultiplicationOrDivisionToBuffer(char) {
        this.multiDivideCount++;
        this.addAdditionOrSubtractionToBuffer(char);
    }
    addAdditionOrSubtractionToBuffer(char) {
        this.numArray.push(this.buffer);
        this.buffer = "";
        this.operatorArray.push(char);
    }
    setBuffer(char){
        if(this.buffer.length>3){
            this.buffer+=`,${char}`;
        }else{
            this.buffer+=char;
        }
    }
    calc(char) {
        if (this.resultIsDisplayed) {
            this.reset();
        }
        if (this.isNum(char)) {
            if (this.lastCharWasOperator) {
                this.lastCharWasOperator = false;
                this.resultWindow.innerText += `${this.buffer} ${char} `;
            } else {
                if(this.resultWindow.innerText.split(" ").pop().length%2==2){
                this.resultWindow.innerText += `,${char}`;
                    
                }else{
                    this.resultWindow.innerText += char;
                }
            }
            this.setBuffer(char);
        } else {
            if (this.buffer == "") {
                return;
            }
            if (char == "r") {
                this.reset();
                return;
            }
            if (char == "d") {
                this.buffer = this.buffer.slice(0, this.buffer.length - 1)
                this.resultWindow.innerText = this.resultWindow.innerText.slice(0, this.resultWindow.innerText.length - 1);
                return;
            }
            this.lastCharWasOperator = true;
            if (char == "/" || char == "x") {
                this.addMultiplicationOrDivisionToBuffer(char);
            }
            if (char == "+" || char == "-") {
                this.addAdditionOrSubtractionToBuffer(char)
            }

            this.resultWindow.innerText += ` ${char} `;
            if (char == "=") {
                this.resultWindow.innerText += ` ${char} `;
                this.numArray.push(this.buffer);
                if (this.numArray.length - 1 == this.operatorArray.length) {
                    this.equalsIsLocked == false;
                }
                this.equalsIsLocked == true;
                this.getResult()
            }
        }
    }
    print() {
        let result = "";
        for (let index = 0; index < this.numArray.length; index++) {
            const element = this.numArray[index];
            result += element;
            if (this.operatorArray[index]) {
                result += " " + this.operatorArray[index] + " ";
            }
        }
        this.resultWindow.innerText = result;
    }
    isNum(char) {
        return char.match(/[\d]/);
    }
    getResult() {
        if (this.numArray.length == 0) {
            this.operatorArray = [];
            return;
        }
        if (this.multiDivideCount != 0) {
            this.handleMultiDiv();
        }
        let result = Number(this.numArray.shift());
        for (let index = 0; index < this.operatorArray.length; index++) {
            const operator = this.operatorArray[index];
            if (operator == "+") {
                result += Number(this.numArray.shift());
            }
            if (operator == "-") {
                result -= Number(this.numArray.shift());
            }
        }

        this.numArray.push(result);
        this.resultWindow.innerText = result;
        this.resultIsDisplayed = true;
    }
    handleMultiDiv() {
        let newNumArray = [];
        let newOperatorArray = [];
        for (let index = 0; index < this.operatorArray.length; index++) {
            if (this.numArray == []) {
                return;
            }
            const operator = this.operatorArray[index];

            if (operator == "/") {
                const div = this.numArray.shift() / this.numArray.shift();
                this.numArray.unshift(div);
                this.multiDivideCount--;
            }
            if (operator == "x") {
                const multi = this.numArray.shift() * this.numArray.shift();
                this.numArray.unshift(multi);
                this.multiDivideCount--;
            }
            if (operator != "/" && operator != "x") {
                newOperatorArray.push(operator);
                newNumArray.push(this.numArray.shift());
            }
        }
        for (let index = newNumArray.length - 1; index >= 0; index--) {
            const element = newNumArray[index];
            this.numArray.unshift(element);
        }
        this.operatorArray = [];
        newOperatorArray.forEach(x => this.operatorArray.push(x));
    }
}
let calc = new Calc(resultWindow);
let numArray = [];
let buffer = "";
Array.from(document.querySelector(".calc-inputs").children).forEach(element => {
    element.addEventListener('click', (e) => {
        let token = e.target.className;
        calc.calc(token);
    })
});
