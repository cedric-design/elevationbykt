import { Head, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    MessageSquareQuote,
    Video,
    Users,
    Settings,
    LogOut,
    Bell,
    ChevronRight,
    TrendingUp,
    Eye,
    DollarSign,
    UserCheck,
    ArrowUpRight,
    Calendar,
    Activity,
} from 'lucide-react';
import ElevationLogo from '@/components/ivoire/elevation-logo';

interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    quote: string;
    is_published: boolean;
}

interface Content {
    id: number;
    title: string;
    type: 'free' | 'paid';
    is_published: boolean;
    category: { name: string } | null;
}

interface Stats {
    members: number;
    clients: number;
    admins: number;
    testimonials: number;
    published: number;
    contents: number;
    contentsFree: number;
    contentsPaid: number;
    contentsPublished: number;
    visitorsToday: number;
    revenue: number;
    revenueTrend: string;
}

interface PageProps {
    stats: Stats;
    testimonials?: Testimonial[];
    contents?: Content[];
    isAdmin: boolean;
    auth: { user: { name: string; email: string; role: string } };
    [key: string]: unknown;
}

const ADMIN_NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/espace', active: true },
    { icon: Video, label: 'Contenus', href: '/admin/contenus' },
    { icon: MessageSquareQuote, label: 'Témoignages', href: '/admin/temoignages' },
    { icon: Users, label: 'Équipe', href: '/admin/collaborateurs' },
    { icon: Settings, label: 'Paramètres', href: '#' },
];

const CLIENT_NAV = [
    { icon: LayoutDashboard, label: 'Mon espace', href: '/espace', active: true },
    { icon: Video, label: 'Mes cours', href: '#' },
    { icon: Settings, label: 'Paramètres', href: '#' },
];

function Sidebar({ isAdmin }: { isAdmin: boolean }) {
    const NAV = isAdmin ? ADMIN_NAV : CLIENT_NAV;

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
                            active
                                ? 'bg-emerald text-sand'
                                : 'text-sand/60 hover:bg-white/5 hover:text-sand'
                        }`}
                    >
                        <Icon size={18} />
                        {label}
                    </a>
                ))}
            </nav>

            <div className="border-t border-white/10 p-3">
                <a
                    href="/"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sand/60 transition hover:bg-white/5 hover:text-sand"
                >
                    <ChevronRight size={18} />
                    Voir le site
                </a>
                <button
                    onClick={() => router.post('/logout')}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sand/60 transition hover:bg-terracotta/20 hover:text-terracotta"
                >
                    <LogOut size={18} />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}

function Header({ name, isAdmin }: { name: string; isAdmin: boolean }) {
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-cocoa/10 bg-white/80 px-6 backdrop-blur-md lg:px-8">
            <div>
                <h1 className="text-xl font-semibold text-cocoa">
                    {isAdmin ? 'Dashboard' : 'Mon espace'}
                </h1>
                <p className="text-sm text-cocoa/50">Bienvenue, {name.split(' ')[0]}</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative rounded-full border border-cocoa/10 p-2.5 text-cocoa/60 transition hover:bg-cocoa/5 hover:text-cocoa">
                    <Bell size={18} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-terracotta" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald to-emerald/70 grid place-items-center text-sand font-semibold">
                        {name.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
}

function KPICard({ 
    title, 
    value, 
    subtitle,
    trend,
    icon: Icon,
    color = 'emerald'
}: { 
    title: string; 
    value: string | number; 
    subtitle?: string;
    trend?: string;
    icon: typeof Users;
    color?: 'emerald' | 'honey' | 'terracotta' | 'cocoa';
}) {
    const colors = {
        emerald: 'bg-emerald text-sand',
        honey: 'bg-honey text-cocoa',
        terracotta: 'bg-terracotta text-sand',
        cocoa: 'bg-cocoa text-sand',
    };
    const iconBg = {
        emerald: 'bg-white/20',
        honey: 'bg-white/30',
        terracotta: 'bg-white/20',
        cocoa: 'bg-white/10',
    };

    return (
        <div className={`rounded-2xl p-6 ${colors[color]}`}>
            <div className="flex items-start justify-between">
                <div className={`rounded-xl p-3 ${iconBg[color]}`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-medium">
                        <TrendingUp size={12} />
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm opacity-80">{title}</div>
                {subtitle && <div className="mt-1 text-xs opacity-60">{subtitle}</div>}
            </div>
        </div>
    );
}

function StatCard({ 
    title, 
    value, 
    subtitle,
    icon: Icon,
}: { 
    title: string; 
    value: number | string; 
    subtitle?: string;
    icon: typeof Users;
}) {
    return (
        <div className="rounded-2xl border border-cocoa/10 bg-white p-6">
            <div className="flex items-start justify-between">
                <div className="rounded-xl bg-emerald/10 p-3">
                    <Icon size={20} className="text-emerald" />
                </div>
            </div>
            <div className="mt-4">
                <div className="text-3xl font-bold text-cocoa">{value}</div>
                <div className="text-sm text-cocoa/50">{title}</div>
                {subtitle && <div className="mt-1 text-xs text-cocoa/40">{subtitle}</div>}
            </div>
        </div>
    );
}

function QuickAction({ href, icon: Icon, title, description, color }: { href: string; icon: typeof Video; title: string; description: string; color: string }) {
    return (
        <a
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-cocoa/10 bg-white p-5 transition hover:border-emerald/30 hover:shadow-lg"
        >
            <div className={`rounded-xl p-3 ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div className="flex-1">
                <div className="font-semibold text-cocoa group-hover:text-emerald">{title}</div>
                <div className="text-sm text-cocoa/50">{description}</div>
            </div>
            <ArrowUpRight size={18} className="text-cocoa/30 transition group-hover:text-emerald" />
        </a>
    );
}

