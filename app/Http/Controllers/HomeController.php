<?php

namespace App\Http\Controllers;

use App\Models\Content;
use App\Models\ContentCategory;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('welcome', [
            'testimonials' => Testimonial::where('is_published', true)->latest()->get(),
            'contents' => Content::with('category')
                ->where('is_published', true)
                ->latest()
                ->get(),
            'categories' => ContentCategory::orderBy('sort_order')->get(),
            'isAuthenticated' => $request->user() !== null,
            'isAdmin' => $request->user()?->isAdmin() ?? false,
        ]);
    }
}
