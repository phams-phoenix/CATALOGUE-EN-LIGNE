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
    let isMultiTouch = false;

    // === FONCTION DE VÉRIFICATION DU ZOOM ===
    function isImageZoomed() {
        // 1. Détection du zoom natif du téléphone (Pinch-to-zoom)
        if (window.visualViewport && window.visualViewport.scale > 1.01) {
            return true;
        }

        // 2. Détection du zoom CSS (si transform: scale est utilisé)
        const style = window.getComputedStyle(sliderImg);
        const transform = style.transform;
        if (transform && transform !== 'none') {
            const matrix = transform.match(/^matrix\((.+)\)$/);
            if (matrix) {
                const values = matrix[1].split(',');
                const scaleX = parseFloat(values[0]);
                if (scaleX > 1.05) return true;
            }
        }

        // 3. Vérification si l'image est physiquement plus large que le conteneur
        if (sliderImg.offsetWidth > document.querySelector('.slider').offsetWidth + 10) {
            return true;
        }

        return false;
    }

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

            // Animation
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

    // === GESTION DES TOUCHES POUR SWIPE ===
    const sliderContainer = document.querySelector('.slider');
    
    sliderContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            isMultiTouch = true;
        } else {
            isMultiTouch = false;
            touchstartX = e.touches[0].clientX;
            touchstartY = e.touches[0].clientY;
        }
    }, { passive: true });

    sliderContainer.addEventListener('touchcancel', () => {
        isMultiTouch = false;
    });

    sliderContainer.addEventListener('touchend', (e) => {
        if (!isMultiTouch) {
            touchendX = e.changedTouches[0].clientX;
            touchendY = e.changedTouches[0].clientY;
            handleSwipe();
        }
        isMultiTouch = false; 
    }, { passive: true });

    // === LOGIQUE DE SWIPE AJUSTÉE ===
    function handleSwipe() {
        // Condition de blocage : si multi-doigts OU si zoomé
        if (isMultiTouch || isImageZoomed()) {
            return; 
        }

        const diffX = touchendX - touchstartX;
        const diffY = touchendY - touchstartY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX < 0) {
                showNextImage();
            } else {
                showPrevImage();
            }
        }
    }

    // === ÉCOUTEURS DES BOUTONS ===
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // === INITIALISATION ===
    updateImage(currentIndex);
});

// === GESTION DES BOUTONS MOBILES (IIFE) ===
(function () {
    const mobileShowBtns = document.getElementById('mobileShowBtns');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const textShow = "Afficher les boutons de navigation";
    const textHide = "Ne pas afficher les boutons de navigation";

    if (mobileShowBtns && prevBtn && nextBtn) {
        function updateToggleButtonText() {
            mobileShowBtns.textContent = prevBtn.classList.contains('is-visible-mobile') ? textHide : textShow;
        }

        mobileShowBtns.addEventListener('click', () => {
            prevBtn.classList.toggle('is-visible-mobile');
            nextBtn.classList.toggle('is-visible-mobile');
            updateToggleButtonText();
        });

        updateToggleButtonText();
    }
})();

// === INDICE DE SWIPE (HINT) ===
(function() {
    const hint = document.querySelector('.swipe-hint');
    const mobileBtn = document.getElementById('mobileShowBtns');
    let hTouchStartX = 0;

    if (hint) {
        document.addEventListener('touchstart', e => {
            hTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', e => {
            const hTouchEndX = e.changedTouches[0].screenX;
            if (Math.abs(hTouchEndX - hTouchStartX) > 50) {
                hint.classList.add('hidden');
            }
        }, { passive: true });

        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                hint.classList.add('hidden');
            });
        }
    }
})();