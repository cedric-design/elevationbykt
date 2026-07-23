import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Inbox,
    MailOpen,
    Mail,
    Trash2,
    Eye,
    X,
    AlertTriangle,
    Reply,
} from 'lucide-react';
import { AdminShell, AdminStatCard, AdminPanel, AdminEmpty } from '@/components/admin/admin-shell';

const TOPIC_LABELS: Record<string, string> = {
    partenariat: 'Partenariat',
    presse: 'Presse',
    evenement: 'Événement',
    masterclass: 'Masterclass',
    autre: 'Autre',
};

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    topic: string;
    message: string;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

interface PageProps {
    messages: ContactMessage[];
    stats: { total: number; unread: number };
    auth: { user: { name: string; email: string; role: string } };
    [key: string]: unknown;
}

function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    message,
    loading = false,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    loading?: boolean;
}) {
    if (!open) return null;

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
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
                            <AlertTriangle size={28} className="text-terracotta" />
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
                            className="flex-1 rounded-xl bg-terracotta py-3 text-sm font-medium text-sand transition hover:bg-terracotta/90 disabled:opacity-50"
                        >
                            {loading ? 'Suppression...' : 'Supprimer'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function formatDate(value: string) {
    return new Date(value).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ContactMessagesPage() {
    const { messages, stats, auth } = usePage<PageProps>().props;
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [selected, setSelected] = useState<ContactMessage | null>(null);
    const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
    const [deleting, setDeleting] = useState(false);

    const filtered = useMemo(() => {
        if (filter === 'unread') return messages.filter((m) => !m.is_read);
        if (filter === 'read') return messages.filter((m) => m.is_read);
        return messages;
    }, [messages, filter]);

    const openMessage = (message: ContactMessage) => {
        setSelected(message);
        if (!message.is_read) {
            router.patch(`/admin/contact/${message.id}/read`, {}, { preserveScroll: true });
        }
    };

    const toggleRead = (message: ContactMessage) => {
        const url = message.is_read
            ? `/admin/contact/${message.id}/unread`
            : `/admin/contact/${message.id}/read`;
        router.patch(url, {}, { preserveScroll: true });
        if (selected?.id === message.id) {
            setSelected({
                ...message,
                is_read: !message.is_read,
                read_at: message.is_read ? null : new Date().toISOString(),
            });
        }
    };

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        router.delete(`/admin/contact/${toDelete.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                if (selected?.id === toDelete.id) setSelected(null);
                setToDelete(null);
            },
        });
    };

    return (
        <AdminShell
            current="/admin/contact"
            title="Messages"
            subtitle="Messages reçus depuis le formulaire contact"
            user={auth.user}
        >
            <Head title="Messages contact — Admin" />

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <AdminStatCard icon={Inbox} label="Total" value={stats.total} accent="cocoa" />
                <AdminStatCard icon={Mail} label="Non lus" value={stats.unread} accent="honey" />
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
                {(
                    [
                        ['all', 'Tous'],
                        ['unread', 'Non lus'],
                        ['read', 'Lus'],
                    ] as const
                ).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setFilter(id)}
                        className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                            filter === id
                                ? 'bg-cocoa text-sand'
                                : 'border border-cocoa/15 bg-white/60 text-cocoa/65 hover:border-cocoa/30'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <AdminPanel>
                {filtered.length === 0 ? (
                    <AdminEmpty
                        icon={Inbox}
                        title="Aucun message"
                        description={
                            filter === 'unread'
                                ? 'Tous les messages ont été lus.'
                                : 'Les messages du formulaire contact apparaîtront ici.'
                        }
                    />
                ) : (
                    <div className="divide-y divide-cocoa/8">
                        {filtered.map((message) => (
                            <div
                                key={message.id}
                                className={`flex flex-col gap-3 p-4 transition hover:bg-sand/40 sm:flex-row sm:items-center sm:justify-between ${
                                    !message.is_read ? 'bg-honey/5' : ''
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => openMessage(message)}
                                    className="min-w-0 flex-1 text-left"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        {!message.is_read && (
                                            <span className="h-2 w-2 rounded-full bg-honey" />
                                        )}
                                        <span className="font-medium text-cocoa">{message.name}</span>
                                        <span className="rounded-full bg-cocoa/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cocoa/55">
                                            {TOPIC_LABELS[message.topic] || message.topic}
                                        </span>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-cocoa/55">{message.email}</p>
                                    <p className="mt-1 line-clamp-1 text-sm text-cocoa/70">{message.message}</p>
                                    <p className="mt-1.5 text-xs text-cocoa/40">{formatDate(message.created_at)}</p>
                                </button>

                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleRead(message)}
                                        className="rounded-xl border border-cocoa/10 p-2.5 text-cocoa/50 transition hover:border-emerald/30 hover:bg-emerald/5 hover:text-emerald"
                                        title={message.is_read ? 'Marquer non lu' : 'Marquer lu'}
                                    >
                                        {message.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openMessage(message)}
                                        className="rounded-xl border border-cocoa/10 p-2.5 text-cocoa/50 transition hover:border-cocoa/25 hover:bg-white hover:text-cocoa"
                                        title="Voir"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setToDelete(message)}
                                        className="rounded-xl border border-cocoa/10 p-2.5 text-cocoa/50 transition hover:border-terracotta/30 hover:bg-terracotta/5 hover:text-terracotta"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AdminPanel>

            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 16 }}
                            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
                        >
                            <div className="flex items-start justify-between border-b border-cocoa/10 p-5">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-honey">
                                        {TOPIC_LABELS[selected.topic] || selected.topic}
                                    </p>
                                    <h3 className="mt-1 text-xl font-semibold text-cocoa">{selected.name}</h3>
                                    <a href={`mailto:${selected.email}`} className="mt-1 text-sm text-emerald hover:underline">
                                        {selected.email}
                                    </a>
                                    <p className="mt-2 text-xs text-cocoa/40">{formatDate(selected.created_at)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelected(null)}
                                    className="rounded-lg p-2 text-cocoa/40 transition hover:bg-sand hover:text-cocoa"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-5">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-cocoa/80">{selected.message}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 border-t border-cocoa/10 bg-sand/30 p-4">
                                <a
                                    href={`mailto:${selected.email}?subject=Re: ${TOPIC_LABELS[selected.topic] || selected.topic} — ÉLÉVATION`}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald px-4 py-3 text-sm font-medium text-sand transition hover:bg-cocoa"
                                >
                                    <Reply size={16} />
                                    Répondre
                                </a>
                                <button
                                    type="button"
                                    onClick={() => toggleRead(selected)}
                                    className="rounded-xl border border-cocoa/15 px-4 py-3 text-sm font-medium text-cocoa transition hover:bg-white"
                                >
                                    {selected.is_read ? 'Marquer non lu' : 'Marquer lu'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setToDelete(selected);
                                    }}
                                    className="rounded-xl border border-terracotta/20 px-4 py-3 text-sm font-medium text-terracotta transition hover:bg-terracotta/5"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmModal
                open={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                title="Supprimer ce message ?"
                message="Cette action est définitive. Le message ne pourra pas être récupéré."
                loading={deleting}
            />
        </AdminShell>
    );
}
