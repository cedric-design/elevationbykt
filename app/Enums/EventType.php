<?php

namespace App\Enums;

enum EventType: string
{
    case Conference = 'conference';
    case Masterclass = 'masterclass';
    case Retraite = 'retraite';
    case Rencontre = 'rencontre';
    case Atelier = 'atelier';
    case Autre = 'autre';

    public function label(): string
    {
        return match ($this) {
            self::Conference => 'Conférence',
            self::Masterclass => 'Masterclass',
            self::Retraite => 'Retraite',
            self::Rencontre => 'Rencontre',
            self::Atelier => 'Atelier',
            self::Autre => 'Autre',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
