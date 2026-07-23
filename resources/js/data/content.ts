export const PROFILE = {
    name: 'Kadhy Touré',
    brand: 'ÉLÉVATION by Kadhy',
    realName: 'Touré Kadidjata',
    roles: ['Actrice', 'Productrice', 'Présentatrice NCI', 'Entrepreneuse'],
    tagline: 'Élève ta vie.',
    birth: '13 septembre · Bouaké, Côte d’Ivoire',
    show: 'Les Femmes d’Ici — NCI',
    company: 'Brown Angel Entertainment',
};

export const SKOOL_URL = 'https://www.skool.com/elevation-by-kadhy-t-4061';

export const HERO_COPY = {
    brand: 'ÉLÉVATION by Kadhy',
    headline: 'Élève ta vie.',
    intro:
        'Bienvenue dans un espace conçu pour celles et ceux qui souhaitent grandir, se reconstruire, développer leur potentiel et bâtir une vie plus alignée avec leurs valeurs.',
    ctaDiscover: 'Découvrir ÉLÉVATION',
    ctaJoin: 'Rejoindre la communauté',
};

export const STATS = [
    { n: '16+', l: 'Productions filmiques' },
    { n: '2021', l: 'Présentatrice principale NCI' },
    { n: 'NISA d’Or', l: 'Lauréate 2023' },
    { n: '2024', l: 'Autobiographie publiée' },
];

export const VISION_STORY = [
    'Élévation est né d’une conviction profonde : le véritable changement commence toujours à l’intérieur de soi.',
    'Après des années à accompagner, inspirer et transmettre à travers l’écran, Kadhy Touré a voulu créer plus qu’une plateforme de contenus : un espace vivant où l’on apprend, où l’on se relève, et où l’on avance ensemble.',
    'ÉLÉVATION rassemble spiritualité, discipline, leadership, relations et entrepreneuriat — pour transformer l’intention en action durable.',
];

export const ELEVATION_PILLARS = [
    {
        id: 'spiritualite',
        title: 'Spiritualité',
        icon: 'Sparkles',
        short: 'Foi, alignement et ancrage intérieur.',
        body: 'Retrouver un centre intérieur solide pour traverser les saisons de la vie avec clarté, paix et conviction.',
    },
    {
        id: 'dev-perso',
        title: 'Développement personnel',
        icon: 'Sprout',
        short: 'Conscience de soi et croissance continue.',
        body: 'Découvrir qui tu es vraiment, dépasser tes blocages et construire des habitudes qui te portent vers ta meilleure version.',
    },
    {
        id: 'leadership',
        title: 'Leadership',
        icon: 'Crown',
        short: 'Influence, présence et impact.',
        body: 'Apprendre à diriger avec authenticité — soi-même d’abord, puis les autres — pour créer un impact positif durable.',
    },
    {
        id: 'discipline',
        title: 'Discipline',
        icon: 'Target',
        short: 'Constance, focus et exécution.',
        body: 'Passer de la motivation à la méthode : routines, exigences saines et passage à l’action au quotidien.',
    },
    {
        id: 'finances',
        title: 'Finances',
        icon: 'Wallet',
        short: 'Clarté, maîtrise et abondance.',
        body: 'Comprendre ton rapport à l’argent, structurer tes finances et bâtir une relation saine avec la prospérité.',
    },
    {
        id: 'entrepreneuriat',
        title: 'Entrepreneuriat',
        icon: 'Rocket',
        short: 'Créer, lancer et faire grandir.',
        body: 'Des outils concrets pour entreprendre avec vision, courage et stratégie — du premier pas à la croissance.',
    },
    {
        id: 'relations',
        title: 'Relations',
        icon: 'Heart',
        short: 'Limites, amour et communication.',
        body: 'Cultiver des liens sains : avec soi, en couple, en famille et en communauté, sans se perdre.',
    },
    {
        id: 'sante',
        title: 'Santé et bien-être',
        icon: 'Leaf',
        short: 'Corps, énergie et équilibre.',
        body: 'Prendre soin de ton énergie physique et mentale pour soutenir une vie élevée sur le long terme.',
    },
    {
        id: 'estime',
        title: 'Estime de soi',
        icon: 'Gem',
        short: 'Valeur intérieure et affirmation.',
        body: 'Reconstruire une estime solide, oser ta voix et incarner ta valeur sans te comparer.',
    },
];

