document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("passwordInput");
  const checkButton = document.getElementById("checkButton");
  const results = document.getElementById("results");
  const toggle = document.getElementById("togglePassword");

  function checkStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 5:
        return "veryStrong";
      case 4:
        return "strong";
      case 3:
        return "medium";
      case 2:
        return "weak";
      default:
        return "veryWeak";
    }
  }

  let currentLanguage = localStorage.getItem("language") || "fr";

  // Fonction pour créer des particules au clic
  function createClickParticles(event) {
    const rect = event.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement("div");
      particle.style.position = "fixed";
      particle.style.left = x + "px";
      particle.style.top = y + "px";
      particle.style.width = "8px";
      particle.style.height = "8px";
      particle.style.backgroundColor = "#667eea";
      particle.style.borderRadius = "50%";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "9999";
      particle.style.animation = `particleExplode 0.6s ease-out forwards`;
      particle.style.setProperty("--angle", i * 60 + "deg");
      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 600);
    }
  }

  const strengthColors = {
    veryStrong: "#2ecc71",
    strong: "#27ae60",
    medium: "#f1c40f",
    weak: "#e67e22",
    veryWeak: "#e74c3c",
  };

  // Met à jour l'affichage de la solidité
  function updateStrengthDisplay(password) {
    if (!results) return;
    if (!password) {
      results.textContent = "";
      results.style.color = "";
      results.removeAttribute("aria-label");
      return;
    }
    const strengthKey = checkStrength(password);
    const strengthText =
      translations[currentLanguage]?.strengths?.[strengthKey] || "Unknown";
    const emptyText =
      translations[currentLanguage]?.emptyPassword ||
      "Veuillez entrer un mot de passe.";
    results.textContent = `Solidité : ${strengthText}`;
    results.style.color = strengthColors[strengthKey] || "black";
    results.setAttribute("role", "status");
    results.setAttribute("aria-live", "polite");
    results.setAttribute("aria-atomic", "true");
    results.setAttribute(
      "aria-label",
      `Solidité du mot de passe: ${strengthText}`,
    );
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
      checkButton.style.padding = small
        ? "10px 14px"
        : medium
          ? "8px 12px"
          : "";
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
    const svg = toggle.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
      // pour que le SVG s'adapte correctement
      svg.style.display = "block";
    }
  }

  // SVG icônes (utilise currentColor pour hériter la couleur du bouton)
  const eyeSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const eyeSlashSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.66 20.66 0 0 1 5-5"/><path d="M1 1l22 22"/><path d="M14.12 14.12A3 3 0 0 1 9.88 9.88"/></svg>';

  // Fonction réutilisable pour mettre à jour l'icône du toggle
  function updateToggle() {
    if (!toggle || !passwordInput) return;
    const hidden = passwordInput.type === "password";
    const icon = hidden ? eyeSlashSVG : eyeSVG;
    const showText =
      translations[currentLanguage]?.showPassword || "Afficher le mot de passe";
    const hideText =
      translations[currentLanguage]?.hidePassword || "Cacher le mot de passe";
    // Afficher uniquement l'icône ; conserver aria-label pour l'accessibilité
    toggle.innerHTML = icon;
    toggle.setAttribute("aria-label", hidden ? showText : hideText);
    toggle.setAttribute("aria-pressed", String(!hidden));
    toggle.setAttribute("aria-expanded", String(!hidden));
    toggle.setAttribute("type", "button");
    // adapter la taille du SVG selon l'écran
    const small = window.innerWidth <= 480;
    const medium = window.innerWidth > 480 && window.innerWidth <= 900;
    adjustSVGSize(small ? 20 : medium ? 18 : 16);
  }

  if (passwordInput && checkButton && results) {
    // sauvegarder le texte d'origine du bouton
    const originalCheckText = checkButton.textContent || "Vérifier";

    // vérification et bascule en mode "restart"
    checkButton.addEventListener("click", () => {
      createClickParticles(event);
      const mode = checkButton.dataset.mode || "check";

      if (mode === "check") {
        const password = passwordInput.value.trim();
        if (!password) {
          const emptyText =
            translations[currentLanguage]?.emptyPassword ||
            "Veuillez entrer un mot de passe.";
          results.textContent = emptyText;
          results.style.color = "red";
          results.setAttribute("role", "alert");
          return;
        }
        // Affiche la solidité uniquement quand on clique sur "Vérifier"
        updateStrengthDisplay(password);

        // passer en mode "restart" : désactiver la saisie et changer le bouton
        checkButton.dataset.mode = "restart";
        const restartText =
          translations[currentLanguage]?.restartButton || "Start again";
        checkButton.textContent = restartText;
        passwordInput.disabled = true;
        if (toggle) {
          toggle.style.pointerEvents = "none";
          toggle.setAttribute("aria-disabled", "true");
        }
        // Optionnel : éviter la modification du type après vérification
      } else {
        // mode restart -> réinitialiser tout pour recommencer
        checkButton.dataset.mode = "check";
        checkButton.textContent = originalCheckText;
        if (results) {
          results.textContent = "";
          results.style.color = "";
          results.removeAttribute("aria-label");
          results.removeAttribute("role");
        }
        if (passwordInput) {
          passwordInput.disabled = false;
          passwordInput.value = "";
          // remettre le champ en type password par sécurité
          passwordInput.type = "password";
          passwordInput.focus();
        }
        if (toggle) {
          toggle.style.pointerEvents = "";
          toggle.removeAttribute("aria-disabled");
          updateToggle();
        }
      }
    });

    // suppression de la mise à jour en direct : le score n'apparaît que lors du clic sur "Vérifier"

    // permettre la validation via la touche "Entrée" (clavier mobile)
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkButton.click();
      }
    });
  }

  if (passwordInput && toggle) {
    // initialiser l'icône au chargement
    updateToggle();

    toggle.addEventListener("click", () => {
      const currentlyHidden = passwordInput.type === "password";
      passwordInput.type = currentlyHidden ? "text" : "password";
      updateToggle();
      // sur mobile, re-focus l'input après bascule pour garder le clavier
      if ("ontouchstart" in window) {
        passwordInput.focus();
        // placer le curseur en fin
        const len = passwordInput.value.length;
        passwordInput.setSelectionRange(len, len);
      }
    });
  }

  // initialisation responsive et écoute des changements de taille
  adjustForScreen();
  window.addEventListener("resize", debounce(adjustForScreen, 150));
  // aussi écouter l'orientation pour certains appareils
  window.addEventListener("orientationchange", () => {
    setTimeout(adjustForScreen, 200);
  });
});

