//-----------------------waiting----------
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//----------------------------CONSTRUCTOR-----------------------------------------------------------------
class myWhile {
    type = 'while';
    condition = new myCondition();
    majorPart = [];
};

class myIf {
    type = 'if';
    condition = new myCondition();
    majorPart = [];
}

class myCondition {
    type = 'condition';
    leftExp = [];
    rightExp = [];
    sign;
}

class myAssigning {
    type = 'assigning';
    leftExp;
    rightExp = [];
};

class myIncrement {
    type = 'increment';
    variable;
};

class myDecrement {
    type = 'decrement';
    variable;
};

class myNone {
    type = 'none';
};

const valuesForLeftAssigning = Object.freeze([`i`, `a`, `b`, `c`]);

const variablesForOperations = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    `i`, `a`, `b`, `c`, `n`]);

const operations = Object.freeze(['+', '-', '/', '*', '%']); // Убрал %

const generalStates = Object.freeze(["while", "assigning", "if", "none"]);

const inWhileStates = Object.freeze(["assigning", "increment", "decrement", 'none']);

const whileConditions = Object.freeze(['<', '<=', '>', '>=', '==', '!=']);


function getRandomIntBefore(length) {
    return Math.floor(Math.random() * length);
}

function getNewExpression() {
    let newExpression = [];
    newExpression.push(variablesForOperations[getRandomIntBefore(variablesForOperations.length)]);
    let repeats = getRandomIntBefore(4); // было 4
    for (let j = 0; j < repeats; j++) {
        let operation = operations[getRandomIntBefore(operations.length)];
        let variable = variablesForOperations[getRandomIntBefore(variablesForOperations.length)];
        // if (`${operation} ${variable}` == `/ 0` || `${operation} ${variable}` == `% 0`) {
        //     j--;
        // } else {
        newExpression.push(operation);
        newExpression.push(variable);
        // }
    }
    return newExpression;
}

function getNewAssigning() {
    let newAssigning = new myAssigning();
    newAssigning.leftExp = valuesForLeftAssigning[getRandomIntBefore(valuesForLeftAssigning.length)];
    newAssigning.rightExp = getNewExpression();
    return newAssigning;
}

function getNewCondition() {
    let newCondition = new myCondition();
    newCondition.sign = whileConditions[getRandomIntBefore(whileConditions.length)];
    newCondition.leftExp = getNewExpression();
    newCondition.rightExp = getNewExpression();
    return newCondition;
}

function getNewIncrement() {
    let newIncrement = new myIncrement();
    newIncrement.variable = valuesForLeftAssigning[getRandomIntBefore(valuesForLeftAssigning.length)];
    return newIncrement;
}

function getNewDecrement() {
    let newDecrement = new myDecrement();
    newDecrement.variable = valuesForLeftAssigning[getRandomIntBefore(valuesForLeftAssigning.length)];
    return newDecrement;
}

function getNewMajorPart() {
    let newPart = [];
    for (let i = 0; i < 5; i++) {
        let index = getRandomIntBefore(inWhileStates.length);
        switch (inWhileStates[index]) {
            case "assigning":
                newPart.push(getNewAssigning());
                break;
            case "increment":
                newPart.push(getNewIncrement());
                break;
            case "decrement":
                newPart.push(getNewDecrement());
                break;
            default:
                newPart.push(new myNone());
        }
    }
    return newPart;
}

function getNewWhile() {
    let newWhile = new myWhile();
    newWhile.condition = getNewCondition();
    newWhile.majorPart = getNewMajorPart();
    return newWhile;
}

function getNewIf() {
    let newIf = new myIf();
    newIf.condition = getNewCondition();
    newIf.majorPart = getNewMajorPart();
    return newIf;
}

function getRandomGen() {
    let index = getRandomIntBefore(generalStates.length);
    switch (generalStates[index]) {
        case "while":
            return getNewWhile();

        case "assigning":
            return getNewAssigning();

        case "if":
            return getNewIf();

        default:
            return new myNone();
    }
}

function getRandomGenom() {
    let programm = new Array(15); // Было 15
    for (let i = 0; i < programm.length; i++) {
        programm[i] = getRandomGen();
    }

    return programm;
}

//-----------------------------PROCESSING--------------------------------------------------------------------------------

