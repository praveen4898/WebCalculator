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
    if (/[0-9\+\-\*\/\.\%]/.test(key)) {
        appendValue(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
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
    try {
        const result = eval(expression);
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid expression');
        }
        expression = result.toString();
        updateDisplay();
    } catch (error) {
        if (error instanceof SyntaxError) {
            expression = '';
            updateDisplay();
        } else {
            expression = 'Error';
            updateDisplay();
        }
    }
}
