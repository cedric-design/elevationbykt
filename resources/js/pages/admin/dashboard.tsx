import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    MessageSquareQuote,
    Video,
    BookOpen,
    Users,
    Mail,
    TrendingUp,
    DollarSign,
    UserCheck,
    ArrowUpRight,
    ArrowRight,
    Calendar,
    Activity,
    Sparkles,
    BadgeCheck,
    Clock,
    ExternalLink,
    Send,
    Image as ImageIcon,
} from 'lucide-react';
import ElevationLogo from '@/components/ivoire/elevation-logo';
import { AdminShell, AdminStatCard, AdminPanel } from '@/components/admin/admin-shell';

interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    quote: string;
    is_published: boolean;
}

interface CourseSummary {
    id: number;
    title: string;
    is_published: boolean;
    modules_count?: number;
}

interface CourseAccessInfo {
    status: string;
    private_link: string | null;
    link_sent_at: string | null;
}

interface AvailableCourse {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    modules_count: number;
    has_invite_link: boolean;
    access: CourseAccessInfo | null;
}

interface MyCourse {
    id: number;
    title: string;
    cover_image: string | null;
    private_link: string;
    status: string;
    link_sent_at: string | null;
    modules_count: number;
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
    courses: number;
    coursesPublished: number;
    visitorsToday: number;
    revenue: number;
    revenueTrend: string;
    myCoursesCount?: number;
    availableCoursesCount?: number;
}

interface PageProps {
    stats: Stats;
    testimonials?: Testimonial[];
    courses?: CourseSummary[];
    availableCourses?: AvailableCourse[];
    myCourses?: MyCourse[];
    isAdmin: boolean;
    auth: { user: { name: string; email: string; role: string } };
    [key: string]: unknown;
}

const rise = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
};

function HeroBanner({ name, stats, isAdmin }: { name: string; stats: Stats; isAdmin: boolean }) {
    return (
        <motion.div
            {...rise}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald via-[#1b5f49] to-[#0f3226] p-8 text-sand shadow-2xl shadow-emerald/25 lg:p-10"
        >
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-honey/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-terracotta/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.04)_50%,transparent_60%)]" />
            <div className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 opacity-[0.08] lg:block">
                <ElevationLogo size={220} className="brightness-0 invert" />
            </div>

            <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-honey backdrop-blur-sm">
                    <Sparkles size={13} />
                    {isAdmin ? 'Tableau de bord' : 'Mon espace'}
                </span>
                <h2 className="ivoire-serif mt-4 max-w-lg text-3xl leading-tight lg:text-4xl">
                    Bienvenue, {name.split(' ')[0]}.
                </h2>
                <p className="mt-2 max-w-md text-sm text-sand/70">
                    {isAdmin
                        ? "Voici un aperçu de l'activité d'ÉLÉVATION aujourd'hui."
                        : "Accède à tes formations et continue ton parcours d'élévation."}
                </p>

                {isAdmin ? (
                    <div className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
                        <div>
                            <div className="ivoire-serif text-3xl">{stats.members}</div>
                            <div className="mt-0.5 text-xs uppercase tracking-wider text-sand/55">Membres</div>
                        </div>
                        <div className="hidden w-px bg-white/15 sm:block" />
                        <div>
                            <div className="ivoire-serif text-3xl">{stats.courses}</div>
                            <div className="mt-0.5 text-xs uppercase tracking-wider text-sand/55">Cours</div>
                        </div>
                        <div className="hidden w-px bg-white/15 sm:block" />
                        <div>
                            <div className="ivoire-serif text-3xl">{stats.contents}</div>
                            <div className="mt-0.5 text-xs uppercase tracking-wider text-sand/55">Contenus</div>
                        </div>
                        <div className="hidden w-px bg-white/15 sm:block" />
                        <div>
                            <div className="ivoire-serif text-3xl">{stats.published}</div>
                            <div className="mt-0.5 text-xs uppercase tracking-wider text-sand/55">Témoignages publiés</div>
                        </div>
                    </div>
                ) : (
                    <a
                        href="#mes-cours"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-honey px-6 py-3 text-sm font-semibold text-cocoa shadow-lg transition hover:bg-sand"
                    >
                        <BookOpen size={16} />
                        Voir mes cours
                    </a>
                )}
            </div>
        </motion.div>
    );
}

