import { router, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    MessageSquareQuote,
    Video,
    BookOpen,
    Users,
    UsersRound,
    Mail,
    Megaphone,
    Inbox,
    CalendarDays,
    LogOut,
    Bell,
    Globe,
    Menu,
    X,
    ArrowRight,
    type LucideIcon,
} from 'lucide-react';
import ElevationLogo from '@/components/ivoire/elevation-logo';

const ADMIN_NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/espace' },
    { icon: BookOpen, label: 'Cours', href: '/admin/cours' },
    { icon: Video, label: 'Contenus', href: '/admin/contenus' },
    { icon: CalendarDays, label: 'Événements', href: '/admin/evenements' },
    { icon: Inbox, label: 'Messages', href: '/admin/contact' },
    { icon: MessageSquareQuote, label: 'Témoignages', href: '/admin/temoignages' },
    { icon: Users, label: 'Équipe', href: '/admin/collaborateurs' },
    { icon: UsersRound, label: 'Utilisateurs', href: '/admin/utilisateurs' },
    { icon: Megaphone, label: 'Publicité', href: '/admin/publicites' },
    { icon: Mail, label: 'Newsletter', href: '/admin/newsletter' },
];

const CLIENT_NAV = [
    { icon: LayoutDashboard, label: 'Mon espace', href: '/espace' },
    { icon: BookOpen, label: 'Mes cours', href: '/espace' },
];

const TOPIC_LABELS: Record<string, string> = {
    partenariat: 'Partenariat',
    presse: 'Presse',
    evenement: 'Événement',
    masterclass: 'Masterclass',
    autre: 'Autre',
};

interface AdminNotificationMessage {
    id: number;
    name: string;
    email: string;
    topic: string;
    message: string;
    created_at: string;
}

interface AdminNotifications {
    unread_count: number;
    messages: AdminNotificationMessage[];
}

