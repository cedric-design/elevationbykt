import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDays,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    X,
    Pencil,
    AlertTriangle,
    MapPin,
    Users,
    Lock,
    Unlock,
} from 'lucide-react';
import { AdminShell, AdminStatCard } from '@/components/admin/admin-shell';

interface Option {
    value: string;
    label: string;
}

interface EventItem {
    id: number;
    title: string;
    slug: string;
    type: string;
    type_label: string;
    description: string | null;
    starts_at: string;
    starts_at_iso: string | null;
    ends_at: string | null;
    place: string;
    access_mode: string;
    access_mode_label: string;
    capacity: number | null;
    is_published: boolean;
    sort_order: number;
    registrations_count: number;
    is_full: boolean;
}

interface PageProps {
    events: EventItem[];
    types: Option[];
    accessModes: Option[];
    stats: { total: number; published: number; registrations: number };
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
                className="fixed inset-0 z-[70] flex items-center justify-center p-4"
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

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {children}
            </div>
        </div>
    );
}

function formatDate(iso: string | null, fallback: string) {
    if (!iso && !fallback) return '—';
    const value = iso || fallback;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return fallback;
    return d.toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function EventForm({
    editing,
    types,
    accessModes,
    onClose,
}: {
    editing: EventItem | null;
    types: Option[];
    accessModes: Option[];
    onClose: () => void;
}) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        title: editing?.title || '',
        type: editing?.type || types[0]?.value || 'conference',
        description: editing?.description || '',
        starts_at: editing?.starts_at || '',
        ends_at: editing?.ends_at || '',
        place: editing?.place || '',
        access_mode: editing?.access_mode || 'open',
        capacity: editing?.capacity?.toString() || '',
        is_published: editing?.is_published ?? true,
        sort_order: editing?.sort_order ?? 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        };

        if (editing) {
            patch(`/admin/evenements/${editing.id}`, options);
        } else {
            post('/admin/evenements', options);
        }
    };

    return (
        <form onSubmit={submit} className="p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-cocoa">
                        {editing ? 'Modifier l’événement' : 'Nouvel événement'}
                    </h2>
                    <p className="mt-1 text-sm text-cocoa/55">Type, date, lieu et mode d’accès</p>
                </div>
                <button type="button" onClick={onClose} className="rounded-lg p-2 text-cocoa/40 hover:bg-sand hover:text-cocoa">
                    <X size={18} />
                </button>
            </div>

            <div className="space-y-4">
                <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-cocoa/70">Titre</span>
                    <input
                        required
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                    />
                    {errors.title && <p className="mt-1 text-xs text-terracotta">{errors.title}</p>}
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-cocoa/70">Type</span>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                        >
                            {types.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-cocoa/70">Accès</span>
                        <select
                            value={data.access_mode}
                            onChange={(e) => setData('access_mode', e.target.value)}
                            className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                        >
                            {accessModes.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-cocoa/70">Description</span>
                    <textarea
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                    />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-cocoa/70">Début</span>
                        <input
                            required
                            type="datetime-local"
                            value={data.starts_at}
                            onChange={(e) => setData('starts_at', e.target.value)}
                            className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                        />
                        {errors.starts_at && <p className="mt-1 text-xs text-terracotta">{errors.starts_at}</p>}
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-cocoa/70">Fin (optionnel)</span>
                        <input
                            type="datetime-local"
                            value={data.ends_at}
                            onChange={(e) => setData('ends_at', e.target.value)}
                            className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                        />
                    </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-cocoa/70">Lieu</span>
                        <input
                            required
                            value={data.place}
                            onChange={(e) => setData('place', e.target.value)}
                            placeholder="Abidjan / En ligne…"
                            className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                        />
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-cocoa/70">Capacité (optionnel)</span>
                        <input
                            type="number"
                            min={1}
                            value={data.capacity}
                            onChange={(e) => setData('capacity', e.target.value)}
                            placeholder="Illimitée"
                            className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                        />
                    </label>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-cocoa/10 bg-sand/30 px-4 py-3">
                    <input
                        type="checkbox"
                        checked={data.is_published}
                        onChange={(e) => setData('is_published', e.target.checked)}
                        className="h-4 w-4 rounded border-cocoa/30 text-emerald"
                    />
                    <span className="text-sm text-cocoa">Publier sur le site</span>
                </label>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-cocoa/15 py-3 text-sm font-medium text-cocoa hover:bg-sand"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 rounded-xl bg-cocoa py-3 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa disabled:opacity-60"
                >
                    {processing ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Créer'}
                </button>
            </div>
        </form>
    );
}

export default function EventsAdminPage() {
    const { events, types, accessModes, stats, auth } = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<EventItem | null>(null);
    const [toDelete, setToDelete] = useState<EventItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    const openCreate = () => {
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (event: EventItem) => {
        setEditing(event);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        router.delete(`/admin/evenements/${toDelete.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setToDelete(null);
            },
        });
    };

    return (
        <AdminShell
            current="/admin/evenements"
            title="Événements"
            subtitle="Gère les rendez-vous et les inscriptions"
            user={auth.user}
            actions={
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-full bg-cocoa px-5 py-2.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa"
                >
                    <Plus size={16} />
                    Nouvel événement
                </button>
            }
        >
            <Head title="Événements — Admin" />

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <AdminStatCard icon={CalendarDays} label="Événements" value={stats.total} accent="cocoa" />
                <AdminStatCard icon={Eye} label="Publiés" value={stats.published} accent="emerald" />
                <AdminStatCard icon={Users} label="Inscriptions" value={stats.registrations} accent="honey" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-cocoa/[0.07] bg-white/90 shadow-sm">
                {events.length === 0 ? (
                    <div className="p-16 text-center">
                        <CalendarDays className="mx-auto text-cocoa/25" size={32} />
                        <p className="mt-4 text-cocoa/60">Aucun événement pour le moment</p>
                        <button
                            type="button"
                            onClick={openCreate}
                            className="mt-4 text-sm font-medium text-emerald hover:text-cocoa"
                        >
                            Créer le premier rendez-vous
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-cocoa/8">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-honey/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-honey">
                                            {event.type_label}
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                                event.access_mode === 'open'
                                                    ? 'bg-emerald/10 text-emerald'
                                                    : 'bg-cocoa/8 text-cocoa/60'
                                            }`}
                                        >
                                            {event.access_mode === 'open' ? <Unlock size={10} /> : <Lock size={10} />}
                                            {event.access_mode_label}
                                        </span>
                                        {!event.is_published && (
                                            <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-terracotta">
                                                Brouillon
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-2 font-semibold text-cocoa">{event.title}</h3>
                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cocoa/50">
                                        <span className="inline-flex items-center gap-1">
                                            <CalendarDays size={12} />
                                            {formatDate(event.starts_at_iso, event.starts_at)}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin size={12} />
                                            {event.place}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Users size={12} />
                                            {event.registrations_count}
                                            {event.capacity ? ` / ${event.capacity}` : ''} inscrits
                                        </span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 flex-wrap items-center gap-2">
                                    <a
                                        href={`/admin/evenements/${event.id}/inscrits`}
                                        className="rounded-xl border border-cocoa/10 px-3 py-2 text-xs font-medium text-cocoa transition hover:border-emerald/30 hover:bg-emerald/5 hover:text-emerald"
                                    >
                                        Inscrits
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.patch(`/admin/evenements/${event.id}/toggle`, {}, { preserveScroll: true })
                                        }
                                        className="rounded-xl border border-cocoa/10 p-2.5 text-cocoa/50 transition hover:bg-white hover:text-cocoa"
                                        title={event.is_published ? 'Dépublier' : 'Publier'}
                                    >
                                        {event.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openEdit(event)}
                                        className="rounded-xl border border-cocoa/10 p-2.5 text-cocoa/50 transition hover:bg-white hover:text-cocoa"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setToDelete(event)}
                                        className="rounded-xl border border-cocoa/10 p-2.5 text-cocoa/50 transition hover:border-terracotta/30 hover:bg-terracotta/5 hover:text-terracotta"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <EventForm
                    editing={editing}
                    types={types}
                    accessModes={accessModes}
                    onClose={() => setOpen(false)}
                />
            </Modal>

            <ConfirmModal
                open={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                title="Supprimer cet événement ?"
                message="Les inscriptions associées seront aussi supprimées."
                loading={deleting}
            />
        </AdminShell>
    );
}
