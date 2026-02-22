/* ============================================
   RESERVATION INITIATION CLUNY - Application
   ============================================ */

// ⚠️ IMPORTANT : Remplacez cette URL par l'URL de votre Google Apps Script déployé
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHRH-Ky9HilE9wSWSy6f9bDNEFhNJUXM2njWHweOH_q_iNsTRGnV2pQrBUng1bShcj/exec';

// --- DOM Elements ---
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const successOverlay = document.getElementById('successOverlay');
const errorOverlay = document.getElementById('errorOverlay');
const errorText = document.getElementById('errorText');
const btnNew = document.getElementById('btnNew');
const btnRetry = document.getElementById('btnRetry');

// --- Field Configuration ---
const fields = [
    { id: 'nom', label: 'Nom', validate: (v) => v.trim().length >= 2, message: 'Le nom doit contenir au moins 2 caractères.' },
    { id: 'prenom', label: 'Prénom', validate: (v) => v.trim().length >= 2, message: 'Le prénom doit contenir au moins 2 caractères.' },
    { id: 'whatsapp', label: 'Déjà Inscrit sur Whatsapp', validate: (v) => v !== '', message: 'Veuillez indiquer si vous êtes déjà inscrit sur Whatsapp.' },
    {
        id: 'telephone', label: 'Téléphone', validate: (v) => {
            const whatsappVal = document.getElementById('whatsapp').value;
            if (whatsappVal === 'OUI') return true; // Skip validation if already on WhatsApp
            return /^[\d\s\-\+\.]{8,}$/.test(v.trim());
        }, message: 'Veuillez entrer un numéro de téléphone valide.'
    },
    { id: 'activites', label: 'Activités', validate: (v) => v !== '', message: 'Veuillez choisir une activité.' },
    { id: 'positionnement', label: 'Positionnement', validate: (v) => v !== '', message: 'Veuillez choisir votre positionnement.' },
];

// --- Validation ---
function validateField(fieldConfig) {
    const input = document.getElementById(fieldConfig.id);
    const group = input.closest('.form-group');
    const errorEl = document.getElementById(`${fieldConfig.id}-error`);
    const value = input.value;

    if (!fieldConfig.validate(value)) {
        group.classList.add('has-error');
        errorEl.textContent = fieldConfig.message;
        return false;
    } else {
        group.classList.remove('has-error');
        errorEl.textContent = '';
        return true;
    }
}

function validateAll() {
    let isValid = true;
    fields.forEach((field) => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    return isValid;
}

// --- Real-time validation on blur ---
fields.forEach((fieldConfig) => {
    const input = document.getElementById(fieldConfig.id);
    input.addEventListener('blur', () => validateField(fieldConfig));
    input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group.classList.contains('has-error')) {
            validateField(fieldConfig);
        }
    });
});

// --- Form submission ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!validateAll()) {
        // Scroll to first error
        const firstError = form.querySelector('.has-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Check if the Script URL has been configured
    if (SCRIPT_URL === 'VOTRE_URL_GOOGLE_APPS_SCRIPT_ICI') {
        showError('⚠️ L\'URL du Google Apps Script n\'est pas configurée. Veuillez suivre les instructions dans le fichier Code.gs.');
        return;
    }

    // Collect data
    const data = {
        nom: document.getElementById('nom').value.trim().toUpperCase(),
        prenom: document.getElementById('prenom').value.trim().toUpperCase(),
        whatsapp: document.getElementById('whatsapp').value,
        telephone: document.getElementById('telephone').value.trim(),
        activites: document.getElementById('activites').value,
        positionnement: document.getElementById('positionnement').value,
    };

    // Show loading state
    setLoading(true);

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // With no-cors mode, we can't read the response,
        // so we assume success if no error is thrown
        showSuccess();
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        showError('Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.');
    } finally {
        setLoading(false);
    }
});

// --- Loading state ---
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// --- Success overlay ---
function showSuccess() {
    successOverlay.classList.add('visible');
}

function hideSuccess() {
    successOverlay.classList.remove('visible');
    form.reset();
    // Clear any remaining error states
    document.querySelectorAll('.form-group').forEach((group) => {
        group.classList.remove('has-error');
    });
    document.querySelectorAll('.error-message').forEach((el) => {
        el.textContent = '';
    });
    // Re-enable phone field after reset
    const phoneInput = document.getElementById('telephone');
    phoneInput.disabled = false;
    phoneInput.style.opacity = '1';
    phoneInput.style.cursor = '';
    phoneInput.placeholder = '06 XX XX XX XX';
}

// --- Error overlay ---
function showError(message) {
    errorText.textContent = message;
    errorOverlay.classList.add('visible');
}

function hideError() {
    errorOverlay.classList.remove('visible');
}

// --- Button handlers ---
btnNew.addEventListener('click', hideSuccess);
btnRetry.addEventListener('click', hideError);

// --- WhatsApp toggle: disable phone when already on WhatsApp ---
function togglePhone() {
    const whatsappSelect = document.getElementById('whatsapp');
    const phoneInput = document.getElementById('telephone');
    const phoneGroup = phoneInput.closest('.form-group');

    if (whatsappSelect.value === 'OUI') {
        phoneInput.value = '';
        phoneInput.disabled = true;
        phoneInput.style.opacity = '0.4';
        phoneInput.style.cursor = 'not-allowed';
        phoneInput.placeholder = 'Numéro non requis';
        phoneGroup.classList.remove('has-error');
        const errorEl = document.getElementById('telephone-error');
        if (errorEl) errorEl.textContent = '';
    } else {
        phoneInput.disabled = false;
        phoneInput.style.opacity = '1';
        phoneInput.style.cursor = '';
        phoneInput.placeholder = '06 XX XX XX XX';
    }
}

document.getElementById('whatsapp').addEventListener('change', togglePhone);

// --- Auto-capitalize Nom & Prénom ---
['nom', 'prenom'].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
        const pos = input.selectionStart;
        input.value = input.value.toUpperCase();
        input.setSelectionRange(pos, pos);
    });
});