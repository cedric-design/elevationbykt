import { useState } from 'react';

interface SmartImageProps {
    src: string;
    alt?: string;
    className?: string;
    imgClass?: string;
    fallback?: string;
}

// Affiche une vraie photo ; en cas d'échec de chargement (hotlink bloqué),
// bascule sur un dégradé de repli pour ne jamais casser la mise en page.
export default function SmartImage({
    src,
    alt = '',
    className = '',
    imgClass = '',
    fallback = 'from-emerald via-honey to-terracotta',
}: SmartImageProps) {
    const [failed, setFailed] = useState(false);
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {!failed ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setFailed(true)}
                    className={`h-full w-full object-cover ${imgClass}`}
                />
            ) : (
                <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${fallback}`}>
                    <span className="px-4 text-center text-sm opacity-70">{alt || 'Photo'}</span>
                </div>
            )}
        </div>
    );
}
