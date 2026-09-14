import React from "react";

const SkillioIcon = ({
    color = "#3A5335",
    size = 100,
    className = "",
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 600"
            width={size}
            height={size}
            className={className}
            role="img"
            aria-label="Skillio"
        >
            <g
                fill="none"
                stroke={color}
                strokeWidth="26"
                strokeLinecap="square"
                strokeLinejoin="miter"
            >
                <line
                    x1="400"
                    y1="280"
                    x2="400"
                    y2="440"
                />

                <path
                    d="
                        M 400,340
                        C 340,340 300,280 300,190
                        C 350,190 400,230 400,280
                        Z
                    "
                />

                <path
                    d="
                        M 400,340
                        C 455,340 500,310 500,235
                        C 460,235 415,260 400,295
                    "
                />
            </g>
        </svg>
    );
};

export default SkillioIcon;