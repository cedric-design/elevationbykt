<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Content;
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
            $data['contents'] = Content::with('category')->latest()->take(5)->get();
        }

        return Inertia::render('admin/dashboard', $data);
    }
}
