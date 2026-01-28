document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    const checkButton = document.getElementById('checkButton');
    const results = document.getElementById('results');
    const toggle = document.getElementById('togglePassword');

    function checkStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        switch (score) {
            case 5: return "Très fort";
            case 4: return "Fort";
            case 3: return "Moyen";
            case 2: return "Faible";
            default: return "Très faible";
        }
    }

    const strengthColors = {
        "Très fort": "#2ecc71",
        "Fort": "#27ae60",
        "Moyen": "#f1c40f",
        "Faible": "#e67e22",
        "Très faible": "#e74c3c"
    };

    // Met à jour l'affichage de la solidité
    function updateStrengthDisplay(password) {
        if (!results) return;
        if (!password) {
            results.textContent = "";
            results.style.color = "";
            return;
        }
        const strength = checkStrength(password);
        results.textContent = `Solidité : ${strength}`;
        results.style.color = strengthColors[strength] || "black";
    }

    // Debounce util pour éviter trop d'appels lors de la frappe
    function debounce(fn, wait) {
        let t;
        return function (...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // Ajustements pour petits écrans / écrans tactiles
    function adjustForScreen() {
        const width = window.innerWidth;
        const small = width <= 480; // seuil pour mobile
        const medium = width > 480 && width <= 900;

        // boutons et zones de texte plus grandes sur mobile
        if (checkButton) {
            checkButton.style.padding = small ? "10px 14px" : medium ? "8px 12px" : "";
            checkButton.style.fontSize = small ? "16px" : "";
        }
        if (passwordInput) {
            passwordInput.style.fontSize = small ? "16px" : "";
            passwordInput.style.padding = small ? "10px" : "";
        }
        if (results) {
            results.style.fontSize = small ? "16px" : "";
            results.style.marginTop = small ? "8px" : "";
        }

        // adapter la taille de l'icône SVG si présente
        adjustSVGSize(small ? 20 : medium ? 18 : 16);
    }

    function adjustSVGSize(size) {
        if (!toggle) return;
        const svg = toggle.querySelector('svg');
        if (svg) {
            svg.setAttribute('width', String(size));
            svg.setAttribute('height', String(size));
            // pour que le SVG s'adapte correctement
            svg.style.display = 'block';
        }
    }

    // SVG icônes (utilise currentColor pour hériter la couleur du bouton)
    const eyeSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
    const eyeSlashSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.66 20.66 0 0 1 5-5"/><path d="M1 1l22 22"/><path d="M14.12 14.12A3 3 0 0 1 9.88 9.88"/></svg>';

    // Fonction réutilisable pour mettre à jour l'icône du toggle
    function updateToggle() {
        if (!toggle || !passwordInput) return;
        const hidden = passwordInput.type === 'password';
        const icon = hidden ? eyeSlashSVG : eyeSVG;
        // Afficher uniquement l'icône ; conserver aria-label pour l'accessibilité
        toggle.innerHTML = icon;
        toggle.setAttribute('aria-label', hidden ? 'Afficher le mot de passe' : 'Cacher le mot de passe');
        toggle.setAttribute('aria-pressed', String(!hidden));
        // adapter la taille du SVG selon l'écran
        const small = window.innerWidth <= 480;
        const medium = window.innerWidth > 480 && window.innerWidth <= 900;
        adjustSVGSize(small ? 20 : medium ? 18 : 16);
    }

    if (passwordInput && checkButton && results) {
        // sauvegarder le texte d'origine du bouton
        const originalCheckText = checkButton.textContent || 'Vérifier';
        const restartText = 'Start again';

        // vérification et bascule en mode "restart"
        checkButton.addEventListener('click', () => {
            const mode = checkButton.dataset.mode || 'check';

            if (mode === 'check') {
                const password = passwordInput.value.trim();
                if (!password) {
                    results.textContent = "Veuillez entrer un mot de passe.";
                    results.style.color = "red";
                    return;
                }
                // Affiche la solidité uniquement quand on clique sur "Vérifier"
                updateStrengthDisplay(password);

                // passer en mode "restart" : désactiver la saisie et changer le bouton
                checkButton.dataset.mode = 'restart';
                checkButton.textContent = restartText;
                passwordInput.disabled = true;
                if (toggle) {
                    toggle.style.pointerEvents = 'none';
                    toggle.setAttribute('aria-disabled', 'true');
                }
                // Optionnel : éviter la modification du type après vérification
            } else {
                // mode restart -> réinitialiser tout pour recommencer
                checkButton.dataset.mode = 'check';
                checkButton.textContent = originalCheckText;
                if (results) {
                    results.textContent = "";
                    results.style.color = "";
                }
                if (passwordInput) {
                    passwordInput.disabled = false;
                    passwordInput.value = "";
                    // remettre le champ en type password par sécurité
                    passwordInput.type = 'password';
                    passwordInput.focus();
                }
                if (toggle) {
                    toggle.style.pointerEvents = '';
                    toggle.removeAttribute('aria-disabled');
                    updateToggle();
                }
            }
        });

        // suppression de la mise à jour en direct : le score n'apparaît que lors du clic sur "Vérifier"

        // permettre la validation via la touche "Entrée" (clavier mobile)
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkButton.click();
            }
        });
    }

    if (passwordInput && toggle) {
        // initialiser l'icône au chargement
        updateToggle();

        toggle.addEventListener('click', () => {
            const currentlyHidden = passwordInput.type === 'password';
            passwordInput.type = currentlyHidden ? 'text' : 'password';
            updateToggle();
            // sur mobile, re-focus l'input après bascule pour garder le clavier
            if ('ontouchstart' in window) {
                passwordInput.focus();
                // placer le curseur en fin
                const len = passwordInput.value.length;
                passwordInput.setSelectionRange(len, len);
            }
        });
    }

    // initialisation responsive et écoute des changements de taille
    adjustForScreen();
    window.addEventListener('resize', debounce(adjustForScreen, 150));
    // aussi écouter l'orientation pour certains appareils
    window.addEventListener('orientationchange', () => {
        setTimeout(adjustForScreen, 200);
    });
});

