<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function show(string $token): Response
    {
        $user = User::where('invitation_token', $token)
            ->whereNotNull('invitation_sent_at')
            ->where('invitation_sent_at', '>', now()->subHours(48))
            ->first();

        if (!$user) {
            return Inertia::render('invitation', [
                'valid' => false,
                'token' => $token,
                'name' => null,
                'email' => null,
            ]);
        }

        return Inertia::render('invitation', [
            'valid' => true,
            'token' => $token,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function accept(Request $request, string $token): JsonResponse
    {
        $user = User::where('invitation_token', $token)
            ->whereNotNull('invitation_sent_at')
            ->where('invitation_sent_at', '>', now()->subHours(48))
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Lien d\'invitation invalide ou expiré.'], 422);
        }

        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
            'invitation_token' => null,
            'invitation_sent_at' => null,
            'email_verified_at' => now(),
        ]);

        Auth::login($user);

        return response()->json(['redirect' => '/espace']);
    }
}