// Gestion de la sélection de la langue et traduction
const translations = {
  fr: {
    title: "Calculateur de la solidité d'un mot de passe",
    passwordLabel: "Mot de passe :",
    passwordPlaceholder: "Entrez votre mot de passe",
    passwordHelp:
      "Entrez un mot de passe pour vérifier sa solidité. Un bon mot de passe contient des majuscules, des minuscules, des chiffres et des caractères spéciaux.",
    checkButton: "Vérifier la solidité",
    listenMusic: "Écoutez la musique :",
    github: "Mon GitHub",
    legalNotice: "Mentions légales",
    privacyPolicy: "Politique de confidentialité",
    strengths: {
      veryStrong: "Très fort",
      strong: "Fort",
      medium: "Moyen",
      weak: "Faible",
      veryWeak: "Très faible",
    },
    restartButton: "Recommencer",
    emptyPassword: "Veuillez entrer un mot de passe.",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Cacher le mot de passe",
  },
  en: {
    title: "Password Strength Calculator",
    passwordLabel: "Password:",
    passwordPlaceholder: "Enter your password",
    passwordHelp:
      "Enter a password to check its strength. A good password contains uppercase letters, lowercase letters, numbers and special characters.",
    checkButton: "Check strength",
    listenMusic: "Listen to the music:",
    github: "My GitHub",
    legalNotice: "Legal Notice",
    privacyPolicy: "Privacy Policy",
    strengths: {
      veryStrong: "Very Strong",
      strong: "Strong",
      medium: "Medium",
      weak: "Weak",
      veryWeak: "Very Weak",
    },
    restartButton: "Start again",
    emptyPassword: "Please enter a password.",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },
  de: {
    title: "Passwortstärke-Rechner",
    passwordLabel: "Passwort:",
    passwordPlaceholder: "Geben Sie Ihr Passwort ein",
    passwordHelp:
      "Geben Sie ein Passwort ein, um dessen Stärke zu überprüfen. Ein gutes Passwort enthält Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen.",
    checkButton: "Stärke prüfen",
    listenMusic: "Musik anhören:",
    github: "Mein GitHub",
    legalNotice: "Rechtlicher Hinweis",
    privacyPolicy: "Datenschutz-Bestimmungen",
    strengths: {
      veryStrong: "Sehr stark",
      strong: "Stark",
      medium: "Mittel",
      weak: "Schwach",
      veryWeak: "Sehr schwach",
    },
    restartButton: "Nochmal versuchen",
    emptyPassword: "Bitte geben Sie ein Passwort ein.",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort verbergen",
  },
  sp: {
    title: "Calculador de fuerza de contraseña",
    passwordLabel: "Contraseña:",
    passwordPlaceholder: "Ingrese su contraseña",
    passwordHelp:
      "Ingrese una contraseña para verificar su fuerza. Una buena contraseña contiene letras mayúsculas, minúsculas, números y caracteres especiales.",
    checkButton: "Verificar fuerza",
    listenMusic: "Escuchar música:",
    github: "Mi GitHub",
    legalNotice: "Aviso legal",
    privacyPolicy: "Política de privacidad",
    strengths: {
      veryStrong: "Muy fuerte",
      strong: "Fuerte",
      medium: "Medio",
      weak: "Débil",
      veryWeak: "Muy débil",
    },
    restartButton: "Intentar de nuevo",
    emptyPassword: "Por favor, ingrese una contraseña.",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
  },
  it: {
    title: "Calcolatore della forza della password",
    passwordLabel: "Password:",
    passwordPlaceholder: "Inserisci la tua password",
    passwordHelp:
      "Inserisci una password per verificarne la forza. Una buona password contiene lettere maiuscole, minuscole, numeri e caratteri speciali.",
    checkButton: "Verifica forza",
    listenMusic: "Ascolta la musica:",
    github: "Il mio GitHub",
    legalNotice: "Avviso legale",
    privacyPolicy: "Politica sulla privacy",
    strengths: {
      veryStrong: "Molto forte",
      strong: "Forte",
      medium: "Medio",
      weak: "Debole",
      veryWeak: "Molto debole",
    },
    restartButton: "Riprova",
    emptyPassword: "Per favore, inserisci una password.",
    showPassword: "Mostra password",
    hidePassword: "Nascondi password",
  },
  pt: {
    title: "Calculadora de força de senha",
    passwordLabel: "Senha:",
    passwordPlaceholder: "Digite sua senha",
    passwordHelp:
      "Digite uma senha para verificar sua força. Uma boa senha contém letras maiúsculas, minúsculas, números e caracteres especiais.",
    checkButton: "Verificar força",
    listenMusic: "Ouça a música:",
    github: "Meu GitHub",
    legalNotice: "Aviso legal",
    privacyPolicy: "Política de privacidade",
    strengths: {
      veryStrong: "Muito forte",
      strong: "Forte",
      medium: "Médio",
      weak: "Fraco",
      veryWeak: "Muito fraco",
    },
    restartButton: "Tentar novamente",
    emptyPassword: "Por favor, digite uma senha.",
    showPassword: "Mostrar senha",
    hidePassword: "Ocultar senha",
  },
  nl: {
    title: "Wachtwoordsterkte Calculator",
    passwordLabel: "Wachtwoord:",
    passwordPlaceholder: "Voer uw wachtwoord in",
    passwordHelp:
      "Voer een wachtwoord in om de sterkte te controleren. Een goed wachtwoord bevat hoofdletters, kleine letters, getallen en speciale tekens.",
    checkButton: "Controleer sterkte",
    listenMusic: "Luister naar de muziek:",
    github: "Mijn GitHub",
    legalNotice: "Juridische kennisgeving",
    privacyPolicy: "Privacybeleid",
    strengths: {
      veryStrong: "Zeer sterk",
      strong: "Sterk",
      medium: "Gemiddeld",
      weak: "Zwak",
      veryWeak: "Zeer zwak",
    },
    restartButton: "Opnieuw proberen",
    emptyPassword: "Voer alstublieft een wachtwoord in.",
    showPassword: "Wachtwoord weergeven",
    hidePassword: "Wachtwoord verbergen",
  },
  br: {
    title: "Kalkulator krederion ar geriadur",
    passwordLabel: "Geriadur:",
    passwordPlaceholder: "Entrer ho geriadur",
    passwordHelp:
      "Entrer ho geriadur evit gwiriat e grederion. Ur geriadur mat a gouzout a vez brini-gaoz, brini-izel, toudoù hag arzoù izili.",
    checkButton: "Gwiriat krederion",
    listenMusic: "Klevet al leizh :",
    github: "Ma GitHub",
    legalNotice: "Notenn reizh",
    privacyPolicy: "Politik prevezded",
    strengths: {
      veryStrong: "Krederion mat-tre",
      strong: "Krederion mat",
      medium: "Krederion a-raok",
      weak: "Krederion gwan",
      veryWeak: "Krederion gwan-tre",
    },
    restartButton: "Klask adarre",
    emptyPassword: "Entrer ho geriadur, mar plij.",
    showPassword: "Diskouez ar geriadur",
    hidePassword: "Kuzh ar geriadur",
  },
};

const languageSelect = document.getElementById("languageSelect");

function setLanguage(lang) {
  currentLanguage = lang;
  // Texte classiques
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key];
  });

  // Placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = translations[lang][key];
  });

  // Aide (SR only text)
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (el.id === "passwordHelp") {
      const key = el.getAttribute("data-i18n");
      el.textContent = translations[lang][key];
    }
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
