import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Trash2,
    CheckCircle,
    AlertTriangle,
    UserX,
    UserCheck,
    UsersRound,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminShell, AdminStatCard, AdminPanel, AdminEmpty } from '@/components/admin/admin-shell';

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

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    created_at: string;
    email_verified_at: string | null;
    is_active: boolean;
}

interface Stats {
    total: number;
    active: number;
    inactive: number;
}

interface PageProps {
    users: User[];
    stats: Stats;
    auth: { user: { name: string; email: string; id: number } };
    [key: string]: unknown;
}

function UserRow({ user }: { user: User }) {
    const [showDelete, setShowDelete] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const [loading, setLoading] = useState(false);

    const confirmDelete = () => {
        setLoading(true);
        router.delete(`/admin/utilisateurs/${user.id}`, {
            onFinish: () => {
                setLoading(false);
                setShowDelete(false);
            },
        });
    };

    const confirmToggle = () => {
        setLoading(true);
        router.patch(`/admin/utilisateurs/${user.id}/toggle`, {}, {
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
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-semibold ${user.is_active ? 'bg-emerald/10 text-emerald' : 'bg-cocoa/10 text-cocoa/40'}`}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className={`font-medium ${user.is_active ? 'text-cocoa' : 'text-cocoa/50'}`}>
                                {user.name}
                            </div>
                            <div className="text-sm text-cocoa/50">{user.email}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-cocoa/60">{user.phone || '—'}</td>
                <td className="px-6 py-4 text-sm text-cocoa/50">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                    {!user.is_active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-3 py-1 text-xs font-medium text-terracotta">
                            <UserX size={12} />
                            Désactivé
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-medium text-emerald">
                            <CheckCircle size={12} />
                            Actif
                        </span>
                    )}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setShowToggle(true)}
                            className={`rounded-lg p-2 transition ${user.is_active ? 'text-cocoa/40 hover:bg-honey/10 hover:text-honey' : 'text-cocoa/40 hover:bg-emerald/10 hover:text-emerald'}`}
                            title={user.is_active ? 'Désactiver' : 'Activer'}
                        >
                            {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                            onClick={() => setShowDelete(true)}
                            className="rounded-lg p-2 text-cocoa/40 transition hover:bg-terracotta/10 hover:text-terracotta"
                            title="Supprimer"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                title="Supprimer cet utilisateur ?"
                message={`${user.name} sera définitivement supprimé ainsi que toutes ses données.`}
                confirmText="Supprimer"
                variant="danger"
                loading={loading}
            />

            <ConfirmModal
                open={showToggle}
                onClose={() => setShowToggle(false)}
                onConfirm={confirmToggle}
                title={user.is_active ? 'Désactiver cet utilisateur ?' : 'Activer cet utilisateur ?'}
                message={user.is_active
                    ? `${user.name} ne pourra plus se connecter à son compte.`
                    : `${user.name} pourra à nouveau se connecter à son compte.`
                }
                confirmText={user.is_active ? 'Désactiver' : 'Activer'}
                variant="warning"
                loading={loading}
            />
        </>
    );
}

export default function UsersPage() {
    const { users, stats, auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Utilisateurs — ÉLÉVATION" />
            <AdminShell
                current="/admin/utilisateurs"
                title="Utilisateurs"
                subtitle="Gérer les comptes clients"
                user={auth.user}
            >
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <AdminStatCard icon={UsersRound} label="Total clients" value={stats.total} accent="emerald" />
                    <AdminStatCard icon={UserCheck} label="Actifs" value={stats.active} accent="honey" />
                    <AdminStatCard icon={UserX} label="Désactivés" value={stats.inactive} accent="terracotta" />
                </div>

                <AdminPanel>
                    {users.length === 0 ? (
                        <AdminEmpty icon={UsersRound} title="Aucun utilisateur inscrit" />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-cocoa/10 text-left text-xs font-medium uppercase tracking-wider text-cocoa/50">
                                        <th className="px-6 py-4">Utilisateur</th>
                                        <th className="px-6 py-4">Téléphone</th>
                                        <th className="px-6 py-4">Inscrit le</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => <UserRow key={u.id} user={u} />)}
                                </tbody>
                            </table>
                        </div>
                    )}
                </AdminPanel>
            </AdminShell>
        </>
    );
}
