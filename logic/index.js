const startingMoney = 5;
const numberOfPeople = 10;
const nodes = Array(numberOfPeople).fill().map((_, index) => ({ cash: startingMoney, id: index }));
let activeNodes;
let transactionLogs = [];
let transactionNumber = 0;
let outOfBussiness = [];


function deal(person1, person2) {
    if (coinFlip()) {
        person1.cash -= 1;
        person2.cash += 1;
        if (person1.cash < 1) {
            outOfBussiness.push(person1);
            activeNodes = activeNodes.filter(node => node.id !== person1.id);
        }
        logTransactions(person1, person2)
    } else {
        person1.cash += 1;
        person2.cash -= 1;
        if (person2.cash < 1) {
            outOfBussiness.push(person2);
            activeNodes = activeNodes.filter(node => node.id !== person2.id);
        }
        logTransactions(person2, person1)
    } 
}

function iteratre() {
    const remainingPeople = activeNodes.length;
    if (remainingPeople > 2) {
        activeNodes.forEach((node, index) => {
            let chosen = pickRandomPerson();
            while (chosen == index) {
                chosen = pickRandomPerson();
            }
            deal(node, activeNodes[chosen])
        })
    } else {
        deal(activeNodes[0], activeNodes[1])
    }
}

function run() {
    activeNodes = JSON.parse(JSON.stringify(nodes));
    transactionLogs = [];
    transactionNumber = 0;
    while (activeNodes.length > 1) {
        iteratre();
    }
    return { 
        luckiest: activeNodes[0],
        outOfBussiness,
        transactionLogs,
        transactionNumber,
        nodes,
    }
}


module.exports = run;
run();
// console.log(transactionLogs);

function pickRandomPerson () {
    return randomNumber(0, activeNodes.length - 1)
}
function logTransactions(giver, reciever) {
    const log = `${transactionNumber += 1}: ${giver.id} -> ${reciever.id}`;
    const transcation = [giver.id, giver.cash, reciever.id, reciever.cash];
    // console.log(log);
    transactionLogs.push(transcation);
}
function randomNumber(min, max) {
    return (Math.random() * (max - min) + min).toFixed(0);
}
function coinFlip() {
    return Math.random() < .5;
};