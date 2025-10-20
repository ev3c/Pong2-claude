// Configuración del Canvas
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Variables de orientación
let isPortrait = false;
let canvasBaseWidth = 800;
let canvasBaseHeight = 500;

// Funciones de pantalla completa y orientación deshabilitadas por preferencia del usuario

// Detectar orientación de pantalla
function detectOrientation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return height > width; // true = vertical, false = horizontal
}

// Ajustar tamaño del canvas según orientación y tamaño de pantalla
function adjustCanvasSize() {
    isPortrait = detectOrientation();
    
    if (isTouchDevice()) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Determinar tipo de dispositivo usando los mismos rangos que detectAndShowDeviceType
        let isTablet, isSmartphone;
        
        if (isPortrait) {
            // Portrait mode
            isSmartphone = screenWidth <= 768;
            isTablet = screenWidth > 768 && screenWidth <= 1024;
        } else {
            // Landscape mode
            isSmartphone = screenWidth <= 896;
            isTablet = screenWidth > 896 && screenWidth <= 1366;
        }
        
        if (isPortrait) {
            // MODO VERTICAL
            if (isTablet) {
                // TABLET: Canvas un poco más pequeño
                canvasBaseWidth = Math.floor(screenWidth * 0.88);
                const reservedHeight = 280; // Más espacio para controles en tablet
                canvasBaseHeight = Math.max(350, Math.floor(screenHeight - reservedHeight));
                console.log('📱 TABLET Vertical:', canvasBaseWidth, 'x', canvasBaseHeight);
            } else if (isSmartphone) {
                // SMARTPHONE: Canvas muy pequeño
                canvasBaseWidth = Math.floor(screenWidth * 0.92);
                const reservedHeight = 250; // Espacio para header, score, controls
                canvasBaseHeight = Math.max(200, Math.floor(screenHeight - reservedHeight));
                console.log('📱 SMARTPHONE Vertical:', canvasBaseWidth, 'x', canvasBaseHeight);
            }
        } else {
            // MODO HORIZONTAL
            let sliderWidth = 30;
            let gapWidth = 5;
            let bodyPadding = 4;
            let containerPadding = 10;
            let reservedHeightLandscape = 120;
            
            if (isTablet) {
                // TABLET Horizontal: Canvas un poco más pequeño
                sliderWidth = 38;
                gapWidth = 10;
                bodyPadding = 24; // 12px * 2
                containerPadding = 40; // 20px * 2
                reservedHeightLandscape = 140;
                console.log('📱 TABLET Horizontal detectado');
            } else if (isSmartphone) {
                // SMARTPHONE Horizontal: Canvas muy pequeño
                if (screenHeight < 450) {
                    sliderWidth = 25;
                    gapWidth = 3;
                    bodyPadding = 2;
                    containerPadding = 6;
                }
                reservedHeightLandscape = 120;
                console.log('📱 SMARTPHONE Horizontal detectado');
            }
            
            // Calcular espacio total ocupado por sliders (siempre ambos sliders visibles)
            const marginSafety = 10;
            const sliderSpace = sliderWidth * 2 + gapWidth * 2 + bodyPadding + containerPadding + marginSafety;
            
            canvasBaseWidth = Math.floor(screenWidth - sliderSpace);
            
            if (isTablet) {
                // Tablet: altura más controlada
                canvasBaseHeight = Math.max(300, Math.floor(screenHeight - reservedHeightLandscape));
            } else {
                // Smartphone: altura mínima
                canvasBaseHeight = Math.max(180, Math.floor(screenHeight - reservedHeightLandscape));
            }
            
            console.log('📱 Canvas:', canvasBaseWidth, 'x', canvasBaseHeight);
        }
    } else {
        // LAPTOP/DESKTOP: ajustar para que las barras sean visibles
        const sliderWidth = 40; // Ancho de cada slider
        const gapWidth = 15; // Espacio entre slider y canvas
        const bodyPadding = 40; // padding del body
        const containerPadding = 60; // padding del container
        const marginSafety = 20;
        const sliderSpace = sliderWidth * 2 + gapWidth * 2 + bodyPadding + containerPadding + marginSafety;
        
        // Calcular ancho disponible
        const availableWidth = Math.min(window.innerWidth, 1200) - sliderSpace;
        canvasBaseWidth = Math.min(700, Math.max(500, availableWidth));
        canvasBaseHeight = 500;
        console.log('💻 DESKTOP:', canvasBaseWidth, 'x', canvasBaseHeight, '| Espacio sliders:', sliderSpace);
    }
    
    // Aplicar nuevo tamaño
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    canvas.width = canvasBaseWidth;
    canvas.height = canvasBaseHeight;
    
    // Ajustar altura de los sliders siempre (táctiles y desktop)
    if (touchSlider) {
        touchSlider.style.height = canvasBaseHeight + 'px';
    }
    if (touchSliderLeft) {
        touchSliderLeft.style.height = canvasBaseHeight + 'px';
    }
    
    // Ajustar posiciones de elementos proporcionalmente
    if (oldWidth !== canvasBaseWidth || oldHeight !== canvasBaseHeight) {
        const widthRatio = canvasBaseWidth / oldWidth;
        const heightRatio = canvasBaseHeight / oldHeight;
        
        player.x = canvasBaseWidth - 20;
        player.y = (player.y * heightRatio);
        computer.y = (computer.y * heightRatio);
        ball.x = (ball.x * widthRatio);
        ball.y = (ball.y * heightRatio);
    }
    
    draw();
}

