<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/contact-messages', [
            'messages' => ContactMessage::latest()->get(),
            'stats' => [
                'total' => ContactMessage::count(),
                'unread' => ContactMessage::where('is_read', false)->count(),
            ],
        ]);
    }

    public function markRead(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->markAsRead();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Message marqué comme lu.']);

        return back();
    }

    public function markUnread(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->markAsUnread();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Message marqué comme non lu.']);

        return back();
    }

    public function destroy(ContactMessage $contactMessage): RedirectResponse
    {
        $contactMessage->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Message supprimé.']);

        return back();
    }
}