// Gestion de la sélection de la langue et traduction
const translations = {
    fr: {
        title: "Calculateur de la solidité d'un mot de passe",
        passwordLabel: "Mot de passe :",
        passwordPlaceholder: "Entrez votre mot de passe",
        checkButton: "Vérifier la solidité",
        listenMusic: "Écoutez la musique :",
        github: "Mon GitHub",
        legalNotice: "Mentions légales",
        privacyPolicy: "Politique de confidentialité",
    },
    en: {
        title: "Password Strength Calculator",
        passwordLabel: "Password:",
        passwordPlaceholder: "Enter your password",
        checkButton: "Check strength",
        listenMusic: "Listen to the music:",
        github: "My GitHub",
        legalNotice: "Legal Notice",
        privacyPolicy: "Privacy Policy",
    },
    de: {
        title: "Passwortstärke-Rechner",
        passwordLabel: "Passwort:",
        passwordPlaceholder: "Geben Sie Ihr Passwort ein",
        checkButton: "Stärke prüfen",
        listenMusic: "Musik anhören:",
        github: "Mein GitHub",
        legalNotice: "Rechtlicher Hinweis",
        privacyPolicy: "Datenschutz-Bestimmungen",
    },
    sp: {
        title: "Calculador de fuerza de contraseña",
        passwordLabel: "Contraseña:",
        passwordPlaceholder: "Ingrese su contraseña",
        checkButton: "Verificar fuerza",
        listenMusic: "Escuchar música:",
        github: "Mi GitHub",
        legalNotice: "Aviso legal",
        privacyPolicy: "Política de privacidad",
    },
    it: {
        title: "Calcolatore della forza della password",
        passwordLabel: "Password:",
        passwordPlaceholder: "Inserisci la tua password",
        checkButton: "Verifica forza",
        listenMusic: "Ascolta la musica:",
        github: "Il mio GitHub",
        legalNotice: "Avviso legale",
        privacyPolicy: "Politica sulla privacy",
    },
    pt: {
        title: "Calculadora de força de senha",
        passwordLabel: "Senha:",
        passwordPlaceholder: "Digite sua senha",
        checkButton: "Verificar força",
        listenMusic: "Ouça a música:",
        github: "Meu GitHub",
        legalNotice: "Aviso legal",
        privacyPolicy: "Política de privacidade",
    },
    nl: {
        title: "Wachtwoordsterkte Calculator",
        passwordLabel: "Wachtwoord:",
        passwordPlaceholder: "Voer uw wachtwoord in",
        checkButton: "Controleer sterkte",
        listenMusic: "Luister naar de muziek:",
        github: "Mijn GitHub",
        legalNotice: "Juridische kennisgeving",
        privacyPolicy: "Privacybeleid",
    },
    br: {
        title: "Kalkulator krederion ar geriadur",
        passwordLabel: "Geriadur:",
        passwordPlaceholder: "Entrer ho geriadur",
        checkButton: "Gwiriat krederion",
        listenMusic: "Klevet al leizh :",
        github: "Ma GitHub",
        legalNotice: "Notenn reizh",
        privacyPolicy: "Politik prevezded",
    }
};

const languageSelect = document.getElementById("languageSelect");

function setLanguage(lang) {
    // Texte classiques
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = translations[lang][key];
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = translations[lang][key];
    });

    document.documentElement.lang = lang;
    localStorage.setItem("language", lang);
}

// Charger la langue sauvegardée
const savedLanguage = localStorage.getItem("language") || "fr";
languageSelect.value = savedLanguage;
setLanguage(savedLanguage);

// Changement manuel
languageSelect.addEventListener("change", (e) => {
    setLanguage(e.target.value);
});