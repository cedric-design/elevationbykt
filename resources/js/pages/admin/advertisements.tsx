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
    Image as ImageIcon,
    Link2,
} from 'lucide-react';
import { AdminShell, AdminEmpty, AdminStatCard } from '@/components/admin/admin-shell';

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
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 rounded-xl border border-cocoa/15 py-3 text-sm font-medium text-cocoa transition hover:bg-white disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
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
    auth: { user: { name: string; email: string; role?: string } };
    [key: string]: unknown;
}

function Field({
    label,
    hint,
    error,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-cocoa/75">{label}</span>
            {children}
            {hint && !error && <p className="mt-1.5 text-xs text-cocoa/45">{hint}</p>}
            {error && <p className="mt-1.5 text-xs text-terracotta">{error}</p>}
        </label>
    );
}

function AdvertisementForm({ editing, onClose }: { editing?: Advertisement | null; onClose: () => void }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(editing?.image || null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [dragOver, setDragOver] = useState(false);

    const { data, setData, post, patch, processing, errors } = useForm({
        title: editing?.title || '',
        image: editing?.image || '',
        link: editing?.link || '',
        starts_at: editing?.starts_at?.split('T')[0] || '',
        ends_at: editing?.ends_at?.split('T')[0] || '',
        is_active: editing?.is_active ?? true,
    });

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setUploadError('Choisis une image (JPG, PNG, WEBP…).');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("L'image ne doit pas dépasser 5 Mo.");
            return;
        }

        setUploading(true);
        setUploadError('');
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
            const json = await res.json().catch(() => ({}));
            if (res.ok && json.url) {
                setPreview(json.url);
                setData('image', json.url);
            } else {
                setUploadError(json.message || "Échec de l'upload.");
            }
        } catch {
            setUploadError('Erreur de connexion pendant l’upload.');
        } finally {
            setUploading(false);
        }
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) void uploadFile(file);
        e.target.value = '';
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!data.image) {
            setUploadError('Ajoute une image pour la publicité.');
            return;
        }

        const options = {
            preserveScroll: true,
            onSuccess: () => onClose(),
        };

        if (editing) {
            patch(`/admin/publicites/${editing.id}`, options);
        } else {
            post('/admin/publicites', options);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
        >
            <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                className="relative my-6 w-full max-w-3xl overflow-hidden rounded-[1.75rem] bg-white shadow-2xl"
            >
                <div className="flex items-start justify-between border-b border-cocoa/10 bg-sand/40 px-6 py-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-honey">Publicité</p>
                        <h2 className="ivoire-serif mt-1 text-2xl text-cocoa">
                            {editing ? 'Modifier la campagne' : 'Nouvelle campagne'}
                        </h2>
                        <p className="mt-1 text-sm text-cocoa/55">Popup affiché aux visiteurs du site</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-cocoa/40 transition hover:bg-white hover:text-cocoa"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={submit} className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-5 border-b border-cocoa/10 p-6 lg:border-b-0 lg:border-r">
                        <Field label="Titre de la campagne" error={errors.title}>
                            <input
                                required
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Ex. Masterclass de mars"
                                className="w-full rounded-xl border border-cocoa/15 bg-sand/30 px-4 py-3 text-cocoa outline-none transition placeholder:text-cocoa/35 focus:border-honey focus:bg-white"
                            />
                        </Field>

                        <div>
                            <span className="mb-1.5 block text-sm font-medium text-cocoa/75">Image *</span>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOver(false);
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) void uploadFile(file);
                                }}
                                onClick={() => !uploading && fileRef.current?.click()}
                                className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
                                    dragOver
                                        ? 'border-honey bg-honey/10'
                                        : preview
                                          ? 'border-cocoa/10'
                                          : 'border-cocoa/20 bg-sand/40 hover:border-honey hover:bg-honey/5'
                                } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
                            >
                                {uploading ? (
                                    <div className="text-center">
                                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-honey border-t-transparent" />
                                        <p className="mt-3 text-sm text-cocoa/50">Upload en cours…</p>
                                    </div>
                                ) : preview ? (
                                    <>
                                        <img src={preview} alt="Aperçu" className="absolute inset-0 h-full w-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-cocoa/55 opacity-0 transition hover:opacity-100">
                                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-cocoa">
                                                <Upload size={15} />
                                                Changer l’image
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-6 text-center">
                                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-cocoa/40 shadow-sm">
                                            <ImageIcon size={22} />
                                        </div>
                                        <p className="mt-3 text-sm font-medium text-cocoa">Glisse une image ici</p>
                                        <p className="mt-1 text-xs text-cocoa/45">ou clique pour parcourir · JPG, PNG, WEBP · max 5 Mo</p>
                                    </div>
                                )}
                            </div>
                            {(uploadError || errors.image) && (
                                <p className="mt-1.5 text-xs text-terracotta">{uploadError || errors.image}</p>
                            )}
                            {preview && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreview(null);
                                        setData('image', '');
                                    }}
                                    className="mt-2 text-xs font-medium text-cocoa/45 transition hover:text-terracotta"
                                >
                                    Retirer l’image
                                </button>
                            )}
                        </div>

                        <Field
                            label="Lien de destination"
                            hint="Optionnel — ouvre cette URL quand on clique sur la pub"
                            error={errors.link}
                        >
                            <div className="relative">
                                <Link2 size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/35" />
                                <input
                                    type="url"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                    placeholder="https://…"
                                    className="w-full rounded-xl border border-cocoa/15 bg-sand/30 py-3 pl-10 pr-4 text-cocoa outline-none transition placeholder:text-cocoa/35 focus:border-honey focus:bg-white"
                                />
                            </div>
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Début" error={errors.starts_at}>
                                <div className="relative">
                                    <Calendar size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/35" />
                                    <input
                                        type="date"
                                        value={data.starts_at}
                                        onChange={(e) => setData('starts_at', e.target.value)}
                                        className="w-full rounded-xl border border-cocoa/15 bg-sand/30 py-3 pl-10 pr-3 text-cocoa outline-none focus:border-honey focus:bg-white"
                                    />
                                </div>
                            </Field>
                            <Field label="Fin" error={errors.ends_at}>
                                <div className="relative">
                                    <Calendar size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/35" />
                                    <input
                                        type="date"
                                        value={data.ends_at}
                                        onChange={(e) => setData('ends_at', e.target.value)}
                                        className="w-full rounded-xl border border-cocoa/15 bg-sand/30 py-3 pl-10 pr-3 text-cocoa outline-none focus:border-honey focus:bg-white"
                                    />
                                </div>
                            </Field>
                        </div>
                        <p className="text-xs text-cocoa/45">Laisse les dates vides pour une diffusion sans limite.</p>

                        <label className="flex items-center gap-3 rounded-xl border border-cocoa/10 bg-sand/30 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-cocoa/30 text-honey"
                            />
                            <span className="text-sm text-cocoa">Activer dès maintenant</span>
                        </label>
                    </div>

                    <div className="flex flex-col bg-sand/25 p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa/40">Aperçu popup</p>
                        <div className="mt-4 flex flex-1 items-center justify-center">
                            <div className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-cocoa/10 bg-white shadow-xl shadow-cocoa/10">
                                <div className="relative aspect-[4/5] bg-cocoa/5">
                                    {preview ? (
                                        <img src={preview} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center text-cocoa/25">
                                            <Megaphone size={28} />
                                            <p className="mt-2 text-xs">Image à venir</p>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-cocoa/70 text-sand"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <p className="truncate text-sm font-semibold text-cocoa">
                                        {data.title || 'Titre de la campagne'}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-cocoa/45">
                                        {data.link || 'Sans lien'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-full border border-cocoa/15 py-3 text-sm font-medium text-cocoa transition hover:bg-white"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing || uploading}
                                className="flex-1 rounded-full bg-cocoa py-3 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa disabled:opacity-50"
                            >
                                {processing ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Créer'}
                            </button>
                        </div>
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
                className="group overflow-hidden rounded-[1.5rem] border border-cocoa/[0.08] bg-white/90 shadow-sm transition hover:shadow-lg hover:shadow-cocoa/10"
            >
                <div className="relative aspect-video">
                    <img src={ad.image} alt={ad.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-cocoa/50 via-transparent to-transparent opacity-80" />
                    <span
                        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            ad.is_active ? 'bg-honey text-cocoa' : 'bg-cocoa/80 text-sand'
                        }`}
                    >
                        {ad.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div className="p-5">
                    <h3 className="font-semibold text-cocoa">{ad.title}</h3>
                    {ad.link && (
                        <a
                            href={ad.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1 text-xs text-cocoa/50 transition hover:text-honey"
                        >
                            <ExternalLink size={12} />
                            Voir le lien
                        </a>
                    )}
                    {(ad.starts_at || ad.ends_at) && (
                        <p className="mt-2 text-xs text-cocoa/45">
                            {ad.starts_at && `Du ${new Date(ad.starts_at).toLocaleDateString('fr-FR')}`}
                            {ad.ends_at && ` au ${new Date(ad.ends_at).toLocaleDateString('fr-FR')}`}
                        </p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-cocoa/8 pt-4">
                        <button
                            type="button"
                            onClick={toggle}
                            disabled={toggling}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                ad.is_active
                                    ? 'bg-cocoa/8 text-cocoa/60 hover:bg-cocoa/12'
                                    : 'bg-honey/15 text-honey hover:bg-honey/25'
                            }`}
                        >
                            {ad.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                            {ad.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        <div className="flex gap-1.5">
                            <button
                                type="button"
                                onClick={onEdit}
                                className="rounded-xl border border-cocoa/10 p-2 text-cocoa/45 transition hover:border-cocoa/20 hover:bg-sand hover:text-cocoa"
                            >
                                <Pencil size={15} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(true)}
                                className="rounded-xl border border-cocoa/10 p-2 text-cocoa/45 transition hover:border-terracotta/30 hover:bg-terracotta/5 hover:text-terracotta"
                            >
                                <Trash2 size={15} />
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

    const activeCount = advertisements.filter((a) => a.is_active).length;

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
                subtitle="Popups promotionnels sur le site"
                user={auth.user}
                actions={
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(null);
                            setShowForm(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-cocoa px-5 py-2.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa"
                    >
                        <Plus size={16} />
                        Nouvelle publicité
                    </button>
                }
            >
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <AdminStatCard icon={Megaphone} label="Campagnes" value={advertisements.length} accent="cocoa" />
                    <AdminStatCard icon={Eye} label="Actives" value={activeCount} accent="honey" />
                </div>

                {advertisements.length === 0 ? (
                    <AdminEmpty
                        icon={Megaphone}
                        title="Aucune publicité créée"
                        description="Crée une campagne popup pour mettre en avant un événement ou une offre."
                        action={
                            <button
                                type="button"
                                onClick={() => setShowForm(true)}
                                className="text-sm font-medium text-honey transition hover:text-cocoa"
                            >
                                + Créer votre première publicité
                            </button>
                        }
                    />
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