function getReversedPolishStr(expression) {
    let exitArray = [];
    let operStack = [];

    for (let i = 0; i < expression.length; i++) {
        if (operations.includes(expression[i])) {
            if (operStack.length > 0) {
                if (expression[i] == "+" || expression[i] == "-") {
                    exitArray.push(operStack.pop());
                    operStack.push(expression[i]);
                } else {
                    if (operStack[operStack.length-1] == "+" 
                    || operStack[operStack.length-1] == "-") {
                        operStack.push(expression[i]);
                    } else {
                        exitArray.push(operStack.pop());
                        operStack.push(expression[i]);
                    }
                }
            } else {
                operStack.push(expression[i]);
            }
        } else {
            exitArray.push(expression[i]);
        }
    }

    for (let i = operStack.length - 1; i >= 0; i--) {
        exitArray.push(operStack[i]);
    }

    return exitArray;
}

class stack {
    constructor() {
        this.storage = [];
        this.size = 0;
    }
    push(element) {
        this.storage.push(element);
        this.size++;
    }
    pop() {
        this.size--;
        return this.storage.pop();
    }
}

function countReversedPolishStr(expression, variables) {
    let reversedString = getReversedPolishStr(expression);
    let myStack = new stack();

    for (let i = 0; i < reversedString.length; i++) {

        if (operations.includes(reversedString[i]) == true) {

            let num2 = myStack.pop();
            let num1 = myStack.pop();

            switch (reversedString[i]) {
                case '+':
                    myStack.push(num1 + num2);
                    break;
                case '-':
                    myStack.push(num1 - num2);
                    break;
                case '*':
                    myStack.push(num1 * num2);
                    break;
                case '/':
                    if (num1 == 0 && num2 == 0) {
                        return "error";
                    }
                    myStack.push(Math.floor(num1 / num2));
                    break;
                case '%':
                    if (num1 == 0 && num2 == 0) {
                        return "error";
                    }
                    myStack.push(num1 % num2);
            }

        } else if (typeof reversedString[i] == 'string') {
            myStack.push(variables.get(reversedString[i]));
        } else {
            myStack.push(reversedString[i]);
        }
    }

    return myStack.pop();
}

function processAssigning(myAssigning, variables) {
    variables.set(myAssigning.leftExp, countReversedPolishStr(myAssigning.rightExp, variables));
    if (variables.get(myAssigning.leftExp) == "error") {
        variables.set("c", "error");
    }
    return variables;
}

function processDecrement(myDecrement, variables) {
    variables.set(myDecrement.variable, variables.get(myDecrement.variable) - 1);
    return variables;
}

function processIncrement(myIncrement, variables) {
    variables.set(myIncrement.variable, variables.get(myIncrement.variable) + 1);
    return variables;
}

function conditionFulfilled(condition, variables) {

    let rightExp = countReversedPolishStr(condition.rightExp, variables);
    let leftExp = countReversedPolishStr(condition.leftExp, variables);

    if (leftExp == "error" || rightExp == "error") {
        return "error";
    }

    switch (condition.sign) {
        case '>':
            return (leftExp > rightExp);

        case '>=':
            return (leftExp >= rightExp);

        case '<':
            return (leftExp < rightExp);

        case '<=':
            return (leftExp <= rightExp);

        case '==':
            return (leftExp == rightExp);

        case '!=':
            return (leftExp != rightExp);
    }
}

function processIf(myIf, variables) {

    let fulfilled = conditionFulfilled(myIf.condition, variables);

    if (fulfilled) {
        for (let i = 0; i < myIf.majorPart.length; i++) {
            switch (myIf.majorPart[i].type) {
                case 'assigning':
                    variables = processAssigning(myIf.majorPart[i], variables);
                    break;
                case 'increment':
                    variables = processIncrement(myIf.majorPart[i], variables);
                    break;
                case 'decrement':
                    variables = processDecrement(myIf.majorPart[i], variables);
                    break;
                default:
                    continue;
            }

            if (variables.get("c") == "error") {
                break;
            }
        }
    } else if (fulfilled == "error") {
        variables.set("c", "error");
    }

    return variables;
}

function processWhile(myWhile, variables) {

    let fulfilled = conditionFulfilled(myWhile.condition, variables);
    let iteration = 0, broken = false;

    while (fulfilled) {
        for (let i = 0; i < myWhile.majorPart.length; i++) {
            switch (myWhile.majorPart[i].type) {
                case 'assigning':
                    variables = processAssigning(myWhile.majorPart[i], variables);
                    break;
                case 'increment':
                    variables = processIncrement(myWhile.majorPart[i], variables);
                    break;
                case 'decrement':
                    variables = processDecrement(myWhile.majorPart[i], variables);
                    break;
                default:
                    continue;
            }

            if (variables.get("c") == "error") {
                broken = true;
                break;
            }
        }

        iteration++;
        if (iteration > 100 || broken) {
            variables.set("c", "error");
            break;
        }

        fulfilled = conditionFulfilled(myWhile.condition, variables);
    }

    if (fulfilled == "error") {
        variables.set("c", "error");
    }

    return variables;
}

