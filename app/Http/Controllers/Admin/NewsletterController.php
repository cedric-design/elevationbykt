<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterMail;
use App\Models\Newsletter;
use App\Models\Subscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/newsletter', [
            'newsletters' => Newsletter::with('sender')->latest()->get(),
            'subscribers' => Subscriber::latest()->get(),
            'stats' => [
                'total' => Subscriber::count(),
                'active' => Subscriber::active()->count(),
                'unsubscribed' => Subscriber::whereNotNull('unsubscribed_at')->count(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'template' => ['required', 'string', 'in:default,minimal,elegant'],
        ]);

        Newsletter::create([
            ...$validated,
            'sent_by' => auth()->id(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Brouillon enregistré.']);

        return back();
    }

    public function update(Request $request, Newsletter $newsletter): RedirectResponse
    {
        if ($newsletter->isSent()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Cette newsletter a déjà été envoyée.']);
            return back();
        }

        $validated = $request->validate([
            'subject' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'template' => ['sometimes', 'string', 'in:default,minimal,elegant'],
        ]);

        $newsletter->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Newsletter mise à jour.']);

        return back();
    }

    public function send(Newsletter $newsletter): RedirectResponse
    {
        if ($newsletter->isSent()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Cette newsletter a déjà été envoyée.']);
            return back();
        }

        $subscribers = Subscriber::active()->get();
        $count = 0;

        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->queue(new NewsletterMail($newsletter, $subscriber));
                $count++;
            } catch (\Exception $e) {
                continue;
            }
        }

        $newsletter->update([
            'sent_at' => now(),
            'sent_count' => $count,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Newsletter envoyée à {$count} abonnés."]);

        return back();
    }

    public function destroy(Newsletter $newsletter): RedirectResponse
    {
        $newsletter->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Newsletter supprimée.']);

        return back();
    }

    public function destroySubscriber(Subscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();

        return back();
    }
}
