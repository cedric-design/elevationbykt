import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Users,
    Plus,
    X,
    Mail,
    Trash2,
    RefreshCw,
    CheckCircle,
    Clock,
    AlertTriangle,
    UserX,
    UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminShell, AdminPanel, AdminEmpty } from '@/components/admin/admin-shell';

function ConfirmModal({ 
    open, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText = 'Confirmer',
    variant = 'danger',
    loading = false,
}: { 
    open: boolean; 
    onClose: () => void; 
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    variant?: 'danger' | 'warning';
    loading?: boolean;
}) {
    if (!open) return null;

    const colors = variant === 'danger' 
        ? { bg: 'bg-terracotta/10', icon: 'text-terracotta', btn: 'bg-terracotta hover:bg-terracotta/90' }
        : { bg: 'bg-honey/10', icon: 'text-honey', btn: 'bg-honey hover:bg-honey/90 text-cocoa' };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={onClose} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                >
                    <div className="p-6 text-center">
                        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${colors.bg}`}>
                            <AlertTriangle size={28} className={colors.icon} />
                        </div>
                        <h3 className="text-xl font-semibold text-cocoa">{title}</h3>
                        <p className="mt-2 text-sm text-cocoa/60">{message}</p>
                    </div>
                    <div className="flex gap-3 border-t border-cocoa/10 bg-sand/30 p-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 rounded-xl border border-cocoa/15 py-3 text-sm font-medium text-cocoa transition hover:bg-white disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`flex-1 rounded-xl py-3 text-sm font-medium text-sand transition disabled:opacity-50 ${colors.btn}`}
                        >
                            {loading ? 'Chargement...' : confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

interface Collaborator {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    created_at: string;
    email_verified_at: string | null;
    invitation_sent_at: string | null;
    is_active: boolean;
}

interface PageProps {
    collaborators: Collaborator[];
    auth: { user: { name: string; email: string; id: number } };
    [key: string]: unknown;
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
    const [showDelete, setShowDelete] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const hasAccepted = collab.email_verified_at !== null;
    const isPending = !hasAccepted && collab.invitation_sent_at !== null;
    const isCurrentUser = collab.id === currentUserId;

    const resend = () => {
        setResending(true);
        router.post(`/admin/collaborateurs/${collab.id}/resend`, {}, {
            onFinish: () => setResending(false),
        });
    };

    const confirmDelete = () => {
        setLoading(true);
        router.delete(`/admin/collaborateurs/${collab.id}`, {
            onFinish: () => {
                setLoading(false);
                setShowDelete(false);
            },
        });
    };

    const confirmToggle = () => {
        setLoading(true);
        router.patch(`/admin/collaborateurs/${collab.id}/toggle`, {}, {
            onFinish: () => {
                setLoading(false);
                setShowToggle(false);
            },
        });
    };

    return (
        <>
            <tr className="border-b border-cocoa/8 transition hover:bg-sand/30">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-semibold ${collab.is_active ? 'bg-emerald/10 text-emerald' : 'bg-cocoa/10 text-cocoa/40'}`}>
                            {collab.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className={`font-medium ${collab.is_active ? 'text-cocoa' : 'text-cocoa/50'}`}>
                                {collab.name}
                                {isCurrentUser && <span className="ml-2 text-xs text-cocoa/40">(vous)</span>}
                            </div>
                            <div className="text-sm text-cocoa/50">{collab.email}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-cocoa/60">{collab.phone || '—'}</td>
                <td className="px-6 py-4">
                    {!collab.is_active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-3 py-1 text-xs font-medium text-terracotta">
                            <UserX size={12} />
                            Désactivé
                        </span>
                    ) : hasAccepted ? (
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
                        {!isCurrentUser && hasAccepted && (
                            <button
                                onClick={() => setShowToggle(true)}
                                className={`rounded-lg p-2 transition ${collab.is_active ? 'text-cocoa/40 hover:bg-honey/10 hover:text-honey' : 'text-cocoa/40 hover:bg-emerald/10 hover:text-emerald'}`}
                                title={collab.is_active ? 'Désactiver' : 'Activer'}
                            >
                                {collab.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                            </button>
                        )}
                        {!isCurrentUser && (
                            <button
                                onClick={() => setShowDelete(true)}
                                className="rounded-lg p-2 text-cocoa/40 transition hover:bg-terracotta/10 hover:text-terracotta"
                                title="Supprimer"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                title="Supprimer ce collaborateur ?"
                message={`${collab.name} sera définitivement supprimé de l'équipe.`}
                confirmText="Supprimer"
                variant="danger"
                loading={loading}
            />

            <ConfirmModal
                open={showToggle}
                onClose={() => setShowToggle(false)}
                onConfirm={confirmToggle}
                title={collab.is_active ? 'Désactiver ce collaborateur ?' : 'Activer ce collaborateur ?'}
                message={collab.is_active 
                    ? `${collab.name} ne pourra plus accéder au tableau de bord.`
                    : `${collab.name} pourra à nouveau accéder au tableau de bord.`
                }
                confirmText={collab.is_active ? 'Désactiver' : 'Activer'}
                variant="warning"
                loading={loading}
            />
        </>
    );
}

export default function Collaborators() {
    const { collaborators, auth } = usePage<PageProps>().props;
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <Head title="Équipe — ÉLÉVATION" />
            <AdminShell
                current="/admin/collaborateurs"
                title="Équipe"
                subtitle="Gérer les collaborateurs administrateurs"
                user={auth.user}
                actions={
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-medium text-sand shadow-lg shadow-emerald/25 transition hover:bg-cocoa"
                    >
                        <Plus size={16} />
                        Inviter
                    </button>
                }
            >
                <AdminPanel>
                    {collaborators.length === 0 ? (
                        <AdminEmpty
                            icon={Users}
                            title="Aucun collaborateur pour le moment"
                            action={
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="text-sm font-medium text-emerald transition hover:text-cocoa"
                                >
                                    + Inviter le premier collaborateur
                                </button>
                            }
                        />
                    ) : (
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
                                    {collaborators.map((c) => (
                                        <CollaboratorRow key={c.id} collab={c} currentUserId={auth.user.id} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AdminPanel>
            </AdminShell>

            <AnimatePresence>
                {showForm && <CollaboratorForm onClose={() => setShowForm(false)} />}
            </AnimatePresence>
        </>
    );
}
