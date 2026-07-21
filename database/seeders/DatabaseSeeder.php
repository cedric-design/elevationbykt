<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@elevation.test'],
            [
                'name' => 'Kadhy Touré',
                'password' => 'password',
                'role' => UserRole::Administrateur,
            ],
        );

        User::updateOrCreate(
            ['email' => 'cedric.djire89@gmail.com'],
            [
                'name' => 'Cedric Djire',
                'password' => 'CEDRIC12345',
                'role' => UserRole::Administrateur,
            ],
        );

        User::updateOrCreate(
            ['email' => 'client@elevation.test'],
            [
                'name' => 'Client Démo',
                'password' => 'password',
                'role' => UserRole::Client,
            ],
        );

        $testimonials = [
            ['name' => 'Aïcha K.', 'role' => 'Entrepreneure · Abidjan', 'quote' => "ÉLÉVATION a changé ma façon de voir mes projets. J'ai enfin osé lancer mon activité."],
            ['name' => 'Marie-Laure D.', 'role' => 'Cadre RH · Dakar', 'quote' => "Les masterclass sont d'une richesse incroyable. Kadhy transmet avec une sincérité rare."],
            ['name' => 'Fatou B.', 'role' => 'Étudiante · Bamako', 'quote' => 'Je me sens accompagnée, jamais seule. La communauté est vraiment motivante.'],
        ];

        foreach ($testimonials as $t) {
            Testimonial::firstOrCreate(['name' => $t['name']], $t);
        }
    }
}
