// js/script.js - VERSIÓN ANIME/GEEK

// ===== CONFIGURACIÓN DEL WIFI =====
const WIFI_CONFIG = {
    ssid: "LuffyNakamas",           // Nombre de tu red WiFi
    password: "4231150aA",          // Contraseña de tu WiFi
    encryption: "WPA2",             // Tipo de encriptación
    hidden: false,                  // ¿La red está oculta?
    lastUpdated: "2025-12-09",      // Fecha de actualización
    version: "QR_MASTER_v3.14"      // Versión del sistema
};

// ===== VARIABLES GLOBALES =====
let elements = {};
let uptimeInterval;
let startTime = Date.now();
let isInfoVisible = false;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🚀 WiFi QR Master v3.14 🚀', 'color: #00f3ff; font-size: 16px; font-weight: bold;');
    console.log('%c// SYSTEM INITIALIZED //', 'color: #00ff9d;');
    
    // Inicializar elementos
    initializeElements();
    
    // Configurar datos iniciales
    setupInitialData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Generar código QR
    generateQRCode();
    
    // Iniciar efectos
    startEffects();
    
    // Iniciar contador de uptime
    startUptimeCounter();
});

// ===== FUNCIONES DE INICIALIZACIÓN =====
function initializeElements() {
    // Elementos principales
    elements = {
        // Elementos de información
        infoSsid: document.getElementById('info-ssid'),
        infoPassword: document.getElementById('info-password'),
        hiddenInfo: document.getElementById('hidden-info'),
        hackerText: document.getElementById('hacker-text'),
        uptime: document.getElementById('uptime'),
        
        // Botones
        toggleInfoBtn: document.getElementById('toggle-info-btn'),
        connectBtn: document.getElementById('connect-btn'),
        copyBtn: document.getElementById('copy-btn'),
        
        // Modal
        copyModal: document.getElementById('copy-modal'),
        closeModal: document.getElementById('close-modal'),
        copyCode: document.getElementById('copy-code'),
        copySsidBtn: document.getElementById('copy-ssid-btn'),
        copyPassBtn: document.getElementById('copy-pass-btn'),
        copyAllModalBtn: document.getElementById('copy-all-modal-btn'),
        
        // Notificación
        notification: document.getElementById('notification'),
        notificationText: document.getElementById('notification-text'),
        
        // Logo
        geekLogo: document.getElementById('geek-logo')
    };
}

function setupInitialData() {
    // Mostrar datos en la información oculta
    elements.infoSsid.textContent = WIFI_CONFIG.ssid;
    elements.infoPassword.textContent = WIFI_CONFIG.password;
    
    // Configurar texto para copiar
    elements.copyCode.textContent = `SSID: ${WIFI_CONFIG.ssid}\nPASSWORD: ${WIFI_CONFIG.password}\nENCRYPTION: ${WIFI_CONFIG.encryption}`;
    
    // Efecto de texto hacker
    startHackerText();
}

function setupEventListeners() {
    // Botón mostrar/ocultar información
    elements.toggleInfoBtn.addEventListener('click', toggleInfo);
    
    // Botón conectar
    elements.connectBtn.addEventListener('click', connectToWifi);
    
    // Botón copiar (abre modal)
    elements.copyBtn.addEventListener('click', openCopyModal);
    
    // Modal: cerrar
    elements.closeModal.addEventListener('click', closeCopyModal);
    
    // Modal: copiar SSID
    elements.copySsidBtn.addEventListener('click', function() {
        copyToClipboard(WIFI_CONFIG.ssid, 'SSID copiado al portapapeles');
    });
    
    // Modal: copiar contraseña
    elements.copyPassBtn.addEventListener('click', function() {
        copyToClipboard(WIFI_CONFIG.password, 'Contraseña copiada al portapapeles');
    });
    
    // Modal: copiar todo
    elements.copyAllModalBtn.addEventListener('click', function() {
        const text = `SSID: ${WIFI_CONFIG.ssid}\nPASSWORD: ${WIFI_CONFIG.password}`;
        copyToClipboard(text, 'Todos los datos copiados');
    });
    
    // Cerrar modal al hacer clic fuera
    elements.copyModal.addEventListener('click', function(e) {
        if (e.target === elements.copyModal) {
            closeCopyModal();
        }
    });
    
    // Tecla Escape para cerrar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCopyModal();
        }
        
        // Easter egg: CTRL+ALT+W
        if (e.ctrlKey && e.altKey && e.key === 'w') {
            e.preventDefault();
            showNotification('// WiFi_MENU_ACTIVATED //', 'success');
        }
    });
    
    // Efecto hover en logo
    if (elements.geekLogo) {
        elements.geekLogo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(10deg)';
            this.style.boxShadow = '0 0 30px #ff00ff';
        });
        
        elements.geekLogo.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
}