function RecentItem({ title, subtitle, status }: { title: string; subtitle: string; status: 'published' | 'draft' }) {
    return (
        <div className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-sand/50">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10 text-emerald font-semibold text-sm">
                {title.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-cocoa">{title}</div>
                <div className="truncate text-xs text-cocoa/50">{subtitle}</div>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                status === 'published' ? 'bg-emerald/10 text-emerald' : 'bg-cocoa/10 text-cocoa/60'
            }`}>
                {status === 'published' ? 'Publié' : 'Brouillon'}
            </span>
        </div>
    );
}

function AdminDashboard({ stats, testimonials, contents }: { stats: Stats; testimonials: Testimonial[]; contents: Content[] }) {
    return (
        <>
            {/* KPIs principaux */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KPICard 
                    icon={Activity} 
                    title="Visiteurs aujourd'hui" 
                    value={stats.visitorsToday} 
                    subtitle="Visiteurs uniques"
                    color="emerald"
                />
                <KPICard 
                    icon={DollarSign} 
                    title="Chiffre d'affaires" 
                    value={`${stats.revenue.toLocaleString()} XOF`}
                    trend={stats.revenueTrend}
                    color="honey"
                />
                <KPICard 
                    icon={UserCheck} 
                    title="Clients" 
                    value={stats.clients}
                    subtitle={`${stats.members} membres au total`}
                    color="terracotta"
                />
                <KPICard 
                    icon={Video} 
                    title="Contenus" 
                    value={stats.contents}
                    subtitle={`${stats.contentsPaid} payants · ${stats.contentsFree} gratuits`}
                    color="cocoa"
                />
            </div>

            {/* Stats secondaires */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <StatCard icon={MessageSquareQuote} title="Témoignages" value={stats.testimonials} subtitle={`${stats.published} publiés`} />
                <StatCard icon={Eye} title="Contenus publiés" value={stats.contentsPublished} />
                <StatCard icon={Users} title="Administrateurs" value={stats.admins} />
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <h2 className="mb-4 text-lg font-semibold text-cocoa">Actions rapides</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <QuickAction href="/admin/contenus" icon={Video} title="Gérer les contenus" description="Ajouter ou modifier vos cours" color="bg-emerald" />
                    <QuickAction href="/admin/temoignages" icon={MessageSquareQuote} title="Témoignages" description="Gérer les avis clients" color="bg-honey" />
                    <QuickAction href="/admin/collaborateurs" icon={Users} title="Équipe" description="Gérer les collaborateurs" color="bg-terracotta" />
                </div>
            </div>

            {/* Recent */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-cocoa/10 bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-cocoa">Contenus récents</h3>
                        <a href="/admin/contenus" className="text-sm font-medium text-emerald hover:text-cocoa">Voir tout</a>
                    </div>
                    {contents.length === 0 ? (
                        <p className="py-8 text-center text-sm text-cocoa/50">Aucun contenu</p>
                    ) : (
                        <div className="space-y-1">
                            {contents.slice(0, 5).map((c) => (
                                <RecentItem 
                                    key={c.id} 
                                    title={c.title} 
                                    subtitle={c.category?.name || 'Sans catégorie'} 
                                    status={c.is_published ? 'published' : 'draft'} 
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="rounded-2xl border border-cocoa/10 bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-cocoa">Témoignages récents</h3>
                        <a href="/admin/temoignages" className="text-sm font-medium text-emerald hover:text-cocoa">Voir tout</a>
                    </div>
                    {testimonials.length === 0 ? (
                        <p className="py-8 text-center text-sm text-cocoa/50">Aucun témoignage</p>
                    ) : (
                        <div className="space-y-1">
                            {testimonials.slice(0, 5).map((t) => (
                                <RecentItem 
                                    key={t.id} 
                                    title={t.name} 
                                    subtitle={t.role || 'Sans rôle'} 
                                    status={t.is_published ? 'published' : 'draft'} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function ClientDashboard({ stats, name }: { stats: Stats; name: string }) {
    return (
        <>
            {/* Welcome */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald to-emerald/80 p-8 text-sand">
                <h2 className="text-2xl font-semibold">Bienvenue dans ton espace, {name.split(' ')[0]} !</h2>
                <p className="mt-2 max-w-lg text-sand/80">
                    Accède à tes formations, suis ta progression et continue ton parcours d'élévation.
                </p>
                <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-emerald transition hover:bg-sand"
                >
                    <Video size={16} />
                    Voir mes cours
                </a>
            </div>

            {/* Stats */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-cocoa/10 bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-emerald">0</div>
                    <div className="text-sm text-cocoa/50">Cours suivis</div>
                </div>
                <div className="rounded-2xl border border-cocoa/10 bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-honey">0</div>
                    <div className="text-sm text-cocoa/50">Cours terminés</div>
                </div>
                <div className="rounded-2xl border border-cocoa/10 bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-cocoa">0%</div>
                    <div className="text-sm text-cocoa/50">Progression</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <h2 className="mb-4 text-lg font-semibold text-cocoa">Que veux-tu faire ?</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <QuickAction href="#" icon={Video} title="Explorer les cours" description="Découvre les formations disponibles" color="bg-emerald" />
                    <QuickAction href="#" icon={Settings} title="Mon profil" description="Gérer mes informations" color="bg-cocoa" />
                </div>
            </div>

            {/* Placeholder */}
            <div className="mt-8 rounded-2xl border border-cocoa/10 bg-white p-12 text-center">
                <Calendar size={48} className="mx-auto text-cocoa/20" />
                <h3 className="mt-4 font-semibold text-cocoa">Ton parcours commence ici</h3>
                <p className="mt-2 text-sm text-cocoa/50">Inscris-toi à un cours pour commencer ton élévation</p>
                <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald px-5 py-2.5 text-sm font-medium text-sand transition hover:bg-cocoa"
                >
                    Voir les cours disponibles
                </a>
            </div>
        </>
    );
}

export default function Dashboard() {
    const { stats, testimonials = [], contents = [], isAdmin, auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title={isAdmin ? 'Dashboard — ÉLÉVATION' : 'Mon espace — ÉLÉVATION'} />
            <div className="min-h-screen bg-[#f8f6f2]">
                <Sidebar isAdmin={isAdmin} />
                <div className="lg:pl-[260px]">
                    <Header name={auth.user.name} isAdmin={isAdmin} />
                    <main className="p-6 lg:p-8">
                        {isAdmin ? (
                            <AdminDashboard stats={stats} testimonials={testimonials} contents={contents} />
                        ) : (
                            <ClientDashboard stats={stats} name={auth.user.name} />
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
