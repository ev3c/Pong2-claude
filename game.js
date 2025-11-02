// Configuración del Canvas
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Variables de orientación
let isPortrait = false;
let canvasBaseWidth = window.innerWidth * 0.8; // Ajustar dinámicamente al 80% del ancho de pantalla
let canvasBaseHeight = 400;

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
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Determinar tipo de dispositivo - Solo dos modos: Tablet (por defecto) y Smartphone
    let isSmartphone;
    
    if (isPortrait) {
        // Portrait mode
        isSmartphone = screenWidth <= 768;
    } else {
        // Landscape mode
        isSmartphone = screenWidth <= 896;
    }
    
    // Tablet es el modo por defecto para todo lo que no sea smartphone
    const isTablet = !isSmartphone;
    
    // Usar lógica de tablet/smartphone sin importar si es táctil o no
    if (true) {
        if (isPortrait) {
            // MODO VERTICAL - Calcular dinámicamente el ancho disponible
            // Leer el ancho real de los sliders si existen (valores por defecto según el modo)
            let leftSliderWidth = isTablet ? 38 : 8;
            let rightSliderWidth = isTablet ? 38 : 8;
            let gapTotal = isTablet ? 20 : 2;
            
            if (touchSliderLeft && window.getComputedStyle) {
                leftSliderWidth = parseFloat(window.getComputedStyle(touchSliderLeft).width) || 8;
            }
            if (touchSlider && window.getComputedStyle) {
                rightSliderWidth = parseFloat(window.getComputedStyle(touchSlider).width) || 8;
            }
            
            // Obtener el gap del CSS
            const gameArea = document.querySelector('.game-area');
            if (gameArea && window.getComputedStyle) {
                const gap = parseFloat(window.getComputedStyle(gameArea).gap) || 1;
                gapTotal = gap * 2;
            }
            
            // Calcular ancho del canvas para ocupar TODO el espacio disponible
            const slidersTotalWidth = leftSliderWidth + rightSliderWidth + gapTotal;
            const containerPadding = isTablet ? 60 : 10; // Padding del game-container
            const bodyPadding = isTablet ? 40 : 4; // Padding del body
            const availableWidth = screenWidth - slidersTotalWidth - containerPadding - bodyPadding;
            
            // Usar 100% del espacio disponible
            // Aplicar reducción del 20% solo para smartphones
            const sizeMultiplier = isSmartphone ? 0.8 : 1.0;
            canvasBaseWidth = Math.floor(Math.max(200, availableWidth * sizeMultiplier));
            
            if (isTablet) {
                const reservedHeight = 350;
                canvasBaseHeight = Math.max(280, Math.floor(screenHeight - reservedHeight));
            } else if (isSmartphone) {
                const reservedHeight = 320;
                canvasBaseHeight = Math.max(180, Math.floor((screenHeight - reservedHeight) * sizeMultiplier));
            }
            
            const paddleInfo = getPaddleSize();
            const ballRadius = getBallSize();
            const deviceType = isSmartphone ? '📱 Smartphone' : '💻 Tablet';
            console.log(`${deviceType} Portrait:`, {
                screen: `${screenWidth}x${screenHeight}`,
                sliders: `L:${leftSliderWidth}px R:${rightSliderWidth}px`,
                canvas: `${canvasBaseWidth}x${canvasBaseHeight}`,
                paddle: `${paddleInfo.width}x${paddleInfo.height}px`,
                ball: `r=${ballRadius}px`
            });
        } else {
            // MODO HORIZONTAL - Calcular dinámicamente (valores por defecto según el modo)
            let leftSliderWidth = isTablet ? 38 : 8;
            let rightSliderWidth = isTablet ? 38 : 8;
            let gapTotal = isTablet ? 20 : 2;
            
            // Leer anchos reales de los sliders
            if (touchSliderLeft && window.getComputedStyle) {
                leftSliderWidth = parseFloat(window.getComputedStyle(touchSliderLeft).width) || 8;
            }
            if (touchSlider && window.getComputedStyle) {
                rightSliderWidth = parseFloat(window.getComputedStyle(touchSlider).width) || 8;
            }
            
            // Obtener el gap del CSS
            const gameArea = document.querySelector('.game-area');
            if (gameArea && window.getComputedStyle) {
                const gap = parseFloat(window.getComputedStyle(gameArea).gap) || 1;
                gapTotal = gap * 2;
            }
            
            // Calcular espacio ocupado para usar TODO el ancho disponible
            const bodyPadding = isTablet ? 24 : (screenHeight < 450 ? 6 : 10);
            const containerPadding = isTablet ? 40 : (screenHeight < 450 ? 10 : 20);
            
            const sliderSpace = leftSliderWidth + rightSliderWidth + gapTotal + 
                              bodyPadding + containerPadding;
            
            // Usar 100% del espacio disponible
            // Aplicar reducción del 20% solo para smartphones
            const sizeMultiplier = isSmartphone ? 0.8 : 1.0;
            canvasBaseWidth = Math.floor(Math.max(300, (screenWidth - sliderSpace) * sizeMultiplier));
            
            // Calcular altura
            const reservedHeightLandscape = isTablet ? 180 : (screenHeight < 450 ? 140 : 160);
            canvasBaseHeight = Math.floor(Math.max(150, (screenHeight - reservedHeightLandscape) * sizeMultiplier));
            
            const paddleInfo = getPaddleSize();
            const ballRadius = getBallSize();
            const deviceType = isSmartphone ? '📱 Smartphone' : '💻 Tablet';
            console.log(`${deviceType} Landscape:`, {
                screen: `${screenWidth}x${screenHeight}`,
                sliders: `L:${leftSliderWidth}px R:${rightSliderWidth}px`,
                sliderSpace: `${sliderSpace}px`,
                canvas: `${canvasBaseWidth}x${canvasBaseHeight}`,
                paddle: `${paddleInfo.width}x${paddleInfo.height}px`,
                ball: `r=${ballRadius}px`
            });
        }
    }
    
    // Aplicar nuevo tamaño
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    canvas.width = canvasBaseWidth;
    canvas.height = canvasBaseHeight;
    
    // Actualizar tamaño de las palas según el dispositivo
    const paddleSize = getPaddleSize();
    player.width = paddleSize.width;
    player.height = paddleSize.height;
    computer.width = paddleSize.width;
    computer.height = paddleSize.height;
    
    // Actualizar tamaño de la pelota según el dispositivo
    ball.radius = getBallSize();
    
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
const levelSelect = document.getElementById('levelSelect');
const levelSelectorDiv = document.getElementById('levelSelector');

