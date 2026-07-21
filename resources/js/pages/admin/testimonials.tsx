import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    MessageSquareQuote,
    Video,
    Users,
    UsersRound,
    Mail,
    LogOut,
    ChevronRight,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    BadgeCheck,
    X,
    Pencil,
    AlertTriangle,
} from 'lucide-react';
import ElevationLogo from '@/components/ivoire/elevation-logo';

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

interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    quote: string;
    is_published: boolean;
    created_at: string;
}

interface PageProps {
    testimonials: Testimonial[];
    auth: { user: { name: string; email: string; role: string } };
    [key: string]: unknown;
}

const NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/espace' },
    { icon: Video, label: 'Contenus', href: '/admin/contenus' },
    { icon: MessageSquareQuote, label: 'Témoignages', href: '/admin/temoignages', active: true },
    { icon: Users, label: 'Équipe', href: '/admin/collaborateurs' },
    { icon: UsersRound, label: 'Utilisateurs', href: '/admin/utilisateurs' },
    { icon: Mail, label: 'Newsletter', href: '/admin/newsletter' },
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
                <h1 className="text-xl font-semibold text-cocoa">Témoignages</h1>
                <p className="text-sm text-cocoa/50">Gérez les avis de vos clients</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 rounded-xl bg-emerald px-4 py-2.5 text-sm font-medium text-sand shadow-sm transition hover:bg-cocoa"
                >
                    <Plus size={16} />
                    Ajouter un témoignage
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
            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {children}
            </div>
        </div>
    );
}

function TestimonialForm({ editing, onClose }: { editing: Testimonial | null; onClose: () => void }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: editing?.name || '',
        role: editing?.role || '',
        quote: editing?.quote || '',
        is_published: editing?.is_published ?? true,
    });

    const isEditing = editing !== null;

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
            put(`/admin/temoignages/${editing.id}`, options);
        } else {
            post('/admin/temoignages', options);
        }
    };

    return (
        <form onSubmit={submit}>
            <div className="flex items-center justify-between border-b border-cocoa/10 px-6 py-4">
                <h2 className="text-lg font-semibold text-cocoa">
                    {isEditing ? 'Modifier le témoignage' : 'Nouveau témoignage'}
                </h2>
                <button type="button" onClick={onClose} className="rounded-lg p-2 text-cocoa/50 hover:bg-cocoa/5 hover:text-cocoa">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-5 p-6">
                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Nom *</label>
                    <input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ex. Aïcha K."
                        className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                    />
                    {errors.name && <p className="mt-1 text-xs text-terracotta">{errors.name}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Rôle / Ville</label>
                    <input
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        placeholder="Ex. Entrepreneure · Abidjan"
                        className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-cocoa">Témoignage *</label>
                    <textarea
                        value={data.quote}
                        onChange={(e) => setData('quote', e.target.value)}
                        rows={4}
                        placeholder="Son retour d'expérience..."
                        className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                    />
                    {errors.quote && <p className="mt-1 text-xs text-terracotta">{errors.quote}</p>}
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
                    {processing ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer'}
                </button>
            </div>
        </form>
    );
}

function TestimonialsTable({ testimonials, onEdit }: { testimonials: Testimonial[]; onEdit: (t: Testimonial) => void }) {
    const [pendingId, setPendingId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
    const [deleting, setDeleting] = useState(false);

    const toggle = (id: number) => {
        setPendingId(id);
        router.patch(`/admin/temoignages/${id}/toggle`, {}, { preserveScroll: true, onFinish: () => setPendingId(null) });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/temoignages/${deleteTarget.id}`, { 
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    if (testimonials.length === 0) {
        return (
            <div className="rounded-2xl border border-cocoa/10 bg-white p-16 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-cocoa/5">
                    <MessageSquareQuote size={24} className="text-cocoa/30" />
                </div>
                <p className="text-cocoa/60">Aucun témoignage pour le moment</p>
                <p className="mt-1 text-sm text-cocoa/40">Cliquez sur "Ajouter un témoignage" pour commencer</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-cocoa/10 bg-white">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-cocoa/10 bg-sand/30">
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Personne</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Témoignage</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Statut</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-cocoa/50">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-cocoa/5">
                    {testimonials.map((t) => (
                        <tr key={t.id} className="transition hover:bg-sand/30">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10 font-semibold text-emerald">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-cocoa">{t.name}</div>
                                        <div className="text-xs text-cocoa/50">{t.role || '—'}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="line-clamp-2 max-w-md text-sm text-cocoa/70">« {t.quote} »</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                    t.is_published ? 'bg-emerald/10 text-emerald' : 'bg-cocoa/10 text-cocoa/60'
                                }`}>
                                    {t.is_published ? <BadgeCheck size={12} /> : <EyeOff size={12} />}
                                    {t.is_published ? 'Publié' : 'Masqué'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-end gap-1">
                                    <button
                                        onClick={() => onEdit(t)}
                                        title="Modifier"
                                        className="rounded-lg p-2 text-cocoa/50 transition hover:bg-honey/10 hover:text-honey"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => toggle(t.id)}
                                        disabled={pendingId === t.id}
                                        title={t.is_published ? 'Masquer' : 'Publier'}
                                        className="rounded-lg p-2 text-cocoa/50 transition hover:bg-emerald/10 hover:text-emerald disabled:opacity-50"
                                    >
                                        {t.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(t)}
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
            
            <ConfirmModal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                title="Supprimer ce témoignage ?"
                message={deleteTarget ? `Le témoignage de "${deleteTarget.name}" sera définitivement supprimé.` : ''}
                confirmText="Supprimer"
                loading={deleting}
            />
        </div>
    );
}

export default function AdminTestimonials() {
    const { testimonials, auth } = usePage<PageProps>().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);

    const openNew = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (t: Testimonial) => {
        setEditing(t);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
    };

    const published = testimonials.filter(t => t.is_published).length;

    return (
        <>
            <Head title="Témoignages — ÉLÉVATION" />
            <div className="min-h-screen bg-[#f8f6f2]">
                <Sidebar />
                <div className="lg:pl-[260px]">
                    <Header name={auth.user.name} onAdd={openNew} />
                    <main className="p-6 lg:p-8">
                        {/* Stats */}
                        <div className="mb-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-cocoa/10 bg-white p-5">
                                <div className="text-2xl font-bold text-cocoa">{testimonials.length}</div>
                                <div className="text-sm text-cocoa/50">Total témoignages</div>
                            </div>
                            <div className="rounded-xl border border-cocoa/10 bg-white p-5">
                                <div className="text-2xl font-bold text-emerald">{published}</div>
                                <div className="text-sm text-cocoa/50">Publiés</div>
                            </div>
                            <div className="rounded-xl border border-cocoa/10 bg-white p-5">
                                <div className="text-2xl font-bold text-cocoa/50">{testimonials.length - published}</div>
                                <div className="text-sm text-cocoa/50">Masqués</div>
                            </div>
                        </div>

                        {/* Table */}
                        <TestimonialsTable testimonials={testimonials} onEdit={openEdit} />
                    </main>
                </div>
            </div>

            {/* Modal */}
            <Modal open={modalOpen} onClose={closeModal}>
                <TestimonialForm key={editing?.id ?? 'new'} editing={editing} onClose={closeModal} />
            </Modal>
        </>
    );
}
