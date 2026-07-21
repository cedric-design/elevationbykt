<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/testimonials', [
            'testimonials' => Testimonial::latest()->get(),
        ]);
    }

    public function store(StoreTestimonialRequest $request): RedirectResponse
    {
        Testimonial::create([
            'name' => $request->validated('name'),
            'role' => $request->validated('role'),
            'quote' => $request->validated('quote'),
            'is_published' => $request->boolean('is_published', true),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Témoignage créé.']);

        return back();
    }

    public function update(StoreTestimonialRequest $request, Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update([
            'name' => $request->validated('name'),
            'role' => $request->validated('role'),
            'quote' => $request->validated('quote'),
            'is_published' => $request->boolean('is_published', true),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Témoignage modifié.']);

        return back();
    }

    public function togglePublish(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(['is_published' => !$testimonial->is_published]);

        return back();
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Témoignage supprimé.']);

        return back();
    }
}
