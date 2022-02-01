const startingMoney = 5;
const numberOfPeople = 10;
const nodes = Array(numberOfPeople).fill().map((_, index) => ({ cash: startingMoney, id: index }));
let activeNodes = [...nodes];
const transactionLogs = [];
let transactionNumber = 0;
let outOfBussiness = [];


function deal(n1, n2) {
    if (coinFlip()) {
        n1.cash -= 1;
        n2.cash += 1;
        if (n1.cash < 1) {
            outOfBussiness.push(n1);
            activeNodes = activeNodes.filter(node => node.id !== n1.id);
        }
        logTransactions(n1, n2)
    } else {
        n1.cash += 1;
        n2.cash -= 1;
        if (n2.cash < 1) {
            outOfBussiness.push(n2);
            activeNodes = activeNodes.filter(node => node.id !== n2.id);
        }
        logTransactions(n2, n1)
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

while (activeNodes.length > 1) {
    iteratre();
}
// console.log(transactionLogs);
console.log({ luckiest: activeNodes[0], outOfBussiness });

function pickRandomPerson () {
    return randomNumber(0, activeNodes.length - 1)
}
function logTransactions(giver, reciever) {
    const log = `${transactionNumber += 1}: ${giver.id} -> ${reciever.id}`;
    console.log(log);
    transactionLogs.push(log);
}
function randomNumber(min, max) {
    return (Math.random() * (max - min) + min).toFixed(0);
}
function coinFlip() {
    return Math.random() < .5;
};