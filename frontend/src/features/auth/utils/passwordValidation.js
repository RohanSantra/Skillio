export const PASSWORD_RULES = {
    minLength: 8,
    number: /[0-9]/,
    symbol: /[^A-Za-z0-9]/,
};

export const getPasswordChecks = (password = "") => {
    return {
        minLength:
            password.length >= PASSWORD_RULES.minLength,

        hasNumber:
            PASSWORD_RULES.number.test(password),

        hasSymbol:
            PASSWORD_RULES.symbol.test(password),
    };
};

export const isPasswordValid = (password = "") => {
    const checks = getPasswordChecks(password);

    return (
        checks.minLength &&
        checks.hasNumber &&
        checks.hasSymbol
    );
};

export const getPasswordStrength = (password = "") => {
    if (!password) {
        return {
            score: 0,
            label: "",
        };
    }

    const checks = getPasswordChecks(password);

    const passedChecks = Object.values(checks).filter(Boolean).length;

    /*
     * 0 checks
     */
    if (passedChecks === 0) {
        return {
            score: 0,
            label: "Weak",
        };
    }

    /*
     * 1 check
     */
    if (passedChecks === 1) {
        return {
            score: 1,
            label: "Weak",
        };
    }

    /*
     * 2 checks
     */
    if (passedChecks === 2) {
        return {
            score: 2,
            label: "Fair",
        };
    }

    /*
     * All basic requirements passed.
     *
     * 8–11 characters = Good
     * 12+ characters = Strong
     */
    if (password.length >= 12) {
        return {
            score: 4,
            label: "Strong",
        };
    }

    return {
        score: 3,
        label: "Good",
    };
};