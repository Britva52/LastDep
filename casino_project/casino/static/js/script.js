document.addEventListener('DOMContentLoaded', function() {
    // Основные элементы
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spinButton');

    // Состояние игры
    const state = {
        balance: 1000,
        currentBet: 0,
        selectedBet: null,
        isSpinning: false,
        currentRotation: 0,
        redNumbers: [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
    };

    // Инициализация колеса
    function initWheel() {
        // Создаем стрелку
        const arrow = document.createElement('div');
        arrow.className = 'wheel-arrow';
        document.querySelector('.wheel-wrapper').appendChild(arrow);

        // Начальная отрисовка
        drawWheel();
    }

    // Отрисовка колеса
    function drawWheel() {
        const center = canvas.width / 2;
        const radius = center - 20;
        const sectorAngle = (2 * Math.PI) / 37;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем 37 секторов (0-36)
        for (let i = 0; i <= 36; i++) {
            const startAngle = i * sectorAngle + state.currentRotation;
            const endAngle = startAngle + sectorAngle;
            const color = i === 0 ? 'green' : state.redNumbers.includes(i) ? 'red' : 'black';

            // Сектор
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.fillStyle = color;
            ctx.fill();

            // Номер
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(startAngle + sectorAngle / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(i, radius * 0.7, 0);
            ctx.restore();
        }

        // Центр колеса
        ctx.beginPath();
        ctx.arc(center, center, 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#ecf0f1';
        ctx.fill();
    }

    // Обработчики ставок
    function setupBetHandlers() {
        document.querySelectorAll('.number-bet, .outside-bet').forEach(bet => {
            bet.addEventListener('click', function() {
                if (state.isSpinning) return;

                // Снимаем выделение
                document.querySelectorAll('.number-bet, .outside-bet').forEach(b => {
                    b.classList.remove('selected');
                });

                // Выделяем текущую ставку
                this.classList.add('selected');
                state.selectedBet = this.dataset;
                console.log("Ставка на:", this.dataset);
            });
        });
    }

    // Вращение колеса
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
        const winningNumber = Math.floor(Math.random() * 37);
        const rotations = 5;
        const finalRotation = (rotations * 2 * Math.PI) + (winningNumber * (2 * Math.PI / 37)) + (Math.PI/2);

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

        animate();
    }

    // Завершение вращения
    function finishSpin(winningNumber) {
        state.isSpinning = false;
        let winAmount = 0;
        const winningColor = winningNumber === 0 ? 'green' :
                           state.redNumbers.includes(winningNumber) ? 'red' : 'black';

        // Проверка выигрыша
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

        highlightWinningNumber(winningNumber);
        updateUI();
    }

    // Вспомогательные функции
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
        document.getElementById('balance').textContent = state.balance;
        document.getElementById('currentBet').textContent = state.currentBet;
    }

    function easeOut(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }

    // Инициализация
    initWheel();
    setupBetHandlers();
    spinButton.addEventListener('click', spinWheel);
    updateUI();
});