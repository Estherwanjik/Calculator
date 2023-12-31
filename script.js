
function handleEquation(equation) {
    equation = equation.split(" ");
	const operators = [['/', 'x'], ['+', '-']];
	let firstNumber;
	let secondNumber;
	let operator;
	let operatorIndex;
	let result;

	/*  
		1. Perform calculations as per BO(DM)(AS) Method
		2. For that use operators array
		3. after calculation of 1st numbers replace them with result
		4. use splice method

	*/ 
	for (var i = 0; i < operators.length; i++) {
		while (equation.includes(operators[i][0]) || equation.includes(operators[i][1])) {
			if(equation.includes(operators[i][0]) && equation.includes(operators[i][1])) {
                let operatorIndex_1 = equation.findIndex(item => item === operators[i][0])
                let operatorIndex_2 = equation.findIndex(item => item === operators[i][1])
                operatorIndex = Math.min(operatorIndex_1, operatorIndex_2)
            } else if (equation.includes(operators[i][0])) {
                operatorIndex = equation.findIndex(item => item === operators[i][0])
            } else {
                operatorIndex = equation.findIndex(item => item === operators[i][1])
            }
			firstNumber = equation[operatorIndex-1]
			operator = equation[operatorIndex]
			secondNumber = equation[operatorIndex+1]
            if( typeof(firstNumber) != 'number') {
                if(firstNumber.includes('%')  ) {
                    firstNumber = (parseFloat(firstNumber)/100)
                    firstNumber = firstNumber.toString()
                }
            }
            if( typeof(secondNumber) != 'number') {
                if(secondNumber.includes('%')) {
                    secondNumber = (parseFloat(secondNumber)/100)
                    secondNumber = secondNumber.toString()
                }
            }
            result = calculate(firstNumber, operator, secondNumber)
			equation.splice(operatorIndex - 1, 3, result)
		}
        
	}

	return result;
} 

// Event Listener for keyboard button press
document.addEventListener('keydown', (event) => {
	
	let getOperators = {
		'/': 'divide',
		'x': 'multiply',
		'*': 'multiply',
		'+': 'plus',
		'-': 'minus'
	}
    console.log()

	if(!isNaN(event.key) && event.key !== ' '){
		document.getElementById(`number-${event.key}`).click();
	}
	if (['x', '+', '-', '*', '/'].includes(event.key)) {
		document.getElementById(getOperators[event.key]).click();
        console.log(event.key.textContent)
	}
	if (event.key === 'Backspace' || event.key ==='c' || event.key === 'C') {
		document.getElementById('clear').click();	
	}
	if (event.key === '=' || event.key === 'Enter') {
		document.getElementById('equals').click();	
	}
	if (event.key === '.') {
		document.getElementById('decimal').click();	
	}
    if (event.key === '%') {
		document.getElementById('remainder').click();	
	}
});

const calcKeys = document.querySelector('.buttons-flex');
const currentOperationScreen = document.getElementById('currentOperationScreen')
const displayLastOperationScreen = document.getElementById('lastOperationScreen')
const calculator = document.querySelector('.calculator');
let isEqualsPressed = false;
let equation = 0; //separate variable to calculate equation in backend
let checkForDecimal = ''; // storing each number and check if decimal is pressed
let checkForRemainder = '';// storing each number and checking if remainder is pressed

