import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import {
    LayoutDashboard,
    MessageSquareQuote,
    Video,
    Users,
    Settings,
    LogOut,
    Bell,
    ChevronRight,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    X,
    Upload,
    Image as ImageIcon,
    Pencil,
    ExternalLink,
} from 'lucide-react';
import ElevationLogo from '@/components/ivoire/elevation-logo';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Content {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    video_url: string | null;
    type: 'free' | 'paid';
    price: number;
    currency: string;
    category_id: number | null;
    category: Category | null;
    skool_link: string | null;
    skool_course_id: string | null;
    is_published: boolean;
    is_featured: boolean;
    created_at: string;
}

interface PageProps {
    contents: Content[];
    categories: Category[];
    auth: { user: { name: string; email: string; role: string } };
    [key: string]: unknown;
}

const NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/espace' },
    { icon: Video, label: 'Contenus', href: '/admin/contenus', active: true },
    { icon: MessageSquareQuote, label: 'Témoignages', href: '/admin/temoignages' },
    { icon: Users, label: 'Équipe', href: '/admin/collaborateurs' },
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
                <button onClick={() => router.post('/logout')} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sand/60 transition hover:bg-terracotta/20 hover:text-terracotta">
                    <LogOut size={18} />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}

function Header({ name, onAdd }: { name: string; onAdd: () => void }) {
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-cocoa/10 bg-white/80 px-6 backdrop-blur-md lg:px-8">
            <div>
                <h1 className="text-xl font-semibold text-cocoa">Contenus & Cours</h1>
                <p className="text-sm text-cocoa/50">Gérez vos vidéos et formations</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 rounded-xl bg-emerald px-4 py-2.5 text-sm font-medium text-sand shadow-sm transition hover:bg-cocoa"
                >
                    <Plus size={16} />
                    Ajouter un contenu
                </button>
                <button className="relative rounded-full border border-cocoa/10 p-2.5 text-cocoa/60 transition hover:bg-cocoa/5 hover:text-cocoa">
                    <Bell size={18} />
                </button>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald to-emerald/70 grid place-items-center text-sand font-semibold">
                    {name.charAt(0)}
                </div>
            </div>
        </header>
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

function ContentForm({ 
    categories, 
    editing, 
    onClose,
    onAddCategory 
}: { 
    categories: Category[]; 
    editing: Content | null; 
    onClose: () => void;
    onAddCategory: () => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(editing?.cover_image || null);
    const [videoPreview, setVideoPreview] = useState<string | null>(editing?.video_url || null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        title: editing?.title || '',
        description: editing?.description || '',
        cover_image: editing?.cover_image || '',
        video_url: editing?.video_url || '',
        type: editing?.type || 'free' as 'free' | 'paid',
        price: editing?.price || 0,
        category_id: editing?.category_id?.toString() || '',
        skool_link: editing?.skool_link || '',
        skool_course_id: editing?.skool_course_id || '',
        is_published: editing?.is_published ?? true,
        is_featured: editing?.is_featured ?? false,
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
                const data = await res.json();
                setPreview(data.url);
                setData('cover_image', data.url);
            } else {
                const err = await res.json();
                setUploadError(err.message || "Erreur lors de l'upload de l'image");
            }
        } catch {
            setUploadError("Erreur de connexion");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setUploadingVideo(true);
        setUploadError(null);
        
        const formData = new FormData();
        formData.append('video', file);
        
        try {
            const res = await fetch('/admin/upload/video', {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                },
                credentials: 'same-origin',
                body: formData,
            });
            
            if (res.ok) {
                const data = await res.json();
                setVideoPreview(data.url);
                setData('video_url', data.url);
            } else {
                const err = await res.json();
                setUploadError(err.message || "Erreur lors de l'upload de la vidéo. Vérifiez la taille (max 100MB).");
            }
        } catch {
            setUploadError("Erreur de connexion");
        } finally {
            setUploadingVideo(false);
        }
    };

    const removeVideo = () => {
        setVideoPreview(null);
        setData('video_url', '');
        if (videoRef.current) videoRef.current.value = '';
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        };
        if (isEditing) {
            patch(`/admin/contenus/${editing.id}`, options);
        } else {
            post('/admin/contenus', options);
        }
    };

    return (
        <form onSubmit={submit}>
            <div className="flex items-center justify-between border-b border-cocoa/10 px-6 py-4">
                <h2 className="text-lg font-semibold text-cocoa">
                    {isEditing ? 'Modifier le contenu' : 'Nouveau contenu'}
                </h2>
                <button type="button" onClick={onClose} className="rounded-lg p-2 text-cocoa/50 hover:bg-cocoa/5 hover:text-cocoa">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-6 p-6">
                {/* Error message */}
                {uploadError && (
                    <div className="rounded-xl bg-terracotta/10 p-3 text-sm text-terracotta">
                        {uploadError}
                    </div>
                )}

                {/* Image */}
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
                                <p className="text-xs text-cocoa/30">PNG, JPG jusqu'à 5MB</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Video - Only for free content */}
                {data.type === 'free' && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-cocoa">Vidéo (contenu gratuit)</label>
                        <input type="file" ref={videoRef} accept="video/*" onChange={handleVideoFile} className="hidden" />
                        {videoPreview ? (
                            <div className="relative overflow-hidden rounded-xl border border-cocoa/15 bg-cocoa/5">
                                <video src={videoPreview} controls className="h-48 w-full object-contain" />
                                <button
                                    type="button"
                                    onClick={removeVideo}
                                    className="absolute right-2 top-2 rounded-lg bg-terracotta p-2 text-sand transition hover:bg-terracotta/80"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => videoRef.current?.click()}
                                className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-cocoa/20 bg-sand/50 transition hover:border-emerald hover:bg-emerald/5"
                            >
                                {uploadingVideo ? (
                                    <div className="text-center">
                                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
                                        <p className="mt-2 text-sm text-cocoa/50">Chargement...</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Video size={24} className="mx-auto text-cocoa/30" />
                                        <p className="mt-2 text-sm text-cocoa/50">Ajouter une vidéo</p>
                                        <p className="text-xs text-cocoa/30">MP4, WebM jusqu'à 100MB</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Titre *</label>
                    <input
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Ex. Masterclass Leadership"
                        className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                    />
                    {errors.title && <p className="mt-1 text-xs text-terracotta">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        placeholder="Décrivez ce contenu..."
                        className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Catégorie</label>
                    <div className="flex gap-2">
                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="flex-1 rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                        >
                            <option value="">Sans catégorie</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={onAddCategory}
                            className="flex items-center justify-center rounded-xl border border-cocoa/15 bg-white px-4 text-cocoa/60 transition hover:border-emerald hover:text-emerald"
                            title="Ajouter une catégorie"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Type */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Type de contenu</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setData('type', 'free')}
                            className={`rounded-xl border-2 p-4 text-center transition ${
                                data.type === 'free'
                                    ? 'border-emerald bg-emerald/5 text-emerald'
                                    : 'border-cocoa/15 text-cocoa/60 hover:border-cocoa/30'
                            }`}
                        >
                            <div className="font-semibold">Gratuit</div>
                            <div className="mt-1 text-xs opacity-70">Accessible à tous</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setData('type', 'paid')}
                            className={`rounded-xl border-2 p-4 text-center transition ${
                                data.type === 'paid'
                                    ? 'border-honey bg-honey/5 text-honey'
                                    : 'border-cocoa/15 text-cocoa/60 hover:border-cocoa/30'
                            }`}
                        >
                            <div className="font-semibold">Payant</div>
                            <div className="mt-1 text-xs opacity-70">Accès premium</div>
                        </button>
                    </div>
                </div>

                {/* Paid options */}
                {data.type === 'paid' && (
                    <div className="space-y-4 rounded-xl border border-honey/30 bg-honey/5 p-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-cocoa">Prix (XOF)</label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', Number(e.target.value))}
                                min={0}
                                placeholder="15000"
                                className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-honey focus:ring-2 focus:ring-honey/20"
                            />
                        </div>
                        <div className="border-t border-honey/20 pt-4">
                            <div className="mb-3 flex items-center gap-2">
                                <ExternalLink size={16} className="text-honey" />
                                <span className="text-sm font-medium text-cocoa">Intégration Skool</span>
                                <span className="rounded-full bg-honey/20 px-2 py-0.5 text-[10px] font-medium text-honey">Optionnel</span>
                            </div>
                            <div className="space-y-3">
                                <input
                                    value={data.skool_link}
                                    onChange={(e) => setData('skool_link', e.target.value)}
                                    placeholder="Lien Skool (https://www.skool.com/...)"
                                    className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 text-sm text-cocoa outline-none transition focus:border-honey"
                                />
                                <input
                                    value={data.skool_course_id}
                                    onChange={(e) => setData('skool_course_id', e.target.value)}
                                    placeholder="ID du cours Skool"
                                    className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 text-sm text-cocoa outline-none transition focus:border-honey"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Options */}
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm text-cocoa">
                        <input
                            type="checkbox"
                            checked={data.is_published}
                            onChange={(e) => setData('is_published', e.target.checked)}
                            className="h-4 w-4 rounded border-cocoa/30 accent-emerald"
                        />
                        Publier immédiatement
                    </label>
                    <label className="flex items-center gap-2 text-sm text-cocoa">
                        <input
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={(e) => setData('is_featured', e.target.checked)}
                            className="h-4 w-4 rounded border-cocoa/30 accent-honey"
                        />
                        Mettre en avant
                    </label>
                </div>
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
                    {processing ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer le contenu'}
                </button>
            </div>
        </form>
    );
}

function CategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { data, setData, post, processing, reset } = useForm({ name: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/categories', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <h3 className="mb-4 text-lg font-semibold text-cocoa">Nouvelle catégorie</h3>
                <form onSubmit={submit}>
                    <input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nom de la catégorie"
                        className="mb-4 w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                        autoFocus
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="rounded-xl border border-cocoa/15 px-4 py-2 text-sm font-medium text-cocoa hover:bg-cocoa/5">
                            Annuler
                        </button>
                        <button type="submit" disabled={processing || !data.name} className="rounded-xl bg-emerald px-4 py-2 text-sm font-medium text-sand hover:bg-cocoa disabled:opacity-50">
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ContentsTable({ contents, onEdit }: { contents: Content[]; onEdit: (c: Content) => void }) {
    const [pendingId, setPendingId] = useState<number | null>(null);

    const toggle = (id: number) => {
        setPendingId(id);
        router.patch(`/admin/contenus/${id}/toggle`, {}, { preserveScroll: true, onFinish: () => setPendingId(null) });
    };

    const remove = (id: number) => {
        if (!confirm('Supprimer ce contenu ?')) return;
        router.delete(`/admin/contenus/${id}`, { preserveScroll: true });
    };

    if (contents.length === 0) {
        return (
            <div className="rounded-2xl border border-cocoa/10 bg-white p-16 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-cocoa/5">
                    <Video size={24} className="text-cocoa/30" />
                </div>
                <p className="text-cocoa/60">Aucun contenu pour le moment</p>
                <p className="mt-1 text-sm text-cocoa/40">Cliquez sur "Ajouter un contenu" pour commencer</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-cocoa/10 bg-white">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-cocoa/10 bg-sand/30">
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Contenu</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Catégorie</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Statut</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-cocoa/50">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-cocoa/5">
                    {contents.map((c) => (
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
                                    <div>
                                        <div className="font-medium text-cocoa">{c.title}</div>
                                        {c.description && <div className="mt-0.5 line-clamp-1 text-xs text-cocoa/50">{c.description}</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-cocoa/70">{c.category?.name || '—'}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                    c.type === 'paid' ? 'bg-honey/10 text-honey' : 'bg-emerald/10 text-emerald'
                                }`}>
                                    {c.type === 'paid' ? `${c.price.toLocaleString()} XOF` : 'Gratuit'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                    c.is_published ? 'bg-emerald/10 text-emerald' : 'bg-cocoa/10 text-cocoa/60'
                                }`}>
                                    {c.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                                    {c.is_published ? 'Publié' : 'Brouillon'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-end gap-1">
                                    <button
                                        onClick={() => onEdit(c)}
                                        title="Modifier"
                                        className="rounded-lg p-2 text-cocoa/50 transition hover:bg-honey/10 hover:text-honey"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => toggle(c.id)}
                                        disabled={pendingId === c.id}
                                        title={c.is_published ? 'Masquer' : 'Publier'}
                                        className="rounded-lg p-2 text-cocoa/50 transition hover:bg-emerald/10 hover:text-emerald disabled:opacity-50"
                                    >
                                        {c.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => remove(c.id)}
                                        title="Supprimer"
                                        className="rounded-lg p-2 text-cocoa/50 transition hover:bg-terracotta/10 hover:text-terracotta"
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
    );
}

export default function AdminContents() {
    const { contents, categories, auth } = usePage<PageProps>().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editing, setEditing] = useState<Content | null>(null);

    const openNew = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (c: Content) => {
        setEditing(c);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
    };

    return (
        <>
            <Head title="Contenus — ÉLÉVATION" />
            <div className="min-h-screen bg-[#f8f6f2]">
                <Sidebar />
                <div className="lg:pl-[260px]">
                    <Header name={auth.user.name} onAdd={openNew} />
                    <main className="p-6 lg:p-8">
                        {/* Stats */}
                        <div className="mb-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-cocoa/10 bg-white p-5">
                                <div className="text-2xl font-bold text-cocoa">{contents.length}</div>
                                <div className="text-sm text-cocoa/50">Total contenus</div>
                            </div>
                            <div className="rounded-xl border border-cocoa/10 bg-white p-5">
                                <div className="text-2xl font-bold text-emerald">{contents.filter(c => c.type === 'free').length}</div>
                                <div className="text-sm text-cocoa/50">Gratuits</div>
                            </div>
                            <div className="rounded-xl border border-cocoa/10 bg-white p-5">
                                <div className="text-2xl font-bold text-honey">{contents.filter(c => c.type === 'paid').length}</div>
                                <div className="text-sm text-cocoa/50">Payants</div>
                            </div>
                        </div>

                        {/* Table */}
                        <ContentsTable contents={contents} onEdit={openEdit} />
                    </main>
                </div>
            </div>

            {/* Content Modal */}
            <Modal open={modalOpen} onClose={closeModal}>
                <ContentForm
                    key={editing?.id ?? 'new'}
                    categories={categories}
                    editing={editing}
                    onClose={closeModal}
                    onAddCategory={() => setCategoryModalOpen(true)}
                />
            </Modal>

            {/* Category Modal */}
            <CategoryModal open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
        </>
    );
}