export const PROGRAMS = [
    {
        id: 'start',
        title: 'Élévation Start',
        blurb: 'Le parcours d’entrée pour poser les bases de ta transformation personnelle.',
        image: '/kadhy-studio.png',
        cta: 'Accéder au programme',
        href: SKOOL_URL,
    },
    {
        id: 'premium',
        title: 'Élévation Premium',
        blurb: 'Un accompagnement plus profond, plus exigeant, pour accélérer ton élévation.',
        image: '/kadhy-masterclass.png',
        cta: 'Accéder au programme',
        href: SKOOL_URL,
    },
    {
        id: 'challenges',
        title: 'Challenges',
        blurb: 'Des défis collectifs pour passer à l’action et ancrer de nouvelles habitudes.',
        image: '/kadhy-bienvenue.png',
        cta: 'Accéder au programme',
        href: SKOOL_URL,
    },
    {
        id: 'masterclass',
        title: 'Masterclass',
        blurb: 'Des sessions intensives avec Kadhy et des experts pour approfondir un sujet clé.',
        image: '/kadhy-masterclass.png',
        cta: 'Accéder au programme',
        href: SKOOL_URL,
    },
    {
        id: 'cercle',
        title: 'Cercle privé',
        blurb: 'Un espace exclusif d’échanges, de soutien et de progression entre membres engagés.',
        image: '/kadhy-studio.png',
        cta: 'Accéder au programme',
        href: SKOOL_URL,
    },
    {
        id: 'conferences',
        title: 'Conférences',
        blurb: 'Des rencontres inspirantes pour élargir ta vision et rencontrer la communauté.',
        image: '/kadhy-bienvenue.png',
        cta: 'Accéder au programme',
        href: SKOOL_URL,
    },
];

export const QUIZ_QUESTIONS = [
    {
        id: 'q1',
        question: 'Qu’est-ce qui te pousse le plus à t’élever aujourd’hui ?',
        options: [
            { label: 'Me reconstruire intérieurement', scores: { start: 2, premium: 1 } },
            { label: 'Passer à l’action concrètement', scores: { challenges: 2, start: 1 } },
            { label: 'Accélérer ma carrière / mon business', scores: { premium: 2, masterclass: 1 } },
            { label: 'Rejoindre une communauté exigeante', scores: { cercle: 2, premium: 1 } },
        ],
    },
    {
        id: 'q2',
        question: 'Où en es-tu dans ton parcours ?',
        options: [
            { label: 'Je commence tout juste', scores: { start: 3 } },
            { label: 'J’ai déjà des bases, je veux aller plus loin', scores: { premium: 2, masterclass: 1 } },
            { label: 'Je veux un défi pour me discipliner', scores: { challenges: 3 } },
            { label: 'Je cherche inspiration et rencontres', scores: { conferences: 2, cercle: 1 } },
        ],
    },
    {
        id: 'q3',
        question: 'Quel format te correspond le mieux ?',
        options: [
            { label: 'Un parcours structuré étape par étape', scores: { start: 2, premium: 2 } },
            { label: 'Des masterclass ciblées', scores: { masterclass: 3 } },
            { label: 'Un challenge sur une période courte', scores: { challenges: 3 } },
            { label: 'Un cercle d’entraide régulier', scores: { cercle: 3 } },
        ],
    },
];