calcKeys.addEventListener('click', (event) => {
	//Checking if click is on the button and not on the container
	if(!event.target.closest('button')) return;

	const key = event.target;
	let keyValue = key.textContent;
    let inputDisplay = currentOperationScreen.textContent;
	const { type } = key.dataset;
	const { previousKeyType } = calculator.dataset;

    if(isEqualsPressed) {
        isEqualsPressed = false;
        inputDisplay = displayLastOperationScreen.textContent;
        equation = displayLastOperationScreen.textContent;
        displayLastOperationScreen.innerHTML = '&nbsp;'
    }	
	//If any number button is pressed
	if(type === 'number' && !isEqualsPressed) {
		/*
			1. Inital screen display is 0
			2. replace initial display with user input if number is pressed
			3. else concat with operator
			4. if screen display is anything other than number concat the display
		*/
		if (inputDisplay === '0') {
			currentOperationScreen.textContent = (previousKeyType === 'operator') ? inputDisplay + keyValue : keyValue;
			equation = (previousKeyType === 'operator') ? equation + key.value : key.value;
			checkForDecimal = checkForDecimal + keyValue;
		}else {
			/* Checking length so that number stays within display box
			else replace it with exponential */
			if (checkForDecimal.length >= 19) {
				var replaceNumber = checkForDecimal;
				checkForDecimal = Number(checkForDecimal).toExponential(2);
				currentOperationScreen.textContent = inputDisplay.replace(replaceNumber, checkForDecimal);
			}else {
				//Check for Infinity OR NaN in Display
				currentOperationScreen.textContent = currentOperationScreen.textContent.includes('N') ? 'NaN' : 
										currentOperationScreen.textContent.includes('I') ? 'Infinity' : inputDisplay + keyValue;
				equation = equation + key.value;
				checkForDecimal = checkForDecimal + keyValue;

			}
		}
	}

	/*
		1. Check if operator is pressed AND Equals To (=) is not yet pressed
		2. AND Display dose not include Infinity
		3. Replace checkForDecimal with blank to store next number
	*/
    if (type === 'operator' && previousKeyType !== 'operator'
    && !isEqualsPressed && !inputDisplay.includes('Infinity')) {
    checkForDecimal = '';
    checkForRemainder = '';
    currentOperationScreen.textContent = inputDisplay + ' ' + keyValue + ' ';
    equation = equation + ' ' + key.value + ' ';

    }

    /*
        1. Checking if Decimal button is pressed AND Equals To (=) is not yet pressed
        2. AND was a previously pressed button a number or was display a 0
        3. #2 required so that if user presses decimal after operator, it is not displayed
        4. check if the number already contains a decimal
    */
    if (type === 'decimal' && (previousKeyType === 'number' || inputDisplay === '0' || (previousKeyType === 'backspace'  && isDigit(inputDisplay.slice(-1)) && !findDecimal(inputDisplay))) 
        && !isEqualsPressed && !inputDisplay.includes('Infinity')) {
            if (!checkForDecimal.includes('.')) {
                currentOperationScreen.textContent = inputDisplay + keyValue;
                equation = equation + key.value;
                checkForDecimal = checkForDecimal + keyValue;
        }
    }
    if ((type === 'backspace' || type === 'reset') && inputDisplay !== '0') {
        if (type === 'backspace' && !isEqualsPressed) {
            if(equation.endsWith('.')){
                checkForDecimal = '';
            }else if(equation.endsWith('%')){
                checkForRemainder = '';
            }
            console.log('equation', equation)
            if (equation.endsWith(' ')) {
                currentOperationScreen.textContent = inputDisplay.substring(0, inputDisplay.length - 3);
                equation = equation.substring(0, equation.length - 3);
            } else {
                currentOperationScreen.textContent = inputDisplay.substring(0, inputDisplay.length - 1);
                equation = equation.substring(0, equation.length - 1);
            }    
        } else {
            inputDisplay = '0';
            currentOperationScreen.textContent = inputDisplay;
            displayLastOperationScreen.innerHTML = '&nbsp;';
            isEqualsPressed = false;
            equation = '';
            checkForDecimal = '';
            checkForRemainder = '';
        }

    }
    if (type === 'remainder' && (previousKeyType === 'number' || inputDisplay === '0'  || (previousKeyType === 'backspace'  && isDigit(inputDisplay.slice(-1))))
    && !isEqualsPressed && !inputDisplay.includes('Infinity')) {
        if (!checkForRemainder.includes('%')) {
            currentOperationScreen.textContent = inputDisplay + keyValue;
            equation = equation + key.value;
            checkForRemainder = checkForRemainder + keyValue;
        }
    }

    //Send equation for calculation after Equals To (=) is pressed
    if (type === 'equal') {
        // Perform a calculation
        isEqualsPressed = true;
        const finalLastOperationScreen = handleEquation(equation);
        if (finalLastOperationScreen || finalLastOperationScreen === 0) {
            displayLastOperationScreen.textContent = (!Number.isInteger(finalLastOperationScreen)) ? finalLastOperationScreen.toFixed(2) : 
                                        (finalLastOperationScreen.toString().length >= 16) ? finalLastOperationScreen.toExponential(2) : finalLastOperationScreen ;
        } else {
            displayLastOperationScreen.textContent = 'Math Error';
        }
    }
    calculator.dataset.previousKeyType = type;
})

//Function to calculate result based on each operator
function calculate(firstNumber, operator, secondNumber) {

	firstNumber = Number(firstNumber);
	secondNumber = Number(secondNumber);

    if (operator === 'plus' || operator === '+') return firstNumber + secondNumber;
    if (operator === 'minus' || operator === '-') return firstNumber - secondNumber;
    if (operator === 'multiply' || operator === 'x') return firstNumber * secondNumber;
    if (operator === 'divide' || operator === '/') return firstNumber / secondNumber;
}
//finding the last character
function isDigit(character) {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; 
  return digits.includes(character)
}
//checking extra decimals
function findDecimal(string) {
    let items = string.split(' ')
    last = items.pop()
    return last.includes('.') 
}