export class Calculator {
    buffer = '';
    numArray = [];
    operatorArray = [];
    resultWindow;
    multiDivideCount = 0;
    lastCharWasOperator = false;
    constructor(resultWindow) {
        this.resultWindow = resultWindow;
    }

    calc(char) {
        const bufferIsEmpty = this.buffer == "";
        const resetSelected = char == "r";
        const deleteSelected = char == "d";
        const operatorIsMultiplicationOrDivision = char == "/" || char == "x";
        const operatorIsAdditionOrSubtraction = char == "+" || char == "-";
        if (this.isNum(char)) {
            this.outputNumbers(char);
            this.setBuffer(char);
        } else {
            if (bufferIsEmpty) {
                return;
            }
            if (resetSelected) {
                this.reset();
                return;
            }
            if (deleteSelected) {
                this.removeLastChar();
                return;
            }
            this.lastCharWasOperator = true;
            this.lastOperatorWasEqual = false;
            if (operatorIsMultiplicationOrDivision) {
                this.addMultiplicationOrDivisionToBuffer(char);
            }
            if (operatorIsAdditionOrSubtraction) {
                this.addAdditionOrSubtractionToBuffer(char)
            }

            this.addOperatorToOutput(char);
            if (char == "=") {
                this.resultWindow.innerText += ` ${char} `;
                this.numArray.push(this.buffer);
                this.getResult()
            }
        }
    }
    reset() {
        this.buffer = '';
        this.numArray = [];
        this.operatorArray = [];
        this.multiDivideCount = 0;
        this.lastCharWasOperator = false;
        this.resultWindow.innerText = "";
    }
    addMultiplicationOrDivisionToBuffer(char) {
        this.multiDivideCount++;
        this.addAdditionOrSubtractionToBuffer(char);
    }
    addAdditionOrSubtractionToBuffer(char) {
        this.numArray.push(Number(this.buffer));
        this.buffer = "";
        this.operatorArray.push(char);
    }
    setBuffer(char) {
        this.buffer += char;
    }
    outputNumbers(char) {
        if (this.lastCharWasOperator) {
            this.lastCharWasOperator = false;
            this.resultWindow.innerText += `${this.buffer} ${char} `;
        } else {
            this.resultWindow.innerText += char;
        }
    }
    addOperatorToOutput(char) {
        this.resultWindow.innerText += ` ${char} `;
    }
    removeLastChar() {
        this.buffer = this.buffer.slice(0, this.buffer.length - 1)
        this.resultWindow.innerText = this.resultWindow.innerText.slice(0, this.resultWindow.innerText.length - 1);
        return;
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
        result = this.handleAdditionSub(result);
        this.lastCharWasOperator = false;
        this.operatorArray = [];
        this.numArray = [];
        this.resultWindow.innerText = result;
        this.buffer = result;
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
    handleAdditionSub(num) {
        for (let index = 0; index < this.operatorArray.length; index++) {
            const operator = this.operatorArray[index];
            if (operator == "+") {
                num += Number(this.numArray.shift());
            }
            if (operator == "-") {
                num -= Number(this.numArray.shift());
            }
        }
        return num;
    }
}