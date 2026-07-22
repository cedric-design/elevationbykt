<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\Content;
use App\Models\ContentCategory;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request, ?string $slug = null): Response
    {
        $data = [
            'testimonials' => Testimonial::where('is_published', true)->latest()->get(),
            'contents' => Content::with('category')
                ->where('is_published', true)
                ->latest()
                ->get(),
            'categories' => ContentCategory::orderBy('sort_order')->get(),
            'advertisement' => Advertisement::active()->latest()->first(),
            'isAuthenticated' => $request->user() !== null,
            'isAdmin' => $request->user()?->isAdmin() ?? false,
        ];

        if ($slug) {
            $content = Content::with('category')
                ->where('slug', $slug)
                ->where('is_published', true)
                ->first();
            
            $data['currentContent'] = $content;
        }

        return Inertia::render('welcome', $data);
    }
}
