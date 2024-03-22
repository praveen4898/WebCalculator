let expression = '';

function appendValue(value) {
    expression += value;
    updateDisplay();
}

function clearDisplay() {
    expression = '';
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').innerText = expression || '0';
}

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    const key = event.key;
    if (/[0-9\+\-\*\/\.\%\=]/.test(key)) {
        appendValue(key);
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char) || char === '/';
}

function precedence(operator) {
    switch (operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        default:
            return 0;
    }
}

function applyOperator(operator, operand1, operand2) {
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            if (operand2 === 0) {
                throw new Error('Division by zero');
            }
            return operand1 / operand2;
        default:
            throw new Error('Invalid operator');
    }
}

function calculatePercentage() {
    try {
        const parts = expression.split('%');
        if (parts.length !== 2) {
            throw new Error('Invalid expression');
        }
        const number = parseFloat(parts[0]);
        const percent = parseFloat(parts[1]);
        if (isNaN(number) || isNaN(percent)) {
            throw new Error('Invalid expression');
        }
        const result = (number * percent) / 100;
        expression = result.toString();
        updateDisplay();
    } catch (error) {
        expression = 'Error';
        updateDisplay();
    }
}

function calculate() {
    if (expression.includes('%')) {
        calculatePercentage();
    } else {
        try {
            let numStack = [];
            let opStack = [];
            let num = '';

            for (let i = 0; i < expression.length; i++) {
                const char = expression[i];
                if (!isNaN(char) || char === '.') {
                    num += char;
                } else if (isOperator(char)) {
                    if (num !== '') {
                        numStack.push(parseFloat(num));
                        num = '';
                    }
                    while (
                        opStack.length > 0 &&
                        precedence(opStack[opStack.length - 1]) >= precedence(char)
                    ) {
                        const operator = opStack.pop();
                        const operand2 = numStack.pop();
                        const operand1 = numStack.pop();
                        numStack.push(applyOperator(operator, operand1, operand2));
                    }
                    opStack.push(char);
                }
            }

            if (num !== '') {
                numStack.push(parseFloat(num));
            }

            while (opStack.length > 0) {
                const operator = opStack.pop();
                const operand2 = numStack.pop();
                const operand1 = numStack.pop();
                numStack.push(applyOperator(operator, operand1, operand2));
            }

            if (numStack.length !== 1 || opStack.length !== 0) {
                throw new Error('Invalid expression');
            }

            expression = numStack.pop().toString();
            updateDisplay();
        } catch (error) {
            expression = 'Error';
            updateDisplay();
        }
    }
}
