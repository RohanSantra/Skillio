import {
    Check,
    Circle,
} from "lucide-react";

import {
    getPasswordChecks,
    getPasswordStrength,
} from "../utils/passwordValidation.js";

const PasswordStrength = ({ password = "" }) => {
    const checks = getPasswordChecks(password);
    const strength = getPasswordStrength(password);

    return (
        <div className="mt-2.5 space-y-2.5">

            {/* Strength header */}

            <div className="flex items-center justify-between">

                <span className="text-label-sm text-[var(--on-surface-variant)]">
                    Password strength
                </span>

                <span
                    className={`
                        text-label-sm
                        font-medium
                        ${
                            !password
                                ? "text-[var(--on-surface-variant)]"
                                : strength.label === "Weak"
                                    ? "text-[var(--error)]"
                                    : strength.label === "Fair"
                                        ? "text-[var(--secondary)]"
                                        : "text-[var(--primary)]"
                        }
                    `}
                >
                    {password ? strength.label : "—"}
                </span>

            </div>


            {/* Strength bars */}

            <div
                className="flex gap-1"
                aria-label={
                    password
                        ? `Password strength: ${strength.label}`
                        : "Password strength"
                }
            >
                {[1, 2, 3, 4].map((bar) => (
                    <div
                        key={bar}
                        className={`
                            h-1.5
                            flex-1
                            rounded-full
                            transition-all
                            duration-300
                            ${
                                bar <= strength.score
                                    ? "bg-[var(--primary)]"
                                    : "bg-[var(--surface-container-high)]"
                            }
                        `}
                    />
                ))}
            </div>


            {/* Requirements */}

            <div className="space-y-1.5">

                <PasswordRequirement
                    valid={checks.minLength}
                    text="At least 8 characters"
                />

                <PasswordRequirement
                    valid={checks.hasNumber}
                    text="Include at least one number"
                />

                <PasswordRequirement
                    valid={checks.hasSymbol}
                    text="Include at least one symbol"
                />

            </div>

        </div>
    );
};


const PasswordRequirement = ({
    valid,
    text,
}) => {
    return (
        <div
            className={`
                flex
                items-center
                gap-2
                text-label-sm
                transition-colors
                duration-200
                ${
                    valid
                        ? "text-[var(--primary)]"
                        : "text-[var(--on-surface-variant)]"
                }
            `}
        >
            {valid ? (
                <Check
                    size={14}
                    strokeWidth={2.5}
                    aria-hidden="true"
                />
            ) : (
                <Circle
                    size={9}
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            )}

            <span>{text}</span>

        </div>
    );
};

export default PasswordStrength;