export const QUIZ_RESULTS: Record<string, { title: string; blurb: string; programId: string }> = {
    start: {
        title: 'Élévation Start',
        blurb: 'Tu as besoin d’un socle clair et bienveillant pour démarrer ton élévation avec méthode.',
        programId: 'start',
    },
    premium: {
        title: 'Élévation Premium',
        blurb: 'Tu es prêt·e pour un niveau d’exigence plus élevé et une transformation plus profonde.',
        programId: 'premium',
    },
    challenges: {
        title: 'Challenges',
        blurb: 'Tu progresses mieux avec un cadre collectif, un rythme et un objectif concret.',
        programId: 'challenges',
    },
    masterclass: {
        title: 'Masterclass',
        blurb: 'Tu veux des enseignements ciblés et puissants pour débloquer un sujet précis.',
        programId: 'masterclass',
    },
    cercle: {
        title: 'Cercle privé',
        blurb: 'Tu as besoin d’appartenance, d’échanges sincères et d’une communauté qui t’élève.',
        programId: 'cercle',
    },
    conferences: {
        title: 'Conférences',
        blurb: 'Tu te nourris d’inspiration, de rencontres et d’expériences collectives marquantes.',
        programId: 'conferences',
    },
};

export const EVENTS = [
    {
        id: 'conf-abidjan',
        type: 'Conférence',
        title: 'Élève ta vie — Abidjan',
        date: 'À venir',
        place: 'Abidjan',
        blurb: 'Une soirée inspirante pour clarifier ta vision et rencontrer la communauté.',
    },
    {
        id: 'masterclass-live',
        type: 'Masterclass',
        title: 'Masterclass live avec Kadhy',
        date: 'Prochainement',
        place: 'En ligne',
        blurb: 'Une session immersive pour transformer une intention en plan d’action.',
    },
    {
        id: 'retraite',
        type: 'Retraite',
        title: 'Retraite ÉLÉVATION',
        date: 'Sur invitation',
        place: 'Côte d’Ivoire',
        blurb: 'Un temps hors du monde pour te recentrer, te reconnecter et repartir transformé·e.',
    },
    {
        id: 'rencontre',
        type: 'Rencontre',
        title: 'Rencontre communauté',
        date: 'Mensuelle',
        place: 'Skool / Live',
        blurb: 'Des moments réguliers pour échanger, célébrer les avancées et rester ancré·e.',
    },
];

export const FREE_RESOURCES = [
    {
        id: 'guide-elevation',
        type: 'Guide PDF',
        title: 'Les 7 clés pour s’élever',
        blurb: 'Un guide pratique pour poser les premières bases de ta transformation.',
    },
    {
        id: 'video-intro',
        type: 'Vidéo',
        title: 'Bienvenue dans ÉLÉVATION',
        blurb: 'Le message de Kadhy pour comprendre l’esprit et la promesse de la communauté.',
    },
    {
        id: 'podcast',
        type: 'Podcast',
        title: 'Paroles d’élévation',
        blurb: 'Des échanges inspirants sur la foi, la discipline et le passage à l’action.',
    },
    {
        id: 'article',
        type: 'Article',
        title: 'De l’intention à l’action',
        blurb: 'Pourquoi la plupart abandonnent — et comment créer une dynamique durable.',
    },
];

export const COURSES = [
    {
        id: 'femmes-dici',
        title: 'Les Femmes d’Ici',
        kind: 'Émission TV · NCI',
        length: 'Du lundi au vendredi',
        level: 'Grand public',
        blurb: 'L’émission féminine phare de la NCI : témoignages, société et inspiration, présentée par Kadhy.',
        tag: 'Populaire',
    },
    {
        id: 'masterclass-actorat',
        title: 'Masterclass — L’art de jouer',
        kind: 'Cours vidéo',
        length: '6 modules · 3h20',
        level: 'Débutant → Intermédiaire',
        blurb: 'De l’audition au plateau : méthode de jeu, présence caméra et direction d’acteur par une actrice primée.',
        tag: 'Cours',
    },
    {
        id: 'produire-film',
        title: 'Produire son premier film',
        kind: 'Programme',
        length: '8 modules · 5h',
        level: 'Intermédiaire',
        blurb: 'Retour d’expérience sur « L’Interprète » : financer, tourner et distribuer un long métrage en Afrique.',
        tag: 'Programme',
    },
    {
        id: 'transforme-reves',
        title: 'Transforme tes rêves en succès',
        kind: 'Atelier + livre',
        length: '4 sessions',
        level: 'Tous niveaux',
        blurb: 'L’atelier tiré de son autobiographie : mindset, discipline et parcours d’une self-made ivoirienne.',
        tag: 'Nouveau',
    },
    {
        id: 'interprete',
        title: 'L’Interprète I & II',
        kind: 'Films · à la demande',
        length: '2 longs métrages',
        level: 'Public',
        blurb: 'Premiers longs métrages ivoiriens bilingues (français/anglais), records d’entrées à Abidjan.',
        tag: 'Cinéma',
    },
    {
        id: 'marabout',
        title: 'Mon Marabout Chéri',
        kind: 'Film · à la demande',
        length: 'Long métrage',
        level: 'Public',
        blurb: '70 500 entrées dans la sous-région. Multiple lauréat, dont le NISA d’Or 2023.',
        tag: 'Primé',
    },
];

