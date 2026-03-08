// Désactiver le téléphone si déjà inscrit sur WhatsApp
document.getElementById('whatsapp').addEventListener('change', function () {
    const telInput = document.getElementById('telephone');
    const telWrapper = telInput.closest('.input-wrapper');
    if (this.value === 'OUI') {
        telInput.disabled = true;
        telInput.value = '';
        telInput.placeholder = 'Non requis (déjà sur WhatsApp)';
        telWrapper.classList.add('input-disabled');
        telInput.removeAttribute('required');
    } else {
        telInput.disabled = false;
        telInput.placeholder = '06 XX XX XX XX';
        telWrapper.classList.remove('input-disabled');
        telInput.setAttribute('required', 'required');
    }
});

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
    }, 2000);
});

// =====================
// OVERLAY DE SUCCÈS
// =====================
function showSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    overlay.classList.remove('hidden');
    launchConfetti();

    // Fermer l'overlay et recharger après 8 secondes automatiquement
    setTimeout(() => {
        overlay.classList.add('hidden');
        window.location.reload();
    }, 8000);

    // Ou fermer immédiatement au toucher/clic pour un autre test/inscription
    overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
        window.location.reload();
    });
}

function launchConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff4444', '#ff9900', '#ffdd00', '#44bb44', '#4488ff', '#bb44ff', '#ff66bb', '#00cccc'];
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
