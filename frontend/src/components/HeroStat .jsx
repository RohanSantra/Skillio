/* =========================================================
   HERO STAT
========================================================= */

const HeroStat = ({
    value,
    label,
    icon: Icon,
}) => {

    return (

        <div
            className="
                rounded-2xl
                border
                p-4
                backdrop-blur-md
                sm:p-5
            "
            style={{
                background:
                    "rgba(255,255,255,0.08)",
                borderColor:
                    "rgba(255,255,255,0.12)",
            }}
        >

            <Icon
                size={18}
                style={{
                    color:
                        "var(--primary-fixed)",
                }}
            />


            <p
                className="
                    mt-5
                    text-2xl
                    font-bold
                    sm:text-3xl
                "
                style={{
                    fontFamily:
                        "var(--font-heading)",
                    color:
                        "var(--on-primary)",
                }}
            >

                {value}

            </p>


            <p
                className="mt-1 text-xs sm:text-sm"
                style={{
                    color:
                        "rgba(255,255,255,0.68)",
                }}
            >

                {label}

            </p>

        </div>

    );

};


export default HeroStat;