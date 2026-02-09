document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("passwordInput");
  const checkButton = document.getElementById("checkButton");
  const results = document.getElementById("results");
  const toggle = document.getElementById("togglePassword");

  function checkStrength(password) {
    let score = 0;

    // Longueur - critère principal
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 1;

    // Diversité des caractères
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Points supplémentaires pour caractères spéciaux multiples
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 12) {
      score += 1;
    }

    // Pénalité pour patterns faibles
    if (/^[0-9]{4,}$/.test(password)) score -= 2;
    if (/(.)\\1{2,}/.test(password)) score -= 1;
    if (/password|123|abc|admin|qwerty/i.test(password)) score -= 2;

    // S'assurer que le score est entre 0 et 10
    score = Math.max(0, Math.min(10, score));

    // Convertir le score numérique en force
    if (score <= 2) {
      return "veryWeak";
    } else if (score <= 4) {
      return "weak";
    } else if (score <= 6) {
      return "medium";
    } else if (score <= 8) {
      return "strong";
    } else {
      return "veryStrong";
    }
  }

  function getPasswordFeedback(password) {
    const feedback =
      translations[currentLanguage]?.feedback || translations.fr.feedback;
    const issues = [];
    if (password.length < 8) {
      issues.push(feedback.minLength);
    } else if (password.length < 12) {
      issues.push(feedback.preferLonger);
    }
    if (!/[A-Z]/.test(password)) {
      issues.push(feedback.uppercase);
    }
    if (!/[a-z]/.test(password)) {
      issues.push(feedback.lowercase);
    }
    if (!/[0-9]/.test(password)) {
      issues.push(feedback.numbers);
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      issues.push(feedback.special);
    }
    if (/^[0-9]{4,}$/.test(password)) {
      issues.push(feedback.noSequential);
    }
    if (/(.)\1{2,}/.test(password)) {
      issues.push(feedback.noRepeat);
    }
    if (/password|123|abc|admin/i.test(password)) {
      issues.push(feedback.noCommon);
    }
    return issues;
  }

  function generatePassword() {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    const allChars = uppercase + lowercase + numbers + special;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
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
    const feedback = getPasswordFeedback(password);
    const strengthLabel =
      currentLanguage === "fr"
        ? "Solidité"
        : translations[currentLanguage]?.strengthLabel || "Strength";
    const improvementsLabel =
      translations[currentLanguage]?.feedback?.improvementsNeeded ||
      "Improvements needed:";

    let resultHTML = `<div style="font-weight: 600; margin-bottom: 12px; color: ${strengthColors[strengthKey]};">${strengthLabel} : ${strengthText}</div>`;

    if (feedback.length > 0) {
      resultHTML += `<div style="font-size: 0.9rem; margin-top: 8px; padding: 12px; background: rgba(0,0,0,0.05); border-radius: 8px;">`;
      resultHTML += `<strong style="display: block; margin-bottom: 8px; color: #333;">${improvementsLabel}</strong>`;
      feedback.forEach((issue) => {
        resultHTML += `<div style="margin: 4px 0; color: #555;">• ${issue}</div>`;
      });
      resultHTML += `</div>`;
    }

    results.innerHTML = resultHTML;
    results.style.color = strengthColors[strengthKey] || "black";
    results.setAttribute("role", "status");
    results.setAttribute("aria-live", "polite");
    results.setAttribute("aria-atomic", "true");
    results.setAttribute(
      "aria-label",
      `Solidité du mot de passe: ${strengthText}. ${feedback.length > 0 ? feedback.join(". ") : ""}`,
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

  // Empêcher les espaces dans le champ mot de passe
  if (passwordInput) {
    passwordInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\s/g, "");
    });
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

  // Gestion du bouton Générer un mot de passe
  const generateButton = document.getElementById("generateButton");
  if (generateButton && passwordInput) {
    generateButton.addEventListener("click", () => {
      const newPassword = generatePassword();
      passwordInput.value = newPassword;
      passwordInput.type = "text";
      updateToggle();
      if (toggle) {
        toggle.style.pointerEvents = "";
        toggle.removeAttribute("aria-disabled");
      }
      passwordInput.disabled = false;
      checkButton.dataset.mode = "check";
      const originalCheckText = checkButton.textContent || "Vérifier";
      checkButton.textContent = originalCheckText;
      if (results) {
        results.textContent = "";
        results.style.color = "";
        results.removeAttribute("aria-label");
        results.removeAttribute("role");
      }
      passwordInput.focus();
      createClickParticles(event);
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
    generateButton: "Générer un mot de passe",
    listenMusic: "Écoutez la musique :",
    github: "Mon GitHub",
    legalNotice: "Mentions légales",
    privacyPolicy: "Politique de confidentialité",
    strengthLabel: "Solidité",
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
    feedback: {
      minLength: "Le mot de passe doit contenir au moins 8 caractères",
      preferLonger: "Préférez au moins 12 caractères pour plus de sécurité",
      uppercase: "Manque : Majuscules",
      lowercase: "Manque : Minuscules",
      numbers: "Manque : Chiffres",
      special: "Manque : Caractères spéciaux",
      noSequential: "Évitez les chiffres séquentiels",
      noRepeat: "Évitez les caractères répétés",
      noCommon: "Évitez les mots courants (password, admin, etc.)",
      improvementsNeeded: "À améliorer :",
    },
    securityTitle: "Conseils de sécurité",
    securityDescription:
      "Un bon mot de passe doit contenir : des majuscules, des minuscules, des chiffres et des caractères spéciaux.",
    learnMore: "En savoir plus",

    legalTitle: "Mentions légales",
    legalContent:
      "Éditeur : Ce site est réalisé par MisterFreeze25 dans le cadre d'un projet de Terminale.",
    legalHosting: "Hébergement : Ce site est hébergé par GitHub.",
    legalProperty:
      "Propriété : Le contenu de ce site est destiné à un usage pédagogique.",

    privacyTitle: "Politique de confidentialité",
    privacyContent:
      "Conformément au RGPD, voici les informations concernant vos données :",
    privacyCollection:
      "Collecte : Seules les données saisies volontairement dans le formulaire sont traitées.",
    privacyUsage:
      "Utilisation : Ces données servent uniquement à la démonstration technique du projet.",
    privacyStorage:
      "Conservation : Aucune donnée n'est stockée à long terme ni revendue.",

    backToHome: "Retour à l'accueil",
  },
  en: {
    title: "Password Strength Calculator",
    passwordLabel: "Password:",
    passwordPlaceholder: "Enter your password",
    passwordHelp:
      "Enter a password to check its strength. A good password contains uppercase letters, lowercase letters, numbers and special characters.",
    checkButton: "Check strength",
    generateButton: "Generate password",
    listenMusic: "Listen to the music:",
    github: "My GitHub",
    legalNotice: "Legal Notice",
    privacyPolicy: "Privacy Policy",
    strengthLabel: "Strength",
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
    feedback: {
      minLength: "Password must contain at least 8 characters",
      preferLonger: "Prefer at least 12 characters for better security",
      uppercase: "Missing: Uppercase letters",
      lowercase: "Missing: Lowercase letters",
      numbers: "Missing: Numbers",
      special: "Missing: Special characters",
      noSequential: "Avoid sequential numbers",
      noRepeat: "Avoid repeated characters",
      noCommon: "Avoid common words (password, admin, etc.)",
      improvementsNeeded: "Improvements needed:",
    },
    securityTitle: "Security Tips",
    securityDescription:
      "A good password should contain: uppercase letters, lowercase letters, numbers and special characters.",
    learnMore: "Learn more",

    legalTitle: "Legal Notice",
    legalContent:
      "Publisher: This site is created by MisterFreeze25 as part of a Terminale project.",
    legalHosting: "Hosting: This site is hosted by GitHub.",
    legalProperty:
      "Property: The content of this site is intended for educational use.",

    privacyTitle: "Privacy Policy",
    privacyContent:
      "In accordance with GDPR, here is the information regarding your data:",
    privacyCollection:
      "Collection: Only data voluntarily entered in the form is processed.",
    privacyUsage:
      "Usage: This data is only used for the technical demonstration of the project.",
    privacyStorage: "Storage: No data is stored long-term or sold.",

    backToHome: "Back to home",
  },
  de: {
    title: "Passwortstärke-Rechner",
    passwordLabel: "Passwort:",
    passwordPlaceholder: "Geben Sie Ihr Passwort ein",
    passwordHelp:
      "Geben Sie ein Passwort ein, um dessen Stärke zu überprüfen. Ein gutes Passwort enthält Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen.",
    checkButton: "Stärke prüfen",
    generateButton: "Passwort generieren",
    listenMusic: "Musik anhören:",
    github: "Mein GitHub",
    legalNotice: "Rechtlicher Hinweis",
    privacyPolicy: "Datenschutz-Bestimmungen",
    strengthLabel: "Stärke",
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
    feedback: {
      minLength: "Das Passwort muss mindestens 8 Zeichen enthalten",
      preferLonger:
        "Bevorzugen Sie mindestens 12 Zeichen für bessere Sicherheit",
      uppercase: "Fehlend: Großbuchstaben",
      lowercase: "Fehlend: Kleinbuchstaben",
      numbers: "Fehlend: Zahlen",
      special: "Fehlend: Sonderzeichen",
      noSequential: "Vermeiden Sie fortlaufende Zahlen",
      noRepeat: "Vermeiden Sie wiederholte Zeichen",
      noCommon: "Vermeiden Sie häufige Wörter (password, admin, usw.)",
      improvementsNeeded: "Verbesserungen erforderlich:",
    },
    securityTitle: "Sicherheitstipps",
    securityDescription:
      "Ein gutes Passwort sollte enthalten: Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen.",
    learnMore: "Mehr erfahren",

    legalTitle: "Rechtlicher Hinweis",
    legalContent:
      "Herausgeber: Diese Seite wurde von MisterFreeze25 im Rahmen eines Terminale-Projekts erstellt.",
    legalHosting: "Hosting: Diese Seite wird von GitHub gehostet.",
    legalProperty:
      "Eigentum: Der Inhalt dieser Seite ist für Bildungszwecke bestimmt.",

    privacyTitle: "Datenschutz-Bestimmungen",
    privacyContent:
      "In Übereinstimmung mit der DSGVO, hier sind die Informationen zu Ihren Daten:",
    privacyCollection:
      "Sammlung: Es werden nur Daten verarbeitet, die freiwillig in das Formular eingegeben wurden.",
    privacyUsage:
      "Verwendung: Diese Daten dienen nur der technischen Demonstration des Projekts.",
    privacyStorage:
      "Speicherung: Es werden keine Daten langfristig gespeichert oder verkauft.",

    backToHome: "Zurück zur Startseite",
  },
  sp: {
    title: "Calculador de fuerza de contraseña",
    passwordLabel: "Contraseña:",
    passwordPlaceholder: "Ingrese su contraseña",
    passwordHelp:
      "Ingrese una contraseña para verificar su fuerza. Una buena contraseña contiene letras mayúsculas, minúsculas, números y caracteres especiales.",
    checkButton: "Verificar fuerza",
    generateButton: "Generar contraseña",
    listenMusic: "Escuchar música:",
    github: "Mi GitHub",
    legalNotice: "Aviso legal",
    privacyPolicy: "Política de privacidad",
    strengthLabel: "Fuerza",
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
    feedback: {
      minLength: "La contraseña debe contener al menos 8 caracteres",
      preferLonger: "Prefiera al menos 12 caracteres para mayor seguridad",
      uppercase: "Falta: Letías mayúsculas",
      lowercase: "Falta: Letías minúsculas",
      numbers: "Falta: Números",
      special: "Falta: Caracteres especiales",
      noSequential: "Evite números secuenciales",
      noRepeat: "Evite caracteres repetidos",
      noCommon: "Evite palabras comunes (password, admin, etc.)",
      improvementsNeeded: "Mejoras necesarias:",
    },
    securityTitle: "Consejos de seguridad",
    securityDescription:
      "Una buena contraseña debe contener: letras mayúsculas, letras minúsculas, números y caracteres especiales.",
    learnMore: "Más información",

    legalTitle: "Aviso legal",
    legalContent:
      "Editor: Este sitio fue creado por MisterFreeze25 como parte de un proyecto de Terminale.",
    legalHosting: "Alojamiento: Este sitio está alojado por GitHub.",
    legalProperty:
      "Propiedad: El contenido de este sitio está destinado para uso educativo.",

    privacyTitle: "Política de privacidad",
    privacyContent:
      "De acuerdo con el RGPD, aquí está la información sobre sus datos:",
    privacyCollection:
      "Recopilación: Solo se procesan los datos ingresados voluntariamente en el formulario.",
    privacyUsage:
      "Uso: Estos datos solo se utilizan para la demostración técnica del proyecto.",
    privacyStorage:
      "Almacenamiento: No se almacenan datos a largo plazo ni se venden.",

    backToHome: "Volver al inicio",
  },
  it: {
    title: "Calcolatore della forza della password",
    passwordLabel: "Password:",
    passwordPlaceholder: "Inserisci la tua password",
    passwordHelp:
      "Inserisci una password per verificarne la forza. Una buona password contiene lettere maiuscole, minuscole, numeri e caratteri speciali.",
    checkButton: "Verifica forza",
    generateButton: "Genera password",
    listenMusic: "Ascolta la musica:",
    github: "Il mio GitHub",
    legalNotice: "Avviso legale",
    privacyPolicy: "Politica sulla privacy",
    strengthLabel: "Forza",
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
    feedback: {
      minLength: "La password deve contenere almeno 8 caratteri",
      preferLonger: "Preferisci almeno 12 caratteri per maggiore sicurezza",
      uppercase: "Mancano: Lettere maiuscole",
      lowercase: "Mancano: Lettere minuscole",
      numbers: "Mancano: Numeri",
      special: "Mancano: Caratteri speciali",
      noSequential: "Evita numeri sequenziali",
      noRepeat: "Evita caratteri ripetuti",
      noCommon: "Evita parole comuni (password, admin, ecc.)",
      improvementsNeeded: "Miglioramenti necessari:",
    },
    securityTitle: "Consigli di sicurezza",
    securityDescription:
      "Una buona password deve contenere: lettere maiuscole, lettere minuscole, numeri e caratteri speciali.",
    learnMore: "Ulteriori informazioni",

    legalTitle: "Avviso legale",
    legalContent:
      "Editore: Questo sito è stato creato da MisterFreeze25 come parte di un progetto di Terminale.",
    legalHosting: "Hosting: Questo sito è ospitato da GitHub.",
    legalProperty:
      "Proprietà: Il contenuto di questo sito è destinato a scopi educativi.",

    privacyTitle: "Politica sulla privacy",
    privacyContent:
      "In conformità con il GDPR, ecco le informazioni riguardanti i tuoi dati:",
    privacyCollection:
      "Raccolta: Vengono elaborati solo i dati inseriti volontariamente nel modulo.",
    privacyUsage:
      "Uso: Questi dati sono utilizzati solo per la dimostrazione tecnica del progetto.",
    privacyStorage:
      "Archiviazione: Nessun dato viene archiviato a lungo termine o venduto.",

    backToHome: "Torna alla home",
  },
  pt: {
    title: "Calculadora de força de senha",
    passwordLabel: "Senha:",
    passwordPlaceholder: "Digite sua senha",
    passwordHelp:
      "Digite uma senha para verificar sua força. Uma boa senha contém letras maiúsculas, minúsculas, números e caracteres especiais.",
    checkButton: "Verificar força",
    generateButton: "Gerar senha",
    listenMusic: "Ouça a música:",
    github: "Meu GitHub",
    legalNotice: "Aviso legal",
    privacyPolicy: "Política de privacidade",
    strengthLabel: "Força",
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
    feedback: {
      minLength: "A senha deve conter pelo menos 8 caracteres",
      preferLonger: "Prefira pelo menos 12 caracteres para maior segurança",
      uppercase: "Faltando: Letras maiúsculas",
      lowercase: "Faltando: Letras minúsculas",
      numbers: "Faltando: Números",
      special: "Faltando: Caracteres especiais",
      noSequential: "Evite números sequenciais",
      noRepeat: "Evite caracteres repetidos",
      noCommon: "Evite palavras comuns (password, admin, etc.)",
      improvementsNeeded: "Melhorias necessárias:",
    },
    securityTitle: "Dicas de segurança",
    securityDescription:
      "Uma boa senha deve conter: letras maiúsculas, letras minúsculas, números e caracteres especiais.",
    learnMore: "Saiba mais",

    legalTitle: "Aviso legal",
    legalContent:
      "Editor: Este site foi criado por MisterFreeze25 como parte de um projeto de Terminale.",
    legalHosting: "Hospedagem: Este site é hospedado pelo GitHub.",
    legalProperty:
      "Propriedade: O conteúdo deste site é destinado para uso educacional.",

    privacyTitle: "Política de privacidade",
    privacyContent:
      "Conforme o RGPD, aqui estão as informações sobre seus dados:",
    privacyCollection:
      "Coleta: Apenas os dados inseridos voluntariamente no formulário são processados.",
    privacyUsage:
      "Uso: Esses dados são usados apenas para a demonstração técnica do projeto.",
    privacyStorage:
      "Armazenamento: Nenhum dado é armazenado a longo prazo ou vendido.",

    backToHome: "Voltar para o início",
  },
  nl: {
    title: "Wachtwoordsterkte Calculator",
    passwordLabel: "Wachtwoord:",
    passwordPlaceholder: "Voer uw wachtwoord in",
    passwordHelp:
      "Voer een wachtwoord in om de sterkte te controleren. Een goed wachtwoord bevat hoofdletters, kleine letters, getallen en speciale tekens.",
    checkButton: "Controleer sterkte",
    generateButton: "Genereer wachtwoord",
    listenMusic: "Luister naar de muziek:",
    github: "Mijn GitHub",
    legalNotice: "Juridische kennisgeving",
    privacyPolicy: "Privacybeleid",
    strengthLabel: "Sterkte",
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
    feedback: {
      minLength: "Wachtwoord moet minimaal 8 tekens bevatten",
      preferLonger: "Verkies minstens 12 tekens voor betere veiligheid",
      uppercase: "Ontbrekend: Hoofdletters",
      lowercase: "Ontbrekend: Kleine letters",
      numbers: "Ontbrekend: Nummers",
      special: "Ontbrekend: Speciale tekens",
      noSequential: "Vermijd opeenvolgende nummers",
      noRepeat: "Vermijd herhaalde tekens",
      noCommon: "Vermijd veelgebruikte woorden (password, admin, enz.)",
      improvementsNeeded: "Verbeteringen nodig:",
    },
    securityTitle: "Veiligheidstips",
    securityDescription:
      "Een goed wachtwoord moet bevatten: hoofdletters, kleine letters, nummers en speciale tekens.",
    learnMore: "Meer informatie",

    legalTitle: "Juridische kennisgeving",
    legalContent:
      "Uitgever: Deze site is gemaakt door MisterFreeze25 als onderdeel van een Terminale-project.",
    legalHosting: "Hosting: Deze site wordt gehost door GitHub.",
    legalProperty:
      "Eigendom: De inhoud van deze site is bedoeld voor educatief gebruik.",

    privacyTitle: "Privacybeleid",
    privacyContent:
      "In overeenstemming met de AVG, hier is de informatie over uw gegevens:",
    privacyCollection:
      "Verzameling: Alleen gegevens die vrijwillig in het formulier zijn ingevoerd, worden verwerkt.",
    privacyUsage:
      "Gebruik: Deze gegevens worden alleen gebruikt voor de technische demonstratie van het project.",
    privacyStorage:
      "Opslag: Er worden geen gegevens op lange termijn opgeslagen of verkocht.",

    backToHome: "Terug naar home",
  },
  br: {
    title: "Kalkulator krederion ar geriadur",
    passwordLabel: "Geriadur:",
    passwordPlaceholder: "Entrer ho geriadur",
    passwordHelp:
      "Entrer ho geriadur evit gwiriat e grederion. Ur geriadur mat a gouzout a vez brini-gaoz, brini-izel, toudoù hag arzoù izili.",
    checkButton: "Gwiriat krederion",
    generateButton: "Gañell ur geriadur",
    listenMusic: "Klevet al leizh :",
    github: "Ma GitHub",
    legalNotice: "Notenn reizh",
    privacyPolicy: "Politik prevezded",
    strengthLabel: "Krederion",
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
    feedback: {
      minLength: "Ar geriadur a rank kaout a-berzh 8 arouezennoù",
      preferLonger: "Penndibabit a-berzh 12 a-seurt evit gwell-ruzh",
      uppercase: "Diankatiet : Lizherennoù bras",
      lowercase: "Diankatiet : Lizherennoù bihan",
      numbers: "Diankatiet : Niverou",
      special: "Diankatiet : Arzoù special",
      noSequential: "Strivout lizherennoù a-reiñv",
      noRepeat: "Strivout arouezennù gwallakaoued",
      noCommon: "Strivout gerzoù a veheñg (password, admin, arl.)",
      improvementsNeeded: "Gwellañ a zo ezhomm:",
    },
    securityTitle: "Alvelennoù ruzh",
    securityDescription:
      "Ur geriadur mat a rankfe kaout : lizherennoù bras, lizherennoù bihan, niverou ha arzoù special.",
    learnMore: "Gouzout an nemet",

    legalTitle: "Notenn reizh",
    legalContent:
      "Embanner : Ar sait se a zo graet gant MisterFreeze25 e-keñver ur raktres Terminale.",
    legalHosting: "Hébergement : Ar sait se a zo hébergé gant GitHub.",
    legalProperty:
      "Propriété : An danvez eus ar sait se a zo dalc'het evit ur implij pedagogel.",

    privacyTitle: "Politik prevezded",
    privacyContent:
      "In overeenstemming met de AVG, hier is de informatie over uw gegevens:",
    privacyCollection:
      "Collecte : Nevez traitet nemet an titouroù lakaet gant ar user er form.",
    privacyUsage:
      "Usage : An titouroù-mañ a vez implijet hepken evit ar skouer teknik eus ar raktres.",
    privacyStorage:
      "Stokadur : Ne vez ket stoket an titouroù evit un hent a-raok.",

    backToHome: "Distrei da home",
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