// Variables del juego
let gameRunning = false;
let animationId;
let mouseY = canvas.height / 2;
let gameMode = 1; // 1 = vs Computadora, 2 = 2 Jugadores
let initialLevel = 1; // Nivel inicial seleccionado por el usuario

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
    const paddleHeight = getPaddleSize().height;
    return canvas.height / 2 - paddleHeight / 2;
}

// Función para obtener tamaño de palas según el dispositivo
function getPaddleSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Determinar si es smartphone
    const isPortraitMode = screenHeight > screenWidth;
    const isSmartphone = isPortraitMode ? screenWidth <= 768 : screenWidth <= 896;
    
    if (isSmartphone) {
        // SMARTPHONE: palas muy pequeñas para maximizar espacio de juego
        if (screenHeight < 450 && !isPortraitMode) {
            // Pantallas muy pequeñas en horizontal: ultra pequeñas
            return { width: 3, height: 25 };
        }
        return { width: 4, height: 30 };
    } else {
        // TABLET (por defecto): palas medianas
        return { width: 8, height: 55 };
    }
}

// Paleta del jugador (ahora a la derecha)
const player = {
    x: canvas.width - 20,
    y: getCenterY(),
    width: getPaddleSize().width,
    height: getPaddleSize().height,
    speed: 8,
    dy: 0
};

