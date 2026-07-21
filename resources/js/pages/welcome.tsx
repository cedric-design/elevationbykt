import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    CircleDollarSign,
    HeartHandshake,
    Leaf,
    Mail,
    Menu,
    MessageCircle,
    PanelsTopLeft,
    ShieldCheck,
    Sparkles,
    Sprout,
    UserRoundCheck,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const skoolUrl = 'https://www.skool.com/';

const navItems = [
    ['Vision', '#vision'],
    ['Piliers', '#piliers'],
    ['Programmes', '#programmes'],
    ['Test', '#test'],
    ['Événements', '#evenements'],
    ['Contact', '#contact'],
];

const pillars = [
    {
        title: 'Spiritualité',
        icon: Sparkles,
        text: 'Clarifier son ancrage, retrouver du sens et avancer avec une direction intérieure plus stable.',
    },
    {
        title: 'Développement personnel',
        icon: Sprout,
        text: 'Transformer les habitudes, la pensée et la posture pour construire une progression durable.',
    },
    {
        title: 'Leadership',
        icon: UserRoundCheck,
        text: 'Apprendre à se guider soi-même avant d’inspirer, servir et élever les autres.',
    },
    {
        title: 'Discipline',
        icon: ShieldCheck,
        text: 'Installer des routines simples, exigeantes et tenables pour reprendre le pouvoir sur son quotidien.',
    },
    {
        title: 'Finances',
        icon: CircleDollarSign,
        text: 'Développer une relation plus claire à l’argent, aux décisions et à la construction de valeur.',
    },
    {
        title: 'Entrepreneuriat',
        icon: BriefcaseBusiness,
        text: 'Structurer ses idées, passer à l’action et créer des projets alignés avec ses ambitions.',
    },
    {
        title: 'Relations',
        icon: HeartHandshake,
        text: 'Mieux communiquer, poser des limites et construire des liens qui soutiennent l’élévation.',
    },
    {
        title: 'Santé et bien-être',
        icon: Leaf,
        text: 'Revenir au corps, à l’énergie et à l’équilibre comme base d’une vie plus solide.',
    },
    {
        title: 'Estime de soi',
        icon: BadgeCheck,
        text: 'Renforcer sa valeur personnelle, sa confiance et sa capacité à choisir une vie plus juste.',
    },
];

const programs = [
    {
        name: 'ÉLÉVATION Start',
        type: 'Fondations',
        text: 'Un parcours clair pour reprendre confiance, poser ses bases et enclencher un premier mouvement.',
    },
    {
        name: 'ÉLÉVATION Premium',
        type: 'Accompagnement',
        text: 'Une experience plus complete avec structure, proximite et progression suivie au fil des semaines.',
    },
    {
        name: 'Challenges',
        type: 'Action',
        text: 'Des defis courts pour passer de l intention a l execution, avec l energie du collectif.',
    },
    {
        name: 'Masterclass',
        type: 'Expertise',
        text: 'Des sessions ciblees pour approfondir un sujet, repartir avec des outils et les appliquer vite.',
    },
    {
        name: 'Cercle prive',
        type: 'Communaute',
        text: 'Un espace plus intime pour avancer avec des personnes engagees sur la meme trajectoire.',
    },
    {
        name: 'Conferences',
        type: 'Événements',
        text: 'Des rencontres fortes pour ouvrir la vision, nourrir l’ambition et créer de vraies connexions.',
    },
];

const quizQuestions = [
    {
        question: 'Aujourd’hui, tu veux surtout...',
        answers: [
            'Retrouver de la clarté',
            'Passer à l’action',
            'Structurer un projet',
        ],
    },
    {
        question: 'Ton plus grand blocage actuel concerne...',
        answers: ['La confiance', 'La discipline', 'La stratégie'],
    },
    {
        question: 'Tu avances mieux avec...',
        answers: [
            'Un cadre doux',
            'Des objectifs précis',
            'Un cercle ambitieux',
        ],
    },
];

