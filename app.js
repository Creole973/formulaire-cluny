// =============================================
// INSCRIPTION MULTIPLE — CONFIGURATION
// =============================================
let nombrePersonnes = 1;

// Couleur des blocs personnes
const PERSON_COLORS = ['#111111', '#111111', '#111111', '#111111', '#111111'];

const _SVG = {
    person: `<svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    whatsapp: `<svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    tel: `<svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    activite: `<svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    repas: `<svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    positionnement: `<svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    ville: `<svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
    arrow: `<svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`
};

function creerBlocPersonne(num) {
    const id = `p${num}`;
    const color = PERSON_COLORS[(num - 1) % PERSON_COLORS.length];
    return `
    <div class="personne-bloc" id="bloc_${id}" style="border-color:${color}55;">
        <div class="personne-titre" style="border-color:${color};">
            <span class="personne-num" style="background:${color};">${num}</span>
            PERSONNE ${num}
        </div>
        <div class="form-group">
            <label>NOM</label>
            <div class="input-wrapper">${_SVG.person}
                <input type="text" id="${id}_nom" placeholder="Entrez le nom" required>
            </div>
        </div>
        <div class="form-group">
            <label>PRÉNOM</label>
            <div class="input-wrapper">${_SVG.person}
                <input type="text" id="${id}_prenom" placeholder="Entrez le prénom" required>
            </div>
        </div>
        <div class="form-group">
            <label>DÉJÀ INSCRIT SUR WHATSAPP</label>
            <div class="input-wrapper select-wrapper">${_SVG.whatsapp}
                <select id="${id}_whatsapp" required onchange="toggleTel('${id}', this.value)">
                    <option value="" disabled selected>Déjà inscrit sur WhatsApp ?</option>
                    <option value="OUI">OUI</option>
                    <option value="NON">NON</option>
                </select>${_SVG.arrow}
            </div>
        </div>
        <div class="form-group tel-field" id="${id}_telGroup" style="display:none;">
            <label>N° TÉLÉPHONE</label>
            <div class="input-wrapper">${_SVG.tel}
                <input type="tel" id="${id}_telephone" placeholder="06 XX XX XX XX">
            </div>
        </div>
        <div class="form-group">
            <label>VILLE</label>
            <div class="ville-wrapper" id="${id}_villeWrapper">
                <div class="input-wrapper">${_SVG.ville}
                    <input type="text" id="${id}_ville" placeholder="Votre ville..."
                           autocomplete="off"
                           oninput="handleVilleInput('${id}', this.value)"
                           onkeydown="handleVilleKeydown(event, '${id}')"
                           onblur="handleVilleBlur('${id}')">
                </div>
                <div class="ville-suggestions" id="${id}_villeSugg"></div>
            </div>
        </div>
        <div class="form-group">
            <label>ACTIVITÉS</label>
            <div class="input-wrapper select-wrapper">${_SVG.activite}
                <select id="${id}_activites" required>
                    <option value="" disabled selected>Choisissez une activité</option>
                    <option value="Bachata">Bachata</option>
                    <option value="Salsa">Salsa</option>
                    <option value="Bachata + Salsa">Bachata + Salsa</option>
                </select>${_SVG.arrow}
            </div>
        </div>
        <div class="form-group">
            <label>REPAS</label>
            <div class="input-wrapper select-wrapper">${_SVG.repas}
                <select id="${id}_repas" required>
                    <option value="" disabled selected>Repas sur place ?</option>
                    <option value="OUI">OUI</option>
                    <option value="PEUT-ÊTRE">PEUT-ÊTRE</option>
                    <option value="NON">NON</option>
                </select>${_SVG.arrow}
            </div>
        </div>
        <div class="form-group">
            <label>POSITIONNEMENT</label>
            <div class="input-wrapper select-wrapper">${_SVG.positionnement}
                <select id="${id}_positionnement" required>
                    <option value="" disabled selected>Choisissez votre positionnement</option>
                    <option value="Leader">Leader</option>
                    <option value="Follower">Follower</option>
                </select>${_SVG.arrow}
            </div>
        </div>
    </div>`;
}

function toggleTel(id, val) {
    const grp = document.getElementById(id + '_telGroup');
    const input = document.getElementById(id + '_telephone');
    if (val === 'NON') {
        grp.style.display = '';
        input.required = true;
    } else {
        grp.style.display = 'none';
        input.required = false;
        input.value = '';
    }
}

// =============================================
// AUTOCOMPLETE VILLE (geo.api.gouv.fr)
// =============================================
var _villeDebounce = {};
var _villeFocusedIdx = {};

function handleVilleInput(id, query) {
    if (_villeDebounce[id]) clearTimeout(_villeDebounce[id]);
    if (!query || query.length < 2) { hideVilleSugg(id); return; }
    _villeDebounce[id] = setTimeout(function() {
        fetch('https://geo.api.gouv.fr/communes?nom=' + encodeURIComponent(query) + '&fields=nom,codeDepartement&boost=population&limit=7')
            .then(function(r) { return r.json(); })
            .then(function(data) { showVilleSugg(id, data); })
            .catch(function() { hideVilleSugg(id); });
    }, 250);
}

function showVilleSugg(id, data) {
    var sugg = document.getElementById(id + '_villeSugg');
    if (!sugg || !data || !data.length) { hideVilleSugg(id); return; }
    _villeFocusedIdx[id] = -1;
    sugg.innerHTML = data.map(function(c) {
        var nom = c.nom.replace(/'/g, "\\'");
        return '<div class="ville-sugg-item" onmousedown="handleVilleSuggClick(\'' + id + '\', \'' + nom + '\')">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>' +
            '<span class="ville-sugg-nom">' + c.nom + '</span>' +
            '<span class="ville-sugg-dept">' + c.codeDepartement + '</span>' +
            '</div>';
    }).join('');
    sugg.style.display = 'block';
}

function hideVilleSugg(id) {
    var sugg = document.getElementById(id + '_villeSugg');
    if (sugg) sugg.style.display = 'none';
    _villeFocusedIdx[id] = -1;
}

function handleVilleKeydown(e, id) {
    var sugg = document.getElementById(id + '_villeSugg');
    if (!sugg || sugg.style.display === 'none') return;
    var items = sugg.querySelectorAll('.ville-sugg-item');
    if (!items.length) return;
    var idx = (_villeFocusedIdx[id] !== undefined) ? _villeFocusedIdx[id] : -1;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        idx = (idx + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        idx = (idx - 1 + items.length) % items.length;
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (idx >= 0 && items[idx]) items[idx].dispatchEvent(new MouseEvent('mousedown'));
        return;
    } else if (e.key === 'Escape') {
        hideVilleSugg(id);
        return;
    }
    _villeFocusedIdx[id] = idx;
    items.forEach(function(item, i) { item.classList.toggle('focused', i === idx); });
    if (idx >= 0) items[idx].scrollIntoView({ block: 'nearest' });
}

function handleVilleBlur(id) {
    setTimeout(function() { hideVilleSugg(id); }, 200);
}

function handleVilleSuggClick(id, nom) {
    var input = document.getElementById(id + '_ville');
    if (input) input.value = nom;
    hideVilleSugg(id);
}

function setNombre(n) {
    nombrePersonnes = n;
    document.querySelectorAll('.nombre-pill').forEach(function(btn, i) {
        btn.classList.toggle('active', i + 1 === n);
    });
    const container = document.getElementById('personnesContainer');
    container.innerHTML = '';
    for (let i = 1; i <= n; i++) {
        container.innerHTML += creerBlocPersonne(i);
    }
    // Afficher la zone bouton submit
    const submitZone = document.getElementById('submitZone');
    if (submitZone) submitZone.classList.remove('hidden');
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = n === 1 ? "S'INSCRIRE" : "INSCRIRE " + n + " PERSONNES";
}

function resetForm() {
    nombrePersonnes = 0;
    document.querySelectorAll('.nombre-pill').forEach(function(btn) {
        btn.classList.remove('active');
    });
    document.getElementById('personnesContainer').innerHTML = '';
    const submitZone = document.getElementById('submitZone');
    if (submitZone) submitZone.classList.add('hidden');
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "S'INSCRIRE"; }
}

// =============================================
// SOUMISSION DU FORMULAIRE
// =============================================
document.getElementById('clunyForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('statusMessage');

    btn.disabled = true;
    btn.textContent = "TRAITEMENT...";
    statusMsg.textContent = "";

    // Formater la date (YYYY-MM-DD → DD/MM/YYYY)
    const rawDate = document.getElementById('dateEvent').value;
    const parts = rawDate.split('-');
    const formattedDate = parts[2] + '/' + parts[1] + '/' + parts[0];

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz0kdd2uqlNxqtX_Ii1r4ETzdSS7YHGwKJ59fAndUhu0TvW5LrzdeV1ytR75kAO-C2fdw/exec";

    // Collecter les données de chaque personne
    const persons = [];
    for (let i = 1; i <= nombrePersonnes; i++) {
        const id = 'p' + i;
        const whatsapp = document.getElementById(id + '_whatsapp').value;
        persons.push({
            dateEvent: formattedDate,
            nom: document.getElementById(id + '_nom').value,
            prenom: document.getElementById(id + '_prenom').value,
            whatsapp: whatsapp,
            telephone: whatsapp === 'NON' ? document.getElementById(id + '_telephone').value : '',
            ville: document.getElementById(id + '_ville') ? document.getElementById(id + '_ville').value : '',
            activites: document.getElementById(id + '_activites').value,
            repas: document.getElementById(id + '_repas').value,
            positionnement: document.getElementById(id + '_positionnement').value
        });
    }

    // ========================================
    // MÉTHODE IFRAME : contourne 100% du CORS
    // Soumettre chaque personne via un iframe
    // ========================================
    persons.forEach(function(data, index) {
        const iframeName = 'hidden_iframe_' + Date.now() + '_' + index;
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'GET';
        hiddenForm.action = SCRIPT_URL;
        hiddenForm.target = iframeName;
        hiddenForm.style.display = 'none';

        Object.keys(data).forEach(function(key) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            hiddenForm.appendChild(input);
        });

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();

        // Nettoyer après 5 secondes
        setTimeout(function() {
            try { document.body.removeChild(iframe); } catch (err) { }
            try { document.body.removeChild(hiddenForm); } catch (err) { }
        }, 5000);
    });

    setTimeout(function() {
        showSuccessOverlay(persons);
        document.getElementById('clunyForm').reset();
        resetForm();
        btn.disabled = false;
    }, 3000);
});

// =====================
// OVERLAY DE SUCCÈS
// =====================
function showSuccessOverlay(persons) {
    const overlay = document.getElementById('successOverlay');
    const titleEl = document.getElementById('successTitle');
    const cardsContainer = document.getElementById('confirmationCards');

    const count = persons.length;
    if (titleEl) titleEl.textContent = count > 1 ? 'Inscriptions confirmées !' : 'Inscription confirmée !';

    // Générer une carte par personne
    if (cardsContainer) {
        cardsContainer.innerHTML = persons.map(function(p, idx) {
            const isLeader = p.positionnement === 'Leader';
            const badgeClass = isLeader ? 'leader' : 'follower';
            return '<div class="confirmation-card" style="animation-delay:' + (idx * 0.1) + 's">' +
                '<svg class="card-check" viewBox="0 0 52 52">' +
                    '<circle class="card-circle" cx="26" cy="26" r="24" fill="none"/>' +
                    '<path class="card-tick" fill="none" d="M14 27l8 8 16-16"/>' +
                '</svg>' +
                '<div class="card-info">' +
                    '<div class="card-name">' + p.prenom + ' ' + p.nom + '</div>' +
                    '<div class="card-details">' +
                        '<div class="card-detail">' +
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13">' +
                                '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>' +
                                '<circle cx="12" cy="9" r="2.5"/>' +
                            '</svg>' +
                            '<span>' + p.activites + '</span>' +
                        '</div>' +
                        '<div class="card-detail">' +
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13">' +
                                '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>' +
                                '<circle cx="9" cy="7" r="4"/>' +
                                '<path d="M23 21v-2a4 4 0 0 0-3-3.87"/>' +
                                '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>' +
                            '</svg>' +
                            '<span class="card-badge ' + badgeClass + '">' + p.positionnement + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    overlay.classList.remove('hidden');
    launchConfetti();

    // Auto-fermeture après 20 secondes
    const autoClose = setTimeout(function() {
        overlay.classList.add('hidden');
        window.location.reload();
    }, 20000);

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

        piece.style.cssText =
            'left:' + left + '%;' +
            'background:' + color + ';' +
            'width:' + size + 'px;' +
            'height:' + size + 'px;' +
            'border-radius:' + (isCircle ? '50%' : '2px') + ';' +
            'animation-duration:' + duration + 's;' +
            'animation-delay:' + delay + 's;';
        container.appendChild(piece);
    }

    setTimeout(function() {
        container.innerHTML = '';
    }, 5000);
}

// =============================================
// LOGIQUE ESPACE ADMIN
// =============================================

// Identifiants récupérés depuis Google Sheets
let ADMIN_CREDENTIALS = {};

// Pré-chargement des données en arrière-plan + init blocs personnes
document.addEventListener('DOMContentLoaded', function() {
    fetchDashboardStats(true);
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

let dashboardData = {};

// Ouvrir la modal de login
adminBtn.addEventListener('click', function() {
    loginModal.classList.remove('hidden');
    adminPhone.value = '';
    adminPass.value = '';
    loginError.textContent = '';
});

// Fermer la modal
loginClose.addEventListener('click', function() {
    loginModal.classList.add('hidden');
});

// Tentative de connexion
function attemptLogin() {
    const phone = adminPhone.value.trim().replace(/[\s\-\.\(\)]/g, '');
    const pass = adminPass.value.trim();

    if (!phone || !pass) {
        loginError.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    if (Object.keys(ADMIN_CREDENTIALS).length === 0) {
        loginError.textContent = "⏳ Chargement en cours...";
        loginSubmit.textContent = "CHARGEMENT...";
        loginSubmit.disabled = true;

        fetchDashboardStats(false, function() {
            loginSubmit.disabled = false;
            loginSubmit.textContent = "CONNEXION";
            if (Object.keys(ADMIN_CREDENTIALS).length > 0) {
                attemptLogin();
            } else {
                loginError.textContent = "Erreur serveur. Vérifiez votre connexion internet.";
            }
        });
        return;
    }

    const matchKey = Object.keys(ADMIN_CREDENTIALS).find(function(k) {
        return k.replace(/[\s\-\.\(\)]/g, '') === phone;
    });
    if (matchKey && ADMIN_CREDENTIALS[matchKey] === pass) {
        loginError.textContent = "";
        loginModal.classList.add('hidden');
        openDashboard();
    } else {
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
adminLogout.addEventListener('click', function() {
    adminDashboard.classList.add('hidden');
});

// Actualiser
document.getElementById('adminRefresh').addEventListener('click', function() {
    const btn = document.getElementById('adminRefresh');
    btn.textContent = '⏳ ...';
    btn.disabled = true;
    dashboardData = {};
    fetchDashboardStats(true, function() {
        btn.textContent = '↻ ACTUALISER';
        btn.disabled = false;
    });
    setTimeout(function() {
        btn.textContent = '↻ ACTUALISER';
        btn.disabled = false;
    }, 8000);
});

// Changement de date sur le dashboard
adminDateSelect.addEventListener('change', updateDashboardUI);

// Callback global pour le JSONP
window.handleDashboardStats = function(data) {
    if (data.status === 'success') {
        dashboardData = data.stats;
        if (data.admins) {
            ADMIN_CREDENTIALS = data.admins;
        }
        populateDateSelect();
        updateDashboardUI();
        loginSubmit.textContent = "CONNEXION";
        loginSubmit.disabled = false;

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

var _fetchCallback = null;
var _fetchRetries = 0;
var _fetchTimeout = null;

function fetchDashboardStats(isSilent, callback) {
    if (!isSilent) {
        loginSubmit.textContent = "CHARGEMENT...";
    }

    if (callback) {
        _fetchCallback = callback;
    }

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz0kdd2uqlNxqtX_Ii1r4ETzdSS7YHGwKJ59fAndUhu0TvW5LrzdeV1ytR75kAO-C2fdw/exec";

    if (_fetchTimeout) clearTimeout(_fetchTimeout);

    const script = document.createElement('script');
    script.src = SCRIPT_URL + "?action=getStats&callback=handleDashboardStats&ts=" + Date.now();

    script.onerror = function() {
        script.remove();
        _fetchRetries++;
        if (_fetchRetries <= 3) {
            console.log("JSONP retry " + _fetchRetries + "/3...");
            setTimeout(function() { fetchDashboardStats(isSilent); }, 1500);
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

    script.onload = function() {
        script.remove();
        _fetchRetries = 0;
        if (_fetchTimeout) clearTimeout(_fetchTimeout);
    };

    document.body.appendChild(script);

    _fetchTimeout = setTimeout(function() {
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

function populateDateSelect() {
    adminDateSelect.innerHTML = '';

    const dates = Object.keys(dashboardData).filter(function(k) { return k !== '_TOTAL_'; });
    dates.sort(function(a, b) {
        const pA = a.split('/'), pB = b.split('/');
        return new Date(pB[2], pB[1] - 1, pB[0]) - new Date(pA[2], pA[1] - 1, pA[0]);
    });

    dates.forEach(function(date) {
        const option = document.createElement('option');
        option.value = date;
        option.text = "INITIATION DU " + date;
        adminDateSelect.appendChild(option);
    });

    const globalOption = document.createElement('option');
    globalOption.value = '_TOTAL_';
    globalOption.text = 'TOUTES LES DATES (GLOBAL)';
    adminDateSelect.appendChild(globalOption);
}

function updateDashboardUI() {
    const selectedKey = adminDateSelect.value;
    if (!selectedKey) return;

    const stats = dashboardData[selectedKey];

    if (stats) {
        noDataMsg.classList.add('hidden');
        document.querySelector('.stats-grid').style.display = 'grid';
        animateValue(statTotal, 0, stats.total, 1000);
        animateValue(statLeader, 0, stats.leader, 1000);
        animateValue(statFollower, 0, stats.follower, 1000);
        animateValue(statRepas, 0, stats.repas, 1000);
    } else {
        document.querySelector('.stats-grid').style.display = 'none';
        noDataMsg.classList.remove('hidden');
    }
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = function(timestamp) {
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
