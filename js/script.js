// js/script.js

// Configuración del WiFi - ¡MODIFICA AQUÍ!
const wifiConfig = {
    ssid: "MiCasa_WiFi",
    password: "Contraseña123",
    encryption: "WPA/WPA2",
    hidden: false
};

// Elementos del DOM
let ssidElement, passwordElement, connectBtn, showPasswordBtn;
let passwordModal, modalPassword, closeModal, closeModalBtn;
let copyPasswordBtn, copiedMessage, currentDateElement;

// Inicialización
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Referencias a elementos
    ssidElement = document.getElementById('ssid');
    passwordElement = document.getElementById('password');
    connectBtn = document.getElementById('connectBtn');
    showPasswordBtn = document.getElementById('showPasswordBtn');
    passwordModal = document.getElementById('passwordModal');
    modalPassword = document.getElementById('modalPassword');
    closeModal = document.getElementById('closeModal');
    closeModalBtn = document.getElementById('closeModalBtn');
    copyPasswordBtn = document.getElementById('copyPasswordBtn');
    copiedMessage = document.getElementById('copiedMessage');
    currentDateElement = document.getElementById('currentDate');
    
    // Configurar datos iniciales
    setupData();
    
    // Configurar eventos
    setupEvents();
    
    // Generar QR
    generateQRCode();
}

function setupData() {
    // Mostrar datos en la página
    ssidElement.textContent = wifiConfig.ssid;
    passwordElement.textContent = wifiConfig.password;
    modalPassword.textContent = wifiConfig.password;
    
    // Fecha actual
    const now = new Date();
    currentDateElement.textContent = now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function setupEvents() {
    // Botón conectar
    connectBtn.addEventListener('click', connectToWifi);
    
    // Botón mostrar contraseña
    showPasswordBtn.addEventListener('click', () => {
        passwordModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', closeModalFunc);
    closeModalBtn.addEventListener('click', closeModalFunc);
    
    // Cerrar al hacer clic fuera
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) closeModalFunc();
    });
    
    // Copiar contraseña
    copyPasswordBtn.addEventListener('click', copyPassword);
    
    // Tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && passwordModal.style.display === 'flex') {
            closeModalFunc();
        }
    });
}

function generateQRCode() {
    const wifiString = `WIFI:S:${wifiConfig.ssid};T:WPA;P:${wifiConfig.password};;`;
    
    document.getElementById('qrcode').innerHTML = '';
    
    new QRCode(document.getElementById("qrcode"), {
        text: wifiString,
        width: 200,
        height: 200,
        colorDark: "#1F2937",
        colorLight: "#FFFFFF"
    });
}

function connectToWifi() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isAndroid) {
        try {
            window.location.href = `intent://wifi?ssid=${encodeURIComponent(wifiConfig.ssid)}&password=${encodeURIComponent(wifiConfig.password)}#Intent;scheme=android-intent;package=com.android.settings;end`;
        } catch (e) {
            alert(`Conéctate manualmente:\n\nRed: ${wifiConfig.ssid}\nContraseña: ${wifiConfig.password}`);
        }
    } else {
        alert(`Conéctate manualmente:\n\nRed: ${wifiConfig.ssid}\nContraseña: ${wifiConfig.password}`);
    }
}

function closeModalFunc() {
    passwordModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function copyPassword() {
    navigator.clipboard.writeText(wifiConfig.password).then(() => {
        copiedMessage.style.display = 'flex';
        setTimeout(() => {
            copiedMessage.style.display = 'none';
            closeModalFunc();
        }, 2000);
    }).catch(err => {
        alert('Error al copiar. Copia manualmente: ' + wifiConfig.password);
    });
}

// Función para actualizar datos (si necesitas cambiarlos dinámicamente)
function updateWifiData(newSsid, newPassword) {
    wifiConfig.ssid = newSsid;
    wifiConfig.password = newPassword;
    
    ssidElement.textContent = newSsid;
    passwordElement.textContent = newPassword;
    modalPassword.textContent = newPassword;
    
    generateQRCode();
}