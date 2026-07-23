<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CourseAccessStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Content;
use App\Models\Course;
use App\Models\Event;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $stats = [
            'members' => User::count(),
            'clients' => User::where('role', UserRole::Client->value)->count(),
            'admins' => User::where('role', UserRole::Administrateur->value)->count(),
            'testimonials' => Testimonial::count(),
            'published' => Testimonial::where('is_published', true)->count(),
            'contents' => Content::count(),
            'contentsFree' => Content::where('type', 'free')->count(),
            'contentsPaid' => Content::where('type', 'paid')->count(),
            'contentsPublished' => Content::where('is_published', true)->count(),
            'courses' => Course::count(),
            'coursesPublished' => Course::where('is_published', true)->count(),
            'contactMessages' => ContactMessage::count(),
            'contactUnread' => ContactMessage::where('is_read', false)->count(),
            'events' => Event::count(),
            'eventsPublished' => Event::where('is_published', true)->count(),
            'visitorsToday' => 0,
            'revenue' => 0,
            'revenueTrend' => '+0%',
        ];

        $data = [
            'stats' => $stats,
            'isAdmin' => $isAdmin,
        ];

        if ($isAdmin) {
            $data['testimonials'] = Testimonial::latest()->take(5)->get();
            $data['courses'] = Course::withCount('modules')->latest()->take(5)->get(['id', 'title', 'is_published']);
            $data['unreadMessages'] = ContactMessage::query()
                ->where('is_read', false)
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'email', 'topic', 'message', 'created_at']);
            $data['upcomingEvents'] = Event::query()
                ->published()
                ->upcoming()
                ->withCount('registrations')
                ->orderBy('starts_at')
                ->take(4)
                ->get()
                ->map(fn (Event $event) => [
                    'id' => $event->id,
                    'title' => $event->title,
                    'type_label' => $event->type->label(),
                    'place' => $event->place,
                    'starts_at' => $event->starts_at?->toISOString(),
                    'registrations_count' => $event->registrations_count,
                    'access_mode_label' => $event->access_mode->label(),
                ]);
        } else {
            $availableCourses = Course::query()
                ->published()
                ->available()
                ->with('modules')
                ->orderBy('sort_order')
                ->latest()
                ->get();

            $accesses = $user->courseAccesses()
                ->with('course.modules')
                ->whereIn('status', [
                    CourseAccessStatus::Sent->value,
                    CourseAccessStatus::Active->value,
                    CourseAccessStatus::Pending->value,
                ])
                ->latest()
                ->get()
                ->keyBy('course_id');

            $data['availableCourses'] = $availableCourses->map(function (Course $course) use ($accesses) {
                $access = $accesses->get($course->id);

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'description' => $course->description,
                    'cover_image' => $course->cover_image,
                    'modules_count' => $course->modules->count(),
                    'has_invite_link' => filled($course->skool_invite_link),
                    'access' => $access ? [
                        'status' => $access->status->value,
                        'private_link' => $access->private_link,
                        'link_sent_at' => $access->link_sent_at?->toISOString(),
                    ] : null,
                ];
            })->values();

            $data['myCourses'] = $accesses
                ->filter(fn ($access) => $access->course && filled($access->private_link))
                ->map(fn ($access) => [
                    'id' => $access->course->id,
                    'title' => $access->course->title,
                    'cover_image' => $access->course->cover_image,
                    'private_link' => $access->private_link,
                    'status' => $access->status->value,
                    'link_sent_at' => $access->link_sent_at?->toISOString(),
                    'modules_count' => $access->course->modules->count(),
                ])
                ->values();

            $data['stats']['myCoursesCount'] = $data['myCourses']->count();
            $data['stats']['availableCoursesCount'] = $data['availableCourses']->count();
        }

        return Inertia::render('admin/dashboard', $data);
    }
}
