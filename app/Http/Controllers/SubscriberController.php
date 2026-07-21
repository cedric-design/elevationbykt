<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'name' => ['nullable', 'string', 'max:100'],
        ]);

        $existing = Subscriber::where('email', $validated['email'])->first();

        if ($existing) {
            if ($existing->unsubscribed_at) {
                $existing->update([
                    'unsubscribed_at' => null,
                    'verified_at' => now(),
                ]);
                return response()->json(['message' => 'Vous êtes à nouveau abonné à notre newsletter.']);
            }
            return response()->json(['message' => 'Vous êtes déjà abonné.']);
        }

        Subscriber::create([
            'email' => $validated['email'],
            'name' => $validated['name'] ?? null,
            'verified_at' => now(),
        ]);

        return response()->json(['message' => 'Merci ! Vous êtes inscrit à notre newsletter.']);
    }

    public function unsubscribe(string $token)
    {
        $subscriber = Subscriber::where('token', $token)->first();

        if (!$subscriber) {
            return redirect('/')->with('error', 'Lien invalide.');
        }

        $subscriber->update(['unsubscribed_at' => now()]);

        return redirect('/')->with('success', 'Vous avez été désabonné de notre newsletter.');
    }
}
