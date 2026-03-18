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
    checkButton.addEventListener("click", (event) => {
      createClickParticles(event);
      const mode = checkButton.dataset.mode || "check";

      if (mode === "check") {
        const password = passwordInput.value.trim();
        if (!password) {
          const emptyText =
            translations[currentLanguage]?.emptyPassword ||
            "Veuillez entrer un mot de passe.";
          results.textContent = emptyText;
          results.style.color = "#b00020";
          results.setAttribute("role", "alert");
          passwordInput.setAttribute("aria-invalid", "true");
          passwordInput.focus();
          return;
        }
        passwordInput.setAttribute("aria-invalid", "false");
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
    generateButton.addEventListener("click", (event) => {
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
      passwordInput.setAttribute("aria-invalid", "false");
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
    aboutCredits: "À propos & crédits",
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

    passwordTitle: "Comment choisir un bon mot de passe",
    passwordIntro:
      "Un mot de passe est la clé qui protège vos comptes en ligne (messagerie, réseaux sociaux, services bancaires, etc.). Il est essentiel qu'il soit solide, unique et difficile à deviner pour éviter toute compromission.",
    passwordGoodPracticesTitle: "Bonnes pratiques générales",
    passwordDifferent:
      "Utiliser un mot de passe différent pour chaque compte : ne réutilisez jamais le même mot de passe sur plusieurs services. Si un service est piraté, tous vos autres comptes pourraient l'être aussi.",
    passwordRobust:
      "Choisir un mot de passe robuste : il doit contenir au minimum 12 caractères et combiner des lettres majuscules, minuscules, des chiffres et des caractères spéciaux.",
    passwordAvoidPersonal:
      "Éviter les informations personnelles : dates de naissance, prénoms, noms d'animaux ou toute information facilement devinable.",
    passwordChange:
      "Changer le mot de passe en cas de doute : toute activité suspecte ou fuite de données doit entraîner un changement immédiat.",
    passwordKeepSecret:
      "Garder ses mots de passe secrets : aucune organisation sérieuse ne demande un mot de passe par e-mail ou par téléphone.",
    passwordSharedComputer:
      "Éviter les ordinateurs partagés : ne pas enregistrer ses mots de passe sur des appareils publics ou partagés.",
    passwordDefault:
      "Changer les mots de passe par défaut : les mots de passe fournis à l'installation sont souvent connus des cybercriminels.",
    passwordCreationTitle: "Créer un mot de passe sécurisé",
    passwordCreateSelf:
      "Créer soi-même son mot de passe en utilisant une phrase facile à retenir mais difficile à deviner.",
    passwordUseGenerator:
      "Utiliser un générateur de mots de passe pour créer automatiquement des mots de passe complexes et sécurisés.",
    passwordManagersTitle: "Gestionnaire de mots de passe",
    passwordManager:
      "Un gestionnaire de mots de passe permet de stocker et gérer l'ensemble de ses identifiants de manière sécurisée.",
    passwordAdvancedTitle: "Sécurité renforcée",
    password2FA:
      "Activer l'authentification à double facteur pour ajouter une couche de sécurité supplémentaire.",
    passwordTestStrength:
      "Vérifier régulièrement la solidité de ses mots de passe à l'aide d'outils adaptés.",

    aboutCreditsTitle: "À propos & crédits",
    aboutCreator:
      "Créateur : Ce site a été conçu et développé par MisterFreeze25 dans le cadre d'un projet scolaire de classe de Terminale. L'objectif était de créer un outil web pratique combinant plusieurs disciplines académiques.",
    aboutProject:
      "Projet : Il s'agit d'un calculateur de solidité de mots de passe qui permet à l'utilisateur d'entrer un mot de passe et d'obtenir une estimation de sa sécurité. L'analyse se base sur la longueur du mot de passe et la diversité des caractères utilisés (majuscules, minuscules, chiffres et symboles spéciaux). Plus le nombre de combinaisons possibles est élevé, plus le mot de passe est difficile à deviner.",
    aboutSubjects:
      "Disciplines : Ce projet mobilise plusieurs matières. Les mathématiques et les sciences sont utilisées à travers les probabilités et la combinatoire pour calculer le nombre de combinaisons possibles. La technologie est présente avec l'utilisation de HTML pour la structure, CSS pour le design et JavaScript pour les calculs et l'interactivité.",
    aboutPurpose:
      "Objectif : Le contenu de ce site est destiné exclusivement à un usage pédagogique et éducatif. Il vise à sensibiliser aux bonnes pratiques en matière de sécurité des mots de passe.",
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
    aboutCredits: "About & Credits",
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

    passwordTitle: "How to Choose a Good Password",
    passwordIntro:
      "A password is the key that protects your online accounts (email, social networks, banking services, etc.). It is essential that it be strong, unique and difficult to guess to avoid any compromise.",
    passwordGoodPracticesTitle: "General Best Practices",
    passwordDifferent:
      "Use a different password for each account: never reuse the same password across multiple services. If one service is hacked, all your other accounts could be compromised too.",
    passwordRobust:
      "Choose a strong password: it must contain at least 12 characters and combine uppercase letters, lowercase letters, numbers and special characters.",
    passwordAvoidPersonal:
      "Avoid personal information: birthdates, first names, pet names or any easily guessable information.",
    passwordChange:
      "Change your password in case of doubt: any suspicious activity or data breach should result in an immediate change.",
    passwordKeepSecret:
      "Keep your passwords secret: no legitimate organization asks for a password by email or phone.",
    passwordSharedComputer:
      "Avoid shared computers: do not save your passwords on public or shared devices.",
    passwordDefault:
      "Change default passwords: passwords provided at installation are often known to cybercriminals.",
    passwordCreationTitle: "Create a Secure Password",
    passwordCreateSelf:
      "Create your own password using a phrase that is easy to remember but difficult to guess.",
    passwordUseGenerator:
      "Use a password generator to automatically create complex and secure passwords.",
    passwordManagersTitle: "Password Manager",
    passwordManager:
      "A password manager allows you to store and manage all your credentials securely.",
    passwordAdvancedTitle: "Enhanced Security",
    password2FA:
      "Enable two-factor authentication to add an extra layer of security.",
    passwordTestStrength:
      "Regularly check the strength of your passwords using appropriate tools.",

    aboutCreditsTitle: "About & Credits",
    aboutCreator:
      "Creator: This website was designed and developed by MisterFreeze25 as part of a high school senior year project. The goal was to create a practical web tool combining several academic disciplines.",
    aboutProject:
      "Project: This is a password strength calculator that allows users to enter a password and get an estimate of its security. The analysis is based on the password length and the diversity of characters used (uppercase, lowercase, numbers and special symbols). The higher the number of possible combinations, the harder the password is to guess.",
    aboutSubjects:
      "Disciplines: This project combines several subjects. Mathematics and science are used through probabilities and combinatorics to calculate the number of possible combinations. Technology is present with the use of HTML for structure, CSS for design and JavaScript for calculations and interactivity.",
    aboutPurpose:
      "Purpose: The content of this site is intended exclusively for educational and pedagogical use. It aims to raise awareness of good practices in password security.",
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
    aboutCredits: "Über & Credits",
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

    passwordTitle: "Wie wählt man ein gutes Passwort",
    passwordIntro:
      "Ein Passwort ist der Schlüssel, der Ihre Online-Konten (E-Mail, soziale Netzwerke, Bankdienste usw.) schützt. Es ist wichtig, dass es stark, einzigartig und schwer zu erraten ist, um jede Kompromittierung zu vermeiden.",
    passwordGoodPracticesTitle: "Allgemeine bewährte Praktiken",
    passwordDifferent:
      "Verwenden Sie für jedes Konto ein anderes Passwort: Verwenden Sie niemals dasselbe Passwort für mehrere Dienste. Wenn ein Dienst gehackt wird, könnten alle Ihre anderen Konten ebenfalls kompromittiert werden.",
    passwordRobust:
      "Wählen Sie ein starkes Passwort: Es muss mindestens 12 Zeichen enthalten und Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen kombinieren.",
    passwordAvoidPersonal:
      "Vermeiden Sie persönliche Informationen: Geburtsdaten, Vornamen, Haustiernamen oder andere leicht zu erratende Informationen.",
    passwordChange:
      "Ändern Sie das Passwort im Zweifelsfall: Jede verdächtige Aktivität oder jeder Datenleck sollte zu einer sofortigen Änderung führen.",
    passwordKeepSecret:
      "Halten Sie Ihre Passwörter geheim: Keine seriöse Organisation fragt per E-Mail oder Telefon nach einem Passwort.",
    passwordSharedComputer:
      "Vermeiden Sie gemeinsam genutzte Computer: Speichern Sie Ihre Passwörter nicht auf öffentlichen oder gemeinsam genutzten Geräten.",
    passwordDefault:
      "Ändern Sie Standardpasswörter: Bei der Installation bereitgestellte Passwörter sind Cyberkriminellen oft bekannt.",
    passwordCreationTitle: "Ein sicheres Passwort erstellen",
    passwordCreateSelf:
      "Erstellen Sie Ihr eigenes Passwort mit einem Satz, der leicht zu merken, aber schwer zu erraten ist.",
    passwordUseGenerator:
      "Verwenden Sie einen Passwortgenerator, um automatisch komplexe und sichere Passwörter zu erstellen.",
    passwordManagersTitle: "Passwort-Manager",
    passwordManager:
      "Ein Passwort-Manager ermöglicht es Ihnen, alle Ihre Anmeldedaten sicher zu speichern und zu verwalten.",
    passwordAdvancedTitle: "Erweiterte Sicherheit",
    password2FA:
      "Aktivieren Sie die Zwei-Faktor-Authentifizierung, um eine zusätzliche Sicherheitsebene hinzuzufügen.",
    passwordTestStrength:
      "Überprüfen Sie regelmäßig die Stärke Ihrer Passwörter mit geeigneten Tools.",

    aboutCreditsTitle: "Über & Credits",
    aboutCreator:
      "Ersteller: Diese Website wurde von MisterFreeze25 im Rahmen eines Abschlussprojekts der Oberstufe entworfen und entwickelt. Das Ziel war es, ein praktisches Web-Tool zu erstellen, das mehrere akademische Disziplinen kombiniert.",
    aboutProject:
      "Projekt: Dies ist ein Passwort-Stärke-Rechner, der es Benutzern ermöglicht, ein Passwort einzugeben und eine Schätzung seiner Sicherheit zu erhalten. Die Analyse basiert auf der Passwortlänge und der Vielfalt der verwendeten Zeichen (Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen). Je höher die Anzahl möglicher Kombinationen, desto schwieriger ist das Passwort zu erraten.",
    aboutSubjects:
      "Disziplinen: Dieses Projekt vereint mehrere Fächer. Mathematik und Naturwissenschaften werden durch Wahrscheinlichkeitsrechnung und Kombinatorik verwendet, um die Anzahl möglicher Kombinationen zu berechnen. Technologie ist mit der Verwendung von HTML für die Struktur, CSS für das Design und JavaScript für Berechnungen und Interaktivität präsent.",
    aboutPurpose:
      "Zweck: Der Inhalt dieser Website ist ausschließlich für pädagogische und bildende Zwecke bestimmt. Er zielt darauf ab, das Bewusstsein für gute Praktiken in der Passwortsicherheit zu schärfen.",
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
    aboutCredits: "Acerca de & Créditos",
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

    passwordTitle: "Cómo elegir una buena contraseña",
    passwordIntro:
      "Una contraseña es la clave que protege sus cuentas en línea (correo electrónico, redes sociales, servicios bancarios, etc.). Es esencial que sea sólida, única y difícil de adivinar para evitar cualquier compromiso.",
    passwordGoodPracticesTitle: "Buenas prácticas generales",
    passwordDifferent:
      "Usar una contraseña diferente para cada cuenta: nunca reutilice la misma contraseña en varios servicios. Si un servicio es pirateado, todas sus otras cuentas también podrían estarlo.",
    passwordRobust:
      "Elegir una contraseña robusta: debe contener al menos 12 caracteres y combinar letras mayúsculas, minúsculas, números y caracteres especiales.",
    passwordAvoidPersonal:
      "Evitar información personal: fechas de nacimiento, nombres, nombres de mascotas o cualquier información fácilmente adivinable.",
    passwordChange:
      "Cambiar la contraseña en caso de duda: cualquier actividad sospechosa o filtración de datos debe resultar en un cambio inmediato.",
    passwordKeepSecret:
      "Mantener sus contraseñas en secreto: ninguna organización seria solicita una contraseña por correo electrónico o teléfono.",
    passwordSharedComputer:
      "Evitar computadoras compartidas: no guarde sus contraseñas en dispositivos públicos o compartidos.",
    passwordDefault:
      "Cambiar las contraseñas predeterminadas: las contraseñas proporcionadas en la instalación suelen ser conocidas por los cibercriminales.",
    passwordCreationTitle: "Crear una contraseña segura",
    passwordCreateSelf:
      "Cree su propia contraseña usando una frase fácil de recordar pero difícil de adivinar.",
    passwordUseGenerator:
      "Use un generador de contraseñas para crear automáticamente contraseñas complejas y seguras.",
    passwordManagersTitle: "Gestor de contraseñas",
    passwordManager:
      "Un gestor de contraseñas permite almacenar y gestionar todos sus credenciales de forma segura.",
    passwordAdvancedTitle: "Seguridad reforzada",
    password2FA:
      "Active la autenticación de dos factores para agregar una capa adicional de seguridad.",
    passwordTestStrength:
      "Verifique regularmente la solidez de sus contraseñas con herramientas adecuadas.",

    aboutCreditsTitle: "Acerca de & Créditos",
    aboutCreator:
      "Creador: Este sitio web fue diseñado y desarrollado por MisterFreeze25 como parte de un proyecto escolar de último año de bachillerato. El objetivo era crear una herramienta web práctica que combinara varias disciplinas académicas.",
    aboutProject:
      "Proyecto: Se trata de una calculadora de solidez de contraseñas que permite al usuario introducir una contraseña y obtener una estimación de su seguridad. El análisis se basa en la longitud de la contraseña y la diversidad de caracteres utilizados (mayúsculas, minúsculas, números y símbolos especiales). Cuanto mayor sea el número de combinaciones posibles, más difícil será adivinar la contraseña.",
    aboutSubjects:
      "Disciplinas: Este proyecto moviliza varias materias. Las matemáticas y las ciencias se utilizan a través de probabilidades y combinatoria para calcular el número de combinaciones posibles. La tecnología está presente con el uso de HTML para la estructura, CSS para el diseño y JavaScript para los cálculos y la interactividad.",
    aboutPurpose:
      "Objetivo: El contenido de este sitio está destinado exclusivamente a un uso pedagógico y educativo. Su objetivo es sensibilizar sobre las buenas prácticas en materia de seguridad de contraseñas.",
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
    aboutCredits: "Informazioni & Crediti",
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

    passwordTitle: "Come scegliere una buona password",
    passwordIntro:
      "Una password è la chiave che protegge i tuoi account online (posta elettronica, social network, servizi bancari, ecc.). È essenziale che sia solida, unica e difficile da indovinare per evitare qualsiasi compromissione.",
    passwordGoodPracticesTitle: "Buone pratiche generali",
    passwordDifferent:
      "Utilizzare una password diversa per ogni account: non riutilizzare mai la stessa password su più servizi. Se un servizio viene violato, anche tutti gli altri tuoi account potrebbero esserlo.",
    passwordRobust:
      "Scegliere una password robusta: deve contenere almeno 12 caratteri e combinare lettere maiuscole, minuscole, numeri e caratteri speciali.",
    passwordAvoidPersonal:
      "Evitare informazioni personali: date di nascita, nomi, nomi di animali domestici o qualsiasi informazione facilmente indovinabile.",
    passwordChange:
      "Cambiare la password in caso di dubbio: qualsiasi attività sospetta o fuga di dati deve comportare un cambio immediato.",
    passwordKeepSecret:
      "Mantenere segrete le proprie password: nessuna organizzazione seria richiede una password via e-mail o telefono.",
    passwordSharedComputer:
      "Evitare computer condivisi: non salvare le password su dispositivi pubblici o condivisi.",
    passwordDefault:
      "Cambiare le password predefinite: le password fornite all'installazione sono spesso note ai criminali informatici.",
    passwordCreationTitle: "Creare una password sicura",
    passwordCreateSelf:
      "Crea la tua password utilizzando una frase facile da ricordare ma difficile da indovinare.",
    passwordUseGenerator:
      "Utilizzare un generatore di password per creare automaticamente password complesse e sicure.",
    passwordManagersTitle: "Gestore di password",
    passwordManager:
      "Un gestore di password permette di memorizzare e gestire tutte le proprie credenziali in modo sicuro.",
    passwordAdvancedTitle: "Sicurezza rafforzata",
    password2FA:
      "Attivare l'autenticazione a due fattori per aggiungere un ulteriore livello di sicurezza.",
    passwordTestStrength:
      "Verificare regolarmente la solidità delle proprie password con strumenti appropriati.",

    aboutCreditsTitle: "Informazioni & Crediti",
    aboutCreator:
      "Creatore: Questo sito è stato progettato e sviluppato da MisterFreeze25 nell'ambito di un progetto scolastico dell'ultimo anno di liceo. L'obiettivo era creare uno strumento web pratico che combinasse diverse discipline accademiche.",
    aboutProject:
      "Progetto: Si tratta di un calcolatore di robustezza delle password che permette all'utente di inserire una password e ottenere una stima della sua sicurezza. L'analisi si basa sulla lunghezza della password e sulla diversità dei caratteri utilizzati (maiuscole, minuscole, numeri e simboli speciali). Maggiore è il numero di combinazioni possibili, più difficile è indovinare la password.",
    aboutSubjects:
      "Discipline: Questo progetto coinvolge diverse materie. La matematica e le scienze sono utilizzate attraverso probabilità e combinatoria per calcolare il numero di combinazioni possibili. La tecnologia è presente con l'uso di HTML per la struttura, CSS per il design e JavaScript per i calcoli e l'interattività.",
    aboutPurpose:
      "Obiettivo: Il contenuto di questo sito è destinato esclusivamente ad un uso pedagogico ed educativo. Mira a sensibilizzare sulle buone pratiche in materia di sicurezza delle password.",
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
    aboutCredits: "Sobre & Créditos",
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

    passwordTitle: "Como escolher uma boa senha",
    passwordIntro:
      "Uma senha é a chave que protege suas contas online (e-mail, redes sociais, serviços bancários, etc.). É essencial que seja forte, única e difícil de adivinhar para evitar qualquer comprometimento.",
    passwordGoodPracticesTitle: "Boas práticas gerais",
    passwordDifferent:
      "Usar uma senha diferente para cada conta: nunca reutilize a mesma senha em vários serviços. Se um serviço for hackeado, todas as suas outras contas também poderão ser.",
    passwordRobust:
      "Escolher uma senha robusta: deve conter no mínimo 12 caracteres e combinar letras maiúsculas, minúsculas, números e caracteres especiais.",
    passwordAvoidPersonal:
      "Evitar informações pessoais: datas de nascimento, nomes, nomes de animais de estimação ou qualquer informação facilmente adivinhável.",
    passwordChange:
      "Mudar a senha em caso de dúvida: qualquer atividade suspeita ou vazamento de dados deve resultar em uma mudança imediata.",
    passwordKeepSecret:
      "Manter suas senhas em segredo: nenhuma organização séria solicita uma senha por e-mail ou telefone.",
    passwordSharedComputer:
      "Evitar computadores compartilhados: não salve suas senhas em dispositivos públicos ou compartilhados.",
    passwordDefault:
      "Mudar as senhas padrão: as senhas fornecidas na instalação são frequentemente conhecidas pelos cibercriminosos.",
    passwordCreationTitle: "Criar uma senha segura",
    passwordCreateSelf:
      "Crie sua própria senha usando uma frase fácil de lembrar, mas difícil de adivinhar.",
    passwordUseGenerator:
      "Use um gerador de senhas para criar automaticamente senhas complexas e seguras.",
    passwordManagersTitle: "Gerenciador de senhas",
    passwordManager:
      "Um gerenciador de senhas permite armazenar e gerenciar todas as suas credenciais de forma segura.",
    passwordAdvancedTitle: "Segurança reforçada",
    password2FA:
      "Ative a autenticação de dois fatores para adicionar uma camada extra de segurança.",
    passwordTestStrength:
      "Verifique regularmente a força de suas senhas com ferramentas apropriadas.",

    aboutCreditsTitle: "Sobre & Créditos",
    aboutCreator:
      "Criador: Este site foi projetado e desenvolvido por MisterFreeze25 como parte de um projeto escolar do último ano do ensino médio. O objetivo era criar uma ferramenta web prática que combinasse várias disciplinas acadêmicas.",
    aboutProject:
      "Projeto: Este é um calculador de força de senhas que permite ao usuário inserir uma senha e obter uma estimativa de sua segurança. A análise é baseada no comprimento da senha e na diversidade de caracteres usados (maiúsculas, minúsculas, números e símbolos especiais). Quanto maior o número de combinações possíveis, mais difícil é adivinhar a senha.",
    aboutSubjects:
      "Disciplinas: Este projeto mobiliza várias matérias. A matemática e as ciências são usadas através de probabilidades e combinatória para calcular o número de combinações possíveis. A tecnologia está presente com o uso de HTML para a estrutura, CSS para o design e JavaScript para os cálculos e a interatividade.",
    aboutPurpose:
      "Objetivo: O conteúdo deste site é destinado exclusivamente para uso pedagógico e educacional. Visa conscientizar sobre as boas práticas em segurança de senhas.",
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
    aboutCredits: "Over & Credits",
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

    passwordTitle: "Hoe kies je een goed wachtwoord",
    passwordIntro:
      "Een wachtwoord is de sleutel die je online accounts beschermt (e-mail, sociale netwerken, bankdiensten, enz.). Het is essentieel dat het sterk, uniek en moeilijk te raden is om compromittering te voorkomen.",
    passwordGoodPracticesTitle: "Algemene beste praktijken",
    passwordDifferent:
      "Gebruik een ander wachtwoord voor elk account: hergebruik nooit hetzelfde wachtwoord voor meerdere diensten. Als één dienst gehackt wordt, kunnen al je andere accounts ook gecompromitteerd worden.",
    passwordRobust:
      "Kies een robuust wachtwoord: het moet minimaal 12 tekens bevatten en hoofdletters, kleine letters, cijfers en speciale tekens combineren.",
    passwordAvoidPersonal:
      "Vermijd persoonlijke informatie: geboortedata, voornamen, namen van huisdieren of andere gemakkelijk te raden informatie.",
    passwordChange:
      "Verander je wachtwoord bij twijfel: elke verdachte activiteit of datalek moet leiden tot een onmiddellijke wijziging.",
    passwordKeepSecret:
      "Houd je wachtwoorden geheim: geen serieuze organisatie vraagt om een wachtwoord per e-mail of telefoon.",
    passwordSharedComputer:
      "Vermijd gedeelde computers: bewaar je wachtwoorden niet op openbare of gedeelde apparaten.",
    passwordDefault:
      "Verander standaardwachtwoorden: wachtwoorden die bij installatie worden verstrekt, zijn vaak bekend bij cybercriminelen.",
    passwordCreationTitle: "Maak een veilig wachtwoord",
    passwordCreateSelf:
      "Maak je eigen wachtwoord met een zin die gemakkelijk te onthouden maar moeilijk te raden is.",
    passwordUseGenerator:
      "Gebruik een wachtwoordgenerator om automatisch complexe en veilige wachtwoorden te maken.",
    passwordManagersTitle: "Wachtwoordbeheerder",
    passwordManager:
      "Een wachtwoordbeheerder stelt je in staat om al je inloggegevens veilig op te slaan en te beheren.",
    passwordAdvancedTitle: "Versterkte beveiliging",
    password2FA:
      "Activeer twee-factor-authenticatie om een extra beveiligingslaag toe te voegen.",
    passwordTestStrength:
      "Controleer regelmatig de sterkte van je wachtwoorden met geschikte tools.",

    aboutCreditsTitle: "Over & Credits",
    aboutCreator:
      "Maker: Deze website werd ontworpen en ontwikkeld door MisterFreeze25 als onderdeel van een eindexamenproject. Het doel was om een praktische webtool te maken die verschillende academische disciplines combineert.",
    aboutProject:
      "Project: Dit is een wachtwoordsterkteberekening die gebruikers in staat stelt een wachtwoord in te voeren en een schatting van de beveiliging te krijgen. De analyse is gebaseerd op de wachtwoordlengte en de diversiteit van gebruikte tekens (hoofdletters, kleine letters, cijfers en speciale symbolen). Hoe hoger het aantal mogelijke combinaties, hoe moeilijker het wachtwoord te raden is.",
    aboutSubjects:
      "Disciplines: Dit project combineert verschillende vakken. Wiskunde en wetenschap worden gebruikt via kansberekening en combinatoriek om het aantal mogelijke combinaties te berekenen. Technologie is aanwezig met het gebruik van HTML voor de structuur, CSS voor het ontwerp en JavaScript voor berekeningen en interactiviteit.",
    aboutPurpose:
      "Doel: De inhoud van deze site is uitsluitend bedoeld voor educatief en pedagogisch gebruik. Het is bedoeld om bewustzijn te creëren over goede praktijken op het gebied van wachtwoordbeveiliging.",
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
    aboutCredits: "Diwar-benn & Kredioù",
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

    passwordTitle: "Penaos dibab ur ger-tremen mat",
    passwordIntro:
      "Ur ger-tremen eo an alc'hwez a c'harez ho kontoù enlinenn (postel, rouedadoù sokial, servijoù bank, hag all). Pouezus eo e vefe kreñv, nemetken hag diaes da zonjal evit mirout ouzh fazi ebet.",
    passwordGoodPracticesTitle: "Arferioù mat hollek",
    passwordDifferent:
      "Implijout ur ger-tremen disheñvel evit pep kont: na implijit morse ar ger-tremen heñvel evit meur a servij. Ma vez hacked ur servij, ho kontoù all a c'hellfe bezañ ivez.",
    passwordRobust:
      "Dibab ur ger-tremen kreñv: ret eo dezhañ enderc'hel 12 arouezenn d'an nebeutañ ha kemmeskañ lizherennoù bras, lizherennoù bihan, sifroù hag arouezennoù ispisial.",
    passwordAvoidPersonal:
      "Chom hep stlennoù personel: deiziadoù ganedigezh, anvioù-bihan, anvioù loenoù pe pep stlenn aes da zonjal.",
    passwordChange:
      "Cheñch ar ger-tremen ma'z eus mar: pep obererezh doutus pe divulgadur roadennoù a rank kas da ur cheñchamant diouzhtu.",
    passwordKeepSecret:
      "Mirout ho kerioù-tremen en-kuzh: n'eus aozadur ebet a c'houlenn ur ger-tremen dre bostel pe dre bellgomz.",
    passwordSharedComputer:
      "Chom hep urzhiataerioù rannet: na enrollit ket ho kerioù-tremen war benvegadoù foran pe rannet.",
    passwordDefault:
      "Cheñch ar gerioù-tremen dre ziouer: ar gerioù-tremen pourchaset gant ar staliadur a vez anavezet gant ar priñs-kennañ.",
    passwordCreationTitle: "Krouiñ ur ger-tremen suraet",
    passwordCreateSelf:
      "Krouit hoc'h ger-tremen oc'h-unan en ur implijout ur frazenn aes da zerc'hel soñj anezhi met diaes da zonjal.",
    passwordUseGenerator:
      "Implijout ur c'henluner gerioù-tremen evit krouiñ ent emgefre gerioù-tremes kemplesk ha suraet.",
    passwordManagersTitle: "Merour gerioù-tremes",
    passwordManager:
      "Ur merour gerioù-tremes a ro tu da enrollañ ha da verañ an holl anaouderioù en un doare suraet.",
    passwordAdvancedTitle: "Surentez kreñvaet",
    password2FA:
      "Gweredekaat an dilesadur daou-doare evit ouzhpennañ ur gwiskad surentez ouzhpenn.",
    passwordTestStrength:
      "Gwiriañ alies kreñvder ho kerioù-tremes gant ostilhoù azas.",

    aboutCreditsTitle: "Diwar-benn & Kredoù",
    aboutCreator:
      "Krouer: Ar witrouezh-mañ a zo bet ereoù ha diorroet gant MisterFreeze25 en-dro d'ur raktres skol blezh-fin. Ar pal a oa krouiñ un ostilh web praktik o kenskeudet meur a zanvez-skol.",
    aboutProject:
      "Raktres: Ur jediñer kreñvder gerioù-tremen eo heman a ro tu d'an implijer merkañ ur ger-tremen ha kaout un estim eus e surentez. An dezrann a zo diazezet war hed ar ger-tremen ha liested an arouezennoù implijet (pennlizheroù, bihanlizheroù, niverennoù ha merkoù ispisial). Uheloc'h eo an niver a gemmaduoù posupl, diaesoc'h eo divout ar ger-tremen.",
    aboutSubjects:
      "Danvezioù: Ar raktres-mañ a laka en-dro meur a zanvez. Ar matematikoù hag ar skiantoù a zo implijet dre brobabilidigezh ha kenaozadur evit jediñ an niver a gemmaduoù posupl. An teknikadurezh a zo anezhañ gant implij HTML evit ar framm, CSS evit an design ha JavaScript evit ar jediñoù hag an etrewezhiañ.",
    aboutPurpose:
      "Pal: Danvez al lec'hienn-mañ a zo bet graet evit un implij kelennadurel hag deskadurel hepken. E pal eo lakaat tud da vezañ war evezh eus pratikoù mat e-keñver surentez ar gerioù-tremen.",
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
