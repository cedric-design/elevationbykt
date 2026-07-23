import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Users, Mail, Phone, AlertTriangle, X } from 'lucide-react';
import { AdminShell, AdminStatCard } from '@/components/admin/admin-shell';

interface EventItem {
    id: number;
    title: string;
    type_label: string;
    place: string;
    starts_at: string;
    starts_at_iso: string | null;
    access_mode_label: string;
    capacity: number | null;
    registrations_count: number;
}

interface Registration {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    notes: string | null;
    user_id: number | null;
    created_at: string | null;
}

interface PageProps {
    event: EventItem;
    registrations: Registration[];
    auth: { user: { name: string; email: string; role: string } };
    [key: string]: unknown;
}

function formatDate(iso: string | null, fallback: string) {
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

export default function EventRegistrationsPage() {
    const { event, registrations, auth } = usePage<PageProps>().props;
    const [showForm, setShowForm] = useState(false);
    const [toDelete, setToDelete] = useState<Registration | null>(null);
    const [deleting, setDeleting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        notes: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/evenements/${event.id}/inscrits`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        router.delete(`/admin/evenements/${event.id}/inscrits/${toDelete.id}`, {
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
            title="Inscrits"
            subtitle={event.title}
            user={auth.user}
            actions={
                <div className="flex items-center gap-2">
                    <a
                        href="/admin/evenements"
                        className="inline-flex items-center gap-2 rounded-full border border-cocoa/15 px-4 py-2.5 text-sm font-medium text-cocoa transition hover:bg-white"
                    >
                        <ArrowLeft size={14} />
                        Retour
                    </a>
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 rounded-full bg-cocoa px-5 py-2.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa"
                    >
                        <Plus size={16} />
                        Ajouter
                    </button>
                </div>
            }
        >
            <Head title={`Inscrits — ${event.title}`} />

            <div className="mb-6 rounded-2xl border border-cocoa/10 bg-white/80 p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-honey/15 px-2.5 py-1 font-semibold uppercase tracking-wider text-honey">
                        {event.type_label}
                    </span>
                    <span className="rounded-full bg-cocoa/8 px-2.5 py-1 font-semibold uppercase tracking-wider text-cocoa/55">
                        {event.access_mode_label}
                    </span>
                </div>
                <p className="mt-3 text-sm text-cocoa/60">
                    {formatDate(event.starts_at_iso, event.starts_at)} · {event.place}
                </p>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <AdminStatCard icon={Users} label="Inscrits" value={event.registrations_count} accent="honey" />
                <AdminStatCard
                    icon={Users}
                    label="Capacité"
                    value={event.capacity ?? '∞'}
                    accent="cocoa"
                />
            </div>

            <div className="overflow-hidden rounded-2xl border border-cocoa/[0.07] bg-white/90 shadow-sm">
                {registrations.length === 0 ? (
                    <div className="p-14 text-center">
                        <Users className="mx-auto text-cocoa/25" size={28} />
                        <p className="mt-3 text-cocoa/55">Aucune inscription pour cet événement</p>
                    </div>
                ) : (
                    <div className="divide-y divide-cocoa/8">
                        {registrations.map((reg) => (
                            <div
                                key={reg.id}
                                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium text-cocoa">{reg.name}</p>
                                        {reg.user_id && (
                                            <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald">
                                                Compte
                                            </span>
                                        )}
                                    </div>
                                    <a
                                        href={`mailto:${reg.email}`}
                                        className="mt-1 inline-flex items-center gap-1.5 text-sm text-cocoa/55 hover:text-emerald"
                                    >
                                        <Mail size={13} />
                                        {reg.email}
                                    </a>
                                    {reg.phone && (
                                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-cocoa/45">
                                            <Phone size={13} />
                                            {reg.phone}
                                        </p>
                                    )}
                                    {reg.notes && <p className="mt-2 text-sm text-cocoa/60">{reg.notes}</p>}
                                    {reg.created_at && (
                                        <p className="mt-1 text-xs text-cocoa/35">
                                            Inscrit le {formatDate(reg.created_at, reg.created_at)}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setToDelete(reg)}
                                    className="rounded-xl border border-cocoa/10 p-2.5 text-cocoa/45 transition hover:border-terracotta/30 hover:bg-terracotta/5 hover:text-terracotta"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                        <motion.form
                            initial={{ opacity: 0, y: 16, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.96 }}
                            onSubmit={submit}
                            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="mb-5 flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-cocoa">Ajouter un inscrit</h3>
                                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-cocoa/40 hover:bg-sand">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <input
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nom"
                                    className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 outline-none focus:border-honey"
                                />
                                <input
                                    required
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="E-mail"
                                    className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 outline-none focus:border-honey"
                                />
                                <input
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Téléphone (optionnel)"
                                    className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 outline-none focus:border-honey"
                                />
                                <textarea
                                    rows={2}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Notes (optionnel)"
                                    className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 outline-none focus:border-honey"
                                />
                                {(errors.name || errors.email) && (
                                    <p className="text-sm text-terracotta">{errors.name || errors.email}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-5 w-full rounded-xl bg-cocoa py-3 text-sm font-medium text-sand hover:bg-honey hover:text-cocoa disabled:opacity-60"
                            >
                                {processing ? 'Ajout…' : 'Ajouter'}
                            </button>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={() => setToDelete(null)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10">
                                <AlertTriangle className="text-terracotta" size={28} />
                            </div>
                            <h3 className="text-lg font-semibold text-cocoa">Supprimer l’inscription ?</h3>
                            <p className="mt-2 text-sm text-cocoa/60">
                                {toDelete.name} ({toDelete.email}) sera retiré·e de la liste.
                            </p>
                            <div className="mt-5 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setToDelete(null)}
                                    className="flex-1 rounded-xl border border-cocoa/15 py-3 text-sm font-medium text-cocoa"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="flex-1 rounded-xl bg-terracotta py-3 text-sm font-medium text-sand disabled:opacity-60"
                                >
                                    {deleting ? 'Suppression…' : 'Supprimer'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminShell>
    );
}
