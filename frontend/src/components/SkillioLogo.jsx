import React from "react";

const SkillioLogo = ({
    color = "#3A5335",
    size = 200,
    className = "",
}) => {
    const height = Math.round(size * 0.333);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 400"
            width={size}
            height={height}
            className={className}
            role="img"
            aria-label="Skillio"
        >
            <g
                fill="none"
                stroke={color}
                strokeWidth="24"
                strokeLinecap="square"
                strokeLinejoin="miter"
            >
                <line
                    x1="200"
                    y1="210"
                    x2="200"
                    y2="330"
                />

                <path
                    d="
                        M 200,250
                        C 150,250 120,200 120,135
                        C 160,135 200,165 200,210
                        Z
                    "
                />

                <path
                    d="
                        M 200,250
                        C 245,250 280,225 280,170
                        C 250,170 212,190 200,215
                    "
                />
            </g>

            <text
                x="360"
                y="285"
                fill={color}
                style={{
                    fontFamily:
                        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    fontSize: "215px",
                    fontWeight: 500,
                    letterSpacing: "-2px",
                }}
            >
                Skillio
            </text>
        </svg>
    );
};

export default SkillioLogo;