// ===== FUNCIONES DEL CÓDIGO QR =====
function generateQRCode() {
    // Crear string para código QR
    const wifiString = `WIFI:S:${WIFI_CONFIG.ssid};T:${WIFI_CONFIG.encryption};P:${WIFI_CONFIG.password};H:${WIFI_CONFIG.hidden};;`;
    
    // Limpiar contenedor si ya existe un QR
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    
    // Generar nuevo código QR con estilo
    new QRCode(qrContainer, {
        text: wifiString,
        width: 250,
        height: 250,
        colorDark: "#00ff9d",
        colorLight: "transparent",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Aplicar efectos al QR generado
    setTimeout(applyQREffects, 100);
}

function applyQREffects() {
    const qrCanvas = document.querySelector('#qrcode canvas');
    if (qrCanvas) {
        qrCanvas.style.borderRadius = '10px';
        qrCanvas.style.boxShadow = '0 0 20px #00ff9d';
    }
}

// ===== FUNCIONES DE CONEXIÓN =====
function connectToWifi() {
    // Efecto visual
    elements.connectBtn.style.animation = 'glitchEffect 0.3s';
    setTimeout(() => {
        elements.connectBtn.style.animation = '';
    }, 300);
    
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    showNotification('// INITIATING_CONNECTION //', 'info');
    
    if (isAndroid) {
        // Android: intent de conexión
        try {
            const intentURL = `intent://wifi?ssid=${encodeURIComponent(WIFI_CONFIG.ssid)}&password=${encodeURIComponent(WIFI_CONFIG.password)}#Intent;scheme=android-intent;package=com.android.settings;end`;
            window.location.href = intentURL;
            
            setTimeout(() => {
                showNotification('// CONNECTION_INTENT_SENT //', 'success');
            }, 500);
            
        } catch (error) {
            console.error('Connection error:', error);
            showManualInstructions();
        }
    } else {
        // iOS y otros: instrucciones manuales
        showManualInstructions();
    }
}

function showManualInstructions() {
    const message = `📱 MANUAL CONNECTION:\n\n1. Go to Settings > WiFi\n2. Find: "${WIFI_CONFIG.ssid}"\n3. Password: "${WIFI_CONFIG.password}"\n\nOr scan the QR code.`;
    showNotification(message, 'info');
    
    // Mostrar modal con información
    setTimeout(() => {
        toggleInfo();
    }, 1000);
}

// ===== FUNCIONES DE INTERFAZ =====
function toggleInfo() {
    isInfoVisible = !isInfoVisible;
    elements.hiddenInfo.classList.toggle('active', isInfoVisible);
    
    // Cambiar texto del botón
    const btnText = elements.toggleInfoBtn.querySelector('span');
    btnText.textContent = isInfoVisible ? 'HIDE_CONFIG' : 'SHOW_CONFIG';
    
    // Efecto de sonido visual
    if (isInfoVisible) {
        showNotification('// CONFIG_DISPLAYED //', 'success');
    }
}

function openCopyModal() {
    elements.copyModal.style.display = 'flex';
    showNotification('// COPY_INTERFACE_ACTIVE //', 'info');
}

function closeCopyModal() {
    elements.copyModal.style.display = 'none';
}

// ===== FUNCIONES DE PORTAPAPELES =====
function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text).then(
        () => {
            showNotification(`// ${successMessage.toUpperCase()} //`, 'success');
            closeCopyModal();
            
            // Efecto visual
            document.body.style.filter = 'brightness(1.2)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 200);
        },
        (err) => {
            console.error('Copy error:', err);
            showNotification('// COPY_FAILED - TRY_MANUAL //', 'error');
            
            // Fallback para navegadores antiguos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                showNotification(`// ${successMessage.toUpperCase()} //`, 'success');
            } catch (err) {
                showNotification('// COPY_ERROR - USE_CTRL+C //', 'error');
            }
            
            document.body.removeChild(textArea);
            closeCopyModal();
        }
    );
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    elements.notificationText.textContent = message;
    elements.notification.style.display = 'flex';
    
    // Estilo según tipo
    switch(type) {
        case 'success':
            elements.notification.style.borderColor = '#00ff9d';
            elements.notification.style.color = '#00ff9d';
            break;
        case 'error':
            elements.notification.style.borderColor = '#ff0055';
            elements.notification.style.color = '#ff0055';
            break;
        default:
            elements.notification.style.borderColor = '#00f3ff';
            elements.notification.style.color = '#00f3ff';
    }
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        elements.notification.style.display = 'none';
    }, 3000);
}

