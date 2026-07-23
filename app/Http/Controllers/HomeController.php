<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\Content;
use App\Models\ContentCategory;
use App\Models\Course;
use App\Models\Event;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request, ?string $slug = null): Response
    {
        $user = $request->user();

        $courses = Course::query()
            ->published()
            ->available()
            ->with('modules')
            ->orderBy('sort_order')
            ->latest()
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'description' => $course->description,
                'cover_image' => $course->cover_image,
                'has_invite_link' => filled($course->skool_invite_link),
                'modules_count' => $course->modules->count(),
                'modules' => $course->modules->map(fn ($m) => [
                    'id' => $m->id,
                    'title' => $m->title,
                    'description' => $m->description,
                    'sort_order' => $m->sort_order,
                ])->values(),
            ]);

        $data = [
            'testimonials' => Testimonial::where('is_published', true)->latest()->get(),
            'contents' => Content::with('category')
                ->where('is_published', true)
                ->latest()
                ->get(),
            'courses' => $courses,
            'events' => Event::query()
                ->published()
                ->upcoming()
                ->withCount('registrations')
                ->orderBy('starts_at')
                ->get()
                ->map(fn (Event $event) => [
                    'id' => $event->id,
                    'slug' => $event->slug,
                    'title' => $event->title,
                    'type' => $event->type->value,
                    'type_label' => $event->type->label(),
                    'description' => $event->description,
                    'starts_at' => $event->starts_at?->toISOString(),
                    'ends_at' => $event->ends_at?->toISOString(),
                    'place' => $event->place,
                    'access_mode' => $event->access_mode->value,
                    'access_mode_label' => $event->access_mode->label(),
                    'capacity' => $event->capacity,
                    'registrations_count' => $event->registrations_count,
                    'is_full' => $event->isFull(),
                    'can_register' => $event->acceptsPublicRegistration(),
                ]),
            'categories' => ContentCategory::orderBy('sort_order')->get(),
            'advertisement' => Advertisement::active()->latest()->first(),
            'isAuthenticated' => $user !== null,
            'isAdmin' => $user?->isAdmin() ?? false,
            'unlockedCourseIds' => $user
                ? $user->courseAccesses()
                    ->whereIn('status', ['sent', 'active', 'pending'])
                    ->whereNotNull('private_link')
                    ->pluck('course_id')
                    ->values()
                    ->all()
                : [],
        ];

        if ($slug) {
            $content = Content::with('category')
                ->where('slug', $slug)
                ->where('is_published', true)
                ->first();

            $data['currentContent'] = $content;
            $data['currentCourse'] = $courses->firstWhere('slug', $slug);
        }

        return Inertia::render('welcome', $data);
    }
}
