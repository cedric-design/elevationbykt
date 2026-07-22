import { Head, usePage } from '@inertiajs/react';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
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
import { GALLERY, IMG } from '@/data/images';
import { ABOUT_KADHY, COURSES, PROFILE, STATS, TIMELINE, VISION_CLOSING, VISION_INTRO, VISION_PILLARS } from '@/data/content';

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
}

interface Advertisement {
    id: number;
    title: string;
    image: string;
    link: string | null;
}

interface PageProps {
    testimonials: Testimonial[];
    contents: Content[];
    categories: Category[];
    currentContent?: Content | null;
    advertisement?: Advertisement | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    [key: string]: unknown;
}

const AppContext = createContext<{ 
    testimonials: Testimonial[]; 
    contents: Content[];
    categories: Category[];
    currentContent?: Content | null;
    isAuthenticated: boolean; 
    isAdmin: boolean;
}>({
    testimonials: [],
    contents: [],
    categories: [],
    currentContent: null,
    isAuthenticated: false,
    isAdmin: false,
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

type Course = (typeof COURSES)[number];

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
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 3]);

    return (
        <section ref={ref} className="ivoire-paper relative overflow-hidden">
            <FloatingOrbs count={4} colors={IVOIRE_ORBS} className="opacity-70" />
            <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-40 pb-8 md:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                        <Kicker>{PROFILE.roles.join(' · ')}</Kicker>
                    </motion.div>
                    <h1 className="ivoire-serif mt-5 text-6xl leading-[0.95] text-cocoa sm:text-7xl md:text-8xl">
                        <SplitLines lines={['ELEVATION', 'by Kadhy']} delay={0.15} />
                    </h1>
                    <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.55, duration: 0.8 }}
                        className="mt-4 block h-1 w-20 origin-left rounded-full bg-gradient-to-r from-emerald via-honey to-terracotta"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.7 }}
                        className="mt-7 max-w-md text-lg leading-relaxed text-cocoa/75"
                    >
                        Star du cinéma ivoirien et présentatrice de « Les Femmes d'Ici » sur la NCI. Films, émissions, cours et masterclass —{' '}
                        <em className="ivoire-serif text-terracotta">{PROFILE.tagline}</em>
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="mt-9 flex flex-wrap gap-4"
                    >
                        <Magnetic strength={0.18}>
                            <Link to="/contenus" className="inline-block rounded-full bg-emerald px-7 py-3.5 font-medium text-sand shadow-lg shadow-emerald/25 transition hover:bg-cocoa hover:shadow-cocoa/20">
                                Voir les contenus
                            </Link>
                        </Magnetic>
                        <Magnetic strength={0.14}>
                            <Link to="/a-propos" className="inline-block rounded-full border border-cocoa/25 px-7 py-3.5 font-medium text-cocoa transition hover:border-terracotta hover:text-terracotta">
                                Son parcours
                            </Link>
                        </Magnetic>
                    </motion.div>
                </div>
                <TiltFrame intensity={9}>
                    <motion.div style={{ y, rotate }} className="relative mx-auto w-full max-w-sm">
                        <div className="ivoire-halo pointer-events-none" aria-hidden />
                        <motion.div
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -inset-4 rounded-[999px] bg-gradient-to-b from-honey/30 to-terracotta/10 blur-2xl"
                        />
                        <div className="ivoire-arch ivoire-warm-glow relative border-4 border-sand">
                            <SmartImage src={IMG.portrait} alt="Kadhy Touré" className="ivoire-arch aspect-[4/5]" imgClass="transition duration-700 hover:scale-105" fallback={FALLBACK} />
                        </div>
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-cocoa/10 bg-sand px-4 py-3 shadow-lg"
                        >
                            <motion.span
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="grid h-9 w-9 place-items-center rounded-full bg-honey text-cocoa"
                            >
                                ★
                            </motion.span>
                            <div className="text-sm">
                                <div className="font-semibold text-cocoa">NISA d'Or 2023</div>
                                <div className="text-cocoa/55">Lauréate</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </TiltFrame>
            </div>
            <Marquee
                items={[...PROFILE.roles, "NISA d'Or 2023", PROFILE.company, 'Abidjan · CI']}
                className="border-y border-cocoa/10 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-cocoa/40"
                speed={32}
            />
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

