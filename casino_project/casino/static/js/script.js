document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spinButton');
    const wheelWrapper = document.querySelector('.wheel-wrapper');

    const state = {
        balance: 1000,
        currentBet: 0,
        selectedBet: null,
        isSpinning: false,
        currentRotation: 0,
        redNumbers: [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36],
        winningNumber: null
    };


    function drawWheel() {
        const center = canvas.width / 2;
        const radius = center - 20;
        const sectorAngle = (2 * Math.PI) / 37;
        const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i <= 36; i++) {
            const startAngle = i * sectorAngle + state.currentRotation;
            const endAngle = startAngle + sectorAngle;
            const num = numbers[i];
            const color = num === 0 ? 'green' : state.redNumbers.includes(num) ? 'red' : 'black';

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.fillStyle = color;
            ctx.fill();

            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + sectorAngle / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(num, radius * 0.7, 0);
            ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(center, center, 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#ecf0f1';
        ctx.fill();
    }


        const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        const numberIndex = numbers.indexOf(state.winningNumber);
        if (numberIndex === -1) return;


        const sectorAngle = (2 * Math.PI) / 37;
        const targetAngle = numberIndex * sectorAngle + state.currentRotation;

    }

    function spinWheel() {
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(el => el.remove());

        if (state.isSpinning) return;

        const betInput = document.getElementById("betAmount");
        state.currentBet = parseInt(betInput.value);

        if (isNaN(state.currentBet) || state.currentBet <= 0) {
            showError("Введите корректную сумму ставки!");
            return;
        }

        if (state.currentBet > state.balance) {
            showError("Недостаточно средств!");
            return;
        }

        if (!state.selectedBet) {
            showError("Сделайте ставку!");
            return;
        }

        state.isSpinning = true;
        state.balance -= state.currentBet;
        updateUI();

        const spinDuration = 3000;
        const startTime = Date.now();
        state.winningNumber = Math.floor(Math.random() * 37);
        const rotations = 5;
        const finalRotation = (rotations * 2 * Math.PI) - (state.winningNumber * (2 * Math.PI / 37)) - 0.1;

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            state.currentRotation = easeOut(progress, 0, finalRotation, 1);
            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                finishSpin(state.winningNumber);
            }
        }

        animate();
    }

    function finishSpin(winningNumber) {
        state.isSpinning = false;
        let winAmount = 0;
        const winningColor = winningNumber === 0 ? 'green' : state.redNumbers.includes(winningNumber) ? 'red' : 'black';

        if (state.selectedBet) {
            switch(state.selectedBet.betType) {
                case 'number':
                    if (parseInt(state.selectedBet.number) === winningNumber) {
                        winAmount = state.currentBet * 35;
                    }
                    break;
                case 'color':
                    if (state.selectedBet.color === winningColor) {
                        winAmount = state.currentBet * 1;
                    }
                    break;
                case 'even':
                    if (winningNumber !== 0 && winningNumber % 2 === 0) {
                        winAmount = state.currentBet * 1;
                    }
                    break;
                case 'odd':
                    if (winningNumber % 2 !== 0) {
                        winAmount = state.currentBet * 1;
                    }
                    break;
                case 'range':
                    const start = parseInt(state.selectedBet.rangeStart);
                    const end = parseInt(state.selectedBet.rangeEnd);
                    if (winningNumber >= start && winningNumber <= end) {
                        winAmount = state.currentBet * (end-start <= 12 ? 2 : 1);
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

        state.currentBet = 0;
        document.getElementById("betAmount").value = "";
        state.selectedBet = null;
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

        highlightWinningNumber(winningNumber);
        updateUI();

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
        const resultElement = document.getElementById('result');
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

        if (state.currentBet === 0) {
            document.getElementById("betAmount").value = "";
        }
    }

    function easeOut(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }

    function showError(message) {

        const existingError = document.querySelector('.error-message');
        if (existingError) return;

        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;

        const controls = document.querySelector('.game-controls');
        controls.appendChild(errorEl);

        setTimeout(() => {
            errorEl.remove();
        }, 2000);
    }

    // Инициализация
    initWheel();
    setupBetHandlers();
    spinButton.addEventListener('click', spinWheel);
    updateUI();
});