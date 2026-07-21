<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\ContentCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/contents', [
            'contents' => Content::with('category')->latest()->get(),
            'categories' => ContentCategory::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'type' => ['required', 'in:free,paid'],
            'price' => ['nullable', 'integer', 'min:0'],
            'category_id' => ['nullable'],
            'skool_link' => ['nullable', 'string', 'max:500'],
            'skool_course_id' => ['nullable', 'string', 'max:100'],
            'is_published' => ['boolean'],
            'is_featured' => ['boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['price'] = $validated['type'] === 'paid' ? ($validated['price'] ?? 0) : 0;
        $validated['category_id'] = !empty($validated['category_id']) ? $validated['category_id'] : null;

        Content::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Contenu créé avec succès.']);

        return back();
    }

    public function update(Request $request, Content $content): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'type' => ['sometimes', 'in:free,paid'],
            'price' => ['nullable', 'integer', 'min:0'],
            'category_id' => ['nullable'],
            'skool_link' => ['nullable', 'string', 'max:500'],
            'skool_course_id' => ['nullable', 'string', 'max:100'],
            'is_published' => ['boolean'],
            'is_featured' => ['boolean'],
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }
        
        $validated['category_id'] = !empty($validated['category_id']) ? $validated['category_id'] : null;

        $content->update($validated);

        return back();
    }

    public function togglePublish(Content $content): RedirectResponse
    {
        $content->update(['is_published' => !$content->is_published]);

        return back();
    }

    public function destroy(Content $content): RedirectResponse
    {
        $content->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Contenu supprimé.']);

        return back();
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:20'],
        ]);

        ContentCategory::create($validated);

        return back();
    }

    public function destroyCategory(ContentCategory $category): RedirectResponse
    {
        $category->delete();

        return back();
    }
}
