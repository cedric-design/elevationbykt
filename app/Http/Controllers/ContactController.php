<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180'],
            'topic' => ['required', 'string', 'in:partenariat,presse,evenement,masterclass,autre'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        ContactMessage::create($validated);

        return response()->json([
            'message' => 'Merci ! Ton message a bien été envoyé. Nous te répondrons bientôt.',
        ]);
    }
}
