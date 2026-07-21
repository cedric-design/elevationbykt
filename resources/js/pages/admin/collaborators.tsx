import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    MessageSquareQuote,
    Video,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    Plus,
    X,
    Mail,
    Trash2,
    RefreshCw,
    CheckCircle,
    Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ElevationLogo from '@/components/ivoire/elevation-logo';

interface Collaborator {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    created_at: string;
    email_verified_at: string | null;
    invitation_sent_at: string | null;
}

interface PageProps {
    collaborators: Collaborator[];
    auth: { user: { name: string; email: string; id: number } };
    [key: string]: unknown;
}

const NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/espace' },
    { icon: Video, label: 'Contenus', href: '/admin/contenus' },
    { icon: MessageSquareQuote, label: 'Témoignages', href: '/admin/temoignages' },
    { icon: Users, label: 'Équipe', href: '/admin/collaborateurs', active: true },
    { icon: Settings, label: 'Paramètres', href: '#' },
];

function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-cocoa lg:flex">
            <div className="flex h-16 items-center gap-3 px-6">
                <ElevationLogo size={32} className="brightness-0 invert" />
                <span className="text-lg font-semibold text-sand">ÉLÉVATION</span>
            </div>
            <nav className="mt-4 flex-1 space-y-1 px-3">
                {NAV.map(({ icon: Icon, label, href, active }) => (
                    <a
                        key={label}
                        href={href}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                            active ? 'bg-emerald text-sand' : 'text-sand/60 hover:bg-white/5 hover:text-sand'
                        }`}
                    >
                        <Icon size={18} />
                        {label}
                    </a>
                ))}
            </nav>
            <div className="border-t border-white/10 p-3">
                <a href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sand/60 transition hover:bg-white/5 hover:text-sand">
                    <ChevronRight size={18} />
                    Voir le site
                </a>
                <button
                    onClick={() => router.post('/logout')}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sand/60 transition hover:bg-terracotta/20 hover:text-terracotta"
                >
                    <LogOut size={18} />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}

function CollaboratorForm({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        router.post('/admin/collaborateurs', { name, email, phone }, {
            onSuccess: () => onClose(),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/40 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-cocoa">Inviter un collaborateur</h2>
                    <button onClick={onClose} className="rounded-lg p-2 text-cocoa/40 hover:bg-sand hover:text-cocoa">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-cocoa/70">Nom complet</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                            placeholder="Nom du collaborateur"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-cocoa/70">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                            placeholder="email@exemple.com"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-cocoa/70">Téléphone (optionnel)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                            placeholder="+225 07 00 00 00"
                        />
                    </div>
                    <p className="rounded-xl bg-emerald/10 p-3 text-sm text-emerald">
                        <Mail size={14} className="mr-1.5 inline" />
                        Un email d'invitation sera envoyé pour créer le mot de passe.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-cocoa/15 py-3 text-sm font-medium text-cocoa transition hover:bg-sand"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name || !email}
                            className="flex-1 rounded-xl bg-emerald py-3 text-sm font-medium text-sand transition hover:bg-cocoa disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

function CollaboratorRow({ collab, currentUserId }: { collab: Collaborator; currentUserId: number }) {
    const [resending, setResending] = useState(false);
    const isActive = collab.email_verified_at !== null;
    const isPending = !isActive && collab.invitation_sent_at !== null;
    const isCurrentUser = collab.id === currentUserId;

    const resend = () => {
        setResending(true);
        router.post(`/admin/collaborateurs/${collab.id}/resend`, {}, {
            onFinish: () => setResending(false),
        });
    };

    const remove = () => {
        if (confirm(`Supprimer ${collab.name} de l'équipe ?`)) {
            router.delete(`/admin/collaborateurs/${collab.id}`);
        }
    };

    return (
        <tr className="border-b border-cocoa/8 transition hover:bg-sand/30">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10 font-semibold text-emerald">
                        {collab.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-cocoa">
                            {collab.name}
                            {isCurrentUser && <span className="ml-2 text-xs text-cocoa/40">(vous)</span>}
                        </div>
                        <div className="text-sm text-cocoa/50">{collab.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-cocoa/60">{collab.phone || '—'}</td>
            <td className="px-6 py-4">
                {isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-medium text-emerald">
                        <CheckCircle size={12} />
                        Actif
                    </span>
                ) : isPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-honey/20 px-3 py-1 text-xs font-medium text-honey">
                        <Clock size={12} />
                        En attente
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cocoa/10 px-3 py-1 text-xs font-medium text-cocoa/60">
                        Inactif
                    </span>
                )}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                    {isPending && (
                        <button
                            onClick={resend}
                            disabled={resending}
                            className="rounded-lg p-2 text-cocoa/40 transition hover:bg-emerald/10 hover:text-emerald disabled:opacity-50"
                            title="Renvoyer l'invitation"
                        >
                            <RefreshCw size={16} className={resending ? 'animate-spin' : ''} />
                        </button>
                    )}
                    {!isCurrentUser && (
                        <button
                            onClick={remove}
                            className="rounded-lg p-2 text-cocoa/40 transition hover:bg-terracotta/10 hover:text-terracotta"
                            title="Supprimer"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

export default function Collaborators() {
    const { collaborators, auth } = usePage<PageProps>().props;
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <Head title="Équipe — ÉLÉVATION" />
            <div className="min-h-screen bg-[#f8f6f2]">
                <Sidebar />
                <div className="lg:pl-[260px]">
                    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-cocoa/10 bg-white/80 px-6 backdrop-blur-md lg:px-8">
                        <div>
                            <h1 className="text-xl font-semibold text-cocoa">Équipe</h1>
                            <p className="text-sm text-cocoa/50">Gérer les collaborateurs administrateurs</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 rounded-xl bg-emerald px-4 py-2.5 text-sm font-medium text-sand shadow-lg shadow-emerald/20 transition hover:bg-cocoa"
                        >
                            <Plus size={16} />
                            Inviter
                        </button>
                    </header>

                    <main className="p-6 lg:p-8">
                        <div className="rounded-2xl border border-cocoa/10 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-cocoa/10 text-left text-xs font-medium uppercase tracking-wider text-cocoa/50">
                                            <th className="px-6 py-4">Collaborateur</th>
                                            <th className="px-6 py-4">Téléphone</th>
                                            <th className="px-6 py-4">Statut</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {collaborators.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-cocoa/50">
                                                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                                                    <p>Aucun collaborateur pour le moment</p>
                                                    <button
                                                        onClick={() => setShowForm(true)}
                                                        className="mt-3 text-sm font-medium text-emerald hover:text-cocoa"
                                                    >
                                                        + Inviter le premier collaborateur
                                                    </button>
                                                </td>
                                            </tr>
                                        ) : (
                                            collaborators.map((c) => (
                                                <CollaboratorRow key={c.id} collab={c} currentUserId={auth.user.id} />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <AnimatePresence>
                {showForm && <CollaboratorForm onClose={() => setShowForm(false)} />}
            </AnimatePresence>
        </>
    );
}