function getFibonacciNumber(number) {
    if (number == 0) {
        return 0;
    }
    if (number == 1) {
        return 1;
    }

    let fib1 = 0;
    let fib2 = 1;

    let result = 0;
    for (let i = 2; i <= number; i++) {
        result = fib1 + fib2;
        fib1 = fib2;
        fib2 = result;
    }
    return result;
}

let checks = new Map([
    [0, getFibonacciNumber(0)],
    [1, getFibonacciNumber(1)],
    [2, getFibonacciNumber(2)],
    [3, getFibonacciNumber(3)],
    [4, getFibonacciNumber(4)],
    [5, getFibonacciNumber(5)],
    [6, getFibonacciNumber(6)],
    [7, getFibonacciNumber(7)],
    [8, getFibonacciNumber(8)],
    [9, getFibonacciNumber(9)],
    [10, getFibonacciNumber(10)]
  //  [11, getFibonacciNumber(11)],
 //   [12, getFibonacciNumber(12)],
 //   [13, getFibonacciNumber(13)],
 //  [14, getFibonacciNumber(14)],
  //  [15, getFibonacciNumber(15)]
]);

function fitnessFunction(programm) {
    let variables = new Map([
        ["i", null],
        ["a", null],
        ["b", null],
        ["c", null],
        ["n", null]
    ]);

    let failSums = [
        { variable: "i", failSum: 0, answers: [] },
        { variable: "a", failSum: 0, answers: [] },
        { variable: "b", failSum: 0, answers: [] },
        { variable: "c", failSum: 0, answers: [] }
    ];

    for (const number of checks.keys()) {

        variables.set("n", number);

        for (let i = 0; i < programm.length; i++) {
            switch (programm[i].type) {
                case "assigning":
                    variables = processAssigning(programm[i], variables);
                    break;
                case "while":
                    variables = processWhile(programm[i], variables);
                    break;
                case "if":
                    variables = processIf(programm[i], variables);
                default:
                    continue;
            }

            if (variables.get("c") == "error") {
                break;
            }
        }

        for (let i = 0; i < failSums.length; i++) {
            if (variables.get("c") == "error" || isNaN(variables.get(failSums[i].variable))) {
                failSums[i].failSum += Infinity;
            } else {
                failSums[i].failSum += Math.abs(checks.get(number) - variables.get(failSums[i].variable));
            }
            failSums[i].answers.push(`Num: ${number}; Right answer: ${checks.get(number)}; Programm's answer: ${variables.get(failSums[i].variable)};`);
        }

        for (const variable of variables.keys()) {
            variables.set(variable, 0);
        }
    }

    failSums.sort((a, b) => a.failSum - b.failSum);
    return failSums[0];
}

//-----------------------------OUTPUT--------------------------------------------------------------------------------------------------------------------------------------

function writeExpression(expression) {
    // let copy = expression.slice();
    // for (let i = 1; i < copy.length - 1; i += 2) {
    //     [copy[i], copy[i + 1]] = [copy[i + 1], copy[i]];
    // }
    let code = "";
    for (let i = 0; i < expression.length; i++) {
        code += expression[i];
        if (i < expression.length - 1) {
            code += " ";
        }
    }
    return code;
}

function writeAssigning(assigning) {
    return `${assigning.leftExp} = ${writeExpression(assigning.rightExp)}`
}

function writeIncrement(increment) {
    return `${increment.variable}++`;
}

function writeDecrement(decrement) {
    return `${decrement.variable}--`;
}

function writeCondition(condition) {
    return `${writeExpression(condition.leftExp)} ${condition.sign} ${writeExpression(condition.rightExp)}`;
}

function writeMajorPart(majorPart) {
    let code = "{\n";
    for (let i = 0; i < majorPart.length; i++) {
        switch (majorPart[i].type) {
            case "assigning":
                code += `\t${writeAssigning(majorPart[i])};\n`;
                break;
            case "increment":
                code += `\t${writeIncrement(majorPart[i])};\n`;
                break;
            case "decrement":
                code += `\t${writeDecrement(majorPart[i])};\n`;
                break;
            default:
                // code += '\n';
                continue;
        }
    }
    code += '}\n';
    return code;
}

function writeWhile(myWhile) {
    return `while (${writeCondition(myWhile.condition)}) ${writeMajorPart(myWhile.majorPart)}`;
}

function writeIf(myIf) {
    return `if (${writeCondition(myIf.condition)}) ${writeMajorPart(myIf.majorPart)}`;
}