function CourseGrid({ items }: { items: Course[] }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 0.08} y={30}>
                    <motion.article
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        className="ivoire-card-hover group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-cocoa/10 bg-white/50"
                    >
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald/25 via-honey/20 to-terracotta/25">
                            <motion.div className="absolute inset-0 bg-emerald/0 transition duration-500 group-hover:bg-emerald/10" />
                            <div className="absolute inset-0 grid place-items-center">
                                <motion.span whileHover={{ scale: 1.15 }} className="grid h-14 w-14 place-items-center rounded-full bg-sand text-emerald shadow-lg">
                                    ▶
                                </motion.span>
                            </div>
                            <span className="absolute left-4 top-4 rounded-full bg-emerald px-3 py-1 text-xs font-medium text-sand">{c.tag}</span>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                            <span className="text-xs uppercase tracking-widest text-cocoa/45">{c.kind}</span>
                            <h3 className="ivoire-serif mt-1 text-2xl text-cocoa transition group-hover:text-emerald">{c.title}</h3>
                            <p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa/70">{c.blurb}</p>
                            <div className="mt-5 flex items-center justify-between text-xs text-cocoa/55">
                                <span>{c.length}</span>
                                <span>{c.level}</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-4 rounded-full border border-emerald/40 py-2.5 text-sm font-medium text-emerald transition hover:bg-emerald hover:text-sand"
                            >
                                Accéder au contenu
                            </motion.button>
                        </div>
                    </motion.article>
                </Reveal>
            ))}
        </div>
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

function AboutPreview() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-sand via-white/30 to-sand" />
            <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[0.9fr_1.1fr]">
                <Reveal delay={0.1}>
                    <TiltFrame intensity={7}>
                        <div className="overflow-hidden rounded-3xl shadow-2xl shadow-cocoa/15">
                            <SmartImage
                                src="/kadhy-studio.png"
                                alt="Kadhy Touré — Studio"
                                className="aspect-[4/3]"
                                imgClass="transition duration-700 hover:scale-105"
                                fallback={FALLBACK}
                            />
                        </div>
                    </TiltFrame>
                </Reveal>
                <Reveal>
                    <div>
                        <Kicker>À propos</Kicker>
                        <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">
                            <SplitReveal text="Kadhy Touré" delay={0.1} />
                        </h2>
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15, ease: [0.34, 1.2, 0.4, 1] }}
                            className="mt-6 text-lg leading-relaxed text-cocoa/80"
                        >
                            {ABOUT_KADHY[0]}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.25, ease: [0.34, 1.2, 0.4, 1] }}
                            className="mt-4 text-lg leading-relaxed text-cocoa/80"
                        >
                            {ABOUT_KADHY[1]}
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="mt-8">
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