// Paleta de la computadora / Jugador 2 (ahora a la izquierda)
const computer = {
    x: 10,
    y: getCenterY(),
    width: getPaddleSize().width,
    height: getPaddleSize().height,
    speed: 3, // Velocidad inicial baja
    dy: 0 // Velocidad de movimiento para modo 2 jugadores
};

// Función para obtener tamaño de pelota según el dispositivo
function getBallSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isPortraitMode = screenHeight > screenWidth;
    
    // Determinar si es smartphone
    const isSmartphone = isPortraitMode ? screenWidth <= 768 : screenWidth <= 896;
    
    if (isSmartphone) {
        // SMARTPHONE: pelota más pequeña y proporcional a las palas
        if (screenHeight < 450 && !isPortraitMode) {
            // Pantallas muy pequeñas: pelota muy pequeña
            return 3.5;
        }
        return 4;
    } else {
        // TABLET (por defecto): pelota mediana
        return 6;
    }
}

// Función para obtener velocidad de la pelota según el nivel y dispositivo
function getBallSpeed() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isPortraitMode = screenHeight > screenWidth;
    const isSmartphone = isPortraitMode ? screenWidth <= 768 : screenWidth <= 896;
    
    // Velocidad base según dispositivo
    let baseSpeed;
    if (isSmartphone) {
        baseSpeed = 2.0; // Smartphones: velocidad más lenta
    } else {
        baseSpeed = 2.5; // Tablet/Desktop: velocidad intermedia
    }
    
    // Aumentar velocidad según el nivel (10% por nivel)
    // Nivel 1: velocidad base
    // Nivel 10: velocidad base * 1.9
    const levelMultiplier = 1 + (currentLevel - 1) * 0.1;
    
    return baseSpeed * levelMultiplier;
}

// Pelota
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: getBallSize(),
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
    // Ajustar shadowBlur según el dispositivo
    const isSmartphone = window.innerWidth <= (window.innerHeight > window.innerWidth ? 768 : 896);
    const shadowSize = isSmartphone ? 8 : 15;
    ctx.shadowBlur = shadowSize;
    ctx.shadowColor = '#00ff88';
    // Radio de borde proporcional al ancho de la pala
    const borderRadius = Math.min(3, player.width / 2);
    drawRoundedRect(player.x, player.y, player.width, player.height, borderRadius);
    ctx.shadowBlur = 0;
}

// Dibujar la paleta de la computadora
function drawComputer() {
    ctx.fillStyle = '#ff4757';
    // Ajustar shadowBlur según el dispositivo
    const isSmartphone = window.innerWidth <= (window.innerHeight > window.innerWidth ? 768 : 896);
    const shadowSize = isSmartphone ? 8 : 15;
    ctx.shadowBlur = shadowSize;
    ctx.shadowColor = '#ff4757';
    // Radio de borde proporcional al ancho de la pala
    const borderRadius = Math.min(3, computer.width / 2);
    drawRoundedRect(computer.x, computer.y, computer.width, computer.height, borderRadius);
    ctx.shadowBlur = 0;
}

