import { Head, router, usePage } from '@inertiajs/react';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import {
    Lock,
    Sparkles,
    Sprout,
    Crown,
    Target,
    Wallet,
    Rocket,
    Heart,
    Leaf,
    Gem,
    CalendarDays,
    MapPin,
    ChevronDown,
    BookOpen,
    Video,
    Headphones,
    FileText,
    type LucideIcon,
} from 'lucide-react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import SmartImage from '@/components/ivoire/smart-image';
import ElevationLogo from '@/components/ivoire/elevation-logo';
import {
    FloatingOrbs,
    Magnetic,
    Marquee,
    Reveal,
    SplitLines,
    SplitReveal,
    Stagger,
    StaggerItem,
    TiltFrame,
} from '@/components/ivoire/motion';
import { GALLERY, HERO, IMG } from '@/data/images';
import {
    ABOUT_KADHY,
    ELEVATION_PILLARS,
    FREE_RESOURCES,
    HERO_COPY,
    PROFILE,
    PROGRAMS,
    QUIZ_QUESTIONS,
    QUIZ_RESULTS,
    SKOOL_URL,
    STATS,
    TIMELINE,
    VISION_CLOSING,
    VISION_INTRO,
    VISION_PILLARS,
    VISION_STORY,
} from '@/data/content';

interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    quote: string;
}

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
    category: Category | null;
    is_featured: boolean;
    skool_link?: string | null;
}

interface CourseModule {
    id: number;
    title: string;
    description: string | null;
    sort_order: number;
}

interface CourseItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    has_invite_link: boolean;
    modules_count: number;
    modules: CourseModule[];
}

interface Advertisement {
    id: number;
    title: string;
    image: string;
    link: string | null;
}

interface EventItem {
    id: number;
    slug: string;
    title: string;
    type: string;
    type_label: string;
    description: string | null;
    starts_at: string | null;
    ends_at: string | null;
    place: string;
    access_mode: string;
    access_mode_label: string;
    capacity: number | null;
    registrations_count: number;
    is_full: boolean;
    can_register: boolean;
}

interface PageProps {
    testimonials: Testimonial[];
    contents: Content[];
    courses: CourseItem[];
    events: EventItem[];
    categories: Category[];
    currentContent?: Content | null;
    currentCourse?: CourseItem | null;
    advertisement?: Advertisement | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    unlockedCourseIds: number[];
    auth?: { user?: { name?: string; email?: string; phone?: string } | null };
    [key: string]: unknown;
}

const AppContext = createContext<{
    testimonials: Testimonial[];
    contents: Content[];
    courses: CourseItem[];
    events: EventItem[];
    categories: Category[];
    currentContent?: Content | null;
    currentCourse?: CourseItem | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    unlockedCourseIds: number[];
    authUser: { name?: string; email?: string; phone?: string } | null;
}>({
    testimonials: [],
    contents: [],
    courses: [],
    events: [],
    categories: [],
    currentContent: null,
    currentCourse: null,
    isAuthenticated: false,
    isAdmin: false,
    unlockedCourseIds: [],
    authUser: null,
});

const FALLBACK = 'from-[#1f6b52] via-[#c79a4b] to-[#c96f42]';
const NAV: [string, string][] = [
    ['', 'Accueil'],
    ['a-propos', 'À propos'],
    ['contenus', 'Contenus'],
    ['galerie', 'Galerie'],
    ['contact', 'Contact'],
];
const IVOIRE_ORBS = [
    'radial-gradient(circle, rgba(201,111,66,0.35) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(31,107,82,0.3) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(199,154,75,0.35) 0%, transparent 70%)',
];

const to = (p: string) => (p ? `/${p}` : '/');

function Page({ children }: { children: ReactNode }) {
    return (
        <motion.main
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.99 }}
            transition={{ duration: 0.55, ease: [0.34, 1.2, 0.4, 1] }}
        >
            {children}
        </motion.main>
    );
}

const Kicker = ({ children }: { children: ReactNode }) => (
    <motion.span
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.34, 1.2, 0.4, 1] }}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald"
    >
        <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px w-6 origin-left bg-terracotta"
        />
        {children}
    </motion.span>
);

