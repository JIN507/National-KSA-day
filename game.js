<<<<<<< HEAD
// Saudi National Day Interactive Game
// Main Game Controller and Logic

class SaudiNationalDayGame {
    constructor() {
        this.currentGame = null;
        this.currentScreen = 'welcomeScreen';
        this.currentPlayer = null;
        this.highScores = this.loadHighScores();
        this.recentPlayers = this.loadRecentPlayers();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('welcomeScreen');
    }

    setupEventListeners() {
        // Welcome screen
        document.getElementById('startGameBtn').addEventListener('click', () => this.handlePlayerEntry());
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handlePlayerEntry();
            }
        });
        
        // Change player button
        document.getElementById('changePlayerBtn').addEventListener('click', () => this.showScreen('welcomeScreen'));

        // Game selection
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameType = e.currentTarget.dataset.game;
                this.startGame(gameType);
            });
        });

        // Back buttons
        document.getElementById('backToMenu').addEventListener('click', () => this.showMainMenu());
        document.getElementById('backToMenuMemory').addEventListener('click', () => this.showMainMenu());
        document.getElementById('backToMenuCatch').addEventListener('click', () => this.showMainMenu());
        document.getElementById('backToMainMenu').addEventListener('click', () => this.showMainMenu());
        
        // Game over actions
        document.getElementById('playAgain').addEventListener('click', () => this.restartCurrentGame());
    }

    handlePlayerEntry() {
        const playerName = document.getElementById('playerName').value.trim();
        if (playerName === '') {
            alert('الرجاء إدخال اسمك للمتابعة');
            return;
        }
        
        this.currentPlayer = playerName;
        this.addToRecentPlayers(playerName);
        this.showMainMenu();
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenName).classList.add('active');
        this.currentScreen = screenName;
        
        // Clear player name input when returning to welcome screen
        if (screenName === 'welcomeScreen') {
            document.getElementById('playerName').value = '';
            document.getElementById('playerName').focus();
        }
    }

    showMainMenu() {
        this.showScreen('mainMenu');
        this.displayPlayerGreeting();
        this.displayHighScores();
        this.displayRecentPlayers();
    }

    displayPlayerGreeting() {
        document.getElementById('currentPlayerName').textContent = this.currentPlayer;
    }

    startGame(gameType) {
        switch(gameType) {
            case 'quiz':
                this.currentGame = new QuizGame(this);
                this.showScreen('quizGame');
                this.currentGame.start();
                break;
            case 'memory':
                this.currentGame = new MemoryGame(this);
                this.showScreen('memoryGame');
                this.currentGame.start();
                break;
            case 'catch':
                console.log('Creating catch game...');
                this.currentGame = new CatchGame(this);
                console.log('Catch game created:', this.currentGame);
                this.showScreen('catchGame');
                if (this.currentGame) {
                    this.currentGame.start();
                } else {
                    console.error('Failed to create catch game');
                }
                break;
        }
    }

    restartCurrentGame() {
        if (this.currentGame) {
            this.currentGame.restart();
        }
    }

    gameOver(score, gameType) {
        this.saveHighScore(score, gameType);
        this.displayGameOver(score);
        this.displayHighScores();
    }

    displayGameOver(score) {
        document.getElementById('finalScore').textContent = score;
        
        // Use custom message if available, otherwise use default messages
        let message;
        if (this.lastGameMessage) {
            message = this.lastGameMessage;
            this.lastGameMessage = null; // Clear after use
        } else {
            const messages = [
                'ممتاز! أنت تعرف تاريخ المملكة جيداً',
                'رائع! استمر في التعلم عن تراثنا العظيم',
                'أحسنت! المملكة العربية السعودية لها تاريخ مجيد',
                'عمل رائع! فخور بمعرفتك بتاريخ الوطن'
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        }
        
        document.getElementById('celebrationMessage').innerHTML = message;
        this.showScreen('gameOverScreen');
    }

    saveHighScore(score, gameType) {
        if (!this.highScores[gameType]) {
            this.highScores[gameType] = [];
        }
        
        this.highScores[gameType].push({
            score: score,
            player: this.currentPlayer,
            date: new Date().toLocaleDateString('ar-SA')
        });
        
        this.highScores[gameType].sort((a, b) => b.score - a.score);
        this.highScores[gameType] = this.highScores[gameType].slice(0, 5);
        
        localStorage.setItem('saudiGameHighScores', JSON.stringify(this.highScores));
    }

    addToRecentPlayers(playerName) {
        // Remove if already exists
        this.recentPlayers = this.recentPlayers.filter(player => player.name !== playerName);
        
        // Add to beginning
        this.recentPlayers.unshift({
            name: playerName,
            lastPlayed: new Date().toLocaleDateString('ar-SA'),
            gamesPlayed: (this.recentPlayers.find(p => p.name === playerName)?.gamesPlayed || 0) + 1
        });
        
        // Keep only last 10 players
        this.recentPlayers = this.recentPlayers.slice(0, 10);
        
        localStorage.setItem('saudiGameRecentPlayers', JSON.stringify(this.recentPlayers));
    }

    loadRecentPlayers() {
        const saved = localStorage.getItem('saudiGameRecentPlayers');
        return saved ? JSON.parse(saved) : [];
    }

    loadHighScores() {
        const saved = localStorage.getItem('saudiGameHighScores');
        return saved ? JSON.parse(saved) : {};
    }

    displayHighScores() {
        const container = document.getElementById('highScoresList');
        container.innerHTML = '';
        
        const gameTypes = {
            'quiz': 'مسابقة وطنية',
            'memory': 'لعبة المطابقة',
            'catch': 'لعبة الالتقاط'
        };
        
        const hasScores = Object.keys(gameTypes).some(gameType => 
            this.highScores[gameType] && this.highScores[gameType].length > 0
        );
        
        if (!hasScores) {
            container.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">لا توجد نتائج بعد</p>';
            return;
        }
        
        Object.keys(gameTypes).forEach(gameType => {
            if (this.highScores[gameType] && this.highScores[gameType].length > 0) {
                const gameDiv = document.createElement('div');
                gameDiv.innerHTML = `
                    <h4>${gameTypes[gameType]}</h4>
                    <div class="scores-list">
                        ${this.highScores[gameType].slice(0, 3).map((score, index) => 
                            `<div class="score-item">
                                ${index + 1}. ${score.player || 'مجهول'} - ${score.score} نقطة
                            </div>`
                        ).join('')}
                    </div>
                `;
                container.appendChild(gameDiv);
            }
        });
    }

    displayRecentPlayers() {
        const container = document.getElementById('recentPlayersList');
        container.innerHTML = '';
        
        if (this.recentPlayers.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">لا يوجد لاعبون سابقون</p>';
            return;
        }
        
        this.recentPlayers.slice(0, 8).forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = `player-item ${player.name === this.currentPlayer ? 'current-player' : ''}`;
            playerDiv.innerHTML = `
                <span class="player-icon">${player.name === this.currentPlayer ? '👑' : '👤'}</span>
                <div>
                    <div style="font-weight: 600;">${player.name}</div>
                    <div style="font-size: 0.8rem; opacity: 0.7;">آخر لعب: ${player.lastPlayed}</div>
                </div>
            `;
            container.appendChild(playerDiv);
        });
    }
}

