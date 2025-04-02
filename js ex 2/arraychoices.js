const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getOrdinalSuffix(num) {
    if (num % 100 >= 11 && num % 100 <= 13) {
        return num + "th";
    }
    switch (num % 10) {
        case 1: return num + "st";
        case 2: return num + "nd";
        case 3: return num + "rd";
        default: return num + "th";
    }
}

// Function to get user input
function getUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer));
    });
}

// Main function to collect user choices
async function main() {
    let numChoices = await getUserInput("How many top choices do you want to enter? ");
    numChoices = parseInt(numChoices);

    if (isNaN(numChoices) || numChoices <= 0) {
        console.log("Invalid input. Please enter a valid number.");
        rl.close();
        return;
    }

    let choices = [];
    for (let i = 0; i < numChoices; i++) {
        let choice = await getUserInput(`Enter your #${i + 1} choice: `);
        choices.push(choice);
    }

    console.log("\nYour top choices:");
    choices.forEach((choice, index) => {
        let rank = getOrdinalSuffix(index + 1);
        console.log(`My ${rank} choice is ${choice}.`);
    });

    rl.close();
}

// Run the program
main();
