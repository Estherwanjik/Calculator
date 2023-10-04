
const lastOperationScreen = document.getElementById('lastOperationScreen')
const currentOperationScreen = document.getElementById('currentOperationScreen')
const numberButtons = document.querySelectorAll('[data-number]')
const operatorButtons = document.querySelectorAll('[data-operator]') 
const equalsButton = document.getElementById('equalsBtn')
const clearButton = document.getElementById('clearBtn')
const allClearButton = document.getElementById('allclearBtn')
const decimalButton = document.getElementById('decimalBtn')
const remainderButton = document.getElementById('remainder')

/* let firstNumber = ''
let secondNumber = '' */
let currentOperation = null
let shouldResetScreen = false


window.addEventListener('keydown', handleKeyboardInput)
equalsButton.addEventListener('click', evaluate)
decimalButton.addEventListener('click', appendPoint)
remainderButton.addEventListener('click', appendPercentage)
allClearButton.addEventListener('click', clear)
clearButton.addEventListener('click', deleteNumber)

numberButtons.forEach((button) =>
    button.addEventListener('click', () => appendNumber(button.textContent))

)
operatorButtons.forEach((button) =>
  button.addEventListener('click', () => setOperation(button.textContent))
)
function appendNumber(number) {
    if (currentOperationScreen.textContent === '0' || shouldResetScreen)
      resetScreen()
    currentOperationScreen.textContent += number
}
  
function resetScreen() {
    currentOperationScreen.textContent = ''
    shouldResetScreen = false
}
function clear() {
    currentOperationScreen.textContent = '0'
    lastOperationScreen.textContent = ''
    firstOperand = ''
    secondOperand = ''
    currentOperation = null
}
function appendPoint() {
    if (shouldResetScreen) resetScreen()
    if (currentOperationScreen.textContent === '')
      currentOperationScreen.textContent = '0'
    if (currentOperationScreen.textContent.includes('.')) return
    currentOperationScreen.textContent += '.'
} 
function appendPercentage() {
    if (shouldResetScreen) resetScreen()
    if (currentOperationScreen.textContent === '')
      currentOperationScreen.textContent = '0'
    if (currentOperationScreen.textContent.includes('%')) return
    currentOperationScreen.textContent += '%'
}

function deleteNumber() {
    currentOperationScreen.textContent = currentOperationScreen.textContent
      .toString()
      .slice(0, -1)
}
function setOperation(operator) {
    if (currentOperation != null) evaluate()
    firstOperand = currentOperationScreen.textContent
    console.log(firstOperand)
    currentOperation = operator
    console.log(currentOperation)
    lastOperationScreen.textContent = `${firstOperand} ${currentOperation}`
    shouldResetScreen = true
}
function evaluate() {
    if (currentOperation === null || shouldResetScreen) return
    if (currentOperation === '÷' && currentOperationScreen.textContent === '0') {
      alert("You can't divide by 0!")
      return
    }
    secondOperand = currentOperationScreen.textContent
    tempFirstOperand = firstOperand
    tempSecondOperand = secondOperand
    console.log(firstOperand)
    console.log(secondOperand)
    console.log(is_percentage(firstOperand))
    if(is_percentage(firstOperand)== true) {
        firstOperand=firstOperand.slice(0,-1)
        console.log(firstOperand)
        firstOperand=(parseFloat(firstOperand)/100)
        console.log(firstOperand)
    }
    else if(is_percentage(secondOperand) == true){
        secondOperand=secondOperand.slice(0,-1)
        console.log(secondOperand)
        secondOperand=(parseFloat(secondOperand)/100)
        console.log(secondOperand)
    }
    currentOperationScreen.textContent = roundResult(
      operate(currentOperation, firstOperand, secondOperand)
    )
    lastOperationScreen.textContent = `${tempFirstOperand} ${currentOperation} ${tempSecondOperand} =`
    currentOperation = null
}
function roundResult(number) {
    return Math.round(number * 1000) / 1000
} 
function handleKeyboardInput(e) {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key)
    if (e.key === '.') appendPoint()
    if (e.key === '=' || e.key === 'Enter') evaluate()
    if (e.key === 'Backspace') deleteNumber()
    if (e.key === 'Escape') clear()
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%')
      setOperation(convertOperator(e.key))
}
function convertOperator(keyboardOperator) {
    if (keyboardOperator === '/') return '÷'
    if (keyboardOperator === '*') return 'x'
    if (keyboardOperator === '-') return '-'
    if (keyboardOperator === '+') return '+'
}
function add(a, b) {
    return a + b
}
  
function substract(a, b) {
    return a - b
}
  
function multiply(a, b) {
    return a * b
}
  
function divide(a, b) {
    return a / b
}

 function is_percentage(a) {
    return a.endsWith('%')
} 
function operate(operator, a, b) {
    a = Number(a)
    b = Number(b)
    switch (operator) {
      case '+':
        return add(a, b)
      case '-':
        return substract(a, b)
      case 'x':
        return multiply(a, b)
      case '÷':
        if (b === 0) return null
        else return divide(a, b)
      default:
        return null
    }
}