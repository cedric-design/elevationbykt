<?php

namespace App\Enums;

enum CourseAccessStatus: string
{
    case Pending = 'pending';
    case Sent = 'sent';
    case Active = 'active';
    case Revoked = 'revoked';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'En attente',
            self::Sent => 'Envoyé',
            self::Active => 'Actif',
            self::Revoked => 'Révoqué',
        };
    }
}
