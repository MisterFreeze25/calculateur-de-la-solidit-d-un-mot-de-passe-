window.PasswordEstimator = (() => {
  function getCharacterPoolSize(password) {
    let pool = 0;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^A-Za-z0-9]/.test(password)) pool += 33;
    return Math.max(pool, 1);
  }

  function getEffectiveEntropy(password) {
    const poolSize = getCharacterPoolSize(password);
    const rawEntropy = Array.from(password).length * Math.log2(poolSize);

    let penalty = 0;
    if (/^[a-z]+$/i.test(password)) {
      penalty += password.length * 1.5;
    }
    if (/(.)\1{2,}/.test(password)) {
      penalty += 8;
    }
    if (/(0123|1234|2345|3456|abcd|qwerty|azerty)/i.test(password)) {
      penalty += 12;
    }
    if (/^[A-Za-z]+[0-9]{1,4}[!@#$%^&*]?$/i.test(password)) {
      penalty += 10;
    }

    return Math.max(1, rawEntropy - penalty);
  }

  function getFallbackScore(guesses) {
    if (guesses < 1e3) return 0;
    if (guesses < 1e6) return 1;
    if (guesses < 1e8) return 2;
    if (guesses < 1e10) return 3;
    return 4;
  }

  function estimate(password) {
    const zxcvbnResult =
      typeof window.zxcvbn === "function" ? window.zxcvbn(password) : null;
    const dictionaryGuesses =
      window.PasswordDictionary?.getGuessEstimate(password) ?? null;
    let guesses =
      Number.isFinite(zxcvbnResult?.guesses) && zxcvbnResult.guesses > 0
        ? zxcvbnResult.guesses
        : Math.pow(2, getEffectiveEntropy(password));

    if (Number.isFinite(dictionaryGuesses) && dictionaryGuesses > 0) {
      guesses = Math.min(guesses, dictionaryGuesses);
    }

    if (!zxcvbnResult && /^(.)\1+$/.test(password)) {
      guesses = Math.min(guesses, password.length * 2);
    }

    let score = Number.isInteger(zxcvbnResult?.score)
      ? zxcvbnResult.score
      : getFallbackScore(guesses);
    if (Number.isFinite(dictionaryGuesses) && dictionaryGuesses > 0) {
      score = Math.min(score, getFallbackScore(guesses));
    }

    return {
      guesses,
      score,
      seconds: guesses / 2 / (100 / 3600),
    };
  }

  return { estimate };
})();