function QuickAction({
    href,
    icon: Icon,
    title,
    description,
    gradient,
    delay = 0,
}: {
    href: string;
    icon: typeof Video;
    title: string;
    description: string;
    gradient: string;
    delay?: number;
}) {
    return (
        <motion.a
            {...rise}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-cocoa/[0.07] bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg"
        >
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-sand shadow-md`}>
                <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
                <div className="font-semibold text-cocoa transition group-hover:text-emerald">{title}</div>
                <div className="truncate text-xs text-cocoa/45">{description}</div>
            </div>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand/70 text-cocoa/40 transition-all duration-300 group-hover:bg-emerald group-hover:text-sand">
                <ArrowUpRight size={15} />
            </span>
        </motion.a>
    );
}

function RecentItem({ title, subtitle, status, index }: { title: string; subtitle: string; status: 'published' | 'draft'; index: number }) {
    const palette = ['bg-emerald/10 text-emerald', 'bg-honey/15 text-honey', 'bg-terracotta/10 text-terracotta', 'bg-cocoa/8 text-cocoa'];
    return (
        <div className="flex items-center gap-4 rounded-xl px-3 py-2.5 transition hover:bg-sand/60">
            <div className={`ivoire-serif grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm ${palette[index % palette.length]}`}>
                {title.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-cocoa">{title}</div>
                <div className="truncate text-xs text-cocoa/45">{subtitle}</div>
            </div>
            <span
                className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    status === 'published' ? 'bg-emerald/10 text-emerald' : 'bg-cocoa/[0.07] text-cocoa/50'
                }`}
            >
                {status === 'published' ? <BadgeCheck size={11} /> : <Clock size={11} />}
                {status === 'published' ? 'Publié' : 'Brouillon'}
            </span>
        </div>
    );
}

function AdminDashboard({
    stats,
    testimonials,
    courses,
    name,
}: {
    stats: Stats;
    testimonials: Testimonial[];
    courses: CourseSummary[];
    name: string;
}) {
    return (
        <>
            <HeroBanner name={name} stats={stats} isAdmin />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard icon={Activity} label="Visiteurs aujourd'hui" value={stats.visitorsToday} subtitle="Visiteurs uniques" accent="emerald" />
                <AdminStatCard icon={DollarSign} label="Chiffre d'affaires" value={`${stats.revenue.toLocaleString()} XOF`} subtitle={stats.revenueTrend} accent="honey" />
                <AdminStatCard icon={UserCheck} label="Clients" value={stats.clients} subtitle={`${stats.members} membres au total`} accent="terracotta" />
                <AdminStatCard icon={BookOpen} label="Cours" value={stats.courses} subtitle={`${stats.coursesPublished} publiés`} accent="cocoa" />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <AdminStatCard icon={MessageSquareQuote} label="Témoignages" value={stats.testimonials} subtitle={`${stats.published} publiés`} accent="emerald" />
                <AdminStatCard icon={Video} label="Contenus" value={stats.contents} subtitle={`${stats.contentsPaid} payants · ${stats.contentsFree} gratuits`} accent="honey" />
                <AdminStatCard icon={Users} label="Administrateurs" value={stats.admins} accent="terracotta" />
            </div>

            <div className="mt-10">
                <div className="mb-5 flex items-center gap-3">
                    <h2 className="ivoire-serif text-xl text-cocoa">Actions rapides</h2>
                    <span className="h-px flex-1 bg-gradient-to-r from-cocoa/15 to-transparent" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <QuickAction href="/admin/cours" icon={BookOpen} title="Cours" description="Créer et gérer les cours Skool" gradient="from-emerald to-[#154d3b]" delay={0.05} />
                    <QuickAction href="/admin/contenus" icon={Video} title="Contenus" description="Médias free / payants" gradient="from-honey to-[#a37a33]" delay={0.1} />
                    <QuickAction href="/admin/temoignages" icon={MessageSquareQuote} title="Témoignages" description="Gérer les avis clients" gradient="from-terracotta to-[#a3542e]" delay={0.15} />
                    <QuickAction href="/admin/newsletter" icon={Mail} title="Newsletter" description="Communiquer avec les abonnés" gradient="from-cocoa to-[#171009]" delay={0.2} />
                </div>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
                <AdminPanel
                    title="Cours récents"
                    action={
                        <a href="/admin/cours" className="group flex items-center gap-1 text-xs font-semibold text-emerald transition hover:text-cocoa">
                            Voir tout
                            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                        </a>
                    }
                >
                    <div className="p-3">
                        {courses.length === 0 ? (
                            <p className="py-10 text-center text-sm text-cocoa/40">Aucun cours pour le moment</p>
                        ) : (
                            courses.slice(0, 5).map((c, i) => (
                                <RecentItem
                                    key={c.id}
                                    title={c.title}
                                    subtitle={`${c.modules_count ?? 0} module${(c.modules_count ?? 0) > 1 ? 's' : ''}`}
                                    status={c.is_published ? 'published' : 'draft'}
                                    index={i}
                                />
                            ))
                        )}
                    </div>
                </AdminPanel>

                <AdminPanel
                    title="Témoignages récents"
                    action={
                        <a href="/admin/temoignages" className="group flex items-center gap-1 text-xs font-semibold text-emerald transition hover:text-cocoa">
                            Voir tout
                            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                        </a>
                    }
                >
                    <div className="p-3">
                        {testimonials.length === 0 ? (
                            <p className="py-10 text-center text-sm text-cocoa/40">Aucun témoignage pour le moment</p>
                        ) : (
                            testimonials.slice(0, 5).map((t, i) => (
                                <RecentItem key={t.id} title={t.name} subtitle={t.role || 'Sans rôle'} status={t.is_published ? 'published' : 'draft'} index={i} />
                            ))
                        )}
                    </div>
                </AdminPanel>
            </div>
        </>
    );
}

