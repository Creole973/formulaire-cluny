// =============================================
// SOUMISSION DU FORMULAIRE
// =============================================
document.getElementById('clunyForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('statusMessage');

    // Disable button to prevent double submit
    btn.disabled = true;
    btn.textContent = "TRAITEMENT...";
    statusMsg.textContent = "";

    // Formater la date (YYYY-MM-DD → DD/MM/YYYY)
    const rawDate = document.getElementById('dateEvent').value;
    const [year, month, day] = rawDate.split('-');
    const formattedDate = day + '/' + month + '/' + year;

    // Collect form data
    const formData = {
        dateEvent: formattedDate,
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        whatsapp: document.getElementById('whatsapp').value,
        telephone: document.getElementById('telephone').value,
        activites: document.getElementById('activites').value,
        repas: document.getElementById('repas').value,
        positionnement: document.getElementById('positionnement').value
    };

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz0kdd2uqlNxqtX_Ii1r4ETzdSS7YHGwKJ59fAndUhu0TvW5LrzdeV1ytR75kAO-C2fdw/exec";

    // ========================================
    // MÉTHODE IFRAME : contourne 100% du CORS
    // ========================================

    // Créer un iframe caché
    const iframeName = 'hidden_iframe_' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Créer un formulaire caché qui cible l'iframe
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'GET';
    hiddenForm.action = SCRIPT_URL;
    hiddenForm.target = iframeName;
    hiddenForm.style.display = 'none';

    // Ajouter chaque champ comme input hidden
    Object.keys(formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        hiddenForm.appendChild(input);
    });

    document.body.appendChild(hiddenForm);

    // Soumettre le formulaire vers l'iframe
    hiddenForm.submit();

    // Attendre un peu puis montrer le succès et nettoyer
    setTimeout(() => {
        showSuccessOverlay();
        document.getElementById('clunyForm').reset();
        btn.disabled = false;
        btn.textContent = "S'INSCRIRE";

        // Nettoyer les éléments temporaires
        document.body.removeChild(iframe);
        document.body.removeChild(hiddenForm);
    }, 3000);
});

// =====================
// OVERLAY DE SUCCÈS
// =====================
function showSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    overlay.classList.remove('hidden');
    launchConfetti();

    // Auto-fermeture après 8 secondes
    const autoClose = setTimeout(() => {
        overlay.classList.add('hidden');
        // Recharger la page pour remettre à zéro le formulaire
        window.location.reload();
    }, 8000);

    // Fermer aussi si on clique dessus
    overlay.addEventListener('click', function handler() {
        clearTimeout(autoClose);
        overlay.classList.add('hidden');
        overlay.removeEventListener('click', handler);
        window.location.reload();
    });
}

