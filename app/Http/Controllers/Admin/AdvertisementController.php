<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdvertisementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/advertisements', [
            'advertisements' => Advertisement::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'image' => ['required', 'string'],
            'link' => ['nullable', 'url', 'max:500'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        Advertisement::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicité créée.']);

        return back();
    }

    public function update(Request $request, Advertisement $advertisement): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'image' => ['sometimes', 'string'],
            'link' => ['nullable', 'url', 'max:500'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        $advertisement->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicité mise à jour.']);

        return back();
    }

    public function toggleActive(Advertisement $advertisement): RedirectResponse
    {
        $advertisement->update(['is_active' => !$advertisement->is_active]);

        $status = $advertisement->is_active ? 'activée' : 'désactivée';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Publicité {$status}."]);

        return back();
    }

    public function destroy(Advertisement $advertisement): RedirectResponse
    {
        $advertisement->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicité supprimée.']);

        return back();
    }
}