// Quiz Game Class
class QuizGame {
    constructor(gameController) {
        this.gameController = gameController;
        this.score = 0;
        this.currentQuestion = 0;
        this.timer = 30;
        this.timerInterval = null;
        this.questions = this.getSaudiQuestions();
    }

    getSaudiQuestions() {
        return [
            {
                question: "في أي عام تم توحيد المملكة العربية السعودية؟",
                answers: ["1932", "1925", "1930", "1935"],
                correct: 0
            },
            {
                question: "من هو مؤسس المملكة العربية السعودية؟",
                answers: ["الملك فيصل", "الملك عبدالعزيز", "الملك سعود", "الملك فهد"],
                correct: 1
            },
            {
                question: "ما هو اليوم الوطني للمملكة العربية السعودية؟",
                answers: ["23 سبتمبر", "25 سبتمبر", "1 أكتوبر", "15 أغسطس"],
                correct: 0
            },
            {
                question: "ما هي عاصمة المملكة العربية السعودية؟",
                answers: ["جدة", "مكة المكرمة", "الرياض", "الدمام"],
                correct: 2
            },
            {
                question: "في أي مدينة يقع قصر المصمك التاريخي؟",
                answers: ["الرياض", "جدة", "الطائف", "بريدة"],
                correct: 0
            },
            {
                question: "متى تم اكتشاف النفط في المملكة؟",
                answers: ["1938", "1940", "1935", "1942"],
                correct: 0
            },
            {
                question: "ما هو شعار المملكة العربية السعودية؟",
                answers: ["النسر", "الصقر", "السيفان والنخلة", "الأسد"],
                correct: 2
            },
            {
                question: "من هو الملك الحالي للمملكة العربية السعودية؟",
                answers: ["الملك سلمان", "الملك عبدالله", "الملك فهد", "الملك فيصل"],
                correct: 0
            },
            {
                question: "في أي منطقة تقع مدائن صالح الأثرية؟",
                answers: ["الرياض", "المدينة المنورة", "تبوك", "العلا"],
                correct: 3
            },
            {
                question: "متى انضمت المملكة إلى الأمم المتحدة؟",
                answers: ["1945", "1950", "1955", "1960"],
                correct: 0
            }
        ];
    }

