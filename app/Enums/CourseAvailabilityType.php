<?php

namespace App\Enums;

enum CourseAvailabilityType: string
{
    case Indefinite = 'indefinite';
    case Period = 'period';

    public function label(): string
    {
        return match ($this) {
            self::Indefinite => 'Indéfinie',
            self::Period => 'Période',
        };
    }
}
