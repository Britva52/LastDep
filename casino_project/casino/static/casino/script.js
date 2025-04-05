document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const sectors = [
        { label: '0', color: 'green', payout: 35 },
        { label: '1', color: 'red', payout: 35 }, { label: '2', color: 'black', payout: 35 },
        { label: '3', color: 'red', payout: 35 }, { label: '4', color: 'black', payout: 35 },
        { label: '5', color: 'red', payout: 35 }, { label: '6', color: 'black', payout: 35 },
        { label: '7', color: 'red', payout: 35 }, { label: '8', color: 'black', payout: 35 },
        { label: '9', color: 'red', payout: 35 }, { label: '10', color: 'black', payout: 35 },
        { label: '11', color: 'black', payout: 35 }, { label: '12', color: 'red', payout: 35 },
        { label: '13', color: 'black', payout: 35 }, { label: '14', color: 'red', payout: 35 },
        { label: '15', color: 'black', payout: 35 }, { label: '16', color: 'red', payout: 35 },
        { label: '17', color: 'black', payout: 35 }, { label: '18', color: 'red', payout: 35 },
        { label: '19', color: 'red', payout: 35 }, { label: '20', color: 'black', payout: 35 },
        { label: '21', color: 'red', payout: 35 }, { label: '22', color: 'black', payout: 35 },
        { label: '23', color: 'red', payout: 35 }, { label: '24', color: 'black', payout: 35 },
        { label: '25', color: 'red', payout: 35 }, { label: '26', color: 'black', payout: 35 },
        { label: '27', color: 'red', payout: 35 }, { label: '28', color: 'black', payout: 35 },
        { label: '29', color: 'black', payout: 35 }, { label: '30', color: 'red', payout: 35 },
        { label: '31', color: 'black', payout: 35 }, { label: '32', color: 'red', payout: 35 },
        { label: '33', color: 'black', payout: 35 }, { label: '34', color: 'red', payout: 35 },
        { label: '35', color: 'black', payout: 35 }, { label: '36', color: 'red', payout: 35 }
    ];

    let balance = 100;
    let bet = 0;
    let currentRotation = 0;
    let selectedNumber = null;
    let spinning = false;

    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        const totalSectors = sectors.length;
        const anglePerSector = 2 * Math.PI / totalSectors;

        for (let i = 0; i < totalSectors; i++) {
            const startAngle = i * anglePerSector + currentRotation;
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
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(sectors[i].label, radius / 2, 5);
            ctx.restore();
        }
    }

    function spinWheel() {
        if (spinning) return;
        spinning = true;

        bet = parseInt(document.getElementById("betAmount").value);

        if (isNaN(bet) || bet <= 0) {
            alert("Пожалуйста, введите корректную ставку.");
            spinning = false;
            return;
        }

        if (bet > balance) {
            alert("Недостаточно средств");
            spinning = false;
            return;
        }

        if (selectedNumber === null) {
            alert("Пожалуйста, выберите номер на столе.");
            spinning = false;
            return;
        }

        balance -= bet;
        updateBalance();

        const winningNumberIndex = Math.floor(Math.random() * sectors.length);
        const winningNumber = sectors[winningNumberIndex].label;

        let payout = 0;

        let animationDuration = 3000;
        let startTime = null;

        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            const rotationSpeed = 2 * Math.PI * 3;
            currentRotation = (progress / animationDuration) * rotationSpeed;
            drawWheel();

            if (progress < animationDuration) {
                requestAnimationFrame(animate);
            } else {
                currentRotation = winningNumberIndex * (2 * Math.PI / sectors.length);
                drawWheel();

                if (winningNumber == selectedNumber) {
                    payout = bet * 35;
                    balance += payout;
                    updateBalance();
                    displayResult(`Вы выиграли ${payout}! Выпало: ${winningNumber}`);
                } else {
                    displayResult(`Вы проиграли. Выпало: ${winningNumber}`);
                }
                spinning = false;
            }
        }
        requestAnimationFrame(animate);

        selectedNumber = null;
        document.getElementById('selectedNumberDisplay').innerText = '';
    }

    function updateBalance() {
        document.getElementById("balance").innerText = balance;
    }

    function displayResult(message) {
        document.getElementById("result").innerText = message;
    }

    document.querySelectorAll('.table-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            document.querySelectorAll('.table-cell').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedNumber = this.dataset.number;
            document.getElementById('selectedNumberDisplay').innerText = selectedNumber;
            console.log('Выбрано число:', selectedNumber);
        });
    });

    drawWheel();
    updateBalance();
    document.getElementById("spinButton").addEventListener("click", spinWheel);
});