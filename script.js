
document.addEventListener('DOMContentLoaded', () => {
    // === CONFIGURATION ===
    const totalImages = 32;
    const imageBaseName = 'catalogue_phams-phoenix_page-';
    const imageExtension = '.png';
    const imageDirectory = './images/';

    // === ÉLÉMENTS DOM ===
    const sliderImg = document.getElementById('slider-img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;

    // === SWIPE DETECTION ===
    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;
    const swipeThreshold = 50;

    // === FONCTION PRINCIPALE POUR CHANGER D’IMAGE ===
    function updateImage(newIndex) {
        if (newIndex >= totalImages) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = totalImages - 1;
        }

        const imageName = imageBaseName + (newIndex + 1) + imageExtension;
        const newSrc = imageDirectory + imageName;

        const img = new Image();
        img.onload = () => {
            sliderImg.src = newSrc;
            sliderImg.alt = `catalogue_des_pots_phams-phoenix_page-${newIndex + 1}`;

            // Animation propre ici
            sliderImg.classList.remove('animate-img');
            void sliderImg.offsetWidth;
            sliderImg.classList.add('animate-img');
        };

        img.onerror = () => {
            console.error(`Erreur : image introuvable -> ${newSrc}`);
            sliderImg.alt = `Erreur de chargement page ${newIndex + 1}`;
        };

        img.src = newSrc;
        currentIndex = newIndex;
    }

    // === FONCTIONS DE NAVIGATION ===
    function showNextImage() {
        updateImage(currentIndex + 1);
    }

    function showPrevImage() {
        updateImage(currentIndex - 1);
    }

    // Ajoutez cette variable booléenne au début de votre script, avec les autres variables d'état/swipe
    let isMultiTouch = false;


    // === GESTION DES TOUCHES POUR SWIPE ===
    document.querySelector('.slider').addEventListener('touchstart', (e) => {
        // --- MODIFICATION ICI : Détecter si c'est un toucher multi-doigts ---
        if (e.touches.length > 1) {
            isMultiTouch = true;
            touchstartX = 0;
            touchstartY = 0;
            return;
        } else {
            isMultiTouch = false;
            touchstartX = e.touches[0].clientX;
            touchstartY = e.touches[0].clientY;

        }
        // ---------------------------------------------------------------
    });

    // --- AJOUT/MODIFICATION : Gérer l'événement touchcancel ---

    document.querySelector('.slider').addEventListener('touchcancel', (e) => {
        // --- MODIFICATION : Réinitialiser le drapeau multi-touch et les positions ---
        isMultiTouch = false;
        touchstartX = 0;
        touchendX = 0;
        touchstartY = 0;
        touchendY = 0;
        // console.log('Touch cancel');
    });


    // --- MODIFICATION ICI : L'écouteur touchend ---
    document.querySelector('.slider').addEventListener('touchend', (e) => {
        // On enregistre toujours la position finale
        touchendX = e.changedTouches[0].clientX;
        touchendY = e.changedTouches[0].clientY;
        // console.log('Touch end:', touchendX, touchendY);

        // On appelle handleSwipe QUI va vérifier si c'était multi-touch
        handleSwipe();


        isMultiTouch = false; // Réinitialise le drapeau multi-touch

    });


    // --- MODIFICATION ICI : La fonction handleSwipe ---
    function handleSwipe() {
        // --- AJOUT IMPORTANT : Ignorer le swipe si le toucher initial était multi-doigts ---
        if (isMultiTouch) {
            // console.log('Ignoring swipe due to multi-touch flag.');
            return;
        }
        // -------------------------------------------------------------------

        const diffX = touchendX - touchstartX;
        const diffY = touchendY - touchstartY;

        // Le reste de la logique de détection de swipe ne change pas
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            // console.log('Swipe detected!');
            if (diffX < 0) {
                showNextImage();
            } else {
                showPrevImage();
            }
        } else {
            // console.log('Swipe not detected (movement too small or vertical).');
        }

    }

    // === ÉCOUTEURS DES BOUTONS ===
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // === INITIALISATION ===
    updateImage(currentIndex);
});


(function () {
    // Retrouver les éléments nécessaires à l'intérieur de cette fonction
    const mobileShowBtns = document.getElementById('mobileShowBtns');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Définir les textes pour les deux états
    const textShow = "Afficher les boutons de navigation";
    const textHide = "Ne pas afficher les boutons de navigation";

    // Vérifier que tous les éléments nécessaires existent
    if (mobileShowBtns && prevBtn && nextBtn) {

        // --- Fonction pour mettre à jour le texte du bouton en fonction de l'état des flèches ---
        function updateToggleButtonText() {
            // Les flèches sont visibles si elles ont la classe 'is-visible-mobile'
            if (prevBtn.classList.contains('is-visible-mobile')) {
                // Si les flèches sont visibles, le texte du bouton doit proposer de les cacher
                mobileShowBtns.textContent = textHide;

            } else {
                // Si les flèches sont cachées, le texte du bouton doit proposer de les afficher
                mobileShowBtns.textContent = textShow;
            }
        }


        // Ajouter l'écouteur de clic sur le bouton révélateur mobile
        mobileShowBtns.addEventListener('click', () => {
            // 1. Basculer la classe 'is-visible-mobile' sur les flèches (ce qui change leur visibilité)
            prevBtn.classList.toggle('is-visible-mobile');
            nextBtn.classList.toggle('is-visible-mobile');

            // 2. Mettre à jour le texte (ou l'icône) du bouton mobileShowBtns APRÈS que la visibilité a changé
            updateToggleButtonText();
        });

        updateToggleButtonText();

    }
})();


//// swipe
const hint = document.querySelector('.swipe-hint');
const mobileBtn = document.getElementById('mobileShowBtns');

let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    if (Math.abs(touchEndX - touchStartX) > 50) {
        hint.classList.add('hidden');
    }
}

// Swipe sur tout le document 
document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

// Si le bouton est cliqué → on cache l’indice aussi
mobileBtn.addEventListener('click', () => {
    hint.classList.add('hidden');
});