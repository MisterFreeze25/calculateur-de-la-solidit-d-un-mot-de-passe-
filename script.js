let currentLanguage = localStorage.getItem("language") || "fr";

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("passwordInput");
  const checkButton = document.getElementById("checkButton");
  const results = document.getElementById("results");
  const toggle = document.getElementById("togglePassword");

  function checkStrength(password, estimate) {
    // Conserver les mêmes états d'affichage qu'avant : très faible à très fort.
    return ["veryWeak", "weak", "medium", "strong", "veryStrong"][
      estimate.score
    ];
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

  function formatCrackDuration(totalSeconds) {
    const duration =
      translations[currentLanguage]?.crackTimeUnits ||
      translations.fr.crackTimeUnits;
    const units = [
      { singular: duration.year, plural: duration.years, seconds: 31557600 },
      { singular: duration.month, plural: duration.months, seconds: 2592000 },
      { singular: duration.day, plural: duration.days, seconds: 86400 },
      { singular: duration.hour, plural: duration.hours, seconds: 3600 },
      { singular: duration.minute, plural: duration.minutes, seconds: 60 },
      { singular: duration.second, plural: duration.seconds, seconds: 1 },
    ];

    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
      return `${duration.moreThan} ${duration.huge}`;
    }

    if (totalSeconds < 1) {
      return duration.lessThanSecond;
    }

    if (totalSeconds < 60) {
      const numberLocale =
        currentLanguage === "fr"
          ? "fr-FR"
          : currentLanguage === "sp"
            ? "es-ES"
            : currentLanguage;
      const value = Number(totalSeconds.toFixed(1));
      const label = value === 1 ? duration.second : duration.seconds;
      return `${value.toLocaleString(numberLocale)} ${label}`;
    }

    for (const unit of units) {
      if (totalSeconds >= unit.seconds) {
        const value = Math.round(totalSeconds / unit.seconds);
        const label = value === 1 ? unit.singular : unit.plural;
        const numberLocale =
          currentLanguage === "fr"
            ? "fr-FR"
            : currentLanguage === "sp"
              ? "es-ES"
              : currentLanguage;
        return `${Number(value).toLocaleString(numberLocale)} ${label}`;
      }
    }
    return translations[currentLanguage]?.crackTimeUnits?.lessThanSecond ||
      translations.fr.crackTimeUnits.lessThanSecond;
  }

  function formatEstimatedGuesses(guesses) {
    if (!Number.isFinite(guesses)) return "∞";
    const numberLocale =
      currentLanguage === "sp"
        ? "es-ES"
        : currentLanguage === "fr"
          ? "fr-FR"
          : currentLanguage;
    const exponent = Math.floor(Math.log10(guesses));
    if (exponent < 6) {
      return Math.round(guesses).toLocaleString(numberLocale);
    }
    const coefficient = Number((guesses / 10 ** exponent).toFixed(1));
    return `${coefficient.toLocaleString(numberLocale)} × 10<sup>${exponent}</sup>`;
  }

  // Met à jour l'affichage de la solidité
  function updateStrengthDisplay(password) {
    if (!results) return;
    if (!password) {
      results.textContent = "";
      results.style.color = "";
      results.removeAttribute("aria-label");
      return;
    }
    const estimate = window.PasswordEstimator.estimate(password);
    const strengthKey = checkStrength(password, estimate);
    const strengthText =
      translations[currentLanguage]?.strengths?.[strengthKey] || "Unknown";
    const feedback = getPasswordFeedback(password);
    const strengthLabel =
      currentLanguage === "fr"
        ? "Solidité"
        : translations[currentLanguage]?.strengthLabel || "Strength";
    const estimatedGuessesLabel =
      translations[currentLanguage]?.estimatedGuessesLabel ||
      "Estimated attempts to guess the password:";
    const crackTimeLabel =
      translations[currentLanguage]?.crackTimeLabel ||
      "Estimated time (100 guesses per hour):";
    const attackNote =
      translations[currentLanguage]?.attackNote ||
      "Assumes a throttled online attack; offline attacks can be much faster.";
    const crackTime = formatCrackDuration(estimate.seconds);
    const improvementsLabel =
      translations[currentLanguage]?.feedback?.improvementsNeeded ||
      "Improvements needed:";

    let resultHTML = `<div style="font-weight: 600; margin-bottom: 12px; color: ${strengthColors[strengthKey]};">${strengthLabel} : ${strengthText}</div>`;
    resultHTML += `<div style="font-size: 0.95rem; margin-bottom: 6px; color: #333;">${estimatedGuessesLabel} ${formatEstimatedGuesses(estimate.guesses)}</div>`;
    resultHTML += `<div style="font-size: 0.95rem; margin-bottom: 6px; color: #333;">${crackTimeLabel} ${crackTime}</div>`;
    resultHTML += `<div style="font-size: 0.78rem; margin-bottom: 10px; color: #666;">${attackNote}</div>`;

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

  // Gestion de la sélection de la langue et traduction
  const languageSelect = document.getElementById("languageSelect");

  function setLanguage(lang) {
    currentLanguage = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    document.documentElement.lang = lang;
    localStorage.setItem("language", lang);

    if (passwordInput.value.trim()) {
      updateStrengthDisplay(passwordInput.value.trim());
    }

    if (toggle) {
      updateToggle();
    }
  }

  const savedLanguage = localStorage.getItem("language") || "fr";
  languageSelect.value = savedLanguage;
  setLanguage(savedLanguage);

  languageSelect.addEventListener("change", (e) => {
    setLanguage(e.target.value);
  });
});

const translations = window.translations;

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
