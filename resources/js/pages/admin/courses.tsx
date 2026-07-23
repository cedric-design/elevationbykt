import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    X,
    Upload,
    Pencil,
    AlertTriangle,
    Calendar,
    GripVertical,
    ExternalLink,
    Image as ImageIcon,
} from 'lucide-react';
import { AdminShell, AdminStatCard } from '@/components/admin/admin-shell';

interface CourseModule {
    id?: number;
    title: string;
    description: string;
    sort_order: number;
}

interface Course {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    skool_course_id: string | null;
    skool_invite_link: string | null;
    availability_type: 'indefinite' | 'period';
    starts_at: string | null;
    ends_at: string | null;
    is_published: boolean;
    sort_order: number;
    is_currently_available: boolean;
    accesses_count: number;
    modules: CourseModule[];
    created_at: string | null;
}

interface PageProps {
    courses: Course[];
    auth: { user: { name: string; email: string; role: string } };
    [key: string]: unknown;
}

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
                            {loading ? 'Suppression...' : confirmText}
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
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {children}
            </div>
        </div>
    );
}

function CourseForm({ editing, onClose }: { editing: Course | null; onClose: () => void }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(editing?.cover_image || null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const { data, setData, post, patch, processing, errors, transform } = useForm({
        title: editing?.title || '',
        description: editing?.description || '',
        cover_image: editing?.cover_image || '',
        skool_course_id: editing?.skool_course_id || '',
        skool_invite_link: editing?.skool_invite_link || '',
        availability_type: editing?.availability_type || ('indefinite' as 'indefinite' | 'period'),
        starts_at: editing?.starts_at || '',
        ends_at: editing?.ends_at || '',
        is_published: editing?.is_published ?? true,
        sort_order: editing?.sort_order ?? 0,
        modules: (editing?.modules || []).map((m, i) => ({
            title: m.title,
            description: m.description || '',
            sort_order: m.sort_order ?? i,
        })),
    });

    const isEditing = editing !== null;

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setUploadError(null);

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

            if (res.ok) {
                const json = await res.json();
                setPreview(json.url);
                setData('cover_image', json.url);
            } else {
                const err = await res.json();
                setUploadError(err.message || "Erreur lors de l'upload de l'image");
            }
        } catch {
            setUploadError('Erreur de connexion');
        } finally {
            setUploadingImage(false);
        }
    };

    const addModule = () => {
        setData('modules', [
            ...data.modules,
            { title: '', description: '', sort_order: data.modules.length },
        ]);
    };

    const updateModule = (index: number, field: 'title' | 'description', value: string) => {
        const modules = data.modules.map((m, i) => (i === index ? { ...m, [field]: value } : m));
        setData('modules', modules);
    };

    const removeModule = (index: number) => {
        setData(
            'modules',
            data.modules
                .filter((_, i) => i !== index)
                .map((m, i) => ({ ...m, sort_order: i })),
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        transform((current) => ({
            ...current,
            starts_at: current.availability_type === 'period' ? current.starts_at || null : null,
            ends_at: current.availability_type === 'period' ? current.ends_at || null : null,
            modules: current.modules
                .filter((m) => m.title.trim() !== '')
                .map((m, i) => ({ ...m, sort_order: i })),
        }));

        const options = {
            preserveScroll: true,
            onSuccess: () => onClose(),
        };

        if (isEditing) {
            patch(`/admin/cours/${editing.id}`, options);
        } else {
            post('/admin/cours', options);
        }
    };

    return (
        <form onSubmit={submit}>
            <div className="flex items-center justify-between border-b border-cocoa/10 px-6 py-4">
                <h2 className="text-lg font-semibold text-cocoa">
                    {isEditing ? 'Modifier le cours' : 'Nouveau cours'}
                </h2>
                <button type="button" onClick={onClose} className="rounded-lg p-2 text-cocoa/50 hover:bg-cocoa/5 hover:text-cocoa">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-6 p-6">
                {uploadError && (
                    <div className="rounded-xl bg-terracotta/10 p-3 text-sm text-terracotta">{uploadError}</div>
                )}

                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Image de couverture</label>
                    <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} className="hidden" />
                    <div
                        onClick={() => !uploadingImage && fileRef.current?.click()}
                        className={`group relative flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-cocoa/20 bg-sand/50 transition hover:border-emerald hover:bg-emerald/5 ${uploadingImage ? 'pointer-events-none opacity-60' : ''}`}
                    >
                        {uploadingImage ? (
                            <div className="text-center">
                                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
                                <p className="mt-2 text-sm text-cocoa/50">Chargement...</p>
                            </div>
                        ) : preview ? (
                            <>
                                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-cocoa/50 opacity-0 transition group-hover:opacity-100">
                                    <span className="text-sm font-medium text-sand">Changer l'image</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <Upload size={32} className="mx-auto text-cocoa/30" />
                                <p className="mt-2 text-sm text-cocoa/50">Cliquez pour ajouter une image</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Titre *</label>
                    <input
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Ex. Programme Leadership"
                        className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                    />
                    {errors.title && <p className="mt-1 text-xs text-terracotta">{errors.title}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        placeholder="Décrivez ce cours..."
                        className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                    />
                </div>

                <div className="rounded-xl border border-honey/30 bg-honey/5 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <ExternalLink size={16} className="text-honey" />
                        <span className="text-sm font-medium text-cocoa">Intégration Skool</span>
                    </div>
                    <div className="space-y-3">
                        <input
                            value={data.skool_invite_link}
                            onChange={(e) => setData('skool_invite_link', e.target.value)}
                            placeholder="Lien d'accès privé Skool (https://www.skool.com/...)"
                            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 text-sm text-cocoa outline-none transition focus:border-honey"
                        />
                        <p className="text-xs text-cocoa/45">
                            Ce lien sera envoyé par email au membre qui clique sur « Accéder au cours ».
                        </p>                        <input
                            value={data.skool_course_id}
                            onChange={(e) => setData('skool_course_id', e.target.value)}
                            placeholder="ID du cours Skool"
                            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 text-sm text-cocoa outline-none transition focus:border-honey"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Disponibilité</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setData('availability_type', 'indefinite')}
                            className={`rounded-xl border-2 p-4 text-center transition ${
                                data.availability_type === 'indefinite'
                                    ? 'border-emerald bg-emerald/5 text-emerald'
                                    : 'border-cocoa/15 text-cocoa/60 hover:border-cocoa/30'
                            }`}
                        >
                            <div className="font-semibold">Indéfinie</div>
                            <div className="mt-1 text-xs opacity-70">Toujours accessible</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setData('availability_type', 'period')}
                            className={`rounded-xl border-2 p-4 text-center transition ${
                                data.availability_type === 'period'
                                    ? 'border-honey bg-honey/5 text-honey'
                                    : 'border-cocoa/15 text-cocoa/60 hover:border-cocoa/30'
                            }`}
                        >
                            <div className="font-semibold">Période</div>
                            <div className="mt-1 text-xs opacity-70">Dates de début / fin</div>
                        </button>
                    </div>
                    {data.availability_type === 'period' && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-cocoa/70">
                                    <Calendar size={14} />
                                    Début *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={data.starts_at}
                                    onChange={(e) => setData('starts_at', e.target.value)}
                                    className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald"
                                />
                                {errors.starts_at && <p className="mt-1 text-xs text-terracotta">{errors.starts_at}</p>}
                            </div>
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-cocoa/70">
                                    <Calendar size={14} />
                                    Fin
                                </label>
                                <input
                                    type="date"
                                    value={data.ends_at}
                                    onChange={(e) => setData('ends_at', e.target.value)}
                                    className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald"
                                />
                                {errors.ends_at && <p className="mt-1 text-xs text-terracotta">{errors.ends_at}</p>}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <label className="text-sm font-medium text-cocoa">Modules</label>
                        <button
                            type="button"
                            onClick={addModule}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald/10 px-3 py-1.5 text-xs font-medium text-emerald transition hover:bg-emerald/20"
                        >
                            <Plus size={14} />
                            Ajouter
                        </button>
                    </div>
                    {data.modules.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-cocoa/15 bg-sand/30 px-4 py-6 text-center text-sm text-cocoa/45">
                            Aucun module — ajoutez les chapitres du cours
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {data.modules.map((mod, index) => (
                                <div key={index} className="rounded-xl border border-cocoa/10 bg-sand/20 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <GripVertical size={16} className="text-cocoa/30" />
                                        <span className="text-xs font-medium text-cocoa/40">Module {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeModule(index)}
                                            className="ml-auto rounded-lg p-1.5 text-cocoa/40 transition hover:bg-terracotta/10 hover:text-terracotta"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <input
                                        value={mod.title}
                                        onChange={(e) => updateModule(index, 'title', e.target.value)}
                                        placeholder="Titre du module"
                                        className="mb-2 w-full rounded-lg border border-cocoa/15 bg-white px-3 py-2 text-sm text-cocoa outline-none focus:border-emerald"
                                    />
                                    <textarea
                                        value={mod.description}
                                        onChange={(e) => updateModule(index, 'description', e.target.value)}
                                        rows={2}
                                        placeholder="Description (optionnel)"
                                        className="w-full rounded-lg border border-cocoa/15 bg-white px-3 py-2 text-sm text-cocoa outline-none focus:border-emerald"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.modules && <p className="mt-1 text-xs text-terracotta">{String(errors.modules)}</p>}
                </div>

                <label className="flex items-center gap-2 text-sm text-cocoa">
                    <input
                        type="checkbox"
                        checked={data.is_published}
                        onChange={(e) => setData('is_published', e.target.checked)}
                        className="h-4 w-4 rounded border-cocoa/30 accent-emerald"
                    />
                    Publier immédiatement
                </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-cocoa/10 px-6 py-4">
                <button type="button" onClick={onClose} className="rounded-xl border border-cocoa/15 px-5 py-2.5 text-sm font-medium text-cocoa transition hover:bg-cocoa/5">
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-emerald px-5 py-2.5 text-sm font-medium text-sand shadow-sm transition hover:bg-cocoa disabled:opacity-60"
                >
                    {processing ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer le cours'}
                </button>
            </div>
        </form>
    );
}

function CoursesTable({ courses, onEdit }: { courses: Course[]; onEdit: (c: Course) => void }) {
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
    const [deleting, setDeleting] = useState(false);

    const toggle = (id: number) => {
        setPendingId(id);
        router.patch(`/admin/cours/${id}/toggle`, {}, { preserveScroll: true, onFinish: () => setPendingId(null) });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/cours/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    if (courses.length === 0) {
        return (
            <div className="rounded-2xl border border-cocoa/10 bg-white p-16 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-cocoa/5">
                    <BookOpen size={24} className="text-cocoa/30" />
                </div>
                <p className="text-cocoa/60">Aucun cours pour le moment</p>
                <p className="mt-1 text-sm text-cocoa/40">Cliquez sur « Ajouter un cours » pour commencer</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-cocoa/10 bg-white">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-cocoa/10 bg-sand/30">
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Cours</th>
                            <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50 md:table-cell">Modules</th>
                            <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50 sm:table-cell">Disponibilité</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Statut</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-cocoa/50">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-cocoa/5">
                        {courses.map((c) => (
                            <tr key={c.id} className="transition hover:bg-sand/30">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-cocoa/10">
                                            {c.cover_image ? (
                                                <img src={c.cover_image} alt={c.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon size={16} className="text-cocoa/30" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate font-medium text-cocoa">{c.title}</div>
                                            <div className="truncate text-xs text-cocoa/40">
                                                {c.accesses_count} accès
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden px-6 py-4 md:table-cell">
                                    <span className="text-sm text-cocoa/70">{c.modules.length}</span>
                                </td>
                                <td className="hidden px-6 py-4 sm:table-cell">
                                    {c.availability_type === 'indefinite' ? (
                                        <span className="rounded-full bg-emerald/10 px-2.5 py-1 text-xs font-medium text-emerald">
                                            Indéfinie
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-honey/15 px-2.5 py-1 text-xs font-medium text-honey">
                                            {c.starts_at}
                                            {c.ends_at ? ` → ${c.ends_at}` : ''}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                            c.is_published
                                                ? 'bg-emerald/10 text-emerald'
                                                : 'bg-cocoa/8 text-cocoa/50'
                                        }`}
                                    >
                                        {c.is_published ? 'Publié' : 'Brouillon'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => onEdit(c)}
                                            className="rounded-lg p-2 text-cocoa/50 transition hover:bg-cocoa/5 hover:text-cocoa"
                                            title="Modifier"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => toggle(c.id)}
                                            disabled={pendingId === c.id}
                                            className="rounded-lg p-2 text-cocoa/50 transition hover:bg-cocoa/5 hover:text-cocoa disabled:opacity-50"
                                            title={c.is_published ? 'Dépublier' : 'Publier'}
                                        >
                                            {c.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(c)}
                                            className="rounded-lg p-2 text-cocoa/50 transition hover:bg-terracotta/10 hover:text-terracotta"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title="Supprimer ce cours ?"
                message={`« ${deleteTarget?.title} » sera définitivement supprimé, ainsi que ses modules et accès.`}
                loading={deleting}
            />
        </>
    );
}

export default function CoursesPage() {
    const { courses, auth } = usePage<PageProps>().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Course | null>(null);

    const openCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (course: Course) => {
        setEditing(course);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
    };

    const published = courses.filter((c) => c.is_published).length;
    const available = courses.filter((c) => c.is_currently_available).length;
    const modulesTotal = courses.reduce((sum, c) => sum + c.modules.length, 0);

    return (
        <AdminShell
            current="/admin/cours"
            title="Cours"
            subtitle="Gérez les cours Skool et leur disponibilité"
            user={auth.user}
            actions={
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-emerald px-4 py-2.5 text-sm font-medium text-sand shadow-sm transition hover:bg-cocoa"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Ajouter un cours</span>
                </button>
            }
        >
            <Head title="Cours — Admin" />

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AdminStatCard label="Total" value={courses.length} icon={BookOpen} accent="emerald" />
                <AdminStatCard label="Publiés" value={published} icon={Eye} accent="honey" />
                <AdminStatCard label="Disponibles" value={available} icon={Calendar} accent="terracotta" />
                <AdminStatCard label="Modules" value={modulesTotal} icon={GripVertical} accent="cocoa" />
            </div>

            <CoursesTable courses={courses} onEdit={openEdit} />

            <Modal open={modalOpen} onClose={closeModal}>
                <CourseForm key={editing?.id ?? 'new'} editing={editing} onClose={closeModal} />
            </Modal>
        </AdminShell>
    );
}