function ClientDashboard({
    name,
    stats,
    availableCourses,
    myCourses,
}: {
    name: string;
    stats: Stats;
    availableCourses: AvailableCourse[];
    myCourses: MyCourse[];
}) {
    const [pendingId, setPendingId] = useState<number | null>(null);

    const requestAccess = (courseId: number) => {
        setPendingId(courseId);
        router.post(`/cours/${courseId}/acceder`, {}, {
            preserveScroll: true,
            onFinish: () => setPendingId(null),
        });
    };

    return (
        <>
            <HeroBanner name={name} stats={stats} isAdmin={false} />

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
                <AdminStatCard icon={BookOpen} label="Mes accès" value={stats.myCoursesCount ?? myCourses.length} accent="emerald" />
                <AdminStatCard icon={BadgeCheck} label="Cours disponibles" value={stats.availableCoursesCount ?? availableCourses.length} accent="honey" />
                <AdminStatCard icon={TrendingUp} label="Modules" value={myCourses.reduce((n, c) => n + c.modules_count, 0)} accent="terracotta" />
            </div>

            <div id="mes-cours" className="mt-10 scroll-mt-24">
                <div className="mb-5 flex items-center gap-3">
                    <h2 className="ivoire-serif text-xl text-cocoa">Mes cours</h2>
                    <span className="h-px flex-1 bg-gradient-to-r from-cocoa/15 to-transparent" />
                </div>

                {myCourses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-cocoa/15 bg-white/60 p-10 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald/10">
                            <BookOpen size={24} className="text-emerald" />
                        </div>
                        <h3 className="ivoire-serif mt-4 text-lg text-cocoa">Aucun accès pour le moment</h3>
                        <p className="mt-2 text-sm text-cocoa/50">
                            Demande l’accès à un cours ci-dessous — le lien privé sera envoyé par email.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {myCourses.map((course) => (
                            <div
                                key={course.id}
                                className="overflow-hidden rounded-2xl border border-cocoa/[0.07] bg-white/90 shadow-sm"
                            >
                                <div className="aspect-[16/9] bg-cocoa/5">
                                    {course.cover_image ? (
                                        <img src={course.cover_image} alt={course.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-cocoa/25">
                                            <ImageIcon size={28} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-cocoa">{course.title}</h3>
                                    <p className="mt-1 text-xs text-cocoa/45">
                                        {course.modules_count} module{course.modules_count > 1 ? 's' : ''}
                                        {course.link_sent_at
                                            ? ` · lien envoyé le ${new Date(course.link_sent_at).toLocaleDateString('fr-FR')}`
                                            : ''}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <a
                                            href={course.private_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald px-4 py-2.5 text-sm font-medium text-sand transition hover:bg-cocoa"
                                        >
                                            <ExternalLink size={15} />
                                            Ouvrir sur Skool
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => requestAccess(course.id)}
                                            disabled={pendingId === course.id}
                                            className="inline-flex items-center gap-2 rounded-xl border border-cocoa/15 px-4 py-2.5 text-sm font-medium text-cocoa transition hover:bg-sand disabled:opacity-50"
                                        >
                                            <Send size={15} />
                                            {pendingId === course.id ? 'Envoi...' : 'Renvoyer par email'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-12">
                <div className="mb-5 flex items-center gap-3">
                    <h2 className="ivoire-serif text-xl text-cocoa">Cours disponibles</h2>
                    <span className="h-px flex-1 bg-gradient-to-r from-cocoa/15 to-transparent" />
                </div>

                {availableCourses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-cocoa/15 bg-white/60 p-10 text-center">
                        <p className="text-sm text-cocoa/50">Aucun cours publié pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {availableCourses.map((course) => {
                            const hasAccess = !!course.access?.private_link;
                            return (
                                <div
                                    key={course.id}
                                    className="flex flex-col overflow-hidden rounded-2xl border border-cocoa/[0.07] bg-white/90 shadow-sm"
                                >
                                    <div className="aspect-[16/9] bg-cocoa/5">
                                        {course.cover_image ? (
                                            <img src={course.cover_image} alt={course.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-cocoa/25">
                                                <ImageIcon size={28} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="font-semibold text-cocoa">{course.title}</h3>
                                        {course.description && (
                                            <p className="mt-2 line-clamp-2 text-sm text-cocoa/55">{course.description}</p>
                                        )}
                                        <p className="mt-2 text-xs text-cocoa/40">
                                            {course.modules_count} module{course.modules_count > 1 ? 's' : ''}
                                        </p>
                                        <div className="mt-auto pt-4">
                                            {hasAccess ? (
                                                <a
                                                    href={course.access!.private_link!}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald px-4 py-2.5 text-sm font-medium text-sand transition hover:bg-cocoa"
                                                >
                                                    <ExternalLink size={15} />
                                                    Ouvrir le cours
                                                </a>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => requestAccess(course.id)}
                                                    disabled={pendingId === course.id || !course.has_invite_link}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald px-4 py-2.5 text-sm font-medium text-sand transition hover:bg-cocoa disabled:cursor-not-allowed disabled:opacity-50"
                                                    title={!course.has_invite_link ? 'Lien non configuré' : undefined}
                                                >
                                                    <Send size={15} />
                                                    {pendingId === course.id ? 'Envoi...' : 'Accéder au cours'}
                                                </button>
                                            )}
                                            {!course.has_invite_link && !hasAccess && (
                                                <p className="mt-2 text-center text-[11px] text-terracotta/80">
                                                    Lien d’accès bientôt disponible
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export default function Dashboard() {
    const {
        stats,
        testimonials = [],
        courses = [],
        availableCourses = [],
        myCourses = [],
        isAdmin,
        auth,
    } = usePage<PageProps>().props;
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <>
            <Head title={isAdmin ? 'Dashboard' : 'Mon espace'} />
            <AdminShell
                current="/espace"
                title={isAdmin ? 'Dashboard' : 'Mon espace'}
                subtitle={today.charAt(0).toUpperCase() + today.slice(1)}
                user={auth.user}
                isAdmin={isAdmin}
            >
                {isAdmin ? (
                    <AdminDashboard
                        stats={stats}
                        testimonials={testimonials}
                        courses={courses}
                        name={auth.user.name}
                    />
                ) : (
                    <ClientDashboard
                        name={auth.user.name}
                        stats={stats}
                        availableCourses={availableCourses}
                        myCourses={myCourses}
                    />
                )}
            </AdminShell>
        </>
    );
}
