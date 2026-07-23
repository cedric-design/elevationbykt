import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ElevationLogo from '@/components/ivoire/elevation-logo';
import SmartImage from '@/components/ivoire/smart-image';
import { PROFILE } from '@/data/content';
import type { AuthLayoutProps } from '@/types';

const FALLBACK = 'from-[#1f6b52] via-[#c79a4b] to-[#c96f42]';

export default function AuthIvoireLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="tpl-ivoire grid min-h-svh overflow-hidden bg-sand lg:grid-cols-2">
            <div className="flex min-h-svh flex-col overflow-hidden px-6 py-5 sm:px-10 lg:px-16 xl:px-20">
                <Link
                    href="/"
                    className="ivoire-serif flex shrink-0 items-center gap-2.5 text-xl tracking-wide text-cocoa transition hover:text-emerald"
                >
                    <ElevationLogo size={32} />
                    {PROFILE.brand}
                </Link>

                <div className="flex flex-1 items-center overflow-y-auto py-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto w-full max-w-sm"
                    >
                        {(title || description) && (
                            <div className="mb-8">
                                {title && (
                                    <h1 className="ivoire-serif text-4xl text-cocoa">{title}</h1>
                                )}
                                {description && (
                                    <p className="mt-2 text-cocoa/65">{description}</p>
                                )}
                            </div>
                        )}
                        {children}
                    </motion.div>
                </div>

                <p className="shrink-0 text-xs text-cocoa/45">
                    © {new Date().getFullYear()} {PROFILE.brand}
                </p>
            </div>

            <div className="relative hidden overflow-hidden lg:block">
                <motion.div
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                >
                    <SmartImage
                        src="/kadhy-bienvenue.png"
                        alt={PROFILE.brand}
                        className="h-full w-full"
                        imgClass="h-full w-full object-cover"
                        fallback={FALLBACK}
                    />
                </motion.div>
            </div>
        </div>
    );
}