// Establecer el tamaño inicial del canvas
canvas.width = 800;
canvas.height = 500;

// Ajustar al cargar
setTimeout(() => adjustCanvasSize(), 100);

// Elementos del DOM
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const menuButton = document.getElementById('menuButton');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverText = document.getElementById('gameOverText');
const winnerText = document.getElementById('winnerText');
const playAgainButton = document.getElementById('playAgainButton');
const musicToggle = document.getElementById('musicToggle');
const soundToggle = document.getElementById('soundToggle');
const touchSlider = document.getElementById('touchSlider');
const sliderKnob = document.getElementById('sliderKnob');
const touchSliderLeft = document.getElementById('touchSliderLeft');
const sliderKnobLeft = document.getElementById('sliderKnobLeft');
const levelNumber = document.getElementById('levelNumber');
const gameModeSelect = document.getElementById('gameMode');
const computerScoreLabel = document.querySelector('.computer-score .label');

// Variables del juego
let gameRunning = false;
let animationId;
let mouseY = canvas.height / 2;
let gameMode = 1; // 1 = vs Computadora, 2 = 2 Jugadores

// Sistema de Audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let musicEnabled = true;
let soundEnabled = true;
let backgroundMusic = null;
let musicGainNode = null;

// Variables del control táctil - Jugador 1 (derecha)
let isTouching = false;
let touchStartY = 0;
let playerStartY = 0;
const touchSensitivity = 2; // Multiplicador de sensibilidad (mayor = más sensible)

// Variables del slider - Jugador 1
let isSliderActive = false;

// Variables del control táctil - Jugador 2 (izquierda)
let isTouchingLeft = false;
let touchStartYLeft = 0;
let computerStartY = 0;

// Variables del slider - Jugador 2
let isSliderActiveLeft = false;

// Puntuaciones
let playerScore = 0;
let computerScore = 0;
const winningScore = 5;

// Sistema de niveles
let currentLevel = 1;
let computerBaseSpeed = 3; // Velocidad inicial más lenta

// Detectar si es dispositivo táctil (smartphone/tablet)
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
};

// Variables para errores de la computadora en móviles
let computerErrorChance = 0.3; // 30% de probabilidad de error inicial en móviles
let computerReactionDelay = 0;

// Función para obtener posición inicial vertical centrada
function getCenterY() {
    return canvas.height / 2 - 35;
}

// Paleta del jugador (ahora a la derecha)
const player = {
    x: canvas.width - 20,
    y: getCenterY(),
    width: 10,
    height: 70,
    speed: 8,
    dy: 0
};

// Paleta de la computadora / Jugador 2 (ahora a la izquierda)
const computer = {
    x: 10,
    y: getCenterY(),
    width: 10,
    height: 70,
    speed: 3, // Velocidad inicial baja
    dy: 0 // Velocidad de movimiento para modo 2 jugadores
};

// Pelota
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speed: 5,
    dx: 5,
    dy: 5,
    paused: false // Control de pausa entre puntos
};