function writeCode(programm, result) {
    let code = "const n = prompt();\nlet i = null, a = null, b = null, c = null;\n\n";
    for (let i = 0; i < programm.length; i++) {
        switch (programm[i].type) {
            case "while":
                code += `${writeWhile(programm[i])}\n`;
                break;
            case "assigning":
                code += `${writeAssigning(programm[i])};\n\n`;
                break;
            case "if":
                code += `${writeIf(programm[i])}\n`;
                break;
            default:
                // code += '\n';
                continue;
        }
    }
    code += `console.log(${result});`;
    return code;
}

//---------------------------------GENETICS----------------------------------------------------------------------------------------------------------------------------------
class individual {
    genom = [];
    setGenom() {
        this.genom = getRandomGenom();
    }
    setFitnessValue() {
        let feedback = fitnessFunction(this.genom);
        this.fitness = feedback.failSum;
        this.result = feedback.variable;
        this.answers = feedback.answers;
    }
    setParameters() {
        this.setGenom();
        this.setFitnessValue();
    }
    outPut() {
        for (let i = 0; i < this.answers.length; i++) {
            console.log(this.answers[i]);
        }
        return writeCode(this.genom, this.result);
    }
};

//let mutation = 0.2;
function mutationChance(child) { // 0.07 - classic
    if (Math.random() < 0.07) {
        let repeats = getRandomIntBefore(child.genom.length/3) + 1; //getRandomIntBefore(child.genom.length/3) + 
        for (let i = 0; i < repeats; i++) {
            let randGen = getRandomIntBefore(child.genom.length);
            let newGen = getRandomGen();
            child.genom[randGen] = newGen;
        }
        child.setFitnessValue();
    }
    return child;
}

function getInheritedAssgning(gen1, gen2) {
    let newAssigning = new myAssigning();

    let choice = getRandomIntBefore(2);
    newAssigning.leftExp = (choice == 0)?gen1.leftExp:gen2.leftExp;

    choice = getRandomIntBefore(2);
    newAssigning.rightExp = (choice == 1)?gen1.rightExp.slice():gen2.rightExp.slice();

    return newAssigning;
}

function getInheritedStruct(gen1, gen2) {
    let newStruct = (gen1.type == "while")? new myWhile() : new myIf();

    let choice = getRandomIntBefore(2);
    newStruct.condition.rightExp = (choice == 0)?gen1.condition.rightExp.slice():gen2.condition.rightExp.slice();

    choice = getRandomIntBefore(2);
    newStruct.condition.leftExp = (choice == 1)?gen1.condition.leftExp.slice():gen2.condition.leftExp.slice();

    choice = getRandomIntBefore(2);
    newStruct.condition.sign = (choice == 0) ? gen1.condition.sign : gen2.condition.sign;

    for (let i = 0; i < gen1.majorPart.length; i++) {
        if (gen2.majorPart.length > i) {
            if (gen1.majorPart[i].type == gen2.majorPart[i].type && gen2.majorPart[i].type == "assigning") {
                newStruct.majorPart.push(getInheritedAssgning(gen1.majorPart[i], gen2.majorPart[i]));
            } else {
                choice = getRandomIntBefore(2);
                if (choice == 0) {
                    newStruct.majorPart.push(gen1.majorPart[i]);
                } else {
                    newStruct.majorPart.push(gen2.majorPart[i]);
                }
            }
        } else {
            newStruct.majorPart.push(gen1.majorPart[i]);
        }
    }
    return newStruct;
}

function getChild(parent1, parent2, bestFitness) {

    let child = new individual();

    for (let i = 0; i < parent1.genom.length; i++) {
        if (parent1.genom[i].type == parent2.genom[i].type) {
            switch (parent1.genom[i].type) {
                case "while":
                    child.genom.push(getInheritedStruct(parent1.genom[i], parent2.genom[i]));
                    break;
                case "if":
                    child.genom.push(getInheritedStruct(parent1.genom[i], parent2.genom[i]));
                    break;
                case "assigning":
                    child.genom.push(getInheritedAssgning(parent1.genom[i], parent2.genom[i]));
                    break;
                default:
                    let choice = getRandomIntBefore(2);
                    if (choice == 0) {
                        child.genom.push(parent1.genom[i]);
                    } else {
                        child.genom.push(parent2.genom[i]);
                    }
            }
        } else {
            let choice = getRandomIntBefore(2);
            if (choice == 0) {
                child.genom.push(parent1.genom[i]);
            } else {
                child.genom.push(parent2.genom[i]);
            }
        }
    }

    child.setFitnessValue();
    if (child.fitness >= bestFitness) {
        child = mutationChance(child);
    }

    return child;
}

