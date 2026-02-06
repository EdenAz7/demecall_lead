/**
 * Fichier : assets/js/main.js
 * Description : Gestion complète du formulaire (Multi-select, Filtre, Navigation et envoi Google Sheets)
 */

document.addEventListener("DOMContentLoaded", function () {
    
    // --- CONFIGURATION ---
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzF8rDp18nWGfrxuLbj4qF3AQK0GhWRWQKqdmzV544NfI0KezTtz54rIh9U3q8Lnsu6/exec";
    
    // --- ELEMENTS HTML ---
    const navbarEl = document.querySelector(".navbar");
    const form = document.getElementById("form");
    const deptSelect = document.getElementById('residence');
    const searchInput = document.getElementById('searchDept');
    const messageBox = document.getElementById("message");
    const submitBtn = document.getElementById("submit-button");

    /* ============================================================
       1. NAVIGATION ET SCROLL
       (Gestion de la barre de navigation lors du défilement)
    ============================================================ */
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbarEl.classList.add("fixed", "shrink");
            document.body.style.paddingTop = navbarEl.offsetHeight + "px";
        } else {
            navbarEl.classList.remove("fixed", "shrink");
            document.body.style.paddingTop = "0px";
        }
    });

    /* ============================================================
       2. MULTI-SELECT SANS CTRL ET SANS SAUTS D'ÉCRAN
       (Permet de cliquer simplement pour sélectionner plusieurs options)
    ============================================================ */
    if (deptSelect) {
        deptSelect.addEventListener('mousedown', function(e) {
            // Empêche le comportement par défaut qui fait sauter la page
            e.preventDefault(); 

            const option = e.target;
            if (option.tagName === 'OPTION') {
                // Sauvegarde de la position actuelle du scroll dans la liste
                const scrollTop = this.scrollTop; 
                
                // Alterne l'état de sélection
                option.selected = !option.selected; 

                // Maintient la position du scroll après la sélection
                setTimeout(() => {
                    this.scrollTop = scrollTop;
                }, 0);

                // Déclenche l'événement de changement pour d'autres scripts
                deptSelect.dispatchEvent(new Event('change'));
            }
        });
    }

    /* ============================================================
       3. RECHERCHE / FILTRAGE DES DÉPARTEMENTS
       (Filtre la liste selon la saisie dans le champ de recherche)
    ============================================================ */
    if (searchInput && deptSelect) {
        searchInput.addEventListener('input', function() {
            const filter = this.value.toLowerCase();
            const options = deptSelect.options;

            for (let i = 0; i < options.length; i++) {
                const text = options[i].text.toLowerCase();
                // Affiche l'option si elle correspond à la recherche, sinon la masque
                options[i].style.display = text.includes(filter) ? "" : "none";
            }
        });
    }

    /* ============================================================
       4. PRÉPARATION ET ENVOI DES DONNÉES (GOOGLE SHEETS)
       (Collecte les données et fusionne les sélections multiples)
    ============================================================ */
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // Affichage de l'état d'envoi
            messageBox.textContent = "Envoi en cours...";
            messageBox.style.display = "block";
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = {};

            // Collecte intelligente des données
            formData.forEach((value, key) => {
                // Traitement spécial pour le champ multi-sélection "Département"
                if (key === "Département") {
                    const selectedOptions = Array.from(deptSelect.selectedOptions)
                                                 .map(option => option.value);
                    // On fusionne les choix en une seule chaîne : "01, 05, 75"
                    data[key] = selectedOptions.join(", "); 
                } else {
                    // Champs standards
                    data[key] = value;
                }
            });

            // Encodage des données en format URL
            const formDataString = Object.keys(data)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                .join('&');

            // Envoi de la requête POST
            fetch(SCRIPT_URL, {
                redirect: "follow",
                method: "POST",
                body: formDataString,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                },
            })
            .then(response => {
                if (!response.ok) throw new Error("Erreur de réseau");
                // Redirection vers la page de succès
                window.location.href = "/merci.html";
            })
            .catch(error => {
                console.error("Erreur d'envoi:", error);
                messageBox.textContent = "Une erreur est survenue. Veuillez réessayer.";
                messageBox.style.color = "red";
                submitBtn.disabled = false;
            });
        });
    }

    /* ============================================================
       5. ANIMATIONS (REVEAL ON SCROLL)
    ============================================================ */
    const reveals = document.querySelectorAll(".reveal");
    function handleReveal() {
        const triggerBottom = window.innerHeight * 0.85;
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < triggerBottom) {
                el.classList.add("visible");
            }
        });
    }
    window.addEventListener("scroll", handleReveal);
    handleReveal(); // Exécution initiale
});