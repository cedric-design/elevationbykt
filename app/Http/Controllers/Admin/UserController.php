<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/users', [
            'users' => User::where('role', UserRole::Client->value)
                ->latest()
                ->get(['id', 'name', 'email', 'phone', 'created_at', 'email_verified_at', 'is_active']),
            'stats' => [
                'total' => User::where('role', UserRole::Client->value)->count(),
                'active' => User::where('role', UserRole::Client->value)->where('is_active', true)->count(),
                'inactive' => User::where('role', UserRole::Client->value)->where('is_active', false)->count(),
            ],
        ]);
    }

    public function toggleActive(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            abort(403);
        }

        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'activé' : 'désactivé';
        Inertia::flash('toast', ['type' => 'success', 'message' => "Utilisateur {$status}."]);

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            abort(403);
        }

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Utilisateur supprimé.']);

        return back();
    }
}
