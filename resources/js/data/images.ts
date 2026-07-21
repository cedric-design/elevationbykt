// Vraies photos publiques de Kadhy Touré (sourcées).
// NB: ces images sont chargées depuis les sites de presse (hotlink). Si un site
// bloque le hotlink, le composant SmartImage affiche un dégradé de repli.

export const IMG = {
    portrait: 'https://www.exclusif.net/photo/art/grande/85657157-61025607.jpg?v=1737208665',
    hero: 'https://www.exclusif.net/photo/art/grande/85657157-61025608.jpg?v=1737208678',
    scene1: 'https://www.exclusif.net/photo/art/grande/85657157-61025609.jpg?v=1737208690',
    scene2: 'https://www.exclusif.net/photo/art/grande/85657157-61025610.jpg?v=1737208741',
    egerie: 'https://www.afrique-sur7.fr/wp-content/uploads/2025/08/kadhy-toure.webp',
};

export const HERO = {
    image: IMG.hero,
    video: '/media/hero.mp4',
};

export const GALLERY = [
    { src: IMG.hero, caption: 'Portrait presse', credit: 'Exclusif.net' },
    { src: IMG.portrait, caption: 'Actrice & présentatrice', credit: 'Exclusif.net' },
    { src: IMG.egerie, caption: 'Égérie Hollandame (2025)', credit: 'Afrique-sur7' },
    { src: IMG.scene1, caption: 'En représentation', credit: 'Exclusif.net' },
    { src: IMG.scene2, caption: 'Moment public', credit: 'Exclusif.net' },
];