export const TIMELINE = [
    { y: '2008', t: 'Débuts au cinéma', d: 'Rôle de Nafir dans « Le Fruit non mûr », production ivoiro-nigériane.' },
    { y: '2012', t: '« Brouteur.com »', d: 'Le rôle d’Émeraude confirme son talent d’actrice accomplie.' },
    { y: '2016', t: 'Brown Angel & « L’Interprète »', d: 'Elle fonde sa maison de production et signe le 1er long métrage ivoirien bilingue.' },
    { y: '2018', t: '« L’Interprète 2 »', d: 'Premier film ivoirien diffusé à bord d’un avion Air France, avec John Dumelo.' },
    { y: '2019', t: 'Fondation Kadhy Touré', d: 'Création de sa fondation d’aide aux femmes et personnes vulnérables.' },
    { y: '2020', t: 'Arrivée sur la NCI', d: 'Co-animatrice de « Les Femmes d’Ici », dès 13h05 en semaine.' },
    { y: '2021', t: 'Présentatrice principale', d: 'Elle devient la figure de l’émission, l’une des plus suivies d’Afrique francophone.' },
    { y: '2023', t: 'NISA d’Or', d: '« Mon Marabout Chéri » rafle plusieurs prix, dont le prestigieux NISA d’Or.' },
    { y: '2024', t: 'Autobiographie', d: 'Publication de « Transforme tes rêves en succès ».' },
];

export const BIO = [
    'Kadhy Touré, de son vrai nom Touré Kadidjata, est une actrice, productrice, présentatrice de télévision et entrepreneuse ivoirienne née le 13 septembre à Bouaké, d’un père militaire. Très jeune, elle nourrit le rêve de devenir actrice.',
    'Titulaire d’une Licence en journalisme et communication et d’un diplôme d’interprète anglais-français — obtenu après cinq années de formation au Ghana — elle conjugue rigueur intellectuelle et créativité artistique.',
    'En 2016, elle fonde sa maison de production, Brown Angel Entertainment, et produit « L’Interprète », premier long métrage ivoirien bilingue. Entrepreneuse, elle lance aussi la gamme de produits naturels Finess.',
    'Engagée, elle crée en 2019 la Fondation Kadhy Touré pour venir en aide aux femmes et aux personnes vulnérables. En 2021, elle devient la présentatrice principale de « Les Femmes d’Ici » sur la NCI.',
];

export const ABOUT_KADHY = [
    "Actrice, productrice, présentatrice, auteure et entrepreneure, Kadhy Touré est avant tout une femme de vision, de résilience et de transmission.",
    "Au fil de son parcours, elle a appris que l\u2019élévation ne se résume pas à la réussite visible. Elle naît aussi des épreuves surmontées, des décisions difficiles, de la foi, de la discipline, de la connaissance de soi et du courage de recommencer.",
    "À travers ses expériences personnelles et professionnelles, Kadhy Touré a inspiré des millions de personnes en Afrique francophone. Son histoire est celle d\u2019une femme qui a dû se réinventer, dépasser ses peurs, affirmer sa voix et choisir de construire une vie en accord avec ses aspirations profondes.",
    "Avec ÉLÉVATION, elle souhaite désormais transmettre les enseignements, les outils, les rencontres et les méthodes qui permettent de ne plus simplement rêver d\u2019une autre vie, mais de commencer véritablement à la bâtir.",
    "ÉLÉVATION est l\u2019aboutissement d\u2019une conviction forte : chacun porte en lui la capacité de grandir, de se relever, de se transformer et d\u2019avoir un impact positif sur sa propre vie et sur celle des autres.",
];

