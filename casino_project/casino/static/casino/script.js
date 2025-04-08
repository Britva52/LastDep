document.addEventListener('DOMContentLoaded', function() {
    // ===== КАСТОМНЫЙ КУРСОР =====
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    function updateCursor(e) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    }

    function toggleCustomCursor(enable) {
        if (enable) {
            document.body.classList.add('custom-cursor-enabled');
            document.addEventListener('mousemove', updateCursor);
        } else {
            document.body.classList.remove('custom-cursor-enabled');
            document.removeEventListener('mousemove', updateCursor);
        }
    }

    document.getElementById('toggleCursorBtn').addEventListener('click', () => {
        const isEnabled = document.body.classList.contains('custom-cursor-enabled');
        toggleCustomCursor(!isEnabled);
        localStorage.setItem('customCursorEnabled', !isEnabled);
    });

    // ===== ЛОГИКА РУЛЕТКИ =====
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = {
        balance: 1000,
        currentBet: 0,
        selectedBet: null,
        isSpinning: false,
        currentRotation: 0
    };

    // Создаем стрелку
    const arrow = document.createElement('div');
    arrow.className = 'wheel-arrow';
    document.querySelector('.wheel-wrapper').appendChild(arrow);

    // Правильные номера рулетки (0-36)
    const wheelNumbers = Array.from({length: 37}, (_, i) => i);
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const sectors = wheelNumbers.map(number => ({
        number,
        color: number === 0 ? 'green' : redNumbers.includes(number) ? 'red' : 'black'
    }));

    function drawWheel() {
        const center = canvas.width / 2;
        const radius = center - 20;
        const sectorAngle = (2 * Math.PI) / 37;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

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

        state.currentBet = parseInt(document.getElementById("betAmount").value);
        if (isNaN(state.currentBet) || state.currentBet <= 0) {
            alert("Введите корректную сумму ставки!");
            return;
        }

        if (state.currentBet > state.balance) {
            alert("Недостаточно средств!");
            return;
        }

        if (!state.selectedBet) {
            alert("Сделайте ставку!");
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
            state.currentRotation = easeOut(progress, 0, finalRotation, 1);
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
        let winAmount = 0;
        const winningColor = winningNumber === 0 ? 'green' : redNumbers.includes(winningNumber) ? 'red' : 'black';

        // Проверка выигрыша
        if (state.selectedBet) {
            switch(state.selectedBet.betType) {
                case 'number':
                    if (parseInt(state.selectedBet.number) === winningNumber) {
                        winAmount = state.currentBet * 35;
                        win = true;
                    }
                    break;

                case 'color':
                    if (state.selectedBet.color === winningColor) {
                        winAmount = state.currentBet * 1;
                        win = true;
                }
                break;

            case 'even':
                if (winningNumber !== 0 && winningNumber % 2 === 0) {
                    winAmount = state.currentBet * 1;
                    win = true;
                }
                break;

            case 'odd':
                if (winningNumber % 2 !== 0) {
                    winAmount = state.currentBet * 1;
                    win = true;
                }
                break;

            case 'range':
                const start = parseInt(state.selectedBet.rangeStart);
                const end = parseInt(state.selectedBet.rangeEnd);
                if (winningNumber >= start && winningNumber <= end) {
                    winAmount = state.currentBet * (end-start <= 12 ? 2 : 1);
                    win = true;
                }
                break;

            case 'column':
                const col = parseInt(state.selectedBet.column);
                if (winningNumber !== 0 && (winningNumber % 3) === (col % 3)) {
                    winAmount = state.currentBet * 2;
                    win = true;
                }
                break;
        }
        }

        if (winAmount > 0) {
            state.balance += winAmount + state.currentBet;
            displayResult(`ПОБЕДА! Выпало ${winningNumber} (${winningColor}). Выигрыш: ${winAmount}`, 'win');
        } else {
            displayResult(`Выпало: ${winningNumber} (${winningColor})`, 'lose');
        }

        updateUI();
        highlightWinningNumber(winningNumber);
    }

    function highlightWinningNumber(number) {
        document.querySelectorAll('.number-bet').forEach(bet => {
            bet.classList.remove('winning');
            if (parseInt(bet.dataset.number) === number) {
                bet.classList.add('winning');
            }
        });
    }

    function displayResult(message, type) {
        const resultElement = document.getElementById("result");
        if (resultElement) {
            resultElement.textContent = message;
            resultElement.className = `${type}-result result-display`;
        }
    }

    function updateUI() {
        const balanceEl = document.getElementById("balance");
        const betEl = document.getElementById("currentBet");
        if (balanceEl) balanceEl.textContent = state.balance;
        if (betEl) betEl.textContent = state.currentBet;
    }

    // Инициализация
    drawWheel();
    updateUI();
});