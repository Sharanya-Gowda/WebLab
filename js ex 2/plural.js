const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function pluralize(noun, number) {
    const irregularNouns = {
        sheep: "sheep",
        goose: "geese",
        person: "people",
        child: "children",
        tooth: "teeth",
        foot: "feet",
        mouse: "mice",
        man:"men",
        woman:"women"
    };

    let pluralNoun;

    if (number === 1) {
        pluralNoun = noun; // Singular form
    } else if (irregularNouns[noun]) {
        pluralNoun = irregularNouns[noun]; // Handle irregular nouns
    } else if (noun.endsWith("y") && !["a", "e", "i", "o", "u"].includes(noun[noun.length - 2])) {
        pluralNoun = noun.slice(0, -1) + "ies"; // Change "y" to "ies" (e.g., "baby" → "babies")
    } else if (noun.endsWith("s") || noun.endsWith("sh") || noun.endsWith("ch") || noun.endsWith("x") || noun.endsWith("z")) {
        pluralNoun = noun + "es"; // Add "es" for words ending in s, sh, ch, x, or z
    } else {
        pluralNoun = noun + "s"; // Default plural form
    }

    return `${number} ${pluralNoun}`;
}

// Function to get user input
function getUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer));
    });
}

// Main function to handle user input
async function main() {
    let noun = await getUserInput("Enter a noun: ");
    let numberInput = await getUserInput("Enter a number: ");
    let number = parseInt(numberInput);

    if (isNaN(number)) {
        console.log("Invalid input. Please enter a valid number.");
    } else {
        console.log(pluralize(noun.toLowerCase(), number));
    }

    rl.close(); // Close the input stream
}

// Run the program
main();