    start() {
        this.score = 0;
        this.currentQuestion = 0;
        this.updateScore();
        this.showQuestion();
        this.startTimer();
    }

    restart() {
        this.gameController.showScreen('quizGame');
        this.start();
    }

    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestion];
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('questionNumber').textContent = this.currentQuestion + 1;
        
        const container = document.getElementById('answersContainer');
        container.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.addEventListener('click', () => this.selectAnswer(index));
            container.appendChild(button);
        });

        this.updateProgress();
        this.resetTimer();
    }

    selectAnswer(selectedIndex) {
        const question = this.questions[this.currentQuestion];
        const buttons = document.querySelectorAll('.answer-btn');
        
        buttons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && index !== question.correct) {
                btn.classList.add('incorrect');
            }
        });

        if (selectedIndex === question.correct) {
            this.score += 10;
            this.updateScore();
        }

        setTimeout(() => {
            this.currentQuestion++;
            this.showQuestion();
        }, 1500);
    }

    startTimer() {
        this.timer = 45;
        this.updateTimer();
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.updateTimer();
            if (this.timer <= 0) {
                this.selectAnswer(-1); // Time's up
            }
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.startTimer();
    }

    updateTimer() {
        document.getElementById('timer').textContent = this.timer;
    }

    updateScore() {
        document.getElementById('quizScore').textContent = this.score;
    }

    updateProgress() {
        const progress = ((this.currentQuestion) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.gameController.gameOver(this.score, 'quiz');
    }
}

// Memory Game Class
class MemoryGame {
    constructor(gameController) {
        this.gameController = gameController;
        this.score = 0;
        this.attempts = 0;
        this.matches = 0;
        this.flippedCards = [];
        this.startTime = null;
        this.timerInterval = null;
        this.cards = this.getSaudiLandmarks();
    }

    getSaudiLandmarks() {
        const questionAnswerPairs = [
            { id: 1, question: 'عاصمة منطقة عسير', answer: 'أبها' },
            { id: 2, question: 'عاصمة المنطقة الشرقية', answer: 'الدمام' },
            { id: 3, question: 'عاصمة منطقة تبوك', answer: 'تبوك' },
            { id: 4, question: 'عاصمة منطقة حائل', answer: 'حائل' },
            { id: 5, question: 'عاصمة منطقة الجوف', answer: 'سكاكا' },
            { id: 6, question: 'عاصمة منطقة نجران', answer: 'نجران' },
            { id: 7, question: 'عاصمة منطقة الباحة', answer: 'الباحة' },
            { id: 8, question: 'عاصمة منطقة جازان', answer: 'جازان' }
        ];
        
        // Create pairs with questions and answers
        const pairs = [];
        questionAnswerPairs.forEach(pair => {
            pairs.push({ id: pair.id, text: pair.question, type: 'question' });
            pairs.push({ id: pair.id, text: pair.answer, type: 'answer' });
        });
        
        return this.shuffleArray(pairs);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    start() {
        this.score = 0;
        this.attempts = 0;
        this.matches = 0;
        this.flippedCards = [];
        this.startTime = Date.now();
        this.createGrid();
        this.updateScore();
        this.startTimer();
    }

    restart() {
        this.gameController.showScreen('memoryGame');
        this.start();
    }

    createGrid() {
        const grid = document.getElementById('memoryGrid');
        grid.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.id = card.id;
            cardElement.dataset.index = index;
            cardElement.dataset.type = card.type;
            cardElement.innerHTML = '<span class="card-back">؟</span>';
            cardElement.addEventListener('click', () => this.flipCard(cardElement, card));
            grid.appendChild(cardElement);
        });
    }

    flipCard(cardElement, card) {
        if (cardElement.classList.contains('flipped') || 
            cardElement.classList.contains('matched') ||
            this.flippedCards.length >= 2) {
            return;
        }

        cardElement.classList.add('flipped');
        cardElement.innerHTML = `<span class="card-text ${card.type}">${card.text}</span>`;
        this.flippedCards.push({ element: cardElement, card: card });

        if (this.flippedCards.length === 2) {
            this.attempts++;
            this.updateScore();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [first, second] = this.flippedCards;
        
        if (first.card.id === second.card.id) {
            // Match found
            first.element.classList.add('matched');
            second.element.classList.add('matched');
            this.matches++;
            this.score += 20;
            
            if (this.matches === this.cards.length / 2) {
                this.endGame();
            }
        } else {
            // No match
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            first.element.innerHTML = '<span class="card-back">؟</span>';
            second.element.innerHTML = '<span class="card-back">؟</span>';
        }
        
        this.flippedCards = [];
        this.updateScore();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('memoryTimer').textContent = elapsed;
        }, 1000);
    }

    updateScore() {
        document.getElementById('memoryScore').textContent = this.score;
        document.getElementById('attempts').textContent = this.attempts;
    }

    endGame() {
        clearInterval(this.timerInterval);
        const timeBonus = Math.max(0, 100 - Math.floor((Date.now() - this.startTime) / 1000));
        this.score += timeBonus;
        this.gameController.gameOver(this.score, 'memory');
    }
}

