// js/script.js

// ===== CONFIGURACIÓN DEL WIFI =====
// ¡¡¡IMPORTANTE!!! ESTOS SON TUS DATOS REALES
const WIFI_CONFIG = {
    ssid: "LuffyNakamas",           // Nombre de tu red WiFi (SSID)
    password: "4231150aA",          // Contraseña de tu WiFi
    encryption: "WPA2",             // Tipo de encriptación (WPA, WPA2, WEP)
    hidden: false,                  // ¿La red está oculta? (true/false)
    lastUpdated: "2025-12-09"       // Fecha de última actualización
};

// ===== VARIABLES GLOBALES =====
let elements = {};
let visitorCount = localStorage.getItem('wifiVisitorCount') || 1;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar referencias a elementos DOM
    initializeElements();
    
    // Configurar datos iniciales
    setupInitialData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Generar código QR
    generateQRCode();
    
    // Inicializar contador de visitas
    initializeVisitorCount();
});

// ===== FUNCIONES DE INICIALIZACIÓN =====
function initializeElements() {
    // Elementos principales
    elements = {
        // Display elements
        ssidDisplay: document.getElementById('ssid-display'),
        passwordDisplay: document.getElementById('password-display'),
        lastUpdated: document.getElementById('last-updated'),
        visitorCount: document.getElementById('visitor-count'),
        
        // Botones
        connectBtn: document.getElementById('connect-btn'),
        showPasswordBtn: document.getElementById('show-password-btn'),
        copyBtn: document.getElementById('copy-btn'),
        refreshLink: document.getElementById('refresh-link'),
        
        // Modal elements
        passwordModal: document.getElementById('password-modal'),
        modalSsid: document.getElementById('modal-ssid'),
        modalPassword: document.getElementById('modal-password'),
        closeModal: document.getElementById('close-modal'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        copyPasswordBtn: document.getElementById('copy-password-btn'),
        copyAllBtn: document.getElementById('copy-all-btn'),
        
        // Notificación
        notification: document.getElementById('notification'),
        notificationText: document.getElementById('notification-text')
    };
}

function setupInitialData() {
    // Mostrar datos del WiFi
    elements.ssidDisplay.textContent = WIFI_CONFIG.ssid;
    elements.passwordDisplay.textContent = WIFI_CONFIG.password;
    elements.modalSsid.textContent = WIFI_CONFIG.ssid;
    elements.modalPassword.textContent = WIFI_CONFIG.password;
    
    // Mostrar fecha de última actualización
    const lastUpdated = new Date(WIFI_CONFIG.lastUpdated);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    elements.lastUpdated.textContent = lastUpdated.toLocaleDateString('es-ES', options);
}

function setupEventListeners() {
    // Botón conectar
    elements.connectBtn.addEventListener('click', connectToWifi);
    
    // Botón mostrar contraseña (abrir modal)
    elements.showPasswordBtn.addEventListener('click', openPasswordModal);
    
    // Botón copiar datos
    elements.copyBtn.addEventListener('click', copyAllData);
    
    // Enlace actualizar página
    elements.refreshLink.addEventListener('click', function(e) {
        e.preventDefault();
        location.reload();
    });
    
    // Modal: cerrar
    elements.closeModal.addEventListener('click', closePasswordModal);
    elements.closeModalBtn.addEventListener('click', closePasswordModal);
    
    // Modal: copiar contraseña
    elements.copyPasswordBtn.addEventListener('click', copyPassword);
    
    // Modal: copiar todo
    elements.copyAllBtn.addEventListener('click', copyAllData);
    
    // Cerrar modal al hacer clic fuera
    elements.passwordModal.addEventListener('click', function(e) {
        if (e.target === elements.passwordModal) {
            closePasswordModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.passwordModal.style.display === 'flex') {
            closePasswordModal();
        }
    });
}

// ===== FUNCIONES DEL CÓDIGO QR =====
function generateQRCode() {
    // Crear string para código QR en formato estándar WiFi
    const wifiString = `WIFI:S:${WIFI_CONFIG.ssid};T:${WIFI_CONFIG.encryption};P:${WIFI_CONFIG.password};H:${WIFI_CONFIG.hidden};;`;
    
    // Limpiar contenedor si ya existe un QR
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    
    // Generar nuevo código QR
    new QRCode(qrContainer, {
        text: wifiString,
        width: 220,
        height: 220,
        colorDark: "#1F2937",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// ===== FUNCIONES DE CONEXIÓN =====
function connectToWifi() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    if (isAndroid) {
        // Intentar abrir configuración WiFi en Android
        try {
            const intentURL = `intent://wifi?ssid=${encodeURIComponent(WIFI_CONFIG.ssid)}&password=${encodeURIComponent(WIFI_CONFIG.password)}#Intent;scheme=android-intent;package=com.android.settings;end`;
            window.location.href = intentURL;
            
            // Fallback si el intent falla
            setTimeout(function() {
                if (document.hasFocus()) {
                    showManualConnectionInstructions();
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error con Android Intent:', error);
            showManualConnectionInstructions();
        }
    } else if (isIOS) {
        // iOS no soporta intents directos, mostrar instrucciones
        showManualConnectionInstructions();
    } else {
        // Navegador de escritorio
        showManualConnectionInstructions();
    }
}

function showManualConnectionInstructions() {
    const message = `Para conectarte manualmente:\n\n1. Ve a Configuración > WiFi\n2. Busca la red: "${WIFI_CONFIG.ssid}"\n3. Ingresa la contraseña: "${WIFI_CONFIG.password}"\n\nO escanea el código QR con tu cámara.`;
    alert(message);
}

// ===== FUNCIONES DEL MODAL =====
function openPasswordModal() {
    elements.passwordModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePasswordModal() {
    elements.passwordModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ===== FUNCIONES DE PORTAPAPELES =====
function copyPassword() {
    copyToClipboard(WIFI_CONFIG.password, 'Contraseña copiada al portapapeles');
    closePasswordModal();
}

function copyAllData() {
    const textToCopy = `Red WiFi: ${WIFI_CONFIG.ssid}\nContraseña: ${WIFI_CONFIG.password}`;
    copyToClipboard(textToCopy, 'Datos del WiFi copiados al portapapeles');
}

function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text).then(
        () => {
            showNotification(successMessage, 'success');
        },
        (err) => {
            console.error('Error al copiar: ', err);
            // Fallback para navegadores antiguos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification(successMessage, 'success');
            } catch (err) {
                showNotification('Error al copiar. Copia manualmente.', 'error');
            }
            document.body.removeChild(textArea);
        }
    );
}

function showNotification(message, type) {
    elements.notificationText.textContent = message;
    elements.notification.style.display = 'flex';
    
    // Cambiar color según tipo
    if (type === 'error') {
        elements.notification.style.backgroundColor = '#EF4444';
    } else {
        elements.notification.style.backgroundColor = '#10B981';
    }
    
    setTimeout(() => {
        elements.notification.style.display = 'none';
    }, 3000);
}

function initializeVisitorCount() {
    // Incrementar contador de visitas
    visitorCount = parseInt(visitorCount) + 1;
    localStorage.setItem('wifiVisitorCount', visitorCount);
    elements.visitorCount.textContent = visitorCount;
}

// ===== FUNCIONES ADICIONALES =====
// Función para actualizar datos WiFi (para uso futuro)
function updateWifiData(newSsid, newPassword, newEncryption) {
    // Actualizar configuración
    WIFI_CONFIG.ssid = newSsid;
    WIFI_CONFIG.password = newPassword;
    if (newEncryption) {
        WIFI_CONFIG.encryption = newEncryption;
    }
    WIFI_CONFIG.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Actualizar display
    setupInitialData();
    
    // Regenerar QR
    generateQRCode();
    
    // Mostrar notificación
    showNotification('Datos WiFi actualizados correctamente', 'success');
    
    return true;
}

// Función para imprimir la página
function printPage() {
    window.print();
}

// Función para descargar QR como imagen
function downloadQRCode() {
    const qrCanvas = document.querySelector('#qrcode canvas');
    if (qrCanvas) {
        const link = document.createElement('a');
        link.download = `QR-WiFi-${WIFI_CONFIG.ssid}.png`;
        link.href = qrCanvas.toDataURL('image/png');
        link.click();
    }
}

// Exponer funciones útiles para la consola
window.wifiUtils = {
    updateWifiData: updateWifiData,
    printPage: printPage,
    downloadQRCode: downloadQRCode,
    getConfig: () => ({ ...WIFI_CONFIG }),
    version: '2.0'
};

// Verificar si hay errores en la carga
window.addEventListener('error', function(e) {
    console.error('Error detectado:', e.error);
    showNotification('Error al cargar la página. Recarga por favor.', 'error');
});