function VisionPreview() {
    const pillarIcons = ['✦', '☼', '♡', '⚡', '◆', '★'];

    return (
        <section className="ivoire-paper relative overflow-hidden py-24">
            <FloatingOrbs count={3} colors={IVOIRE_ORBS} className="opacity-40" />
            <div className="relative mx-auto max-w-6xl px-6">
                <div className="grid items-center gap-14 md:grid-cols-[1fr_1.1fr]">
                    <Reveal>
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.03, 1] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald/10 via-honey/10 to-terracotta/10 blur-2xl"
                            />
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-emerald/15">
                                <SmartImage
                                    src="/kadhy-masterclass.png"
                                    alt="Kadhy Touré — Masterclass ÉLÉVATION"
                                    className="aspect-[4/3]"
                                    imgClass="transition duration-700 hover:scale-105"
                                    fallback={FALLBACK}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-transparent to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-6">
                                    <p className="ivoire-serif text-2xl text-sand">ÉLÈVE TA VIE.</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <div>
                        <Reveal>
                            <Kicker>Notre mission</Kicker>
                            <h2 className="ivoire-serif mt-4 text-4xl text-cocoa md:text-5xl">
                                <SplitReveal text="La vision d'ÉLÉVATION" delay={0.12} />
                            </h2>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <p className="mt-6 text-lg leading-relaxed text-cocoa/80">{VISION_INTRO[0]}</p>
                        </Reveal>
                        <Reveal delay={0.15}>
                            <p className="mt-4 text-lg leading-relaxed text-cocoa/80">{VISION_INTRO[3]}</p>
                        </Reveal>

                        <Stagger className="mt-8 grid grid-cols-2 gap-3" stagger={0.06}>
                            {VISION_PILLARS.map((pillar, i) => (
                                <StaggerItem key={pillar}>
                                    <motion.div
                                        whileHover={{ y: -4, scale: 1.03 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                        className="ivoire-card-hover flex items-center gap-3 rounded-xl border border-cocoa/10 bg-white/50 px-4 py-3 backdrop-blur-sm"
                                    >
                                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald/10 text-sm text-emerald">{pillarIcons[i]}</span>
                                        <span className="text-xs font-medium leading-tight text-cocoa">{pillar}</span>
                                    </motion.div>
                                </StaggerItem>
                            ))}
                        </Stagger>

                        <Reveal delay={0.3}>
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <Magnetic strength={0.18}>
                                    <Link
                                        to="/a-propos"
                                        className="inline-block rounded-full bg-emerald px-7 py-3.5 font-medium text-sand shadow-lg shadow-emerald/25 transition hover:bg-cocoa hover:shadow-cocoa/20"
                                    >
                                        Découvrir notre vision
                                    </Link>
                                </Magnetic>
                                <Magnetic strength={0.14}>
                                    <Link to="/contact" className="inline-block rounded-full border border-cocoa/25 px-7 py-3.5 font-medium text-cocoa transition hover:border-terracotta hover:text-terracotta">
                                        Rejoindre ÉLÉVATION
                                    </Link>
                                </Magnetic>
                            </div>
                        </Reveal>
                    </div>
                </div>
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
        <section className="relative overflow-hidden py-24">
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
        <section className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
                <div className="relative overflow-hidden rounded-[2.5rem] border border-cocoa/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald via-emerald/95 to-[#1a5a45]" />
                    <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                    <FloatingOrbs count={3} colors={IVOIRE_ORBS} className="opacity-30" />
                    <div className="relative grid items-center gap-8 px-8 py-12 text-sand md:grid-cols-[1.2fr_1fr] md:px-14 md:py-16">
                        <div>
                            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-honey">
                                <span className="h-px w-6 bg-honey" />
                                Newsletter
                            </span>
                            <h2 className="ivoire-serif mt-4 text-3xl leading-tight md:text-4xl">Reçois l'inspiration ÉLÉVATION</h2>
                            <p className="mt-3 max-w-md text-sand/80">
                                Conseils, coulisses, nouvelles masterclass et rendez-vous de la communauté — directement dans ta boîte mail.
                            </p>
                        </div>
                        <form onSubmit={subscribe} className="w-full">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Votre e-mail"
                                    className="w-full rounded-full border border-white/25 bg-white/10 px-5 py-3.5 text-sand placeholder:text-sand/60 outline-none transition focus:border-honey focus:bg-white/15"
                                />
                                <motion.button
                                    whileHover={!loading ? { scale: 1.03 } : undefined}
                                    whileTap={!loading ? { scale: 0.97 } : undefined}
                                    disabled={loading}
                                    className="shrink-0 rounded-full bg-honey px-7 py-3.5 font-medium text-cocoa transition hover:bg-sand disabled:opacity-70"
                                >
                                    {loading ? '...' : "S'inscrire"}
                                </motion.button>
                            </div>
                            <AnimatePresence>
                                {message && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`mt-3 text-sm ${error ? 'text-terracotta' : 'text-honey'}`}
                                    >
                                        {message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

function Home() {
    const { contents } = useContext(AppContext);
    const featuredContents = contents.filter(c => c.is_featured).slice(0, 3);
    const displayContents = featuredContents.length > 0 ? featuredContents : contents.slice(0, 3);

    return (
        <Page>
            <Hero />
            <StatsSection />
            <AboutPreview />
            {contents.length > 0 && (
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
                    <div className="mt-10">
                        <DynamicContentGrid items={displayContents} />
                    </div>
                </section>
            )}
            <VisionPreview />
            <Testimonials />
            <Newsletter />
        </Page>
    );
}

function VisionMedia() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const yImg = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const yCards = useTransform(scrollYProgress, [0, 1], [90, -30]);
    const scaleImg = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

    const facts = [
        { big: '6', small: 'domaines de vie accompagnés' },
        { big: '100%', small: "orienté passage à l'action" },
    ];

    return (
        <div ref={ref} className="relative">
            <motion.div style={{ y: yImg }} className="relative">
                <motion.div
                    style={{ scale: scaleImg }}
                    className="relative overflow-hidden rounded-3xl shadow-2xl shadow-emerald/15"
                >
                    <SmartImage
                        src="/kadhy-masterclass.png"
                        alt="Kadhy Touré — Masterclass ÉLÉVATION"
                        className="aspect-[4/3]"
                        imgClass="h-full w-full object-cover"
                        fallback={FALLBACK}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8">
                        <p className="ivoire-serif text-3xl leading-tight text-sand">ÉLÈVE TA VIE.</p>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div style={{ y: yCards }} className="mt-6 grid grid-cols-2 gap-4">
                {facts.map((f, i) => (
                    <motion.div
                        key={f.small}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: i * 0.12, ease: [0.16, 1, 0.3, 1], duration: 0.7 }}
                        className="ivoire-card-hover rounded-2xl border border-cocoa/10 bg-white/60 p-5 text-center backdrop-blur-sm"
                    >
                        <div className="ivoire-serif text-3xl text-emerald">{f.big}</div>
                        <div className="mt-1 text-xs leading-tight text-cocoa/60">{f.small}</div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 18 }}
                className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald/20 bg-emerald/5 px-5 py-4"
            >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald text-sand">★</span>
                <p className="text-sm text-cocoa/75">Une communauté engagée, à travers toute l'Afrique francophone.</p>
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
                        {/* Ligne verticale animée */}
                        <motion.div
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute left-4 top-2 bottom-2 w-px origin-top bg-gradient-to-b from-emerald via-honey to-terracotta md:left-1/2 md:-translate-x-1/2"
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

                {/* Vision d'ÉLÉVATION */}
                <div className="ivoire-paper relative mt-24 -mx-6 overflow-hidden rounded-[2rem] px-6 py-20 md:mx-0 md:px-12">
                    <FloatingOrbs count={3} colors={IVOIRE_ORBS} className="opacity-40" />
                    <div className="relative grid items-start gap-14 md:grid-cols-[1fr_1.15fr]">
                        <VisionMedia />

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
                                            whileHover={{ y: -4, scale: 1.03 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                            className="ivoire-card-hover flex items-center gap-3 rounded-xl border border-cocoa/10 bg-white/60 px-4 py-3"
                                        >
                                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald/10 text-sm text-emerald">{pillarIcons[i]}</span>
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
                                                i >= VISION_CLOSING.length - 2 ? 'ivoire-serif text-xl text-cocoa md:text-2xl' : 'text-lg text-cocoa/80'
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
    const { contents, categories } = useContext(AppContext);
    const [typeFilter, setTypeFilter] = useState<'all' | 'free' | 'paid'>('all');
    const [categoryFilter, setCategoryFilter] = useState<number | null>(null);

    const filteredContents = contents.filter(c => {
        if (typeFilter !== 'all' && c.type !== typeFilter) return false;
        if (categoryFilter !== null && c.category?.id !== categoryFilter) return false;
        return true;
    });

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

                {/* Filtres */}
                <Reveal delay={0.1}>
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        {/* Filtre par type */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTypeFilter('all')}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                                    typeFilter === 'all'
                                        ? 'bg-emerald text-sand'
                                        : 'border border-cocoa/15 text-cocoa/70 hover:border-emerald hover:text-emerald'
                                }`}
                            >
                                Tous
                            </button>
                            <button
                                onClick={() => setTypeFilter('free')}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                                    typeFilter === 'free'
                                        ? 'bg-emerald text-sand'
                                        : 'border border-cocoa/15 text-cocoa/70 hover:border-emerald hover:text-emerald'
                                }`}
                            >
                                Gratuits
                            </button>
                            <button
                                onClick={() => setTypeFilter('paid')}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                                    typeFilter === 'paid'
                                        ? 'bg-honey text-cocoa'
                                        : 'border border-cocoa/15 text-cocoa/70 hover:border-honey hover:text-honey'
                                }`}
                            >
                                Payants
                            </button>
                        </div>

                        {/* Filtre par catégorie */}
                        {categories.length > 0 && (
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

                        {/* Compteur */}
                        <span className="ml-auto text-sm text-cocoa/50">
                            {filteredContents.length} contenu{filteredContents.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </Reveal>

                <div className="mt-10">
                    <DynamicContentGrid items={filteredContents} />
                </div>

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
    return (
        <Page>
            <div className="mx-auto max-w-6xl px-6 pt-32">
                <div className="grid gap-12 md:grid-cols-2">
                    <Reveal>
                        <Kicker>Contact</Kicker>
                        <h1 className="ivoire-serif mt-4 text-6xl leading-tight text-cocoa md:text-7xl">
                            <SplitLines lines={['Collaborons', 'ensemble.']} delay={0.1} />
                        </h1>
                        <p className="mt-5 max-w-md text-lg text-cocoa/75">
                            Presse, production, partenariats, événements ou masterclass — écrivez et construisons ensemble.
                        </p>
                        <div className="mt-8 space-y-2 text-cocoa/75">
                            <p>
                                <span className="text-emerald">Management :</span> contact@kadhytoure.example
                            </p>
                            <p>
                                <span className="text-emerald">Réseaux :</span> Instagram · Facebook · YouTube · TikTok
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <motion.form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setSent(true);
                                e.currentTarget.reset();
                            }}
                            whileHover={{ y: -4 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="space-y-4 rounded-[2rem] border border-cocoa/10 bg-white/60 p-8 shadow-lg shadow-cocoa/5"
                        >
                            <input
                                required
                                placeholder="Votre nom"
                                className="w-full rounded-xl border border-cocoa/15 bg-sand px-4 py-3 outline-none transition focus:border-emerald focus:shadow-[0_0_0_3px_rgba(31,107,82,0.12)]"
                            />
                            <input
                                required
                                type="email"
                                placeholder="Votre e-mail"
                                className="w-full rounded-xl border border-cocoa/15 bg-sand px-4 py-3 outline-none transition focus:border-emerald focus:shadow-[0_0_0_3px_rgba(31,107,82,0.12)]"
                            />
                            <textarea
                                required
                                rows={5}
                                placeholder="Votre message"
                                className="w-full rounded-xl border border-cocoa/15 bg-sand px-4 py-3 outline-none transition focus:border-emerald focus:shadow-[0_0_0_3px_rgba(31,107,82,0.12)]"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full rounded-full bg-terracotta py-3.5 font-medium text-sand transition hover:bg-cocoa"
                            >
                                Envoyer
                            </motion.button>
                            <AnimatePresence>
                                {sent && (
                                    <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm text-emerald">
                                        Merci ! Message envoyé (démonstration).
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.form>
                    </Reveal>
                </div>
            </div>
        </Page>
    );
}

interface AuthShellProps {
    children: ReactNode;
    image: string;
    quote?: string;
    author: string;
    role?: string;
    plainImage?: boolean;
}

function AuthShell({ children, image, quote, author, role, plainImage = false }: AuthShellProps) {
    return (
        <Page>
            <div className="grid h-screen overflow-hidden bg-sand lg:grid-cols-2">
                {/* Colonne formulaire */}
                <div className="flex h-screen flex-col overflow-hidden px-6 py-5 sm:px-10 lg:px-16 xl:px-20">
                    <Link to="/" className="ivoire-serif flex shrink-0 items-center gap-2.5 text-xl tracking-wide text-cocoa transition hover:text-emerald">
                        <ElevationLogo size={32} />
                        {PROFILE.brand}
                    </Link>
                    <div className="flex flex-1 items-center overflow-y-auto py-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="mx-auto w-full max-w-sm"
                        >
                            {children}
                        </motion.div>
                    </div>
                    <p className="shrink-0 text-xs text-cocoa/45">© {new Date().getFullYear()} {PROFILE.brand}</p>
                </div>

                {/* Colonne image */}
                <div className="relative hidden overflow-hidden lg:block">
                    <motion.div
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                    >
                        <SmartImage src={image} alt={author} className="h-full w-full" imgClass="h-full w-full object-cover" fallback={FALLBACK} />
                    </motion.div>
                    {!plainImage && (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-t from-cocoa/90 via-cocoa/20 to-cocoa/10" />
                            <div className="absolute left-8 top-8">
                                <ElevationLogo size={44} className="opacity-90" />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-x-0 bottom-0 p-12"
                            >
                                <p className="ivoire-serif text-2xl leading-snug text-sand xl:text-3xl">« {quote} »</p>
                                <div className="mt-5">
                                    <div className="text-lg font-semibold text-sand">{author}</div>
                                    <div className="text-sm text-sand/70">{role}</div>
                                </div>
                            </motion.div>
                        </>
                    )}
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
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-cocoa/70">{label}</span>
            <input
                required
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-cocoa outline-none transition placeholder:text-cocoa/40 focus:shadow-[0_0_0_3px_rgba(31,107,82,0.12)] ${
                    error ? 'border-terracotta focus:border-terracotta' : 'border-cocoa/20 focus:border-emerald'
                }`}
            />
            {error && <p className="mt-1.5 text-xs text-terracotta">{error}</p>}
        </label>
    );
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                const data = await res.json();
                window.location.href = data.redirect || '/';
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
        <AuthShell image="/kadhy-bienvenue.png" author="ELEVATION by Kadhy — Bienvenue" plainImage>
            <h1 className="ivoire-serif text-4xl text-cocoa">Bon retour</h1>
            <p className="mt-2 text-cocoa/65">Connecte-toi pour poursuivre ton élévation.</p>
            <form onSubmit={submit} className="mt-8 space-y-5">
                <AuthField
                    label="E-mail"
                    type="email"
                    placeholder="vous@exemple.com"
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
                    <a href="/forgot-password" className="text-sm text-emerald transition hover:text-cocoa">
                        Mot de passe oublié ?
                    </a>
                </div>
                {error && <p className="text-center text-sm text-terracotta">{error}</p>}
                <motion.button
                    whileHover={!loading ? { scale: 1.02 } : undefined}
                    whileTap={!loading ? { scale: 0.98 } : undefined}
                    disabled={loading}
                    className="w-full rounded-xl bg-emerald py-3.5 font-medium text-sand shadow-lg shadow-emerald/25 transition hover:bg-cocoa disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </motion.button>
            </form>
            <p className="mt-8 text-center text-sm text-cocoa/65">
                Pas encore de compte ?{' '}
                <Link to="/inscription" className="font-medium text-terracotta transition hover:text-cocoa">
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
            quote="Chacun porte en lui la capacité de grandir, de se relever et de se transformer."
            author="Kadhy Touré"
            role="Fondatrice d'ÉLÉVATION"
        >
            <h1 className="ivoire-serif text-3xl text-cocoa">Créer un compte</h1>
            <p className="mt-1 text-sm text-cocoa/65">Commence ton parcours d'élévation dès aujourd'hui.</p>
            <form onSubmit={submit} className="mt-5 space-y-3.5">
                <AuthField label="Nom complet" placeholder="Votre nom" autoComplete="name" value={name} onChange={setName} />
                <AuthField label="Numéro de téléphone" type="tel" placeholder="+225 07 00 00 00" autoComplete="tel" value={phone} onChange={setPhone} />
                <AuthField label="E-mail" type="email" placeholder="vous@exemple.com" autoComplete="email" value={email} onChange={setEmail} />
                <AuthField
                    label="Mot de passe"
                    type="password"
                    placeholder="Au moins 8 caractères"
                    autoComplete="new-password"
                    value={password}
                    onChange={setPassword}
                    error={tooShort ? 'Au moins 8 caractères.' : undefined}
                />
                <AuthField
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={setConfirm}
                    error={mismatch ? 'Les mots de passe ne correspondent pas.' : undefined}
                />
                <AnimatePresence>
                    {confirm.length > 0 && !mismatch && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-emerald">
                            ✓ Les mots de passe correspondent.
                        </motion.p>
                    )}
                </AnimatePresence>
                {error && <p className="text-center text-sm text-terracotta">{error}</p>}
                <motion.button
                    whileHover={canSubmit ? { scale: 1.02 } : undefined}
                    whileTap={canSubmit ? { scale: 0.98 } : undefined}
                    disabled={!canSubmit}
                    className="w-full rounded-xl bg-terracotta py-3.5 font-medium text-sand shadow-lg shadow-terracotta/25 transition hover:bg-cocoa disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-terracotta"
                >
                    {loading ? 'Création...' : 'Créer mon compte'}
                </motion.button>
            </form>
            <p className="mt-5 text-center text-sm text-cocoa/65">
                Déjà membre ?{' '}
                <Link to="/connexion" className="font-medium text-emerald transition hover:text-cocoa">
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
                    <Route path="/contenus/:slug" element={<ContentDetail />} />
                    <Route path="/galerie" element={<Galerie />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/connexion" element={<Login />} />
                    <Route path="/inscription" element={<Register />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </AnimatePresence>
            {!isAuthRoute && <Footer />}
            {isHomePage && advertisement && <AdvertisementPopup ad={advertisement} />}
        </div>
    );
}

export default function Welcome() {
    const { testimonials = [], contents = [], categories = [], currentContent = null, advertisement = null, isAuthenticated = false, isAdmin = false } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`${PROFILE.brand} — Ivoire`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet" />
            </Head>
            <AppContext.Provider value={{ testimonials, contents, categories, currentContent, isAuthenticated, isAdmin }}>
                <BrowserRouter>
                    <IvoireApp advertisement={advertisement} />
                </BrowserRouter>
            </AppContext.Provider>
        </>
    );
}
