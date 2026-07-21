import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useRef, useCallback } from 'react';
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
    Send,
    Clock,
    Check,
    X,
    Bold,
    Italic,
    List,
    Link2,
    AlertTriangle,
} from 'lucide-react';
import ElevationLogo from '@/components/ivoire/elevation-logo';

function ConfirmModal({ 
    open, 
    onClose, 
    onConfirm, 
    title, 
    message,
    confirmText = 'Confirmer',
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
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10">
                            <Send size={28} className="text-emerald" />
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
                            className="flex-1 rounded-xl bg-emerald py-3 text-sm font-medium text-sand transition hover:bg-emerald/90 disabled:opacity-50"
                        >
                            {loading ? 'Envoi...' : confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

interface Newsletter {
    id: number;
    subject: string;
    content: string;
    template: string;
    sent_count: number;
    sent_at: string | null;
    created_at: string;
    sender?: { name: string };
}

interface Subscriber {
    id: number;
    email: string;
    name: string | null;
    verified_at: string | null;
    unsubscribed_at: string | null;
    created_at: string;
}

interface Stats {
    total: number;
    active: number;
    unsubscribed: number;
}

interface PageProps {
    newsletters: Newsletter[];
    subscribers: Subscriber[];
    stats: Stats;
    auth: { user: { name: string; email: string; role: string } };
    [key: string]: unknown;
}

const NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/espace' },
    { icon: Video, label: 'Contenus', href: '/admin/contenus' },
    { icon: MessageSquareQuote, label: 'Témoignages', href: '/admin/temoignages' },
    { icon: Users, label: 'Équipe', href: '/admin/collaborateurs' },
    { icon: UsersRound, label: 'Utilisateurs', href: '/admin/utilisateurs' },
    { icon: Mail, label: 'Newsletter', href: '/admin/newsletter', active: true },
];

const TEMPLATES = [
    { id: 'default', name: 'Classique', desc: 'Design épuré avec branding ÉLÉVATION' },
    { id: 'minimal', name: 'Minimal', desc: 'Texte sobre, style éditorial' },
    { id: 'elegant', name: 'Élégant', desc: 'Fond sombre, touches dorées' },
];

function Sidebar({ user }: { user: { name: string } }) {
    return (
        <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-cocoa/10 bg-cocoa text-sand">
            <div className="flex h-16 items-center gap-3 border-b border-sand/10 px-5">
                <ElevationLogo size={32} />
                <span className="text-lg font-semibold tracking-wide">ÉLÉVATION</span>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                    {NAV.map((item) => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                                    item.active ? 'bg-emerald text-sand' : 'text-sand/70 hover:bg-sand/10 hover:text-sand'
                                }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="border-t border-sand/10 p-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald text-sm font-semibold">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 truncate">
                        <div className="truncate text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-sand/50">Administrateur</div>
                    </div>
                </div>
                <a
                    href="/logout"
                    onClick={(e) => {
                        e.preventDefault();
                        router.post('/logout');
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sand/60 transition hover:bg-sand/10 hover:text-sand"
                >
                    <LogOut size={16} />
                    Déconnexion
                </a>
            </div>
        </aside>
    );
}

function Topbar({ title }: { title: string }) {
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-cocoa/10 bg-sand/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm text-cocoa/50">
                <a href="/espace" className="hover:text-emerald">Dashboard</a>
                <ChevronRight size={14} />
                <span className="font-medium text-cocoa">{title}</span>
            </div>
        </header>
    );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Mail; label: string; value: number; color: string }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`rounded-2xl border border-cocoa/10 bg-white p-5 shadow-sm`}
        >
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                    <Icon size={22} className="text-white" />
                </div>
                <div>
                    <div className="text-2xl font-bold text-cocoa">{value}</div>
                    <div className="text-xs text-cocoa/50">{label}</div>
                </div>
            </div>
        </motion.div>
    );
}

function WysiwygEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertTag = (tag: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.substring(start, end);
        const before = value.substring(0, start);
        const after = value.substring(end);
        const newText = `${before}${tag}${selected}${tag}${after}`;
        onChange(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length, end + tag.length);
        }, 0);
    };

    return (
        <div className="rounded-xl border border-cocoa/15 bg-white overflow-hidden">
            <div className="flex items-center gap-1 border-b border-cocoa/10 bg-sand/30 px-3 py-2">
                <button
                    type="button"
                    onClick={() => insertTag('**')}
                    className="rounded-lg p-2 text-cocoa/60 hover:bg-white hover:text-cocoa"
                    title="Gras"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => insertTag('_')}
                    className="rounded-lg p-2 text-cocoa/60 hover:bg-white hover:text-cocoa"
                    title="Italique"
                >
                    <Italic size={16} />
                </button>
                <div className="mx-2 h-5 w-px bg-cocoa/15" />
                <button
                    type="button"
                    onClick={() => insertTag('\n- ')}
                    className="rounded-lg p-2 text-cocoa/60 hover:bg-white hover:text-cocoa"
                    title="Liste"
                >
                    <List size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        const url = prompt('URL du lien:');
                        if (url) {
                            const textarea = textareaRef.current;
                            if (!textarea) return;
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const selected = value.substring(start, end) || 'Texte du lien';
                            const before = value.substring(0, start);
                            const after = value.substring(end);
                            onChange(`${before}[${selected}](${url})${after}`);
                        }
                    }}
                    className="rounded-lg p-2 text-cocoa/60 hover:bg-white hover:text-cocoa"
                    title="Lien"
                >
                    <Link2 size={16} />
                </button>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={12}
                placeholder="Rédigez votre message ici...&#10;&#10;Utilisez **texte** pour le gras&#10;Utilisez _texte_ pour l'italique"
                className="w-full resize-none bg-transparent px-4 py-3 text-cocoa outline-none placeholder:text-cocoa/40"
            />
        </div>
    );
}