export const VISION_INTRO = [
    "ÉLÉVATION by Kadhy est une plateforme de transformation personnelle, professionnelle et intérieure, pensée pour accompagner celles et ceux qui souhaitent reprendre le pouvoir sur leur vie et devenir une version plus consciente, plus forte et plus accomplie d\u2019eux-mêmes.",
    "Notre vision est de bâtir une communauté durable dans laquelle chaque membre peut apprendre, évoluer, être accompagné et trouver les ressources nécessaires pour passer de l\u2019intention à l\u2019action.",
    "ÉLÉVATION ne veut pas être une simple bibliothèque de vidéos ou une formation que l\u2019on termine avant de l\u2019oublier.",
    "Nous voulons créer un espace vivant, inspirant et exigeant, où chaque mois apporte de nouveaux enseignements, de nouvelles rencontres, de nouveaux défis et de nouvelles possibilités de transformation.",
    "À travers des masterclass, des programmes pratiques, des experts, des témoignages, des challenges et une communauté engagée, ÉLÉVATION accompagne chaque membre dans les différents domaines de sa vie :",
];

export const VISION_PILLARS = [
    'Confiance et connaissance de soi',
    'Foi et alignement intérieur',
    'Relations et limites personnelles',
    'Discipline et passage à l\u2019action',
    'Carrière, entrepreneuriat et finances',
    'Leadership, influence et impact',
];

export const VISION_CLOSING = [
    "Notre ambition est de faire d\u2019ÉLÉVATION une référence africaine et francophone du développement personnel et professionnel, profondément connectée aux réalités, aux défis et aux aspirations de notre époque.",
    "Un espace où l\u2019on ne vient pas seulement chercher de la motivation, mais où l\u2019on reçoit des outils concrets pour évoluer durablement.",
    "Parce que s\u2019élever, ce n\u2019est pas devenir quelqu\u2019un d\u2019autre.",
    "C\u2019est devenir pleinement la personne que l\u2019on était destinée à être.",
];

export const TESTIMONIALS = [
    {
        name: 'Aïcha K.',
        role: 'Entrepreneure · Abidjan',
        quote: "ÉLÉVATION a changé ma façon de voir mes projets. J\u2019ai enfin osé lancer mon activité après des années d\u2019hésitation.",
    },
    {
        name: 'Marie-Laure D.',
        role: 'Cadre RH · Dakar',
        quote: "Les masterclass sont d\u2019une richesse incroyable. Kadhy transmet avec une sincérité qui donne envie de passer à l\u2019action.",
    },
    {
        name: 'Fatou B.',
        role: 'Étudiante · Bamako',
        quote: "Je me sens accompagnée, jamais seule. La communauté est bienveillante et vraiment motivante au quotidien.",
    },
    {
        name: 'Grâce N.',
        role: 'Coach · Lomé',
        quote: "Enfin un espace africain francophone qui parle de développement personnel avec nos réalités. Merci ÉLÉVATION.",
    },
    {
        name: 'Sandrine T.',
        role: 'Créatrice de contenu · Yaoundé',
        quote: "Chaque mois j\u2019apprends quelque chose de concret. Ce n\u2019est pas de la motivation vide, ce sont de vrais outils.",
    },
    {
        name: 'Awa S.',
        role: 'Infirmière · Conakry',
        quote: "J\u2019ai repris confiance en moi et j\u2019ose enfin poser mes limites. Une transformation intérieure profonde.",
    },
];

export const NAV = [
    { to: '/', label: 'Accueil' },
    { to: '/bio', label: 'Bio & Parcours' },
    { to: '/contenus', label: 'Contenus' },
    { to: '/galerie', label: 'Galerie' },
    { to: '/contact', label: 'Contact' },
];