function launchConfetti() {
    const container = document.getElementById('confettiContainer');
    // Palette verte Sonrisa
    const colors = ['#2e8b3a', '#3dba55', '#52c96e', '#a8e6b4', '#1a7a2e', '#f9a825', '#ff6600', '#e91e63'];
    const count = 80;

    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = 2 + Math.random() * 2.5;
        const delay = Math.random() * 1.5;
        const size = 8 + Math.random() * 10;
        const isCircle = Math.random() > 0.5;

        piece.style.cssText = `
            left: ${left}%;
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: ${isCircle ? '50%' : '2px'};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        container.appendChild(piece);
    }

    // Nettoyer après la fin de l'animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// =============================================
// LOGIQUE ESPACE ADMIN
// =============================================

// Identifiants récupérés depuis Google Sheets
let ADMIN_CREDENTIALS = {};

// Pré-chargement des données en arrière-plan
document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardStats(true); // true = silent load
});

// UI Elements Admin
const adminBtn = document.getElementById('adminBtn');
const loginModal = document.getElementById('loginModal');
const loginClose = document.getElementById('loginClose');
const adminPhone = document.getElementById('adminPhone');
const adminPass = document.getElementById('adminPass');
const loginSubmit = document.getElementById('loginSubmit');
const loginError = document.getElementById('loginError');

const adminDashboard = document.getElementById('adminDashboard');
const adminLogout = document.getElementById('adminLogout');
const adminDateSelect = document.getElementById('adminDateSelect');

const statTotal = document.getElementById('statTotal');
const statLeader = document.getElementById('statLeader');
const statFollower = document.getElementById('statFollower');
const statRepas = document.getElementById('statRepas');
const noDataMsg = document.getElementById('noDataMsg');

// Données des stats
let dashboardData = {};

// Ouvrir la modal de login
adminBtn.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
    adminPhone.value = '';
    adminPass.value = '';
    loginError.textContent = '';
});

// Fermer la modal
loginClose.addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

// Tentative de connexion
function attemptLogin() {
    const phone = adminPhone.value.trim().replace(/\s/g, '');
    const pass = adminPass.value.trim();

    if (!phone || !pass) {
        loginError.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    // Si les accès n'ont pas encore chargé — relancer le fetch et réessayer auto
    if (Object.keys(ADMIN_CREDENTIALS).length === 0) {
        loginError.textContent = "⏳ Chargement en cours...";
        loginSubmit.textContent = "CHARGEMENT...";
        loginSubmit.disabled = true;

        // Relancer le fetch et réessayer le login automatiquement
        fetchDashboardStats(false, function () {
            loginSubmit.disabled = false;
            loginSubmit.textContent = "CONNEXION";
            if (Object.keys(ADMIN_CREDENTIALS).length > 0) {
                // Réessayer automatiquement
                attemptLogin();
            } else {
                loginError.textContent = "Erreur serveur. Vérifiez votre connexion internet.";
            }
        });
        return;
    }

    // Vérifier les credentials
    if (ADMIN_CREDENTIALS[phone] && ADMIN_CREDENTIALS[phone] === pass) {
        // Connexion réussie
        loginError.textContent = "";
        loginModal.classList.add('hidden');
        openDashboard();
    } else {
        // Échec — effet de secousse
        loginError.textContent = "Identifiants incorrects.";
        loginModal.querySelector('.modal-card').animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ], { duration: 400, easing: 'ease-in-out' });
        adminPass.value = '';
    }
}

// Ouvrir le dashboard
function openDashboard() {
    adminDashboard.classList.remove('hidden');
    dashboardData = {};
    fetchDashboardStats();
}

// Déconnexion
adminLogout.addEventListener('click', () => {
    adminDashboard.classList.add('hidden');
});

// Actualiser
document.getElementById('adminRefresh').addEventListener('click', () => {
    location.reload();
});

// Changement de date sur le dashboard
adminDateSelect.addEventListener('change', updateDashboardUI);

// Callback global pour le JSONP
window.handleDashboardStats = function (data) {
    if (data.status === 'success') {
        dashboardData = data.stats;
        if (data.admins) {
            ADMIN_CREDENTIALS = data.admins;
        }
        populateDateSelect();
        updateDashboardUI();
        loginSubmit.textContent = "CONNEXION";
        loginSubmit.disabled = false;

        // Appeler le callback en attente si présent
        if (_fetchCallback) {
            var cb = _fetchCallback;
            _fetchCallback = null;
            cb();
        }
    } else {
        console.error("Erreur stats:", data);
        loginSubmit.textContent = "CONNEXION";
        loginSubmit.disabled = false;
        if (_fetchCallback) {
            var cb = _fetchCallback;
            _fetchCallback = null;
            cb();
        }
    }
};

// Variable pour stocker le callback en attente
var _fetchCallback = null;
var _fetchRetries = 0;
var _fetchTimeout = null;

// Récupérer les stats depuis le Sheet (Via JSONP) — avec retry et timeout
function fetchDashboardStats(isSilent, callback) {
    if (!isSilent) {
        loginSubmit.textContent = "CHARGEMENT...";
    }

    if (callback) {
        _fetchCallback = callback;
    }

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz0kdd2uqlNxqtX_Ii1r4ETzdSS7YHGwKJ59fAndUhu0TvW5LrzdeV1ytR75kAO-C2fdw/exec";

    // Nettoyer tout ancien script/timeout
    if (_fetchTimeout) clearTimeout(_fetchTimeout);

    const script = document.createElement('script');
    script.src = SCRIPT_URL + "?action=getStats&callback=handleDashboardStats&ts=" + Date.now();

    // Gestion d'erreur : si le script échoue, on réessaie
    script.onerror = function () {
        script.remove();
        _fetchRetries++;
        if (_fetchRetries <= 3) {
            console.log("JSONP retry " + _fetchRetries + "/3...");
            setTimeout(function () { fetchDashboardStats(isSilent); }, 1500);
        } else {
            _fetchRetries = 0;
            loginSubmit.textContent = "CONNEXION";
            loginSubmit.disabled = false;
            if (_fetchCallback) {
                var cb = _fetchCallback;
                _fetchCallback = null;
                cb();
            }
        }
    };

    script.onload = function () {
        script.remove();
        _fetchRetries = 0;
        if (_fetchTimeout) clearTimeout(_fetchTimeout);
    };

    document.body.appendChild(script);

    // Timeout de sécurité : si rien après 10 secondes, réessayer
    _fetchTimeout = setTimeout(function () {
        if (Object.keys(ADMIN_CREDENTIALS).length === 0 && _fetchRetries < 3) {
            _fetchRetries++;
            console.log("JSONP timeout, retry " + _fetchRetries + "/3...");
            try { script.remove(); } catch (e) { }
            fetchDashboardStats(isSilent);
        } else if (_fetchRetries >= 3) {
            _fetchRetries = 0;
            loginSubmit.textContent = "CONNEXION";
            loginSubmit.disabled = false;
            if (_fetchCallback) {
                var cb = _fetchCallback;
                _fetchCallback = null;
                cb();
            }
        }
    }, 10000);
}

// Peupler la liste des dates
function populateDateSelect() {
    adminDateSelect.innerHTML = '<option value="_TOTAL_">TOUTES LES DATES (GLOBAL)</option>';

    const dates = Object.keys(dashboardData).filter(k => k !== '_TOTAL_');
    dates.sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/');
        const [dayB, monthB, yearB] = b.split('/');
        return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
    });

    dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.text = "INITIATION DU " + date;
        adminDateSelect.appendChild(option);
    });
}

// Mettre à jour l'affichage
function updateDashboardUI() {
    const selectedKey = adminDateSelect.value;
    if (!selectedKey) return;

    const stats = dashboardData[selectedKey];

    if (stats) {
        noDataMsg.classList.add('hidden');
        document.querySelector('.stats-grid').style.display = 'grid';

        // Animation des compteurs
        animateValue(statTotal, 0, stats.total, 1000);
        animateValue(statLeader, 0, stats.leader, 1000);
        animateValue(statFollower, 0, stats.follower, 1000);
        animateValue(statRepas, 0, stats.repas, 1000);
    } else {
        document.querySelector('.stats-grid').style.display = 'none';
        noDataMsg.classList.remove('hidden');
    }
}

// Animation ludique des compteurs
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}
