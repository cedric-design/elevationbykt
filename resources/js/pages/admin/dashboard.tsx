import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    MessageSquareQuote,
    Video,
    BookOpen,
    Users,
    Inbox,
    CalendarDays,
    TrendingUp,
    UserCheck,
    ArrowRight,
    Sparkles,
    BadgeCheck,
    Clock,
    ExternalLink,
    Send,
    Image as ImageIcon,
    MapPin,
    Megaphone,
} from 'lucide-react';
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

interface UnreadMessage {
    id: number;
    name: string;
    email: string;
    topic: string;
    message: string;
    created_at: string;
}

interface UpcomingEvent {
    id: number;
    title: string;
    type_label: string;
    place: string;
    starts_at: string | null;
    registrations_count: number;
    access_mode_label: string;
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
    contactMessages: number;
    contactUnread: number;
    events: number;
    eventsPublished: number;
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
    unreadMessages?: UnreadMessage[];
    upcomingEvents?: UpcomingEvent[];
    availableCourses?: AvailableCourse[];
    myCourses?: MyCourse[];
    isAdmin: boolean;
    auth: { user: { name: string; email: string; role: string } };
    [key: string]: unknown;
}

const TOPIC_LABELS: Record<string, string> = {
    partenariat: 'Partenariat',
    presse: 'Presse',
    evenement: 'Événement',
    masterclass: 'Masterclass',
    autre: 'Autre',
};

const rise = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
};

function formatShortDate(iso: string | null) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function SectionTitle({ title, href, linkLabel = 'Voir tout' }: { title: string; href?: string; linkLabel?: string }) {
    return (
        <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="ivoire-serif text-2xl text-cocoa">{title}</h2>
            {href && (
                <a href={href} className="group inline-flex items-center gap-1 text-xs font-semibold text-cocoa/45 transition hover:text-honey">
                    {linkLabel}
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </a>
            )}
        </div>
    );
}