// Catch Game Class
class CatchGame {
    constructor(gameController) {
        console.log('CatchGame constructor called');
        this.gameController = gameController;
        this.canvas = document.getElementById('gameCanvas');
        console.log('Canvas element:', this.canvas);
        
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        console.log('Canvas context:', this.ctx);
        
        if (!this.ctx) {
            console.error('Could not get 2D context!');
            return;
        }
        
        this.score = 0;
        this.lives = 1;
        this.gameRunning = false;
        this.player = { x: 360, y: 550, width: 80, height: 40 };
        this.fallingItems = [];
        this.gameSpeed = 1.5;
        this.spawnRate = 0.01;
        this.keyPressed = {};
        this.setupControls();
        
        console.log('CatchGame constructor completed');
    }

    setupControls() {
        if (!this.canvas) return;
        
        // Keyboard controls - smooth movement
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            this.keyPressed[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keyPressed[e.key] = false;
        });

        // Touch controls for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.gameRunning) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            
            if (x < this.canvas.width / 2) {
                this.player.x = Math.max(0, this.player.x - 40);
            } else {
                this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + 40);
            }
        });

        // Touch move for continuous movement
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.gameRunning) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            
            this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, x - this.player.width / 2));
        });
    }

    start() {
        console.log('Starting catch game...');
        
        if (!this.canvas || !this.ctx) {
            console.error('Canvas or context not available!');
            alert('خطأ: لا يمكن تشغيل لعبة الالتقاط. يرجى إعادة تحميل الصفحة.');
            return;
        }
        
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        
        this.score = 0;
        this.lives = 1; // Only one life - game ends on bomb catch
        this.fallingItems = [];
        this.gameSpeed = 1.5;
        this.spawnRate = 0.01;
        this.player.x = 360;
        this.keyPressed = {};
        this.gameRunning = true;
        this.updateScore();
        
        // Initial draw to show the canvas is working
        this.draw();
        this.gameLoop();
        
        console.log('Catch game started successfully');
    }

    restart() {
        this.gameController.showScreen('catchGame');
        this.start();
    }

    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Handle smooth keyboard movement
        if (this.keyPressed['ArrowLeft']) {
            this.player.x = Math.max(0, this.player.x - 5);
        }
        if (this.keyPressed['ArrowRight']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + 5);
        }

        // Spawn falling items
        if (Math.random() < this.spawnRate) {
            this.spawnItem();
        }

        // Update falling items (iterate backwards to avoid index issues)
        for (let i = this.fallingItems.length - 1; i >= 0; i--) {
            const item = this.fallingItems[i];
            item.y += this.gameSpeed;
            
            // Check collision with player
            if (this.checkCollision(item, this.player)) {
                if (item.type === 'good') {
                    this.score += 10;
                    // Check if player reached 200 points (win condition)
                    if (this.score >= 200) {
                        this.endGame('win');
                        return;
                    }
                } else {
                    // Catching bad items: bombs end game, other bad items deduct points
                    if (item.symbol === '💣') {
                        // Bomb ends the game immediately
                        this.endGame('bomb');
                        return;
                    } else {
                        // Other bad items deduct 10 points
                        this.score = Math.max(0, this.score - 10);
                        // Check if player lost all points
                        if (this.score <= 0) {
                            this.endGame('nopoints');
                            return;
                        }
                    }
                }
                this.fallingItems.splice(i, 1);
                this.updateScore();
                continue;
            }
            
            // Remove items that fell off screen
            if (item.y > this.canvas.height + 50) {
                // No points deducted for missing good items - game is for fun and learning!
                this.fallingItems.splice(i, 1);
            }
        }

        // Increase difficulty slowly
        this.gameSpeed += 0.001;
        this.spawnRate = Math.min(0.025, this.spawnRate + 0.0001);
    }

    spawnItem() {
        const goodItems = ['🇸🇦', '🌴', '🕋', '🏰', '⚔️', '🐪'];
        const badItems = ['💣', '⚡'];
        
        const isGood = Math.random() < 0.85; // 85% chance for good items
        const items = isGood ? goodItems : badItems;
        
        this.fallingItems.push({
            x: Math.random() * (this.canvas.width - 40),
            y: -40,
            width: 40,
            height: 40,
            type: isGood ? 'good' : 'bad',
            symbol: items[Math.floor(Math.random() * items.length)]
        });
    }

    checkCollision(item, player) {
        return item.x < player.x + player.width &&
               item.x + item.width > player.x &&
               item.y < player.y + player.height &&
               item.y + item.height > player.y;
    }

    draw() {
        if (!this.ctx || !this.canvas) {
            console.error('Canvas context not available for drawing');
            return;
        }
        
        try {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw background gradient
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#98FB98');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw player (basket) with better design
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
            this.ctx.fillStyle = '#D2691E';
            this.ctx.fillRect(this.player.x + 3, this.player.y + 3, this.player.width - 6, this.player.height - 6);
            
            // Draw basket handle
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.player.x + this.player.width/2, this.player.y - 5, 15, 0, Math.PI);
            this.ctx.stroke();
            
            // Draw falling items with shadow
            this.fallingItems.forEach(item => {
                if (item && item.symbol) {
                    // Draw shadow
                    this.ctx.font = '32px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    this.ctx.fillText(item.symbol, item.x + item.width/2 + 2, item.y + item.height - 3);
                    
                    // Draw item
                    this.ctx.fillStyle = item.type === 'good' ? '#000' : '#ff0000';
                    this.ctx.fillText(item.symbol, item.x + item.width/2, item.y + item.height - 5);
                }
            });
        } catch (error) {
            console.error('Error in draw function:', error);
        }
    }

    updateScore() {
        const scoreElement = document.getElementById('catchScore');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
        // Note: lives element removed from HTML, so we don't update it
    }

    endGame(reason = 'default') {
        this.gameRunning = false;
        
        // Set different celebration messages based on ending reason
        let celebrationMessage = '';
        switch(reason) {
            case 'win':
                celebrationMessage = '🎉 مبروك! وصلت إلى 200 نقطة! أنت بطل حقيقي! 🏆';
                break;
            case 'bomb':
                celebrationMessage = '💥 انفجرت القنبلة! حاول مرة أخرى وتجنب القنابل 🎯';
                break;
            case 'nopoints':
                celebrationMessage = '😔 فقدت جميع نقاطك! تجنب الرموز الخاطئة والتقط المزيد من الرموز السعودية 🇸🇦';
                break;
            default:
                celebrationMessage = 'لعبة رائعة! حاول مرة أخرى لتحسين نتيجتك 🎮';
        }
        
        // Store the celebration message temporarily
        this.gameController.lastGameMessage = celebrationMessage;
        this.gameController.gameOver(this.score, 'catch');
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SaudiNationalDayGame();
});
=======
const questions = [ 
  { q: "?? ?? ??? ?? ????? ??????? ??????? ?????????", options: ["????", "????", "????"], correct: 0 }, 
  { q: "??? ??? ??? ???????", options: ["??????", "???", "???????"], correct: 0 }, 
  { q: "?? ??? ??????? ??????? ??? ???.", options: ["????? ???????", "????? ????????", "??????"], correct: 0 } 
]; 
let current = 0; 
let score = 0; 
const qEl = document.getElementById("question"); 
const optEl = document.getElementById("options"); 
const scoreEl = document.getElementById("score"); 
const nextBtn = document.getElementById("next"); 
function loadQuestion() { 
  const q = questions[current]; 
  qEl.textContent = q.q; 
  optEl.innerHTML = ""; 
  q.options.forEach((opt,i) =
    const btn = document.createElement("button"); 
    btn.textContent = opt; 
    btn.onclick = () =
    optEl.appendChild(btn); 
  }); 
} 
function select(i) { 
  if(i === questions[current].correct) { score += 10; } else { score -= 5; } 
  scoreEl.textContent = "??????: " + score; 
} 
nextBtn.onclick = () =
  current++; 
  else { qEl.textContent = "????? ??????! ????? ?????: " + score; optEl.innerHTML = ""; nextBtn.style.display="none"; } 
} 
loadQuestion(); 
>>>>>>> 817c6a6365dcc873aafec47f06c68195a7976e00