function NewsletterForm({ onClose }: { onClose: () => void }) {
    const form = useForm({
        subject: '',
        content: '',
        template: 'default',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        form.post('/admin/newsletter', {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                form.reset();
            },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10"
        >
            <div className="absolute inset-0 bg-cocoa/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                className="relative w-full max-w-3xl rounded-3xl bg-sand shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-cocoa/10 px-6 py-4">
                    <h2 className="text-xl font-semibold text-cocoa">Nouvelle Newsletter</h2>
                    <button onClick={onClose} className="rounded-full p-2 text-cocoa/50 hover:bg-cocoa/10 hover:text-cocoa">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-cocoa/70">Objet</label>
                        <input
                            required
                            value={form.data.subject}
                            onChange={(e) => form.setData('subject', e.target.value)}
                            placeholder="Sujet de votre newsletter"
                            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-cocoa outline-none transition focus:border-emerald"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-cocoa/70">Template</label>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {TEMPLATES.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => form.setData('template', t.id)}
                                    className={`rounded-xl border p-4 text-left transition ${
                                        form.data.template === t.id
                                            ? 'border-emerald bg-emerald/5'
                                            : 'border-cocoa/15 bg-white hover:border-cocoa/25'
                                    }`}
                                >
                                    <div className={`text-sm font-medium ${form.data.template === t.id ? 'text-emerald' : 'text-cocoa'}`}>
                                        {t.name}
                                    </div>
                                    <div className="mt-1 text-xs text-cocoa/50">{t.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-cocoa/70">Contenu</label>
                        <WysiwygEditor value={form.data.content} onChange={(v) => form.setData('content', v)} />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-cocoa/10 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-cocoa/15 px-5 py-2.5 text-sm font-medium text-cocoa transition hover:bg-white"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="flex items-center gap-2 rounded-xl bg-emerald px-5 py-2.5 text-sm font-medium text-sand transition hover:bg-emerald/90 disabled:opacity-50"
                        >
                            <Plus size={16} />
                            {form.processing ? 'Enregistrement...' : 'Enregistrer le brouillon'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

function NewslettersTable({ newsletters }: { newsletters: Newsletter[] }) {
    const [sendTarget, setSendTarget] = useState<Newsletter | null>(null);
    const [sending, setSending] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Newsletter | null>(null);
    const [deleting, setDeleting] = useState(false);

    const confirmSend = () => {
        if (!sendTarget) return;
        setSending(true);
        router.post(`/admin/newsletter/${sendTarget.id}/send`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setSending(false);
                setSendTarget(null);
            },
        });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/newsletter/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    if (newsletters.length === 0) {
        return (
            <div className="rounded-2xl border border-cocoa/10 bg-white p-12 text-center">
                <Mail size={48} className="mx-auto text-cocoa/20" />
                <p className="mt-4 text-cocoa/50">Aucune newsletter créée</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-cocoa/10 bg-white">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-cocoa/10 bg-sand/30">
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Objet</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Template</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Statut</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Envoyés</th>
                            <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-cocoa/50">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-cocoa/5">
                        {newsletters.map((n) => (
                            <tr key={n.id} className="group transition hover:bg-sand/30">
                                <td className="px-5 py-4">
                                    <div className="font-medium text-cocoa">{n.subject}</div>
                                    <div className="mt-0.5 text-xs text-cocoa/50">
                                        {new Date(n.created_at).toLocaleDateString('fr-FR')}
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm text-cocoa/70">
                                    {TEMPLATES.find(t => t.id === n.template)?.name || n.template}
                                </td>
                                <td className="px-5 py-4">
                                    {n.sent_at ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-medium text-emerald">
                                            <Check size={12} />
                                            Envoyé
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-honey/10 px-3 py-1 text-xs font-medium text-honey">
                                            <Clock size={12} />
                                            Brouillon
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-sm text-cocoa/70">
                                    {n.sent_count > 0 ? `${n.sent_count} abonnés` : '-'}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {!n.sent_at && (
                                            <button
                                                onClick={() => setSendTarget(n)}
                                                className="rounded-lg p-2 text-emerald/60 transition hover:bg-emerald/10 hover:text-emerald"
                                                title="Envoyer"
                                            >
                                                <Send size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDeleteTarget(n)}
                                            className="rounded-lg p-2 text-terracotta/60 transition hover:bg-terracotta/10 hover:text-terracotta"
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
                open={!!sendTarget}
                onClose={() => setSendTarget(null)}
                onConfirm={confirmSend}
                title="Envoyer la newsletter ?"
                message={`Cette action enverra la newsletter "${sendTarget?.subject}" à tous les abonnés actifs. Cette action est irréversible.`}
                confirmText="Envoyer maintenant"
                loading={sending}
            />

            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
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
                                <h3 className="text-xl font-semibold text-cocoa">Supprimer cette newsletter ?</h3>
                                <p className="mt-2 text-sm text-cocoa/60">Cette action est irréversible.</p>
                            </div>
                            <div className="flex gap-3 border-t border-cocoa/10 bg-sand/30 p-4">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    disabled={deleting}
                                    className="flex-1 rounded-xl border border-cocoa/15 py-3 text-sm font-medium text-cocoa transition hover:bg-white disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="flex-1 rounded-xl bg-terracotta py-3 text-sm font-medium text-sand transition hover:bg-terracotta/90 disabled:opacity-50"
                                >
                                    {deleting ? 'Suppression...' : 'Supprimer'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function SubscribersTable({ subscribers }: { subscribers: Subscriber[] }) {
    const remove = (id: number) => {
        router.delete(`/admin/subscribers/${id}`, { preserveScroll: true });
    };

    if (subscribers.length === 0) {
        return (
            <div className="rounded-2xl border border-cocoa/10 bg-white p-12 text-center">
                <Users size={48} className="mx-auto text-cocoa/20" />
                <p className="mt-4 text-cocoa/50">Aucun abonné</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-cocoa/10 bg-white">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-cocoa/10 bg-sand/30">
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Email</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Nom</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Statut</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-cocoa/50">Inscrit le</th>
                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-cocoa/50">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-cocoa/5">
                    {subscribers.map((s) => (
                        <tr key={s.id} className="group transition hover:bg-sand/30">
                            <td className="px-5 py-4 text-sm text-cocoa">{s.email}</td>
                            <td className="px-5 py-4 text-sm text-cocoa/70">{s.name || '-'}</td>
                            <td className="px-5 py-4">
                                {s.unsubscribed_at ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cocoa/10 px-3 py-1 text-xs font-medium text-cocoa/60">
                                        Désabonné
                                    </span>
                                ) : s.verified_at ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1 text-xs font-medium text-emerald">
                                        <Check size={12} />
                                        Actif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-honey/10 px-3 py-1 text-xs font-medium text-honey">
                                        En attente
                                    </span>
                                )}
                            </td>
                            <td className="px-5 py-4 text-sm text-cocoa/50">
                                {new Date(s.created_at).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex items-center justify-end">
                                    <button
                                        onClick={() => remove(s.id)}
                                        className="rounded-lg p-2 text-terracotta/60 transition hover:bg-terracotta/10 hover:text-terracotta"
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
    );
}

export default function NewsletterPage() {
    const { newsletters, subscribers, stats, auth } = usePage<PageProps>().props;
    const [showForm, setShowForm] = useState(false);
    const [tab, setTab] = useState<'newsletters' | 'subscribers'>('newsletters');

    return (
        <>
            <Head title="Newsletter — Admin" />
            <div className="tpl-ivoire min-h-screen bg-sand">
                <Sidebar user={auth.user} />
                <div className="ml-64">
                    <Topbar title="Newsletter" />
                    <main className="p-6">
                        {/* Stats */}
                        <div className="mb-8 grid gap-4 sm:grid-cols-3">
                            <StatCard icon={Mail} label="Total abonnés" value={stats.total} color="bg-emerald" />
                            <StatCard icon={Check} label="Abonnés actifs" value={stats.active} color="bg-honey" />
                            <StatCard icon={X} label="Désabonnés" value={stats.unsubscribed} color="bg-terracotta" />
                        </div>

                        {/* Tabs & Actions */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTab('newsletters')}
                                    className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                                        tab === 'newsletters'
                                            ? 'bg-emerald text-sand'
                                            : 'border border-cocoa/15 text-cocoa/70 hover:bg-white'
                                    }`}
                                >
                                    Newsletters ({newsletters.length})
                                </button>
                                <button
                                    onClick={() => setTab('subscribers')}
                                    className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                                        tab === 'subscribers'
                                            ? 'bg-emerald text-sand'
                                            : 'border border-cocoa/15 text-cocoa/70 hover:bg-white'
                                    }`}
                                >
                                    Abonnés ({subscribers.length})
                                </button>
                            </div>
                            {tab === 'newsletters' && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex items-center gap-2 rounded-xl bg-emerald px-5 py-2.5 text-sm font-medium text-sand shadow-lg shadow-emerald/20 transition hover:bg-emerald/90"
                                >
                                    <Plus size={18} />
                                    Nouvelle newsletter
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        {tab === 'newsletters' ? (
                            <NewslettersTable newsletters={newsletters} />
                        ) : (
                            <SubscribersTable subscribers={subscribers} />
                        )}
                    </main>
                </div>
            </div>

            <AnimatePresence>
                {showForm && <NewsletterForm onClose={() => setShowForm(false)} />}
            </AnimatePresence>
        </>
    );
}
