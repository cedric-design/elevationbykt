interface ElevationLogoProps {
    className?: string;
    size?: number;
}

/** Logo ÉLÉVATION — rotation complète toutes les 10s. */
export default function ElevationLogo({ className = '', size = 36 }: ElevationLogoProps) {
    return (
        <img
            src="/elevation-symbole.png"
            alt="ELEVATION by Kadhy"
            width={size}
            height={size}
            className={`elevation-logo-spin shrink-0 object-contain ${className}`}
        />
    );
}
