<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Mail\CollaboratorInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CollaboratorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/collaborators', [
            'collaborators' => User::where('role', UserRole::Administrateur->value)
                ->latest()
                ->get(['id', 'name', 'email', 'phone', 'created_at', 'email_verified_at', 'invitation_sent_at']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $token = Str::random(64);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => bcrypt(Str::random(32)),
            'role' => UserRole::Administrateur,
            'invitation_token' => $token,
            'invitation_sent_at' => now(),
        ]);

        $invitationUrl = url("/invitation/{$token}");

        Mail::to($user->email)->send(new CollaboratorInvitation($user, $invitationUrl));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Invitation envoyée à ' . $user->email]);

        return back();
    }

    public function resend(User $user): RedirectResponse
    {
        if (!$user->isAdmin()) {
            abort(403);
        }

        $token = Str::random(64);
        $user->update([
            'invitation_token' => $token,
            'invitation_sent_at' => now(),
        ]);

        $invitationUrl = url("/invitation/{$token}");

        Mail::to($user->email)->send(new CollaboratorInvitation($user, $invitationUrl));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Invitation renvoyée à ' . $user->email]);

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        if (!$user->isAdmin()) {
            abort(403);
        }

        if ($user->id === auth()->id()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Vous ne pouvez pas vous supprimer vous-même.']);
            return back();
        }

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Collaborateur supprimé.']);

        return back();
    }
}
