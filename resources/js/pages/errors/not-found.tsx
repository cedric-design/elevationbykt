import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Home } from 'lucide-react';
import ElevationLogo from '@/components/ivoire/elevation-logo';

export default function NotFound() {
    return (
        <>
            <Head title="Page introuvable" />
            <div className="tpl-ivoire flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-cocoa">
                <div className="mx-auto max-w-lg text-center">
                    <ElevationLogo className="mx-auto mb-8 h-12 w-auto" />
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald">Erreur 404</p>
                    <h1 className="mt-4 font-marcellus text-5xl text-cocoa md:text-6xl">Page introuvable</h1>
                    <p className="mt-4 text-lg text-cocoa/70">
                        La page que vous recherchez n&apos;existe pas ou a été déplacée.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald/90"
                        >
                            <Home className="h-4 w-4" />
                            Retour à l&apos;accueil
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 rounded-full border border-cocoa/20 px-6 py-3 text-sm font-semibold text-cocoa transition hover:border-emerald hover:text-emerald"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Page précédente
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
