<?php

namespace App\Enums;

enum UserRole: string
{
    case Client = 'client';
    case Administrateur = 'administrateur';

    public function label(): string
    {
        return match ($this) {
            self::Client => 'Client',
            self::Administrateur => 'Administrateur',
        };
    }
}
