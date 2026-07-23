import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    Video,
    CalendarDays,
    MessageSquareQuote,
    Inbox,
    Mail,
    Megaphone,
    Users,
    UsersRound,
    ArrowRight,
    type LucideIcon,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';

interface PageProps {
    auth: { user: { name: string; email: string; role?: string } };
    [key: string]: unknown;
}

type GuideItem = {
    id: string;
    icon: LucideIcon;
    title: string;
    href: string;
    section: string;
    summary: string;
    steps: string[];
};

const GUIDE_ITEMS: GuideItem[] = [
    {
        id: 'dashboard',
        icon: LayoutDashboard,
        title: 'Dashboard',
        href: '/espace',
        section: 'Général',
        summary: 'Vue d’ensemble : KPI, messages à traiter et prochains RDV.',
        steps: [
            'Consulte les indicateurs clés.',
            'Traite les messages non lus.',
            'Surveille les prochains événements.',
        ],
    },
    {
        id: 'cours',
        icon: BookOpen,
        title: 'Cours',
        href: '/admin/cours',
        section: 'Offre',
        summary: 'Parcours Skool : modules, disponibilité et liens d’accès.',
        steps: [
            'Crée un cours (titre, description, couverture).',
            'Ajoute les modules.',
            'Configure le lien Skool, puis publie.',
        ],
    },
    {
        id: 'contenus',
        icon: Video,
        title: 'Contenus',
        href: '/admin/contenus',
        section: 'Offre',
        summary: 'Médias gratuits ou payants du catalogue public.',
        steps: [
            'Ajoute un contenu avec couverture.',
            'Choisis gratuit / payant et la catégorie.',
            'Publie pour l’afficher sur le site.',
        ],
    },
    {
        id: 'evenements',
        icon: CalendarDays,
        title: 'Événements',
        href: '/admin/evenements',
        section: 'Communauté',
        summary: 'RDV (conférence, masterclass…) et inscriptions.',
        steps: [
            'Crée un RDV : type, date, lieu, accès.',
            'Publie-le sur l’accueil.',
            'Gère les inscrits depuis la fiche.',
        ],
    },
    {
        id: 'temoignages',
        icon: MessageSquareQuote,
        title: 'Témoignages',
        href: '/admin/temoignages',
        section: 'Communauté',
        summary: 'Avis clients affichés sur le site.',
        steps: [
            'Ajoute nom, rôle et citation.',
            'Publie pour le rendre visible.',
            'Modifie ou retire à tout moment.',
        ],
    },
    {
        id: 'messages',
        icon: Inbox,
        title: 'Messages',
        href: '/admin/contact',
        section: 'Communauté',
        summary: 'Messages reçus via le formulaire Contact.',
        steps: [
            'Ouvre un message pour le lire.',
            'Réponds par e-mail.',
            'Supprime si besoin.',
        ],
    },
    {
        id: 'newsletter',
        icon: Mail,
        title: 'Newsletter',
        href: '/admin/newsletter',
        section: 'Diffusion',
        summary: 'Campagnes e-mail et abonnés.',
        steps: [
            'Rédige sujet + contenu.',
            'Envoie aux abonnés.',
            'Gère la liste des inscrits.',
        ],
    },
    {
        id: 'publicite',
        icon: Megaphone,
        title: 'Publicité',
        href: '/admin/publicites',
        section: 'Diffusion',
        summary: 'Popups promotionnels sur le site.',
        steps: [
            'Ajoute image, titre et lien.',
            'Définis les dates (ou laisse illimité).',
            'Active / désactive la campagne.',
        ],
    },
    {
        id: 'equipe',
        icon: Users,
        title: 'Équipe',
        href: '/admin/collaborateurs',
        section: 'Administration',
        summary: 'Collaborateurs de l’espace admin.',
        steps: [
            'Invite par e-mail.',
            'Renvoie l’invitation si besoin.',
            'Active ou retire un accès.',
        ],
    },
    {
        id: 'utilisateurs',
        icon: UsersRound,
        title: 'Utilisateurs',
        href: '/admin/utilisateurs',
        section: 'Administration',
        summary: 'Comptes membres inscrits sur la plateforme.',
        steps: [
            'Consulte la liste.',
            'Active / désactive un compte.',
            'Supprime uniquement si nécessaire.',
        ],
    },
];

export default function AdminGuidePage() {
    const { auth } = usePage<PageProps>().props;
    const [activeId, setActiveId] = useState(GUIDE_ITEMS[0].id);
    const active = GUIDE_ITEMS.find((item) => item.id === activeId) ?? GUIDE_ITEMS[0];
    const Icon = active.icon;

    return (
        <AdminShell
            current="/admin/guide"
            title="Tuto"
            subtitle="Petit guide des onglets admin"
            user={auth.user}
        >
            <Head title="Tuto — Admin" />

            <div className="mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] border border-cocoa/[0.08] bg-white/90 shadow-sm">
                <div className="border-b border-cocoa/8 px-4 py-3 sm:px-5">
                    <p className="text-xs text-cocoa/50">Choisis un onglet pour voir à quoi il sert.</p>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {GUIDE_ITEMS.map((item) => {
                            const TabIcon = item.icon;
                            const selected = item.id === activeId;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveId(item.id)}
                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                        selected
                                            ? 'bg-cocoa text-sand'
                                            : 'border border-cocoa/10 bg-sand/40 text-cocoa/60 hover:border-cocoa/20 hover:text-cocoa'
                                    }`}
                                >
                                    <TabIcon size={12} />
                                    {item.title}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 sm:p-6"
                    >
                        <div className="flex items-start gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cocoa text-sand">
                                <Icon size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-honey">
                                    {active.section}
                                </p>
                                <h2 className="mt-0.5 text-lg font-semibold text-cocoa">{active.title}</h2>
                                <p className="mt-1 text-sm text-cocoa/60">{active.summary}</p>
                            </div>
                        </div>

                        <ol className="mt-5 space-y-2">
                            {active.steps.map((step, i) => (
                                <li key={step} className="flex gap-2.5 text-sm text-cocoa/70">
                                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-honey/15 text-[10px] font-semibold text-honey">
                                        {i + 1}
                                    </span>
                                    <span className="leading-relaxed">{step}</span>
                                </li>
                            ))}
                        </ol>

                        <a
                            href={active.href}
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-cocoa px-4 py-2 text-sm font-medium text-sand transition hover:bg-honey hover:text-cocoa"
                        >
                            Ouvrir
                            <ArrowRight size={14} />
                        </a>
                    </motion.div>
                </AnimatePresence>
            </div>
        </AdminShell>
    );
}
