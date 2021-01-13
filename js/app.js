const numberBtns = document.querySelectorAll('.numbers');
const operatorBtns = document.querySelectorAll('.operators');
const equalsBtn = document.querySelector('.equals');
const deleteBtn = document.querySelector('.del');
const allClearBtn = document.querySelector('.ac');
const display = document.querySelector('.display');


class Calculator {
    constructor(display, numbersStack, operatorsStack, toRender, currentUserInput, operatorsRegExp){
        this.display = display; //determines the location in which values should be rendered
        this.numbersStack = numbersStack; //holds numbers inputted by user
        this.operatorsStack = operatorsStack; //holds operator inputted by user
        this.toRender = toRender; //this instance variable will hold the value of what is to be rendered, then it will be fed to the render() method
        this.currentUserInput = currentUserInput; //this will hold the value of the most recent user input
        this.operatorsRegExp = operatorsRegExp; //regexp to determine if a value is an operator
        this.clearAll(); //make sure all values are cleared upon instantiation
    }
    clearAll(){ //clear display, stacks, and most recent input. Then render blank.
        this.toRender = '', this.currentUserInput = '';
        this.numbersStack = [], this.operatorsStack = [];
        this.render();
    }
    deleteOne = () => { //backspace one character
        this.toRender = this.toRender.slice(0, -1); // remove last character from display
        if (this.operatorsRegExp.test(this.currentUserInput)) this.operatorsStack.pop(); //if last input was operator, then remove from stack
            else { this.currentUserInput = this.currentUserInput.slice(0, -1); } //if last input was a number, delete it
    }
    numbersBtnParser = button => {
        if (button.innerText === '.') return; //doesn't handle decimals yet
        this.currentUserInput += this.formatDisplay(button.innerText); //tokenizer adds to currentUserInput until an operator or equals sign is clicked
        this.toRender = this.currentUserInput; //render user input
        this.render();
    }
    operatorsBtnParser = button => {
        if (!!this.operatorsStack.length) return; //Block multiple operations in one expression
        this.numbersStack.push(parseInt(this.currentUserInput)); //push token to nums stack once an operator has been clicked. Operator being clicked signifies end of number.
        this.currentUserInput = button.innerText; //hold user's input in order to render it
        this.operatorsStack.push(this.currentUserInput); //add to operators stack
        this.toRender = this.currentUserInput; //render user input
        this.currentUserInput = ''; //reset user input (no need to tokenize with operators, because we only accept one operation at a time)
        this.render();
    }
    deliverSoltionToUser = button => {
        if (!this.operatorsStack.length || !this.numbersStack.length) return; //if either of the stacks are empty, input is invalid
        else if (typeof parseInt(this.currentUserInput) === 'number') this.numbersStack.push(parseInt(this.currentUserInput)); //push final number token to num stack
        this.toRender = calculator.computation(); //hold result of computation in order to render
        this.numbersStack = [parseInt(this.toRender)]; //hold result of computation as the only number in the num stack
        this.currentUserInput = this.toRender; //hold result of computation as currentUserInput
        this.render();
    }

    formatDisplay = input => input.toString(); //format as string

    render = () => this.display.innerText = this.toRender;

    add = (x, y) => x + y;

    subtract = (x, y) => x - y;

    multiply = (x, y) => x * y;

    divide = (x, y) => x / y;

    chooseOperation(operation, num1, num2){ // determine operation to be used and perform arithmetic
        if(operation === '+') return this.add(num1, num2);
        if (operation === '-') return this.subtract(num2, num1);
        if (operation === '*') return this.multiply(num1, num2);
        if (operation === '/') return this.divide(num2, num1);
    }
    computation(){
        if (this.operatorsStack.length){
            return this.chooseOperation(this.operatorsStack.pop(), parseInt(this.numbersStack.pop()), parseInt(this.numbersStack.pop()));
        }
    }
}

const calculator = new Calculator(display, [], [], '', '', /[*-/+]/); //instantiate calculator, display location, numbersStack, operatorsStack, toRender, currentUserInput, operatorsRegExp

//Event Listeners
numberBtns.forEach(button => { //Number inputs
    button.addEventListener('click', () => {
        calculator.numbersBtnParser(button);
    })
})
operatorBtns.forEach(button => { //Operator Inputs
    button.addEventListener('click', () => {
        calculator.operatorsBtnParser(button);
    })
})
equalsBtn.addEventListener('click', button => {
    calculator.deliverSoltionToUser(button); //call deliverSolution() in order to perform final computation and display the result to the user
})
allClearBtn.addEventListener('click', button => {
    calculator.clearAll();
})
deleteBtn.addEventListener('click', button => {
    calculator.deleteOne(); //deleteOne() will backspace one character
    calculator.render();
})
