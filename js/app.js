const numberBtns = document.querySelectorAll('.numbers');
const operatorBtns = document.querySelectorAll('.operators');
const equalsBtn = document.querySelector('.equals');
const deleteBtn = document.querySelector('.del');
const allClearBtn = document.querySelector('.ac');
const display = document.querySelector('.display');

let numbersStack = [];
let operatorsStack = [];
//the value of toRender will be fed to the render function
let toRender = '';
let currentUserInput;
const operatorsRegExp = /[+-/*]/;

class Calculator {
    constructor(display){
        //location to render text
        this.display = display;
        //call clear function on instantiation to
         //make sure everything is clear
        this.clearAll();
    }
    clearAll(){
        toRender = '';
        currentUserInput = undefined;
        numbersStack = [], operatorsStack = [];
        this.render();
    }
    deleteOne = () => { //backspace one character
        toRender = toRender.slice(0, -1); // remove last character from display
        // remove last element from stack
        if (operatorsRegExp.test(currentUserInput)) operatorsStack.pop();
            else { 
                let numberToSlice = numbersStack.pop();
                numberToSlice = numberToSlice.toString().slice(0, -1);
                numbersStack.push(numberToSlice);
            }
    }

    formatDisplay = input => input.toString(); //format as string

    render = () => this.display.innerText = toRender;

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
        if (operatorsStack.length){
            return this.chooseOperation(operatorsStack.pop(), parseInt(numbersStack.pop()), parseInt(numbersStack.pop()));
        }
    }
}

const calculator = new Calculator(display, numbersStack, operatorsStack); //instantiate calculator


//Event Listeners
numberBtns.forEach(button => { //Number inputs
    button.addEventListener('click', () => {
        // check to see if consecutive digits were typed
            // if true -> combine digits
        if (operatorsRegExp.test(currentUserInput) || !currentUserInput){
            currentUserInput = button.innerText; //currentUserInput holds value of most recent input
        } else {
            currentUserInput = currentUserInput + button.innerText; //if a multi-digit number is typed, combine the digits
            numbersStack.pop();
            toRender = currentUserInput; //re-render as on multi-digit number
        }
        toRender = calculator.formatDisplay(currentUserInput); //update toRender variable
        numbersStack.push(parseInt(currentUserInput)); //add number to stack
        calculator.render(); //render the input number
    })
})
operatorBtns.forEach(button => { //Operator Inputs
    button.addEventListener('click', () => {
        if (!!operatorsStack.length) return; //Block full expressions from being input
        currentUserInput = button.innerText; //currentUserInput holds value of most recent input
        toRender += calculator.formatDisplay(currentUserInput); //add operator to display
        operatorsStack.push(currentUserInput); //add operator to stack
        calculator.render(); //render the input operator
    })
})
equalsBtn.addEventListener('click', button => {
    toRender = calculator.computation();
    numbersStack = [parseInt(toRender)];
    calculator.render();
})
allClearBtn.addEventListener('click', button => {
    calculator.clearAll();
})
deleteBtn.addEventListener('click', button => {
    calculator.deleteOne();
    calculator.render();
})

