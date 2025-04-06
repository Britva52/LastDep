document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');

    if (!canvas) {
        console.error("Canvas элемент не найден!");
        return; // Важно: выходим из функции, если canvas не найден
    }

    if (!ctx) {
        console.error("Не удалось получить 2D контекст canvas!");
        return; // Важно: выходим из функции, если контекст не получен
    }

    const sectors = [
        { label: '0', color: 'green', payout: 35 },
        { label: '1', color: 'red', payout: 35 }, { label: '2', color: 'black', payout: 35 },
        { label: '3', color: 'red', payout: 35 }, { label: '4', color: 'black', payout: 35 },
        { label: '5', color: 'red', payout: 35 }, { label: '6', color: 'black', payout: 35 },
        { label: '7', color: 'red', payout: 35 }, { label: '8', color: 'black', payout: 35 },
        { label: '9', color: 'red', payout: 35 }, { label: '10', color: 'black', payout: 35 },
        { label: '11', color: 'red', payout: 35 }, { label: '12', color: 'black', payout: 35 },
        { label: '13', color: 'red', payout: 35 }, { label: '14', color: 'black', payout: 35 },
        { label: '15', color: 'red', payout: 35 }, { label: '16', color: 'black', payout: 35 },
        { label: '17', color: 'red', payout: 35 }, { label: '18', color: 'black', payout: 35 },
        { label: '19', color: 'red', payout: 35 }, { label: '20', color: 'black', payout: 35 },
        { label: '21', color: 'red', payout: 35 }, { label: '22', color: 'black', payout: 35 },
        { label: '23', color: 'red', payout: 35 }, { label: '24', color: 'black', payout: 35 },
        { label: '25', color: 'red', payout: 35 }, { label: '26', color: 'black', payout: 35 },
        { label: '27', color: 'red', payout: 35 }, { label: '28', color: 'black', payout: 35 },
        { label: '29', color: 'red', payout: 35 }, { label: '30', color: 'black', payout: 35 },
        { label: '31', color: 'red', payout: 35 }, { label: '32', color: 'black', payout: 35 },
        { label: '33', color: 'red', payout: 35 }, { label: '34', color: 'black', payout: 35 },
        { label: '35', color: 'red', payout: 35 }, { label: '36', color: 'black', payout: 35 }
    ];

    let balance = 100;
    let bet = 0;
    let currentRotation = 0;
    let selectedNumber = null;
    let spinning = false;

    function drawWheel() {
        if (!ctx) return; // Проверка, что ctx существует

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

    let payout = 0;
    // ***Добавлено: Случайные параметры анимации***
    const minDuration = 2500; // Минимальная длительность анимации (мс)
    const maxDuration = 4500; // Максимальная длительность анимации (мс)
    const animationDuration = Math.random() * (maxDuration - minDuration) + minDuration;

    const minRotationSpeed = 2 * Math.PI * 2; // Минимальная скорость вращения (оборотов в секунду)
    const maxRotationSpeed = 2 * Math.PI * 4; // Максимальная скорость вращения (оборотов в секунду)
    const rotationSpeed = Math.random() * (maxRotationSpeed - minRotationSpeed) + minRotationSpeed;

    // ***Добавлено: Случайный начальный сдвиг колеса***
    const randomInitialRotation = Math.random() * 2 * Math.PI;
    currentRotation = randomInitialRotation;

    let startTime = null;

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = currentTime - startTime;
        currentRotation = randomInitialRotation + (progress / animationDuration) * rotationSpeed; // rotationSpeed теперь влияет

        drawWheel();

        if (progress < animationDuration) {
            requestAnimationFrame(animate);
        } else {
            drawWheel(); // Ensure final draw

            let winningAngle = currentRotation % (2 * Math.PI);

            if (winningAngle < 0) {
                winningAngle += 2 * Math.PI;
            }

            let winningSectorIndex = -1;
            const anglePerSector = 2 * Math.PI / sectors.length;

            for (let i = 0; i < sectors.length; i++) {
                const startAngle = i * anglePerSector;
                const endAngle = (i + 1) * anglePerSector;

                if (winningAngle >= startAngle - Number.EPSILON && winningAngle < endAngle + Number.EPSILON) {
                    winningSectorIndex = i;
                    break;
                }
            }

            let winningNumber = null;
            if (winningSectorIndex !== -1) {
                winningNumber = sectors[winningSectorIndex].label;
            } else {
                console.error("Не удалось определить выигрышный сектор!");
            }

            console.log(`Выбранное число: ${selectedNumber}, Выпавшее число: ${winningNumber}, winningAngle: ${winningAngle}`);

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