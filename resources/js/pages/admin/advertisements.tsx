import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Eye,
    EyeOff,
    X,
    Upload,
    Pencil,
    ExternalLink,
    AlertTriangle,
    Calendar,
    Megaphone,
} from 'lucide-react';
import { AdminShell, AdminEmpty } from '@/components/admin/admin-shell';

function ConfirmModal({ 
    open, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText = 'Supprimer',
    loading = false,
}: { 
    open: boolean; 
    onClose: () => void; 
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
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
                            {loading ? 'Suppression...' : confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

interface Advertisement {
    id: number;
    title: string;
    image: string;
    link: string | null;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
}

interface PageProps {
    advertisements: Advertisement[];
    auth: { user: { name: string; email: string } };
    [key: string]: unknown;
}

function AdvertisementForm({ editing, onClose }: { editing?: Advertisement | null; onClose: () => void }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(editing?.image || null);
    const [uploading, setUploading] = useState(false);

    const form = useForm({
        title: editing?.title || '',
        image: editing?.image || '',
        link: editing?.link || '',
        starts_at: editing?.starts_at?.split('T')[0] || '',
        ends_at: editing?.ends_at?.split('T')[0] || '',
    });

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('/admin/upload/image', {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                },
                credentials: 'same-origin',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setPreview(data.url);
                form.setData('image', data.url);
            }
        } catch {
            console.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editing) {
            form.patch(`/admin/publicites/${editing.id}`, {
                preserveScroll: true,
                onSuccess: () => onClose(),
            });
        } else {
            form.post('/admin/publicites', {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    form.reset();
                },
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
        >
            <div className="absolute inset-0 bg-cocoa/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                className="relative w-full max-w-lg rounded-3xl bg-sand shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-cocoa/10 px-6 py-4">
                    <h2 className="text-xl font-semibold text-cocoa">
                        {editing ? 'Modifier la publicité' : 'Nouvelle publicité'}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-2 text-cocoa/50 hover:bg-cocoa/10 hover:text-cocoa">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={submit} className="space-y-5 p-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-cocoa/70">Titre</label>
                        <input
                            required
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            placeholder="Nom de la campagne"
                            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-cocoa/70">Image</label>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                        {preview ? (
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-cocoa/15">
                                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreview(null);
                                        form.setData('image', '');
                                    }}
                                    className="absolute right-2 top-2 rounded-full bg-cocoa/80 p-1.5 text-sand hover:bg-cocoa"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-cocoa/20 bg-white/50 text-cocoa/50 transition hover:border-emerald hover:text-emerald"
                            >
                                {uploading ? (
                                    <span className="text-sm">Chargement...</span>
                                ) : (
                                    <>
                                        <Upload size={32} className="mb-2" />
                                        <span className="text-sm">Cliquer pour ajouter une image</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-cocoa/70">Lien (optionnel)</label>
                        <input
                            type="url"
                            value={form.data.link}
                            onChange={(e) => form.setData('link', e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-cocoa/70">
                                <Calendar size={14} />
                                Date de début
                            </label>
                            <input
                                type="date"
                                value={form.data.starts_at}
                                onChange={(e) => form.setData('starts_at', e.target.value)}
                                className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald"
                            />
                        </div>
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-cocoa/70">
                                <Calendar size={14} />
                                Date de fin
                            </label>
                            <input
                                type="date"
                                value={form.data.ends_at}
                                onChange={(e) => form.setData('ends_at', e.target.value)}
                                className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald"
                            />
                        </div>
                    </div>

                    <p className="rounded-xl bg-emerald/10 p-3 text-sm text-emerald">
                        💡 Laissez les dates vides pour une publicité sans limite de temps.
                    </p>

                    <div className="flex justify-end gap-3 border-t border-cocoa/10 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-cocoa/15 px-5 py-2.5 text-sm font-medium text-cocoa transition hover:bg-white"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing || !form.data.image}
                            className="flex items-center gap-2 rounded-xl bg-emerald px-5 py-2.5 text-sm font-medium text-sand transition hover:bg-emerald/90 disabled:opacity-50"
                        >
                            {form.processing ? 'Enregistrement...' : editing ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

function AdvertisementCard({ ad, onEdit }: { ad: Advertisement; onEdit: () => void }) {
    const [deleteTarget, setDeleteTarget] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [toggling, setToggling] = useState(false);

    const toggle = () => {
        setToggling(true);
        router.patch(`/admin/publicites/${ad.id}/toggle`, {}, {
            preserveScroll: true,
            onFinish: () => setToggling(false),
        });
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(`/admin/publicites/${ad.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(false);
            },
        });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group overflow-hidden rounded-2xl border border-cocoa/10 bg-white shadow-sm transition hover:shadow-md"
            >
                <div className="relative aspect-video">
                    <img src={ad.image} alt={ad.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <div className="absolute right-3 top-3 flex gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                            ad.is_active ? 'bg-emerald text-sand' : 'bg-cocoa/80 text-sand'
                        }`}>
                            {ad.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-cocoa">{ad.title}</h3>
                    {ad.link && (
                        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-xs text-emerald hover:underline">
                            <ExternalLink size={12} />
                            Voir le lien
                        </a>
                    )}
                    {(ad.starts_at || ad.ends_at) && (
                        <p className="mt-2 text-xs text-cocoa/50">
                            {ad.starts_at && `Du ${new Date(ad.starts_at).toLocaleDateString('fr-FR')}`}
                            {ad.ends_at && ` au ${new Date(ad.ends_at).toLocaleDateString('fr-FR')}`}
                        </p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-cocoa/10 pt-4">
                        <button
                            onClick={toggle}
                            disabled={toggling}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                ad.is_active
                                    ? 'bg-honey/10 text-honey hover:bg-honey/20'
                                    : 'bg-emerald/10 text-emerald hover:bg-emerald/20'
                            }`}
                        >
                            {ad.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                            {ad.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={onEdit}
                                className="rounded-lg p-2 text-cocoa/40 transition hover:bg-cocoa/10 hover:text-cocoa"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => setDeleteTarget(true)}
                                className="rounded-lg p-2 text-cocoa/40 transition hover:bg-terracotta/10 hover:text-terracotta"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <ConfirmModal
                open={deleteTarget}
                onClose={() => setDeleteTarget(false)}
                onConfirm={confirmDelete}
                title="Supprimer cette publicité ?"
                message="Cette action est irréversible."
                loading={deleting}
            />
        </>
    );
}

export default function AdvertisementsPage() {
    const { advertisements, auth } = usePage<PageProps>().props;
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Advertisement | null>(null);

    const openEdit = (ad: Advertisement) => {
        setEditing(ad);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
    };

    return (
        <>
            <Head title="Publicité — Admin" />
            <AdminShell
                current="/admin/publicites"
                title="Publicité"
                subtitle="Gérer les popups promotionnels"
                user={auth.user}
                actions={
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-medium text-sand shadow-lg shadow-emerald/25 transition hover:bg-cocoa"
                    >
                        <Plus size={18} />
                        Nouvelle publicité
                    </button>
                }
            >
                <p className="mb-6 text-sm text-cocoa/60">
                    {advertisements.filter((a) => a.is_active).length} publicité(s) active(s)
                </p>

                {advertisements.length === 0 ? (
                    <AdminEmpty
                        icon={Megaphone}
                        title="Aucune publicité créée"
                        action={
                            <button
                                onClick={() => setShowForm(true)}
                                className="text-sm font-medium text-emerald transition hover:text-cocoa"
                            >
                                + Créer votre première publicité
                            </button>
                        }
                    />
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {advertisements.map((ad) => (
                            <AdvertisementCard key={ad.id} ad={ad} onEdit={() => openEdit(ad)} />
                        ))}
                    </div>
                )}
            </AdminShell>

            <AnimatePresence>
                {showForm && <AdvertisementForm editing={editing} onClose={closeForm} />}
            </AnimatePresence>
        </>
    );
}