// ===== EFECTOS ESPECIALES =====
function startEffects() {
    // Efecto de partículas en el footer
    createMatrixRain();
    
    // Efecto de parpadeo aleatorio
    setInterval(randomGlitch, 5000);
}

function startHackerText() {
    const messages = [
        "// INITIALIZING_CONNECTION_MATRIX...",
        "// LOADING_WIFI_PROTOCOLS...",
        "// SCANNING_QR_DATASTREAM...",
        "// ENCRYPTION: WPA2_ACTIVE...",
        "// READY_FOR_CONNECTION..."
    ];
    
    let index = 0;
    
    function changeText() {
        elements.hackerText.innerHTML = `<span class="typing">${messages[index]}</span>`;
        index = (index + 1) % messages.length;
    }
    
    // Cambiar texto cada 3 segundos
    changeText();
    setInterval(changeText, 3000);
}

function createMatrixRain() {
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const container = document.getElementById('matrix-rain');
    
    if (!container) return;
    
    // Crear múltiples líneas de "lluvia"
    for (let i = 0; i < 20; i++) {
        const line = document.createElement('div');
        line.className = 'matrix-line';
        line.style.position = 'absolute';
        line.style.left = `${Math.random() * 100}%`;
        line.style.width = '1px';
        line.style.height = '100%';
        line.style.background = 'linear-gradient(transparent, #00ff41, transparent)';
        line.style.opacity = '0.1';
        line.style.animation = `matrixFall ${2 + Math.random() * 3}s linear infinite`;
        line.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(line);
    }
}

function randomGlitch() {
    // Aplicar efecto glitch aleatorio a elementos
    const glitchElements = document.querySelectorAll('.geek-card, .qr-frame');
    if (glitchElements.length > 0 && Math.random() > 0.7) {
        const element = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        element.style.animation = 'glitchEffect 0.1s';
        setTimeout(() => {
            element.style.animation = '';
        }, 100);
    }
}

// ===== CONTADOR DE UPTIME =====
function startUptimeCounter() {
    function updateUptime() {
        const now = Date.now();
        const diff = now - startTime;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (elements.uptime) {
            elements.uptime.textContent = timeString;
        }
    }
    
    updateUptime();
    uptimeInterval = setInterval(updateUptime, 1000);
}

// ===== FUNCIONES GLOBALES (para consola) =====
window.wifiSystem = {
    version: WIFI_CONFIG.version,
    getConfig: () => ({ ...WIFI_CONFIG }),
    showInfo: toggleInfo,
    connect: connectToWifi,
    copyData: openCopyModal,
    updateWifi: function(newSsid, newPassword) {
        WIFI_CONFIG.ssid = newSsid;
        WIFI_CONFIG.password = newPassword;
        WIFI_CONFIG.lastUpdated = new Date().toISOString().split('T')[0];
        
        // Actualizar displays
        setupInitialData();
        generateQRCode();
        
        showNotification('// WIFI_CONFIG_UPDATED //', 'success');
        return true;
    },
    emergencyRestart: function() {
        location.reload();
    }
};

// Mensaje de bienvenida en consola
console.log(`
%c
╔══════════════════════════════════════╗
║      🚀 WIFI QR MASTER v3.14 🚀      ║
║                                      ║
║  Commands available:                 ║
║  • wifiSystem.getConfig()            ║
║  • wifiSystem.showInfo()             ║
║  • wifiSystem.connect()              ║
║  • wifiSystem.copyData()             ║
║  • wifiSystem.updateWifi(ssid, pass) ║
║                                      ║
║  Type: wifiSystem for more info      ║
╚══════════════════════════════════════╝
`, 'color: #00f3ff; font-family: monospace;');

// Prevenir que el usuario salga accidentalmente
window.addEventListener('beforeunload', function(e) {
    if (document.querySelector('.geek-modal[style*="display: flex"]')) {
        e.preventDefault();
        e.returnValue = 'Tienes una ventana abierta. ¿Seguro que quieres salir?';
    }
});