const testimonials = [
    'ÉLÉVATION m’a aidée à retrouver une direction claire et une discipline que je pensais avoir perdue.',
    'Je suis arrivée avec des idées floues. Je repars avec une vision, un plan et une communauté.',
    'L’énergie est rare : exigeante, humaine, profonde. On sent que chaque détail compte.',
    'Ce n’est pas juste du contenu. C’est un espace où l’on se remet vraiment en mouvement.',
];

export default function Welcome() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openPillar, setOpenPillar] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    const quizProfile = useMemo(() => {
        if (answers.length < quizQuestions.length) {
            return null;
        }

        if (
            answers.includes('Structurer un projet') ||
            answers.includes('La stratégie')
        ) {
            return {
                title: 'Profil Bâtisseur',
                text: 'Tu as besoin d’un cadre stratégique et d’un environnement qui transforme tes idées en actions mesurables.',
                program: 'ÉLÉVATION Premium',
            };
        }

        if (
            answers.includes('Passer à l’action') ||
            answers.includes('La discipline')
        ) {
            return {
                title: 'Profil Impulsion',
                text: 'Tu es prêt à avancer, mais tu gagnes à être accompagné par des objectifs simples, visibles et réguliers.',
                program: 'Challenges',
            };
        }

        return {
            title: 'Profil Renaissance',
            text: 'Tu es dans une phase de reconstruction. Commencer par les fondations te permettra de retrouver ton axe.',
            program: 'ÉLÉVATION Start',
        };
    }, [answers]);

    const answerQuestion = (index: number, answer: string) => {
        setAnswers((current) => {
            const next = [...current];
            next[index] = answer;
            return next.slice(0, index + 1);
        });
    };

    return (
        <>
            <Head title="ÉLÉVATION by Kadhy" />
            <main className="min-h-screen bg-[#090806] text-[#f8f3ea] selection:bg-[#d8b46a] selection:text-[#090806]">
                <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-[#090806]/70 backdrop-blur-2xl">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
                        <a
                            href="#accueil"
                            className="group flex items-center gap-3"
                        >
                            <span className="grid h-9 w-9 place-items-center border border-[#d8b46a]/50 bg-[#d8b46a]/10 text-sm font-semibold text-[#e4c778] transition duration-300 group-hover:bg-[#d8b46a] group-hover:text-[#090806]">
                                E
                            </span>
                            <span className="text-sm font-medium tracking-[0.35em] uppercase">
                                ÉLÉVATION
                            </span>
                        </a>

                        <nav className="hidden items-center gap-8 text-xs tracking-[0.18em] text-[#d8d0c1] uppercase lg:flex">
                            {navItems.map(([label, href]) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="transition duration-300 hover:text-[#e4c778]"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-3 lg:flex">
                            <a
                                href={skoolUrl}
                                className="inline-flex h-11 items-center gap-2 border border-[#d8b46a] bg-[#d8b46a] px-5 text-sm font-medium text-[#090806] transition duration-300 hover:bg-[#f0d58a]"
                            >
                                Rejoindre
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        <button
                            type="button"
                            onClick={() => setMenuOpen((value) => !value)}
                            className="grid h-11 w-11 place-items-center border border-white/15 text-[#f8f3ea] lg:hidden"
                            aria-label="Ouvrir le menu"
                        >
                            {menuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {menuOpen && (
                        <div className="border-t border-white/10 bg-[#090806] px-5 py-6 lg:hidden">
                            <nav className="flex flex-col gap-5 text-sm tracking-[0.16em] uppercase">
                                {navItems.map(([label, href]) => (
                                    <a
                                        key={label}
                                        href={href}
                                        onClick={() => setMenuOpen(false)}
                                        className="text-[#d8d0c1]"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    )}
                </header>

                <section
                    id="accueil"
                    className="relative grid min-h-screen overflow-hidden px-5 pt-28 sm:px-8"
                >
                    <div className="elevation-film absolute inset-0" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,180,106,0.18),transparent_35%),linear-gradient(180deg,rgba(9,8,6,0.18),rgba(9,8,6,0.96))]" />
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#090806] to-transparent" />

                    <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="animate-rise max-w-3xl">
                            <p className="mb-7 text-xs font-medium tracking-[0.45em] text-[#d8b46a] uppercase">
                                Communauté de transformation
                            </p>
                            <h1 className="max-w-5xl text-5xl leading-[0.95] font-semibold tracking-normal text-balance sm:text-7xl lg:text-8xl">
                                ELEVATION by Kadhy
                            </h1>
                            <p className="mt-5 text-2xl font-light text-[#e4c778] sm:text-3xl">
                                Élève ta vie.
                            </p>
                            <p className="mt-8 max-w-2xl text-base leading-8 text-[#d8d0c1] sm:text-lg">
                                Bienvenue dans un espace conçu pour celles et
                                ceux qui souhaitent grandir, se reconstruire,
                                développer leur potentiel et bâtir une vie plus
                                alignée avec leurs valeurs.
                            </p>
                            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                <a
                                    href="#vision"
                                    className="inline-flex h-14 items-center justify-center border border-white/20 px-7 text-sm font-medium text-white transition duration-300 hover:border-[#d8b46a] hover:text-[#e4c778]"
                                >
                                    Découvrir ÉLÉVATION
                                </a>
                                <a
                                    href={skoolUrl}
                                    className="inline-flex h-14 items-center justify-center gap-3 bg-[#d8b46a] px-7 text-sm font-semibold text-[#090806] transition duration-300 hover:bg-[#f0d58a]"
                                >
                                    Rejoindre la communauté
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        <div className="animate-float relative mx-auto w-full max-w-md lg:max-w-lg">
                            <div className="absolute -inset-6 border border-[#d8b46a]/20" />
                            <img
                                src="/images/elevation-logo.jpg"
                                alt="Logo ÉLÉVATION by Kadhy"
                                className="relative aspect-[4/3] w-full border border-white/10 object-cover shadow-2xl shadow-black/50"
                            />
                        </div>
                    </div>

                    <a
                        href="#vision"
                        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] tracking-[0.3em] text-[#b9ad98] uppercase sm:flex"
                    >
                        Explorer
                        <ChevronDown className="h-4 w-4 animate-bounce" />
                    </a>
                </section>

                <section
                    id="vision"
                    className="bg-[#f8f3ea] px-5 py-24 text-[#15120d] sm:px-8 lg:py-32"
                >
                    <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div className="overflow-hidden border border-[#15120d]/10 bg-[#dfd5c4]">
                            <div className="aspect-[4/5] bg-[linear-gradient(135deg,#15120d,#4a3a20_45%,#d8b46a)] p-8">
                                <div className="flex h-full flex-col justify-end border border-white/20 p-8 text-white">
                                    <p className="text-xs tracking-[0.35em] text-[#ead08a] uppercase">
                                        Kadhy
                                    </p>
                                    <p className="mt-4 max-w-sm text-3xl leading-tight font-light">
                                        Une présence, une vision, une communauté
                                        pour avancer plus haut.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold tracking-[0.35em] text-[#9a7430] uppercase">
                                Notre vision
                            </p>
                            <h2 className="mt-5 max-w-3xl text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                                Le vrai changement commence toujours à
                                l’intérieur de soi.
                            </h2>
                            <div className="mt-8 space-y-6 text-lg leading-9 text-[#4a4438]">
                                <p>
                                    ÉLÉVATION est né d’une conviction profonde :
                                    chacun porte en lui une version plus claire,
                                    plus forte et plus alignée de sa vie.
                                </p>
                                <p>
                                    Ce projet rassemble celles et ceux qui
                                    veulent se reconstruire sans se presser,
                                    progresser sans se trahir, et trouver un
                                    cadre où la discipline rencontre l’humanité.
                                </p>
                            </div>
                            <a
                                href={skoolUrl}
                                className="mt-10 inline-flex h-13 items-center gap-3 bg-[#15120d] px-6 text-sm font-medium text-white transition duration-300 hover:bg-[#2b2418]"
                            >
                                Rejoindre sur Skool
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </section>

                <section
                    id="piliers"
                    className="bg-[#090806] px-5 py-24 sm:px-8 lg:py-32"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.35em] text-[#d8b46a] uppercase">
                                    Les piliers
                                </p>
                                <h2 className="mt-5 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                                    Neuf dimensions pour elever une vie entiere.
                                </h2>
                            </div>
                            <p className="max-w-2xl text-lg leading-8 text-[#c9beac] lg:ml-auto">
                                Chaque pilier ouvre un espace de travail
                                concret. Le visiteur comprend vite où il en est,
                                puis choisit le chemin qui l’appelle.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pillars.map((pillar, index) => {
                                const Icon = pillar.icon;
                                const isOpen = openPillar === index;

                                return (
                                    <button
                                        key={pillar.title}
                                        type="button"
                                        onClick={() =>
                                            setOpenPillar(isOpen ? -1 : index)
                                        }
                                        className="group min-h-52 border border-white/10 bg-white/[0.035] p-6 text-left transition duration-300 hover:border-[#d8b46a]/60 hover:bg-white/[0.06]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="grid h-12 w-12 place-items-center border border-[#d8b46a]/30 text-[#e4c778]">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <ChevronDown
                                                className={`h-5 w-5 text-[#8f836f] transition duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                        <h3 className="mt-7 text-xl font-medium">
                                            {pillar.title}
                                        </h3>
                                        <p
                                            className={`overflow-hidden text-sm leading-7 text-[#c9beac] transition-all duration-500 ${
                                                isOpen
                                                    ? 'mt-4 max-h-40 opacity-100'
                                                    : 'mt-0 max-h-0 opacity-0'
                                            }`}
                                        >
                                            {pillar.text}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section
                    id="programmes"
                    className="bg-[#f8f3ea] px-5 py-24 text-[#15120d] sm:px-8 lg:py-32"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.35em] text-[#9a7430] uppercase">
                                    Les programmes
                                </p>
                                <h2 className="mt-5 max-w-3xl text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                                    Des parcours pour entrer, avancer et rester
                                    en mouvement.
                                </h2>
                            </div>
                            <a
                                href={skoolUrl}
                                className="inline-flex h-13 w-fit items-center gap-3 border border-[#15120d] px-6 text-sm font-medium transition duration-300 hover:bg-[#15120d] hover:text-white"
                            >
                                Voir sur Skool
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {programs.map((program, index) => (
                                <article
                                    key={program.name}
                                    className="group border border-[#15120d]/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#9a7430]/40 hover:shadow-2xl hover:shadow-[#15120d]/10"
                                >
                                    <div className="aspect-[16/10] bg-[#15120d] p-5">
                                        <div className="flex h-full items-end border border-white/15 bg-[linear-gradient(135deg,rgba(216,180,106,0.16),rgba(255,255,255,0.04))] p-5">
                                            <span className="text-xs tracking-[0.28em] text-[#e4c778] uppercase">
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}{' '}
                                                / {program.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-medium">
                                            {program.name}
                                        </h3>
                                        <p className="mt-4 min-h-24 text-sm leading-7 text-[#5a5347]">
                                            {program.text}
                                        </p>
                                        <a
                                            href={skoolUrl}
                                            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#7b5a20] transition duration-300 group-hover:gap-4"
                                        >
                                            Acceder au programme
                                            <ArrowRight className="h-4 w-4" />
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    id="test"
                    className="bg-[#15120d] px-5 py-24 sm:px-8 lg:py-32"
                >
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.35em] text-[#d8b46a] uppercase">
                                Test d’Élévation
                            </p>
                            <h2 className="mt-5 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                                Où en es-tu dans ton parcours d’Élévation ?
                            </h2>
                            <p className="mt-7 max-w-xl text-lg leading-8 text-[#c9beac]">
                                Quelques questions simples permettent d’orienter
                                chaque personne vers le parcours le plus adapté
                                à son moment de vie.
                            </p>
                        </div>

                        <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-8">
                            {quizQuestions.map((item, index) => (
                                <div
                                    key={item.question}
                                    className={
                                        index === 0 || answers[index - 1]
                                            ? 'block'
                                            : 'hidden'
                                    }
                                >
                                    <p className="text-sm font-medium text-[#e4c778]">
                                        Question {index + 1}
                                    </p>
                                    <h3 className="mt-3 text-2xl font-medium">
                                        {item.question}
                                    </h3>
                                    <div className="mt-6 grid gap-3">
                                        {item.answers.map((answer) => (
                                            <button
                                                key={answer}
                                                type="button"
                                                onClick={() =>
                                                    answerQuestion(
                                                        index,
                                                        answer,
                                                    )
                                                }
                                                className={`border px-5 py-4 text-left text-sm transition duration-300 ${
                                                    answers[index] === answer
                                                        ? 'border-[#d8b46a] bg-[#d8b46a] text-[#090806]'
                                                        : 'border-white/10 text-[#e9dfce] hover:border-[#d8b46a]/60'
                                                }`}
                                            >
                                                {answer}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {quizProfile && (
                                <div className="mt-8 border-t border-white/10 pt-8">
                                    <p className="text-sm font-medium text-[#e4c778]">
                                        {quizProfile.title}
                                    </p>
                                    <h3 className="mt-3 text-3xl font-medium">
                                        {quizProfile.program}
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 text-[#c9beac]">
                                        {quizProfile.text}
                                    </p>
                                    <a
                                        href={skoolUrl}
                                        className="mt-7 inline-flex h-12 items-center gap-3 bg-[#d8b46a] px-5 text-sm font-semibold text-[#090806] transition duration-300 hover:bg-[#f0d58a]"
                                    >
                                        Rejoindre ce parcours
                                        <ArrowRight className="h-4 w-4" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden bg-[#090806] py-24 lg:py-28">
                    <div className="px-5 sm:px-8">
                        <div className="mx-auto max-w-7xl">
                            <p className="text-xs font-semibold tracking-[0.35em] text-[#d8b46a] uppercase">
                                Témoignages
                            </p>
                            <h2 className="mt-5 max-w-3xl text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                                Des voix qui racontent le mouvement.
                            </h2>
                        </div>
                    </div>

                    <div className="testimonial-track mt-14 flex gap-5">
                        {[...testimonials, ...testimonials].map(
                            (item, index) => (
                                <figure
                                    key={`${item}-${index}`}
                                    className="w-[340px] shrink-0 border border-white/10 bg-white/[0.035] p-7 sm:w-[430px]"
                                >
                                    <blockquote className="text-lg leading-8 text-[#eee3d2]">
                                        {item}
                                    </blockquote>
                                    <figcaption className="mt-8 text-xs tracking-[0.28em] text-[#d8b46a] uppercase">
                                        Membre ÉLÉVATION
                                    </figcaption>
                                </figure>
                            ),
                        )}
                    </div>
                </section>

                <section
                    id="evenements"
                    className="bg-[#f8f3ea] px-5 py-24 text-[#15120d] sm:px-8 lg:py-32"
                >
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.35em] text-[#9a7430] uppercase">
                                Événements
                            </p>
                            <h2 className="mt-5 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                                Rencontres, masterclass et moments de bascule.
                            </h2>
                            <p className="mt-7 text-lg leading-8 text-[#5a5347]">
                                Les prochains rendez-vous pourront présenter
                                conférences, retraites, rencontres et sessions
                                en direct.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {[
                                'Masterclass Vision claire',
                                'Conference Discipline douce',
                                'Rencontre Communaute',
                            ].map((event, index) => (
                                <article
                                    key={event}
                                    className="flex flex-col justify-between gap-6 border border-[#15120d]/10 bg-white p-6 sm:flex-row sm:items-center"
                                >
                                    <div className="flex items-start gap-5">
                                        <span className="grid h-12 w-12 place-items-center border border-[#9a7430]/30 text-[#9a7430]">
                                            <CalendarDays className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <p className="text-xs tracking-[0.28em] text-[#9a7430] uppercase">
                                                Session {index + 1}
                                            </p>
                                            <h3 className="mt-2 text-xl font-medium">
                                                {event}
                                            </h3>
                                        </div>
                                    </div>
                                    <a
                                        href={skoolUrl}
                                        className="inline-flex h-11 items-center justify-center border border-[#15120d] px-5 text-sm font-medium transition duration-300 hover:bg-[#15120d] hover:text-white"
                                    >
                                        S’inscrire
                                    </a>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-[#090806] px-5 py-24 sm:px-8 lg:py-32">
                    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <p className="text-xs font-semibold tracking-[0.35em] text-[#d8b46a] uppercase">
                                Ressources gratuites
                            </p>
                            <h2 className="mt-5 text-4xl leading-tight font-semibold text-balance">
                                De la valeur avant même l’inscription.
                            </h2>
                        </div>
                        {[
                            [
                                'Articles',
                                'Réflexions courtes pour nourrir la vision et clarifier les décisions.',
                            ],
                            [
                                'Vidéos',
                                'Formats directs pour comprendre, ressentir et appliquer rapidement.',
                            ],
                            [
                                'Guides PDF',
                                'Supports pratiques pour structurer ses objectifs et son quotidien.',
                            ],
                        ].map(([title, text]) => (
                            <article
                                key={title}
                                className="border border-white/10 bg-white/[0.035] p-7"
                            >
                                <PanelsTopLeft className="h-6 w-6 text-[#e4c778]" />
                                <h3 className="mt-8 text-2xl font-medium">
                                    {title}
                                </h3>
                                <p className="mt-4 text-sm leading-7 text-[#c9beac]">
                                    {text}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section
                    id="contact"
                    className="bg-[#15120d] px-5 py-24 sm:px-8 lg:py-32"
                >
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.35em] text-[#d8b46a] uppercase">
                                Newsletter et contact
                            </p>
                            <h2 className="mt-5 text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                                Recevoir les conseils, les ressources exclusives
                                et les actualités.
                            </h2>
                            <form className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto]">
                                <label
                                    className="sr-only"
                                    htmlFor="newsletter-email"
                                >
                                    Adresse email
                                </label>
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    placeholder="Adresse email"
                                    className="h-14 border border-white/10 bg-white/[0.04] px-5 text-sm text-white transition duration-300 outline-none placeholder:text-[#9f927d] focus:border-[#d8b46a]"
                                />
                                <button
                                    type="button"
                                    className="inline-flex h-14 items-center justify-center gap-3 bg-[#d8b46a] px-7 text-sm font-semibold text-[#090806] transition duration-300 hover:bg-[#f0d58a]"
                                >
                                    S’inscrire
                                    <Mail className="h-4 w-4" />
                                </button>
                            </form>
                        </div>

                        <div className="border border-white/10 bg-white/[0.035] p-6 sm:p-8">
                            <h3 className="text-2xl font-medium">
                                Une question pour ÉLÉVATION ?
                            </h3>
                            <div className="mt-6 grid gap-4">
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    className="h-13 border border-white/10 bg-transparent px-4 text-sm transition duration-300 outline-none placeholder:text-[#9f927d] focus:border-[#d8b46a]"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="h-13 border border-white/10 bg-transparent px-4 text-sm transition duration-300 outline-none placeholder:text-[#9f927d] focus:border-[#d8b46a]"
                                />
                                <textarea
                                    placeholder="Message"
                                    rows={5}
                                    className="resize-none border border-white/10 bg-transparent p-4 text-sm transition duration-300 outline-none placeholder:text-[#9f927d] focus:border-[#d8b46a]"
                                />
                                <button
                                    type="button"
                                    className="inline-flex h-13 items-center justify-center gap-3 bg-white text-sm font-semibold text-[#15120d] transition duration-300 hover:bg-[#f8f3ea]"
                                >
                                    Envoyer le message
                                    <MessageCircle className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-white/10 bg-[#090806] px-5 py-8 text-sm text-[#9f927d] sm:px-8">
                    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row">
                        <p>ÉLÉVATION by Kadhy</p>
                        <a href={skoolUrl} className="text-[#e4c778]">
                            Rejoindre la communauté
                        </a>
                    </div>
                </footer>
            </main>
        </>
    );
}
