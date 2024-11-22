const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
    "t", "u", "v", "w", "x", "y", "z"];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const symbols = ["?", ".", "!", "^", "&", "$", "*", "@", "+", "-", "%"];
var asciiList = ["alphabet", "numbers", "symbols"];



function rand(max) {
    return Math.floor(Math.random() * max);
}



function findAndDelete(item) {
    for (let i = 0; i < asciiList.length; i++) {
        if (asciiList[i] === item) {
            asciiList.pop(i, 1);
        }
    }
}



function generateToken() {
    var token = "";
    var alphaCount = 0;
    var numbersCount = 0;
    var symbolsCount = 0;

    for (let i = 0; i < 20; i++) {
        if (numbersCount > 5) {
            findAndDelete("numbers");
        }

        if (symbolsCount > 5) {
            findAndDelete("symbols");
        }

        var asciiIdx = rand(asciiList.length);

        if (asciiList[asciiIdx] === "alphabet" || token.length === 0) {
            var alpha_idx = rand(alphabet.length);
            var character = alphabet[alpha_idx];
            var beUpper = rand(2);

            if (beUpper === 1) {
                character = character.toUpperCase();
            }

            token+=character;
            alphaCount++;
        } else if (asciiList[asciiIdx] === "numbers") {
            var nums_idx = rand(numbers.length);
            token+=numbers[nums_idx];
            numbersCount++;
        } else {
            var symbols_idx = rand(symbols.length);
            token+=symbols[symbols_idx];
            symbolsCount++;
        }
    }

    return token;
}



module.exports = { generateToken };
//console.log(generateToken());