function HeroBanner({ name, stats, isAdmin }: { name: string; stats: Stats; isAdmin: boolean }) {
    const firstName = name.split(' ')[0];

    return (
        <motion.div
            {...rise}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2rem] bg-cocoa text-sand"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                    backgroundImage:
                        'radial-gradient(ellipse 70% 80% at 100% 0%, rgba(199,154,75,0.35), transparent 55%), radial-gradient(ellipse 50% 60% at 0% 100%, rgba(31,107,82,0.25), transparent 50%)',
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.04)_50%,transparent_60%)]" />

            <div className="relative grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:p-10">
                <div>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-honey">
                        <Sparkles size={12} />
                        {isAdmin ? 'Espace admin' : 'Mon espace'}
                    </span>
                    <h2 className="ivoire-serif mt-4 text-4xl leading-[1.05] sm:text-5xl">
                        Bonjour, {firstName}.
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-sand/65 sm:text-base">
                        {isAdmin
                            ? 'Pilote ÉLÉVATION : contenus, événements, messages et communauté — tout au même endroit.'
                            : "Accède à tes formations et poursuis ton parcours d'élévation."}
                    </p>

                    {isAdmin && (
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="/admin/evenements"
                                className="inline-flex items-center gap-2 rounded-full bg-honey px-5 py-2.5 text-sm font-medium text-cocoa transition hover:bg-sand"
                            >
                                <CalendarDays size={15} />
                                Créer un RDV
                            </a>
                            <a
                                href="/admin/contact"
                                className="inline-flex items-center gap-2 rounded-full border border-sand/25 px-5 py-2.5 text-sm font-medium text-sand transition hover:border-honey hover:text-honey"
                            >
                                <Inbox size={15} />
                                Messages
                                {(stats.contactUnread ?? 0) > 0 && (
                                    <span className="rounded-full bg-honey/20 px-2 py-0.5 text-[10px] font-semibold text-honey">
                                        {stats.contactUnread}
                                    </span>
                                )}
                            </a>
                        </div>
                    )}

                    {!isAdmin && (
                        <a
                            href="#mes-cours"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-honey px-6 py-3 text-sm font-semibold text-cocoa transition hover:bg-sand"
                        >
                            <BookOpen size={16} />
                            Voir mes cours
                        </a>
                    )}
                </div>

                {isAdmin && (
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Membres', value: stats.members },
                            { label: 'Cours', value: stats.courses },
                            { label: 'Événements', value: stats.eventsPublished ?? stats.events },
                            { label: 'Messages', value: stats.contactUnread ?? 0, hint: 'non lus' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 backdrop-blur-sm"
                            >
                                <div className="ivoire-serif text-3xl text-sand">{item.value}</div>
                                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-sand/45">
                                    {item.label}
                                    {item.hint ? ` · ${item.hint}` : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function RecentItem({
    title,
    subtitle,
    status,
    index,
}: {
    title: string;
    subtitle: string;
    status: 'published' | 'draft';
    index: number;
}) {
    const palette = ['bg-emerald/10 text-emerald', 'bg-honey/15 text-honey', 'bg-terracotta/10 text-terracotta', 'bg-cocoa/8 text-cocoa'];
    return (
        <div className="flex items-center gap-4 rounded-xl px-3 py-3 transition hover:bg-sand/70">
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
    unreadMessages,
    upcomingEvents,
    name,
}: {
    stats: Stats;
    testimonials: Testimonial[];
    courses: CourseSummary[];
    unreadMessages: UnreadMessage[];
    upcomingEvents: UpcomingEvent[];
    name: string;
}) {
    const kpis = [
        { icon: UserCheck, label: 'Clients', value: stats.clients, subtitle: `${stats.members} membres`, accent: 'cocoa' as const },
        { icon: BookOpen, label: 'Cours', value: stats.courses, subtitle: `${stats.coursesPublished} publiés`, accent: 'emerald' as const },
        { icon: Video, label: 'Contenus', value: stats.contents, subtitle: `${stats.contentsPaid} payants · ${stats.contentsFree} gratuits`, accent: 'honey' as const },
        { icon: CalendarDays, label: 'Événements', value: stats.events, subtitle: `${stats.eventsPublished} publiés`, accent: 'terracotta' as const },
        { icon: Inbox, label: 'Messages non lus', value: stats.contactUnread ?? 0, subtitle: `${stats.contactMessages ?? 0} au total`, accent: 'honey' as const },
        { icon: MessageSquareQuote, label: 'Témoignages', value: stats.testimonials, subtitle: `${stats.published} publiés`, accent: 'emerald' as const },
        { icon: Users, label: 'Administrateurs', value: stats.admins, subtitle: 'Accès équipe', accent: 'cocoa' as const },
        { icon: Megaphone, label: 'Contenus publiés', value: stats.contentsPublished, subtitle: `sur ${stats.contents} contenus`, accent: 'terracotta' as const },
    ];

    return (
        <>
            <HeroBanner name={name} stats={stats} isAdmin />

            <div className="mt-10">
                <SectionTitle title="Indicateurs clés" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {kpis.map((kpi) => (
                        <AdminStatCard
                            key={kpi.label}
                            icon={kpi.icon}
                            label={kpi.label}
                            value={kpi.value}
                            subtitle={kpi.subtitle}
                            accent={kpi.accent}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
                <AdminPanel
                    title="À traiter"
                    action={
                        <a href="/admin/contact" className="text-xs font-semibold text-cocoa/45 transition hover:text-honey">
                            Boîte mail
                        </a>
                    }
                >
                    <div className="p-2">
                        {unreadMessages.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald/10">
                                    <BadgeCheck size={20} className="text-emerald" />
                                </div>
                                <p className="mt-3 text-sm text-cocoa/50">Aucun message non lu</p>
                            </div>
                        ) : (
                            unreadMessages.map((msg) => (
                                <a
                                    key={msg.id}
                                    href="/admin/contact"
                                    className="block rounded-xl px-4 py-3 transition hover:bg-sand/70"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="truncate text-sm font-medium text-cocoa">{msg.name}</p>
                                        <span className="shrink-0 rounded-full bg-honey/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-honey">
                                            {TOPIC_LABELS[msg.topic] || msg.topic}
                                        </span>
                                    </div>
                                    <p className="mt-1 line-clamp-1 text-xs text-cocoa/50">{msg.message}</p>
                                    <p className="mt-1 text-[11px] text-cocoa/35">{formatShortDate(msg.created_at)}</p>
                                </a>
                            ))
                        )}
                    </div>
                </AdminPanel>

                <AdminPanel
                    title="Prochains RDV"
                    action={
                        <a href="/admin/evenements" className="text-xs font-semibold text-cocoa/45 transition hover:text-honey">
                            Gérer
                        </a>
                    }
                >
                    <div className="p-2">
                        {upcomingEvents.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-honey/15">
                                    <CalendarDays size={20} className="text-honey" />
                                </div>
                                <p className="mt-3 text-sm text-cocoa/50">Aucun événement à venir</p>
                                <a href="/admin/evenements" className="mt-3 inline-block text-xs font-medium text-honey hover:text-cocoa">
                                    Créer un rendez-vous
                                </a>
                            </div>
                        ) : (
                            upcomingEvents.map((event) => (
                                <a
                                    key={event.id}
                                    href={`/admin/evenements/${event.id}/inscrits`}
                                    className="block rounded-xl px-4 py-3 transition hover:bg-sand/70"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-cocoa/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cocoa/55">
                                            {event.type_label}
                                        </span>
                                        <span className="text-[10px] text-cocoa/40">{event.access_mode_label}</span>
                                    </div>
                                    <p className="mt-1.5 text-sm font-medium text-cocoa">{event.title}</p>
                                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-cocoa/45">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock size={11} />
                                            {formatShortDate(event.starts_at)}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin size={11} />
                                            {event.place}
                                        </span>
                                        <span>{event.registrations_count} inscrits</span>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </AdminPanel>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
                <AdminPanel
                    title="Cours récents"
                    action={
                        <a href="/admin/cours" className="group flex items-center gap-1 text-xs font-semibold text-cocoa/45 transition hover:text-honey">
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
                        <a href="/admin/temoignages" className="group flex items-center gap-1 text-xs font-semibold text-cocoa/45 transition hover:text-honey">
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
                <SectionTitle title="Mes cours" />

                {myCourses.length === 0 ? (
                    <div className="rounded-[1.75rem] border border-dashed border-cocoa/15 bg-white/60 p-10 text-center">
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
                                className="overflow-hidden rounded-[1.5rem] border border-cocoa/[0.07] bg-white/90 shadow-sm"
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
                                            className="inline-flex items-center gap-2 rounded-full bg-cocoa px-4 py-2.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa"
                                        >
                                            <ExternalLink size={15} />
                                            Ouvrir sur Skool
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => requestAccess(course.id)}
                                            disabled={pendingId === course.id}
                                            className="inline-flex items-center gap-2 rounded-full border border-cocoa/15 px-4 py-2.5 text-sm font-medium text-cocoa transition hover:bg-sand disabled:opacity-50"
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
                <SectionTitle title="Cours disponibles" />

                {availableCourses.length === 0 ? (
                    <div className="rounded-[1.75rem] border border-dashed border-cocoa/15 bg-white/60 p-10 text-center">
                        <p className="text-sm text-cocoa/50">Aucun cours publié pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {availableCourses.map((course) => {
                            const hasAccess = !!course.access?.private_link;
                            return (
                                <div
                                    key={course.id}
                                    className="flex flex-col overflow-hidden rounded-[1.5rem] border border-cocoa/[0.07] bg-white/90 shadow-sm"
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
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cocoa px-4 py-2.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa"
                                                >
                                                    <ExternalLink size={15} />
                                                    Ouvrir le cours
                                                </a>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => requestAccess(course.id)}
                                                    disabled={pendingId === course.id || !course.has_invite_link}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cocoa px-4 py-2.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa disabled:cursor-not-allowed disabled:opacity-50"
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
        unreadMessages = [],
        upcomingEvents = [],
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
                        unreadMessages={unreadMessages}
                        upcomingEvents={upcomingEvents}
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
