document.addEventListener('DOMContentLoaded', function() {
    // Кастомный золотой курсор
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    document.body.style.cursor = 'none';

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    const interactiveElements = document.querySelectorAll('button, input, .table-cell, a');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    // Логика рулетки
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const betInput = document.getElementById('betAmount');
    const balanceDisplay = document.getElementById('balance');
    const resultDisplay = document.getElementById('result');
    const spinButton = document.getElementById('spinButton');
    const selectedNumberDisplay = document.getElementById('selectedNumberDisplay');

    const state = {
        balance: 1000,
        currentBet: 0,
        selectedNumber: null,
        isSpinning: false,
        currentRotation: 0
    };

    const sectors = [];
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

    for (let i = 0; i <= 36; i++) {
        sectors.push({
            number: i,
            color: i === 0 ? 'green' : redNumbers.includes(i) ? 'red' : 'black',
            angle: (i * 2 * Math.PI) / 37
        });
    }

    function drawWheel() {
        const center = canvas.width / 2;
        const radius = center - 20;
        const sectorAngle = (2 * Math.PI) / sectors.length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#2c3e50';
        ctx.fill();

        sectors.forEach((sector, i) => {
            const startAngle = i * sectorAngle + state.currentRotation;
            const endAngle = startAngle + sectorAngle;

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.fillStyle = sector.color;
            ctx.fill();

            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + sectorAngle / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(sector.number, radius * 0.7, 0);
            ctx.restore();
        });

        ctx.beginPath();
        ctx.arc(center, center, 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#ecf0f1';
        ctx.fill();
    }

    function spinWheel() {
        if (state.isSpinning) return;

        state.currentBet = parseInt(betInput.value);
        if (isNaN(state.currentBet) || state.currentBet <= 0) {
            alert("Пожалуйста, введите корректную сумму ставки!");
            return;
        }

        if (state.currentBet > state.balance) {
            alert("Недостаточно средств на балансе!");
            return;
        }

        if (state.selectedNumber === null) {
            alert("Пожалуйста, выберите число!");
            return;
        }

        state.isSpinning = true;
        state.balance -= state.currentBet;
        updateUI();

        const spinDuration = 3000;
        const startTime = Date.now();
        const winningNumberIndex = Math.floor(Math.random() * 37);
        const winningNumber = sectors[winningNumberIndex].number;
        const rotations = 5;
        const finalRotation = (rotations * 2 * Math.PI) + (winningNumberIndex * (2 * Math.PI / 37)) + (Math.PI/2);

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            state.currentRotation = easeOut(progress, 0, finalRotation, spinDuration);

            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                finishSpin(winningNumber);
            }
        }

        requestAnimationFrame(animate);
    }

    function finishSpin(winningNumber) {
        state.isSpinning = false;

        if (winningNumber == state.selectedNumber) {
            const winAmount = state.currentBet * 35;
            state.balance += winAmount;
            resultDisplay.textContent = `Победа! Выпало ${winningNumber}. Выигрыш: ${winAmount}`;
            resultDisplay.className = 'win-result';
        } else {
            resultDisplay.textContent = `Проигрыш. Выпало: ${winningNumber}`;
            resultDisplay.className = 'lose-result';
        }

        updateUI();
    }

    function easeOut(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }

    function updateUI() {
        balanceDisplay.textContent = state.balance;
    }

    document.querySelectorAll('.table-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            if (state.isSpinning) return;

            document.querySelectorAll('.table-cell').forEach(c => {
                c.classList.remove('selected');
            });

            this.classList.add('selected');
            state.selectedNumber = parseInt(this.dataset.number);
            selectedNumberDisplay.textContent = state.selectedNumber;
        });
    });

    spinButton.addEventListener('click', spinWheel);

    drawWheel();
    updateUI();
});