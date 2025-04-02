const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function squareNumber(num) {
    let result = num * num;
    console.log(`The result of squaring the number ${num} is ${result}.`);
    return result;
}

function halfNumber(num) {
    let result = num / 2;
    console.log(`Half of ${num} is ${result}.`);
    return result;
}

function percentOf(part, whole) {
    let result = (part / whole) * 100;
    console.log(`${part} is ${result}% of ${whole}.`);
    return result;
}

function areaOfCircle(radius) {
    let area = Math.PI * radius * radius;
    let roundedArea = area.toFixed(2);
    console.log(`The area for a circle with radius ${radius} is ${roundedArea}.`);
    return parseFloat(roundedArea);
}

// Function to perform the sequence of operations
function calculatorOperations(num) {
    let half = halfNumber(num);
    let squared = squareNumber(half);
    let area = areaOfCircle(squared);
    let percentage = percentOf(area, squared);
    console.log(`The area ${area} is ${percentage}% of the squared result ${squared}.`);
}

// Function to get user input
function getUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(parseFloat(answer)));
    });
}

// Main function to run everything
async function main() {
    let num1 = await getUserInput("Enter a number to square: ");
    squareNumber(num1);

    let num2 = await getUserInput("Enter a number to halve: ");
    halfNumber(num2);

    let part = await getUserInput("Enter the first number (part): ");
    let whole = await getUserInput("Enter the second number (whole): ");
    percentOf(part, whole);

    let radius = await getUserInput("Enter a radius for the circle: ");
    areaOfCircle(radius);

    let num = await getUserInput("Enter a number for full calculation sequence: ");
    calculatorOperations(num);

    rl.close();
}


main();
