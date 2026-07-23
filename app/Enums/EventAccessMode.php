<?php

namespace App\Enums;

enum EventAccessMode: string
{
    case Open = 'open';
    case Invitation = 'invitation';

    public function label(): string
    {
        return match ($this) {
            self::Open => 'Ouverte',
            self::Invitation => 'Sur invitation',
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