function Nav() {
    const [open, setOpen] = useState(false);
    const { scrollY } = useScroll();
    const navY = useTransform(scrollY, [0, 100], [16, 8]);
    const { isAuthenticated } = useContext(AppContext);

    return (
        <motion.header style={{ paddingTop: navY }} className="fixed inset-x-0 top-0 z-40">
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-cocoa/10 bg-sand/85 px-5 py-3 shadow-sm backdrop-blur-md sm:px-7"
            >
                <Link to="/" className="ivoire-serif flex items-center gap-2.5 text-xl tracking-wide text-cocoa transition hover:text-emerald">
                    <ElevationLogo size={32} />
                    {PROFILE.brand}
                </Link>
                <nav className="hidden items-center gap-1 md:flex">
                    {NAV.map(([p, l]) => (
                        <NavLink
                            key={p}
                            to={to(p)}
                            end={!p}
                            className={({ isActive }) =>
                                `relative rounded-full px-4 py-2 text-sm transition ${isActive ? 'text-sand' : 'text-cocoa/70 hover:text-cocoa'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {l}
                                    {isActive && (
                                        <motion.span
                                            layoutId="ivoire-nav"
                                            className="absolute inset-0 -z-10 rounded-full bg-emerald shadow-md shadow-emerald/25"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
                <div className="hidden items-center gap-2 md:flex">
                    {isAuthenticated ? (
                        <Magnetic strength={0.16} className="inline-block">
                            <a href="/espace" className="rounded-full bg-emerald px-5 py-2 text-sm font-medium text-sand shadow-md shadow-emerald/25 transition hover:bg-cocoa">
                                Mon espace
                            </a>
                        </Magnetic>
                    ) : (
                        <>
                            <Link to="/connexion" className="rounded-full px-4 py-2 text-sm font-medium text-cocoa/80 transition hover:text-emerald">
                                Se connecter
                            </Link>
                            <Magnetic strength={0.16} className="inline-block">
                                <Link to="/inscription" className="rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-sand shadow-md shadow-terracotta/25 transition hover:bg-cocoa">
                                    S'inscrire
                                </Link>
                            </Magnetic>
                        </>
                    )}
                </div>
                <button onClick={() => setOpen((o) => !o)} className="rounded-full border border-cocoa/20 px-3 py-2 text-sm md:hidden" aria-label="Menu">
                    {open ? '✕' : '☰'}
                </button>
            </motion.div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-cocoa/10 bg-sand/95 md:hidden"
                    >
                        <div className="flex flex-col gap-1 p-3">
                            {NAV.map(([p, l], i) => (
                                <motion.div key={p} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                                    <NavLink
                                        to={to(p)}
                                        end={!p}
                                        onClick={() => setOpen(false)}
                                        className={({ isActive }) =>
                                            `block rounded-2xl px-4 py-3 text-sm ${isActive ? 'bg-emerald/10 text-emerald' : 'text-cocoa/70'}`
                                        }
                                    >
                                        {l}
                                    </NavLink>
                                </motion.div>
                            ))}
                            <div className="mt-2 border-t border-cocoa/10 pt-3">
                                {isAuthenticated ? (
                                    <a
                                        href="/espace"
                                        onClick={() => setOpen(false)}
                                        className="block rounded-2xl bg-emerald px-4 py-3 text-center text-sm font-medium text-sand"
                                    >
                                        Mon espace
                                    </a>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            to="/connexion"
                                            onClick={() => setOpen(false)}
                                            className="rounded-2xl border border-cocoa/20 px-4 py-3 text-center text-sm text-cocoa/80"
                                        >
                                            Se connecter
                                        </Link>
                                        <Link
                                            to="/inscription"
                                            onClick={() => setOpen(false)}
                                            className="rounded-2xl bg-terracotta px-4 py-3 text-center text-sm font-medium text-sand"
                                        >
                                            S'inscrire
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

function Hero() {
    return (
        <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden pb-14 pt-24 sm:pb-16 md:pb-20">
            {/* Portrait studio — ancre sur le visage (~50% / 22%) */}
            <img
                src="/kadhy-hero-studio.jpg"
                alt="Kadhy Touré — Studio"
                className="absolute inset-0 h-full w-full object-cover object-[50%_18%] sm:object-[50%_20%] md:object-[50%_22%] lg:object-[50%_24%]"
            />
            {/* Haut clair pour le visage ; bas sombre pour le texte */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-cocoa via-cocoa/75 to-transparent" />

            <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-2 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="ivoire-serif text-[2.75rem] leading-[0.92] tracking-[0.04em] text-sand sm:text-5xl md:text-6xl lg:text-7xl"
                >
                    ÉLÉVATION
                    <span className="mt-2 block text-[1.15rem] font-normal tracking-[0.22em] text-sand/90 sm:text-2xl md:text-3xl">
                        by Kadhy
                    </span>
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.7 }}
                    className="ivoire-serif mt-5 text-xl text-honey sm:mt-6 sm:text-2xl md:text-3xl"
                >
                    {HERO_COPY.headline}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4"
                >
                    <Magnetic strength={0.16}>
                        <a
                            href="#vision"
                            className="inline-block rounded-full bg-sand px-7 py-3.5 text-sm font-medium text-cocoa transition hover:bg-honey sm:text-base"
                        >
                            {HERO_COPY.ctaDiscover}
                        </a>
                    </Magnetic>
                    <Magnetic strength={0.12}>
                        <a
                            href={SKOOL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block rounded-full border border-sand/50 px-7 py-3.5 text-sm font-medium text-sand transition hover:border-honey hover:text-honey sm:text-base"
                        >
                            {HERO_COPY.ctaJoin}
                        </a>
                    </Magnetic>
                </motion.div>
            </div>
        </section>
    );
}

function StatsSection() {
    return (
        <section className="mx-auto max-w-6xl px-6 py-14">
            <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4" stagger={0.1}>
                {STATS.map((s) => (
                    <StaggerItem key={s.l}>
                        <motion.div
                            whileHover={{ y: -6, rotate: 1 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                            className="ivoire-card-hover rounded-[1.5rem] border border-cocoa/10 bg-white/40 p-6 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                                className="ivoire-serif text-4xl text-emerald"
                            >
                                {s.n}
                            </motion.div>
                            <div className="mt-2 text-xs uppercase tracking-widest text-cocoa/60">{s.l}</div>
                        </motion.div>
                    </StaggerItem>
                ))}
            </Stagger>
        </section>
    );
}

function ContentCard({ content, index }: { content: Content; index: number }) {
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleVideo = () => {
        if (videoRef.current) {
            if (playing) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setPlaying(!playing);
        }
    };

    return (
        <Reveal delay={(index % 3) * 0.08} y={30}>
            <motion.article
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="ivoire-card-hover group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white/50"
            >
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald/25 via-honey/20 to-terracotta/25">
                    {content.video_url && content.type === 'free' ? (
                        <>
                            <video
                                ref={videoRef}
                                src={content.video_url}
                                className="h-full w-full object-cover"
                                onEnded={() => setPlaying(false)}
                            />
                            <motion.div 
                                className={`absolute inset-0 flex items-center justify-center bg-cocoa/30 transition ${playing ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                                onClick={toggleVideo}
                            >
                                <motion.span whileHover={{ scale: 1.15 }} className="grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-sand text-emerald shadow-lg">
                                    {playing ? '⏸' : '▶'}
                                </motion.span>
                            </motion.div>
                        </>
                    ) : content.cover_image ? (
                        <>
                            <img src={content.cover_image} alt={content.title} className="h-full w-full object-cover" />
                            <motion.div className="absolute inset-0 bg-emerald/0 transition duration-500 group-hover:bg-emerald/10" />
                            <div className="absolute inset-0 grid place-items-center">
                                <motion.span whileHover={{ scale: 1.15 }} className="grid h-14 w-14 place-items-center rounded-full bg-sand text-emerald shadow-lg">
                                    ▶
                                </motion.span>
                            </div>
                        </>
                    ) : (
                        <>
                            <motion.div className="absolute inset-0 bg-emerald/0 transition duration-500 group-hover:bg-emerald/10" />
                            <div className="absolute inset-0 grid place-items-center">
                                <motion.span whileHover={{ scale: 1.15 }} className="grid h-14 w-14 place-items-center rounded-full bg-sand text-emerald shadow-lg">
                                    ▶
                                </motion.span>
                            </div>
                        </>
                    )}
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
                        content.type === 'paid' ? 'bg-honey text-cocoa' : 'bg-emerald text-sand'
                    }`}>
                        {content.type === 'paid' ? `${content.price.toLocaleString()} XOF` : 'Gratuit'}
                    </span>
                    {content.is_featured && (
                        <span className="absolute right-4 top-4 rounded-full bg-terracotta px-3 py-1 text-xs font-medium text-sand">
                            ★ En vedette
                        </span>
                    )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                    {content.category && (
                        <span className="text-xs uppercase tracking-widest text-cocoa/45">{content.category.name}</span>
                    )}
                    <h3 className="ivoire-serif mt-1 text-2xl text-cocoa transition group-hover:text-emerald">{content.title}</h3>
                    {content.description && (
                        <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-cocoa/70">{content.description}</p>
                    )}
                    <Link to={`/contenus/${content.slug}`}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`mt-4 w-full rounded-full py-2.5 text-sm font-medium transition ${
                                content.type === 'paid'
                                    ? 'bg-honey text-cocoa hover:bg-honey/80'
                                    : 'border border-emerald/40 text-emerald hover:bg-emerald hover:text-sand'
                            }`}
                        >
                            {content.type === 'paid' ? 'Acheter' : 'Voir le contenu'}
                        </motion.button>
                    </Link>
                </div>
            </motion.article>
        </Reveal>
    );
}

function DynamicContentGrid({ items, limit }: { items: Content[]; limit?: number }) {
    const displayed = limit ? items.slice(0, limit) : items;
    
    if (displayed.length === 0) {
        return (
            <div className="rounded-2xl border border-cocoa/10 bg-white/50 p-12 text-center">
                <p className="text-cocoa/50">Aucun contenu disponible pour le moment</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((c, i) => (
                <ContentCard key={c.id} content={c} index={i} />
            ))}
        </div>
    );
}

function CourseCard({ course, index }: { course: CourseItem; index: number }) {
    return (
        <Reveal delay={(index % 3) * 0.08} y={30}>
            <Link to={`/contenus/cours/${course.slug}`} className="block h-full">
                <motion.article
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="ivoire-card-hover group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white/50"
                >
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald/25 via-honey/20 to-terracotta/25">
                        {course.cover_image ? (
                            <img src={course.cover_image} alt={course.title} className="h-full w-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 grid place-items-center">
                                <span className="text-4xl text-cocoa/25">📚</span>
                            </div>
                        )}
                        <span className="absolute left-4 top-4 rounded-full bg-honey px-3 py-1 text-xs font-medium text-cocoa">
                            Cours
                        </span>
                        {course.modules.length > 0 && (
                            <span className="absolute right-4 top-4 rounded-full bg-cocoa/80 px-3 py-1 text-xs font-medium text-sand">
                                {course.modules.length} module{course.modules.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                        <h3 className="ivoire-serif text-2xl text-cocoa transition group-hover:text-emerald">{course.title}</h3>
                        {course.description && (
                            <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-cocoa/70">{course.description}</p>
                        )}
                        <motion.span
                            className="mt-4 block w-full rounded-full border border-emerald/40 py-2.5 text-center text-sm font-medium text-emerald transition group-hover:bg-emerald group-hover:text-sand"
                        >
                            Voir le cours
                        </motion.span>
                    </div>
                </motion.article>
            </Link>
        </Reveal>
    );
}

function CourseGrid({ items, limit }: { items: CourseItem[]; limit?: number }) {
    const displayed = limit ? items.slice(0, limit) : items;

    if (displayed.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((c, i) => (
                <CourseCard key={c.id} course={c} index={i} />
            ))}
        </div>
    );
}

function VisionSection() {
    return (
        <section id="vision" className="relative scroll-mt-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-sand via-white/30 to-sand" />
            <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[0.95fr_1.05fr]">
                <Reveal delay={0.1}>
                    <TiltFrame intensity={7}>
                        <div className="overflow-hidden rounded-3xl shadow-2xl shadow-cocoa/15">
                            <SmartImage
                                src="/kadhy-studio.png"
                                alt="Kadhy Touré — Notre vision"
                                className="aspect-[4/5] md:aspect-[4/5]"
                                imgClass="transition duration-700 hover:scale-105"
                                fallback={FALLBACK}
                            />
                        </div>
                    </TiltFrame>
                </Reveal>
                <Reveal>
                    <div>
                        <Kicker>Notre vision</Kicker>
                        <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">
                            <SplitReveal text="La naissance d'ÉLÉVATION" delay={0.1} />
                        </h2>
                        {VISION_STORY.map((p, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 + i * 0.08, ease: [0.34, 1.2, 0.4, 1] }}
                                className="mt-5 text-lg leading-relaxed text-cocoa/80"
                            >
                                {p}
                            </motion.p>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-8"
                        >
                            <Magnetic strength={0.14}>
                                <Link
                                    to="/a-propos"
                                    className="inline-flex items-center gap-2 rounded-full border border-cocoa/25 px-7 py-3 font-medium text-cocoa transition hover:border-emerald hover:bg-emerald hover:text-sand"
                                >
                                    En savoir plus
                                    <span className="text-sm">→</span>
                                </Link>
                            </Magnetic>
                        </motion.div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

const PILLAR_ICONS: Record<string, LucideIcon> = {
    Sparkles,
    Sprout,
    Crown,
    Target,
    Wallet,
    Rocket,
    Heart,
    Leaf,
    Gem,
};

function PillarsSection() {
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <section id="piliers" className="ivoire-paper relative scroll-mt-24 overflow-hidden py-24">
            <FloatingOrbs count={3} colors={IVOIRE_ORBS} className="opacity-40" />
            <div className="relative mx-auto max-w-6xl px-6">
                <Reveal>
                    <div className="max-w-2xl">
                        <Kicker>Les piliers</Kicker>
                        <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">Les domaines d'ÉLÉVATION</h2>
                        <p className="mt-4 text-lg text-cocoa/70">
                            Neuf piliers pour grandir de façon complète — clique sur une carte pour en savoir plus.
                        </p>
                    </div>
                </Reveal>

                <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
                    {ELEVATION_PILLARS.map((pillar) => {
                        const Icon = PILLAR_ICONS[pillar.icon] || Sparkles;
                        const open = openId === pillar.id;
                        return (
                            <StaggerItem key={pillar.id}>
                                <motion.button
                                    type="button"
                                    onClick={() => setOpenId(open ? null : pillar.id)}
                                    whileHover={{ y: -4 }}
                                    className="ivoire-card-hover w-full rounded-2xl border border-cocoa/10 bg-white/60 p-5 text-left backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald/10 text-emerald">
                                            <Icon size={20} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-semibold text-cocoa">{pillar.title}</h3>
                                                <ChevronDown
                                                    size={16}
                                                    className={`shrink-0 text-cocoa/40 transition ${open ? 'rotate-180' : ''}`}
                                                />
                                            </div>
                                            <p className="mt-1 text-sm text-cocoa/55">{pillar.short}</p>
                                            <AnimatePresence>
                                                {open && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-3 overflow-hidden text-sm leading-relaxed text-cocoa/75"
                                                    >
                                                        {pillar.body}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.button>
                            </StaggerItem>
                        );
                    })}
                </Stagger>
            </div>
        </section>
    );
}

function ProgramsSection() {
    return (
        <section id="programmes" className="relative scroll-mt-24 py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-sand via-white/40 to-sand" />
            <div className="relative mx-auto max-w-6xl px-6">
                <Reveal>
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <Kicker>Les programmes</Kicker>
                            <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">Tes parcours d'élévation</h2>
                            <p className="mt-4 max-w-xl text-lg text-cocoa/70">
                                Des formats adaptés à ton rythme — du démarrage au cercle privé.
                            </p>
                        </div>
                    </div>
                </Reveal>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {PROGRAMS.map((program, i) => (
                        <Reveal key={program.id} delay={(i % 3) * 0.08} y={28}>
                            <article className="ivoire-card-hover group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white/55">
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={program.image}
                                        alt={program.title}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="ivoire-serif text-2xl text-cocoa">{program.title}</h3>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa/70">{program.blurb}</p>
                                    <a
                                        href={program.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-emerald py-2.5 text-sm font-medium text-sand transition hover:bg-cocoa"
                                    >
                                        {program.cta}
                                    </a>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ElevationQuiz() {
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [resultKey, setResultKey] = useState<string | null>(null);

    const question = QUIZ_QUESTIONS[step];
    const done = resultKey !== null;

    const choose = (optionScores: Record<string, number>) => {
        const next = { ...scores };
        Object.entries(optionScores).forEach(([k, v]) => {
            next[k] = (next[k] || 0) + v;
        });
        setScores(next);

        if (step >= QUIZ_QUESTIONS.length - 1) {
            const best = Object.entries(next).sort((a, b) => b[1] - a[1])[0]?.[0] || 'start';
            setResultKey(best);
        } else {
            setStep((s) => s + 1);
        }
    };

    const reset = () => {
        setStep(0);
        setScores({});
        setResultKey(null);
    };

    const result = resultKey ? QUIZ_RESULTS[resultKey] : null;
    const program = result ? PROGRAMS.find((p) => p.id === result.programId) : null;

    return (
        <section id="test" className="ivoire-paper relative scroll-mt-24 overflow-hidden py-24">
            <FloatingOrbs count={3} colors={IVOIRE_ORBS} className="opacity-35" />
            <div className="relative mx-auto max-w-3xl px-6">
                <Reveal>
                    <div className="text-center">
                        <Kicker>Test d'Élévation</Kicker>
                        <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">
                            Où en es-tu dans ton parcours d'Élévation ?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-cocoa/70">
                            Réponds à quelques questions simples. On te recommande le parcours le plus adapté.
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="mt-10 rounded-[2rem] border border-cocoa/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-10">
                        {!done && question && (
                            <>
                                <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-wider text-cocoa/45">
                                    <span>
                                        Question {step + 1} / {QUIZ_QUESTIONS.length}
                                    </span>
                                    <span className="h-1.5 w-28 overflow-hidden rounded-full bg-cocoa/10">
                                        <span
                                            className="block h-full rounded-full bg-emerald transition-all"
                                            style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                                        />
                                    </span>
                                </div>
                                <h3 className="ivoire-serif text-2xl text-cocoa">{question.question}</h3>
                                <div className="mt-6 space-y-3">
                                    {question.options.map((opt) => (
                                        <button
                                            key={opt.label}
                                            type="button"
                                            onClick={() => choose(opt.scores)}
                                            className="w-full rounded-2xl border border-cocoa/15 bg-sand/40 px-5 py-4 text-left text-sm font-medium text-cocoa transition hover:border-emerald hover:bg-emerald/5 hover:text-emerald"
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {done && result && (
                            <div className="text-center">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald">Ton profil</p>
                                <h3 className="ivoire-serif mt-3 text-3xl text-cocoa">{result.title}</h3>
                                <p className="mx-auto mt-4 max-w-md text-cocoa/70">{result.blurb}</p>
                                <div className="mt-8 flex flex-wrap justify-center gap-3">
                                    <a
                                        href={program?.href || SKOOL_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full bg-emerald px-7 py-3 font-medium text-sand transition hover:bg-cocoa"
                                    >
                                        Accéder au programme
                                    </a>
                                    <button
                                        type="button"
                                        onClick={reset}
                                        className="rounded-full border border-cocoa/20 px-7 py-3 font-medium text-cocoa transition hover:border-terracotta hover:text-terracotta"
                                    >
                                        Refaire le test
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function EventsSection() {
    const { events, authUser } = useContext(AppContext);
    const [selected, setSelected] = useState<EventItem | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    const formatEventDate = (iso: string | null) => {
        if (!iso) return 'Date à confirmer';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return 'Date à confirmer';
        return d.toLocaleString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const openRegister = (event: EventItem) => {
        setSelected(event);
        setName(authUser?.name || '');
        setEmail(authUser?.email || '');
        setPhone(authUser?.phone || '');
        setMessage('');
        setError('');
        setDone(false);
    };

    const closeRegister = () => {
        setSelected(null);
        setDone(false);
        setError('');
        setMessage('');
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch(`/evenements/${selected.id}/inscrire`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name,
                    email,
                    phone: phone || null,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const firstError =
                    data?.errors && typeof data.errors === 'object'
                        ? (Object.values(data.errors).flat()[0] as string | undefined)
                        : undefined;
                setError(firstError || data?.message || "Impossible de finaliser l'inscription.");
                return;
            }

            setMessage(data.message || 'Inscription confirmée !');
            setDone(true);
        } catch {
            setError('Erreur de connexion. Réessaie dans un instant.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="evenements" className="relative scroll-mt-24 py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-sand via-white/30 to-sand" />
            <div className="relative mx-auto max-w-6xl px-6">
                <Reveal>
                    <Kicker>Les événements</Kicker>
                    <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">Prochains rendez-vous</h2>
                    <p className="mt-4 max-w-xl text-lg text-cocoa/70">
                        Conférences, masterclass, retraites et rencontres pour vivre ÉLÉVATION en vrai.
                    </p>
                </Reveal>

                {events.length === 0 ? (
                    <Reveal delay={0.1}>
                        <div className="mt-12 rounded-[1.75rem] border border-dashed border-cocoa/15 bg-white/40 px-8 py-14 text-center">
                            <p className="ivoire-serif text-2xl text-cocoa">Bientôt de nouveaux rendez-vous</p>
                            <p className="mx-auto mt-3 max-w-md text-sm text-cocoa/55">
                                Les prochaines conférences et masterclass seront annoncées ici. Rejoins la newsletter pour être prévenu·e.
                            </p>
                            <a
                                href="#newsletter"
                                className="mt-6 inline-flex rounded-full bg-cocoa px-6 py-2.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa"
                            >
                                Rejoindre la newsletter
                            </a>
                        </div>
                    </Reveal>
                ) : (
                    <div className="mt-12 grid gap-5 md:grid-cols-2">
                        {events.map((event, i) => (
                            <Reveal key={event.id} delay={(i % 2) * 0.08}>
                                <article className="flex h-full flex-col rounded-[1.75rem] border border-cocoa/10 bg-white/60 p-6 backdrop-blur-sm">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-honey/20 px-3 py-1 text-xs font-medium text-honey">
                                            {event.type_label}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                event.access_mode === 'open'
                                                    ? 'bg-emerald/10 text-emerald'
                                                    : 'bg-cocoa/8 text-cocoa/60'
                                            }`}
                                        >
                                            {event.access_mode_label}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs text-cocoa/45">
                                            <CalendarDays size={12} /> {formatEventDate(event.starts_at)}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs text-cocoa/45">
                                            <MapPin size={12} /> {event.place}
                                        </span>
                                    </div>
                                    <h3 className="ivoire-serif mt-4 text-2xl text-cocoa">{event.title}</h3>
                                    {event.description && (
                                        <p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa/70">{event.description}</p>
                                    )}
                                    {event.is_full ? (
                                        <span className="mt-6 inline-flex w-fit rounded-full border border-cocoa/15 px-6 py-2.5 text-sm font-medium text-cocoa/45">
                                            Complet
                                        </span>
                                    ) : event.can_register ? (
                                        <button
                                            type="button"
                                            onClick={() => openRegister(event)}
                                            className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-emerald px-6 py-2.5 text-sm font-medium text-sand transition hover:bg-cocoa"
                                        >
                                            S'inscrire
                                        </button>
                                    ) : (
                                        <Link
                                            to="/contact"
                                            className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-cocoa/20 px-6 py-2.5 text-sm font-medium text-cocoa transition hover:border-emerald hover:bg-emerald hover:text-sand"
                                        >
                                            Demander une invitation
                                        </Link>
                                    )}
                                </article>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" onClick={closeRegister} />
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.96 }}
                            className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-2xl"
                        >
                            <div className="border-b border-cocoa/10 px-6 py-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-honey">
                                    {selected.type_label}
                                </p>
                                <h3 className="ivoire-serif mt-1 text-2xl text-cocoa">{selected.title}</h3>
                                <p className="mt-2 text-sm text-cocoa/55">
                                    {formatEventDate(selected.starts_at)} · {selected.place}
                                </p>
                            </div>

                            {done ? (
                                <div className="px-6 py-8">
                                    <p className="ivoire-serif text-3xl text-cocoa">C’est noté.</p>
                                    <p className="mt-3 text-sm text-cocoa/65">{message}</p>
                                    <button
                                        type="button"
                                        onClick={closeRegister}
                                        className="mt-8 w-full rounded-full bg-cocoa py-3 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-4 px-6 py-6">
                                    <p className="text-sm text-cocoa/60">
                                        Aucun compte requis — laisse tes coordonnées pour confirmer ta place.
                                    </p>
                                    <input
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ton nom"
                                        className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                                    />
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ton@email.com"
                                        className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                                    />
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Téléphone (optionnel)"
                                        className="w-full rounded-xl border border-cocoa/15 bg-sand/40 px-4 py-3 text-cocoa outline-none focus:border-honey"
                                    />
                                    {error && <p className="text-sm text-terracotta">{error}</p>}
                                    <div className="flex gap-3 pt-1">
                                        <button
                                            type="button"
                                            onClick={closeRegister}
                                            className="flex-1 rounded-full border border-cocoa/15 py-3 text-sm font-medium text-cocoa"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 rounded-full bg-emerald py-3 text-sm font-medium text-sand transition hover:bg-cocoa disabled:opacity-60"
                                        >
                                            {loading ? 'Envoi…' : 'Confirmer'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

const RESOURCE_ICONS: Record<string, LucideIcon> = {
    'Guide PDF': FileText,
    Vidéo: Video,
    Podcast: Headphones,
    Article: BookOpen,
};

function FreeResourcesSection() {
    const { contents } = useContext(AppContext);
    const freeContents = contents.filter((c) => c.type === 'free').slice(0, 3);

    return (
        <section id="ressources" className="ivoire-paper relative scroll-mt-24 overflow-hidden py-24">
            <FloatingOrbs count={2} colors={IVOIRE_ORBS} className="opacity-30" />
            <div className="relative mx-auto max-w-6xl px-6">
                <Reveal>
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <Kicker>Ressources gratuites</Kicker>
                            <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">De la valeur avant l'inscription</h2>
                            <p className="mt-4 max-w-xl text-lg text-cocoa/70">
                                Articles, vidéos, guides et contenus pour commencer à t'élever dès maintenant.
                            </p>
                        </div>
                        <Link to="/contenus" className="hidden text-sm text-cocoa/70 hover:text-emerald sm:block">
                            Voir tout →
                        </Link>
                    </div>
                </Reveal>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {FREE_RESOURCES.map((res, i) => {
                        const Icon = RESOURCE_ICONS[res.type] || BookOpen;
                        return (
                            <Reveal key={res.id} delay={(i % 4) * 0.06}>
                                <article className="flex h-full flex-col rounded-2xl border border-cocoa/10 bg-white/55 p-5">
                                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald/10 text-emerald">
                                        <Icon size={18} />
                                    </span>
                                    <span className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-cocoa/40">
                                        {res.type}
                                    </span>
                                    <h3 className="mt-1 font-semibold text-cocoa">{res.title}</h3>
                                    <p className="mt-2 flex-1 text-sm text-cocoa/65">{res.blurb}</p>
                                    <Link to="/contenus" className="mt-4 text-sm font-medium text-emerald hover:text-cocoa">
                                        Découvrir →
                                    </Link>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>

                {freeContents.length > 0 && (
                    <div className="mt-14">
                        <h3 className="ivoire-serif text-2xl text-cocoa">Contenus gratuits</h3>
                        <div className="mt-6">
                            <DynamicContentGrid items={freeContents} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function Newsletter() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const subscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError(false);

        try {
            const res = await fetch('/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setEmail('');
            } else {
                setError(true);
                setMessage(data.message || 'Une erreur est survenue.');
            }
        } catch {
            setError(true);
            setMessage('Erreur de connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="newsletter" className="relative scroll-mt-24 py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <Reveal>
                    <div className="relative overflow-hidden rounded-[2rem] bg-cocoa px-8 py-14 text-sand sm:px-12 sm:py-16 md:px-16 md:py-20">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-60"
                            style={{
                                backgroundImage:
                                    'radial-gradient(ellipse 70% 60% at 0% 0%, rgba(199,154,75,0.28), transparent 55%), radial-gradient(ellipse 55% 50% at 100% 100%, rgba(201,111,66,0.18), transparent 50%)',
                            }}
                        />
                        <div className="relative">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-honey">
                                    Rester en lien
                                </p>
                                <h2 className="ivoire-serif mt-4 text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
                                    Newsletter & contact
                                </h2>
                                <p className="mt-5 max-w-lg text-base leading-relaxed text-sand/70 sm:text-lg">
                                    Inspire-toi chaque semaine, ou écris-nous pour un projet, un événement, un partenariat.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-12 border-t border-sand/15 pt-12 md:grid-cols-2 md:gap-16">
                                <div>
                                    <h3 className="ivoire-serif text-2xl text-honey md:text-3xl">Newsletter</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-sand/65 sm:text-base">
                                        Conseils, ressources et actualités ÉLÉVATION — sans spam.
                                    </p>
                                    <form onSubmit={subscribe} className="mt-8">
                                        <label htmlFor="home-newsletter-email" className="sr-only">
                                            Adresse e-mail
                                        </label>
                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <input
                                                id="home-newsletter-email"
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="ton@email.com"
                                                className="w-full rounded-full border border-sand/20 bg-sand/10 px-5 py-3.5 text-sand outline-none transition placeholder:text-sand/40 focus:border-honey focus:bg-sand/15"
                                            />
                                            <motion.button
                                                type="submit"
                                                whileHover={!loading ? { scale: 1.03 } : undefined}
                                                whileTap={!loading ? { scale: 0.97 } : undefined}
                                                disabled={loading}
                                                className="shrink-0 rounded-full bg-honey px-7 py-3.5 text-sm font-medium text-cocoa transition hover:bg-sand disabled:opacity-60"
                                            >
                                                {loading ? '...' : "S'inscrire"}
                                            </motion.button>
                                        </div>
                                        <AnimatePresence>
                                            {message && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`mt-3 text-sm ${error ? 'text-terracotta' : 'text-honey'}`}
                                                >
                                                    {message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </form>
                                </div>

                                <div id="contact-home">
                                    <h3 className="ivoire-serif text-2xl text-honey md:text-3xl">Contact</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-sand/65 sm:text-base">
                                        Presse, partenariats, événements — on te répond avec attention.
                                    </p>
                                    <a
                                        href="mailto:contact@elevationbykadhy.com"
                                        className="mt-8 inline-block text-lg text-sand transition hover:text-honey sm:text-xl"
                                    >
                                        contact@elevationbykadhy.com
                                    </a>
                                    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-sand/45">
                                        {['Instagram', 'Facebook', 'YouTube', 'TikTok'].map((social) => (
                                            <span key={social} className="transition hover:text-sand">
                                                {social}
                                            </span>
                                        ))}
                                    </div>
                                    <Magnetic strength={0.12} className="mt-8 inline-block">
                                        <Link
                                            to="/contact"
                                            className="inline-flex items-center gap-2 rounded-full border border-sand/30 px-6 py-3 text-sm font-medium text-sand transition hover:border-honey hover:bg-honey hover:text-cocoa"
                                        >
                                            Formulaire de contact
                                            <span aria-hidden>→</span>
                                        </Link>
                                    </Magnetic>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

function Testimonials() {
    const { testimonials } = useContext(AppContext);
    
    if (testimonials.length === 0) {
        return null;
    }

    const row = [...testimonials, ...testimonials];
    return (
        <section id="temoignages" className="relative scroll-mt-24 overflow-hidden py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-sand via-white/40 to-sand" />
            <div className="relative">
                <Reveal>
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <Kicker>Témoignages</Kicker>
                        <h2 className="ivoire-serif mt-3 text-4xl text-cocoa md:text-5xl">Ils s'élèvent avec nous</h2>
                        <p className="mx-auto mt-4 max-w-xl text-cocoa/70">
                            Des femmes et des hommes qui ont choisi de passer de l'intention à l'action.
                        </p>
                    </div>
                </Reveal>

                <div className="group relative mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
                    <motion.div
                        className="flex w-max gap-6 px-3"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                        style={{ willChange: 'transform' }}
                    >
                        {row.map((t, i) => (
                            <article
                                key={i}
                                className="flex w-[320px] shrink-0 flex-col rounded-[1.5rem] border border-cocoa/10 bg-white/70 p-7 shadow-sm backdrop-blur-sm sm:w-[380px]"
                            >
                                <span className="ivoire-serif text-5xl leading-none text-honey">“</span>
                                <p className="-mt-3 flex-1 text-cocoa/80 leading-relaxed">{t.quote}</p>
                                <div className="mt-5 flex items-center gap-3 border-t border-cocoa/10 pt-4">
                                    <span className="ivoire-serif grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald text-lg text-sand">
                                        {t.name.charAt(0)}
                                    </span>
                                    <div>
                                        <div className="text-sm font-semibold text-cocoa">{t.name}</div>
                                        <div className="text-xs text-cocoa/55">{t.role || ''}</div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function Home() {
    const { contents, courses } = useContext(AppContext);
    const featuredContents = contents.filter((c) => c.is_featured).slice(0, 3);
    const displayContents = featuredContents.length > 0 ? featuredContents : contents.slice(0, 3);
    const displayCourses = courses.slice(0, 3);
    const hasCatalog = displayCourses.length > 0 || displayContents.length > 0;

    return (
        <Page>
            <Hero />
            <StatsSection />
            <VisionSection />
            <PillarsSection />
            <ProgramsSection />
            {hasCatalog && (
                <section className="mx-auto max-w-6xl px-6 py-14">
                    <Reveal>
                        <div className="flex items-end justify-between">
                            <div>
                                <Kicker>Contenus & cours</Kicker>
                                <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">À découvrir</h2>
                            </div>
                            <Link to="/contenus" className="hidden text-sm text-cocoa/70 hover:text-emerald sm:block">
                                Tout voir →
                            </Link>
                        </div>
                    </Reveal>
                    {displayCourses.length > 0 && (
                        <div className="mt-10">
                            <CourseGrid items={displayCourses} />
                        </div>
                    )}
                    {displayContents.length > 0 && (
                        <div className="mt-10">
                            <DynamicContentGrid items={displayContents} />
                        </div>
                    )}
                </section>
            )}
            <ElevationQuiz />
            <Testimonials />
            <EventsSection />
            <FreeResourcesSection />
            <Newsletter />
        </Page>
    );
}

function VisionMedia() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const yImg = useTransform(scrollYProgress, [0, 1], [40, -40]);
    const scaleImg = useTransform(scrollYProgress, [0, 1], [1.06, 1]);

    return (
        <div ref={ref} className="relative overflow-hidden rounded-[1.75rem]">
            <motion.div style={{ y: yImg, scale: scaleImg }} className="relative">
                <SmartImage
                    src="/kadhy-hero-studio.jpg"
                    alt="Kadhy Touré — ÉLÉVATION"
                    className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"
                    imgClass="h-full w-full object-cover object-[50%_18%]"
                    fallback={FALLBACK}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 via-cocoa/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-honey">ÉLÉVATION</p>
                    <p className="ivoire-serif mt-2 text-3xl leading-tight text-sand sm:text-4xl">Élève ta vie.</p>
                </div>
            </motion.div>
        </div>
    );
}

function APropos() {
    const pillarIcons = ['✦', '☼', '♡', '⚡', '◆', '★'];

    return (
        <Page>
            <div className="mx-auto max-w-6xl px-6 pt-32">
                {/* Hero À propos */}
                <div className="grid items-center gap-14 md:grid-cols-[0.9fr_1.1fr]">
                    <Reveal>
                        <div className="overflow-hidden rounded-3xl shadow-2xl shadow-cocoa/15">
                            <SmartImage
                                src="/kadhy-studio.png"
                                alt="Kadhy Touré — Studio"
                                className="aspect-[4/3]"
                                imgClass="transition duration-700 hover:scale-105"
                                fallback={FALLBACK}
                            />
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <Kicker>À propos</Kicker>
                        <h1 className="ivoire-serif mt-4 text-5xl text-cocoa md:text-6xl lg:text-7xl">
                            <SplitReveal text="Kadhy Touré" delay={0.12} />
                        </h1>
                        <div className="mt-8 space-y-5">
                            {ABOUT_KADHY.map((p, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.07, ease: [0.34, 1.2, 0.4, 1] }}
                                    className={`text-lg leading-relaxed ${i === ABOUT_KADHY.length - 1 ? 'ivoire-serif text-xl text-emerald' : 'text-cocoa/80'}`}
                                >
                                    {p}
                                </motion.p>
                            ))}
                        </div>
                    </Reveal>
                </div>

                {/* Timeline */}
                <div className="mt-24">
                    <Reveal>
                        <div className="text-center">
                            <Kicker>Parcours</Kicker>
                            <h2 className="ivoire-serif mt-3 text-4xl text-cocoa md:text-5xl">Étapes clés</h2>
                        </div>
                    </Reveal>
                    <div className="relative mt-14">
                        <motion.div
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-2 left-4 top-2 w-px origin-top bg-gradient-to-b from-emerald via-honey to-terracotta md:left-1/2 md:-translate-x-1/2"
                        />
                        <div className="space-y-8 md:space-y-4">
                            {TIMELINE.map((item, i) => {
                                const left = i % 2 === 0;
                                const card = (
                                    <motion.div
                                        initial={{ opacity: 0, x: left ? -30 : 30, y: 10 }}
                                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        whileHover={{ y: -4 }}
                                        className={`ivoire-card-hover ml-12 rounded-2xl border border-cocoa/10 bg-white/60 p-6 md:ml-0 ${left ? 'md:text-right' : ''}`}
                                    >
                                        <span className="ivoire-serif inline-block rounded-full bg-emerald px-4 py-1 text-sm font-medium text-sand shadow-sm shadow-emerald/25">
                                            {item.y}
                                        </span>
                                        <h3 className="mt-3 text-xl font-semibold text-cocoa">{item.t}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-cocoa/70">{item.d}</p>
                                    </motion.div>
                                );
                                return (
                                    <div key={item.y} className="relative md:grid md:grid-cols-2 md:gap-12">
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                                            className="absolute left-4 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-terracotta ring-4 ring-sand md:left-1/2"
                                        />
                                        {left ? (
                                            <>
                                                {card}
                                                <div className="hidden md:block" />
                                            </>
                                        ) : (
                                            <>
                                                <div className="hidden md:block" />
                                                {card}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Vision d'ÉLÉVATION — composition pleine largeur, sans colonne vide */}
                <div className="ivoire-paper relative mt-24 -mx-6 rounded-[2rem] px-6 py-20 md:mx-0 md:px-12">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
                        <FloatingOrbs count={3} colors={IVOIRE_ORBS} className="opacity-40" />
                    </div>

                    <div className="relative grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
                        <aside className="lg:sticky lg:top-28 lg:self-start">
                            <VisionMedia />
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                {[
                                    { big: '6', small: 'domaines de vie' },
                                    { big: '100%', small: "passage à l'action" },
                                ].map((f) => (
                                    <div
                                        key={f.small}
                                        className="rounded-2xl border border-cocoa/10 bg-white/55 px-4 py-4 text-center backdrop-blur-sm"
                                    >
                                        <div className="ivoire-serif text-2xl text-emerald">{f.big}</div>
                                        <div className="mt-1 text-[11px] leading-tight text-cocoa/60">{f.small}</div>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        <div>
                            <Reveal>
                                <Kicker>Notre mission</Kicker>
                                <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">
                                    <SplitReveal text="La vision d'ÉLÉVATION" delay={0.12} />
                                </h2>
                            </Reveal>

                            <div className="mt-8 space-y-5">
                                {VISION_INTRO.map((p, i) => (
                                    <Reveal key={i} delay={i * 0.06}>
                                        <p className="text-lg leading-relaxed text-cocoa/80">{p}</p>
                                    </Reveal>
                                ))}
                            </div>

                            <Stagger className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2" stagger={0.06}>
                                {VISION_PILLARS.map((pillar, i) => (
                                    <StaggerItem key={pillar}>
                                        <motion.div
                                            whileHover={{ y: -3 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                            className="ivoire-card-hover flex items-center gap-3 rounded-xl border border-cocoa/10 bg-white/60 px-4 py-3"
                                        >
                                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald/10 text-sm text-emerald">
                                                {pillarIcons[i]}
                                            </span>
                                            <span className="text-sm font-medium text-cocoa">{pillar}</span>
                                        </motion.div>
                                    </StaggerItem>
                                ))}
                            </Stagger>

                            <div className="mt-10 space-y-5">
                                {VISION_CLOSING.map((p, i) => (
                                    <Reveal key={i} delay={i * 0.06}>
                                        <p
                                            className={`leading-relaxed ${
                                                i >= VISION_CLOSING.length - 2
                                                    ? 'ivoire-serif text-xl text-cocoa md:text-2xl'
                                                    : 'text-lg text-cocoa/80'
                                            }`}
                                        >
                                            {p}
                                        </p>
                                    </Reveal>
                                ))}
                            </div>

                            <Reveal delay={0.2}>
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="mt-8 h-1 w-24 origin-left rounded-full bg-gradient-to-r from-emerald via-honey to-terracotta"
                                />
                            </Reveal>

                            <Reveal delay={0.25}>
                                <div className="mt-8">
                                    <Magnetic strength={0.18}>
                                        <Link
                                            to="/contact"
                                            className="inline-block rounded-full bg-emerald px-8 py-3.5 font-medium text-sand shadow-lg shadow-emerald/25 transition hover:bg-cocoa hover:shadow-cocoa/20"
                                        >
                                            Rejoindre ÉLÉVATION
                                        </Link>
                                    </Magnetic>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}

function Contenus() {
    const { contents, courses, categories } = useContext(AppContext);
    const [typeFilter, setTypeFilter] = useState<'all' | 'free' | 'paid' | 'courses'>('all');
    const [categoryFilter, setCategoryFilter] = useState<number | null>(null);

    const showCourses = typeFilter === 'all' || typeFilter === 'courses';
    const showContents = typeFilter !== 'courses';

    const filteredContents = contents.filter(c => {
        if (typeFilter === 'free' && c.type !== 'free') return false;
        if (typeFilter === 'paid' && c.type !== 'paid') return false;
        if (categoryFilter !== null && c.category?.id !== categoryFilter) return false;
        return true;
    });

    const visibleCount =
        (showCourses ? courses.length : 0) + (showContents ? filteredContents.length : 0);

    return (
        <Page>
            <div className="mx-auto max-w-6xl px-6 pt-32">
                <Reveal blur={6}>
                    <Kicker>Contenus · Cours · Vidéos</Kicker>
                    <h1 className="ivoire-serif mt-4 text-6xl text-cocoa md:text-7xl">L'académie</h1>
                    <p className="mt-5 max-w-2xl text-lg text-cocoa/75">
                        Émissions, films à la demande, masterclass et programmes — un catalogue pour apprendre, s'inspirer et passer à l'action.
                    </p>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            {(
                                [
                                    ['all', 'Tous'],
                                    ['courses', 'Cours'],
                                    ['free', 'Gratuits'],
                                    ['paid', 'Payants'],
                                ] as const
                            ).map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => setTypeFilter(value)}
                                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                                        typeFilter === value
                                            ? value === 'paid'
                                                ? 'bg-honey text-cocoa'
                                                : 'bg-emerald text-sand'
                                            : 'border border-cocoa/15 text-cocoa/70 hover:border-emerald hover:text-emerald'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {categories.length > 0 && showContents && (
                            <div className="flex items-center gap-2 border-l border-cocoa/15 pl-4">
                                <span className="text-xs text-cocoa/50">Catégorie :</span>
                                <select
                                    value={categoryFilter ?? ''}
                                    onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : null)}
                                    className="rounded-lg border border-cocoa/15 bg-transparent px-3 py-1.5 text-sm text-cocoa outline-none focus:border-emerald"
                                >
                                    <option value="">Toutes</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <span className="ml-auto text-sm text-cocoa/50">
                            {visibleCount} élément{visibleCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                </Reveal>

                {showCourses && courses.length > 0 && (
                    <div className="mt-10">
                        {typeFilter === 'all' && (
                            <h2 className="ivoire-serif mb-6 text-2xl text-cocoa">Cours</h2>
                        )}
                        <CourseGrid items={courses} />
                    </div>
                )}

                {showContents && filteredContents.length > 0 && (
                    <div className="mt-10">
                        {typeFilter === 'all' && courses.length > 0 && (
                            <h2 className="ivoire-serif mb-6 text-2xl text-cocoa">Contenus</h2>
                        )}
                        <DynamicContentGrid items={filteredContents} />
                    </div>
                )}

                {visibleCount === 0 && (
                    <div className="mt-10 rounded-2xl border border-cocoa/10 bg-white/50 p-12 text-center">
                        <p className="text-cocoa/50">Aucun élément disponible pour le moment</p>
                    </div>
                )}

                <Reveal delay={0.1}>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative mt-14 overflow-hidden rounded-[2rem]">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald via-emerald/90 to-[#1a5a45]" />
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        />
                        <div className="relative flex flex-col items-center justify-between gap-6 px-10 py-10 text-sand md:flex-row">
                            <div>
                                <h3 className="ivoire-serif text-3xl">Rejoignez la communauté</h3>
                                <p className="mt-2 max-w-md text-sand/80">Accédez à tous les contenus, aux coulisses et aux masterclass dès leur sortie.</p>
                            </div>
                            <Magnetic strength={0.18}>
                                <Link to="/contact" className="inline-block whitespace-nowrap rounded-full bg-honey px-8 py-3.5 font-medium text-cocoa transition hover:bg-sand hover:shadow-lg">
                                    S'abonner
                                </Link>
                            </Magnetic>
                        </div>
                    </motion.div>
                </Reveal>
            </div>
        </Page>
    );
}

function CourseDetail() {
    const { courses, isAuthenticated, unlockedCourseIds } = useContext(AppContext);
    const slug = window.location.pathname.split('/').pop();
    const course = courses.find((c) => c.slug === slug);
    const [paying, setPaying] = useState(false);

    if (!course) {
        return (
            <Page>
                <div className="mx-auto max-w-4xl px-6 pt-32 text-center">
                    <h1 className="ivoire-serif text-4xl text-cocoa">Cours introuvable</h1>
                    <p className="mt-4 text-cocoa/70">Ce cours n'existe pas ou n'est plus disponible.</p>
                    <Link to="/contenus" className="mt-6 inline-block rounded-full bg-emerald px-6 py-3 text-sand">
                        Voir tous les contenus
                    </Link>
                </div>
            </Page>
        );
    }

    const alreadyUnlocked = unlockedCourseIds.includes(course.id);
    const loginRedirect = `/connexion?redirect=${encodeURIComponent(`/contenus/cours/${course.slug}`)}`;

    const handlePay = () => {
        if (!isAuthenticated) {
            window.location.href = loginRedirect;
            return;
        }
        setPaying(true);
        router.post(`/cours/${course.id}/acceder`, {}, {
            preserveScroll: true,
            onFinish: () => setPaying(false),
        });
    };

    return (
        <Page>
            <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
                <Reveal>
                    <Link to="/contenus" className="mb-6 inline-flex items-center gap-2 text-sm text-cocoa/60 hover:text-emerald">
                        ← Retour aux contenus
                    </Link>
                </Reveal>

                <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
                    <div>
                        <Reveal>
                            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald/20 via-honey/10 to-terracotta/20">
                                {course.cover_image ? (
                                    <img src={course.cover_image} alt={course.title} className="aspect-video w-full object-cover" />
                                ) : (
                                    <div className="aspect-video grid place-items-center text-6xl text-cocoa/30">📚</div>
                                )}
                            </div>
                        </Reveal>

                        {course.description && (
                            <Reveal delay={0.1}>
                                <div className="mt-10">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-cocoa/60">À propos du cours</h2>
                                    <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-cocoa/80">
                                        {course.description}
                                    </p>
                                </div>
                            </Reveal>
                        )}

                        <Reveal delay={0.15}>
                            <div className="mt-12">
                                <h2 className="ivoire-serif text-3xl text-cocoa">Programme</h2>
                                <p className="mt-2 text-sm text-cocoa/55">
                                    {course.modules.length} module{course.modules.length !== 1 ? 's' : ''} inclus
                                </p>

                                {course.modules.length === 0 ? (
                                    <p className="mt-6 rounded-2xl border border-dashed border-cocoa/15 bg-white/50 p-8 text-center text-sm text-cocoa/50">
                                        Le détail des modules sera bientôt disponible.
                                    </p>
                                ) : (
                                    <ol className="mt-6 space-y-3">
                                        {course.modules.map((mod, i) => (
                                            <li
                                                key={mod.id}
                                                className="flex gap-4 rounded-2xl border border-cocoa/10 bg-white/70 p-5"
                                            >
                                                <span className="ivoire-serif grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald/10 text-emerald">
                                                    {i + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-cocoa">{mod.title}</div>
                                                    {mod.description && (
                                                        <p className="mt-1 text-sm leading-relaxed text-cocoa/60">{mod.description}</p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                        </Reveal>
                    </div>

                    <div>
                        <Reveal delay={0.1}>
                            <div className="sticky top-28 rounded-[1.75rem] border border-cocoa/10 bg-white/80 p-7 shadow-sm backdrop-blur-sm">
                                <span className="text-xs uppercase tracking-widest text-cocoa/50">Cours Skool</span>
                                <h1 className="ivoire-serif mt-2 text-3xl text-cocoa lg:text-4xl">{course.title}</h1>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-honey/20 px-3 py-1 text-xs font-medium text-honey">
                                        Accès sur invitation
                                    </span>
                                    {course.modules.length > 0 && (
                                        <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-medium text-emerald">
                                            {course.modules.length} modules
                                        </span>
                                    )}
                                </div>

                                <p className="mt-6 text-sm leading-relaxed text-cocoa/65">
                                    Après paiement, tu reçois par email ton lien d’invitation privé pour rejoindre le cours sur Skool.
                                </p>

                                <div className="mt-8">
                                    {!course.has_invite_link ? (
                                        <p className="rounded-2xl border border-cocoa/10 bg-sand/50 p-5 text-center text-sm text-cocoa/60">
                                            Les inscriptions ouvriront bientôt.
                                        </p>
                                    ) : alreadyUnlocked ? (
                                        <div className="space-y-3">
                                            <p className="rounded-xl bg-emerald/10 px-4 py-3 text-center text-sm text-emerald">
                                                Lien déjà envoyé — vérifie ta boîte mail ou ton espace.
                                            </p>
                                            <motion.button
                                                type="button"
                                                onClick={handlePay}
                                                disabled={paying}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full rounded-full border border-emerald/40 py-3.5 text-sm font-medium text-emerald transition hover:bg-emerald hover:text-sand disabled:opacity-60"
                                            >
                                                {paying ? 'Envoi...' : 'Renvoyer le lien par email'}
                                            </motion.button>
                                            <Link
                                                to="/espace"
                                                className="block w-full rounded-full bg-emerald py-3.5 text-center text-sm font-medium text-sand transition hover:bg-cocoa"
                                            >
                                                Voir mon espace
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <motion.button
                                                type="button"
                                                onClick={handlePay}
                                                disabled={paying}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex w-full items-center justify-center gap-2 rounded-full bg-honey py-4 text-lg font-medium text-cocoa shadow-lg shadow-honey/30 transition hover:bg-honey/90 disabled:opacity-60"
                                            >
                                                {paying ? 'Traitement...' : 'Payer'}
                                            </motion.button>
                                            {!isAuthenticated && (
                                                <p className="text-center text-xs text-cocoa/50">
                                                    Connexion requise pour recevoir le lien.{' '}
                                                    <Link to={loginRedirect} className="text-emerald hover:underline">
                                                        Se connecter
                                                    </Link>
                                                </p>
                                            )}
                                            {isAuthenticated && (
                                                <p className="text-center text-xs text-cocoa/50">
                                                    Le lien d’invitation sera envoyé à ton adresse email.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </Page>
    );
}

function ContentDetail() {
    const { contents, isAuthenticated } = useContext(AppContext);
    const slug = window.location.pathname.split('/').pop();
    const content = contents.find(c => c.slug === slug);

    if (!content) {
        return (
            <Page>
                <div className="mx-auto max-w-4xl px-6 pt-32 text-center">
                    <h1 className="ivoire-serif text-4xl text-cocoa">Contenu introuvable</h1>
                    <p className="mt-4 text-cocoa/70">Ce contenu n'existe pas ou a été supprimé.</p>
                    <Link to="/contenus" className="mt-6 inline-block rounded-full bg-emerald px-6 py-3 text-sand">
                        Voir tous les contenus
                    </Link>
                </div>
            </Page>
        );
    }

    const isPaid = content.type === 'paid';

    return (
        <Page>
            <div className="mx-auto max-w-5xl px-6 pt-32">
                <Reveal>
                    <Link to="/contenus" className="mb-6 inline-flex items-center gap-2 text-sm text-cocoa/60 hover:text-emerald">
                        ← Retour aux contenus
                    </Link>
                </Reveal>

                <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Média */}
                    <Reveal>
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald/20 via-honey/10 to-terracotta/20">
                            {isPaid ? (
                                <div 
                                    className="protected-content relative aspect-video"
                                    onContextMenu={(e) => e.preventDefault()}
                                    onCopy={(e) => e.preventDefault()}
                                >
                                    {content.cover_image ? (
                                        <img src={content.cover_image} alt={content.title} className="h-full w-full object-cover" draggable={false} />
                                    ) : (
                                        <div className="h-full w-full" />
                                    )}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-cocoa/60 backdrop-blur-sm">
                                        <span className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-honey text-cocoa">
                                            <Lock size={40} strokeWidth={2.5} />
                                        </span>
                                        <p className="ivoire-serif text-2xl text-sand">Contenu payant</p>
                                        <p className="mt-2 text-sand/80">Débloque l'accès complet pour découvrir ce contenu.</p>
                                    </div>
                                </div>
                            ) : content.video_url ? (
                                <video
                                    src={content.video_url}
                                    controls
                                    className="aspect-video w-full"
                                    poster={content.cover_image || undefined}
                                />
                            ) : content.cover_image ? (
                                <img src={content.cover_image} alt={content.title} className="aspect-video w-full object-cover" />
                            ) : (
                                <div className="aspect-video grid place-items-center">
                                    <span className="text-6xl text-cocoa/30">📽</span>
                                </div>
                            )}
                        </div>
                    </Reveal>

                    {/* Info */}
                    <div>
                        <Reveal delay={0.1}>
                            {content.category && (
                                <span className="text-xs uppercase tracking-widest text-cocoa/50">{content.category.name}</span>
                            )}
                            <h1 className="ivoire-serif mt-2 text-4xl text-cocoa lg:text-5xl">{content.title}</h1>

                            <div className="mt-4 flex items-center gap-3">
                                <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                                    isPaid ? 'bg-honey/20 text-honey' : 'bg-emerald/15 text-emerald'
                                }`}>
                                    {isPaid ? `${content.price.toLocaleString()} ${content.currency}` : 'Gratuit'}
                                </span>
                                {content.is_featured && (
                                    <span className="rounded-full bg-terracotta/15 px-4 py-1.5 text-sm font-medium text-terracotta">
                                        ★ En vedette
                                    </span>
                                )}
                            </div>
                        </Reveal>

                        {content.description && (
                            <Reveal delay={0.2}>
                                <div className="mt-8">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-cocoa/60">Description</h3>
                                    <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-cocoa/80">
                                        {content.description}
                                    </p>
                                </div>
                            </Reveal>
                        )}

                        <Reveal delay={0.3}>
                            <div className="mt-10">
                                {isPaid ? (
                                    <div className="space-y-4">
                                        <motion.a
                                            href={content.skool_link || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex w-full items-center justify-center gap-2 rounded-full bg-honey py-4 text-lg font-medium text-cocoa shadow-lg shadow-honey/30 transition hover:bg-honey/90"
                                        >
                                            Acheter — {content.price.toLocaleString()} {content.currency}
                                        </motion.a>
                                        <p className="text-center text-xs text-cocoa/50">
                                            Paiement sécurisé · Accès immédiat après achat
                                        </p>
                                    </div>
                                ) : (
                                    !isAuthenticated && (
                                        <div className="rounded-2xl border border-cocoa/10 bg-white/50 p-6 text-center">
                                            <p className="text-cocoa/70">Connecte-toi pour sauvegarder ta progression.</p>
                                            <Link
                                                to="/connexion"
                                                className="mt-4 inline-block rounded-full bg-emerald px-6 py-2.5 text-sm font-medium text-sand"
                                            >
                                                Se connecter
                                            </Link>
                                        </div>
                                    )
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* Contenu similaire */}
                <Reveal delay={0.4}>
                    <div className="mt-20">
                        <h2 className="ivoire-serif text-2xl text-cocoa">Contenus similaires</h2>
                        <div className="mt-8">
                            <DynamicContentGrid
                                items={contents.filter(c => c.id !== content.id && c.category?.id === content.category?.id).slice(0, 3)}
                            />
                        </div>
                    </div>
                </Reveal>
            </div>
        </Page>
    );
}

function Galerie() {
    return (
        <Page>
            <div className="mx-auto max-w-6xl px-6 pt-32">
                <Reveal>
                    <Kicker>Galerie</Kicker>
                    <h1 className="ivoire-serif mt-4 text-6xl text-cocoa md:text-7xl">
                        <SplitReveal text="En images" delay={0.1} />
                    </h1>
                </Reveal>
                <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
                    {GALLERY.map((g, i) => (
                        <Reveal key={i} delay={(i % 3) * 0.06} scale={0.95}>
                            <TiltFrame intensity={5}>
                                <motion.figure whileHover={{ y: -8 }} className="group relative break-inside-avoid overflow-hidden rounded-[1.5rem] border-2 border-white shadow-sm">
                                    <SmartImage
                                        src={g.src}
                                        alt={g.caption}
                                        className={i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}
                                        imgClass="transition duration-700 group-hover:scale-110"
                                        fallback={FALLBACK}
                                    />
                                    <motion.figcaption
                                        initial={{ y: '100%' }}
                                        whileHover={{ y: 0 }}
                                        transition={{ duration: 0.45, ease: [0.34, 1.2, 0.4, 1] }}
                                        className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-cocoa/90 to-transparent p-4 text-sm text-sand"
                                    >
                                        <span>{g.caption}</span>
                                        <span className="text-sand/60">© {g.credit}</span>
                                    </motion.figcaption>
                                </motion.figure>
                            </TiltFrame>
                        </Reveal>
                    ))}
                </div>
            </div>
        </Page>
    );
}

function Contact() {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [topic, setTopic] = useState('partenariat');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const topics = [
        { id: 'partenariat', label: 'Partenariat' },
        { id: 'presse', label: 'Presse' },
        { id: 'evenement', label: 'Événement' },
        { id: 'masterclass', label: 'Masterclass' },
        { id: 'autre', label: 'Autre' },
    ];

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ name, email, topic, message }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const firstError =
                    data?.errors && typeof data.errors === 'object'
                        ? (Object.values(data.errors).flat()[0] as string | undefined)
                        : undefined;
                setError(firstError || data?.message || "Impossible d'envoyer le message.");
                return;
            }

            setSent(true);
            setName('');
            setEmail('');
            setMessage('');
            setTopic('partenariat');
        } catch {
            setError('Erreur de connexion. Réessaie dans un instant.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page>
            <div className="relative min-h-[100svh] overflow-hidden pt-24 pb-16 md:pb-20 md:pt-28">
                <div
                    className="pointer-events-none absolute inset-0 opacity-70"
                    style={{
                        backgroundImage:
                            'radial-gradient(ellipse 70% 45% at 0% 10%, rgba(199,154,75,0.16), transparent 50%), radial-gradient(ellipse 55% 40% at 100% 90%, rgba(31,107,82,0.1), transparent 45%)',
                    }}
                />

                <div className="relative mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:items-stretch">
                    {/* Panneau visuel */}
                    <Reveal>
                        <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[2rem] lg:min-h-full">
                            <img
                                src="/kadhy-hero-studio.jpg"
                                alt="Kadhy Touré — Studio"
                                className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/55 to-cocoa/20" />
                            <div className="relative z-10 flex flex-1 flex-col justify-end p-8 sm:p-10 md:p-12">
                                <motion.p
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15, duration: 0.7 }}
                                    className="text-xs font-semibold uppercase tracking-[0.32em] text-honey"
                                >
                                    Contact
                                </motion.p>
                                <motion.h1
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25, duration: 0.75 }}
                                    className="ivoire-serif mt-4 max-w-md text-4xl leading-[1.05] text-sand sm:text-5xl md:text-6xl"
                                >
                                    Écrivons la suite ensemble.
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.7 }}
                                    className="mt-5 max-w-sm text-sm leading-relaxed text-sand/75 sm:text-base"
                                >
                                    Presse, partenariats, événements ou masterclass — chaque message est lu avec attention.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.55, duration: 0.7 }}
                                    className="mt-10 space-y-4 border-t border-sand/20 pt-8"
                                >
                                    <a
                                        href="mailto:contact@elevationbykadhy.com"
                                        className="group flex items-baseline justify-between gap-4 text-sand transition hover:text-honey"
                                    >
                                        <span className="text-xs uppercase tracking-[0.22em] text-sand/50">Email</span>
                                        <span className="text-right text-sm font-medium sm:text-base">
                                            contact@elevationbykadhy.com
                                        </span>
                                    </a>
                                    <div className="flex items-baseline justify-between gap-4 text-sand/80">
                                        <span className="text-xs uppercase tracking-[0.22em] text-sand/50">Réseaux</span>
                                        <span className="text-right text-sm">Instagram · Facebook · YouTube · TikTok</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Formulaire */}
                    <Reveal delay={0.1}>
                        <div className="flex h-full flex-col justify-center rounded-[2rem] border border-cocoa/10 bg-white/50 px-7 py-9 backdrop-blur-sm sm:px-10 sm:py-11">
                            <Kicker>Formulaire</Kicker>
                            <h2 className="ivoire-serif mt-3 text-3xl text-cocoa md:text-4xl">Parle-nous de toi</h2>
                            <p className="mt-3 text-sm leading-relaxed text-cocoa/60">
                                Remplis ce formulaire — on te répond dans les meilleurs délais.
                            </p>

                            <AnimatePresence mode="wait">
                                {sent ? (
                                    <motion.div
                                        key="ok"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="mt-10 flex flex-1 flex-col justify-center"
                                    >
                                        <p className="ivoire-serif text-3xl text-cocoa md:text-4xl">Merci.</p>
                                        <p className="mt-3 max-w-sm text-cocoa/65">
                                            Ton message a bien été reçu. L’équipe ÉLÉVATION te répondra bientôt.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setSent(false)}
                                            className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-cocoa transition hover:text-honey"
                                        >
                                            Envoyer un autre message
                                            <span aria-hidden>→</span>
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        onSubmit={submit}
                                        className="mt-8 space-y-5"
                                    >
                                        <div>
                                            <span className="mb-2.5 block text-xs font-medium uppercase tracking-[0.18em] text-cocoa/45">
                                                Objet
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {topics.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        onClick={() => setTopic(t.id)}
                                                        className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                                                            topic === t.id
                                                                ? 'bg-cocoa text-sand'
                                                                : 'border border-cocoa/15 bg-sand/60 text-cocoa/70 hover:border-cocoa/30 hover:text-cocoa'
                                                        }`}
                                                    >
                                                        {t.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-cocoa/45">
                                                Nom
                                            </span>
                                            <input
                                                required
                                                name="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Ton nom"
                                                className="w-full border-b border-cocoa/20 bg-transparent py-3 text-cocoa outline-none transition placeholder:text-cocoa/35 focus:border-honey"
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-cocoa/45">
                                                E-mail
                                            </span>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="ton@email.com"
                                                className="w-full border-b border-cocoa/20 bg-transparent py-3 text-cocoa outline-none transition placeholder:text-cocoa/35 focus:border-honey"
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-cocoa/45">
                                                Message
                                            </span>
                                            <textarea
                                                required
                                                name="message"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows={4}
                                                placeholder="Dis-nous ce que tu as en tête…"
                                                className="w-full resize-none border-b border-cocoa/20 bg-transparent py-3 text-cocoa outline-none transition placeholder:text-cocoa/35 focus:border-honey"
                                            />
                                        </label>

                                        {error && <p className="text-sm text-terracotta">{error}</p>}

                                        <Magnetic strength={0.12} className="pt-2 block w-full">
                                            <motion.button
                                                type="submit"
                                                disabled={loading}
                                                whileHover={!loading ? { scale: 1.01 } : undefined}
                                                whileTap={!loading ? { scale: 0.99 } : undefined}
                                                className="w-full rounded-full bg-cocoa py-3.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa disabled:opacity-60"
                                            >
                                                {loading ? 'Envoi…' : 'Envoyer le message'}
                                            </motion.button>
                                        </Magnetic>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </Reveal>
                </div>
            </div>
        </Page>
    );
}

interface AuthShellProps {
    children: ReactNode;
    image: string;
    kicker?: string;
    quote?: string;
    author: string;
    role?: string;
    imagePosition?: string;
}

function AuthShell({
    children,
    image,
    kicker = 'ÉLÉVATION',
    quote,
    author,
    role,
    imagePosition = 'object-[50%_20%]',
}: AuthShellProps) {
    return (
        <Page>
            <div className="relative grid min-h-[100svh] overflow-hidden bg-sand lg:grid-cols-2">
                <div
                    className="pointer-events-none absolute inset-0 opacity-60 lg:hidden"
                    style={{
                        backgroundImage:
                            'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(199,154,75,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(31,107,82,0.1), transparent 50%)',
                    }}
                />

                {/* Colonne formulaire */}
                <div className="relative z-10 flex min-h-[100svh] flex-col px-6 py-6 sm:px-10 lg:px-14 xl:px-20">
                    <Link
                        to="/"
                        className="ivoire-serif flex shrink-0 items-center gap-2.5 text-lg tracking-wide text-cocoa transition hover:text-honey sm:text-xl"
                    >
                        <ElevationLogo size={30} />
                        {PROFILE.brand}
                    </Link>

                    <div className="flex flex-1 items-center py-8">
                        <motion.div
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                            className="mx-auto w-full max-w-[380px]"
                        >
                            {children}
                        </motion.div>
                    </div>

                    <p className="shrink-0 text-xs text-cocoa/40">
                        © {new Date().getFullYear()} {PROFILE.brand}
                    </p>
                </div>

                {/* Colonne image */}
                <div className="relative hidden overflow-hidden lg:block">
                    <motion.img
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                        src={image}
                        alt={author}
                        className={`absolute inset-0 h-full w-full object-cover ${imagePosition}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/45 to-cocoa/15" />
                    <div className="absolute left-8 top-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-honey">{kicker}</p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.75 }}
                        className="absolute inset-x-0 bottom-0 p-10 xl:p-14"
                    >
                        {quote && (
                            <p className="ivoire-serif max-w-md text-2xl leading-snug text-sand xl:text-3xl">
                                « {quote} »
                            </p>
                        )}
                        <div className="mt-6">
                            <div className="text-base font-medium text-sand">{author}</div>
                            {role && <div className="mt-1 text-sm text-sand/65">{role}</div>}
                        </div>
                    </motion.div>
                </div>
            </div>
        </Page>
    );
}

function AuthField({
    label,
    type = 'text',
    placeholder,
    autoComplete,
    value,
    onChange,
    error,
}: {
    label: string;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
    value?: string;
    onChange?: (v: string) => void;
    error?: string;
}) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-cocoa/75">{label}</span>
            <div className="relative">
                <input
                    required
                    type={inputType}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 text-cocoa shadow-sm outline-none transition placeholder:text-cocoa/40 focus:shadow-[0_0_0_3px_rgba(199,154,75,0.2)] ${
                        isPassword ? 'pr-16' : ''
                    } ${
                        error
                            ? 'border-terracotta focus:border-terracotta'
                            : 'border-cocoa/20 focus:border-honey'
                    }`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-cocoa/50 transition hover:bg-sand hover:text-cocoa"
                    >
                        {show ? 'Masquer' : 'Voir'}
                    </button>
                )}
            </div>
            {error && <p className="mt-1.5 text-xs text-terracotta">{error}</p>}
        </label>
    );
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const redirectTo =
        new URLSearchParams(window.location.search).get('redirect') || '/espace';

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                window.location.href = redirectTo;
            } else if (res.status === 422) {
                const data = await res.json();
                setError(data.message || 'Identifiants incorrects.');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } catch {
            setError('Erreur de connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            image="/kadhy-hero-studio.jpg"
            kicker="Bienvenue"
            quote="Élève ta vie — un pas après l'autre, avec intention."
            author="Kadhy Touré"
            role="Fondatrice d'ÉLÉVATION"
            imagePosition="object-[50%_18%]"
        >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-honey">Connexion</p>
            <h1 className="ivoire-serif mt-3 text-4xl leading-[1.05] text-cocoa sm:text-5xl">Bon retour</h1>
            <p className="mt-3 text-sm leading-relaxed text-cocoa/60 sm:text-base">
                Connecte-toi pour poursuivre ton parcours d'élévation.
            </p>

            <form onSubmit={submit} className="mt-9 space-y-5">
                <AuthField
                    label="E-mail"
                    type="email"
                    placeholder="ton@email.com"
                    autoComplete="username"
                    value={email}
                    onChange={setEmail}
                />
                <AuthField
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={setPassword}
                />
                <div className="flex justify-end">
                    <a href="/forgot-password" className="text-sm text-cocoa/55 transition hover:text-honey">
                        Mot de passe oublié ?
                    </a>
                </div>
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-center text-sm text-terracotta"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
                <Magnetic strength={0.1} className="block w-full">
                    <motion.button
                        type="submit"
                        whileHover={!loading ? { scale: 1.01 } : undefined}
                        whileTap={!loading ? { scale: 0.99 } : undefined}
                        disabled={loading}
                        className="w-full rounded-full bg-cocoa py-3.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Connexion…' : 'Se connecter'}
                    </motion.button>
                </Magnetic>
            </form>

            <p className="mt-10 text-center text-sm text-cocoa/55">
                Pas encore de compte ?{' '}
                <Link to="/inscription" className="font-medium text-cocoa underline decoration-honey/60 underline-offset-4 transition hover:text-honey">
                    Créer un compte
                </Link>
            </p>
        </AuthShell>
    );
}

function Register() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const tooShort = password.length > 0 && password.length < 8;
    const mismatch = confirm.length > 0 && confirm !== password;
    const canSubmit = name.length > 0 && email.length > 0 && password.length >= 8 && confirm === password && !loading;

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    password,
                    password_confirmation: confirm,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                window.location.href = data.redirect || '/';
            } else if (res.status === 422) {
                const data = await res.json();
                const messages = data.errors ? Object.values(data.errors).flat().join(' ') : data.message;
                setError(messages || 'Erreur de validation.');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        } catch {
            setError('Erreur de connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            image="/kadhy-studio.png"
            kicker="Rejoindre"
            quote="Chacun porte en lui la capacité de grandir, de se relever et de se transformer."
            author="Kadhy Touré"
            role="Fondatrice d'ÉLÉVATION"
            imagePosition="object-[50%_22%]"
        >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-honey">Inscription</p>
            <h1 className="ivoire-serif mt-3 text-4xl leading-[1.05] text-cocoa sm:text-5xl">Créer un compte</h1>
            <p className="mt-3 text-sm leading-relaxed text-cocoa/60 sm:text-base">
                Commence ton parcours d'élévation dès aujourd'hui.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
                <AuthField label="Nom complet" placeholder="Ton nom" autoComplete="name" value={name} onChange={setName} />
                <AuthField
                    label="Téléphone"
                    type="tel"
                    placeholder="+225 07 00 00 00"
                    autoComplete="tel"
                    value={phone}
                    onChange={setPhone}
                />
                <AuthField
                    label="E-mail"
                    type="email"
                    placeholder="ton@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={setEmail}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                    <AuthField
                        label="Mot de passe"
                        type="password"
                        placeholder="8 caractères min."
                        autoComplete="new-password"
                        value={password}
                        onChange={setPassword}
                        error={tooShort ? 'Au moins 8 caractères.' : undefined}
                    />
                    <AuthField
                        label="Confirmation"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        value={confirm}
                        onChange={setConfirm}
                        error={mismatch ? 'Ne correspondent pas.' : undefined}
                    />
                </div>
                <AnimatePresence>
                    {confirm.length > 0 && !mismatch && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-emerald"
                        >
                            ✓ Les mots de passe correspondent
                        </motion.p>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="rounded-xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-center text-sm text-terracotta"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
                <Magnetic strength={0.1} className="block w-full pt-1">
                    <motion.button
                        type="submit"
                        whileHover={canSubmit ? { scale: 1.01 } : undefined}
                        whileTap={canSubmit ? { scale: 0.99 } : undefined}
                        disabled={!canSubmit}
                        className="w-full rounded-full bg-cocoa py-3.5 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-cocoa disabled:hover:text-sand"
                    >
                        {loading ? 'Création…' : 'Créer mon compte'}
                    </motion.button>
                </Magnetic>
            </form>

            <p className="mt-8 text-center text-sm text-cocoa/55">
                Déjà membre ?{' '}
                <Link to="/connexion" className="font-medium text-cocoa underline decoration-honey/60 underline-offset-4 transition hover:text-honey">
                    Se connecter
                </Link>
            </p>
        </AuthShell>
    );
}

function Footer() {
    const { isAuthenticated } = useContext(AppContext);

    const footerLinks: [string, string, boolean?][] = [
        ['/a-propos', 'À propos'],
        ['/contenus', 'Contenus'],
        ['/galerie', 'Galerie'],
        ['/contact', 'Contact'],
        [isAuthenticated ? '/espace' : '/connexion', isAuthenticated ? 'Mon espace' : 'Se connecter', isAuthenticated],
    ];

    return (
        <footer className="relative mt-20 overflow-hidden border-t border-cocoa/12 bg-gradient-to-b from-sand to-[#e8dcc6]">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-12 sm:grid-cols-[1.3fr_1fr_1fr]">
                    <div>
                        <Link to="/" className="ivoire-serif flex items-center gap-3 text-2xl text-cocoa transition hover:text-emerald">
                            <ElevationLogo size={40} />
                            {PROFILE.brand}
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-cocoa/65">
                            Plateforme de transformation personnelle, professionnelle et intérieure. Reprends le pouvoir sur ta vie.
                        </p>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="mt-5 h-0.5 w-16 origin-left rounded-full bg-gradient-to-r from-emerald via-honey to-terracotta"
                        />
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa/50">Navigation</h4>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.map(([path, label, isExternal]) => (
                                <li key={path}>
                                    {isExternal ? (
                                        <a href={path} className="text-sm text-cocoa/70 transition hover:pl-1 hover:text-emerald">
                                            {label}
                                        </a>
                                    ) : (
                                        <Link to={path} className="text-sm text-cocoa/70 transition hover:pl-1 hover:text-emerald">
                                            {label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa/50">Suivez-nous</h4>
                        <ul className="mt-4 space-y-3">
                            {['Instagram', 'Facebook', 'YouTube', 'TikTok'].map((social) => (
                                <li key={social}>
                                    <span className="text-sm text-cocoa/70 transition hover:text-emerald">{social}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cocoa/10 pt-8 sm:flex-row">
                    <p className="ivoire-serif text-sm text-cocoa/50">ÉLÈVE TA VIE.</p>
                    <p className="text-xs text-cocoa/40">© {new Date().getFullYear()} {PROFILE.brand} · Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}

function AdvertisementPopup({ ad }: { ad: Advertisement }) {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem(`ad-${ad.id}-dismissed`);
        if (!dismissed) {
            const timer = setTimeout(() => setVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [ad.id]);

    const close = () => {
        setVisible(false);
        setDismissed(true);
        sessionStorage.setItem(`ad-${ad.id}-dismissed`, 'true');
    };

    if (dismissed || !visible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-cocoa/70 backdrop-blur-sm"
                    onClick={close}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl bg-sand shadow-2xl"
                >
                    <button
                        onClick={close}
                        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-cocoa/80 text-sand transition hover:bg-cocoa"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                    {ad.link ? (
                        <a href={ad.link} target="_blank" rel="noopener noreferrer" onClick={close}>
                            <motion.img
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.6 }}
                                src={ad.image}
                                alt={ad.title}
                                className="w-full object-contain"
                            />
                        </a>
                    ) : (
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.6 }}
                            src={ad.image}
                            alt={ad.title}
                            className="w-full object-contain"
                        />
                    )}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/90 to-transparent p-6 pt-12"
                    >
                        <p className="ivoire-serif text-center text-xl text-sand">{ad.title}</p>
                        {ad.link && (
                            <a
                                href={ad.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={close}
                                className="mx-auto mt-4 block w-fit rounded-full bg-honey px-6 py-2.5 text-sm font-medium text-cocoa transition hover:bg-sand"
                            >
                                En savoir plus
                            </a>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function NotFound() {
    return (
        <Page>
            <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald">Erreur 404</p>
                <h1 className="mt-4 font-marcellus text-5xl text-cocoa md:text-6xl">Page introuvable</h1>
                <p className="mt-4 max-w-md text-lg text-cocoa/70">
                    La page que vous recherchez n&apos;existe pas ou a été déplacée.
                </p>
                <Link
                    to="/"
                    className="mt-10 inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald/90"
                >
                    Retour à l&apos;accueil
                </Link>
            </section>
        </Page>
    );
}

function ScrollToTop() {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    return null;
}

function IvoireApp({ advertisement }: { advertisement?: Advertisement | null }) {
    const location = useLocation();
    const isAuthRoute = ['/connexion', '/inscription'].includes(location.pathname);
    const isHomePage = location.pathname === '/';

    return (
        <div className="tpl-ivoire min-h-screen">
            <ScrollToTop />
            {!isAuthRoute && <Nav />}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/a-propos" element={<APropos />} />
                    <Route path="/contenus" element={<Contenus />} />
                    <Route path="/contenus/cours/:slug" element={<CourseDetail />} />
                    <Route path="/contenus/:slug" element={<ContentDetail />} />
                    <Route path="/galerie" element={<Galerie />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/connexion" element={<Login />} />
                    <Route path="/inscription" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AnimatePresence>
            {!isAuthRoute && <Footer />}
            {isHomePage && advertisement && <AdvertisementPopup ad={advertisement} />}
        </div>
    );
}

export default function Welcome() {
    const {
        testimonials = [],
        contents = [],
        courses = [],
        events = [],
        categories = [],
        currentContent = null,
        currentCourse = null,
        advertisement = null,
        isAuthenticated = false,
        isAdmin = false,
        unlockedCourseIds = [],
        auth,
    } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`${PROFILE.brand} — Ivoire`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet" />
            </Head>
            <AppContext.Provider
                value={{
                    testimonials,
                    contents,
                    courses,
                    events,
                    categories,
                    currentContent,
                    currentCourse,
                    isAuthenticated,
                    isAdmin,
                    unlockedCourseIds,
                    authUser: auth?.user ?? null,
                }}
            >
                <BrowserRouter>
                    <IvoireApp advertisement={advertisement} />
                </BrowserRouter>
            </AppContext.Provider>
        </>
    );
}
