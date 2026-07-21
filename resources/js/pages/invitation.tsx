import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import ElevationLogo from '@/components/ivoire/elevation-logo';

interface PageProps {
    valid: boolean;
    token: string;
    name: string | null;
    email: string | null;
    [key: string]: unknown;
}

function PasswordInput({ label, value, onChange, placeholder, error }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    error?: string;
}) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-cocoa/70">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-cocoa outline-none transition placeholder:text-cocoa/40 focus:shadow-[0_0_0_3px_rgba(31,107,82,0.12)] ${
                        error ? 'border-terracotta' : 'border-cocoa/15 focus:border-emerald'
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cocoa/40 hover:text-cocoa"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-terracotta">{error}</p>}
        </div>
    );
}

export default function Invitation() {
    const { valid, token, name, email } = usePage<PageProps>().props;
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const tooShort = password.length > 0 && password.length < 8;
    const mismatch = confirm.length > 0 && confirm !== password;
    const canSubmit = password.length >= 8 && confirm === password && !loading;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`/invitation/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    password,
                    password_confirmation: confirm,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                window.location.href = data.redirect || '/espace';
            } else if (res.status === 422) {
                const data = await res.json();
                setError(data.message || 'Erreur de validation.');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } catch {
            setError('Erreur de connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    if (!valid) {
        return (
            <>
                <Head title="Invitation expirée — ÉLÉVATION" />
                <div className="flex min-h-screen items-center justify-center bg-sand px-6">
                    <div className="w-full max-w-md text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
                            <AlertCircle size={32} className="text-terracotta" />
                        </div>
                        <h1 className="ivoire-serif text-2xl text-cocoa">Invitation invalide ou expirée</h1>
                        <p className="mt-3 text-cocoa/60">
                            Ce lien d'invitation n'est plus valide. Il a peut-être expiré ou a déjà été utilisé.
                        </p>
                        <p className="mt-2 text-sm text-cocoa/50">
                            Contactez l'administrateur pour recevoir une nouvelle invitation.
                        </p>
                        <a
                            href="/"
                            className="mt-6 inline-block rounded-xl bg-emerald px-6 py-3 text-sm font-medium text-sand transition hover:bg-cocoa"
                        >
                            Retour à l'accueil
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Créer mon mot de passe — ÉLÉVATION" />
            <div className="grid min-h-screen bg-sand lg:grid-cols-2">
                <div className="flex flex-col px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
                    <a href="/" className="ivoire-serif flex items-center gap-2.5 text-xl tracking-wide text-cocoa transition hover:text-emerald">
                        <ElevationLogo size={32} />
                        ÉLÉVATION by Kadhy
                    </a>
                    <div className="flex flex-1 items-center py-10">
                        <div className="w-full max-w-md">
                            <div className="mb-8 rounded-xl bg-emerald/10 p-4">
                                <p className="text-sm text-emerald">
                                    <CheckCircle size={16} className="mr-2 inline" />
                                    Bienvenue <strong>{name}</strong> ! Créez votre mot de passe pour accéder à votre espace administrateur.
                                </p>
                            </div>
                            
                            <h1 className="ivoire-serif text-3xl text-cocoa">Créer votre mot de passe</h1>
                            <p className="mt-2 text-cocoa/65">Choisissez un mot de passe sécurisé pour votre compte.</p>
                            
                            <form onSubmit={submit} className="mt-8 space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-cocoa/70">Email</label>
                                    <input
                                        type="email"
                                        value={email || ''}
                                        disabled
                                        className="w-full rounded-xl border border-cocoa/15 bg-cocoa/5 px-4 py-3 text-cocoa/60"
                                    />
                                </div>
                                
                                <PasswordInput
                                    label="Mot de passe"
                                    value={password}
                                    onChange={setPassword}
                                    placeholder="Au moins 8 caractères"
                                    error={tooShort ? 'Au moins 8 caractères.' : undefined}
                                />
                                
                                <PasswordInput
                                    label="Confirmer le mot de passe"
                                    value={confirm}
                                    onChange={setConfirm}
                                    placeholder="••••••••"
                                    error={mismatch ? 'Les mots de passe ne correspondent pas.' : undefined}
                                />
                                
                                <AnimatePresence>
                                    {confirm.length > 0 && !mismatch && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-xs text-emerald"
                                        >
                                            ✓ Les mots de passe correspondent.
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                                
                                {error && <p className="text-center text-sm text-terracotta">{error}</p>}
                                
                                <motion.button
                                    whileHover={canSubmit ? { scale: 1.02 } : undefined}
                                    whileTap={canSubmit ? { scale: 0.98 } : undefined}
                                    disabled={!canSubmit}
                                    className="w-full rounded-xl bg-emerald py-3.5 font-medium text-sand shadow-lg shadow-emerald/25 transition hover:bg-cocoa disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald"
                                >
                                    {loading ? 'Activation...' : 'Activer mon compte'}
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="relative hidden overflow-hidden lg:block">
                    <img
                        src="/kadhy-bienvenue.png"
                        alt="ELEVATION by Kadhy"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12">
                        <p className="ivoire-serif text-xl leading-relaxed text-sand">
                            "Bienvenue dans l'équipe ÉLÉVATION. Ensemble, nous accompagnons chaque parcours d'excellence."
                        </p>
                        <p className="mt-4 text-sm text-sand/70">Kadhy Touré — Fondatrice</p>
                    </div>
                </div>
            </div>
        </>
    );
}
