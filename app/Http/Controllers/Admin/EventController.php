<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EventAccessMode;
use App\Enums\EventType;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        $events = Event::query()
            ->withCount('registrations')
            ->latest('starts_at')
            ->get()
            ->map(fn (Event $event) => $this->serializeEvent($event));

        return Inertia::render('admin/events', [
            'events' => $events,
            'types' => collect(EventType::cases())->map(fn (EventType $t) => [
                'value' => $t->value,
                'label' => $t->label(),
            ])->values(),
            'accessModes' => collect(EventAccessMode::cases())->map(fn (EventAccessMode $m) => [
                'value' => $m->value,
                'label' => $m->label(),
            ])->values(),
            'stats' => [
                'total' => Event::count(),
                'published' => Event::where('is_published', true)->count(),
                'registrations' => EventRegistration::count(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateEvent($request);
        $validated['slug'] = $this->uniqueSlug($validated['title']);
        $validated['created_by'] = $request->user()->id;
        $this->normalizeEvent($validated);

        Event::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Événement créé.']);

        return back();
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $validated = $this->validateEvent($request);

        if ($validated['title'] !== $event->title) {
            $validated['slug'] = $this->uniqueSlug($validated['title'], $event->id);
        }

        $this->normalizeEvent($validated);
        $event->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Événement mis à jour.']);

        return back();
    }

    public function togglePublish(Event $event): RedirectResponse
    {
        $event->update(['is_published' => ! $event->is_published]);

        return back();
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Événement supprimé.']);

        return back();
    }

    public function registrations(Event $event): Response
    {
        $registrations = $event->registrations()
            ->latest()
            ->get()
            ->map(fn (EventRegistration $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'email' => $r->email,
                'phone' => $r->phone,
                'notes' => $r->notes,
                'user_id' => $r->user_id,
                'created_at' => $r->created_at?->toISOString(),
            ]);

        return Inertia::render('admin/event-registrations', [
            'event' => $this->serializeEvent($event->loadCount('registrations')),
            'registrations' => $registrations,
        ]);
    }

    public function storeRegistration(Request $request, Event $event): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180'],
            'phone' => ['nullable', 'string', 'max:40'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $exists = $event->registrations()->where('email', $validated['email'])->exists();
        if ($exists) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Cet e-mail est déjà inscrit.']);

            return back();
        }

        if ($event->isFull()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Capacité atteinte.']);

            return back();
        }

        $event->registrations()->create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Inscription ajoutée.']);

        return back();
    }

    public function destroyRegistration(Event $event, EventRegistration $registration): RedirectResponse
    {
        abort_unless($registration->event_id === $event->id, 404);

        $registration->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Inscription supprimée.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateEvent(Request $request): array
    {
        $request->merge([
            'capacity' => $request->filled('capacity') ? $request->input('capacity') : null,
            'ends_at' => $request->filled('ends_at') ? $request->input('ends_at') : null,
        ]);

        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(EventType::values())],
            'description' => ['nullable', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'place' => ['required', 'string', 'max:255'],
            'access_mode' => ['required', Rule::in(EventAccessMode::values())],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function normalizeEvent(array &$validated): void
    {
        if (array_key_exists('capacity', $validated) && $validated['capacity'] === '') {
            $validated['capacity'] = null;
        }

        if (array_key_exists('ends_at', $validated) && $validated['ends_at'] === '') {
            $validated['ends_at'] = null;
        }

        $validated['is_published'] = (bool) ($validated['is_published'] ?? false);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'evenement';
        $slug = $base;
        $i = 1;

        while (
            Event::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeEvent(Event $event): array
    {
        return [
            'id' => $event->id,
            'title' => $event->title,
            'slug' => $event->slug,
            'type' => $event->type->value,
            'type_label' => $event->type->label(),
            'description' => $event->description,
            'starts_at' => $event->starts_at?->format('Y-m-d\TH:i'),
            'starts_at_iso' => $event->starts_at?->toISOString(),
            'ends_at' => $event->ends_at?->format('Y-m-d\TH:i'),
            'place' => $event->place,
            'access_mode' => $event->access_mode->value,
            'access_mode_label' => $event->access_mode->label(),
            'capacity' => $event->capacity,
            'is_published' => $event->is_published,
            'sort_order' => $event->sort_order,
            'registrations_count' => $event->registrations_count ?? $event->registrations()->count(),
            'is_full' => $event->isFull(),
            'created_at' => $event->created_at?->toISOString(),
        ];
    }
}