// Dibujar la pelota
function drawBall() {
    ctx.fillStyle = '#ffa502';
    // Ajustar shadowBlur según el dispositivo
    const isSmartphone = window.innerWidth <= (window.innerHeight > window.innerWidth ? 768 : 896);
    const shadowSize = isSmartphone ? 10 : 20;
    ctx.shadowBlur = shadowSize;
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
        
        const isSmartphone = window.innerWidth <= (window.innerHeight > window.innerWidth ? 768 : 896);
        const message = isSmartphone ? '👆 Toca para Continuar' : '🖱️ Haz Clic para Continuar';
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
    
    // En smartphones y tablets, agregar errores y retrasos según el nivel
    const screenWidth = window.innerWidth;
    const isPortraitMode = window.innerHeight > screenWidth;
    const isSmartphone = isPortraitMode ? screenWidth <= 768 : screenWidth <= 896;
    
    if (isSmartphone || !isSmartphone) { // Siempre aplica en ambos modos
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
        
        // Mantener la velocidad constante del nivel
        ball.dx = -ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);
        
        playPaddleHit();
    }
    
    // Colisión con la paleta de la computadora (ahora a la izquierda)
    if (ball.x - ball.radius < computer.x + computer.width &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        
        // Calcular ángulo de rebote
        const hitPos = (ball.y - computer.y) / computer.height;
        const angle = (hitPos - 0.5) * Math.PI / 3;
        
        // Mantener la velocidad constante del nivel
        ball.dx = ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);
        
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
    
    // Mantener la velocidad del nivel actual
    ball.speed = getBallSpeed();
    
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
            const newSpeed = Math.min(computerBaseSpeed + (currentLevel - 1) * 0.6, 8.5);
            computer.speed = newSpeed;
            
            // Actualizar errores de la computadora para el nuevo nivel
            computerErrorChance = Math.max(0.05, 0.3 - (currentLevel - 1) * 0.05);
            
            // Actualizar velocidad de la pelota para el nuevo nivel
            ball.speed = getBallSpeed();
            
            let message = `🎉 ¡Pasas al Nivel ${currentLevel}! `;
            if (currentLevel > 10) {
                message += '¡Has superado todos los niveles! Eres un maestro del Pong 🏆';
            } else {
                message += 'La computadora será más rápida y cometerá menos errores 🚀';
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
    
    // Configurar el nivel inicial seleccionado
    currentLevel = initialLevel;
    levelNumber.textContent = currentLevel;
    // Calcular velocidad de la computadora según el nivel (hasta 8.5 en nivel 10)
    const newSpeed = Math.min(computerBaseSpeed + (currentLevel - 1) * 0.6, 8.5);
    computer.speed = newSpeed;
    
    // Configurar errores de la computadora según el nivel
    computerErrorChance = Math.max(0.05, 0.3 - (currentLevel - 1) * 0.05);
    
    // Establecer velocidad de la pelota según el nivel
    ball.speed = getBallSpeed();
    
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

// Reiniciar juego (reinicia todo, volviendo al nivel inicial seleccionado)
function resetGame() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    stopBackgroundMusic();
    
    playerScore = 0;
    computerScore = 0;
    currentLevel = initialLevel; // Volver al nivel inicial seleccionado
    levelNumber.textContent = currentLevel;
    // Calcular velocidad según el nivel inicial (hasta 8.5 en nivel 10)
    const newSpeed = Math.min(computerBaseSpeed + (currentLevel - 1) * 0.6, 8.5);
    computer.speed = newSpeed;
    
    // Reiniciar errores de la computadora según el nivel
    computerErrorChance = Math.max(0.05, 0.3 - (currentLevel - 1) * 0.05);
    
    // Establecer velocidad de la pelota según el nivel inicial
    ball.speed = getBallSpeed();
    
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

// Listener para cambio de nivel inicial
levelSelect.addEventListener('change', (e) => {
    initialLevel = parseInt(e.target.value);
    console.log(`🎯 Nivel inicial seleccionado: ${initialLevel}`);
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
        
        // Ocultar selector de nivel en el menú
        if (levelSelectorDiv) {
            levelSelectorDiv.style.display = 'none';
        }
    } else {
        // Modo 1 jugador (vs Computadora)
        computerScoreLabel.textContent = 'Computadora';
        
        // Mostrar indicador de nivel
        levelNumber.parentElement.style.opacity = '1';
        
        // Mostrar selector de nivel en el menú
        if (levelSelectorDiv) {
            levelSelectorDiv.style.display = 'block';
        }
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