// Funciones de Audio
function playSound(frequency, duration, type = 'sine') {
    if (!soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playPaddleHit() {
    playSound(440, 0.1, 'square');
}

function playWallHit() {
    playSound(220, 0.1, 'sine');
}

function playScore() {
    playSound(330, 0.2, 'triangle');
}

function playWin() {
    playSound(523, 0.3, 'sine');
    setTimeout(() => playSound(659, 0.3, 'sine'), 150);
    setTimeout(() => playSound(784, 0.4, 'sine'), 300);
}

function playLose() {
    playSound(392, 0.3, 'sawtooth');
    setTimeout(() => playSound(330, 0.3, 'sawtooth'), 150);
    setTimeout(() => playSound(262, 0.4, 'sawtooth'), 300);
}

function startBackgroundMusic() {
    if (!musicEnabled || backgroundMusic) return;
    
    musicGainNode = audioContext.createGain();
    musicGainNode.gain.value = 0.1;
    musicGainNode.connect(audioContext.destination);
    
    // Crear una melodía de fondo simple
    const notes = [262, 294, 330, 349, 392, 440, 494, 523]; // Do, Re, Mi, Fa, Sol, La, Si, Do
    let noteIndex = 0;
    
    function playNextNote() {
        if (!musicEnabled) return;
        
        const oscillator = audioContext.createOscillator();
        oscillator.connect(musicGainNode);
        oscillator.frequency.value = notes[noteIndex % notes.length];
        oscillator.type = 'triangle';
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        noteIndex++;
        backgroundMusic = setTimeout(playNextNote, 400);
    }
    
    playNextNote();
}

function stopBackgroundMusic() {
    if (backgroundMusic) {
        clearTimeout(backgroundMusic);
        backgroundMusic = null;
    }
    if (musicGainNode) {
        musicGainNode.disconnect();
        musicGainNode = null;
    }
}

// Dibujar rectángulo con bordes redondeados
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

// Dibujar la paleta del jugador
function drawPlayer() {
    ctx.fillStyle = '#00ff88';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff88';
    drawRoundedRect(player.x, player.y, player.width, player.height, 5);
    ctx.shadowBlur = 0;
}

// Dibujar la paleta de la computadora
function drawComputer() {
    ctx.fillStyle = '#ff4757';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff4757';
    drawRoundedRect(computer.x, computer.y, computer.width, computer.height, 5);
    ctx.shadowBlur = 0;
}

// Dibujar la pelota
function drawBall() {
    ctx.fillStyle = '#ffa502';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffa502';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

// Dibujar la línea central
function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Dibujar todo
function draw() {
    // Limpiar canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar elementos
    drawCenterLine();
    drawPlayer();
    drawComputer();
    drawBall();
    
    // Mostrar mensaje de pausa solo si el juego no está corriendo y estamos en la pantalla de juego
    if (!gameRunning && gameScreen.classList.contains('active')) {
        ctx.save();
        
        // Texto principal
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = `bold ${Math.floor(canvas.width / 20)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        
        const message = isTouchDevice() ? '👆 Toca para Continuar' : '🖱️ Haz Clic para Continuar';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
        
        // Animación de pulso
        const pulseOpacity = 0.5 + Math.sin(Date.now() / 500) * 0.3;
        ctx.fillStyle = `rgba(102, 126, 234, ${pulseOpacity})`;
        ctx.font = `${Math.floor(canvas.width / 30)}px Arial`;
        ctx.fillText('▶', canvas.width / 2, canvas.height / 2 + canvas.height / 8);
        
        ctx.restore();
    }
}

// Mover la paleta del jugador
function movePlayer() {
    player.y += player.dy;
    
    // Límites de la pantalla
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
    
    // Actualizar posición del slider knob
    updateSliderPosition();
}

// Actualizar posición visual del slider knob (Jugador 1)
function updateSliderPosition() {
    if (!touchSlider) return;
    
    const sliderHeight = touchSlider.offsetHeight;
    const knobHeight = sliderKnob.offsetHeight;
    const maxY = sliderHeight - knobHeight;
    
    // Calcular posición del knob basada en la posición del jugador
    const playerPercent = player.y / (canvas.height - player.height);
    const knobY = playerPercent * maxY;
    
    sliderKnob.style.top = knobY + 'px';
}

// Actualizar posición visual del slider knob izquierdo (Jugador 2 / Computadora)
function updateSliderPositionLeft() {
    if (!touchSliderLeft) return;
    
    const sliderHeight = touchSliderLeft.offsetHeight;
    const knobHeight = sliderKnobLeft.offsetHeight;
    const maxY = sliderHeight - knobHeight;
    
    // Calcular posición del knob basada en la posición del jugador 2 / computadora
    const computerPercent = computer.y / (canvas.height - computer.height);
    const knobY = computerPercent * maxY;
    
    sliderKnobLeft.style.top = knobY + 'px';
}

// IA de la computadora o control del Jugador 2
function moveComputer() {
    // En modo 2 jugadores, mover con controles manuales
    if (gameMode === 2) {
        computer.y += computer.dy;
        
        // Límites de la pantalla
        if (computer.y < 0) {
            computer.y = 0;
        }
        if (computer.y + computer.height > canvas.height) {
            computer.y = canvas.height - computer.height;
        }
        
        // Actualizar posición del slider knob izquierdo
        updateSliderPositionLeft();
        return;
    }
    
    // Modo 1 jugador - IA de la computadora
    const computerCenter = computer.y + computer.height / 2;
    
    // En móviles, agregar errores y retrasos según el nivel
    if (isTouchDevice()) {
        // Calcular probabilidad de error basada en el nivel (disminuye al subir)
        computerErrorChance = Math.max(0.05, 0.3 - (currentLevel - 1) * 0.05);
        
        // Agregar un margen de error aleatorio
        const errorMargin = Math.random() < computerErrorChance ? 
            (Math.random() - 0.5) * 100 : 0; // Error de hasta ±50 píxeles
        
        // Zona muerta más grande en niveles bajos (la computadora reacciona peor)
        const deadZone = Math.max(20, 50 - (currentLevel - 1) * 5);
        
        // A veces la computadora "se distrae" y no sigue la pelota
        if (Math.random() < computerErrorChance / 2) {
            // No mover (error/distracción)
            return;
        }
        
        // Seguir la pelota con el error y zona muerta
        const targetY = ball.y + errorMargin;
        
        if (computerCenter < targetY - deadZone) {
            computer.y += computer.speed;
        } else if (computerCenter > targetY + deadZone) {
            computer.y -= computer.speed;
        }
    } else {
        // En desktop, juego normal sin errores
        if (computerCenter < ball.y - 35) {
            computer.y += computer.speed;
        } else if (computerCenter > ball.y + 35) {
            computer.y -= computer.speed;
        }
    }
    
    // Límites de la pantalla
    if (computer.y < 0) {
        computer.y = 0;
    }
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
    
    // Actualizar posición del slider knob izquierdo siempre
    updateSliderPositionLeft();
}

// Mover la pelota
function moveBall() {
    // No mover la pelota si está pausada
    if (ball.paused) return;
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Rebote en paredes superior e inferior
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
        playWallHit();
    }
    
    // Colisión con la paleta del jugador (ahora a la derecha)
    if (ball.x + ball.radius > player.x &&
        ball.y > player.y &&
        ball.y < player.y + player.height) {
        
        // Calcular ángulo de rebote basado en dónde golpeó la paleta
        const hitPos = (ball.y - player.y) / player.height;
        const angle = (hitPos - 0.5) * Math.PI / 3; // Máximo 60 grados
        
        ball.dx = -Math.abs(ball.dx);
        ball.dy = ball.speed * Math.sin(angle);
        
        // Aumentar ligeramente la velocidad (menos en móviles)
        const speedIncrease = isTouchDevice() ? 1.01 : 1.03;
        ball.speed *= speedIncrease;
        ball.dx = -ball.speed * Math.cos(angle);
        
        playPaddleHit();
    }
    
    // Colisión con la paleta de la computadora (ahora a la izquierda)
    if (ball.x - ball.radius < computer.x + computer.width &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        
        // Calcular ángulo de rebote
        const hitPos = (ball.y - computer.y) / computer.height;
        const angle = (hitPos - 0.5) * Math.PI / 3;
        
        ball.dx = Math.abs(ball.dx);
        ball.dy = ball.speed * Math.sin(angle);
        
        // Aumentar ligeramente la velocidad (menos en móviles)
        const speedIncrease = isTouchDevice() ? 1.01 : 1.03;
        ball.speed *= speedIncrease;
        ball.dx = ball.speed * Math.cos(angle);
        
        playPaddleHit();
    }
    
    // Punto para el jugador (la pelota salió por la izquierda)
    if (ball.x - ball.radius < 0) {
        playerScore++;
        updateScore();
        playScore();
        resetBall(); // Resetear inmediatamente al centro
        ball.paused = true; // Pero mantenerla pausada
        setTimeout(() => {
            ball.paused = false; // Después de 250ms, permitir que se mueva
        }, 250);
        checkWinner();
    }
    
    // Punto para la computadora (la pelota salió por la derecha)
    if (ball.x + ball.radius > canvas.width) {
        computerScore++;
        updateScore();
        playScore();
        resetBall(); // Resetear inmediatamente al centro
        ball.paused = true; // Pero mantenerla pausada
        setTimeout(() => {
            ball.paused = false; // Después de 250ms, permitir que se mueva
        }, 250);
        checkWinner();
    }
}

// Reiniciar la pelota
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Velocidad más lenta en dispositivos móviles
    ball.speed = isTouchDevice() ? 2.5 : 3.5;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
    // La pelota se coloca en el centro con dirección, pero ball.paused controla si se mueve
}

// Actualizar puntuación
function updateScore() {
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
}

// Verificar ganador
function checkWinner() {
    if (playerScore >= winningScore) {
        playWin();
        
        if (gameMode === 2) {
            // Modo 2 jugadores
            endGame('¡Jugador 1 Gana!', '🎉 ¡Felicidades! El Jugador 1 (derecha/verde) ha ganado la partida.');
        } else {
            // Modo 1 jugador - avanzar de nivel
            currentLevel++;
            levelNumber.textContent = currentLevel;
            const newSpeed = Math.min(computerBaseSpeed + (currentLevel - 1) * 0.5, 7);
            computer.speed = newSpeed;
            
            let message = `🎉 ¡Pasas al Nivel ${currentLevel}! `;
            if (isTouchDevice()) {
                message += 'La computadora será más rápida y cometerá menos errores 🚀';
            } else {
                message += 'La computadora será más rápida 🚀';
            }
            
            endGame(
                `¡Nivel ${currentLevel - 1} Completado!`, 
                message
            );
        }
    } else if (computerScore >= winningScore) {
        playLose();
        
        if (gameMode === 2) {
            // Modo 2 jugadores
            endGame('¡Jugador 2 Gana!', '🎉 ¡Felicidades! El Jugador 2 (izquierda/rojo) ha ganado la partida.');
        } else {
            // Modo 1 jugador
            endGame('¡Juego Terminado!', `😔 Perdiste en el Nivel ${currentLevel}. ¡Inténtalo de nuevo!`);
        }
    }
}

// Finalizar juego
function endGame(title, message) {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    stopBackgroundMusic();
    gameOverText.textContent = title;
    winnerText.textContent = message;
    gameOverModal.classList.add('active');
}

// Loop principal del juego
function gameLoop() {
    if (!gameRunning) return;
    
    movePlayer();
    moveComputer();
    moveBall();
    draw();
    
    animationId = requestAnimationFrame(gameLoop);
}

// Cambiar a la pantalla de juego
function showGameScreen() {
    menuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    // Ajustar el canvas después de mostrar la pantalla
    setTimeout(() => {
        adjustCanvasSize();
        updateSliderPosition();
        updateSliderPositionLeft();
        draw();
    }, 100);
}

// Cambiar a la pantalla de menú
function showMenuScreen() {
    gameScreen.classList.remove('active');
    menuScreen.classList.add('active');
}

// Iniciar juego
function startGame() {
    if (gameRunning) return;
    
    // Reanudar el contexto de audio si está suspendido
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    // Cambiar a la pantalla de juego
    showGameScreen();
    
    gameRunning = true;
    startBackgroundMusic();
    
    // Centrar la pista en la pantalla
    scrollToCanvas();
    
    gameLoop();
}

// Función para centrar el canvas en la pantalla
function scrollToCanvas() {
    // Usar setTimeout para asegurar que el scroll se ejecuta después de que el DOM esté listo
    setTimeout(() => {
        // En dispositivos móviles, usar 'nearest' para evitar problemas con el teclado virtual
        const scrollBehavior = isTouchDevice() ? 'nearest' : 'center';
        
        canvas.scrollIntoView({
            behavior: 'smooth',
            block: scrollBehavior,
            inline: 'center'
        });
        
        // En dispositivos móviles, hacer un scroll adicional para asegurar visibilidad completa
        if (isTouchDevice()) {
            setTimeout(() => {
                const rect = canvas.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Si el canvas no está completamente visible, ajustar
                if (rect.bottom > viewportHeight || rect.top < 0) {
                    window.scrollBy({
                        top: rect.top - (viewportHeight - rect.height) / 2,
                        behavior: 'smooth'
                    });
                }
            }, 200);
        }
    }, 100);
}

// Pausar juego
function pauseGame() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    pauseButton.textContent = 'Reanudar';
    stopBackgroundMusic();
    
    // Reiniciar animación del mensaje de inicio
    animateStartMessage();
}

// Reanudar juego
function resumeGame() {
    if (gameRunning) return;
    
    // Reanudar el contexto de audio si está suspendido
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    gameRunning = true;
    pauseButton.textContent = 'Pausar';
    startBackgroundMusic();
    
    gameLoop();
}

// Volver al menú
function goToMenu() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    stopBackgroundMusic();
    
    showMenuScreen();
}

// Reiniciar juego (reinicia todo, incluyendo nivel)
function resetGame() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    stopBackgroundMusic();
    
    playerScore = 0;
    computerScore = 0;
    currentLevel = 1;
    levelNumber.textContent = currentLevel;
    computer.speed = computerBaseSpeed;
    
    // Reiniciar errores de la computadora en móviles
    if (isTouchDevice()) {
        computerErrorChance = 0.3; // Volver a 30% de error inicial
    }
    
    updateScore();
    
    player.x = canvas.width - 20;
    player.y = getCenterY();
    computer.y = getCenterY();
    resetBall();
    ball.paused = false; // Asegurar que no esté pausada
    
    pauseButton.textContent = 'Pausar';
    draw();
    
    // Reiniciar la partida automáticamente
    startGame();
}

// Control con el mouse desactivado - usar solo teclado
// canvas.addEventListener('mousemove', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     mouseY = e.clientY - rect.top;
//     
//     if (gameRunning) {
//         player.y = mouseY - player.height / 2;
//     }
// });

// Control con teclado
document.addEventListener('keydown', (e) => {
    // Jugador 1 (derecha) - Flechas
    if (e.key === 'ArrowUp') {
        e.preventDefault(); // Prevenir el scroll de la página
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown') {
        e.preventDefault(); // Prevenir el scroll de la página
        player.dy = player.speed;
    }
    
    // Jugador 2 (izquierda) - W y S (solo en modo 2 jugadores)
    if (gameMode === 2) {
        if (e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            computer.dy = -player.speed; // Usar la misma velocidad que el jugador
        } else if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            computer.dy = player.speed;
        }
    }
});

document.addEventListener('keyup', (e) => {
    // Jugador 1 (derecha)
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault(); // Prevenir el scroll de la página
        player.dy = 0;
    }
    
    // Jugador 2 (izquierda) - solo en modo 2 jugadores
    if (gameMode === 2) {
        if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
            e.preventDefault();
            computer.dy = 0;
        }
    }
});

// Reanudar juego al pulsar en el canvas (solo si está en pausa)
canvas.addEventListener('click', (e) => {
    if (!gameRunning && gameScreen.classList.contains('active')) {
        resumeGame();
    }
});

// Control táctil directo sobre el canvas (toda la pantalla con sensibilidad amplificada)
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    
    // Si el juego no está corriendo y estamos en la pantalla de juego, reanudarlo
    if (!gameRunning && gameScreen.classList.contains('active')) {
        resumeGame();
        // Pequeño delay para que el juego arranque antes de procesar el toque
        setTimeout(() => {
            if (!gameRunning) return;
        }, 50);
        return;
    }
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    // Determinar si el toque es en la mitad izquierda o derecha
    if (gameMode === 2 && touchX < canvas.width / 2) {
        // Toque en la mitad izquierda - controlar jugador 2
        isTouchingLeft = true;
        touchStartYLeft = touchY;
        computerStartY = computer.y;
    } else {
        // Toque en la mitad derecha (o cualquier lado en modo 1 jugador) - controlar jugador 1
        isTouching = true;
        touchStartY = touchY;
        playerStartY = player.y;
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!gameRunning) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchY = touch.clientY - rect.top;
    
    // Mover jugador 1 (derecha)
    if (isTouching) {
        // Calcular el movimiento del dedo
        const deltaY = touchY - touchStartY;
        
        // Aplicar sensibilidad amplificada
        const amplifiedDelta = deltaY * touchSensitivity;
        
        // Mover la barra con el delta amplificado
        player.y = playerStartY + amplifiedDelta;
        
        // Limitar a los bordes del canvas
        if (player.y < 0) {
            player.y = 0;
        }
        if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
        }
    }
    
    // Mover jugador 2 (izquierda) - solo en modo 2 jugadores
    if (isTouchingLeft && gameMode === 2) {
        // Calcular el movimiento del dedo
        const deltaY = touchY - touchStartYLeft;
        
        // Aplicar sensibilidad amplificada
        const amplifiedDelta = deltaY * touchSensitivity;
        
        // Mover la barra con el delta amplificado
        computer.y = computerStartY + amplifiedDelta;
        
        // Limitar a los bordes del canvas
        if (computer.y < 0) {
            computer.y = 0;
        }
        if (computer.y + computer.height > canvas.height) {
            computer.y = canvas.height - computer.height;
        }
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isTouching = false;
    isTouchingLeft = false;
    player.dy = 0;
    if (gameMode === 2) {
        computer.dy = 0;
    }
}, { passive: false });

// Control del slider táctil
sliderKnob.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!gameRunning) return;
    
    isSliderActive = true;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isSliderActive || !gameRunning) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const sliderRect = touchSlider.getBoundingClientRect();
    const touchY = touch.clientY - sliderRect.top;
    
    // Calcular posición del jugador basada en la posición del toque en el slider
    const sliderHeight = touchSlider.offsetHeight;
    const knobHeight = sliderKnob.offsetHeight;
    const maxY = sliderHeight - knobHeight;
    
    // Limitar touchY dentro del slider
    const clampedY = Math.max(0, Math.min(touchY - knobHeight / 2, maxY));
    
    // Calcular posición del jugador
    const percent = clampedY / maxY;
    player.y = percent * (canvas.height - player.height);
    
    // Limitar al canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
    
    updateSliderPosition();
}, { passive: false });

document.addEventListener('touchend', () => {
    isSliderActive = false;
    isSliderActiveLeft = false;
});

// ============================================
// CONTROLES DE RATÓN PARA DESKTOP
// ============================================

// Variables para control con ratón
let isMouseActive = false;
let isMouseActiveLeft = false;

// Control con ratón del slider derecho (Jugador 1 - verde)
sliderKnob.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!gameRunning) return;
    
    isMouseActive = true;
});

touchSlider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (!gameRunning) return;
    
    isMouseActive = true;
    
    // Calcular posición inmediata al hacer clic
    const sliderRect = touchSlider.getBoundingClientRect();
    const mouseY = e.clientY - sliderRect.top;
    const sliderHeight = touchSlider.offsetHeight;
    const knobHeight = sliderKnob.offsetHeight;
    const maxY = sliderHeight - knobHeight;
    const clampedY = Math.max(0, Math.min(mouseY - knobHeight / 2, maxY));
    const percent = clampedY / maxY;
    player.y = percent * (canvas.height - player.height);
    
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
    
    updateSliderPosition();
});

document.addEventListener('mousemove', (e) => {
    if (!isMouseActive || !gameRunning) return;
    
    const sliderRect = touchSlider.getBoundingClientRect();
    const mouseY = e.clientY - sliderRect.top;
    
    const sliderHeight = touchSlider.offsetHeight;
    const knobHeight = sliderKnob.offsetHeight;
    const maxY = sliderHeight - knobHeight;
    
    const clampedY = Math.max(0, Math.min(mouseY - knobHeight / 2, maxY));
    const percent = clampedY / maxY;
    player.y = percent * (canvas.height - player.height);
    
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
    
    updateSliderPosition();
});

document.addEventListener('mouseup', () => {
    isMouseActive = false;
    isMouseActiveLeft = false;
});

// Control con ratón del slider izquierdo (Jugador 2 - rojo)
sliderKnobLeft.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!gameRunning) return;
    // Solo permitir control manual en modo 2 jugadores
    if (gameMode !== 2) return;
    
    isMouseActiveLeft = true;
});

touchSliderLeft.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (!gameRunning || gameMode !== 2) return;
    
    isMouseActiveLeft = true;
    
    // Calcular posición inmediata al hacer clic
    const sliderRect = touchSliderLeft.getBoundingClientRect();
    const mouseY = e.clientY - sliderRect.top;
    const sliderHeight = touchSliderLeft.offsetHeight;
    const knobHeight = sliderKnobLeft.offsetHeight;
    const maxY = sliderHeight - knobHeight;
    const clampedY = Math.max(0, Math.min(mouseY - knobHeight / 2, maxY));
    const percent = clampedY / maxY;
    computer.y = percent * (canvas.height - computer.height);
    
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
    
    updateSliderPositionLeft();
});

document.addEventListener('mousemove', (e) => {
    if (!isMouseActiveLeft || !gameRunning || gameMode !== 2) return;
    
    const sliderRect = touchSliderLeft.getBoundingClientRect();
    const mouseY = e.clientY - sliderRect.top;
    
    const sliderHeight = touchSliderLeft.offsetHeight;
    const knobHeight = sliderKnobLeft.offsetHeight;
    const maxY = sliderHeight - knobHeight;
    
    const clampedY = Math.max(0, Math.min(mouseY - knobHeight / 2, maxY));
    const percent = clampedY / maxY;
    computer.y = percent * (canvas.height - computer.height);
    
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
    
    updateSliderPositionLeft();
});

// Control del slider táctil izquierdo (Jugador 2 / Computadora)
sliderKnobLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!gameRunning) return;
    // Solo permitir control manual en modo 2 jugadores
    if (gameMode !== 2) return;
    
    isSliderActiveLeft = true;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isSliderActiveLeft || !gameRunning || gameMode !== 2) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const sliderRect = touchSliderLeft.getBoundingClientRect();
    const touchY = touch.clientY - sliderRect.top;
    
    // Calcular posición del jugador 2 basada en la posición del toque en el slider
    const sliderHeight = touchSliderLeft.offsetHeight;
    const knobHeight = sliderKnobLeft.offsetHeight;
    const maxY = sliderHeight - knobHeight;
    
    // Limitar touchY dentro del slider
    const clampedY = Math.max(0, Math.min(touchY - knobHeight / 2, maxY));
    
    // Calcular posición del jugador 2
    const percent = clampedY / maxY;
    computer.y = percent * (canvas.height - computer.height);
    
    // Limitar al canvas
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
    
    updateSliderPositionLeft();
}, { passive: false });

// Botones
startButton.addEventListener('click', () => {
    startGame();
});

pauseButton.addEventListener('click', () => {
    if (gameRunning) {
        pauseGame();
    } else {
        resumeGame();
    }
});

resetButton.addEventListener('click', resetGame);

menuButton.addEventListener('click', () => {
    goToMenu();
});

playAgainButton.addEventListener('click', () => {
    gameOverModal.classList.remove('active');
    // Solo reiniciar puntos, mantener nivel
    playerScore = 0;
    computerScore = 0;
    updateScore();
    player.x = canvas.width - 20;
    player.y = getCenterY();
    computer.y = getCenterY();
    resetBall();
    ball.paused = false; // Asegurar que no esté pausada
    resumeGame();
});

// Controles de audio
musicToggle.addEventListener('click', () => {
    musicEnabled = !musicEnabled;
    musicToggle.textContent = musicEnabled ? '🎵' : '🔇';
    musicToggle.setAttribute('title', musicEnabled ? 'Desactivar música' : 'Activar música');
    
    if (!musicEnabled) {
        stopBackgroundMusic();
    } else if (gameRunning) {
        startBackgroundMusic();
    }
});

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    soundToggle.setAttribute('title', soundEnabled ? 'Desactivar efectos' : 'Activar efectos');
});

// Listener para cambio de modo de juego
gameModeSelect.addEventListener('change', (e) => {
    gameMode = parseInt(e.target.value);
    updateGameMode();
    
    // Si el juego está en la pantalla de juego, pausarlo y reiniciarlo
    if (gameScreen.classList.contains('active') && gameRunning) {
        pauseGame();
        resetGame();
    }
});

// Función para actualizar la interfaz según el modo de juego
function updateGameMode() {
    // Mostrar ambas barras siempre, independientemente del modo
    if (touchSliderLeft) {
        touchSliderLeft.style.display = 'flex';
    }
    if (touchSlider) {
        touchSlider.style.display = 'flex';
    }
    
    if (gameMode === 2) {
        // Modo 2 jugadores
        computerScoreLabel.textContent = 'Jugador 2';
        
        // Reiniciar velocidad del jugador 2 para que sea igual al jugador 1
        computer.dy = 0;
        
        // Ocultar indicador de nivel (no aplica en modo 2 jugadores)
        levelNumber.parentElement.style.opacity = '0.3';
    } else {
        // Modo 1 jugador (vs Computadora)
        computerScoreLabel.textContent = 'Computadora';
        
        // Mostrar indicador de nivel
        levelNumber.parentElement.style.opacity = '1';
    }
    
    // Reajustar tamaño del canvas si está en la pantalla de juego
    if (gameScreen.classList.contains('active')) {
        adjustCanvasSize();
        updateSliderPosition();
        updateSliderPositionLeft();
    }
}

// Event listeners para cambio de orientación
window.addEventListener('orientationchange', () => {
    console.log('🔄 Cambio de orientación detectado');
    setTimeout(() => {
        adjustCanvasSize();
        updateSliderPosition();
        updateSliderPositionLeft();
        
        // Centrar el canvas si el juego está en marcha
        if (gameRunning) {
            scrollToCanvas();
        }
    }, 100);
});

window.addEventListener('resize', () => {
    if (isTouchDevice()) {
        adjustCanvasSize();
        updateSliderPosition();
        updateSliderPositionLeft();
        
        // Centrar el canvas si el juego está en marcha
        if (gameRunning) {
            setTimeout(() => scrollToCanvas(), 300);
        }
    }
});

// Animación del mensaje de pausa cuando el juego no está corriendo en la pantalla de juego
function animateStartMessage() {
    if (!gameRunning && gameScreen.classList.contains('active')) {
        draw();
        requestAnimationFrame(animateStartMessage);
    }
}

// Función para detectar y mostrar el tipo de dispositivo
function detectAndShowDeviceType() {
    const deviceTypeElement = document.getElementById('deviceType');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isPortraitMode = screenHeight > screenWidth;
    
    let deviceType = '';
    
    /*
     * Rangos de detección:
     * 
     * Smartphones:
     * - Portrait: máximo 768px
     * - Landscape: máximo 896px
     * - Rango típico: 320px - 896px
     * 
     * Tablets:
     * - Portrait: 769px - 1024px
     * - Landscape: 897px - 1366px
     * 
     * Desktop:
     * - Portrait: más de 1024px
     * - Landscape: más de 1366px
     */
    
    if (isPortraitMode) {
        // MODO PORTRAIT (Vertical)
        if (screenWidth <= 768) {
            // Smartphone Portrait
            deviceType = 'Smartphone';
            deviceTypeElement.style.color = '#ff4757'; // Rojo
        } else if (screenWidth > 768 && screenWidth <= 1024) {
            // Tablet Portrait
            deviceType = 'Tablet';
            deviceTypeElement.style.color = '#667eea'; // Azul
        } else {
            // Desktop Portrait
            deviceType = 'Desktop';
            deviceTypeElement.style.color = '#00ff88'; // Verde
        }
    } else {
        // MODO LANDSCAPE (Horizontal)
        if (screenWidth <= 896) {
            // Smartphone Landscape
            deviceType = 'Smartphone';
            deviceTypeElement.style.color = '#ff4757'; // Rojo
        } else if (screenWidth > 896 && screenWidth <= 1366) {
            // Tablet Landscape
            deviceType = 'Tablet';
            deviceTypeElement.style.color = '#667eea'; // Azul
        } else {
            // Desktop Landscape
            deviceType = 'Desktop';
            deviceTypeElement.style.color = '#00ff88'; // Verde
        }
    }
    
    const orientation = isPortraitMode ? 'Portrait' : 'Landscape';
    deviceTypeElement.textContent = deviceType;
    console.log(`📱 Dispositivo: ${deviceType} | ${orientation} | ${screenWidth}x${screenHeight}px | Touch: ${isTouchDevice()}`);
}

// Dibujar estado inicial
draw();
updateSliderPosition();
updateSliderPositionLeft();
updateGameMode();

// Detectar y mostrar tipo de dispositivo
detectAndShowDeviceType();

// Actualizar el tipo de dispositivo al cambiar el tamaño de ventana
window.addEventListener('resize', () => {
    detectAndShowDeviceType();
});

// Código de ocultación de barra y orientación forzada eliminado por preferencia del usuario

