<?php

namespace App\Http\Controllers;

use App\Enums\EventAccessMode;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EventRegistrationController extends Controller
{
    public function store(Request $request, Event $event): JsonResponse
    {
        if (! $event->is_published) {
            throw ValidationException::withMessages([
                'event' => 'Cet événement n\'est pas disponible.',
            ]);
        }

        if ($event->access_mode === EventAccessMode::Invitation) {
            throw ValidationException::withMessages([
                'event' => 'Cet événement est sur invitation uniquement. Contacte-nous pour y accéder.',
            ]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180'],
            'phone' => ['nullable', 'string', 'max:40'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($event->isFull()) {
            throw ValidationException::withMessages([
                'event' => 'Désolé, cet événement est complet.',
            ]);
        }

        $existing = EventRegistration::query()
            ->where('event_id', $event->id)
            ->where('email', $validated['email'])
            ->exists();

        if ($existing) {
            return response()->json([
                'message' => 'Tu es déjà inscrit·e à cet événement.',
            ]);
        }

        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $request->user()?->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Inscription confirmée ! À très bientôt.',
        ]);
    }
}