function getNextGeneration(curGeneration, populationSize, bestFitness) {
    for (let i = 0; i < populationSize*(populationSize-1); i++) { // populationSize*(populationSize-1)
        let parent1, parent2;
        do {
            parent1 = getRandomIntBefore(populationSize);
            parent2 = getRandomIntBefore(populationSize);
        } while (parent1 == parent2);

        let child = getChild(curGeneration[parent1], curGeneration[parent2], bestFitness);
        curGeneration.push(child);

        let secChild = getChild(curGeneration[parent2], curGeneration[parent1], bestFitness);
        curGeneration.push(secChild);
    }

    // for (let par1 = 0; par1 < populationSize - 1; par1++) {
    //     for (let par2 = par1 + 1; par2 < populationSize; par2++) {
    //         if (par1 == par2) {
    //             continue;
    //         }

    //         let child = getChild(curGeneration[par1], curGeneration[par2]);
    //         curGeneration.push(child);

    //         let secChild = getChild(curGeneration[par2], curGeneration[par1]);
    //         curGeneration.push(secChild);
    //     }
    // }

    curGeneration.sort((a, b) => a.fitness - b.fitness);
    return curGeneration.slice(0, populationSize);
}

function getInitialGeneration(populationSize) {
    let initGeneration = [];
    for (let i = 0; i < populationSize; i++) {
        let individ = new individual();
        individ.setParameters();
        if (individ.fitness == Infinity) {
            i--;
        } else {
            initGeneration.push(individ);
        }
    }
    return initGeneration;
}

let stopp = false;
async function geneticAlgorithm(populationSize) {
    let curGeneration = getInitialGeneration(populationSize);
    curGeneration.sort((a, b) => a.fitness - b.fitness);

    let bestProgramm = curGeneration[0];
    let noChanged = 0;

    let currentCode = document.getElementById('currentCode');
    currentCode.innerText = "Давайте приступим"
    await sleep(100);

    while (noChanged < 1 && bestProgramm.fitness > 0 && stopp == false) { //Было 100
        curGeneration = getNextGeneration(curGeneration, populationSize, bestProgramm.fitness);

        if (curGeneration[0].fitness < bestProgramm.fitness) {
            bestProgramm = curGeneration[0];
            noChanged = 0;
            //mutation = 0.01;
        } else {
            noChanged++;
            // if (mutation < 0.3) {
            //     mutation += 0.001;
            // }
        }

        currentCode.innerText = `No changes: ${noChanged} Fitness: ${bestProgramm.fitness}`;
        await sleep(100);
        console.log(`No changes: ${noChanged} Fitness: ${bestProgramm.fitness}`);
    }

    console.log(bestProgramm.genom);
    console.log(bestProgramm.fitness);
    console.log(bestProgramm.outPut());

    let fromComputer = document.getElementById('fromComputer');
    fromComputer.innerText = bestProgramm.outPut();
    currentCode.innerText = `${bestProgramm.genom}, ${bestProgramm.fitness}`;
}

let startButton = document.getElementById("startButton");
startButton.onclick = () => {
    geneticAlgorithm(150); //150-200
}

let stopButton = document.getElementById("stopButton");
stopButton.onclick = () => {
    stopp = true;
    console.log("pushed");
}

// const n = 18;
// let i = null, a = null, b = null, c = null;

// if (9 < n + a) {
// 	i--;
// 	a = 4 - 7;
// 	c = 3;
// }

// while (n > i) {
// 	b++;
// 	c--;
// 	i++;
// 	a++;
// }

// if (3 <= Math.floor(n / 2)) {
// 	b = c;
// 	i++;
// 	i = 7;
// 	a = 1 + 6;
// 	i++;
// }

// if (4 <= a + b) {
// 	a++;
// 	b++;
// 	a++;
// 	i--;
// }

// b = 4 * n;

// if (n - 4 > 9 - 4) {
// 	b = b - c;
// 	a++;
// 	i++;
// }

// if (n <= 8) {
// 	b--;
// 	b = 2 * n;
// 	b--;
// 	c = c;
// }

// if (c + 2 == 1 - 7) {
// 	b++;
// 	b++;
// 	c = i - 3;
// 	b++;
// 	i++;
// }

// while (3 <= c) {
// 	a++;
// 	i--;
// 	c--;
// 	a++;
// 	b++;
// }

// if (n >= 7) {
// 	i = b;
// 	a--;
// 	c--;
// 	c++;
// 	c--;
// }

// console.log(i);