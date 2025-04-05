const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

const sectors = [
    { label: '1', color: 'red', payout: 35 },
    { label: '2', color: 'black', payout: 35 },
    { label: '0', color: 'green', payout: 0 },
    { label: '3', color: 'red', payout: 35 },
    { label: '4', color: 'black', payout: 35 },
    { label: '5', color: 'red', payout: 35 },
    { label: '6', color: 'black', payout: 35 },
    { label: '7', color: 'red', payout: 35 },
    { label: '8', color: 'black', payout: 35 },
    { label: '9', color: 'red', payout: 35 },
    { label: '10', color: 'black', payout: 35 },

];

let balance = 100;
let bet = 0;
let currentRotation = 0;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const totalSectors = sectors.length;
    const anglePerSector = 2 * Math.PI / totalSectors;

    for (let i = 0; i < totalSectors; i++) {
        const startAngle = i * anglePerSector;
        const endAngle = startAngle + anglePerSector;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fillStyle = sectors[i].color;
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSector / 2);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(sectors[i].label, radius / 2, 5);
        ctx.restore();
    }
}

function spinWheel() {
    bet = parseInt(document.getElementById("betAmount").value);

    if (isNaN(bet) || bet <= 0) {
        alert("Пожалуйста, введите корректную ставку.");
        return;
    }

    if (bet > balance) {
        alert("Недостаточно средств");
        return;
    }

    balance -= bet;

    const winningSectorIndex = Math.floor(Math.random() * sectors.length);
    const winningSector = sectors[winningSectorIndex];

    let payout = 0;

    if (winningSector.payout > 0) {
        if (bet>0) {
         payout = bet * winningSector.payout;
        }
        else {
            payout = 0;
        }
    }

    balance += payout;

    document.getElementById("balance").innerText = `Баланс: ${balance}`;
    document.getElementById("result").innerText = `Выпало: ${winningSector.label}`;
    drawWheel();
}

drawWheel();
document.getElementById("spinButton").addEventListener("click", spinWheel);