function NavLinks({ current, items, onNavigate }: { current: string; items: typeof ADMIN_NAV; onNavigate?: () => void }) {
    return (
        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-4">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-sand/30">Menu</p>
            {items.map(({ icon: Icon, label, href }) => {
                const active = href === current;
                return (
                    <a
                        key={label}
                        href={href}
                        onClick={onNavigate}
                        className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            active
                                ? 'bg-gradient-to-r from-emerald to-emerald/85 text-sand shadow-lg shadow-emerald/25'
                                : 'text-sand/55 hover:bg-white/[0.05] hover:pl-5 hover:text-sand'
                        }`}
                    >
                        <Icon size={17} className={active ? '' : 'transition group-hover:scale-110'} />
                        {label}
                        {active && <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-honey" />}
                    </a>
                );
            })}
        </nav>
    );
}

function SidebarBrand() {
    return (
        <div className="flex h-[72px] items-center gap-3 border-b border-white/[0.06] px-6">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                <ElevationLogo size={26} className="brightness-0 invert" />
            </div>
            <div>
                <div className="ivoire-serif text-base tracking-[0.14em] text-sand">ÉLÉVATION</div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-honey/80">by Kadhy</div>
            </div>
        </div>
    );
}

function SidebarFooter({ user, isAdmin }: { user: { name: string }; isAdmin: boolean }) {
    return (
        <div className="border-t border-white/[0.06] p-4">
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/[0.05] p-3 ring-1 ring-white/[0.04]">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-honey to-terracotta text-sm font-bold text-cocoa shadow-md shadow-honey/20">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-sand">{user.name}</div>
                    <div className="truncate text-[11px] text-sand/40">{isAdmin ? 'Administrateur' : 'Membre'}</div>
                </div>
            </div>
            <div className="flex gap-2">
                <a
                    href="/"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/[0.05] px-3 py-2.5 text-xs font-medium text-sand/60 transition hover:bg-white/10 hover:text-sand"
                >
                    <Globe size={14} />
                    Voir le site
                </a>
                <button
                    onClick={() => router.post('/logout')}
                    className="flex items-center justify-center rounded-xl bg-white/[0.05] px-3 py-2.5 text-sand/60 transition hover:bg-terracotta/20 hover:text-terracotta"
                    title="Déconnexion"
                >
                    <LogOut size={14} />
                </button>
            </div>
        </div>
    );
}

export function AdminSidebar({ current, user, isAdmin }: { current: string; user: { name: string }; isAdmin: boolean }) {
    const nav = isAdmin ? ADMIN_NAV : CLIENT_NAV;

    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col overflow-hidden bg-gradient-to-b from-cocoa via-[#261c13] to-[#1a120b] lg:flex">
            <div className="pointer-events-none absolute -left-16 top-24 h-48 w-48 rounded-full bg-emerald/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-32 h-56 w-56 rounded-full bg-honey/10 blur-3xl" />
            <div className="relative flex h-full flex-col">
                <SidebarBrand />
                <NavLinks current={current} items={nav} />
                <SidebarFooter user={user} isAdmin={isAdmin} />
            </div>
        </aside>
    );
}

function MobileSidebar({ open, onClose, current, user, isAdmin }: { open: boolean; onClose: () => void; current: string; user: { name: string }; isAdmin: boolean }) {
    const nav = isAdmin ? ADMIN_NAV : CLIENT_NAV;
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-cocoa/60 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                    />
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-hidden bg-gradient-to-b from-cocoa via-[#261c13] to-[#1a120b] lg:hidden"
                    >
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-4">
                            <SidebarBrand />
                            <button onClick={onClose} className="mr-2 rounded-lg p-2 text-sand/60 hover:bg-white/10 hover:text-sand">
                                <X size={18} />
                            </button>
                        </div>
                        <NavLinks current={current} items={nav} onNavigate={onClose} />
                        <SidebarFooter user={user} isAdmin={isAdmin} />
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

export function AdminHeader({
    title,
    subtitle,
    actions,
    user,
    isAdmin = false,
    onMenu,
}: {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    user: { name: string; role?: string };
    isAdmin?: boolean;
    onMenu?: () => void;
}) {
    const { adminNotifications } = usePage<{ adminNotifications?: AdminNotifications | null }>().props;
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const unread = adminNotifications?.unread_count ?? 0;
    const messages = adminNotifications?.messages ?? [];
    const initials = user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('');

    useEffect(() => {
        if (!notifOpen) return;

        const onClick = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setNotifOpen(false);
        };

        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [notifOpen]);

    const formatNotifDate = (iso: string) => {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return '';
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-cocoa/[0.06] bg-[#f7f3eb]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
            <div className="flex items-center gap-3">
                {onMenu && (
                    <button
                        type="button"
                        onClick={onMenu}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-cocoa/10 bg-white text-cocoa/70 shadow-sm lg:hidden"
                    >
                        <Menu size={18} />
                    </button>
                )}
                <div>
                    <h1 className="ivoire-serif text-xl text-cocoa sm:text-2xl">{title}</h1>
                    {subtitle && <p className="text-xs text-cocoa/45">{subtitle}</p>}
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {actions}

                {isAdmin && (
                    <div className="relative" ref={notifRef}>
                        <button
                            type="button"
                            onClick={() => setNotifOpen((v) => !v)}
                            aria-label="Notifications"
                            aria-expanded={notifOpen}
                            className={`relative grid h-11 w-11 place-items-center rounded-full border bg-white text-cocoa/55 shadow-sm transition ${
                                notifOpen
                                    ? 'border-honey text-honey'
                                    : 'border-cocoa/10 hover:border-honey/40 hover:text-honey'
                            }`}
                        >
                            <Bell size={17} />
                            {unread > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-terracotta px-1 py-0.5 text-[10px] font-bold leading-none text-sand ring-2 ring-[#f7f3eb]">
                                    {unread > 9 ? '9+' : unread}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.18 }}
                                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-cocoa/10 bg-white shadow-2xl shadow-cocoa/15"
                                >
                                    <div className="flex items-center justify-between border-b border-cocoa/8 px-4 py-3">
                                        <div>
                                            <p className="text-sm font-semibold text-cocoa">Notifications</p>
                                            <p className="text-xs text-cocoa/45">
                                                {unread > 0
                                                    ? `${unread} message${unread > 1 ? 's' : ''} non lu${unread > 1 ? 's' : ''}`
                                                    : 'Tout est à jour'}
                                            </p>
                                        </div>
                                        <Inbox size={16} className="text-honey" />
                                    </div>

                                    <div className="max-h-[320px] overflow-y-auto">
                                        {messages.length === 0 ? (
                                            <div className="px-4 py-10 text-center">
                                                <p className="text-sm text-cocoa/50">Aucun nouveau message</p>
                                            </div>
                                        ) : (
                                            messages.map((msg) => (
                                                <a
                                                    key={msg.id}
                                                    href="/admin/contact"
                                                    onClick={() => setNotifOpen(false)}
                                                    className="block border-b border-cocoa/5 px-4 py-3 transition hover:bg-sand/60"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="truncate text-sm font-medium text-cocoa">{msg.name}</p>
                                                        <span className="shrink-0 rounded-full bg-honey/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-honey">
                                                            {TOPIC_LABELS[msg.topic] || msg.topic}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 line-clamp-1 text-xs text-cocoa/55">{msg.message}</p>
                                                    <p className="mt-1 text-[11px] text-cocoa/35">{formatNotifDate(msg.created_at)}</p>
                                                </a>
                                            ))
                                        )}
                                    </div>

                                    <a
                                        href="/admin/contact"
                                        onClick={() => setNotifOpen(false)}
                                        className="flex items-center justify-center gap-2 border-t border-cocoa/8 bg-sand/40 px-4 py-3 text-xs font-semibold text-cocoa transition hover:bg-honey/15 hover:text-honey"
                                    >
                                        Voir tous les messages
                                        <ArrowRight size={13} />
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <div className="flex items-center gap-2.5 rounded-full border border-cocoa/10 bg-white py-1.5 pl-1.5 pr-3 shadow-sm sm:pr-4">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-cocoa text-[11px] font-semibold tracking-wide text-sand sm:h-9 sm:w-9 sm:text-xs">
                        {initials || user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden min-w-0 sm:block">
                        <p className="truncate text-sm font-medium leading-tight text-cocoa">{user.name}</p>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-cocoa/40">
                            {isAdmin ? 'Admin' : 'Membre'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export function AdminShell({
    current,
    title,
    subtitle,
    actions,
    user,
    isAdmin: isAdminProp,
    children,
}: {
    current: string;
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    user: { name: string; role?: string };
    isAdmin?: boolean;
    children: ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const page = usePage<{ auth?: { user?: { role?: string } }; isAdmin?: boolean }>().props;

    // Source of truth: explicit prop → shared Inertia isAdmin → role utilisateur
    const role = user.role ?? page.auth?.user?.role;
    const isAdmin =
        isAdminProp ??
        page.isAdmin ??
        role === 'administrateur';

    return (
        <div className="tpl-ivoire relative min-h-screen overflow-x-hidden bg-[#f7f3eb]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(31,107,82,0.06),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(199,154,75,0.07),transparent_40%)]" />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%232c2117' stroke-width='0.3' opacity='0.08'/%3E%3C/svg%3E\")",
                }}
            />

            <AdminSidebar current={current} user={user} isAdmin={isAdmin} />
            <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} current={current} user={user} isAdmin={isAdmin} />

            <div className="relative lg:pl-[264px]">
                <AdminHeader title={title} subtitle={subtitle} actions={actions} user={user} isAdmin={isAdmin} onMenu={() => setMobileOpen(true)} />
                <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

/* Shared UI primitives */

type Accent = 'emerald' | 'honey' | 'terracotta' | 'cocoa';

const ACCENT_STYLES: Record<Accent, { chip: string; bar: string; glow: string }> = {
    emerald: { chip: 'bg-emerald/10 text-emerald', bar: 'from-emerald to-emerald/40', glow: 'group-hover:shadow-emerald/15' },
    honey: { chip: 'bg-honey/15 text-honey', bar: 'from-honey to-honey/40', glow: 'group-hover:shadow-honey/20' },
    terracotta: { chip: 'bg-terracotta/10 text-terracotta', bar: 'from-terracotta to-terracotta/40', glow: 'group-hover:shadow-terracotta/15' },
    cocoa: { chip: 'bg-cocoa/8 text-cocoa', bar: 'from-cocoa to-cocoa/40', glow: 'group-hover:shadow-cocoa/15' },
};

export function AdminStatCard({
    label,
    value,
    subtitle,
    icon: Icon,
    accent = 'emerald',
}: {
    label: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    accent?: Accent;
}) {
    const a = ACCENT_STYLES[accent];
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`group relative overflow-hidden rounded-2xl border border-cocoa/[0.07] bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl ${a.glow}`}
        >
            <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar}`} />
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="ivoire-serif text-3xl leading-none text-cocoa">{value}</div>
                    <div className="mt-2 text-sm font-medium text-cocoa/60">{label}</div>
                    {subtitle && <div className="mt-0.5 text-xs text-cocoa/40">{subtitle}</div>}
                </div>
                {Icon && (
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${a.chip}`}>
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export function AdminPanel({ title, action, children, className = '' }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <div className={`overflow-hidden rounded-2xl border border-cocoa/[0.07] bg-white/90 shadow-sm backdrop-blur-sm ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between border-b border-cocoa/[0.06] bg-gradient-to-r from-sand/40 to-transparent px-5 py-4 sm:px-6">
                    {title && <h3 className="ivoire-serif text-lg text-cocoa">{title}</h3>}
                    {action}
                </div>
            )}
            {children}
        </div>
    );
}

export function AdminEmpty({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: string; action?: ReactNode }) {
    return (
        <div className="rounded-2xl border border-dashed border-cocoa/15 bg-white/50 px-6 py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald/10">
                <Icon size={28} className="text-emerald" />
            </div>
            <h3 className="ivoire-serif mt-4 text-xl text-cocoa">{title}</h3>
            {description && <p className="mx-auto mt-2 max-w-sm text-sm text-cocoa/50">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
